"use client"

import { useState } from "react"
import { createEpr, generateRemarks } from "@/lib/api"
import { getSession } from "@/lib/session"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Sparkles, Loader2, Save, Calendar, User } from "lucide-react"

type Props = {
  open: boolean
  onClose: () => void
  personId: string
  personName: string
  courseName?: string
  onCreated: () => void
}

export default function NewEprDialog({
  open,
  onClose,
  personId,
  personName,
  courseName,
  onCreated
}: Props) {
  const session = getSession()

  const [overall, setOverall] = useState<number | string>(4)
  const [technical, setTechnical] = useState<number | string>(4)
  const [nonTechnical, setNonTechnical] = useState<number | string>(4)

  const [periodStart, setPeriodStart] = useState("")
  const [periodEnd, setPeriodEnd] = useState("")

  const [remarks, setRemarks] = useState("")
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  async function handleGenerateRemarks() {
    setLoading(true)
    try {
      const res = await generateRemarks({
        overallRating: Number(overall),
        technicalSkillsRating: Number(technical),
        nonTechnicalSkillsRating: Number(nonTechnical),
        personName,
        role: "student",
        course: courseName ?? "Flight Training"
      })
      setRemarks(res.suggestedRemarks)
    } catch (error) {
      console.error("AI generation failed", error)
      alert("Failed to generate AI remarks")
    } finally {
      setLoading(false)
    }
  }

  async function handleSave() {
    if (saving) return
    if (!periodStart || !periodEnd) {
      alert("Please select period start and end dates")
      return
    }

    try {
      setSaving(true)
      await createEpr({
        personId,
        evaluatorId: session.id,
        roleType: "student",
        periodStart: new Date(periodStart).toISOString(),
        periodEnd: new Date(periodEnd).toISOString(),
        overallRating: Number(overall),
        technicalSkillsRating: Number(technical),
        nonTechnicalSkillsRating: Number(nonTechnical),
        remarks,
        status: "draft"
      })
      await onCreated()
      onClose()
    } catch (error) {
      console.error("EPR creation failed", error)
      alert("Failed to create EPR")
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-137.5 overflow-hidden p-0">
        
        <DialogHeader className="p-6 pb-4 border-b bg-muted/20">
          <DialogTitle className="text-xl">Create Evaluation</DialogTitle>
          <DialogDescription>
            Submit a new performance report for <span className="font-semibold text-foreground">{personName}</span>.
          </DialogDescription>
        </DialogHeader>

        <div className="p-6 space-y-6">
          
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Calendar className="w-4 h-4 text-muted-foreground" /> Evaluation Period
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="periodStart" className="text-xs text-muted-foreground">Start Date</Label>
                <Input
                  id="periodStart"
                  type="date"
                  value={periodStart}
                  onChange={(e) => setPeriodStart(e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="periodEnd" className="text-xs text-muted-foreground">End Date</Label>
                <Input
                  id="periodEnd"
                  type="date"
                  value={periodEnd}
                  onChange={(e) => setPeriodEnd(e.target.value)}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <User className="w-4 h-4 text-muted-foreground" /> Performance Metrics
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="overall" className="text-xs font-bold text-primary uppercase">Overall</Label>
                <Input
                  id="overall"
                  type="number"
                  min={1} max={5} step={0.1}
                  value={overall}
                  onChange={(e) => setOverall(e.target.value)}
                  className="font-semibold text-lg"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="technical" className="text-xs text-muted-foreground uppercase">Technical</Label>
                <Input
                  id="technical"
                  type="number"
                  min={1} max={5} step={0.1}
                  value={technical}
                  onChange={(e) => setTechnical(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="nonTechnical" className="text-xs text-muted-foreground uppercase">Non-Technical</Label>
                <Input
                  id="nonTechnical"
                  type="number"
                  min={1} max={5} step={0.1}
                  value={nonTechnical}
                  onChange={(e) => setNonTechnical(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="remarks" className="text-sm font-semibold">Instructor Remarks</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 text-xs bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100 hover:text-indigo-800 dark:bg-indigo-950/30 dark:text-indigo-300 dark:border-indigo-800 dark:hover:bg-indigo-900/50 transition-colors"
                onClick={handleGenerateRemarks}
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                )}
                Auto-Generate
              </Button>
            </div>
            <Textarea
              id="remarks"
              placeholder="Provide specific feedback, or use the auto-generate button based on the scores above..."
              className="min-h-30 resize-none"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
            />
          </div>

        </div>

        <DialogFooter className="p-8 border-t bg-muted/10">
          <div className="flex items-center justify-end gap-2 w-full">
            <Button variant="ghost" onClick={onClose} disabled={saving || loading}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving || loading}>
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Draft
                </>
              )}
            </Button>
          </div>
        </DialogFooter>

      </DialogContent>
    </Dialog>
  )
}