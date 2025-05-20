"use server"

import type { Competition, UserRole, Registration } from "./types"
import {
  competitions as initialCompetitions,
  registrations as initialRegistrations,
  calculateWinningLikelihood as mockCalculateWinningLikelihood,
  getStudentPerformance as mockGetStudentPerformance,
} from "./mock-data"
import { revalidatePath } from "next/cache"

// Use global variables to persist data between server actions
// In a real app, this would be a database
let competitions: Competition[] = [...initialCompetitions]
let registrations: Registration[] = [...initialRegistrations]

// Get competitions visible to a specific tenant based on user role
export async function getVisibleCompetitions(
  currentSchoolId: string,
  userRole: UserRole = "admin",
): Promise<Competition[]> {
  // This is where tenant isolation and visibility filtering happens
  return competitions.filter((competition) => {
    // Admin can see all competitions from their school
    if (competition.ownerTenantId === currentSchoolId) {
      return true
    }

    // Public competitions are visible to everyone
    if (competition.visibility === "public") {
      return true
    }

    // Restricted competitions are visible to allowed tenants
    if (competition.visibility === "restricted" && competition.allowedTenantIds?.includes(currentSchoolId)) {
      return true
    }

    // Private competitions are only visible to the owner
    // Students can't see private competitions from other schools
    return false
  })
}

// Get a specific competition by ID
export async function getCompetition(competitionId: string): Promise<Competition | null> {
  const competition = competitions.find((c) => c.id === competitionId)
  return competition || null
}

// Create a new competition (only available to admins)
export async function createCompetition(competition: Omit<Competition, "id">): Promise<Competition> {
  // Generate a simple ID
  const newCompetition: Competition = {
    ...competition,
    id: `comp-${Date.now()}`,
  }

  // Add to our in-memory store
  competitions = [...competitions, newCompetition]

  // Revalidate the competitions page to show the new competition
  revalidatePath("/competitions")

  return newCompetition
}

// Register a student for a competition
export async function registerForCompetition(userId: string, competitionId: string): Promise<Registration> {
  // Check if already registered
  if (isUserRegistered(userId, competitionId)) {
    throw new Error("Already registered for this competition")
  }

  // Create new registration
  const newRegistration: Registration = {
    id: `reg-${Date.now()}`,
    userId,
    competitionId,
    registeredAt: new Date().toISOString().split("T")[0],
    status: "registered",
  }

  // Add to our in-memory store
  registrations = [...registrations, newRegistration]

  // Revalidate paths
  revalidatePath("/competitions")
  revalidatePath(`/competitions/${competitionId}`)
  revalidatePath("/dashboard")

  return newRegistration
}

// Check if a user is registered for a competition
export async function isUserRegistered(userId: string, competitionId: string): Promise<boolean> {
  return registrations.some((r) => r.userId === userId && r.competitionId === competitionId)
}

// Get registrations for a user
export async function getUserRegistrations(userId: string): Promise<Registration[]> {
  return registrations.filter((r) => r.userId === userId)
}

// Get registrations for a competition
export async function getCompetitionRegistrations(competitionId: string): Promise<Registration[]> {
  return registrations.filter((r) => r.competitionId === competitionId)
}

// Calculate winning likelihood for a student in a competition
export async function calculateWinningLikelihood(userId: string, competitionId: string): Promise<number> {
  return mockCalculateWinningLikelihood(userId, competitionId)
}

// Get student performance data
export async function getStudentPerformance(userId: string) {
  return mockGetStudentPerformance(userId)
}
