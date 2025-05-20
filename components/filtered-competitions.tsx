"use client"

import { useState, useMemo } from "react"
import type { Competition, UserRole } from "@/lib/types"
import { CompetitionList } from "@/components/competition-list"
import { CompetitionFilters, type HostFilter, type VisibilityFilter } from "@/components/competition-filters"

interface FilteredCompetitionsProps {
  competitions: Competition[]
  currentSchoolId: string
  userRole: UserRole
}

export function FilteredCompetitions({ competitions, currentSchoolId, userRole }: FilteredCompetitionsProps) {
  const [hostFilter, setHostFilter] = useState<HostFilter>("all")
  const [visibilityFilter, setVisibilityFilter] = useState<VisibilityFilter>("all")

  // Calculate counts for the filters
  const competitionCounts = useMemo(() => {
    const mySchool = competitions.filter((comp) => comp.ownerTenantId === currentSchoolId).length
    const otherSchools = competitions.filter((comp) => comp.ownerTenantId !== currentSchoolId).length
    const publicComps = competitions.filter((comp) => comp.visibility === "public").length
    const privateComps = competitions.filter((comp) => comp.visibility === "private").length
    const restrictedComps = competitions.filter((comp) => comp.visibility === "restricted").length

    return {
      mySchool,
      otherSchools,
      public: publicComps,
      private: privateComps,
      restricted: restrictedComps,
      total: competitions.length,
    }
  }, [competitions, currentSchoolId])

  // Apply filters to competitions
  const filteredCompetitions = useMemo(() => {
    return competitions.filter((competition) => {
      // Filter by host
      if (hostFilter === "my-school" && competition.ownerTenantId !== currentSchoolId) {
        return false
      }
      if (hostFilter === "other-schools" && competition.ownerTenantId === currentSchoolId) {
        return false
      }

      // Filter by visibility
      if (visibilityFilter !== "all" && competition.visibility !== visibilityFilter) {
        return false
      }

      return true
    })
  }, [competitions, hostFilter, visibilityFilter, currentSchoolId])

  const handleFilterChange = (newHostFilter: HostFilter, newVisibilityFilter: VisibilityFilter) => {
    setHostFilter(newHostFilter)
    setVisibilityFilter(newVisibilityFilter)
  }

  return (
    <>
      <CompetitionFilters onFilterChange={handleFilterChange} competitionCounts={competitionCounts} />

      {filteredCompetitions.length === 0 ? (
        <div className="text-center py-12 bg-muted/20 rounded-lg">
          <p className="text-muted-foreground">No competitions match your filters</p>
          <button className="text-sm text-primary mt-2 underline" onClick={() => handleFilterChange("all", "all")}>
            Clear filters
          </button>
        </div>
      ) : (
        <>
          <div className="mb-4">
            <p className="text-sm">
              Showing {filteredCompetitions.length} of {competitions.length} competitions
            </p>
          </div>
          <CompetitionList competitions={filteredCompetitions} currentSchoolId={currentSchoolId} userRole={userRole} />
        </>
      )}
    </>
  )
}
