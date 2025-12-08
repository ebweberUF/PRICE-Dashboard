"use client"

import Link from "next/link"
import CardBox from "../shared/CardBox"
import { Icon } from "@iconify/react"
import { Badge } from "@/components/ui/badge"

const studies = [
  {
    id: 1,
    code: "CPAIN-001",
    name: "Chronic Pain Intervention Study",
    lab: "Pain Management Lab",
    participants: 45,
    target: 150,
    status: "active",
  },
  {
    id: 2,
    code: "OPIOID-002",
    name: "Opioid Reduction Protocol",
    lab: "Pain Management Lab",
    participants: 78,
    target: 200,
    status: "active",
  },
  {
    id: 3,
    code: "NEURO-003",
    name: "Neural Pathways in Pain Perception",
    lab: "Neuroscience Research Lab",
    participants: 32,
    target: 75,
    status: "active",
  },
]

const RecentStudies = () => {
  return (
    <CardBox>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h5 className="card-title">Active Studies</h5>
          <p className="text-bodytext dark:text-darklink text-sm">Recent study progress</p>
        </div>
        <Link href="/studies" className="text-primary text-sm font-medium hover:underline">
          View All
        </Link>
      </div>
      <div className="space-y-4">
        {studies.map((study) => {
          const progress = Math.round((study.participants / study.target) * 100)
          return (
            <Link
              key={study.id}
              href={`/studies/${study.id}`}
              className="block p-4 rounded-lg border border-border dark:border-darkborder hover:border-primary transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Icon icon="solar:clipboard-list-bold" height={20} width={20} className="text-primary" />
                  </div>
                  <div>
                    <h6 className="font-semibold text-charcoal dark:text-white">{study.name}</h6>
                    <p className="text-xs text-bodytext dark:text-darklink">{study.code} - {study.lab}</p>
                  </div>
                </div>
                <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                  Active
                </Badge>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-bodytext dark:text-darklink">Enrollment Progress</span>
                  <span className="font-medium text-charcoal dark:text-white">{study.participants} / {study.target}</span>
                </div>
                <div className="w-full bg-lightgray dark:bg-darkborder rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-xs text-bodytext dark:text-darklink text-right">{progress}% complete</p>
              </div>
            </Link>
          )
        })}
      </div>
    </CardBox>
  )
}

export { RecentStudies }
