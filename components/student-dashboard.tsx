import type { User, School, Registration, StudentPerformance } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Award, Calendar, CheckCircle, Clock, Trophy } from "lucide-react"

interface StudentDashboardProps {
  student: User
  school: School
  registrations: Array<Registration & { competition?: any }>
  performance: StudentPerformance
}

export function StudentDashboard({ student, school, registrations, performance }: StudentDashboardProps) {
  // Calculate upcoming competitions
  const upcomingCompetitions = registrations.filter(
    (reg) => reg.competition && new Date(reg.competition.date) > new Date(),
  )

  // Calculate past competitions
  const pastCompetitions = registrations.filter(
    (reg) => reg.competition && new Date(reg.competition.date) <= new Date(),
  )

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Performance Overview</CardTitle>
            <CardDescription>Your competition statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Skill Level</span>
                  <span className="text-sm font-medium">{performance.skillLevel}%</span>
                </div>
                <Progress value={performance.skillLevel} className="h-2" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted/30 p-3 rounded-md">
                  <div className="text-xs text-muted-foreground">Competitions</div>
                  <div className="text-2xl font-bold">{performance.competitionsEntered}</div>
                </div>
                <div className="bg-primary/10 p-3 rounded-md">
                  <div className="text-xs text-muted-foreground">Wins</div>
                  <div className="text-2xl font-bold">{performance.competitionsWon}</div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2">Your Strengths</h4>
                <div className="flex flex-wrap gap-2">
                  {performance.strengths.map((strength) => (
                    <Badge key={strength} variant="outline">
                      {strength}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Upcoming Competitions</CardTitle>
            <CardDescription>Competitions you're registered for</CardDescription>
          </CardHeader>
          <CardContent>
            {upcomingCompetitions.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground text-sm">
                You haven't registered for any upcoming competitions
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingCompetitions.slice(0, 3).map((reg) => (
                  <div key={reg.id} className="flex items-start gap-3 border-b pb-3 last:border-0">
                    <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <div className="font-medium">{reg.competition?.title}</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {reg.competition?.date}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-4">
              <Link href="/competitions">
                <Button variant="outline" size="sm" className="w-full">
                  Browse Competitions
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Achievement Summary</CardTitle>
            <CardDescription>Your competition results</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3 bg-primary/5 p-3 rounded-md">
                <Trophy className="h-8 w-8 text-primary" />
                <div>
                  <div className="text-sm font-medium">Win Rate</div>
                  <div className="text-2xl font-bold">
                    {performance.competitionsEntered
                      ? Math.round((performance.competitionsWon / performance.competitionsEntered) * 100)
                      : 0}
                    %
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2">Recent Achievements</h4>
                <div className="space-y-2">
                  {performance.competitionsWon > 0 ? (
                    <>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>
                          Won {performance.competitionsWon} out of {performance.competitionsEntered} competitions
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Award className="h-4 w-4 text-amber-500" />
                        <span>Achieved {performance.skillLevel}% skill rating</span>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-2 text-muted-foreground text-sm">
                      Keep participating to earn achievements!
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Competition History</CardTitle>
          <CardDescription>All competitions you've registered for</CardDescription>
        </CardHeader>
        <CardContent>
          {registrations.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              You haven't registered for any competitions yet
            </div>
          ) : (
            <div className="border rounded-md">
              <table className="min-w-full divide-y divide-border">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Competition
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {registrations.map((reg) => (
                    <tr key={reg.id}>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">{reg.competition?.title || "Unknown"}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">{reg.competition?.date || "Unknown"}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">{reg.competition?.category || "Unknown"}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">
                        <Badge
                          variant={
                            reg.status === "winner" ? "default" : reg.status === "completed" ? "secondary" : "outline"
                          }
                        >
                          {reg.status === "winner"
                            ? "Winner"
                            : reg.status === "completed"
                              ? "Completed"
                              : reg.status === "attended"
                                ? "Attended"
                                : "Registered"}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">
                        {reg.competition && (
                          <Link href={`/competitions/${reg.competition.id}`}>
                            <Button variant="outline" size="sm">
                              View
                            </Button>
                          </Link>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
