"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Calendar, AlertTriangle, Settings, Zap } from "lucide-react"

interface CalendarWidgetProps {
  selectedDate: Date
  onDateChange: (date: Date) => void
}

interface CalendarEvent {
  id: string
  title: string
  date: Date
  type: "maintenance" | "outage" | "inspection" | "alert"
  severity?: "low" | "medium" | "high"
}

export function CalendarWidget({ selectedDate, onDateChange }: CalendarWidgetProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [events] = useState<CalendarEvent[]>([
    {
      id: "1",
      title: "Substation A Maintenance",
      date: new Date(2024, 0, 15),
      type: "maintenance",
      severity: "medium",
    },
    {
      id: "2",
      title: "Power Outage - Grid 5",
      date: new Date(2024, 0, 18),
      type: "outage",
      severity: "high",
    },
    {
      id: "3",
      title: "Transformer Inspection",
      date: new Date(2024, 0, 22),
      type: "inspection",
      severity: "low",
    },
    {
      id: "4",
      title: "Critical Alert - Line 401",
      date: new Date(2024, 0, 25),
      type: "alert",
      severity: "high",
    },
  ])

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
        return "bg-gray-500/20 text-gray-400"
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
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white">Grid Events Calendar</CardTitle>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateMonth("prev")}
              className="text-slate-400 hover:text-white"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-white font-medium min-w-[120px] text-center">
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateMonth("next")}
              className="text-slate-400 hover:text-white"
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
            <div key={day} className="p-2 text-center text-xs font-medium text-slate-400">
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
                      ? "bg-slate-700 text-white"
                      : "hover:bg-slate-700 text-slate-300"
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
          <h4 className="text-sm font-medium text-white">Events for {selectedDate.toLocaleDateString()}</h4>
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
            <p className="text-sm text-slate-400">No events scheduled</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
