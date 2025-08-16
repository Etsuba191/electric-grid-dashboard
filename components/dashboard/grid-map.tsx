"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Zap, AlertTriangle, CheckCircle, Settings, Info } from "lucide-react"

interface GridMapProps {
  filters: any
  userRole: "admin" | "user"
}

interface GridAsset {
  id: string
  name: string
  type: "substation" | "transformer" | "transmission" | "meter"
  status: "normal" | "warning" | "critical" | "maintenance"
  location: { lat: number; lng: number }
  voltage: number
  load: number
  lastUpdate: string
}

export function GridMap({ filters, userRole }: GridMapProps) {
  const [assets, setAssets] = useState<GridAsset[]>([])
  const [selectedAsset, setSelectedAsset] = useState<GridAsset | null>(null)
  const [mapView, setMapView] = useState<"grid" | "satellite">("grid")

  useEffect(() => {
    // Mock grid assets data
    const mockAssets: GridAsset[] = [
      {
        id: "1",
        name: "Central Substation A",
        type: "substation",
        status: "normal",
        location: { lat: 40.7128, lng: -74.006 },
        voltage: 138000,
        load: 85.2,
        lastUpdate: "2 min ago",
      },
      {
        id: "2",
        name: "Transformer T-401",
        type: "transformer",
        status: "warning",
        location: { lat: 40.7589, lng: -73.9851 },
        voltage: 13800,
        load: 92.1,
        lastUpdate: "1 min ago",
      },
      {
        id: "3",
        name: "Transmission Line TL-205",
        type: "transmission",
        status: "critical",
        location: { lat: 40.7282, lng: -73.7949 },
        voltage: 345000,
        load: 98.7,
        lastUpdate: "30 sec ago",
      },
      {
        id: "4",
        name: "Smart Meter Grid SM-1024",
        type: "meter",
        status: "normal",
        location: { lat: 40.6892, lng: -74.0445 },
        voltage: 240,
        load: 67.3,
        lastUpdate: "5 min ago",
      },
    ]

    setAssets(mockAssets)
  }, [filters])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "normal":
        return "text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-500/20"
      case "warning":
        return "text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-500/20"
      case "critical":
        return "text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-500/20"
      case "maintenance":
        return "text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-500/20"
      default:
        return "text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-500/20"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "normal":
        return CheckCircle
      case "warning":
        return AlertTriangle
      case "critical":
        return AlertTriangle
      case "maintenance":
        return Settings
      default:
        return Info
    }
  }

  const getAssetIcon = (type: string) => {
    switch (type) {
      case "substation":
        return Zap
      case "transformer":
        return Settings
      case "transmission":
        return MapPin
      case "meter":
        return CheckCircle
      default:
        return MapPin
    }
  }

  return (
    <Card className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-slate-900 dark:text-white">Grid Infrastructure Map</CardTitle>
          <div className="flex space-x-2">
            <Button variant={mapView === "grid" ? "default" : "outline"} size="sm" onClick={() => setMapView("grid")}>
              Grid
            </Button>
            <Button
              variant={mapView === "satellite" ? "default" : "outline"}
              size="sm"
              onClick={() => setMapView("satellite")}
            >
              Satellite
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Simulated Map Area */}
        <div className="relative bg-slate-100 dark:bg-slate-900 rounded-lg h-96 overflow-hidden border border-slate-300 dark:border-slate-600">
          {/* Grid Background */}
          <div className="absolute inset-0 opacity-20">
            <svg width="100%" height="100%">
              <defs>
                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#374151" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          {/* Asset Markers */}
          {assets.map((asset, index) => {
            const StatusIcon = getStatusIcon(asset.status)
            const AssetIcon = getAssetIcon(asset.type)

            return (
              <div
                key={asset.id}
                className={`absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 ${getStatusColor(asset.status)} p-2 rounded-full border-2 border-current hover:scale-110 transition-transform`}
                style={{
                  left: `${20 + index * 20}%`,
                  top: `${30 + index * 15}%`,
                }}
                onClick={() => setSelectedAsset(asset)}
              >
                <AssetIcon className="h-4 w-4" />
              </div>
            )
          })}

          {/* Connection Lines */}
          <svg className="absolute inset-0 pointer-events-none">
            <line x1="20%" y1="30%" x2="40%" y2="45%" stroke="#3B82F6" strokeWidth="2" strokeDasharray="5,5" />
            <line x1="40%" y1="45%" x2="60%" y2="60%" stroke="#3B82F6" strokeWidth="2" strokeDasharray="5,5" />
            <line x1="60%" y1="60%" x2="80%" y2="75%" stroke="#3B82F6" strokeWidth="2" strokeDasharray="5,5" />
          </svg>
        </div>

        {/* Asset List */}
        <div className="mt-4 space-y-2 max-h-48 overflow-y-auto">
          {assets.map((asset) => {
            const StatusIcon = getStatusIcon(asset.status)
            const AssetIcon = getAssetIcon(asset.type)

            return (
              <div
                key={asset.id}
                className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                  selectedAsset?.id === asset.id
                    ? "bg-slate-100 dark:bg-slate-700 border-blue-500"
                    : "bg-white dark:bg-slate-800/50 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700"
                }`}
                onClick={() => setSelectedAsset(asset)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-1 rounded ${getStatusColor(asset.status)}`}>
                      <AssetIcon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-slate-900 dark:text-white font-medium">{asset.name}</p>
                      <p className="text-sm text-blue-600 dark:text-slate-400 capitalize">{asset.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className={getStatusColor(asset.status)}>
                      <StatusIcon className="h-3 w-3 mr-1" />
                      {asset.status}
                    </Badge>
                  </div>
                </div>

                {selectedAsset?.id === asset.id && (
                  <div className="mt-3 pt-3 border-t border-slate-300 dark:border-slate-600 grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-blue-600 dark:text-slate-400">Voltage</p>
                      <p className="text-slate-900 dark:text-white font-medium">{asset.voltage.toLocaleString()} V</p>
                    </div>
                    <div>
                      <p className="text-blue-600 dark:text-slate-400">Load</p>
                      <p className="text-slate-900 dark:text-white font-medium">{asset.load}%</p>
                    </div>
                    <div>
                      <p className="text-blue-600 dark:text-slate-400">Last Update</p>
                      <p className="text-slate-900 dark:text-white font-medium">{asset.lastUpdate}</p>
                    </div>
                    <div>
                      <p className="text-blue-600 dark:text-slate-400">Status</p>
                      <p className="text-slate-900 dark:text-white font-medium capitalize">{asset.status}</p>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}