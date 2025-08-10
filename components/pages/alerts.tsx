"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertTriangle, CheckCircle, Search, Bell } from "lucide-react"
import type { EthiopianGridAsset } from "@/lib/ethiopia-data"

interface Alert {
  id: string
  assetId: string
  assetName: string
  region: string
  severity: "low" | "medium" | "high" | "critical"
  message: string
  timestamp: string
  acknowledged: boolean
}

interface AlertsPageProps {
  assets: EthiopianGridAsset[]
}

export function AlertsPage({ assets }: AlertsPageProps) {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [filteredAlerts, setFilteredAlerts] = useState<Alert[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [severityFilter, setSeverityFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  useEffect(() => {
    // Generate alerts from assets
    const allAlerts: Alert[] = []

    assets.forEach((asset) => {
      asset.alerts.forEach((alert, index) => {
        allAlerts.push({
          id: `${asset.id}-${index}`,
          assetId: asset.id,
          assetName: asset.name,
          region: asset.region,
          severity: alert.severity,
          message: alert.message,
          timestamp: asset.lastUpdate,
          acknowledged: Math.random() > 0.7, // Randomly acknowledge some alerts
        })
      })
    })

    // Sort by timestamp (newest first)
    allAlerts.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

    setAlerts(allAlerts)
  }, [assets])

  useEffect(() => {
    let filtered = alerts

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (alert) =>
          alert.assetName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          alert.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
          alert.message.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Apply severity filter
    if (severityFilter !== "all") {
      filtered = filtered.filter((alert) => alert.severity === severityFilter)
    }

    // Apply status filter
    if (statusFilter !== "all") {
      const isAcknowledged = statusFilter === "acknowledged"
      filtered = filtered.filter((alert) => alert.acknowledged === isAcknowledged)
    }

    setFilteredAlerts(filtered)
  }, [alerts, searchQuery, severityFilter, statusFilter])

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "text-red-400 bg-red-500/20 border-red-500/30"
      case "high":
        return "text-orange-400 bg-orange-500/20 border-orange-500/30"
      case "medium":
        return "text-yellow-400 bg-yellow-500/20 border-yellow-500/30"
      case "low":
        return "text-blue-400 bg-blue-500/20 border-blue-500/30"
      default:
        return "text-gray-400 bg-gray-500/20 border-gray-500/30"
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical":
      case "high":
        return AlertTriangle
      default:
        return Bell
    }
  }

  const acknowledgeAlert = (alertId: string) => {
    setAlerts((prev) => prev.map((alert) => (alert.id === alertId ? { ...alert, acknowledged: true } : alert)))
  }

  const acknowledgeAll = () => {
    setAlerts((prev) => prev.map((alert) => ({ ...alert, acknowledged: true })))
  }

  const activeAlertsCount = alerts.filter((alert) => !alert.acknowledged).length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">System Alerts</h1>
        <div className="flex items-center space-x-4">
          <Badge variant="outline" className="text-white">
            {activeAlertsCount} Active
          </Badge>
          {activeAlertsCount > 0 && (
            <Button onClick={acknowledgeAll} size="sm">
              Acknowledge All
            </Button>
          )}
        </div>
      </div>

      {/* Filters */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search alerts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <Select value={severityFilter} onValueChange={setSeverityFilter}>
              <SelectTrigger className="w-48 bg-slate-700 border-slate-600 text-white">
                <SelectValue placeholder="Filter by severity" />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600">
                <SelectItem value="all">All Severities</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48 bg-slate-700 border-slate-600 text-white">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="acknowledged">Acknowledged</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Alerts List */}
      {filteredAlerts.length === 0 ? (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-8 text-center">
            <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Alerts Found</h3>
            <p className="text-slate-400">
              {alerts.length === 0 ? "All systems are operating normally." : "No alerts match your current filters."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredAlerts.map((alert) => {
            const SeverityIcon = getSeverityIcon(alert.severity)
            return (
              <Card
                key={alert.id}
                className={`bg-slate-800/50 border-slate-700 ${
                  !alert.acknowledged ? "border-l-4 border-l-orange-500" : ""
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <SeverityIcon className="h-5 w-5 text-orange-400" />
                        <h3 className="text-lg font-semibold text-white">{alert.assetName}</h3>
                        <Badge className={getSeverityColor(alert.severity)} variant="outline">
                          {alert.severity.toUpperCase()}
                        </Badge>
                        {alert.acknowledged && (
                          <Badge variant="outline" className="text-green-400 border-green-400">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Acknowledged
                          </Badge>
                        )}
                      </div>
                      <p className="text-slate-300 mb-3">{alert.message}</p>
                      <div className="flex items-center space-x-4 text-sm text-slate-400">
                        <span>Region: {alert.region}</span>
                        <span>Time: {new Date(alert.timestamp).toLocaleString()}</span>
                        <span>Asset ID: {alert.assetId}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      {!alert.acknowledged && (
                        <Button size="sm" onClick={() => acknowledgeAlert(alert.id)}>
                          Acknowledge
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-400">
              {alerts.filter((a) => a.severity === "critical").length}
            </div>
            <div className="text-sm text-slate-400">Critical</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-400">
              {alerts.filter((a) => a.severity === "high").length}
            </div>
            <div className="text-sm text-slate-400">High</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-400">
              {alerts.filter((a) => a.severity === "medium").length}
            </div>
            <div className="text-sm text-slate-400">Medium</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-400">{alerts.filter((a) => a.severity === "low").length}</div>
            <div className="text-sm text-slate-400">Low</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
