"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Calendar, AlertTriangle, Settings, Zap } from "lucide-react"
import type { ProcessedAsset } from "@/lib/processed-data"

interface CalendarWidgetProps {
  selectedDate: Date
  onDateChange: (date: Date) => void
  assets?: ProcessedAsset[]
}

interface CalendarEvent {
  id: string
  title: string
  date: Date
  type: "maintenance" | "outage" | "inspection" | "alert"
  severity?: "low" | "medium" | "high"
}

export function CalendarWidget({ selectedDate, onDateChange, assets = [] }: CalendarWidgetProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  // Generate events based on real asset data
  const generateEventsFromAssets = (): CalendarEvent[] => {
    const events: CalendarEvent[] = []
    const now = new Date()

    // Generate maintenance events for assets with poor status
    assets.forEach((asset, index) => {
      const status = (asset.status || "").toLowerCase()

      if (status === "poor" || status === "critical") {
        const maintenanceDate = new Date(now)
        maintenanceDate.setDate(now.getDate() + (index % 30) + 1) // Spread over next 30 days

        events.push({
          id: `maintenance_${asset.id}`,
          title: `Maintenance: ${asset.name || asset.id}`,
          date: maintenanceDate,
          type: "maintenance",
          severity: status === "critical" ? "high" : "medium"
        })
      }

      if (status === "warning") {
        const inspectionDate = new Date(now)
        inspectionDate.setDate(now.getDate() + (index % 14) + 1) // Spread over next 14 days

        events.push({
          id: `inspection_${asset.id}`,
          title: `Inspection: ${asset.name || asset.id}`,
          date: inspectionDate,
          type: "inspection",
          severity: "low"
        })
      }
    })

    // Add some system-wide events
    const systemEvents = [
      {
        id: "system_maintenance_1",
        title: "Scheduled System Maintenance",
        date: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7),
        type: "maintenance" as const,
        severity: "medium" as const
      },
      {
        id: "grid_inspection_1",
        title: "Monthly Grid Inspection",
        date: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 15),
        type: "inspection" as const,
        severity: "low" as const
      },
      {
        id: "backup_test_1",
        title: "Backup System Test",
        date: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 21),
        type: "maintenance" as const,
        severity: "low" as const
      }
    ]

    events.push(...systemEvents)
    return events
  }

  const [events] = useState<CalendarEvent[]>(generateEventsFromAssets())

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const getEventsForDate = (date: Date) => {
    return events.filter(
      (event) =>
        event.date.getDate() === date.getDate() &&
        event.date.getMonth() === date.getMonth() &&
        event.date.getFullYear() === date.getFullYear(),
    )
  }

  const getEventTypeColor = (type: string, severity?: string) => {
    switch (type) {
      case "maintenance":
        return "bg-blue-500/20 text-blue-400"
      case "outage":
        return severity === "high" ? "bg-red-500/20 text-red-400" : "bg-orange-500/20 text-orange-400"
      case "inspection":
        return "bg-green-500/20 text-green-400"
      case "alert":
        return severity === "high" ? "bg-red-500/20 text-red-400" : "bg-yellow-500/20 text-yellow-400"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getEventIcon = (type: string) => {
    switch (type) {
      case "maintenance":
        return Settings
      case "outage":
        return Zap
      case "inspection":
        return Calendar
      case "alert":
        return AlertTriangle
      default:
        return Calendar
    }
  }

  const navigateMonth = (direction: "prev" | "next") => {
    const newMonth = new Date(currentMonth)
    if (direction === "prev") {
      newMonth.setMonth(newMonth.getMonth() - 1)
    } else {
      newMonth.setMonth(newMonth.getMonth() + 1)
    }
    setCurrentMonth(newMonth)
  }

  const daysInMonth = getDaysInMonth(currentMonth)
  const firstDay = getFirstDayOfMonth(currentMonth)
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)
  const emptyDays = Array.from({ length: firstDay }, (_, i) => i)

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-card-foreground">Grid Events Calendar</CardTitle>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateMonth("prev")}
              className="text-muted-foreground hover:text-card-foreground"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-card-foreground font-medium min-w-[120px] text-center">
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateMonth("next")}
              className="text-muted-foreground hover:text-card-foreground"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1 mb-4">
          {dayNames.map((day) => (
            <div key={day} className="p-2 text-center text-xs font-medium text-muted-foreground">
              {day}
            </div>
          ))}

          {emptyDays.map((day) => (
            <div key={`empty-${day}`} className="p-2 h-10"></div>
          ))}

          {days.map((day) => {
            const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
            const dayEvents = getEventsForDate(date)
            const isSelected =
              selectedDate.getDate() === day &&
              selectedDate.getMonth() === currentMonth.getMonth() &&
              selectedDate.getFullYear() === currentMonth.getFullYear()
            const isToday =
              new Date().getDate() === day &&
              new Date().getMonth() === currentMonth.getMonth() &&
              new Date().getFullYear() === currentMonth.getFullYear()

            return (
              <div
                key={day}
                className={`p-1 h-10 cursor-pointer rounded transition-colors relative ${
                  isSelected
                    ? "bg-blue-600 text-white"
                    : isToday
                      ? "bg-accent text-accent-foreground"
                      : "hover:bg-accent text-card-foreground"
                }`}
                onClick={() => onDateChange(date)}
              >
                <div className="text-xs text-center">{day}</div>
                {dayEvents.length > 0 && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-red-400 rounded-full"></div>
                )}
              </div>
            )
          })}
        </div>

        {/* Events for Selected Date */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-card-foreground">Events for {selectedDate.toLocaleDateString()}</h4>
          {getEventsForDate(selectedDate).length > 0 ? (
            getEventsForDate(selectedDate).map((event) => {
              const EventIcon = getEventIcon(event.type)
              return (
                <div
                  key={event.id}
                  className={`p-2 rounded-lg border ${getEventTypeColor(event.type, event.severity)} border-current/20`}
                >
                  <div className="flex items-center space-x-2">
                    <EventIcon className="h-4 w-4" />
                    <span className="text-sm font-medium">{event.title}</span>
                    {event.severity && (
                      <Badge variant="outline" className="text-xs">
                        {event.severity}
                      </Badge>
                    )}
                  </div>
                </div>
              )
            })
          ) : (
            <p className="text-sm text-muted-foreground">No events scheduled</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
