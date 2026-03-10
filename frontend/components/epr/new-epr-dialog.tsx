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
import { Sparkles, Loader2, Save, Calendar, User, FileText, X } from "lucide-react"

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
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[85vh] flex flex-col p-0 overflow-hidden bg-background">
        
        <DialogHeader className="p-6 pb-4 border-b bg-muted/10">
          <div className="space-y-1">
            <DialogTitle className="text-xl">Create Evaluation</DialogTitle>
            <DialogDescription>
              Submit a new performance report for <span className="font-semibold text-foreground">{personName}</span>.
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
            
            <div className="md:col-span-4 p-6 border-r border-border/50 bg-muted/5 space-y-8">
              
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                  <Calendar className="w-3.5 h-3.5" /> Period
                </div>
                <div className="grid gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="periodStart" className="text-xs">Start Date</Label>
                    <Input id="periodStart" type="date" value={periodStart} onChange={(e) => setPeriodStart(e.target.value)} />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="periodEnd" className="text-xs">End Date</Label>
                    <Input id="periodEnd" type="date" value={periodEnd} onChange={(e) => setPeriodEnd(e.target.value)} />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                  <User className="w-3.5 h-3.5" /> Performance
                </div>
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="overall" className="text-xs font-bold text-primary">Overall Rating</Label>
                    <Input id="overall" type="number" min={1} max={5} step={0.1} value={overall} onChange={(e) => setOverall(e.target.value)} className="font-bold text-lg" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="technical" className="text-[10px] uppercase font-bold text-muted-foreground">Technical</Label>
                      <Input id="technical" type="number" min={1} max={5} step={0.1} value={technical} onChange={(e) => setTechnical(e.target.value)} />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="nonTechnical" className="text-[10px] uppercase font-bold text-muted-foreground">Soft Skills</Label>
                      <Input id="nonTechnical" type="number" min={1} max={5} step={0.1} value={nonTechnical} onChange={(e) => setNonTechnical(e.target.value)} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="md:col-span-8 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <FileText className="w-4 h-4 text-muted-foreground" /> Instructor Remarks
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-8 text-[11px] font-bold uppercase tracking-wider bg-primary/5 border-primary/20 text-primary hover:bg-primary/10 transition-all shadow-sm"
                  onClick={handleGenerateRemarks}
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="w-3 h-3 mr-2 animate-spin" />
                  ) : (
                    <Sparkles className="w-3 h-3 mr-2 text-primary" />
                  )}
                  Auto-Generate with AI
                </Button>
              </div>
              
              <Textarea
                id="remarks"
                placeholder="The AI will generate detailed feedback based on the scores provided, or you can type your own..."
                className="min-h-100 md:min-h-0 md:h-[calc(85vh-250px)] resize-none p-4 text-sm leading-relaxed"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
              />
            </div>

          </div>
        </div>

        <DialogFooter className="p-4 border-t bg-muted/5">
          <div className="flex items-center justify-end gap-2 w-full">
            <Button variant="ghost" onClick={onClose} disabled={saving || loading}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving || loading} className="min-w-30">
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