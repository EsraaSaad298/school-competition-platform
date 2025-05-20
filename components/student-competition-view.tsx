"use client"

import { useState, useEffect } from "react"
import type { Competition } from "@/lib/types"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { registerForCompetition, isUserRegistered } from "@/lib/data-service"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { Award, CheckCircle, AlertCircle } from "lucide-react"

interface StudentCompetitionViewProps {
  competition: Competition
  winningLikelihood: number
  userId: string
}

export function StudentCompetitionView({ competition, winningLikelihood, userId }: StudentCompetitionViewProps) {
  const { toast } = useToast()
  const router = useRouter()
  const [isRegistering, setIsRegistering] = useState(false)
  const [isRegistered, setIsRegistered] = useState(false)
  const [checkingRegistration, setCheckingRegistration] = useState(true)

  // Check if student is already registered
  useEffect(() => {
    const checkRegistration = async () => {
      try {
        const registered = await isUserRegistered(userId, competition.id)
        setIsRegistered(registered)
      } catch (error) {
        console.error("Error checking registration:", error)
      } finally {
        setCheckingRegistration(false)
      }
    }

    checkRegistration()
  }, [userId, competition.id])

  const handleRegister = async () => {
    if (isRegistered) return

    setIsRegistering(true)
    try {
      await registerForCompetition(userId, competition.id)
      setIsRegistered(true)
      toast({
        title: "Registration Successful",
        description: `You have been registered for ${competition.title}`,
      })
      router.refresh()
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: "There was an error registering for this competition",
        variant: "destructive",
      })
    } finally {
      setIsRegistering(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Your Competition Analysis</CardTitle>
          <CardDescription>How likely are you to win this competition?</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Winning Likelihood</span>
                <span className="text-sm font-medium">{winningLikelihood}%</span>
              </div>
              <Progress value={winningLikelihood} className="h-2" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-muted/30">
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-sm">Difficulty Level</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="text-2xl font-bold">
                    {winningLikelihood > 70 ? "Easy" : winningLikelihood > 40 ? "Medium" : "Hard"}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Based on your past performance</p>
                </CardContent>
              </Card>

              <Card className="bg-muted/30">
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-sm">Category Match</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="text-2xl font-bold">
                    {winningLikelihood > 60 ? "Strong" : winningLikelihood > 30 ? "Moderate" : "Weak"}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    How well this matches your strengths in {competition.category}
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-muted/30">
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-sm">Recommendation</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="flex items-center gap-1">
                    {winningLikelihood > 50 ? (
                      <>
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <span className="font-medium">Recommended</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="h-5 w-5 text-amber-500" />
                        <span className="font-medium">Consider Preparation</span>
                      </>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {winningLikelihood > 50
                      ? "This competition is a good match for your skills"
                      : "You may need additional preparation"}
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="bg-primary/5 border border-primary/10 rounded-md p-4">
              <div className="flex items-center gap-2 mb-2">
                <Award className="h-5 w-5 text-primary" />
                <h3 className="font-medium">Performance Insights</h3>
              </div>
              <p className="text-sm">
                Based on your past performance and the competition category, you have a{" "}
                <strong>{winningLikelihood}%</strong> chance of winning this competition. The competition is in{" "}
                <strong>{competition.category}</strong>, which is{" "}
                {winningLikelihood > 60 ? "one of your strengths" : "an area you could improve in"}.
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            onClick={handleRegister}
            disabled={isRegistering || isRegistered || checkingRegistration}
            className="w-full"
          >
            {isRegistering
              ? "Registering..."
              : isRegistered
                ? "Already Registered"
                : checkingRegistration
                  ? "Checking Registration..."
                  : "Register for Competition"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
