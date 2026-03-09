"use client"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Activity, AlertCircle } from "lucide-react"

type EprData = {
  periodStart: string
  overallRating: number
  technicalSkillsRating: number
  nonTechnicalSkillsRating: number
}

type Props = {
  eprs: EprData[]
  isLoading?: boolean
}

function formatLabel(date: string) {
  const d = new Date(date)
  return d.toLocaleString("default", {
    month: "short",
    year: "numeric"
  })
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border border-border/50 p-3 rounded-lg shadow-xl shadow-black/5">
        <p className="font-semibold text-sm mb-2 text-foreground">{label}</p>
        <div className="space-y-1.5">
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <div 
                  className="w-2.5 h-2.5 rounded-sm" 
                  style={{ backgroundColor: entry.color }} 
                />
                <span className="text-muted-foreground capitalize">
                  {entry.name.replace(/([A-Z])/g, ' $1').trim()}
                </span>
              </div>
              <span className="font-semibold text-foreground">
                {Number(entry.value).toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </div>
    )
  }
  return null
}

export default function PerformanceTrend({ eprs, isLoading = false }: Props) {
  
  if (isLoading) {
    return (
      <Card className="w-full shadow-sm">
        <CardHeader>
          <Skeleton className="h-6 w-48 mb-1" />
          <Skeleton className="h-4 w-32" />
        </CardHeader>
        <CardContent>
          <div className="h-87.5 w-full flex flex-col justify-end gap-4">
            <Skeleton className="h-[80%] w-full rounded-md opacity-20" />
            <div className="flex justify-between w-full px-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-4 w-12" />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!eprs?.length) {
    return (
      <Card className="w-full border-dashed shadow-sm">
        <CardContent className="flex flex-col items-center justify-center p-12 text-center bg-muted/20 min-h-87.5">
          <div className="p-4 bg-background border shadow-sm rounded-full mb-4">
            <AlertCircle className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold tracking-tight">No Trend Data</h3>
          <p className="text-sm text-muted-foreground mt-2 max-w-sm leading-relaxed">
            There is not enough historical data to generate a performance trend chart.
          </p>
        </CardContent>
      </Card>
    )
  }

  const sorted = [...eprs].sort(
    (a, b) =>
      new Date(a.periodStart).getTime() -
      new Date(b.periodStart).getTime()
  )

  const data = sorted.map((e) => ({
    period: formatLabel(e.periodStart),
    overall: e.overallRating,
    technical: e.technicalSkillsRating,
    nonTechnical: e.nonTechnicalSkillsRating
  }))

  return (
    <Card className="w-full shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-6">
        <div className="space-y-1.5">
          <CardTitle className="text-xl font-bold tracking-tight">Performance Trends</CardTitle>
          <CardDescription className="text-sm">
            Historical progression of evaluation metrics
          </CardDescription>
        </div>
        <div className="p-2 bg-primary/10 rounded-md">
          <Activity className="w-5 h-5 text-primary" />
        </div>
      </CardHeader>

      <CardContent>
        <div className="h-60 xl:h-70 w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart 
              data={data} 
              margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid 
                strokeDasharray="4 4" 
                vertical={false} 
                stroke="hsl(var(--border))" 
                opacity={0.5} 
              />

              <XAxis 
                dataKey="period" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                dy={10}
              />

              <YAxis
                domain={[0, 5]}
                ticks={[0, 1, 2, 3, 4, 5]}
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                dx={-10}
              />

              <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'hsl(var(--muted))', strokeWidth: 2 }} />

              <Legend 
                verticalAlign="top" 
                height={36} 
                iconType="circle"
                wrapperStyle={{ fontSize: '13px', fontWeight: 500, color: 'hsl(var(--foreground))' }}
              />

              <Line
                name="Overall"
                type="monotone"
                dataKey="overall"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ r: 4, strokeWidth: 2, fill: "var(--background)" }}
                activeDot={{ r: 6, strokeWidth: 0 }}
              />

              <Line
                name="Technical"
                type="monotone"
                dataKey="technical"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ r: 4, strokeWidth: 2, fill: "var(--background)" }}
                activeDot={{ r: 6, strokeWidth: 0 }}
              />

              <Line
                name="Non-Technical"
                type="monotone"
                dataKey="nonTechnical"
                stroke="#f59e0b"
                strokeWidth={3}
                dot={{ r: 4, strokeWidth: 2, fill: "var(--background)" }}
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}