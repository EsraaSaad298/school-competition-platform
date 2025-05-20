import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { School, User } from "lucide-react"
import type { School as SchoolType, UserRole } from "@/lib/types"

interface SchoolInfoCardProps {
  school: SchoolType
  competitionCount: number
  userRole: UserRole
  userName: string
}

export function SchoolInfoCard({ school, competitionCount, userRole, userName }: SchoolInfoCardProps) {
  const isAdmin = userRole === "admin"

  return (
    <Card className="mb-6">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <School className="h-5 w-5 text-primary" />
          <CardTitle>{school.name}</CardTitle>
        </div>
        <CardDescription>{isAdmin ? "School Admin Dashboard" : "Student Dashboard"}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-primary/10 rounded-lg p-4">
            <div className="text-sm font-medium text-muted-foreground mb-1">
              {isAdmin ? "Your School's Competitions" : "School Competitions"}
            </div>
            <div className="text-2xl font-bold">{competitionCount}</div>
          </div>
          <div className="bg-muted/30 rounded-lg p-4">
            <div className="text-sm font-medium text-muted-foreground mb-1">User</div>
            <div className="text-sm font-medium flex items-center gap-1">
              <User className="h-3.5 w-3.5" />
              {userName}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {isAdmin ? "Administrator Access" : "Student Access"}
            </div>
          </div>
          <div className="bg-muted/30 rounded-lg p-4">
            <div className="text-sm font-medium text-muted-foreground mb-1">Permissions</div>
            <div className="text-xs space-y-1">
              {isAdmin ? (
                <>
                  <div className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-green-500"></span>
                    Create competitions
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-green-500"></span>
                    Manage school competitions
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-green-500"></span>
                    View all accessible competitions
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-green-500"></span>
                    View public competitions
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-green-500"></span>
                    View school competitions
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-red-500"></span>
                    Cannot create competitions
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
