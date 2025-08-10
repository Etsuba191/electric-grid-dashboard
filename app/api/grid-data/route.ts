import { type NextRequest, NextResponse } from "next/server"

// Mock database - in production, this would be a real database
const mockGridData = {
  assets: [
    {
      id: "1",
      name: "Central Substation A",
      type: "substation",
      status: "normal",
      location: { lat: 40.7128, lng: -74.006, address: "New York, NY" },
      voltage: 138000,
      load: 85.2,
      capacity: 150000,
      lastUpdate: new Date().toISOString(),
      alerts: [],
    },
    {
      id: "2",
      name: "Transformer T-401",
      type: "transformer",
      status: "warning",
      location: { lat: 40.7589, lng: -73.9851, address: "Manhattan, NY" },
      voltage: 13800,
      load: 92.1,
      capacity: 15000,
      lastUpdate: new Date().toISOString(),
      alerts: [{ severity: "medium", message: "High load detected" }],
    },
    {
      id: "3",
      name: "Transmission Line TL-205",
      type: "transmission",
      status: "critical",
      location: { lat: 40.7282, lng: -73.7949, address: "Queens, NY" },
      voltage: 345000,
      load: 98.7,
      capacity: 350000,
      lastUpdate: new Date().toISOString(),
      alerts: [{ severity: "high", message: "Critical overload condition" }],
    },
  ],
  statistics: {
    totalAssets: 1247,
    activeSubstations: 89,
    faultAlerts: 12,
    systemLoad: 78.5,
    efficiency: 94.2,
    powerGenerated: 2847.6,
  },
  realTimeData: {
    voltage: Array.from({ length: 24 }, (_, i) => ({
      time: `${i}:00`,
      voltage: 220 + Math.random() * 20,
      current: 15 + Math.random() * 10,
      power: 3300 + Math.random() * 500,
    })),
  },
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get("type")
  const location = searchParams.get("location")
  const assetType = searchParams.get("assetType")
  const alertSeverity = searchParams.get("alertSeverity")

  try {
    // Simulate database query delay
    await new Promise((resolve) => setTimeout(resolve, 100))

    const filteredData = { ...mockGridData }

    // Apply filters
    if (location || assetType || alertSeverity) {
      filteredData.assets = mockGridData.assets.filter((asset) => {
        if (location && !asset.location.address.toLowerCase().includes(location.toLowerCase())) {
          return false
        }
        if (assetType && asset.type !== assetType.toLowerCase()) {
          return false
        }
        if (alertSeverity && !asset.alerts.some((alert) => alert.severity === alertSeverity.toLowerCase())) {
          return false
        }
        return true
      })
    }

    // Return specific data type if requested
    if (type === "assets") {
      return NextResponse.json({ assets: filteredData.assets })
    }
    if (type === "statistics") {
      return NextResponse.json({ statistics: filteredData.statistics })
    }
    if (type === "realtime") {
      return NextResponse.json({ realTimeData: filteredData.realTimeData })
    }

    return NextResponse.json(filteredData)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch grid data" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, assetId, data } = body

    // Simulate admin operations
    if (action === "update_asset") {
      // In production, update the database
      console.log(`Updating asset ${assetId}:`, data)
      return NextResponse.json({ success: true, message: "Asset updated successfully" })
    }

    if (action === "create_asset") {
      // In production, create new asset in database
      console.log("Creating new asset:", data)
      return NextResponse.json({ success: true, message: "Asset created successfully" })
    }

    if (action === "delete_asset") {
      // In production, delete asset from database
      console.log(`Deleting asset ${assetId}`)
      return NextResponse.json({ success: true, message: "Asset deleted successfully" })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 })
  }
}
