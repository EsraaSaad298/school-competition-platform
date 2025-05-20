"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAuth } from "./auth-provider"
import { createCompetition } from "@/lib/data-service"
import type { CompetitionVisibility } from "@/lib/types"
import { schools } from "@/lib/mock-data"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/hooks/use-toast"
import { Check } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"

interface CreateCompetitionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateCompetitionDialog({ open, onOpenChange }: CreateCompetitionDialogProps) {
  const { currentSchool } = useAuth()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedSchools, setSelectedSchools] = useState<string[]>([])

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    visibility: "private" as CompetitionVisibility,
    category: "General",
    location: "Main Hall",
    maxParticipants: "50",
  })

  // Fix the useEffect hooks that are causing the state update error

  // Replace the two separate useEffect hooks with a single, properly structured one:

  // Remove these two useEffect hooks:
  // useEffect(() => {
  //   if (open) {
  //     // Pre-select current school when dialog opens
  //     setSelectedSchools(currentSchool ? [currentSchool.id] : [])
  //   } else {
  //     // Reset form when dialog closes
  //     setFormData({
  //       title: "",
  //       description: "",
  //       date: "",
  //       visibility: "private",
  //       category: "General",
  //       location: "Main Hall",
  //       maxParticipants: "50",
  //     })
  //   }
  // }, [open, currentSchool])

  // // Update selected schools when visibility changes
  // useEffect(() => {
  //   if (formData.visibility === "restricted" && currentSchool) {
  //     // Ensure current school is always selected for restricted competitions
  //     if (!selectedSchools.includes(currentSchool.id)) {
  //       setSelectedSchools([...selectedSchools, currentSchool.id])
  //     }
  //   }
  // }, [formData.visibility, currentSchool, selectedSchools])

  // And replace them with this single useEffect:

  useEffect(() => {
    // Handle dialog open/close
    if (open) {
      // Pre-select current school when dialog opens
      if (currentSchool) {
        setSelectedSchools([currentSchool.id])
      }
    } else {
      // Reset form when dialog closes
      setFormData({
        title: "",
        description: "",
        date: "",
        visibility: "private",
        category: "General",
        location: "Main Hall",
        maxParticipants: "50",
      })
      // Reset selected schools when dialog closes
      if (currentSchool) {
        setSelectedSchools([currentSchool.id])
      } else {
        setSelectedSchools([])
      }
    }
  }, [open, currentSchool])

  // Add a separate effect to handle visibility changes
  useEffect(() => {
    // Only run this effect if we have a current school and the dialog is open
    if (currentSchool && open && formData.visibility === "restricted") {
      // Ensure current school is always selected for restricted competitions
      setSelectedSchools((prev) => {
        if (!prev.includes(currentSchool.id)) {
          return [...prev, currentSchool.id]
        }
        return prev
      })
    }
  }, [formData.visibility, currentSchool, open])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleVisibilityChange = (value: CompetitionVisibility) => {
    setFormData((prev) => ({ ...prev, visibility: value }))
  }

  const toggleSchoolSelection = (schoolId: string, isChecked: boolean) => {
    // Don't allow deselecting the current school
    if (schoolId === currentSchool?.id) return

    setSelectedSchools((current) => {
      if (isChecked && !current.includes(schoolId)) {
        return [...current, schoolId]
      } else if (!isChecked && current.includes(schoolId)) {
        return current.filter((id) => id !== schoolId)
      }
      return current
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!currentSchool) return

    setIsSubmitting(true)

    try {
      // Only include allowedTenantIds if visibility is restricted
      const allowedTenantIds = formData.visibility === "restricted" ? selectedSchools : undefined

      await createCompetition({
        ...formData,
        maxParticipants: Number.parseInt(formData.maxParticipants),
        ownerTenantId: currentSchool.id,
        allowedTenantIds,
        createdAt: new Date().toISOString().split("T")[0],
      })

      toast({
        title: "Competition created",
        description: "Your new competition has been created successfully.",
      })

      // Reset form and close dialog
      setFormData({
        title: "",
        description: "",
        date: "",
        visibility: "private",
        category: "General",
        location: "Main Hall",
        maxParticipants: "50",
      })
      onOpenChange(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create competition. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Filter out the current school from the schools list for display
  const otherSchools = schools.filter((school) => school.id !== currentSchool?.id)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] h-[90vh] flex flex-col overflow-hidden">
        <DialogHeader className="shrink-0">
          <DialogTitle>Create New Competition</DialogTitle>
          <DialogDescription>
            Create a new competition for your school. Set the visibility to control who can see it.
          </DialogDescription>
        </DialogHeader>

        <div className="overflow-y-auto flex-1 pr-6 -mr-6">
          <form id="create-competition-form" onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" name="title" value={formData.title} onChange={handleChange} required />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="date">Date</Label>
                <Input id="date" name="date" type="date" value={formData.date} onChange={handleChange} required />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Input id="category" name="category" value={formData.category} onChange={handleChange} required />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" name="location" value={formData.location} onChange={handleChange} required />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="maxParticipants">Maximum Participants</Label>
                <Input
                  id="maxParticipants"
                  name="maxParticipants"
                  type="number"
                  min="1"
                  value={formData.maxParticipants}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label>Visibility</Label>
              <RadioGroup value={formData.visibility} onValueChange={handleVisibilityChange as (value: string) => void}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="private" id="private" />
                  <Label htmlFor="private" className="cursor-pointer">
                    Private (only visible to your school)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="restricted" id="restricted" />
                  <Label htmlFor="restricted" className="cursor-pointer">
                    Restricted (visible to selected schools)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="public" id="public" />
                  <Label htmlFor="public" className="cursor-pointer">
                    Public (visible to all schools)
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* School selection for restricted visibility */}
            {formData.visibility === "restricted" && (
              <div className="grid gap-2 pt-2">
                <Label>Select Schools</Label>
                <p className="text-xs text-muted-foreground mb-2">
                  Choose which schools can view this competition. Your school is automatically included.
                </p>

                {/* Current school - always selected and disabled */}
                <div className="flex items-center p-2 border rounded-md bg-muted/20 mb-2">
                  <Check className="h-4 w-4 mr-2 text-primary" />
                  <span className="text-sm">{currentSchool?.name} (Your School)</span>
                </div>

                {/* Checkbox list for other schools */}
                <div className="border rounded-md p-2 max-h-40 overflow-y-auto">
                  {otherSchools.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-2">No other schools available</p>
                  ) : (
                    <div className="space-y-2">
                      {otherSchools.map((school) => (
                        <div key={school.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`school-${school.id}`}
                            checked={selectedSchools.includes(school.id)}
                            onCheckedChange={(checked) => toggleSchoolSelection(school.id, checked as boolean)}
                          />
                          <Label htmlFor={`school-${school.id}`} className="cursor-pointer text-sm">
                            {school.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Display selected schools as badges */}
                {selectedSchools.length > 1 && (
                  <div className="mt-2">
                    <Label className="text-xs">Selected Schools:</Label>
                    <div className="flex flex-wrap gap-2 mt-1 max-h-24 overflow-y-auto">
                      {selectedSchools
                        .filter((id) => id !== currentSchool?.id)
                        .map((schoolId) => {
                          const school = schools.find((s) => s.id === schoolId)
                          return (
                            <Badge key={schoolId} variant="secondary" className="px-2 py-1">
                              {school?.name}
                              <button
                                type="button"
                                className="ml-1 text-xs"
                                onClick={() => toggleSchoolSelection(schoolId, false)}
                              >
                                ×
                              </button>
                            </Badge>
                          )
                        })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </form>
        </div>

        <DialogFooter className="shrink-0 border-t mt-4 pt-4">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" form="create-competition-form" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Competition"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
