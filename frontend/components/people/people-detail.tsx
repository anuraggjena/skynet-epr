"use client"

import { useEffect, useState } from "react"
import {
  getPersonEprs,
  getSummary,
  getInstructorEprs
} from "@/lib/api"
import { getSession } from "@/lib/session"
import PerformanceCard from "@/components/analytics/performance-card"
import PerformanceTrend from "@/components/analytics/performance-trend"
import EprList from "@/components/epr/epr-list"
import NewEprDialog from "@/components/epr/new-epr-dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Plus, History, ClipboardList } from "lucide-react"

export default function PeopleDetail({ person }: { person: any }) {

  const session = getSession()

  const [eprs, setEprs] = useState<any[]>([])
  const [summary, setSummary] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [openNewEpr, setOpenNewEpr] = useState(false)

  async function loadData() {
    if (!person?.id) return

    try {

      setLoading(true)

      const session = getSession()

      /* Admin viewing instructor */
      if (person.role === "instructor") {
        const instructorEprs = await getInstructorEprs(person.id)
        setEprs(instructorEprs || [])
        setSummary(null)
        return
      }

      /* STUDENT VIEW */

      const [allStudentEprs, summaryData] = await Promise.all([
        getPersonEprs(person.id),
        getSummary(person.id)
      ])
      let visibleEprs = allStudentEprs
      if (session.role === "instructor") {
        visibleEprs = allStudentEprs.filter(
          (e: any) => e.evaluatorId === session.id
        )
      }
      setEprs(visibleEprs || [])
      setSummary(summaryData || null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!person?.id) return
    loadData()
  }, [person?.id])
  const isStudentViewer = session.role === "student"
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b pb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-white font-bold">
            {person.name
              .split(" ")
              .map((n: string) => n[0])
              .join("")}
          </div>
          <div>
            <h2 className="text-2xl font-bold">
              {person.name}
            </h2>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                {person.role}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {person.courseName || person.email}
              </span>
            </div>
          </div>
        </div>

        {!isStudentViewer && person.role === "student" && (
          <Button onClick={() => setOpenNewEpr(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Evaluation
          </Button>
        )}
      </div>

      {person.role === "student" && (
        <>
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            <div className="xl:col-span-4">
              <PerformanceCard
                summary={summary}
                isLoading={loading}
              />
            </div>
            <Card className="xl:col-span-8 p-6">
              <PerformanceTrend
                eprs={eprs}
                isLoading={loading}
              />
            </Card>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider flex items-center gap-2">
              <History className="w-4 h-4" />
              Evaluation Logbook
            </h3>
            <Card>
              <EprList
                eprs={eprs}
                readOnly={isStudentViewer}
                onUpdated={loadData}
              />
            </Card>
          </div>
        </>
      )}

      {person.role === "instructor" && (
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider flex items-center gap-2">
            <ClipboardList className="w-4 h-4" />
            Evaluations Written
          </h3>
          <Card>
            <EprList
              eprs={eprs}
              readOnly
            />
          </Card>
        </div>
      )}

      <NewEprDialog
        open={openNewEpr}
        onClose={() => setOpenNewEpr(false)}
        personId={person.id}
        personName={person.name}
        courseName={person.courseName}
        onCreated={loadData}
      />
    </div>
  )
}