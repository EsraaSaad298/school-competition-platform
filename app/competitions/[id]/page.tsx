import { getCompetition, getCompetitionRegistrations, calculateWinningLikelihood } from "@/lib/data-service"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { Header } from "@/components/header"
import { CompetitionDetails } from "@/components/competition-details"
import { AdminCompetitionView } from "@/components/admin-competition-view"
import { StudentCompetitionView } from "@/components/student-competition-view"
import type { User } from "@/lib/types"

export default async function CompetitionPage({ params }: { params: { id: string } }) {
  const { id } = params

  // Get the current school and user from cookies
  const cookieStore = cookies()
  const currentSchoolCookie = cookieStore.get("currentSchool")?.value
  const currentUserCookie = cookieStore.get("currentUser")?.value

  if (!currentSchoolCookie || !currentUserCookie) {
    redirect("/login")
  }

  let currentSchool, currentUser
  try {
    currentSchool = JSON.parse(currentSchoolCookie)
    currentUser = JSON.parse(currentUserCookie) as User
  } catch (error) {
    // If we can't parse the cookies, redirect to login
    redirect("/login")
  }

  // Get the competition
  const competition = await getCompetition(id)
  if (!competition) {
    redirect("/competitions")
  }

  // Get registrations for this competition
  const registrations = await getCompetitionRegistrations(id)

  // For students, calculate winning likelihood
  let winningLikelihood = 0
  if (currentUser.role === "student") {
    winningLikelihood = await calculateWinningLikelihood(currentUser.id, id)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-6">
        <CompetitionDetails competition={competition} isOwner={competition.ownerTenantId === currentSchool.id} />

        {currentUser.role === "admin" ? (
          <AdminCompetitionView
            competition={competition}
            registrations={registrations}
            isOwner={competition.ownerTenantId === currentSchool.id}
          />
        ) : (
          <StudentCompetitionView
            competition={competition}
            winningLikelihood={winningLikelihood}
            userId={currentUser.id}
          />
        )}
      </main>
    </div>
  )
}
