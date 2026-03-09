"use client"

import { useState, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Search, 
  GraduationCap, 
  Briefcase, 
  ChevronRight, 
  UserX,
  Target
} from "lucide-react"

type Person = {
  id: string
  name: string
  email: string
  role: "student" | "instructor" | "admin"
  courseName?: string
  enrollmentStatus?: string
  eprCount?: number
}

type Props = {
  people: Person[]
  selectedPerson?: Person
  onSelect: (person: Person) => void
  role?: "admin" | "instructor" | "student"
}

export default function PeopleList({
  people,
  selectedPerson,
  onSelect,
  role = "admin"
}: Props) {
  const [search, setSearch] = useState("")
  const [tab, setTab] = useState<"students" | "instructors">("students")

  const isAdmin = role === "admin"

  const filteredPeople = useMemo(() => {
    return people.filter((p) => {
      if (isAdmin) {
        if (tab === "students" && p.role !== "student") return false
        if (tab === "instructors" && p.role !== "instructor") return false
      } else {
        if (p.role !== "student") return false
      }

      const searchLower = search.toLowerCase()
      return (
        p.name.toLowerCase().includes(searchLower) ||
        p.email.toLowerCase().includes(searchLower) ||
        (p.courseName && p.courseName.toLowerCase().includes(searchLower))
      )
    })
  }, [people, search, tab, isAdmin])

  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)

  return (
    <div className="flex flex-col h-full bg-background border-r">
      
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur p-3 space-y-3 border-b border-border/40">
        {isAdmin && (
          <Tabs defaultValue="students" onValueChange={(v) => setTab(v as any)}>
            <TabsList className="grid w-full grid-cols-2 h-8 bg-muted/30">
              <TabsTrigger value="students" className="text-[10px] font-black uppercase tracking-widest">
                Students
              </TabsTrigger>
              <TabsTrigger value="instructors" className="text-[10px] font-black uppercase tracking-widest">
                Staff
              </TabsTrigger>
            </TabsList>
          </Tabs>
        )}

        <div className="relative group">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-8 pl-8 text-xs bg-muted/20 border-none shadow-none focus-visible:ring-1 focus-visible:ring-primary/20"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {filteredPeople.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 opacity-40">
            <UserX className="w-8 h-8 mb-2" />
            <p className="text-[10px] font-black uppercase tracking-widest">No Matches</p>
          </div>
        ) : (
          filteredPeople.map((person) => {
            const isSelected = selectedPerson?.id === person.id
            const isStudent = person.role === "student"

            return (
              <div
                key={person.id}
                onClick={() => onSelect(person)}
                className={`
                  relative group flex items-center gap-3 px-4 py-3 cursor-pointer transition-all border-b border-border/20
                  ${isSelected ? "bg-primary/3" : "hover:bg-muted/30"}
                `}
              >
                {isSelected && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary animate-in fade-in slide-in-from-left-1" />
                )}

                <div className={`
                  shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-[10px] font-black transition-all
                  ${isSelected ? "bg-primary text-white shadow-lg shadow-primary/20" : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"}
                `}>
                  {getInitials(person.name)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-0.5">
                    <p className={`text-sm font-bold truncate leading-none ${isSelected ? "text-primary" : "text-slate-900 dark:text-slate-100"}`}>
                      {person.name}
                    </p>
                    {isStudent ? (
                      <div className={`w-1.5 h-1.5 rounded-full ${person.enrollmentStatus === 'active' ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                    ) : (
                      <span className="text-[10px] font-bold text-muted-foreground/40">{person.eprCount ?? 0}</span>
                    )}
                  </div>
                  
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest truncate">
                    {isStudent ? (person.courseName ?? "Unassigned") : person.email}
                  </p>
                </div>

                <ChevronRight className={`
                  w-3.5 h-3.5 transition-all duration-200
                  ${isSelected ? "text-primary opacity-100" : "text-muted-foreground opacity-0 -translate-x-2 group-hover:opacity-30 group-hover:translate-x-0"}
                `} />
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}