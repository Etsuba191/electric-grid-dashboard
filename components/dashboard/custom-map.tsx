"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Layers, MapPin, Zap, AlertTriangle, Plus, Minus, RotateCcw } from "lucide-react"
import type { EthiopianGridAsset } from "@/lib/ethiopia-data"

interface CustomMapProps {
  assets: EthiopianGridAsset[]
  filters: any
  userRole: "admin" | "user"
}

export function CustomMap({ assets, filters, userRole }: CustomMapProps) {
  const [selectedAsset, setSelectedAsset] = useState<EthiopianGridAsset | null>(null)
  const [mapView, setMapView] = useState<"satellite" | "street" | "terrain">("street")
  const [assetTypeFilter, setAssetTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const mapRef = useRef<HTMLDivElement>(null)

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

  // Convert lat/lng to pixel coordinates
  const latLngToPixel = (lat: number, lng: number, mapWidth: number, mapHeight: number) => {
    // Ethiopia bounds: roughly 3°N to 15°N, 33°E to 48°E
    const minLat = 3
    const maxLat = 15
    const minLng = 33
    const maxLng = 48

    const x = ((lng - minLng) / (maxLng - minLng)) * mapWidth
    const y = ((maxLat - lat) / (maxLat - minLat)) * mapHeight

    return {
      x: x * zoom + pan.x,
      y: y * zoom + pan.y,
    }
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev * 1.5, 5))
  }

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev / 1.5, 0.5))
  }

  const resetView = () => {
    setZoom(1)
    setPan({ x: 0, y: 0 })
  }

  const statusCounts = {
    normal: filteredAssets.filter((a) => a.status === "normal").length,
    warning: filteredAssets.filter((a) => a.status === "warning").length,
    critical: filteredAssets.filter((a) => a.status === "critical").length,
    maintenance: filteredAssets.filter((a) => a.status === "maintenance").length,
  }

  const getMapBackground = () => {
    switch (mapView) {
      case "satellite":
        return "linear-gradient(135deg, #2d5016 0%, #3d6b1f 25%, #4a7c23 50%, #2d5016 75%, #1a3d0a 100%)"
      case "terrain":
        return "linear-gradient(135deg, #8B4513 0%, #A0522D 25%, #CD853F 50%, #DEB887 75%, #F5DEB3 100%)"
      default:
        return "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 25%, #bae6fd 50%, #7dd3fc 75%, #38bdf8 100%)"
    }
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
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center space-x-2">
              <MapPin className="h-5 w-5" />
              <span>Ethiopian Power Grid Infrastructure</span>
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Button size="sm" variant="outline" onClick={handleZoomIn}>
                <Plus className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="outline" onClick={handleZoomOut}>
                <Minus className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="outline" onClick={resetView}>
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div
            ref={mapRef}
            className="relative h-[600px] rounded-lg overflow-hidden cursor-move border-2 border-slate-600"
            style={{
              background: getMapBackground(),
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {/* Ethiopia Outline */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              style={{
                transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
              }}
            >
              {/* Simplified Ethiopia border */}
              <path
                d="M 100 150 L 500 150 L 550 200 L 580 300 L 550 400 L 500 450 L 400 480 L 300 470 L 200 450 L 150 400 L 120 350 L 100 300 Z"
                fill="none"
                stroke="rgba(255,255,255,0.3)"
                strokeWidth="2"
                strokeDasharray="5,5"
              />
              {/* Regional boundaries */}
              <line x1="200" y1="200" x2="400" y2="250" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
              <line x1="300" y1="180" x2="350" y2="350" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
              <line x1="150" y1="300" x2="450" y2="320" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
            </svg>

            {/* Asset Markers */}
            {filteredAssets.slice(0, 500).map((asset, index) => {
              const position = latLngToPixel(asset.location.lat, asset.location.lng, 600, 600)
              const isSelected = selectedAsset?.id === asset.id

              return (
                <div
                  key={asset.id}
                  className={`absolute cursor-pointer transition-all duration-200 ${
                    isSelected ? "z-50 scale-150" : "z-10 hover:scale-125"
                  }`}
                  style={{
                    left: `${position.x}px`,
                    top: `${position.y}px`,
                    transform: "translate(-50%, -50%)",
                  }}
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedAsset(asset)
                  }}
                  title={`${asset.name} - ${asset.status}`}
                >
                  <div
                    className="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-xs shadow-lg"
                    style={{
                      backgroundColor: getStatusColor(asset.status),
                      boxShadow: isSelected ? `0 0 20px ${getStatusColor(asset.status)}` : "0 2px 4px rgba(0,0,0,0.3)",
                    }}
                  >
                    {getAssetIcon(asset.type)}
                  </div>
                  {isSelected && (
                    <div className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white p-2 rounded shadow-lg min-w-48 z-60">
                      <div className="text-sm font-semibold">{asset.name}</div>
                      <div className="text-xs text-slate-300">{asset.region}</div>
                      <div className="text-xs">Load: {asset.load.toFixed(1)}%</div>
                      {asset.alerts.length > 0 && (
                        <div className="text-xs text-red-400">⚠️ {asset.alerts.length} Alert(s)</div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}

            {/* Map Legend */}
            <div className="absolute bottom-4 left-4 bg-slate-800/90 p-3 rounded-lg text-white text-xs">
              <div className="font-semibold mb-2">Legend</div>
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span>Normal</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <span>Warning</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span>Critical</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-gray-500"></div>
                  <span>Maintenance</span>
                </div>
              </div>
            </div>

            {/* Zoom Level Indicator */}
            <div className="absolute top-4 right-4 bg-slate-800/90 p-2 rounded text-white text-xs">
              Zoom: {zoom.toFixed(1)}x
            </div>
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
