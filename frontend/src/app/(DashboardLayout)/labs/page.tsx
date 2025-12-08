"use client"

import Link from "next/link"
import CardBox from "../../components/shared/CardBox"
import { Icon } from "@iconify/react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const labs = [
  {
    id: 1,
    code: "PAIN-LAB",
    name: "Pain Management Lab",
    description: "Research focused on chronic pain management and intervention strategies.",
    admin: "Dr. John Smith",
    studyCount: 4,
    active: true,
  },
  {
    id: 2,
    code: "NEURO-LAB",
    name: "Neuroscience Research Lab",
    description: "Investigating neurological mechanisms of pain perception.",
    admin: "Dr. Sarah Johnson",
    studyCount: 2,
    active: true,
  },
  {
    id: 3,
    code: "CLIN-TRIALS",
    name: "Clinical Trials Unit",
    description: "Managing multi-site clinical trials for pain interventions.",
    admin: "Dr. Michael Brown",
    studyCount: 1,
    active: true,
  },
]

export default function LabsPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-charcoal dark:text-white">Labs</h1>
          <p className="text-bodytext dark:text-darklink">Manage research laboratories</p>
        </div>
        <Button className="gap-2">
          <Icon icon="solar:add-circle-linear" height={18} width={18} />
          Add Lab
        </Button>
      </div>

      {/* Labs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {labs.map((lab) => (
          <Link key={lab.id} href={`/labs/${lab.id}`}>
            <CardBox className="h-full hover:border-primary transition-colors cursor-pointer">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon icon="solar:test-tube-bold" height={24} width={24} className="text-primary" />
                </div>
                <Badge variant="outline" className={lab.active ? "bg-success/10 text-success border-success/20" : "bg-gray-100 text-gray-600"}>
                  {lab.active ? "Active" : "Inactive"}
                </Badge>
              </div>

              <div className="mb-4">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-charcoal dark:text-white text-lg">{lab.name}</h3>
                </div>
                <span className="text-xs bg-lightgray dark:bg-darkborder px-2 py-1 rounded text-bodytext dark:text-darklink">
                  {lab.code}
                </span>
              </div>

              <p className="text-sm text-bodytext dark:text-darklink mb-4 line-clamp-2">
                {lab.description}
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-border dark:border-darkborder">
                <div className="flex items-center gap-2 text-sm">
                  <Icon icon="solar:user-linear" height={16} width={16} className="text-bodytext dark:text-darklink" />
                  <span className="text-bodytext dark:text-darklink">{lab.admin}</span>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <Icon icon="solar:clipboard-list-linear" height={16} width={16} className="text-primary" />
                  <span className="text-primary font-medium">{lab.studyCount} studies</span>
                </div>
              </div>
            </CardBox>
          </Link>
        ))}
      </div>
    </div>
  )
}
