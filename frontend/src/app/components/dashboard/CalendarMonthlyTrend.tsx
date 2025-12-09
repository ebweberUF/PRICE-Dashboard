"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import CardBox from "../shared/CardBox"
import { Icon } from "@iconify/react"
import { api, CalendarStats } from "@/lib/api"

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false })

const CalendarMonthlyTrend = () => {
  const [stats, setStats] = useState<CalendarStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await api.calendar.getStats()
        setStats(data)
      } catch (err) {
        console.error("Failed to load calendar stats:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  if (loading) {
    return (
      <CardBox>
        <div className="flex items-center justify-center h-48">
          <Icon icon="svg-spinners:ring-resize" height={24} width={24} className="text-primary" />
        </div>
      </CardBox>
    )
  }

  if (!stats || stats.byMonth.length === 0) {
    return (
      <CardBox>
        <div className="flex flex-col items-center justify-center h-48 text-bodytext dark:text-darklink">
          <Icon icon="solar:chart-2-bold" height={32} width={32} className="mb-2 opacity-50" />
          <p className="text-sm">No trend data available</p>
        </div>
      </CardBox>
    )
  }

  // Reverse to show chronological order (oldest to newest)
  const monthlyData = [...stats.byMonth].reverse()

  const chartOptions: ApexCharts.ApexOptions = {
    chart: {
      type: "area",
      fontFamily: "inherit",
      foreColor: "#7C8FAC",
      toolbar: { show: false },
      sparkline: { enabled: false },
    },
    colors: ["var(--color-secondary)"],
    stroke: {
      curve: "smooth",
      width: 2,
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 0.1,
        opacityFrom: 0.4,
        opacityTo: 0.1,
        stops: [0, 100],
      },
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories: monthlyData.map(m => `${m.monthName.slice(0, 3)} ${String(m.year).slice(2)}`),
      labels: {
        style: { fontSize: "10px" },
        rotate: -45,
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        formatter: (val: number) => Math.round(val).toString(),
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
      data: monthlyData.map(m => m.eventCount),
    },
  ]

  return (
    <CardBox>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h5 className="card-title">Monthly Trend</h5>
          <p className="text-bodytext dark:text-darklink text-sm">
            Calendar activity
          </p>
        </div>
        <div className="text-white bg-secondary rounded-full h-10 w-10 flex items-center justify-center">
          <Icon icon="solar:chart-2-bold" height={20} width={20} />
        </div>
      </div>

      <Chart
        options={chartOptions}
        series={chartSeries}
        type="area"
        height={180}
        width="100%"
      />
    </CardBox>
  )
}

export { CalendarMonthlyTrend }
