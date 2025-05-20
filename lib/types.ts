export interface School {
  id: string
  name: string
  domain: string
}

export type UserRole = "admin" | "student"

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  schoolId: string
}

export type CompetitionVisibility = "private" | "restricted" | "public"

export interface Competition {
  id: string
  title: string
  description: string
  date: string
  createdAt: string
  ownerTenantId: string // The school that created the competition
  visibility: CompetitionVisibility
  allowedTenantIds?: string[] // For restricted visibility
  category: string
  location: string
  maxParticipants?: number
}

export interface Registration {
  id: string
  userId: string
  competitionId: string
  registeredAt: string
  status: "registered" | "attended" | "completed" | "winner"
}

export interface StudentPerformance {
  userId: string
  competitionsEntered: number
  competitionsWon: number
  competitionsAttended: number
  skillLevel: number // 1-100
  recentPerformance: number // 1-100
  strengths: string[]
  weaknesses: string[]
}
