"use client"

import { useState, useEffect, useMemo } from "react"
import dynamic from "next/dynamic"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Layers, MapPin, Zap, AlertTriangle } from "lucide-react"

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
  assets: any[]
  zoneData: GeoJSON.FeatureCollection | null
  filters: any
  userRole: "admin" | "user"
}

export function LeafletMap({ assets, zoneData, filters, userRole }: LeafletMapProps) {
  const [selectedAsset, setSelectedAsset] = useState<any | null>(null)
  const [mapView, setMapView] = useState<"satellite" | "street" | "terrain">("street")
  const [assetTypeFilter, setAssetTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  // Normalize tower status and interleave assets so 'All Types' shows both towers and substations
  const normalizeTowerStatus = (s: any): "normal" | "warning" | "critical" | "maintenance" | undefined => {
    const v = String(s || "").toUpperCase()
    if (v === "GOOD" || v === "EXCELLENT" || v === "NORMAL") return "normal"
    if (v === "WARNING" || v === "FAIR") return "warning"
    if (v === "CRITICAL" || v === "POOR") return "critical"
    if (v === "MAINTENANCE") return "maintenance"
    // Treat unknown/unmapped tower statuses as Maintenance/Unknown for consistency
    return "maintenance"
  }

  const towersAll = assets.filter((a: any) => a.source === "tower")
  const subsAll = assets.filter((a: any) => a.source === "substation")
  const plantsAll = assets.filter((a: any) => a.source === "generation_plant")
  const linesAll = assets.filter((a: any) => a.source === "transmission_line")

  const availableStatuses = useMemo(() => ["normal", "warning", "critical", "maintenance"], [])

  const towersFiltered = towersAll.filter((t: any) => {
    if (assetTypeFilter && assetTypeFilter !== "all" && assetTypeFilter !== "tower") return false
    if (statusFilter !== "all") return normalizeTowerStatus(t.status) === statusFilter
    return true
  })

  const subsFiltered = subsAll.filter((s: any) => {
    if (assetTypeFilter && assetTypeFilter !== "all" && assetTypeFilter !== "substation") return false
    return statusFilter === "all"
  })

  const plantsFiltered = plantsAll.filter((p: any) => {
    if (assetTypeFilter && assetTypeFilter !== "all" && assetTypeFilter !== "generation_plant") return false
    return true
  })

  const linesFiltered = linesAll.filter((l: any) => {
    if (assetTypeFilter && assetTypeFilter !== "all" && assetTypeFilter !== "transmission_line") return false
    return true
  })

  const finalAssets = [...towersFiltered, ...subsFiltered, ...plantsFiltered, ...linesFiltered]

  const getStatusColor = (status: string) => {
    const s = normalizeTowerStatus(status) || "maintenance"
    switch (s) {
      case "normal":
        return "#10B981" // green
      case "warning":
        return "#F59E0B" // yellow
      case "critical":
        return "#EF4444" // red
      case "maintenance":
      default:
        return "#6B7280" // gray
    }
  }

  const getAssetIcon = (type: string) => {
    switch (type) {
      case "substation":
        return "⚡"
      case "tower":
        return "🗼"
      case "generation_plant":
        return "⚙️"
      case "transmission_line":
        return "📡"
      default:
        return "📍"
    }
  }

  const statusCounts = {
    normal: towersAll.filter((t: any) => normalizeTowerStatus(t.status) === "normal").length,
    warning: towersAll.filter((t: any) => normalizeTowerStatus(t.status) === "warning").length,
    critical: towersAll.filter((t: any) => normalizeTowerStatus(t.status) === "critical").length,
    maintenance: towersAll.filter((t: any) => normalizeTowerStatus(t.status) === "maintenance").length,
  }

  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Ethiopian Grid Map</h1>
        <Badge variant="outline" className="text-slate-900 dark:text-white border-slate-300 dark:border-slate-800">
          {finalAssets.length} Assets Shown
        </Badge>
      </div>

      {/* Map Controls */}
      <Card className="bg-card border-border">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="flex items-center space-x-2">
              <Layers className="h-4 w-4 text-blue-500 dark:text-slate-400" />
              <span className="text-sm text-slate-700 dark:text-slate-300">Map Type:</span>
              <Select value={mapView} onValueChange={(value: any) => setMapView(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="street">Street</SelectItem>
                  <SelectItem value="satellite">Satellite</SelectItem>
                  <SelectItem value="terrain">Terrain</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-sm text-slate-700 dark:text-slate-300">Asset Type:</span>
              <Select value={assetTypeFilter} onValueChange={setAssetTypeFilter}>
                <SelectTrigger className="w-52">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="tower">Electric Towers</SelectItem>
                  <SelectItem value="substation">Substations</SelectItem>
                  <SelectItem value="generation_plant">Generation Plants</SelectItem>
                  <SelectItem value="transmission_line">Transmission Lines</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-sm text-slate-700 dark:text-slate-300">Status:</span>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  {availableStatuses.map((s) => (
                    <SelectItem key={s} value={s}>{s[0].toUpperCase() + s.slice(1)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status Summary */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-slate-900 dark:text-white">Tower Status Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">{statusCounts.normal}</div>
              <div className="text-sm text-green-700 dark:text-green-300">Normal</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20">
              <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{statusCounts.warning}</div>
              <div className="text-sm text-yellow-700 dark:text-yellow-300">Warning</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-red-50 dark:bg-red-900/20">
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">{statusCounts.critical}</div>
              <div className="text-sm text-red-700 dark:text-red-300">Critical</div>
            </div>
            <div className="text-center p-3 rounded-lg bg-gray-50 dark:bg-gray-900/20">
              <div className="text-2xl font-bold text-gray-600 dark:text-gray-400">{statusCounts.maintenance}</div>
              <div className="text-sm text-gray-700 dark:text-gray-300">Maintenance</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <Card className="bg-card border-border">
        <CardContent className="p-3">
          <div className="flex flex-wrap items-center gap-4 text-sm">
                                                            <div className="flex items-center gap-2 ml-4">
              <span className="inline-block">🗼</span>
              <span>Towers</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block">⚡</span>
              <span>Substations</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block">⚙️</span>
              <span>Generation Plants</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block">📡</span>
              <span>Transmission Lines</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Interactive Map */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-slate-900 dark:text-white flex items-center space-x-2">
            <MapPin className="h-5 w-5" />
            <span>Ethiopian Power Grid Infrastructure</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[600px] rounded-lg overflow-hidden">
            {mounted && (
              <DynamicMap
                zoneData={zoneData}
                assets={finalAssets}
                mapView={mapView}
                onAssetSelect={setSelectedAsset}
                selectedAsset={selectedAsset}
                getStatusColor={getStatusColor}
                getAssetIcon={getAssetIcon}
              />
            )}
          </div>
        </CardContent>
      </Card>

      {/* Selected Asset Details */}
      {selectedAsset && (
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-slate-900 dark:text-white flex items-center space-x-2">
              <Zap className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <span>Asset Details</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">{selectedAsset.name || selectedAsset.source}</h3>
                  {selectedAsset.source === 'tower' && selectedAsset.status && (
                    <Badge variant="outline">
                      {selectedAsset.status.toUpperCase()}
                    </Badge>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  {selectedAsset.source === 'tower' && (
                    <>
                      <div>
                        <span className="text-blue-600 dark:text-slate-400">Site:</span>
                        <p className="text-slate-900 dark:text-white font-medium">{selectedAsset.site || "-"}</p>
                      </div>
                      <div>
                        <span className="text-blue-600 dark:text-slate-400">Zone:</span>
                        <p className="text-slate-900 dark:text-white font-medium">{selectedAsset.zone || "-"}</p>
                      </div>
                      <div>
                        <span className="text-blue-600 dark:text-slate-400">Woreda:</span>
                        <p className="text-slate-900 dark:text-white font-medium">{selectedAsset.woreda || "-"}</p>
                      </div>
                      <div>
                        <span className="text-blue-600 dark:text-slate-400">Category:</span>
                        <p className="text-slate-900 dark:text-white font-medium">{selectedAsset.category || "-"}</p>
                      </div>
                      <div>
                        <span className="text-blue-600 dark:text-slate-400">Name Link:</span>
                        <p className="text-slate-900 dark:text-white font-medium">{selectedAsset.name_link || "-"}</p>
                      </div>
                    </>
                  )}

                  {selectedAsset.source === 'substation' && (
                    <>
                      <div>
                        <span className="text-blue-600 dark:text-slate-400">Voltage LE:</span>
                        <p className="text-slate-900 dark:text-white font-medium">{selectedAsset.voltage_le ?? '-'}</p>
                      </div>
                      <div>
                        <span className="text-blue-600 dark:text-slate-400">Voltage SP:</span>
                        <p className="text-slate-900 dark:text-white font-medium">{selectedAsset.voltage_sp || '-'}</p>
                      </div>
                    </>
                  )}

                  {selectedAsset.source === 'generation_plant' && (
                    <>
                      <div>
                        <span className="text-blue-600 dark:text-slate-400">Type:</span>
                        <p className="text-slate-900 dark:text-white font-medium">{selectedAsset.plant_type || '-'}</p>
                      </div>
                      <div>
                        <span className="text-blue-600 dark:text-slate-400">Capacity MW:</span>
                        <p className="text-slate-900 dark:text-white font-medium">{selectedAsset.capacity_mw ?? '-'}</p>
                      </div>
                      <div>
                        <span className="text-blue-600 dark:text-slate-400">Year:</span>
                        <p className="text-slate-900 dark:text-white font-medium">{selectedAsset.year_operational || '-'}</p>
                      </div>
                    </>
                  )}

                  {selectedAsset.source === 'transmission_line' && (
                    <>
                      <div>
                        <span className="text-blue-600 dark:text-slate-400">Voltage:</span>
                        <p className="text-slate-900 dark:text-white font-medium">{selectedAsset.line_voltage ?? '-'}</p>
                      </div>
                      <div>
                        <span className="text-blue-600 dark:text-slate-400">Length:</span>
                        <p className="text-slate-900 dark:text-white font-medium">{selectedAsset.line_length_km ?? '-'}</p>
                      </div>
                    </>
                  )}
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Location</h4>
                  <p className="text-sm text-blue-600 dark:text-slate-400">
                    Coordinates: {selectedAsset.lat?.toFixed(4)}, {selectedAsset.lng?.toFixed(4)}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}