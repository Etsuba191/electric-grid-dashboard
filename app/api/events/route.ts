import { type NextRequest, NextResponse } from "next/server"

const mockEvents = [
  {
    id: "1",
    title: "Substation A Maintenance",
    description: "Scheduled maintenance for primary transformer",
    date: new Date(2024, 0, 15).toISOString(),
    type: "maintenance",
    severity: "medium",
    assetId: "1",
    duration: 4, // hours
    status: "scheduled",
  },
  {
    id: "2",
    title: "Power Outage - Grid 5",
    description: "Unplanned outage affecting residential area",
    date: new Date(2024, 0, 18).toISOString(),
    type: "outage",
    severity: "high",
    assetId: "3",
    duration: 2,
    status: "resolved",
  },
  {
    id: "3",
    title: "Transformer Inspection",
    description: "Routine safety inspection",
    date: new Date(2024, 0, 22).toISOString(),
    type: "inspection",
    severity: "low",
    assetId: "2",
    duration: 1,
    status: "completed",
  },
]

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const startDate = searchParams.get("startDate")
  const endDate = searchParams.get("endDate")
  const type = searchParams.get("type")

  try {
    let filteredEvents = [...mockEvents]

    if (startDate && endDate) {
      const start = new Date(startDate)
      const end = new Date(endDate)
      filteredEvents = filteredEvents.filter((event) => {
        const eventDate = new Date(event.date)
        return eventDate >= start && eventDate <= end
      })
    }

    if (type) {
      filteredEvents = filteredEvents.filter((event) => event.type === type)
    }

    return NextResponse.json({ events: filteredEvents })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, date, type, severity, assetId, duration } = body

    // In production, save to database
    const newEvent = {
      id: Date.now().toString(),
      title,
      description,
      date,
      type,
      severity,
      assetId,
      duration,
      status: "scheduled",
    }

    console.log("Creating new event:", newEvent)
    return NextResponse.json({ success: true, event: newEvent })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create event" }, { status: 500 })
  }
}
