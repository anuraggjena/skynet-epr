"use client"

import { useState } from "react"
import { updateEpr } from "@/lib/api"

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
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, User, FileText, Edit2, Loader2, Save } from "lucide-react"

export default function EprDialog({ epr, open, onClose, onUpdated, readOnly = false }: any) {
  const [editing, setEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const [overall, setOverall] = useState(epr?.overallRating || 0)
  const [technical, setTechnical] = useState(epr?.technicalSkillsRating || 0)
  const [nonTechnical, setNonTechnical] = useState(epr?.nonTechnicalSkillsRating || 0)
  const [remarks, setRemarks] = useState(epr?.remarks || "")
  const [status, setStatus] = useState(epr?.status || "draft")

  function handleClose() {
    setEditing(false)
    onClose()
  }

  async function handleSave() {
    setIsSaving(true)
    try {
      await updateEpr(epr.id, {
        overallRating: Number(overall),
        technicalSkillsRating: Number(technical),
        nonTechnicalSkillsRating: Number(nonTechnical),
        remarks,
        status
      })
      setEditing(false)
      if (onUpdated) onUpdated()
    } catch (error) {
      console.error("Failed to update EPR", error)
    } finally {
      setIsSaving(false)
    }
  }

  function formatDate(d: string) {
    if (!d) return "N/A"
    return new Date(d).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    })
  }

  function getStatusBadge(currentStatus: string) {
    switch (currentStatus.toLowerCase()) {
      case "submitted":
        return <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-400">Submitted</Badge>
      case "archived":
        return <Badge variant="secondary">Archived</Badge>
      default:
        return <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50 dark:bg-amber-900/10 dark:border-amber-900/50">Draft</Badge>
    }
  }

  if (!epr) return null

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-4xl max-h-[85vh] flex flex-col p-0 overflow-hidden bg-background">
        
        <DialogHeader className="p-6 pb-4 pr-10 border-b bg-muted/10 shrink-0">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <DialogTitle className="text-xl flex items-center gap-2">
                Evaluation Report
                {getStatusBadge(epr.status)}
              </DialogTitle>
              <DialogDescription>
                Detailed breakdown of performance metrics and instructor remarks.
              </DialogDescription>
            </div>
            {!editing && !readOnly && (
              <Button variant="outline" size="lg" onClick={() => setEditing(true)} className="hidden sm:flex items-center gap-2">
                <Edit2 className="w-4 h-4" /> Edit
              </Button>
            )}
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-6">
          {!editing ? (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 animate-in fade-in zoom-in-95 duration-200">
              
              <div className="md:col-span-4 space-y-6">
                
                <div className="bg-muted/30 p-4 rounded-xl border border-border/50 space-y-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                      <User className="w-3.5 h-3.5" /> Subject
                    </div>
                    <div className="font-semibold text-sm text-foreground">
                      {epr.studentName || epr.personName}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                      <Calendar className="w-3.5 h-3.5" /> Period
                    </div>
                    <div className="font-semibold text-sm text-foreground">
                      {formatDate(epr.periodStart)} — {formatDate(epr.periodEnd)}
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="border bg-primary/5 border-primary/10 rounded-xl p-4 flex flex-col items-center justify-center text-center space-y-1">
                    <span className="text-[10px] font-bold text-primary uppercase tracking-wider">Overall</span>
                    <span className="text-3xl font-bold tracking-tighter">{epr.overallRating}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="border bg-card rounded-xl p-3 flex flex-col items-center justify-center text-center shadow-sm">
                      <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1">Technical</span>
                      <span className="text-xl font-semibold">{epr.technicalSkillsRating}</span>
                    </div>
                    <div className="border bg-card rounded-xl p-3 flex flex-col items-center justify-center text-center shadow-sm">
                      <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1">Soft Skills</span>
                      <span className="text-xl font-semibold">{epr.nonTechnicalSkillsRating}</span>
                    </div>
                  </div>
                </div>

                <div className="sm:hidden pt-2">
                  {!readOnly && (
                    <Button className="w-full" onClick={() => setEditing(true)}>
                    <Edit2 className="w-4 h-4 mr-2" /> Edit Evaluation
                  </Button>
                  )}
                </div>

              </div>

              <div className="md:col-span-8 flex flex-col h-full">
                <div className="flex items-center gap-1.5 text-sm font-semibold text-foreground mb-3">
                  <FileText className="w-4 h-4 text-muted-foreground" /> Instructor Remarks
                </div>
                <div className="border rounded-xl p-5 text-sm text-foreground leading-relaxed bg-card shadow-sm flex-1 whitespace-pre-wrap">
                  {epr.remarks || <span className="italic text-muted-foreground">No remarks provided for this evaluation.</span>}
                </div>
              </div>

            </div>
          ) : (
            <div className="space-y-6 animate-in slide-in-from-right-2 duration-200 max-w-2xl mx-auto">
              
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="overall" className="text-xs font-bold uppercase text-primary">Overall</Label>
                  <Input id="overall" type="number" min={1} max={5} step={0.1} value={overall} onChange={(e) => setOverall(e.target.value)} className="font-semibold text-lg" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="technical" className="text-xs uppercase text-muted-foreground">Technical</Label>
                  <Input id="technical" type="number" min={1} max={5} step={0.1} value={technical} onChange={(e) => setTechnical(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nonTechnical" className="text-xs uppercase text-muted-foreground">Soft Skills</Label>
                  <Input id="nonTechnical" type="number" min={1} max={5} step={0.1} value={nonTechnical} onChange={(e) => setNonTechnical(e.target.value)} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="remarks">Instructor Remarks</Label>
                <Textarea id="remarks" value={remarks} onChange={(e) => setRemarks(e.target.value)} className="min-h-62.5 resize-y" />
              </div>

              <div className="space-y-2">
                <Label>Evaluation Status</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft (Needs Review)</SelectItem>
                    <SelectItem value="submitted">Submitted (Final)</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>

            </div>
          )}
        </div>

        {editing && (
          <DialogFooter className="p-8 border-t bg-muted/10 shrink-0">
            <div className="flex items-center justify-end gap-2 w-full">
              <Button type="button" variant="ghost" onClick={() => setEditing(false)} disabled={isSaving}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving...</>
                ) : (
                  <><Save className="w-4 h-4 mr-2" />Save Changes</>
                )}
              </Button>
            </div>
          </DialogFooter>
        )}

      </DialogContent>
    </Dialog>
  )
}