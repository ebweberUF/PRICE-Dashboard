"use client"

import Link from "next/link"
import CardBox from "../../components/shared/CardBox"
import { Icon } from "@iconify/react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const studies = [
  {
    id: 1,
    code: "CPAIN-001",
    name: "Chronic Pain Intervention Study",
    lab: "Pain Management Lab",
    irbNumber: "IRB-2024-001",
    participants: 45,
    target: 150,
    startYear: 2024,
    endYear: 2026,
    active: true,
  },
  {
    id: 2,
    code: "OPIOID-002",
    name: "Opioid Reduction Protocol",
    lab: "Pain Management Lab",
    irbNumber: "IRB-2024-045",
    participants: 78,
    target: 200,
    startYear: 2024,
    endYear: null,
    active: true,
  },
  {
    id: 3,
    code: "NEURO-003",
    name: "Neural Pathways in Pain Perception",
    lab: "Neuroscience Research Lab",
    irbNumber: "IRB-2023-112",
    participants: 32,
    target: 75,
    startYear: 2023,
    endYear: 2025,
    active: true,
  },
  {
    id: 4,
    code: "TMJ-004",
    name: "TMJ Disorder Treatment Study",
    lab: "Pain Management Lab",
    irbNumber: "IRB-2024-089",
    participants: 12,
    target: 100,
    startYear: 2024,
    endYear: 2027,
    active: true,
  },
]

export default function StudiesPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-charcoal dark:text-white">Studies</h1>
          <p className="text-bodytext dark:text-darklink">Manage clinical research studies</p>
        </div>
        <Button className="gap-2">
          <Icon icon="solar:add-circle-linear" height={18} width={18} />
          Add Study
        </Button>
      </div>

      {/* Studies Table */}
      <CardBox className="p-0 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-lightgray dark:bg-darkborder">
              <TableHead className="font-semibold">Study</TableHead>
              <TableHead className="font-semibold">Lab</TableHead>
              <TableHead className="font-semibold">IRB #</TableHead>
              <TableHead className="font-semibold">Enrollment</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {studies.map((study) => {
              const progress = Math.round((study.participants / study.target) * 100)
              return (
                <TableRow key={study.id} className="hover:bg-lightgray/50 dark:hover:bg-darkborder/50">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                        <Icon icon="solar:clipboard-list-bold" height={20} width={20} className="text-success" />
                      </div>
                      <div>
                        <Link
                          href={`/studies/${study.id}`}
                          className="font-medium text-charcoal dark:text-white hover:text-primary"
                        >
                          {study.name}
                        </Link>
                        <p className="text-xs text-bodytext dark:text-darklink">{study.code}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-bodytext dark:text-darklink">{study.lab}</TableCell>
                  <TableCell className="text-bodytext dark:text-darklink">{study.irbNumber}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-charcoal dark:text-white font-medium">
                          {study.participants} / {study.target}
                        </span>
                        <span className="text-bodytext dark:text-darklink text-xs">{progress}%</span>
                      </div>
                      <div className="w-24 bg-lightgray dark:bg-darkborder rounded-full h-1.5">
                        <div
                          className="bg-primary h-1.5 rounded-full transition-all"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <p className="text-xs text-bodytext dark:text-darklink">
                        {study.startYear} - {study.endYear || "Present"}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={study.active ? "bg-success/10 text-success border-success/20" : "bg-gray-100 text-gray-600"}
                    >
                      {study.active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Link
                      href={`/studies/${study.id}`}
                      className="text-primary hover:underline font-medium text-sm"
                    >
                      View
                    </Link>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </CardBox>
    </div>
  )
}
