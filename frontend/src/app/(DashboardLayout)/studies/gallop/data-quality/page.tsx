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

interface InstrumentCompleteness {
  name: string
  displayName: string
  required: boolean
  totalExpected: number
  totalComplete: number
  completenessPercent: number
}

interface ParticipantCompleteness {
  subjectId: string
  status: string
  overallCompleteness: number
  instruments: {
    name: string
    isComplete: boolean
  }[]
}

// Instruments configuration - customize for GALLOP
const INSTRUMENTS = [
  { name: "demographics", displayName: "Demographics", required: true },
  { name: "medical_history", displayName: "Medical History", required: true },
  { name: "pain_assessment", displayName: "Pain Assessment", required: true },
  { name: "medications", displayName: "Current Medications", required: false },
  { name: "quality_of_life", displayName: "Quality of Life", required: true },
]

// Data quality thresholds
const THRESHOLDS = {
  good: 80,
  warning: 60,
}

// Mock data - will be replaced with API calls
const mockInstrumentStats: InstrumentCompleteness[] = [
  // Empty for now - will be populated from PRICE backend
]

const mockParticipantCompleteness: ParticipantCompleteness[] = [
  // Empty for now - will be populated from PRICE backend
]

function getCompletenessColor(percent: number): string {
  if (percent >= THRESHOLDS.good) return "text-success"
  if (percent >= THRESHOLDS.warning) return "text-warning"
  return "text-error"
}

function getCompletenessBarColor(percent: number): string {
  if (percent >= THRESHOLDS.good) return "bg-success"
  if (percent >= THRESHOLDS.warning) return "bg-warning"
  return "bg-error"
}

