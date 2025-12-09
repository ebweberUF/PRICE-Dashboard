"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import CardBox from "../shared/CardBox"
import { Icon } from "@iconify/react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { api, CalendarStats } from "@/lib/api"

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false })

const CalendarSummary = () => {
  const [stats, setStats] = useState<CalendarStats | null>(null)
  const [selectedYear, setSelectedYear] = useState<string>("all")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        const data = await api.calendar.getStats(
          selectedYear !== "all" ? parseInt(selectedYear, 10) : undefined
        )
        setStats(data)
        setError(null)
      } catch (err) {
        setError("Failed to load calendar statistics")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [selectedYear])

  if (loading) {
    return (
      <CardBox>
        <div className="flex items-center justify-center h-64">
          <Icon icon="svg-spinners:ring-resize" height={32} width={32} className="text-primary" />
        </div>
      </CardBox>
    )
  }

  if (error || !stats) {
    return (
      <CardBox>
        <div className="flex flex-col items-center justify-center h-64 text-bodytext dark:text-darklink">
          <Icon icon="solar:calendar-bold" height={48} width={48} className="mb-4 opacity-50" />
          <p>{error || "No calendar data available"}</p>
          <p className="text-sm mt-2">Set up Power Automate to sync your SharePoint calendar</p>
        </div>
      </CardBox>
    )
  }

  // Prepare chart data for events by study
  const chartOptions: ApexCharts.ApexOptions = {
    chart: {
      type: "bar",
      fontFamily: "inherit",
      foreColor: "#7C8FAC",
      toolbar: { show: false },
    },
    colors: ["var(--color-primary)"],
    plotOptions: {
      bar: {
        horizontal: true,
        borderRadius: 4,
        barHeight: "60%",
      },
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories: stats.byStudy.slice(0, 8).map(s => s.studyCode || s.studyName || "Unassigned"),
    },
    yaxis: {
      labels: {
        style: { fontSize: "12px" },
      },
    },
    tooltip: {
      theme: "dark",
    },
    grid: {
      borderColor: "rgba(0,0,0,0.1)",
      strokeDashArray: 3,
    },
  }

  const chartSeries = [
    {
      name: "Events",
      data: stats.byStudy.slice(0, 8).map(s => s.eventCount),
    },
  ]

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 5 }, (_, i) => String(currentYear - i))

  return (
    <CardBox>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h5 className="card-title">Calendar Events by Study</h5>
          <p className="text-bodytext dark:text-darklink text-sm">
            SharePoint calendar activity distribution
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-primary/10 px-3 py-2 rounded-lg">
            <Icon icon="solar:calendar-bold" height={20} width={20} className="text-primary" />
            <span className="text-primary font-bold">{stats.totalEvents}</span>
            <span className="text-primary/70 text-xs">Total</span>
          </div>
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="All Years" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Years</SelectItem>
              {years.map(year => (
                <SelectItem key={year} value={year}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {stats.byStudy.length > 0 ? (
        <Chart
          options={chartOptions}
          series={chartSeries}
          type="bar"
          height={300}
          width="100%"
        />
      ) : (
        <div className="flex items-center justify-center h-64 text-bodytext dark:text-darklink">
          <p>No events to display</p>
        </div>
      )}

      {/* Event Types Summary */}
      {stats.byEventType.length > 0 && (
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.byEventType.slice(0, 4).map((type) => (
            <div
              key={type.eventType}
              className="p-3 rounded-lg border border-border dark:border-darkborder text-center"
            >
              <p className="text-lg font-bold text-charcoal dark:text-white">
                {type.eventCount}
              </p>
              <p className="text-xs text-bodytext dark:text-darklink truncate">
                {type.eventType}
              </p>
            </div>
          ))}
        </div>
      )}
    </CardBox>
  )
}

export { CalendarSummary }
