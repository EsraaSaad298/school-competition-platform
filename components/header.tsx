"use client"

import Link from "next/link"
import { useAuth } from "./auth-provider"
import { Button } from "@/components/ui/button"
import { LogOut, Trophy, School, User, LayoutDashboard } from "lucide-react"

export function Header() {
  const { currentSchool, currentUser, logout, isAuthenticated, isAdmin, isStudent } = useAuth()

  if (!isAuthenticated) return null

  return (
    <header className="border-b">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-4">
          <Link href="/competitions" className="flex items-center gap-2">
            <Trophy className="h-6 w-6" />
            <span className="text-xl font-bold">School Competitions</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 ml-6">
            <Link href="/competitions" className="text-sm font-medium hover:text-primary">
              Competitions
            </Link>
            {isStudent && (
              <Link href="/dashboard" className="text-sm font-medium hover:text-primary">
                Dashboard
              </Link>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {currentSchool && (
            <div className="hidden md:flex items-center gap-2 bg-muted/30 px-3 py-1.5 rounded-full">
              <School className="h-4 w-4 text-primary" />
              <div className="text-sm font-medium">{currentSchool.name}</div>
            </div>
          )}

          {currentUser && (
            <div className="flex items-center gap-2 bg-muted/30 px-3 py-1.5 rounded-full">
              <User className="h-4 w-4 text-primary" />
              <div className="text-sm font-medium">
                {currentUser.name}
                <span className="ml-1 text-xs text-muted-foreground">({isAdmin ? "Admin" : "Student"})</span>
              </div>
            </div>
          )}

          {isStudent && (
            <Link href="/dashboard">
              <Button variant="outline" size="icon" className="md:hidden">
                <LayoutDashboard className="h-4 w-4" />
              </Button>
            </Link>
          )}

          <Button variant="outline" size="sm" onClick={logout}>
            <LogOut className="mr-2 h-4 w-4" />
            <span className="hidden md:inline">Logout</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
