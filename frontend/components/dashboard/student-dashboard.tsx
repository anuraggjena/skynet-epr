"use client"

import { useEffect, useState } from "react"
import { getPersonEprs, getSummary } from "@/lib/api"
import PerformanceCard from "@/components/analytics/performance-card"
import PerformanceTrend from "@/components/analytics/performance-trend"
import EprList from "@/components/epr/epr-list"
import { Card } from "@/components/ui/card"
import { Sparkles, Calendar, History } from "lucide-react"

export default function StudentDashboard({ session }: { session: any }) {
  const [eprs, setEprs] = useState<any[]>([])
  const [summary, setSummary] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [records, summaryData] = await Promise.all([
          getPersonEprs(session.id),
          getSummary(session.id)
        ])
        setEprs(records || [])
        setSummary(summaryData || null)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [session.id])

  return (
    <div className="flex flex-col h-full bg-[#f8fafc] dark:bg-[#020617] p-4 md:p-8 space-y-8 overflow-y-auto custom-scrollbar">
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-primary font-bold text-[10px] uppercase tracking-[0.3em]">
            <Sparkles className="w-3 h-3" />
            Performance Cockpit
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-slate-900 dark:text-white">
            Hello, {session.name.split(' ')[0]}<span className="text-primary">.</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-3 bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-200/60 shadow-sm px-4">
           <Calendar className="w-4 h-4 text-muted-foreground" />
           <span className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
             Batch 2026
           </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        <Card className="lg:col-span-8 p-4 border-none shadow-xl shadow-slate-200/50 dark:shadow-none bg-white dark:bg-slate-900 min-h-100 flex flex-col">
          <div className="flex-1 w-full">
            <PerformanceTrend eprs={eprs} isLoading={loading} />
          </div>
        </Card>

        <div className="lg:col-span-4">
          <PerformanceCard summary={summary} isLoading={loading} />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-3 px-2">
           <div className="p-2 bg-white dark:bg-slate-900 rounded-xl border shadow-sm text-slate-500">
             <History className="w-4 h-4" />
           </div>
           <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Evaluation History</h3>
        </div>

        <Card className="border-none shadow-xl p-4 shadow-slate-200/50 dark:shadow-none bg-white dark:bg-slate-900 overflow-hidden">
          <div className="p-0">
             <EprList eprs={eprs} readOnly isLoading={loading} />
          </div>
        </Card>
      </div>

      <div className="h-20 shrink-0" />

    </div>
  )
}