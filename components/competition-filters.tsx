"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"
import { Filter } from "lucide-react"

export type HostFilter = "all" | "my-school" | "other-schools"
export type VisibilityFilter = "all" | "public" | "private" | "restricted"

interface CompetitionFiltersProps {
  onFilterChange: (hostFilter: HostFilter, visibilityFilter: VisibilityFilter) => void
  competitionCounts: {
    mySchool: number
    otherSchools: number
    public: number
    private: number
    restricted: number
    total: number
  }
}

export function CompetitionFilters({ onFilterChange, competitionCounts }: CompetitionFiltersProps) {
  const [hostFilter, setHostFilter] = useState<HostFilter>("all")
  const [visibilityFilter, setVisibilityFilter] = useState<VisibilityFilter>("all")

  const handleHostFilterChange = (value: HostFilter) => {
    setHostFilter(value)
    onFilterChange(value, visibilityFilter)
  }

  const handleVisibilityFilterChange = (value: VisibilityFilter) => {
    setVisibilityFilter(value)
    onFilterChange(hostFilter, value)
  }

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="h-4 w-4" />
          <h3 className="text-sm font-medium">Filter Competitions</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label className="text-sm mb-3 block">Hosted By</Label>
            <RadioGroup
              value={hostFilter}
              onValueChange={handleHostFilterChange as (value: string) => void}
              className="flex flex-col space-y-1"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="all" id="host-all" />
                <Label htmlFor="host-all" className="cursor-pointer flex items-center">
                  All
                  <Badge variant="outline" className="ml-2">
                    {competitionCounts.total}
                  </Badge>
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="my-school" id="host-my-school" />
                <Label htmlFor="host-my-school" className="cursor-pointer flex items-center">
                  My School
                  <Badge variant="outline" className="ml-2">
                    {competitionCounts.mySchool}
                  </Badge>
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="other-schools" id="host-other-schools" />
                <Label htmlFor="host-other-schools" className="cursor-pointer flex items-center">
                  Other Schools
                  <Badge variant="outline" className="ml-2">
                    {competitionCounts.otherSchools}
                  </Badge>
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label className="text-sm mb-3 block">Visibility</Label>
            <RadioGroup
              value={visibilityFilter}
              onValueChange={handleVisibilityFilterChange as (value: string) => void}
              className="flex flex-col space-y-1"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="all" id="visibility-all" />
                <Label htmlFor="visibility-all" className="cursor-pointer flex items-center">
                  All
                  <Badge variant="outline" className="ml-2">
                    {competitionCounts.total}
                  </Badge>
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="public" id="visibility-public" />
                <Label htmlFor="visibility-public" className="cursor-pointer flex items-center">
                  Public
                  <Badge variant="default" className="ml-2">
                    {competitionCounts.public}
                  </Badge>
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="private" id="visibility-private" />
                <Label htmlFor="visibility-private" className="cursor-pointer flex items-center">
                  Private
                  <Badge variant="secondary" className="ml-2">
                    {competitionCounts.private}
                  </Badge>
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="restricted" id="visibility-restricted" />
                <Label htmlFor="visibility-restricted" className="cursor-pointer flex items-center">
                  Restricted
                  <Badge variant="outline" className="ml-2">
                    {competitionCounts.restricted}
                  </Badge>
                </Label>
              </div>
            </RadioGroup>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
