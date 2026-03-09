"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"

import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import EprDialog from "./epr-dialog"

type Props = {
  eprs: any[]
  onUpdated?: () => void
  readOnly?: boolean,
  isLoading?: boolean
}

function uniquePeriods(eprs: any[]) {

  const map = new Map<string, any>()

  for (const e of eprs) {

    const key = `${new Date(e.periodStart).getTime()}`

    if (!map.has(key)) {
      map.set(key, e)
    }

  }

  return Array.from(map.values())

}

function formatPeriod(start: string, end: string) {

  const s = new Date(start)
  const e = new Date(end)

  const sm = s.toLocaleString("default", { month: "short" })
  const em = e.toLocaleString("default", { month: "short" })

  return `${sm} – ${em} ${e.getFullYear()}`
}

export default function EprList({
  eprs,
  onUpdated,
  readOnly,
  isLoading
}: Props) {

  const [selected, setSelected] = useState<any>(null)

  const rows = readOnly ? eprs : uniquePeriods(eprs)

  if (!rows.length) {

    return (
      <div className="border rounded-lg p-6 text-center text-sm text-muted-foreground">
        No evaluations yet.
      </div>
    )

  }

  return (

    <>

      <Table>

        <TableHeader>
          <TableRow>
            <TableHead>Period</TableHead>
            <TableHead>Overall</TableHead>
            <TableHead>Technical</TableHead>
            <TableHead>Non Technical</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>

          {rows.map((epr) => (

            <TableRow
              key={epr.id}
              className="cursor-pointer hover:bg-muted"
              onClick={() => setSelected(epr)}
            >

              <TableCell>
                {formatPeriod(epr.periodStart, epr.periodEnd)}
              </TableCell>

              <TableCell>{epr.overallRating}</TableCell>
              <TableCell>{epr.technicalSkillsRating}</TableCell>
              <TableCell>{epr.nonTechnicalSkillsRating}</TableCell>

              <TableCell>
                <Badge>{epr.status}</Badge>
              </TableCell>

            </TableRow>

          ))}

        </TableBody>

      </Table>

      {selected && (

        <EprDialog
          epr={selected}
          open={true}
          readOnly={readOnly}
          onClose={() => setSelected(null)}
          onUpdated={onUpdated}
        />

      )}

    </>

  )

}