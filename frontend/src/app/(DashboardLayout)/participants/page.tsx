"use client"

import CardBox from "../../components/shared/CardBox"
import { Icon } from "@iconify/react"

export default function ParticipantsPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-charcoal dark:text-white">Participants</h1>
        <p className="text-bodytext dark:text-darklink">Track study participants (coded IDs only)</p>
      </div>

      {/* Coming Soon Card */}
      <CardBox className="text-center py-12">
        <div className="w-20 h-20 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <Icon icon="solar:users-group-rounded-bold" height={40} width={40} className="text-secondary" />
        </div>

        <h2 className="text-xl font-semibold text-charcoal dark:text-white mb-3">
          Participant Tracking Coming Soon
        </h2>
        <p className="text-bodytext dark:text-darklink max-w-md mx-auto mb-8">
          This module will allow you to view and manage study participants using
          coded subject IDs. All data follows HIPAA Limited Data Set guidelines.
        </p>

        {/* What will be tracked */}
        <div className="bg-lightgray dark:bg-darkborder rounded-lg p-6 max-w-lg mx-auto mb-6">
          <h3 className="font-semibold text-charcoal dark:text-white mb-4">What will be tracked:</h3>
          <ul className="space-y-3 text-left">
            {[
              "Coded Subject IDs (e.g., PAIN001, CP-042)",
              "Relative dates (days since enrollment)",
              "Age at enrollment (not date of birth)",
              "Visit completion status",
              "Data completeness tracking",
            ].map((item, index) => (
              <li key={index} className="flex items-center gap-3 text-sm">
                <Icon icon="solar:check-circle-bold" height={18} width={18} className="text-success" />
                <span className="text-bodytext dark:text-darklink">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* HIPAA Badge */}
        <div className="inline-flex items-center gap-2 bg-success/10 px-4 py-2 rounded-full">
          <Icon icon="solar:shield-check-bold" height={20} width={20} className="text-success" />
          <span className="text-success font-medium text-sm">HIPAA Limited Data Set Compliant</span>
        </div>
      </CardBox>
    </div>
  )
}
