# Multi-Tenant Architecture Design

This document outlines the architectural approach for implementing the School Competition Platform as a multi-tenant system that scales to thousands of schools while maintaining data isolation and proper access controls.

## Data Model & Tenant Isolation

### Core Entities

- **Tenants (Schools)**: Each school is a separate tenant with a unique identifier
- **Users**: Associated with a specific tenant and assigned roles
- **Competitions**: Owned by a tenant with configurable visibility
- **Registrations**: Track student participation in competitions

### Database Schema

\`\`\`sql
-- Tenants table
CREATE TABLE schools (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  domain TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Users table with tenant association
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'student')),
  school_id UUID NOT NULL REFERENCES schools(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Competitions with tenant ownership and visibility
CREATE TABLE competitions (
  id UUID PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  owner_tenant_id UUID NOT NULL REFERENCES schools(id),
  visibility TEXT NOT NULL CHECK (visibility IN ('private', 'restricted', 'public')),
  category TEXT NOT NULL,
  location TEXT NOT NULL,
  max_participants INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- For restricted visibility competitions
CREATE TABLE competition_allowed_schools (
  competition_id UUID REFERENCES competitions(id),
  school_id UUID REFERENCES schools(id),
  PRIMARY KEY (competition_id, school_id)
);

-- Registrations
CREATE TABLE registrations (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id),
  competition_id UUID NOT NULL REFERENCES competitions(id),
  status TEXT NOT NULL DEFAULT 'registered',
  registered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (user_id, competition_id)
);
\`\`\`

## Tenant Isolation Strategy

We implement a **Discriminator Column** approach where each record includes a tenant identifier (school_id). This provides:

1. **Logical Isolation**: Data is separated by tenant ID
2. **Query Filtering**: All queries include tenant filtering
3. **Efficient Indexing**: Indexes on tenant columns for performance

## Access Control & Visibility

### Competition Visibility

- **Private**: Only visible to the owner school
- **Restricted**: Visible to specific schools (using the junction table)
- **Public**: Visible to all schools

### Implementation

\`\`\`typescript
// Example query middleware for tenant isolation
const getTenantFilteredCompetitions = async (schoolId: string, userRole: string) => {
  const query = supabase
    .from('competitions')
    .select('*, competition_allowed_schools(school_id)')
    .or(`owner_tenant_id.eq.${schoolId}, visibility.eq.public, and(visibility.eq.restricted,competition_allowed_schools.school_id.eq.${schoolId})`);
  
  return await query;
};
\`\`\`

## Role-Based Access Control

### User Roles

- **School Admin**: Can create and manage competitions for their school
- **Student**: Can view and register for competitions

### Permission Enforcement

1. **Database RLS Policies**: Supabase Row Level Security for base protection
2. **API Middleware**: Additional validation layer in API routes
3. **UI Conditional Rendering**: Components adapt based on user role

## Scalability Considerations

### Database Optimization

- **Indexes**: On tenant_id, visibility, and frequently queried columns
- **Partitioning**: By tenant for large deployments (thousands of schools)
- **Connection Pooling**: To handle concurrent requests efficiently

### API Layer

- **Caching**: Redis-based caching for frequently accessed data
- **Rate Limiting**: Per-tenant rate limits to prevent abuse
- **Query Optimization**: Pagination and selective column fetching

### Frontend Performance

- **Server Components**: Leverage Next.js server components for data-heavy pages
- **Incremental Static Regeneration**: For public competition listings
- **Client-Side Caching**: SWR/React Query for optimistic updates

## Implementation Stack

### Frontend

- **Next.js**: App Router for server components and routing
- **React**: Component-based UI with role-based rendering
- **SWR/React Query**: Data fetching with caching and revalidation
- **TanStack Table**: For efficient data tables with sorting/filtering

### Backend

- **Next.js API Routes/Server Actions**: For simple deployments
- **Express.js**: For more complex API requirements
- **Middleware**: Tenant context extraction and validation

### Database

- **Postgres**: Primary data store with proper indexing
- **Supabase**: For managed Postgres with RLS policies
- **Redis**: For caching and rate limiting

### Authentication

- **NextAuth.js/Supabase Auth**: User authentication
- **JWT with Tenant Context**: Include tenant ID in auth tokens
- **Custom Middleware**: Extract and validate tenant context

## Deployment Architecture

- **Vercel/Netlify**: For Next.js frontend hosting
- **Supabase**: For database and authentication
- **Edge Caching**: For public competition listings
- **Serverless Functions**: For API endpoints with auto-scaling
