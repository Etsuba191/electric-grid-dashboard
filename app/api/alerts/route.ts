import { type NextRequest, NextResponse } from "next/server"

const mockAlerts = [
  {
    id: "1",
    title: "High Load Warning",
    message: "Transformer T-401 is operating at 92% capacity",
    severity: "warning",
    assetId: "2",
    assetName: "Transformer T-401",
    timestamp: new Date().toISOString(),
    acknowledged: false,
    location: "Manhattan, NY",
  },
  {
    id: "2",
    title: "Critical Overload",
    message: "Transmission Line TL-205 has exceeded safe operating limits",
    severity: "critical",
    assetId: "3",
    assetName: "Transmission Line TL-205",
    timestamp: new Date(Date.now() - 300000).toISOString(), // 5 minutes ago
    acknowledged: false,
    location: "Queens, NY",
  },
  {
    id: "3",
    title: "Maintenance Required",
    message: "Scheduled maintenance due for Substation A",
    severity: "info",
    assetId: "1",
    assetName: "Central Substation A",
    timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    acknowledged: true,
    location: "New York, NY",
  },
]

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const severity = searchParams.get("severity")
  const acknowledged = searchParams.get("acknowledged")

  try {
    let filteredAlerts = [...mockAlerts]

    if (severity) {
      filteredAlerts = filteredAlerts.filter((alert) => alert.severity === severity)
    }

    if (acknowledged !== null) {
      const isAcknowledged = acknowledged === "true"
      filteredAlerts = filteredAlerts.filter((alert) => alert.acknowledged === isAcknowledged)
    }

    return NextResponse.json({ alerts: filteredAlerts })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch alerts" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, alertId } = body

    if (action === "acknowledge") {
      // In production, update the database
      console.log(`Acknowledging alert ${alertId}`)
      return NextResponse.json({ success: true, message: "Alert acknowledged" })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 })
  }
}
