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
import { useState, useEffect } from "react"

type VisitStatus = "scheduled" | "completed" | "missed" | "pending" | "cancelled"

interface SharePointVisit {
  id: string
  title: string
  subjectId: string
  visitType: string
  startDate: string
  endDate: string
  status: string
  location: string
  notes: string
}

interface VisitStats {
  total: number
  scheduled: number
  completed: number
  missed: number
}

const statusConfig: Record<string, { label: string; className: string; icon: string }> = {
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

function formatDate(dateString: string): string {
  if (!dateString) return "-"
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  } catch {
    return dateString
  }
}

function formatTime(dateString: string): string {
  if (!dateString) return ""
  try {
    const date = new Date(dateString)
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    })
  } catch {
    return ""
  }
}

function normalizeStatus(status: string): string {
  const s = (status || "scheduled").toLowerCase()
  if (s.includes("complete")) return "completed"
  if (s.includes("miss")) return "missed"
  if (s.includes("cancel")) return "cancelled"
  if (s.includes("pending")) return "pending"
  return "scheduled"
}

export default function GallopVisitsPage() {
  const [visits, setVisits] = useState<SharePointVisit[]>([])
  const [stats, setStats] = useState<VisitStats>({ total: 0, scheduled: 0, completed: 0, missed: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [visitTypeFilter, setVisitTypeFilter] = useState<string>("all")

  // Fetch visits from API
  useEffect(() => {
    async function fetchVisits() {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch("/api/studies/gallop/visits")

        if (!response.ok) {
          throw new Error(`Failed to fetch visits: ${response.statusText}`)
        }

        const data = await response.json()

        if (data.success) {
          setVisits(data.data.visits || [])
          setStats(data.data.stats || { total: 0, scheduled: 0, completed: 0, missed: 0 })
        } else {
          throw new Error(data.message || "Failed to fetch visits")
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
        console.error("Error fetching visits:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchVisits()
  }, [])

  // Get unique visit types for filter
  const visitTypes = [...new Set(visits.map((v) => v.visitType).filter(Boolean))]

  // Filter visits
  const filteredVisits = visits.filter((v) => {
    const normalizedStatus = normalizeStatus(v.status)
    const matchesStatus = statusFilter === "all" || normalizedStatus === statusFilter
    const matchesVisitType = visitTypeFilter === "all" || v.visitType === visitTypeFilter
    return matchesStatus && matchesVisitType
  })

  const handleRefresh = () => {
    setLoading(true)
    window.location.reload()
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
            Monitor participant visit schedule from SharePoint
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2" onClick={handleRefresh} disabled={loading}>
            <Icon icon="solar:refresh-linear" height={18} className={loading ? "animate-spin" : ""} />
            Refresh
          </Button>
          <Button variant="outline" className="gap-2">
            <Icon icon="solar:export-linear" height={18} />
            Export
          </Button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <CardBox className="p-4 bg-error/10 border-error/20">
          <div className="flex items-center gap-3">
            <Icon icon="solar:danger-triangle-bold" height={24} className="text-error" />
            <div>
              <p className="font-medium text-error">Error loading visits</p>
              <p className="text-sm text-bodytext dark:text-darklink">{error}</p>
            </div>
          </div>
        </CardBox>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <CardBox className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon icon="solar:calendar-bold" height={20} className="text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-charcoal dark:text-white">
                {loading ? "-" : stats.scheduled}
              </p>
              <p className="text-sm text-bodytext dark:text-darklink">Scheduled</p>
            </div>
          </div>
        </CardBox>

        <CardBox className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
              <Icon icon="solar:check-circle-bold" height={20} className="text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold text-charcoal dark:text-white">
                {loading ? "-" : stats.completed}
              </p>
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
              <p className="text-2xl font-bold text-charcoal dark:text-white">
                {loading ? "-" : stats.missed}
              </p>
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
                {loading ? "-" : stats.total}
              </p>
              <p className="text-sm text-bodytext dark:text-darklink">Total Visits</p>
            </div>
          </div>
        </CardBox>
      </div>

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

          {visitTypes.length > 0 && (
            <Select value={visitTypeFilter} onValueChange={setVisitTypeFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by visit type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Visit Types</SelectItem>
                {visitTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </CardBox>

      {/* Visits Table */}
      <CardBox className="p-0 overflow-hidden">
        {loading ? (
          <div className="text-center py-12">
            <Icon icon="solar:refresh-linear" height={48} className="mx-auto text-primary animate-spin mb-3" />
            <p className="text-lg font-medium text-charcoal dark:text-white">Loading visits...</p>
            <p className="text-bodytext dark:text-darklink mt-1">
              Fetching data from SharePoint
            </p>
          </div>
        ) : filteredVisits.length === 0 ? (
          <div className="text-center py-12">
            <Icon icon="solar:calendar-linear" height={48} className="mx-auto text-bodytext/50 mb-3" />
            <p className="text-lg font-medium text-charcoal dark:text-white">No visits found</p>
            <p className="text-bodytext dark:text-darklink mt-1">
              {visits.length === 0
                ? "No visits in SharePoint VisitScheduler list"
                : "No visits match the current filters"}
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-lightgray dark:bg-darkborder">
                <TableHead className="font-semibold">Title</TableHead>
                <TableHead className="font-semibold">Subject ID</TableHead>
                <TableHead className="font-semibold">Visit Type</TableHead>
                <TableHead className="font-semibold">Date</TableHead>
                <TableHead className="font-semibold">Time</TableHead>
                <TableHead className="font-semibold">Location</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVisits.map((visit) => {
                const normalizedStatus = normalizeStatus(visit.status)
                const config = statusConfig[normalizedStatus] || statusConfig.scheduled

                return (
                  <TableRow key={visit.id} className="hover:bg-lightgray/50 dark:hover:bg-darkborder/50">
                    <TableCell className="font-medium text-charcoal dark:text-white">
                      {visit.title || "-"}
                    </TableCell>
                    <TableCell>
                      {visit.subjectId ? (
                        <Link
                          href={`/studies/gallop/participants/${visit.subjectId}`}
                          className="font-medium text-primary hover:underline"
                        >
                          {visit.subjectId}
                        </Link>
                      ) : (
                        <span className="text-bodytext dark:text-darklink">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-bodytext dark:text-darklink">
                      {visit.visitType || "-"}
                    </TableCell>
                    <TableCell className="text-bodytext dark:text-darklink">
                      {formatDate(visit.startDate)}
                    </TableCell>
                    <TableCell className="text-bodytext dark:text-darklink">
                      {formatTime(visit.startDate)}
                    </TableCell>
                    <TableCell className="text-bodytext dark:text-darklink">
                      {visit.location || "-"}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={config.className}>
                        <Icon icon={config.icon} height={14} className="mr-1" />
                        {config.label}
                      </Badge>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        )}
      </CardBox>

      {/* Data Source Notice */}
      <div className="flex items-center gap-2 text-sm text-bodytext dark:text-darklink">
        <Icon icon="solar:database-linear" height={16} className="text-primary" />
        <span>Data source: SharePoint VisitScheduler list</span>
      </div>
    </div>
  )
}
