import type { Competition } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, MapPin, Clock, Users, Building } from "lucide-react"
import { schools } from "@/lib/mock-data"

interface CompetitionDetailsProps {
  competition: Competition
  isOwner: boolean
}

export function CompetitionDetails({ competition, isOwner }: CompetitionDetailsProps) {
  // Find the school that owns this competition
  const ownerSchool = schools.find((school) => school.id === competition.ownerTenantId)

  return (
    <Card className="mb-6">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl">{competition.title}</CardTitle>
            <CardDescription>{competition.description}</CardDescription>
          </div>
          <VisibilityBadge visibility={competition.visibility} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="font-medium">Competition Date</div>
                <div className="text-sm text-muted-foreground">{competition.date}</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="font-medium">Location</div>
                <div className="text-sm text-muted-foreground">{competition.location}</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="font-medium">Posted On</div>
                <div className="text-sm text-muted-foreground">{competition.createdAt}</div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Building className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="font-medium">Hosted By</div>
                <div className="text-sm text-muted-foreground">{ownerSchool?.name || "Unknown School"}</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="font-medium">Maximum Participants</div>
                <div className="text-sm text-muted-foreground">
                  {competition.maxParticipants ? `${competition.maxParticipants} students` : "Unlimited"}
                </div>
              </div>
            </div>

            <div>
              <div className="font-medium mb-1">Category</div>
              <Badge>{competition.category}</Badge>
            </div>
          </div>
        </div>
      </CardContent>
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
