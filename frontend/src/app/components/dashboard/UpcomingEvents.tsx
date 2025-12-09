"use client"

import { useState, useEffect } from "react"
import CardBox from "../shared/CardBox"
import { Icon } from "@iconify/react"
import { Badge } from "@/components/ui/badge"
import { api, CalendarEvent } from "@/lib/api"

// Simple date formatting functions
const formatEventDate = (dateString: string): string => {
  const date = new Date(dateString)
  const options: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  }
  return date.toLocaleDateString('en-US', options)
}

const formatRelativeTime = (dateString: string): string => {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = date.getTime() - now.getTime()
  const diffMins = Math.round(diffMs / (1000 * 60))
  const diffHours = Math.round(diffMs / (1000 * 60 * 60))
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24))

  if (diffMins < 0) return 'Past'
  if (diffMins < 60) return `in ${diffMins} min`
  if (diffHours < 24) return `in ${diffHours} hr`
  if (diffDays === 1) return 'Tomorrow'
  if (diffDays < 7) return `in ${diffDays} days`
  return `in ${Math.round(diffDays / 7)} weeks`
}

const UpcomingEvents = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await api.calendar.getUpcoming(5)
        setEvents(data)
      } catch (err) {
        console.error("Failed to load upcoming events:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchEvents()
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

  return (
    <CardBox>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h5 className="card-title">Upcoming Events</h5>
          <p className="text-bodytext dark:text-darklink text-sm">
            Next scheduled activities
          </p>
        </div>
        <Icon icon="solar:calendar-bold" height={24} width={24} className="text-primary" />
      </div>

      {events.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-bodytext dark:text-darklink">
          <Icon icon="solar:calendar-minimalistic-bold" height={32} width={32} className="mb-2 opacity-50" />
          <p className="text-sm">No upcoming events</p>
        </div>
      ) : (
        <div className="space-y-3">
          {events.map((event) => {
            const eventDate = new Date(event.eventStart)
            const isToday = new Date().toDateString() === eventDate.toDateString()

            return (
              <div
                key={event.id}
                className="p-3 rounded-lg border border-border dark:border-darkborder hover:border-primary transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${isToday ? 'bg-warning' : 'bg-primary'}`} />
                    <div className="min-w-0 flex-1">
                      <h6 className="font-medium text-charcoal dark:text-white text-sm truncate">
                        {event.title}
                      </h6>
                      <p className="text-xs text-bodytext dark:text-darklink">
                        {formatEventDate(event.eventStart)}
                      </p>
                      {event.studyCode && (
                        <Badge variant="outline" className="mt-1 text-xs">
                          {event.studyCode}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <span className={`text-xs flex-shrink-0 ml-2 ${isToday ? 'text-warning font-medium' : 'text-primary'}`}>
                    {formatRelativeTime(event.eventStart)}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </CardBox>
  )
}

export { UpcomingEvents }
