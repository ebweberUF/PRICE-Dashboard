"use client"

import Link from "next/link"
import CardBox from "@/app/components/shared/CardBox"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useState } from "react"

type VisitStatus = "scheduled" | "completed" | "missed" | "pending" | "cancelled"

interface Visit {
  id: number
  subjectId: string
  visitName: string
  scheduledDay: number
  completedDay: number | null
  windowStart: number
  windowEnd: number
  status: VisitStatus
}

// Visit schedule configuration - customize for GALLOP
const VISIT_SCHEDULE = [
  { name: "Screening", day: -7, window: 7 },
  { name: "Baseline", day: 0, window: 0 },
  { name: "Week 1", day: 7, window: 3 },
  { name: "Week 2", day: 14, window: 3 },
  { name: "Month 1", day: 30, window: 7 },
  { name: "Month 3", day: 90, window: 14 },
  { name: "Month 6", day: 180, window: 14 },
]

// Mock data - will be replaced with API calls
const mockVisits: Visit[] = [
  // Empty for now - will be populated from PRICE backend
]

const statusConfig: Record<VisitStatus, { label: string; className: string; icon: string }> = {
  scheduled: {
    label: "Scheduled",
    className: "bg-blue-100 text-blue-700 border-blue-200",
    icon: "solar:calendar-linear",
  },
  pending: {
    label: "Pending",
    className: "bg-warning/10 text-warning border-warning/20",
    icon: "solar:clock-circle-linear",
  },
  completed: {
    label: "Completed",
    className: "bg-success/10 text-success border-success/20",
    icon: "solar:check-circle-linear",
  },
  missed: {
    label: "Missed",
    className: "bg-error/10 text-error border-error/20",
    icon: "solar:close-circle-linear",
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-gray-100 text-gray-700 border-gray-200",
    icon: "solar:forbidden-linear",
  },
}

function formatRelativeDays(days: number): string {
  if (days === 0) return "Day 0"
  return `Day ${days}`
}

