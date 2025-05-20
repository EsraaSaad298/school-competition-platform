"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/components/auth-provider"
import { schools, generateMockUsers } from "@/lib/mock-data"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserIcon, School, User } from "lucide-react"
import type { UserRole } from "@/lib/types"

export default function LoginPage() {
  const router = useRouter()
  const { login, isAuthenticated } = useAuth()
  const [selectedSchool, setSelectedSchool] = useState<string>("")
  const [role, setRole] = useState<UserRole>("admin")
  const [email, setEmail] = useState<string>("")
  const [name, setName] = useState<string>("")

  // If already authenticated, redirect to competitions
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/competitions")
    }
  }, [isAuthenticated, router])

  // Update email and name when school or role changes
  useEffect(() => {
    if (selectedSchool) {
      const school = schools.find((s) => s.id === selectedSchool)
      if (school) {
        setEmail(role === "admin" ? `admin@${school.domain}` : `student@${school.domain}`)
        setName(role === "admin" ? `${school.name} Admin` : `${school.name} Student`)
      }
    }
  }, [selectedSchool, role])

  const handleLogin = () => {
    if (!selectedSchool) return

    const school = schools.find((s) => s.id === selectedSchool)
    if (school) {
      const users = generateMockUsers(school.id)
      const user = users.find((u) => u.role === role)

      if (user) {
        login(school, user)
        router.push("/competitions")
      }
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>School Competition Platform</CardTitle>
          <CardDescription>Login to access competitions for your school</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div className="grid gap-2">
              <Label htmlFor="school">Select Your School</Label>
              <Select value={selectedSchool} onValueChange={setSelectedSchool}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a school" />
                </SelectTrigger>
                <SelectContent>
                  {schools.map((school) => (
                    <SelectItem key={school.id} value={school.id}>
                      {school.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedSchool && (
              <>
                <Tabs defaultValue="admin" onValueChange={(value) => setRole(value as UserRole)}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="admin" className="flex items-center gap-2">
                      <UserIcon className="h-4 w-4" />
                      Admin
                    </TabsTrigger>
                    <TabsTrigger value="student" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Student
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="admin">
                    <div className="space-y-4 pt-4">
                      <div className="grid gap-2">
                        <Label htmlFor="admin-email">Email</Label>
                        <Input id="admin-email" value={email} readOnly className="bg-muted/50" />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="admin-password">Password</Label>
                        <Input
                          id="admin-password"
                          type="password"
                          value="admin-password"
                          readOnly
                          className="bg-muted/50"
                        />
                        <p className="text-xs text-muted-foreground">This is a mock login, any password will work</p>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="student">
                    <div className="space-y-4 pt-4">
                      <div className="grid gap-2">
                        <Label htmlFor="student-email">Email</Label>
                        <Input id="student-email" value={email} readOnly className="bg-muted/50" />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="student-password">Password</Label>
                        <Input
                          id="student-password"
                          type="password"
                          value="student-password"
                          readOnly
                          className="bg-muted/50"
                        />
                        <p className="text-xs text-muted-foreground">This is a mock login, any password will work</p>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="bg-primary/5 p-3 rounded-md border border-primary/10">
                  <div className="flex items-center gap-2 mb-2">
                    <School className="h-4 w-4 text-primary" />
                    <h4 className="text-sm font-medium">Login Information</h4>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    <strong>Admin:</strong> Can create and manage competitions for your school
                    <br />
                    <strong>Student:</strong> Can view and register for competitions available to your school
                  </p>
                </div>
              </>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={handleLogin} disabled={!selectedSchool}>
            Login
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
