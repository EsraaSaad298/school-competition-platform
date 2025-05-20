import { Header } from "@/components/header"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { StudentDashboard } from "@/components/student-dashboard"
import { getVisibleCompetitions, getUserRegistrations, getStudentPerformance } from "@/lib/data-service"

export default async function DashboardPage() {
  // Get the current school and user from cookies
  const cookieStore = cookies()
  const currentSchoolCookie = cookieStore.get("currentSchool")?.value
  const currentUserCookie = cookieStore.get("currentUser")?.value

  if (!currentSchoolCookie || !currentUserCookie) {
    redirect("/login")
  }

  const currentSchool = JSON.parse(currentSchoolCookie)
  const currentUser = JSON.parse(currentUserCookie)

  // Only students have a dashboard
  if (currentUser.role !== "student") {
    redirect("/competitions")
  }

  // Get student's registrations
  const registrations = await getUserRegistrations(currentUser.id)

  // Get all visible competitions
  const allCompetitions = await getVisibleCompetitions(currentSchool.id, currentUser.role)

  // Get student performance data
  const performance = await getStudentPerformance(currentUser.id)

  // Get registered competitions with details
  const registeredCompetitions = registrations.map((reg) => {
    const competition = allCompetitions.find((comp) => comp.id === reg.competitionId)
    return {
      ...reg,
      competition,
    }
  })

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-6">
        <h1 className="text-3xl font-bold mb-6">Student Dashboard</h1>

        <StudentDashboard
          student={currentUser}
          school={currentSchool}
          registrations={registeredCompetitions}
          performance={performance}
        />
      </main>
    </div>
  )
}
