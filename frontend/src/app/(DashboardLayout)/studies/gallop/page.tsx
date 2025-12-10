"use client"

import Link from "next/link"
import CardBox from "@/app/components/shared/CardBox"
import { Icon } from "@iconify/react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

// Study configuration - customize for GALLOP
const STUDY_CONFIG = {
  studyId: 5,
  studyCode: "GALLOP",
  name: "GALLOP Study",
  description: "Equine pain research study",
  iacucNumber: "IACUC202400000711",
  enrollmentTarget: 40,
  startYear: 2024,
  endYear: 2026,
}

// Mock data - will be replaced with API calls
const stats = {
  enrolled: 0,
  active: 0,
  completed: 0,
  withdrawn: 0,
}

const recentActivity = [
  // Will be populated from API
]

export default function GallopDashboard() {
  const enrollmentProgress = Math.round((stats.enrolled / STUDY_CONFIG.enrollmentTarget) * 100) || 0

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
              {STUDY_CONFIG.studyCode}
            </Badge>
            <Badge variant="outline" className="bg-amber-100 text-amber-700 border-amber-200">
              <Icon icon="solar:star-bold" height={12} className="mr-1" />
              Equine Study
            </Badge>
            <span className="text-sm text-bodytext dark:text-darklink">
              IACUC: {STUDY_CONFIG.iacucNumber}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-charcoal dark:text-white">
            {STUDY_CONFIG.name}
          </h1>
          <p className="text-bodytext dark:text-darklink">
            {STUDY_CONFIG.description}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2">
            <Icon icon="solar:refresh-linear" height={18} />
            Sync REDCap
          </Button>
          <Button variant="outline" className="gap-2">
            <Icon icon="solar:export-linear" height={18} />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <CardBox className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-bodytext dark:text-darklink">Enrolled</p>
              <p className="text-3xl font-bold text-charcoal dark:text-white mt-1">{stats.enrolled}</p>
              <div className="mt-2">
                <div className="flex items-center justify-between text-xs text-bodytext dark:text-darklink mb-1">
                  <span>Progress</span>
                  <span>{enrollmentProgress}%</span>
                </div>
                <div className="w-full h-2 bg-lightgray dark:bg-darkborder rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all"
                    style={{ width: `${enrollmentProgress}%` }}
                  />
                </div>
                <p className="mt-1 text-xs text-bodytext dark:text-darklink">
                  Target: {STUDY_CONFIG.enrollmentTarget}
                </p>
              </div>
            </div>
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon icon="solar:users-group-rounded-bold" height={24} className="text-primary" />
            </div>
          </div>
        </CardBox>

        <CardBox className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-bodytext dark:text-darklink">Active</p>
              <p className="text-3xl font-bold text-charcoal dark:text-white mt-1">{stats.active}</p>
              <p className="text-sm text-success mt-2">Currently in study</p>
            </div>
            <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
              <Icon icon="solar:running-round-bold" height={24} className="text-success" />
            </div>
          </div>
        </CardBox>

        <CardBox className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-bodytext dark:text-darklink">Completed</p>
              <p className="text-3xl font-bold text-charcoal dark:text-white mt-1">{stats.completed}</p>
              <p className="text-sm text-bodytext dark:text-darklink mt-2">Finished protocol</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
              <Icon icon="solar:check-circle-bold" height={24} className="text-purple-600" />
            </div>
          </div>
        </CardBox>

        <CardBox className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-bodytext dark:text-darklink">Withdrawn</p>
              <p className="text-3xl font-bold text-charcoal dark:text-white mt-1">{stats.withdrawn}</p>
              <p className="text-sm text-bodytext dark:text-darklink mt-2">Left study</p>
            </div>
            <div className="w-12 h-12 bg-error/10 rounded-lg flex items-center justify-center">
              <Icon icon="solar:user-minus-bold" height={24} className="text-error" />
            </div>
          </div>
        </CardBox>
      </div>

      {/* Quick Links & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Links */}
        <CardBox className="p-6">
          <h3 className="text-lg font-semibold text-charcoal dark:text-white mb-4">Quick Links</h3>
          <div className="space-y-3">
            <Link
              href="/studies/gallop/participants"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-lightgray dark:hover:bg-darkborder transition-colors"
            >
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Icon icon="solar:users-group-rounded-linear" height={20} className="text-primary" />
              </div>
              <div>
                <p className="font-medium text-charcoal dark:text-white">Participants</p>
                <p className="text-sm text-bodytext dark:text-darklink">View all participants</p>
              </div>
              <Icon icon="solar:arrow-right-linear" height={20} className="ml-auto text-bodytext" />
            </Link>

            <Link
              href="/studies/gallop/visits"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-lightgray dark:hover:bg-darkborder transition-colors"
            >
              <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                <Icon icon="solar:calendar-linear" height={20} className="text-success" />
              </div>
              <div>
                <p className="font-medium text-charcoal dark:text-white">Visits</p>
                <p className="text-sm text-bodytext dark:text-darklink">Track visit schedule</p>
              </div>
              <Icon icon="solar:arrow-right-linear" height={20} className="ml-auto text-bodytext" />
            </Link>

            <Link
              href="/studies/gallop/data-quality"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-lightgray dark:hover:bg-darkborder transition-colors"
            >
              <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
                <Icon icon="solar:chart-square-linear" height={20} className="text-warning" />
              </div>
              <div>
                <p className="font-medium text-charcoal dark:text-white">Data Quality</p>
                <p className="text-sm text-bodytext dark:text-darklink">Check completeness</p>
              </div>
              <Icon icon="solar:arrow-right-linear" height={20} className="ml-auto text-bodytext" />
            </Link>
          </div>
        </CardBox>

        {/* Recent Activity */}
        <CardBox className="p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold text-charcoal dark:text-white mb-4">Recent Activity</h3>
          {recentActivity.length === 0 ? (
            <div className="text-center py-8">
              <Icon icon="solar:clipboard-list-linear" height={48} className="mx-auto text-bodytext/50 mb-3" />
              <p className="text-bodytext dark:text-darklink">No recent activity</p>
              <p className="text-sm text-bodytext/70 dark:text-darklink/70">
                Activity will appear here once participants are enrolled
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Activity items will be mapped here */}
            </div>
          )}
        </CardBox>
      </div>

      {/* HIPAA Compliance Notice */}
      <CardBox className="p-4 bg-success/5 border-success/20">
        <div className="flex items-center gap-3">
          <Icon icon="solar:shield-check-bold" height={24} className="text-success" />
          <div>
            <p className="font-medium text-charcoal dark:text-white">HIPAA Compliant</p>
            <p className="text-sm text-bodytext dark:text-darklink">
              This dashboard displays Limited Data Set information only. No PHI is stored or displayed.
            </p>
          </div>
        </div>
      </CardBox>
    </div>
  )
}
