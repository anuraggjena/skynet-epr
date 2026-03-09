import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import RatingStars from "@/components/ui/rating-stars"
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Code2, 
  Users, 
  FileCheck2, 
  AlertCircle 
} from "lucide-react"

type Summary = {
  averageOverallRating: number
  averageTechnicalRating: number
  averageNonTechnicalRating: number
  eprCount: number
  trend: "improving" | "declining" | "stable"
}

function TrendBadge({ trend }: { trend: Summary["trend"] }) {
  const config = {
    improving: { 
      icon: TrendingUp, 
      color: "text-emerald-600 dark:text-emerald-400", 
      bg: "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200/50 dark:border-emerald-800/50", 
      label: "Improving" 
    },
    declining: { 
      icon: TrendingDown, 
      color: "text-rose-600 dark:text-rose-400", 
      bg: "bg-rose-50 dark:bg-rose-900/20 border-rose-200/50 dark:border-rose-800/50", 
      label: "Declining" 
    },
    stable: { 
      icon: Minus, 
      color: "text-slate-600 dark:text-slate-400", 
      bg: "bg-slate-50 dark:bg-slate-800/50 border-slate-200/50 dark:border-slate-700/50", 
      label: "Stable" 
    },
  }
  const { icon: Icon, color, bg, label } = config[trend] || config.stable
  return (
    <Badge variant="outline" className={`flex items-center gap-1 px-2 py-0.5 rounded-full ${bg} ${color}`}>
      <Icon className="w-3 h-3" />
      <span className="font-medium text-[10px] uppercase tracking-wider">{label}</span>
    </Badge>
  )
}

export default function PerformanceCard({ 
  summary, 
  isLoading = false 
}: { 
  summary?: Summary | null
  isLoading?: boolean 
}) {

  if (isLoading) {
    return (
      <Card className="h-full shadow-sm">
        <CardHeader className="pb-6 border-b border-border/50">
          <Skeleton className="h-6 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2" />
        </CardHeader>
        <CardContent className="pt-8 space-y-8">
          <Skeleton className="h-20 w-full rounded-xl" />
          <div className="space-y-4">
            <Skeleton className="h-12 w-full rounded-lg" />
            <Skeleton className="h-12 w-full rounded-lg" />
            <Skeleton className="h-12 w-full rounded-lg" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!summary || summary.eprCount === 0) {
    return (
      <Card className="h-full border-dashed shadow-sm flex items-center justify-center p-8">
        <div className="text-center">
          <AlertCircle className="w-8 h-8 mx-auto text-muted-foreground/40 mb-3" />
          <h3 className="text-sm font-semibold">No Data Available</h3>
        </div>
      </Card>
    )
  }

  const formatScore = (val: number) => Number(val || 0).toFixed(2)

  return (
    <Card className="h-full shadow-xl shadow-slate-200/50 dark:shadow-none border-none bg-white dark:bg-slate-900 overflow-hidden">
      
      <CardHeader className="pb-6 border-b border-border/50 px-6 pt-6">
        <div className="flex items-center justify-between mb-1">
          <CardTitle className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
            Performance Overview
          </CardTitle>
          <TrendBadge trend={summary.trend} />
        </div>
        <CardDescription className="text-xs font-medium">
          Aggregated from {summary.eprCount} evaluations
        </CardDescription>
      </CardHeader>

      <CardContent className="px-6 pt-8 pb-8 space-y-10">
        
        <div className="space-y-3">
          <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">
            Cumulative Overall Score
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black tracking-tighter text-slate-900 dark:text-white leading-none">
              {formatScore(summary.averageOverallRating)}
            </span>
            <span className="text-sm font-bold text-muted-foreground italic">/ 5.00</span>
          </div>
          <div className="pt-1">
            <RatingStars value={summary.averageOverallRating} size={20} />
          </div>
        </div>

        <div className="space-y-6 pt-2">
          
          <div className="flex items-center justify-between group">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600 transition-colors group-hover:bg-blue-100">
                <Code2 className="w-4 h-4" />
              </div>
              <span className="text-md font-semibold text-slate-600 dark:text-slate-400">Technical</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-bold text-slate-900 dark:text-white">{formatScore(summary.averageTechnicalRating)}</span>
              <RatingStars value={summary.averageTechnicalRating} size={15} />
            </div>
          </div>

          <div className="flex items-center justify-between group">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-purple-600 transition-colors group-hover:bg-purple-100">
                <Users className="w-4 h-4" />
              </div>
              <span className="text-md font-semibold text-slate-600 dark:text-slate-400">Non-Technical</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-bold text-slate-900 dark:text-white">{formatScore(summary.averageNonTechnicalRating)}</span>
              <RatingStars value={summary.averageNonTechnicalRating} size={15}/>
            </div>
          </div>

          <div className="flex items-center justify-between group">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg text-emerald-600 transition-colors group-hover:bg-emerald-100">
                <FileCheck2 className="w-4 h-4" />
              </div>
              <span className="text-md font-semibold text-slate-600 dark:text-slate-400">Submissions</span>
            </div>
            <span className="font-bold text-slate-900 dark:text-white mr-1">{summary.eprCount} Total</span>
          </div>

        </div>
      </CardContent>
    </Card>
  )
}