import { getVisibleCompetitions } from "@/lib/data-service"
import { Header } from "@/components/header"
import { SchoolInfoCard } from "@/components/school-info-card"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { CreateCompetitionButton } from "@/components/create-competition-button"
import { FilteredCompetitions } from "@/components/filtered-competitions"
import type { User } from "@/lib/types"

export default async function CompetitionsPage() {
  // Get the current school and user from cookies
  const cookieStore = cookies()
  const currentSchoolCookie = cookieStore.get("currentSchool")
  const currentUserCookie = cookieStore.get("currentUser")

  if (!currentSchoolCookie?.value || !currentUserCookie?.value) {
    redirect("/login")
  }

  let currentSchool, currentUser
  try {
    currentSchool = JSON.parse(currentSchoolCookie.value)
    currentUser = JSON.parse(currentUserCookie.value) as User
  } catch (error) {
    // If we can't parse the cookies, redirect to login
    redirect("/login")
  }

  // Get competitions visible to the current school based on user role
  const competitions = await getVisibleCompetitions(currentSchool.id, currentUser.role)

  // Count competitions owned by the current school
  const ownedCompetitionsCount = competitions.filter((comp) => comp.ownerTenantId === currentSchool.id).length

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-6">
        <h1 className="text-3xl font-bold mb-6">Competition Dashboard</h1>

        <SchoolInfoCard
          school={currentSchool}
          competitionCount={ownedCompetitionsCount}
          userRole={currentUser.role}
          userName={currentUser.name}
        />

        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-medium">Available Competitions</h3>
            <p className="text-sm text-muted-foreground">
              Showing {competitions.length} competitions visible to{" "}
              {currentUser.role === "admin" ? "your school" : "you"}
            </p>
          </div>
          {currentUser.role === "admin" && <CreateCompetitionButton />}
        </div>

        <FilteredCompetitions
          competitions={competitions}
          currentSchoolId={currentSchool.id}
          userRole={currentUser.role}
        />
      </main>
    </div>
  )
}
