"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { PlusIcon } from "lucide-react"
import { CreateCompetitionDialog } from "./create-competition-dialog"
import { useAuth } from "./auth-provider"

export function CreateCompetitionButton() {
  const [open, setOpen] = useState(false)
  const { isAdmin } = useAuth()

  // Only admins can create competitions
  if (!isAdmin) return null

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <PlusIcon className="mr-2 h-4 w-4" />
        Create Competition
      </Button>
      <CreateCompetitionDialog open={open} onOpenChange={setOpen} />
    </>
  )
}
