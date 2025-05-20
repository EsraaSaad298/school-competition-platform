import type { School, Competition, User, Registration, StudentPerformance } from "./types"

// Mock schools (tenants)
export const schools: School[] = [
  { id: "school-1", name: "Westfield High School", domain: "westfield.edu" },
  { id: "school-2", name: "Eastside Academy", domain: "eastside.edu" },
  { id: "school-3", name: "Northridge Prep", domain: "northridge.edu" },
]

// Mock competitions with different visibility settings
export const competitions: Competition[] = [
  {
    id: "comp-1",
    title: "Annual Math Olympiad",
    description: "A challenging mathematics competition for high school students",
    date: "2023-11-15",
    createdAt: "2023-09-01",
    ownerTenantId: "school-1",
    visibility: "public",
    category: "Mathematics",
    location: "Main Auditorium",
    maxParticipants: 100,
  },
  {
    id: "comp-2",
    title: "Westfield Science Fair",
    description: "Showcase your scientific discoveries and innovations",
    date: "2023-12-05",
    createdAt: "2023-09-15",
    ownerTenantId: "school-1",
    visibility: "private",
    category: "Science",
    location: "Science Building",
    maxParticipants: 50,
  },
  {
    id: "comp-3",
    title: "Eastside Debate Tournament",
    description: "Sharpen your argumentation and public speaking skills",
    date: "2023-11-20",
    createdAt: "2023-08-25",
    ownerTenantId: "school-2",
    visibility: "restricted",
    allowedTenantIds: ["school-2", "school-3"],
    category: "Debate",
    location: "Lecture Hall B",
    maxParticipants: 30,
  },
  {
    id: "comp-4",
    title: "Regional Coding Challenge",
    description: "Test your programming skills against other schools",
    date: "2023-12-10",
    createdAt: "2023-10-01",
    ownerTenantId: "school-2",
    visibility: "public",
    category: "Computer Science",
    location: "Computer Lab",
    maxParticipants: 40,
  },
  {
    id: "comp-5",
    title: "Northridge Chess Tournament",
    description: "Strategic thinking and planning in our annual chess competition",
    date: "2023-11-25",
    createdAt: "2023-09-10",
    ownerTenantId: "school-3",
    visibility: "private",
    category: "Chess",
    location: "Student Center",
    maxParticipants: 20,
  },
  {
    id: "comp-6",
    title: "Inter-School Art Exhibition",
    description: "Showcase your artistic talents across multiple schools",
    date: "2023-12-15",
    createdAt: "2023-10-15",
    ownerTenantId: "school-3",
    visibility: "public",
    category: "Art",
    location: "Art Gallery",
    maxParticipants: 60,
  },
]

// Generate mock users for each school
export const generateMockUsers = (schoolId: string): User[] => {
  const school = schools.find((s) => s.id === schoolId)
  if (!school) return []

  return [
    {
      id: `admin-${schoolId}`,
      email: `admin@${school.domain}`,
      name: `${school.name} Admin`,
      role: "admin",
      schoolId: school.id,
    },
    {
      id: `student-${schoolId}`,
      email: `student@${school.domain}`,
      name: `${school.name} Student`,
      role: "student",
      schoolId: school.id,
    },
  ]
}

// Mock registrations
export const registrations: Registration[] = [
  {
    id: "reg-1",
    userId: "student-school-1",
    competitionId: "comp-1",
    registeredAt: "2023-09-10",
    status: "registered",
  },
  {
    id: "reg-2",
    userId: "student-school-1",
    competitionId: "comp-2",
    registeredAt: "2023-09-20",
    status: "registered",
  },
  {
    id: "reg-3",
    userId: "student-school-2",
    competitionId: "comp-1",
    registeredAt: "2023-09-15",
    status: "registered",
  },
  {
    id: "reg-4",
    userId: "student-school-2",
    competitionId: "comp-4",
    registeredAt: "2023-10-05",
    status: "registered",
  },
  {
    id: "reg-5",
    userId: "student-school-3",
    competitionId: "comp-1",
    registeredAt: "2023-09-12",
    status: "registered",
  },
  {
    id: "reg-6",
    userId: "student-school-3",
    competitionId: "comp-3",
    registeredAt: "2023-09-01",
    status: "registered",
  },
]

// Mock student performance data
export const studentPerformance: StudentPerformance[] = [
  {
    userId: "student-school-1",
    competitionsEntered: 5,
    competitionsWon: 2,
    competitionsAttended: 5,
    skillLevel: 85,
    recentPerformance: 90,
    strengths: ["Mathematics", "Science"],
    weaknesses: ["Art", "Debate"],
  },
  {
    userId: "student-school-2",
    competitionsEntered: 3,
    competitionsWon: 1,
    competitionsAttended: 3,
    skillLevel: 75,
    recentPerformance: 80,
    strengths: ["Computer Science", "Debate"],
    weaknesses: ["Mathematics"],
  },
  {
    userId: "student-school-3",
    competitionsEntered: 4,
    competitionsWon: 0,
    competitionsAttended: 4,
    skillLevel: 65,
    recentPerformance: 70,
    strengths: ["Chess", "Art"],
    weaknesses: ["Science", "Computer Science"],
  },
]

// Helper function to get student performance
export const getStudentPerformance = (userId: string): StudentPerformance => {
  const performance = studentPerformance.find((p) => p.userId === userId)
  if (performance) return performance

  // Return default performance if not found
  return {
    userId,
    competitionsEntered: 0,
    competitionsWon: 0,
    competitionsAttended: 0,
    skillLevel: 50,
    recentPerformance: 50,
    strengths: [],
    weaknesses: [],
  }
}

// Helper function to calculate winning likelihood
export const calculateWinningLikelihood = (userId: string, competitionId: string): number => {
  const competition = competitions.find((c) => c.id === competitionId)
  const performance = getStudentPerformance(userId)

  if (!competition) return 0

  // Base likelihood on student's skill level
  let likelihood = performance.skillLevel

  // Adjust based on recent performance
  likelihood = (likelihood + performance.recentPerformance) / 2

  // Adjust based on strengths and weaknesses
  if (performance.strengths.includes(competition.category)) {
    likelihood += 15
  }

  if (performance.weaknesses.includes(competition.category)) {
    likelihood -= 15
  }

  // Adjust based on competition history
  likelihood += performance.competitionsWon * 5

  // Cap between 0 and 100
  return Math.min(Math.max(Math.round(likelihood), 0), 100)
}

// Helper function to get registrations for a competition
export const getCompetitionRegistrations = (competitionId: string): Registration[] => {
  return registrations.filter((r) => r.competitionId === competitionId)
}

// Helper function to get registrations for a user
export const getUserRegistrations = (userId: string): Registration[] => {
  return registrations.filter((r) => r.userId === userId)
}

// Helper function to check if a user is registered for a competition
export const isUserRegistered = (userId: string, competitionId: string): boolean => {
  return registrations.some((r) => r.userId === userId && r.competitionId === competitionId)
}