export default function GallopVisitsPage() {
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [visitTypeFilter, setVisitTypeFilter] = useState<string>("all")

  const filteredVisits = mockVisits.filter((v) => {
    const matchesStatus = statusFilter === "all" || v.status === statusFilter
    const matchesVisitType = visitTypeFilter === "all" || v.visitName === visitTypeFilter
    return matchesStatus && matchesVisitType
  })

  // Calculate visit stats
  const visitStats = {
    upcoming: mockVisits.filter((v) => v.status === "scheduled" || v.status === "pending").length,
    completed: mockVisits.filter((v) => v.status === "completed").length,
    missed: mockVisits.filter((v) => v.status === "missed").length,
    total: mockVisits.length,
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-bodytext dark:text-darklink">
        <Link href="/studies/gallop" className="hover:text-primary">
          GALLOP
        </Link>
        <Icon icon="solar:arrow-right-linear" height={16} />
        <span className="text-charcoal dark:text-white">Visits</span>
      </div>

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-charcoal dark:text-white">Visit Tracking</h1>
          <p className="text-bodytext dark:text-darklink">
            Monitor participant visit schedule and completion
          </p>
        </div>
        <Button variant="outline" className="gap-2">
          <Icon icon="solar:export-linear" height={18} />
          Export
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <CardBox className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon icon="solar:calendar-bold" height={20} className="text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-charcoal dark:text-white">{visitStats.upcoming}</p>
              <p className="text-sm text-bodytext dark:text-darklink">Upcoming</p>
            </div>
          </div>
        </CardBox>

        <CardBox className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
              <Icon icon="solar:check-circle-bold" height={20} className="text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold text-charcoal dark:text-white">{visitStats.completed}</p>
              <p className="text-sm text-bodytext dark:text-darklink">Completed</p>
            </div>
          </div>
        </CardBox>

        <CardBox className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-error/10 rounded-lg flex items-center justify-center">
              <Icon icon="solar:close-circle-bold" height={20} className="text-error" />
            </div>
            <div>
              <p className="text-2xl font-bold text-charcoal dark:text-white">{visitStats.missed}</p>
              <p className="text-sm text-bodytext dark:text-darklink">Missed</p>
            </div>
          </div>
        </CardBox>

        <CardBox className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
              <Icon icon="solar:chart-square-bold" height={20} className="text-gray-600 dark:text-gray-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-charcoal dark:text-white">
                {visitStats.total > 0
                  ? Math.round((visitStats.completed / visitStats.total) * 100)
                  : 0}%
              </p>
              <p className="text-sm text-bodytext dark:text-darklink">Completion Rate</p>
            </div>
          </div>
        </CardBox>
      </div>

      {/* Visit Schedule Reference */}
      <CardBox className="p-4">
        <h3 className="font-semibold text-charcoal dark:text-white mb-3">Visit Schedule</h3>
        <div className="flex flex-wrap gap-2">
          {VISIT_SCHEDULE.map((visit) => (
            <div
              key={visit.name}
              className="px-3 py-1.5 bg-lightgray dark:bg-darkborder rounded-lg text-sm"
            >
              <span className="font-medium text-charcoal dark:text-white">{visit.name}</span>
              <span className="text-bodytext dark:text-darklink ml-2">
                Day {visit.day} (±{visit.window})
              </span>
            </div>
          ))}
        </div>
      </CardBox>

      {/* Filters */}
      <CardBox className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="missed">Missed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>

          <Select value={visitTypeFilter} onValueChange={setVisitTypeFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by visit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Visits</SelectItem>
              {VISIT_SCHEDULE.map((visit) => (
                <SelectItem key={visit.name} value={visit.name}>
                  {visit.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardBox>

      {/* Visits Table */}
      <CardBox className="p-0 overflow-hidden">
        {filteredVisits.length === 0 ? (
          <div className="text-center py-12">
            <Icon icon="solar:calendar-linear" height={48} className="mx-auto text-bodytext/50 mb-3" />
            <p className="text-lg font-medium text-charcoal dark:text-white">No visits scheduled</p>
            <p className="text-bodytext dark:text-darklink mt-1">
              Visits will appear here once participants are enrolled and synced
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-lightgray dark:bg-darkborder">
                <TableHead className="font-semibold">Subject ID</TableHead>
                <TableHead className="font-semibold">Visit</TableHead>
                <TableHead className="font-semibold">Scheduled</TableHead>
                <TableHead className="font-semibold">Window</TableHead>
                <TableHead className="font-semibold">Completed</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVisits.map((visit) => (
                <TableRow key={visit.id} className="hover:bg-lightgray/50 dark:hover:bg-darkborder/50">
                  <TableCell>
                    <Link
                      href={`/studies/gallop/participants/${visit.subjectId}`}
                      className="font-medium text-primary hover:underline"
                    >
                      {visit.subjectId}
                    </Link>
                  </TableCell>
                  <TableCell className="font-medium text-charcoal dark:text-white">
                    {visit.visitName}
                  </TableCell>
                  <TableCell className="text-bodytext dark:text-darklink">
                    {formatRelativeDays(visit.scheduledDay)}
                  </TableCell>
                  <TableCell className="text-bodytext dark:text-darklink">
                    {formatRelativeDays(visit.windowStart)} - {formatRelativeDays(visit.windowEnd)}
                  </TableCell>
                  <TableCell className="text-bodytext dark:text-darklink">
                    {visit.completedDay !== null ? formatRelativeDays(visit.completedDay) : "-"}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={statusConfig[visit.status].className}>
                      <Icon
                        icon={statusConfig[visit.status].icon}
                        height={14}
                        className="mr-1"
                      />
                      {statusConfig[visit.status].label}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardBox>

      {/* HIPAA Notice */}
      <div className="flex items-center gap-2 text-sm text-bodytext dark:text-darklink">
        <Icon icon="solar:shield-check-linear" height={16} className="text-success" />
        <span>All dates shown as relative days since enrollment (Limited Data Set)</span>
      </div>
    </div>
  )
}
