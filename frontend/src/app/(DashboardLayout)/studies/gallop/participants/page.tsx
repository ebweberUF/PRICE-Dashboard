"use client"

import Link from "next/link"
import CardBox from "@/app/components/shared/CardBox"
import { Icon } from "@iconify/react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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

type ParticipantStatus = "screened" | "enrolled" | "active" | "completed" | "withdrawn"

interface Participant {
  id: number
  subjectId: string
  ageAtEnrollment: number | null
  gender: string | null
  status: ParticipantStatus
  enrollmentDay: number
  lastVisitDay: number | null
  dataCompleteness: number
}

// Mock data - will be replaced with API calls
const mockParticipants: Participant[] = [
  // Empty for now - will be populated from PRICE backend/REDCap
]

const statusConfig: Record<ParticipantStatus, { label: string; className: string }> = {
  screened: { label: "Screened", className: "bg-gray-100 text-gray-700 border-gray-200" },
  enrolled: { label: "Enrolled", className: "bg-blue-100 text-blue-700 border-blue-200" },
  active: { label: "Active", className: "bg-success/10 text-success border-success/20" },
  completed: { label: "Completed", className: "bg-purple-100 text-purple-700 border-purple-200" },
  withdrawn: { label: "Withdrawn", className: "bg-error/10 text-error border-error/20" },
}

function formatRelativeDays(days: number): string {
  if (days === 0) return "Day 0 (Enrollment)"
  const abs = Math.abs(days)
  if (abs >= 365) return `Day ${days} (Year ${Math.floor(abs / 365)})`
  if (abs >= 30) return `Day ${days} (Month ${Math.floor(abs / 30)})`
  if (abs >= 7 && abs % 7 === 0) return `Day ${days} (Week ${abs / 7})`
  return `Day ${days}`
}

export default function GallopParticipantsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const filteredParticipants = mockParticipants.filter((p) => {
    const matchesSearch = p.subjectId.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || p.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-bodytext dark:text-darklink">
        <Link href="/studies/gallop" className="hover:text-primary">
          GALLOP
        </Link>
        <Icon icon="solar:arrow-right-linear" height={16} />
        <span className="text-charcoal dark:text-white">Participants</span>
      </div>

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-charcoal dark:text-white">Participants</h1>
          <p className="text-bodytext dark:text-darklink">
            {filteredParticipants.length} participants in GALLOP study
          </p>
        </div>
        <Button variant="outline" className="gap-2">
          <Icon icon="solar:export-linear" height={18} />
          Export
        </Button>
      </div>

      {/* Filters */}
      <CardBox className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Icon
                icon="solar:magnifer-linear"
                height={20}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-bodytext"
              />
              <Input
                placeholder="Search by Subject ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="screened">Screened</SelectItem>
              <SelectItem value="enrolled">Enrolled</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="withdrawn">Withdrawn</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardBox>

      {/* Participants Table */}
      <CardBox className="p-0 overflow-hidden">
        {filteredParticipants.length === 0 ? (
          <div className="text-center py-12">
            <Icon icon="solar:users-group-rounded-linear" height={48} className="mx-auto text-bodytext/50 mb-3" />
            <p className="text-lg font-medium text-charcoal dark:text-white">No participants yet</p>
            <p className="text-bodytext dark:text-darklink mt-1">
              Participants will appear here once they are synced from REDCap
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-lightgray dark:bg-darkborder">
                <TableHead className="font-semibold">Subject ID</TableHead>
                <TableHead className="font-semibold">Age</TableHead>
                <TableHead className="font-semibold">Gender</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Days Enrolled</TableHead>
                <TableHead className="font-semibold">Last Visit</TableHead>
                <TableHead className="font-semibold">Data Completeness</TableHead>
                <TableHead className="font-semibold text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredParticipants.map((participant) => (
                <TableRow key={participant.id} className="hover:bg-lightgray/50 dark:hover:bg-darkborder/50">
                  <TableCell>
                    <Link
                      href={`/studies/gallop/participants/${participant.subjectId}`}
                      className="font-medium text-primary hover:underline"
                    >
                      {participant.subjectId}
                    </Link>
                  </TableCell>
                  <TableCell className="text-bodytext dark:text-darklink">
                    {participant.ageAtEnrollment ?? "N/A"}
                  </TableCell>
                  <TableCell className="text-bodytext dark:text-darklink">
                    {participant.gender ?? "N/A"}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={statusConfig[participant.status].className}>
                      {statusConfig[participant.status].label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-bodytext dark:text-darklink">
                    {formatRelativeDays(participant.enrollmentDay)}
                  </TableCell>
                  <TableCell className="text-bodytext dark:text-darklink">
                    {participant.lastVisitDay !== null
                      ? formatRelativeDays(participant.lastVisitDay)
                      : "No visits"}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-lightgray dark:bg-darkborder rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all ${
                            participant.dataCompleteness >= 80
                              ? "bg-success"
                              : participant.dataCompleteness >= 60
                              ? "bg-warning"
                              : "bg-error"
                          }`}
                          style={{ width: `${participant.dataCompleteness}%` }}
                        />
                      </div>
                      <span className="text-sm text-bodytext dark:text-darklink">
                        {participant.dataCompleteness}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Link
                      href={`/studies/gallop/participants/${participant.subjectId}`}
                      className="text-primary hover:underline font-medium text-sm"
                    >
                      View
                    </Link>
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
        <span>Displaying coded IDs and relative dates only (Limited Data Set)</span>
      </div>
    </div>
  )
}
