"use client"

import Link from "next/link"
import CardBox from "../shared/CardBox"
import { Icon } from "@iconify/react"

const actions = [
  {
    title: "View Labs",
    description: "Manage research laboratories",
    icon: "solar:test-tube-linear",
    href: "/labs",
    color: "primary",
  },
  {
    title: "View Studies",
    description: "Track clinical studies",
    icon: "solar:clipboard-list-linear",
    href: "/studies",
    color: "success",
  },
  {
    title: "View Participants",
    description: "Coded participant data",
    icon: "solar:users-group-rounded-linear",
    href: "/participants",
    color: "secondary",
  },
  {
    title: "Data Quality",
    description: "Check completeness",
    icon: "solar:chart-square-linear",
    href: "/data-quality",
    color: "warning",
  },
]

const colorMap: Record<string, { bg: string; text: string }> = {
  primary: { bg: "bg-primary/10", text: "text-primary" },
  success: { bg: "bg-success/10", text: "text-success" },
  secondary: { bg: "bg-secondary/10", text: "text-secondary" },
  warning: { bg: "bg-warning/10", text: "text-warning" },
}

const QuickActions = () => {
  return (
    <CardBox>
      <div className="mb-6">
        <h5 className="card-title">Quick Actions</h5>
        <p className="text-bodytext dark:text-darklink text-sm">Navigate to key areas</p>
      </div>
      <div className="space-y-3">
        {actions.map((action) => {
          const colors = colorMap[action.color]
          return (
            <Link
              key={action.title}
              href={action.href}
              className="flex items-center gap-4 p-3 rounded-lg border border-border dark:border-darkborder hover:border-primary hover:bg-lightgray dark:hover:bg-darkborder transition-all"
            >
              <div className={`w-10 h-10 ${colors.bg} rounded-lg flex items-center justify-center`}>
                <Icon icon={action.icon} height={20} width={20} className={colors.text} />
              </div>
              <div className="flex-1">
                <h6 className="font-medium text-charcoal dark:text-white text-sm">{action.title}</h6>
                <p className="text-xs text-bodytext dark:text-darklink">{action.description}</p>
              </div>
              <Icon icon="solar:arrow-right-linear" height={18} width={18} className="text-bodytext dark:text-darklink" />
            </Link>
          )
        })}
      </div>
    </CardBox>
  )
}

export { QuickActions }
