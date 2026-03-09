"use client"

import { useEffect, useState } from "react"
import { getPeople } from "@/lib/api"

import PeopleList from "@/components/people/people-list"
import PeopleDetail from "@/components/people/people-detail"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { GraduationCap, ClipboardSignature, AlertCircle, RefreshCcw } from "lucide-react"

type Props = {
  session: {
    id: string
    role: "admin" | "instructor" | "student"
  }
}

export default function InstructorDashboard({ session }: Props) {
  const [students, setStudents] = useState<any[]>([])
  const [selected, setSelected] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function load() {
    try {
      setLoading(true)
      setError(null)
      const people = await getPeople()
      
      const studentsOnly = people.filter(
        (p: any) => p.role === "student"
      )
      
      setStudents(studentsOnly)
    } catch (error) {
      console.error("Failed to load student roster", error)
      setError("We encountered an issue while loading your student roster.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  if (loading) {
    return (
      <div className="flex flex-col h-screen max-h-screen bg-muted/10 p-4 md:p-6 lg:p-8 space-y-6">
        <div>
          <Skeleton className="h-8 w-56 mb-2" />
          <Skeleton className="h-4 w-80" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0">
          <Card className="lg:col-span-4 h-full flex flex-col">
            <CardHeader className="pb-4 border-b">
               <Skeleton className="h-6 w-24" />
            </CardHeader>
            <CardContent className="p-4 space-y-3 flex-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-16 w-full rounded-lg" />
              ))}
            </CardContent>
          </Card>
          <Card className="hidden lg:flex lg:col-span-8 h-full flex-col justify-center items-center">
            <Skeleton className="h-64 w-[70%] rounded-xl" />
          </Card>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-[80vh] items-center justify-center p-6">
        <Card className="max-w-md w-full border-dashed border-destructive/50 shadow-sm text-center p-8">
          <div className="mx-auto w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
            <AlertCircle className="w-6 h-6 text-destructive" />
          </div>
          <h3 className="text-lg font-semibold tracking-tight">Roster Unavailable</h3>
          <p className="text-sm text-muted-foreground mt-2 mb-6">{error}</p>
          <button 
            onClick={load}
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
          >
            <RefreshCcw className="w-4 h-4" /> Try Again
          </button>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex flex-col flex-1 min-h-0 h-full bg-muted/10 p-4 md:p-6 lg:p-8">

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0">
        
        <Card className="lg:col-span-3 flex flex-col min-h-0 h-full shadow-sm overflow-hidden border-border/50">
          <div className="overflow-y-auto h-full p-0">
            {students.length === 0 ? (
               <div className="p-12 text-center text-muted-foreground flex flex-col items-center">
                 <GraduationCap className="w-8 h-8 mb-3 opacity-20" />
                 <span className="text-sm font-medium">No students assigned.</span>
               </div>
            ) : (
              <PeopleList
                role="instructor"
                people={students}
                selectedPerson={selected}
                onSelect={setSelected}
              />
            )}
          </div>
        </Card>

        <Card className="lg:col-span-9 flex flex-col min-h-0 h-full shadow-sm overflow-hidden border-border/50 p-6">
          <div className="overflow-y-auto h-full relative bg-card">
            {selected ? (
              <PeopleDetail person={selected} />
            ) : (
              <EmptyState />
            )}
          </div>
        </Card>

      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-muted/5">
      <div className="text-center space-y-4 max-w-sm px-6">
        <div className="mx-auto w-16 h-16 bg-background border shadow-sm rounded-full flex items-center justify-center mb-6">
          <ClipboardSignature className="w-8 h-8 text-muted-foreground/60" />
        </div>
        <h3 className="text-xl font-semibold tracking-tight text-foreground">
          Ready to Evaluate
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Select a student from your roster on the left to view their past performance records or to submit a new evaluation.
        </p>
      </div>
    </div>
  )
}