export default function GallopDataQualityPage() {
  // Calculate overall stats
  const overallCompleteness =
    mockInstrumentStats.length > 0
      ? Math.round(
          mockInstrumentStats.reduce((acc, i) => acc + i.completenessPercent, 0) /
            mockInstrumentStats.length
        )
      : 0

  const criticalIssues = mockParticipantCompleteness.filter(
    (p) => p.overallCompleteness < THRESHOLDS.warning
  ).length

  const warningIssues = mockParticipantCompleteness.filter(
    (p) => p.overallCompleteness >= THRESHOLDS.warning && p.overallCompleteness < THRESHOLDS.good
  ).length

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-bodytext dark:text-darklink">
        <Link href="/studies/gallop" className="hover:text-primary">
          GALLOP
        </Link>
        <Icon icon="solar:arrow-right-linear" height={16} />
        <span className="text-charcoal dark:text-white">Data Quality</span>
      </div>

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-charcoal dark:text-white">Data Quality</h1>
          <p className="text-bodytext dark:text-darklink">
            Monitor data completeness and identify missing data
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2">
            <Icon icon="solar:refresh-linear" height={18} />
            Refresh
          </Button>
          <Button variant="outline" className="gap-2">
            <Icon icon="solar:export-linear" height={18} />
            Export Report
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <CardBox className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon icon="solar:chart-square-bold" height={20} className="text-primary" />
            </div>
            <div>
              <p className={`text-2xl font-bold ${getCompletenessColor(overallCompleteness)}`}>
                {overallCompleteness}%
              </p>
              <p className="text-sm text-bodytext dark:text-darklink">Overall Completeness</p>
            </div>
          </div>
        </CardBox>

        <CardBox className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
              <Icon icon="solar:check-circle-bold" height={20} className="text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold text-success">
                {mockParticipantCompleteness.filter((p) => p.overallCompleteness >= THRESHOLDS.good).length}
              </p>
              <p className="text-sm text-bodytext dark:text-darklink">Good (≥{THRESHOLDS.good}%)</p>
            </div>
          </div>
        </CardBox>

        <CardBox className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
              <Icon icon="solar:danger-triangle-bold" height={20} className="text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold text-warning">{warningIssues}</p>
              <p className="text-sm text-bodytext dark:text-darklink">Warnings</p>
            </div>
          </div>
        </CardBox>

        <CardBox className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-error/10 rounded-lg flex items-center justify-center">
              <Icon icon="solar:close-circle-bold" height={20} className="text-error" />
            </div>
            <div>
              <p className="text-2xl font-bold text-error">{criticalIssues}</p>
              <p className="text-sm text-bodytext dark:text-darklink">Critical (&lt;{THRESHOLDS.warning}%)</p>
            </div>
          </div>
        </CardBox>
      </div>

      {/* Instrument Completeness */}
      <CardBox className="p-6">
        <h3 className="text-lg font-semibold text-charcoal dark:text-white mb-4">
          Completeness by Instrument
        </h3>

        {mockInstrumentStats.length === 0 ? (
          <div className="text-center py-8">
            <Icon icon="solar:chart-square-linear" height={48} className="mx-auto text-bodytext/50 mb-3" />
            <p className="text-bodytext dark:text-darklink">No data available yet</p>
            <p className="text-sm text-bodytext/70 dark:text-darklink/70">
              Instrument completeness will be calculated once participants are synced
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {mockInstrumentStats.map((instrument) => (
              <div key={instrument.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-charcoal dark:text-white">
                      {instrument.displayName}
                    </span>
                    {instrument.required && (
                      <Badge variant="outline" className="text-xs">
                        Required
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-bodytext dark:text-darklink">
                      {instrument.totalComplete} / {instrument.totalExpected}
                    </span>
                    <span className={`font-semibold ${getCompletenessColor(instrument.completenessPercent)}`}>
                      {instrument.completenessPercent}%
                    </span>
                  </div>
                </div>
                <div className="w-full bg-lightgray dark:bg-darkborder rounded-full h-2.5">
                  <div
                    className={`h-2.5 rounded-full transition-all ${getCompletenessBarColor(
                      instrument.completenessPercent
                    )}`}
                    style={{ width: `${instrument.completenessPercent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </CardBox>

      {/* Participant Completeness Table */}
      <CardBox className="p-0 overflow-hidden">
        <div className="p-4 border-b border-lightgray dark:border-darkborder">
          <h3 className="text-lg font-semibold text-charcoal dark:text-white">
            Participant Data Completeness
          </h3>
          <p className="text-sm text-bodytext dark:text-darklink">
            Individual participant data status
          </p>
        </div>

        {mockParticipantCompleteness.length === 0 ? (
          <div className="text-center py-12">
            <Icon icon="solar:users-group-rounded-linear" height={48} className="mx-auto text-bodytext/50 mb-3" />
            <p className="text-lg font-medium text-charcoal dark:text-white">No participants yet</p>
            <p className="text-bodytext dark:text-darklink mt-1">
              Participant completeness will appear here once data is synced from REDCap
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-lightgray dark:bg-darkborder">
                <TableHead className="font-semibold">Subject ID</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                {INSTRUMENTS.map((inst) => (
                  <TableHead key={inst.name} className="font-semibold text-center">
                    {inst.displayName}
                  </TableHead>
                ))}
                <TableHead className="font-semibold text-right">Overall</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockParticipantCompleteness.map((participant) => (
                <TableRow key={participant.subjectId} className="hover:bg-lightgray/50 dark:hover:bg-darkborder/50">
                  <TableCell>
                    <Link
                      href={`/studies/gallop/participants/${participant.subjectId}`}
                      className="font-medium text-primary hover:underline"
                    >
                      {participant.subjectId}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{participant.status}</Badge>
                  </TableCell>
                  {INSTRUMENTS.map((inst) => {
                    const instData = participant.instruments.find((i) => i.name === inst.name)
                    const isComplete = instData?.isComplete ?? false
                    return (
                      <TableCell key={inst.name} className="text-center">
                        {isComplete ? (
                          <Icon icon="solar:check-circle-bold" height={20} className="mx-auto text-success" />
                        ) : (
                          <Icon icon="solar:close-circle-bold" height={20} className="mx-auto text-error" />
                        )}
                      </TableCell>
                    )
                  })}
                  <TableCell className="text-right">
                    <span className={`font-semibold ${getCompletenessColor(participant.overallCompleteness)}`}>
                      {participant.overallCompleteness}%
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardBox>

      {/* Legend */}
      <CardBox className="p-4">
        <h4 className="font-medium text-charcoal dark:text-white mb-3">Completeness Thresholds</h4>
        <div className="flex flex-wrap gap-6">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-success" />
            <span className="text-sm text-bodytext dark:text-darklink">
              Good (≥{THRESHOLDS.good}%)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-warning" />
            <span className="text-sm text-bodytext dark:text-darklink">
              Warning ({THRESHOLDS.warning}-{THRESHOLDS.good - 1}%)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-error" />
            <span className="text-sm text-bodytext dark:text-darklink">
              Critical (&lt;{THRESHOLDS.warning}%)
            </span>
          </div>
        </div>
      </CardBox>

      {/* HIPAA Notice */}
      <div className="flex items-center gap-2 text-sm text-bodytext dark:text-darklink">
        <Icon icon="solar:shield-check-linear" height={16} className="text-success" />
        <span>Data completeness metrics only - no PHI displayed (Limited Data Set)</span>
      </div>
    </div>
  )
}
