# School Competition Platform

A multi-tenant platform that enables schools to create, manage, and participate in academic competitions.

## Overview

This platform allows schools to host competitions and control their visibility to other schools. It implements a multi-tenant architecture where each school is a separate tenant with isolated data and permissions.

## Setup Instructions

### Prerequisites

- Node.js 18+ and npm
- Git

### Installation

1. Clone the repository:
   \`\`\`bash
   git clone https://github.com/EsraaSaad298/school-competition-platform.git
   cd school-competition-platform
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Start the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Key Features

- **Multi-tenant Architecture**: Each school is a separate tenant with isolated data
- **Role-based Access Control**: Different permissions for administrators and students
- **Competition Visibility Controls**: Schools can set competitions as:
  - Private (only visible to the host school)
  - Restricted (visible to selected schools)
  - Public (visible to all schools)
- **Student Registration**: Students can register for competitions they have access to
- **Analytics Dashboard**: Performance metrics for both administrators and students
- **Competition Management**: Create, view, and manage competitions

## Multi-tenant Design Decisions

### Tenant Isolation

The platform implements tenant isolation at the data access layer. Each competition has an `ownerTenantId` that identifies which school created it, and a `visibility` property that controls which other schools can see it.

For restricted visibility competitions, an `allowedTenantIds` array stores the IDs of schools that have access.

### Data Access Control

All data access goes through the `data-service.ts` file, which enforces tenant isolation:

\`\`\`typescript
// Get competitions visible to a specific tenant based on user role
export async function getVisibleCompetitions(
  currentSchoolId: string,
  userRole: UserRole = "admin"
): Promise<Competition[]> {
  return competitions.filter((competition) => {
    // Admin can see all competitions from their school
    if (competition.ownerTenantId === currentSchoolId) {
      return true;
    }

    // Public competitions are visible to everyone
    if (competition.visibility === "public") {
      return true;
    }

    // Restricted competitions are visible to allowed tenants
    if (
      competition.visibility === "restricted" &&
      competition.allowedTenantIds?.includes(currentSchoolId)
    ) {
      return true;
    }

    // Private competitions are only visible to the owner
    return false;
  });
}
\`\`\`

### Authentication and Authorization

The platform uses a custom authentication provider that stores the current school (tenant) and user in both localStorage and cookies. This ensures that both client and server components have access to the current tenant context.

## User Roles and Permissions

### Administrator

- Create and manage competitions for their school
- View analytics for competitions hosted by their school
- Control visibility settings for competitions
- View all competitions accessible to their school

### Student

- View competitions available to their school
- Register for competitions
- View personal performance analytics
- Track competition history and results

## Technical Implementation

### Frontend

- **Next.js 14** with App Router
- **React** for UI components
- **Tailwind CSS** for styling
- **shadcn/ui** for UI components
- **Recharts** for data visualization

### State Management

- React Context API for authentication state
- Server Components for data fetching
- Server Actions for mutations

### Data Flow

1. Server components fetch data based on the current tenant context
2. Data is filtered at the service layer based on tenant visibility rules
3. UI components render only the data the current user has permission to see
4. Server Actions enforce tenant isolation for mutations

## Architecture Decisions

### Mock Data Approach

The current implementation uses in-memory data structures to simulate a database. This allows for rapid prototyping and demonstration of the multi-tenant concepts without requiring a database setup.

In a production environment, this would be replaced with a proper database with appropriate indexes and constraints to enforce tenant isolation.

### Server-Side Filtering

All data filtering based on tenant access is done on the server side to ensure security. Even if a client attempts to request data they shouldn't have access to, the server-side filtering will prevent unauthorized access.

### Role-Based UI

The UI adapts based on the user's role, showing different views and options for administrators and students. This is implemented using conditional rendering based on the current user's role.

### Dialog Scrolling Implementation

The competition creation dialog uses a fixed height with internal scrolling to ensure that the form is always accessible, even when many schools are selected. This approach ensures that:

1. The dialog header and footer remain fixed in place
2. The form content scrolls independently
3. The action buttons are always visible at the bottom of the dialog

This implementation uses CSS Flexbox with `overflow-y: auto` on the content area to create a scrollable region within the fixed-height dialog.

## Future Enhancements

- **Database Integration**: Replace in-memory storage with a proper database
- **Team Competitions**: Support for team-based competitions
- **Notifications**: Email and in-app notifications for competition updates
- **Advanced Analytics**: More detailed performance metrics and visualizations
- **Competition Categories**: Enhanced categorization and filtering
- **Results Management**: Record and display competition results and winners
