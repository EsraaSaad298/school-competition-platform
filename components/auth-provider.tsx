"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"
import type { School, User } from "@/lib/types"

interface AuthContextType {
  currentSchool: School | null
  currentUser: User | null
  login: (school: School, user: User) => void
  logout: () => void
  isAuthenticated: boolean
  isAdmin: boolean
  isStudent: boolean
}

const AuthContext = createContext<AuthContextType>({
  currentSchool: null,
  currentUser: null,
  login: () => {},
  logout: () => {},
  isAuthenticated: false,
  isAdmin: false,
  isStudent: false,
})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentSchool, setCurrentSchool] = useState<School | null>(null)
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const router = useRouter()
  const pathname = usePathname()

  // Check for stored auth on mount
  useEffect(() => {
    const storedSchool = localStorage.getItem("currentSchool")
    const storedUser = localStorage.getItem("currentUser")

    if (storedSchool && storedUser) {
      try {
        setCurrentSchool(JSON.parse(storedSchool))
        setCurrentUser(JSON.parse(storedUser))
      } catch (e) {
        localStorage.removeItem("currentSchool")
        localStorage.removeItem("currentUser")
      }
    }
  }, [])

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!currentSchool && !currentUser && pathname !== "/login" && !pathname.startsWith("/api/")) {
      router.push("/login")
    }
  }, [currentSchool, currentUser, pathname, router])

  const login = (school: School, user: User) => {
    setCurrentSchool(school)
    setCurrentUser(user)

    localStorage.setItem("currentSchool", JSON.stringify(school))
    localStorage.setItem("currentUser", JSON.stringify(user))

    // Set cookies for server components
    document.cookie = `currentSchool=${JSON.stringify(school)}; path=/; max-age=86400; SameSite=Lax`
    document.cookie = `currentUser=${JSON.stringify(user)}; path=/; max-age=86400; SameSite=Lax`
  }

  const logout = () => {
    setCurrentSchool(null)
    setCurrentUser(null)

    localStorage.removeItem("currentSchool")
    localStorage.removeItem("currentUser")

    // Clear cookies
    document.cookie = "currentSchool=; path=/; max-age=0; SameSite=Lax"
    document.cookie = "currentUser=; path=/; max-age=0; SameSite=Lax"

    router.push("/login")
  }

  const isAdmin = currentUser?.role === "admin"
  const isStudent = currentUser?.role === "student"

  return (
    <AuthContext.Provider
      value={{
        currentSchool,
        currentUser,
        login,
        logout,
        isAuthenticated: !!(currentSchool && currentUser),
        isAdmin,
        isStudent,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
