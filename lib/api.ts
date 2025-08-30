// API utility functions for the dashboard

export interface GridAsset {
  id: string
  name: string
  type: "substation" | "transformer" | "transmission" | "meter" | "generator"
  status: "normal" | "warning" | "critical" | "maintenance"
  location: {
    lat: number
    lng: number
    address: string
  }
  voltage: number
  load: number
  capacity: number
  lastUpdate: string
  alerts: Array<{
    severity: "low" | "medium" | "high" | "critical"
    message: string
  }>
}

export interface GridStatistics {
  totalAssets: number
  activeSubstations: number
  faultAlerts: number
  systemLoad: number
  efficiency: number
  powerGenerated: number
}

export interface GridAlert {
  id: string
  title: string
  message: string
  severity: "info" | "warning" | "critical"
  assetId: string
  assetName: string
  timestamp: string
  acknowledged: boolean
  location: string
}

export interface GridEvent {
  id: string
  title: string
  description: string
  date: string
  type: "maintenance" | "outage" | "inspection" | "alert"
  severity: "low" | "medium" | "high"
  assetId: string
  duration: number
  status: "scheduled" | "in-progress" | "completed" | "resolved"
}

// API functions
export const gridApi = {
  // Get grid data with optional filters
  async getGridData(filters?: {
    location?: string
    assetType?: string
    alertSeverity?: string
  }) {
    const params = new URLSearchParams()
    if (filters?.location) params.append("location", filters.location)
    if (filters?.assetType) params.append("assetType", filters.assetType)
    if (filters?.alertSeverity) params.append("alertSeverity", filters.alertSeverity)

    const response = await fetch(`/api/grid-data?${params}`)
    if (!response.ok) throw new Error("Failed to fetch grid data")
    return response.json()
  },

  // Get specific data type
  async getAssets(filters?: any) {
    const params = new URLSearchParams({ type: "assets" })
    if (filters?.location) params.append("location", filters.location)
    if (filters?.assetType) params.append("assetType", filters.assetType)

    const response = await fetch(`/api/grid-data?${params}`)
    if (!response.ok) throw new Error("Failed to fetch assets")
    return response.json()
  },

  async getStatistics() {
    const response = await fetch("/api/grid-data?type=statistics")
    if (!response.ok) throw new Error("Failed to fetch statistics")
    return response.json()
  },

  async getRealTimeData() {
    const response = await fetch("/api/grid-data?type=realtime")
    if (!response.ok) throw new Error("Failed to fetch real-time data")
    return response.json()
  },

  // Asset management (admin only)
  async updateAsset(assetId: string, data: Partial<GridAsset>) {
    const response = await fetch("/api/grid-data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "update_asset", assetId, data }),
    })
    if (!response.ok) throw new Error("Failed to update asset")
    return response.json()
  },

  async createAsset(data: Omit<GridAsset, "id">) {
    const response = await fetch("/api/grid-data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "create_asset", data }),
    })
    if (!response.ok) throw new Error("Failed to create asset")
    return response.json()
  },

  async deleteAsset(assetId: string) {
    const response = await fetch("/api/grid-data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "delete_asset", assetId }),
    })
    if (!response.ok) throw new Error("Failed to delete asset")
    return response.json()
  },

  // Alerts
  async getAlerts(filters?: {
    severity?: string
    acknowledged?: boolean
  }) {
    const params = new URLSearchParams()
    if (filters?.severity) params.append("severity", filters.severity)
    if (filters?.acknowledged !== undefined) params.append("acknowledged", filters.acknowledged.toString())

    const response = await fetch(`/api/alerts?${params}`)
    if (!response.ok) throw new Error("Failed to fetch alerts")
    return response.json()
  },

  async acknowledgeAlert(alertId: string) {
    const response = await fetch("/api/alerts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "acknowledge", alertId }),
    })
    if (!response.ok) throw new Error("Failed to acknowledge alert")
    return response.json()
  },

  // Events
  async getEvents(filters?: {
    startDate?: string
    endDate?: string
    type?: string
  }) {
    const params = new URLSearchParams()
    if (filters?.startDate) params.append("startDate", filters.startDate)
    if (filters?.endDate) params.append("endDate", filters.endDate)
    if (filters?.type) params.append("type", filters.type)

    const response = await fetch(`/api/events?${params}`)
    if (!response.ok) throw new Error("Failed to fetch events")
    return response.json()
  },

  async createEvent(event: Omit<GridEvent, "id" | "status">) {
    const response = await fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(event),
    })
    if (!response.ok) throw new Error("Failed to create event")
    return response.json()
  },
}

// Utility functions
export const formatVoltage = (voltage: number): string => {
  if (voltage >= 1000) {
    return `${(voltage / 1000).toFixed(1)} kV`
  }
  return `${voltage} V`
}

export const formatPower = (power: number): string => {
  if (power >= 1000000) {
    return `${(power / 1000000).toFixed(1)} GW`
  }
  if (power >= 1000) {
    return `${(power / 1000).toFixed(1)} MW`
  }
  return `${power} kW`
}

export const getStatusColor = (status: string): string => {
  switch (status) {
    case "normal":
      return "text-green-400 bg-green-500/20"
    case "warning":
      return "text-yellow-400 bg-yellow-500/20"
    case "critical":
      return "text-red-400 bg-red-500/20"
    case "maintenance":
      return "text-gray-400 bg-gray-500/20"
    default:
      return "text-gray-400 bg-gray-500/20"
  }
}

export const getSeverityColor = (severity: string): string => {
  switch (severity) {
    case "low":
      return "text-blue-400 bg-blue-500/20"
    case "medium":
      return "text-yellow-400 bg-yellow-500/20"
    case "high":
      return "text-orange-400 bg-orange-500/20"
    case "critical":
      return "text-red-400 bg-red-500/20"
    default:
      return "text-gray-400 bg-gray-500/20"
  }
}
