"use client"

import { useEffect, useState } from "react"
import { getPeople } from "@/lib/api"
import PeopleList from "@/components/people/people-list"
import PeopleDetail from "@/components/people/people-detail"
import { LayoutGrid } from "lucide-react"

export default function AdminDashboard({ session }: any) {

  const [people, setPeople] = useState<any[]>([])
  const [selectedPerson, setSelectedPerson] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const data = await getPeople()
      setPeople(data || [])
      if (data?.length > 0 && !selectedPerson) {
        setSelectedPerson(data[0])
      }
      setLoading(false)
    }
    load()
  }, [])

  const students = people.filter(p => p.role === "student")
  const instructors = people.filter(p => p.role === "instructor")

  const totalEprs = instructors.reduce(
    (sum, i) => sum + (i.eprCount || 0),
    0
  )

  return (

    <div className="flex flex-col h-full bg-background overflow-hidden">
      <div className="flex flex-1 min-h-0 overflow-hidden">
        <aside className="w-72 xl:w-80 border-r bg-white dark:bg-slate-950 flex flex-col">
          <PeopleList
            people={people}
            selectedPerson={selectedPerson}
            onSelect={setSelectedPerson}
            role="admin"
          />
        </aside>

        <main className="flex-1 min-h-0 overflow-y-auto bg-slate-50/40 dark:bg-transparent custom-scrollbar">
          {selectedPerson ? (
            <div className="p-6 lg:p-8 max-w-6xl mx-auto animate-in fade-in duration-300">
              <PeopleDetail person={selectedPerson} />
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center opacity-20">
              <LayoutGrid className="w-12 h-12 mb-2" />
              <p className="text-[10px] font-black uppercase tracking-widest">
                Select a user
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}