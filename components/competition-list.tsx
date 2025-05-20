import type { Competition, UserRole } from "@/lib/types"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface CompetitionListProps {
  competitions: Competition[]
  currentSchoolId: string
  userRole: UserRole
}

export function CompetitionList({ competitions, currentSchoolId, userRole }: CompetitionListProps) {
  const isAdmin = userRole === "admin"

  if (competitions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No competitions found</p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {competitions.map((competition) => (
        <CompetitionCard
          key={competition.id}
          competition={competition}
          isOwner={competition.ownerTenantId === currentSchoolId}
          userRole={userRole}
        />
      ))}
    </div>
  )
}

function CompetitionCard({
  competition,
  isOwner,
  userRole,
}: {
  competition: Competition
  isOwner: boolean
  userRole: UserRole
}) {
  const isAdmin = userRole === "admin"

  return (
    <Card className={isOwner ? "border-primary/20 bg-primary/5" : ""}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{competition.title}</CardTitle>
          <VisibilityBadge visibility={competition.visibility} />
        </div>
        <CardDescription className="flex items-center gap-1">
          <CalendarIcon className="h-4 w-4" />
          {competition.date}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm mb-4">{competition.description}</p>

        <div className="flex items-center gap-2 mb-4">
          <Badge variant="outline">{competition.category}</Badge>
          <span className="text-xs text-muted-foreground">{competition.location}</span>
        </div>

        {isOwner ? (
          <div className="bg-primary/10 text-primary-foreground p-2 rounded text-xs flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-3 w-3 mr-1"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
            Hosted by your school
          </div>
        ) : (
          <div className="bg-muted/50 p-2 rounded text-xs">Hosted by another school</div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="text-xs text-muted-foreground">
          {competition.visibility === "public"
            ? "Open to all schools"
            : competition.visibility === "restricted"
              ? "Open to selected schools"
              : "School-only event"}
        </div>

        {!isAdmin && (
          <Link href={`/competitions/${competition.id}`}>
            <Button size="sm" variant="outline" className="text-xs h-8">
              <Users className="h-3 w-3 mr-1" />
              View Details
            </Button>
          </Link>
        )}

        {isAdmin && (
          <Link href={`/competitions/${competition.id}`}>
            <Button size="sm" variant="outline" className="text-xs h-8">
              View Details
            </Button>
          </Link>
        )}
      </CardFooter>
    </Card>
  )
}

function VisibilityBadge({ visibility }: { visibility: Competition["visibility"] }) {
  switch (visibility) {
    case "public":
      return <Badge variant="default">Public</Badge>
    case "private":
      return <Badge variant="secondary">Private</Badge>
    case "restricted":
      return <Badge variant="outline">Restricted</Badge>
    default:
      return null
  }
}
