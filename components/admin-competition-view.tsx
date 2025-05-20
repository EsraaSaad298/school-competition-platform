"use client"

import type { Competition, Registration } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { generateMockUsers } from "@/lib/mock-data"
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts"
import { schools } from "@/lib/mock-data"

interface AdminCompetitionViewProps {
  competition: Competition
  registrations: Registration[]
  isOwner: boolean
}

export function AdminCompetitionView({ competition, registrations, isOwner }: AdminCompetitionViewProps) {
  // Calculate registration stats
  const totalRegistrations = registrations.length
  const maxParticipants = competition.maxParticipants || 100
  const registrationPercentage = Math.min(Math.round((totalRegistrations / maxParticipants) * 100), 100)

  // Get registered students from each school
  const schoolCounts = registrations.reduce(
    (acc, reg) => {
      // Extract school ID from user ID (format: "student-school-1")
      const userId = reg.userId
      const schoolId = userId.split("-")[1] + "-" + userId.split("-")[2] // Get "school-1" format
      acc[schoolId] = (acc[schoolId] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  // Prepare data for pie chart
  const pieData = Object.entries(schoolCounts).map(([schoolId, count]) => {
    // Find the school name from our schools data
    const school = schools.find((s) => s.id === schoolId)
    const schoolName = school ? school.name : `Unknown School (${schoolId})`

    return {
      name: schoolName,
      value: count,
    }
  })

  // Prepare data for bar chart (student performance)
  const barData = [
    { name: "High Performers", students: Math.floor(totalRegistrations * 0.3) },
    { name: "Average Performers", students: Math.floor(totalRegistrations * 0.5) },
    { name: "Low Performers", students: Math.floor(totalRegistrations * 0.2) },
  ]

  // Colors for pie chart
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Registration Statistics</CardTitle>
          <CardDescription>
            {totalRegistrations} students registered out of {maxParticipants} maximum spots
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Registration Progress</span>
                <span className="text-sm font-medium">{registrationPercentage}%</span>
              </div>
              <Progress value={registrationPercentage} className="h-2" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <h4 className="text-sm font-medium mb-4">Registrations by School</h4>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-4">Student Performance Distribution</h4>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barData}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="students" fill="#8884d8" name="Number of Students" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Registered Students</CardTitle>
          <CardDescription>List of students registered for this competition</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md">
            <table className="min-w-full divide-y divide-border">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    School
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Registration Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Winning Likelihood
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {registrations.map((registration) => {
                  // Extract school ID from user ID (format: "student-school-1")
                  const parts = registration.userId.split("-")
                  const schoolId = parts.length >= 3 ? `${parts[1]}-${parts[2]}` : "unknown"

                  // Find the school
                  const school = schools.find((s) => s.id === schoolId)
                  const schoolName = school ? school.name : `Unknown School (${schoolId})`

                  const mockUsers = generateMockUsers(schoolId)
                  const student = mockUsers.find((user) => user.id === registration.userId)

                  return (
                    <tr key={registration.id}>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">{student?.name || "Unknown Student"}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">{schoolName}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">{registration.registeredAt}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">
                        <div className="flex items-center">
                          <div className="w-24 bg-muted rounded-full h-2.5 mr-2">
                            <div
                              className="bg-primary h-2.5 rounded-full"
                              style={{ width: `${Math.floor(Math.random() * 100)}%` }}
                            ></div>
                          </div>
                          <span>{Math.floor(Math.random() * 100)}%</span>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
