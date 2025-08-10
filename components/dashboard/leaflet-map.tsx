"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Layers, MapPin, Zap, AlertTriangle } from "lucide-react"
import type { EthiopianGridAsset } from "@/lib/ethiopia-data"

// Dynamically import the map to avoid SSR issues
const DynamicMap = dynamic(() => import("./interactive-map"), {
  ssr: false,
  loading: () => (
    <div className="h-96 bg-slate-900 rounded-lg flex items-center justify-center">
      <div className="text-white">Loading Map...</div>
    </div>
  ),
})

interface LeafletMapProps {
  assets: EthiopianGridAsset[]
  filters: any
  userRole: "admin" | "user"
}

export function LeafletMap({ assets, filters, userRole }: LeafletMapProps) {
  const [selectedAsset, setSelectedAsset] = useState<EthiopianGridAsset | null>(null)
  const [mapView, setMapView] = useState<"satellite" | "street" | "terrain">("street")
  const [assetTypeFilter, setAssetTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  // Filter assets based on current filters
  const filteredAssets = assets.filter((asset) => {
    if (assetTypeFilter !== "all" && asset.type !== assetTypeFilter) return false
    if (statusFilter !== "all" && asset.status !== statusFilter) return false
    return true
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "normal":
        return "#10B981" // green
      case "warning":
        return "#F59E0B" // yellow
      case "critical":
        return "#EF4444" // red
      case "maintenance":
        return "#6B7280" // gray
      default:
        return "#6B7280"
    }
  }

  const getAssetIcon = (type: string) => {
    switch (type) {
      case "substation":
        return "⚡"
      case "transformer":
        return "🔌"
      case "transmission":
        return "📡"
      case "meter":
        return "📊"
      case "generator":
        return "⚙️"
      default:
        return "📍"
    }
  }

  const statusCounts = {
    normal: filteredAssets.filter((a) => a.status === "normal").length,
    warning: filteredAssets.filter((a) => a.status === "warning").length,
    critical: filteredAssets.filter((a) => a.status === "critical").length,
    maintenance: filteredAssets.filter((a) => a.status === "maintenance").length,
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Ethiopian Grid Map</h1>
        <Badge variant="outline" className="text-white">
          {filteredAssets.length} Assets Shown
        </Badge>
      </div>

      {/* Map Controls */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="flex items-center space-x-2">
              <Layers className="h-4 w-4 text-slate-400" />
              <span className="text-sm text-slate-300">Map Type:</span>
              <Select value={mapView} onValueChange={(value: any) => setMapView(value)}>
                <SelectTrigger className="w-32 bg-slate-700 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  <SelectItem value="street">Street</SelectItem>
                  <SelectItem value="satellite">Satellite</SelectItem>
                  <SelectItem value="terrain">Terrain</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-sm text-slate-300">Asset Type:</span>
              <Select value={assetTypeFilter} onValueChange={setAssetTypeFilter}>
                <SelectTrigger className="w-40 bg-slate-700 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="substation">Substations</SelectItem>
                  <SelectItem value="transformer">Transformers</SelectItem>
                  <SelectItem value="transmission">Transmission</SelectItem>
                  <SelectItem value="meter">Meters</SelectItem>
                  <SelectItem value="generator">Generators</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-sm text-slate-300">Status:</span>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32 bg-slate-700 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-400">{statusCounts.normal}</div>
            <div className="text-sm text-slate-400">Normal</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-400">{statusCounts.warning}</div>
            <div className="text-sm text-slate-400">Warning</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-400">{statusCounts.critical}</div>
            <div className="text-sm text-slate-400">Critical</div>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-gray-400">{statusCounts.maintenance}</div>
            <div className="text-sm text-slate-400">Maintenance</div>
          </CardContent>
        </Card>
      </div>

      {/* Interactive Map */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <MapPin className="h-5 w-5" />
            <span>Ethiopian Power Grid Infrastructure</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[600px] rounded-lg overflow-hidden">
            <DynamicMap
              assets={filteredAssets.slice(0, 1000)} // Limit for performance
              mapView={mapView}
              onAssetSelect={setSelectedAsset}
              selectedAsset={selectedAsset}
              getStatusColor={getStatusColor}
              getAssetIcon={getAssetIcon}
            />
          </div>
        </CardContent>
      </Card>

      {/* Selected Asset Details */}
      {selectedAsset && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <Zap className="h-5 w-5 text-blue-400" />
              <span>Asset Details</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">{selectedAsset.name}</h3>
                  <div className="flex items-center space-x-2">
                    <Badge
                      style={{
                        backgroundColor: getStatusColor(selectedAsset.status) + "20",
                        color: getStatusColor(selectedAsset.status),
                      }}
                    >
                      {selectedAsset.status.toUpperCase()}
                    </Badge>
                    <Badge variant="outline" className="text-slate-300">
                      {selectedAsset.type.toUpperCase()}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-slate-400">Region:</span>
                    <p className="text-white font-medium">{selectedAsset.region}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Asset ID:</span>
                    <p className="text-white font-medium">{selectedAsset.id}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Voltage:</span>
                    <p className="text-white font-medium">{selectedAsset.voltage.toLocaleString()} V</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Load:</span>
                    <p className="text-white font-medium">{selectedAsset.load.toFixed(1)}%</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Capacity:</span>
                    <p className="text-white font-medium">{selectedAsset.capacity.toLocaleString()} W</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Last Update:</span>
                    <p className="text-white font-medium">{new Date(selectedAsset.lastUpdate).toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">Location</h4>
                  <p className="text-slate-300">{selectedAsset.location.address}</p>
                  <p className="text-sm text-slate-400">
                    Coordinates: {selectedAsset.location.lat.toFixed(4)}, {selectedAsset.location.lng.toFixed(4)}
                  </p>
                </div>

                {selectedAsset.alerts.length > 0 && (
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-2">Active Alerts</h4>
                    <div className="space-y-2">
                      {selectedAsset.alerts.map((alert, index) => (
                        <div key={index} className="flex items-start space-x-2 p-2 bg-slate-700/50 rounded">
                          <AlertTriangle className="h-4 w-4 text-orange-400 mt-0.5" />
                          <div>
                            <Badge
                              variant="outline"
                              className={`text-xs mb-1 ${
                                alert.severity === "critical"
                                  ? "text-red-400 border-red-400"
                                  : alert.severity === "high"
                                    ? "text-orange-400 border-orange-400"
                                    : alert.severity === "medium"
                                      ? "text-yellow-400 border-yellow-400"
                                      : "text-blue-400 border-blue-400"
                              }`}
                            >
                              {alert.severity.toUpperCase()}
                            </Badge>
                            <p className="text-sm text-slate-300">{alert.message}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {userRole === "admin" && (
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      Edit Asset
                    </Button>
                    <Button size="sm" variant="outline">
                      View History
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
