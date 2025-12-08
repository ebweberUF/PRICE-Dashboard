"use client"

import CardBox from "../shared/CardBox"
import { Icon } from "@iconify/react"
import { Progress } from "@/components/ui/progress"

const dataQuality = [
  { name: "Demographics", completeness: 95, required: true },
  { name: "Medical History", completeness: 88, required: true },
  { name: "Pain Assessment", completeness: 92, required: true },
  { name: "Quality of Life", completeness: 85, required: true },
  { name: "Medications", completeness: 78, required: false },
  { name: "Follow-up Visits", completeness: 72, required: true },
]

const DataQualityOverview = () => {
  const averageCompleteness = Math.round(
    dataQuality.reduce((sum, item) => sum + item.completeness, 0) / dataQuality.length
  )

  return (
    <CardBox>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h5 className="card-title">Data Quality Overview</h5>
          <p className="text-bodytext dark:text-darklink text-sm">Instrument completion rates across all studies</p>
        </div>
        <div className="flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-lg">
          <Icon icon="solar:chart-2-bold" height={24} width={24} className="text-primary" />
          <div>
            <p className="text-primary font-bold text-xl">{averageCompleteness}%</p>
            <p className="text-primary/70 text-xs">Average</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {dataQuality.map((item) => {
          let colorClass = "bg-success"
          let textColor = "text-success"
          if (item.completeness < 80) {
            colorClass = "bg-warning"
            textColor = "text-warning"
          }
          if (item.completeness < 60) {
            colorClass = "bg-error"
            textColor = "text-error"
          }

          return (
            <div
              key={item.name}
              className="p-4 rounded-lg border border-border dark:border-darkborder"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-charcoal dark:text-white text-sm">{item.name}</span>
                  {item.required && (
                    <span className="text-xs bg-error/10 text-error px-1.5 py-0.5 rounded">Required</span>
                  )}
                </div>
                <span className={`font-bold ${textColor}`}>{item.completeness}%</span>
              </div>
              <Progress value={item.completeness} className="h-2" />
            </div>
          )
        })}
      </div>

      <div className="mt-6 p-4 bg-lightgray dark:bg-darkborder rounded-lg">
        <div className="flex items-start gap-3">
          <Icon icon="solar:info-circle-linear" height={20} width={20} className="text-primary mt-0.5" />
          <div>
            <p className="text-sm text-charcoal dark:text-white font-medium">Data Completeness Thresholds</p>
            <div className="flex gap-4 mt-2 text-xs">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-success"></span>
                <span className="text-bodytext dark:text-darklink">Good (80%+)</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-warning"></span>
                <span className="text-bodytext dark:text-darklink">Warning (60-79%)</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-error"></span>
                <span className="text-bodytext dark:text-darklink">Critical (&lt;60%)</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </CardBox>
  )
}

export { DataQualityOverview }
