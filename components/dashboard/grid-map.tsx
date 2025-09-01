"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
<<<<<<< HEAD
import { MapPin, Zap, AlertTriangle, CheckCircle, Settings, Info, Building2, Power, Plus, Trash2, Pencil } from "lucide-react"
import type { ProcessedAsset } from "@/lib/processed-data"

interface GridMapProps {
  assets: any[];
  filters: any;
  userRole: "admin" | "user";
  onAddAsset?: (asset: any) => void;
  onUpdateAsset?: (id: string, updates: any) => void;
  onDeleteAsset?: (id: string) => void;
  small?: boolean;
}

export function GridMap({ assets, filters, userRole, onAddAsset, onUpdateAsset, onDeleteAsset, small }: GridMapProps) {
  const [selectedAsset, setSelectedAsset] = useState<any | null>(null);
  const [mapView, setMapView] = useState<"grid" | "satellite">("grid");
  const [filteredAssets, setFilteredAssets] = useState<any[]>(assets);
  // Admin asset form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAsset, setNewAsset] = useState({
    name: "",
    type: "substation",
    status: "normal",
    latitude: 9.0,
    longitude: 39.0,
    address: "",
    voltage: 0,
    load: 0,
    capacity: 0,
  });
  const [editAssetId, setEditAssetId] = useState<string | null>(null);
  const [editAsset, setEditAsset] = useState<any>(null);

  useEffect(() => {
    // Filter assets based on filters
    let filtered = assets

    if (filters.location) {
      filtered = filtered.filter(asset => 
        asset.poletical && asset.poletical.toLowerCase().includes(filters.location.toLowerCase())
      )
    }

    if (filters.assetType && filters.assetType !== "all") {
      filtered = filtered.filter(asset => asset.source === filters.assetType)
    }

    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase()
      filtered = filtered.filter(asset => 
        asset.name && asset.name.toLowerCase().includes(query)
      )
    }

    setFilteredAssets(filtered)
  }, [assets, filters])

  const getStatusColor = (asset: ProcessedAsset) => {
    if (asset.source === "tower") {
      const status = (asset.status || "").toLowerCase()
      switch (status) {
        case "good":
        case "excellent":
        case "normal":
          return "text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-500/20"
        case "warning":
          return "text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-500/20"
        case "critical":
        case "poor":
          return "text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-500/20"
        case "maintenance":
          return "text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-500/20"
        default:
          return "text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-500/20"
      }
    }
    return "text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-500/20"
  }

  const getStatusIcon = (asset: ProcessedAsset) => {
    if (asset.source === "tower") {
      const status = (asset.status || "").toLowerCase()
      switch (status) {
        case "good":
        case "excellent":
        case "normal":
          return CheckCircle
        case "warning":
        case "critical":
        case "poor":
          return AlertTriangle
        case "maintenance":
          return Settings
        default:
          return Info
      }
    }
    return Info
  }

  const getAssetIcon = (asset: ProcessedAsset) => {
    switch (asset.source) {
      case "tower":
        return Building2
      case "substation":
        return Zap
      case "generation_plant":
        return Power
      case "transmission_line":
        return MapPin
=======
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
>>>>>>> 84061cf73c66a09a4f9d9542250c164b87a3ac9d
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
<<<<<<< HEAD
            {userRole === "admin" && (
              <Button variant="outline" size="sm" onClick={() => setShowAddForm((v) => !v)}>
                <Plus className="h-4 w-4 mr-1" /> Add Asset
              </Button>
            )}
          </div>
        </div>
        {/* Admin Add Asset Form */}
        {userRole === "admin" && showAddForm && (
          <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg mb-4">
            <div className="flex flex-wrap gap-2">
              <input className="border p-1 rounded" placeholder="Name" value={newAsset.name} onChange={e => setNewAsset({ ...newAsset, name: e.target.value })} />
              <input className="border p-1 rounded" placeholder="Type" value={newAsset.type} onChange={e => setNewAsset({ ...newAsset, type: e.target.value })} />
              <input className="border p-1 rounded" placeholder="Status" value={newAsset.status} onChange={e => setNewAsset({ ...newAsset, status: e.target.value })} />
              <input className="border p-1 rounded" placeholder="Address" value={newAsset.address} onChange={e => setNewAsset({ ...newAsset, address: e.target.value })} />
              <input className="border p-1 rounded" type="number" placeholder="Latitude" value={newAsset.latitude} onChange={e => setNewAsset({ ...newAsset, latitude: parseFloat(e.target.value) })} />
              <input className="border p-1 rounded" type="number" placeholder="Longitude" value={newAsset.longitude} onChange={e => setNewAsset({ ...newAsset, longitude: parseFloat(e.target.value) })} />
              <input className="border p-1 rounded" type="number" placeholder="Voltage" value={newAsset.voltage} onChange={e => setNewAsset({ ...newAsset, voltage: parseInt(e.target.value) })} />
              <input className="border p-1 rounded" type="number" placeholder="Load" value={newAsset.load} onChange={e => setNewAsset({ ...newAsset, load: parseFloat(e.target.value) })} />
              <input className="border p-1 rounded" type="number" placeholder="Capacity" value={newAsset.capacity} onChange={e => setNewAsset({ ...newAsset, capacity: parseInt(e.target.value) })} />
              <Button size="sm" onClick={() => { onAddAsset && onAddAsset(newAsset); setShowAddForm(false); setNewAsset({ name: "", type: "substation", status: "normal", latitude: 9.0, longitude: 39.0, address: "", voltage: 0, load: 0, capacity: 0 }); }}>Add</Button>
            </div>
          </div>
        )}
      </CardHeader>
      <CardContent>
        {/* Simulated Map Area */}
        <div className={`relative bg-slate-100 dark:bg-slate-900 rounded-lg ${small ? "h-72" : "h-96"} overflow-hidden border border-slate-300 dark:border-slate-600`}>
=======
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Simulated Map Area */}
        <div className="relative bg-slate-100 dark:bg-slate-900 rounded-lg h-96 overflow-hidden border border-slate-300 dark:border-slate-600">
>>>>>>> 84061cf73c66a09a4f9d9542250c164b87a3ac9d
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
<<<<<<< HEAD
          {filteredAssets.slice(0, 20).map((asset, index) => {
            const StatusIcon = getStatusIcon(asset)
            const AssetIcon = getAssetIcon(asset)

            // Convert lat/lng to percentage positions for display
            const latPercent = ((asset.lat - 3) / (15 - 3)) * 100 // Ethiopia lat range ~3-15
            const lngPercent = ((asset.lng - 33) / (48 - 33)) * 100 // Ethiopia lng range ~33-48

            return (
              <div
                key={asset.id + "_marker_" + index}
                className={`absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 ${getStatusColor(asset)} p-2 rounded-full border-2 border-current hover:scale-110 transition-transform`}
                style={{
                  left: `${Math.max(5, Math.min(95, lngPercent))}%`,
                  top: `${Math.max(5, Math.min(95, 100 - latPercent))}%`,
=======
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
>>>>>>> 84061cf73c66a09a4f9d9542250c164b87a3ac9d
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
<<<<<<< HEAD
          {filteredAssets.slice(0, 10).map((asset) => {
            const StatusIcon = getStatusIcon(asset);
            const AssetIcon = getAssetIcon(asset);
            return (
              <div
                key={asset.id + "_list_"}
=======
          {assets.map((asset) => {
            const StatusIcon = getStatusIcon(asset.status)
            const AssetIcon = getAssetIcon(asset.type)

            return (
              <div
                key={asset.id}
>>>>>>> 84061cf73c66a09a4f9d9542250c164b87a3ac9d
                className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                  selectedAsset?.id === asset.id
                    ? "bg-slate-100 dark:bg-slate-700 border-blue-500"
                    : "bg-white dark:bg-slate-800/50 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700"
                }`}
                onClick={() => setSelectedAsset(asset)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
<<<<<<< HEAD
                    <div className={`p-1 rounded ${getStatusColor(asset)}`}>
                      <AssetIcon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-slate-900 dark:text-white font-medium">{asset.name || `${asset.source} ${asset.id}`}</p>
                      <p className="text-sm text-blue-600 dark:text-slate-400 capitalize">
                        {asset.source === "tower" ? "Electric Tower" : 
                         asset.type === "substation" ? "Substation" :
                         asset.type === "generation_plant" ? "Generation Plant" :
                         asset.type === "transmission_line" ? "Transmission Line" : asset.type}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className={getStatusColor(asset)}>
                      <StatusIcon className="h-3 w-3 mr-1" />
                      {asset.status || "ACTIVE"}
                    </Badge>
                    {userRole === "admin" && (
                      <>
                        <Button size="icon" variant="ghost" onClick={e => { e.stopPropagation(); setEditAssetId(asset.id); setEditAsset(asset); }}><Pencil className="h-4 w-4" /></Button>
                        <Button size="icon" variant="ghost" onClick={e => { e.stopPropagation(); onDeleteAsset && onDeleteAsset(asset.id); }}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                      </>
                    )}
                  </div>
                </div>
                {selectedAsset?.id === asset.id && (
                  <div className="mt-3 pt-3 border-t border-slate-300 dark:border-slate-600 grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-blue-600 dark:text-slate-400">Region</p>
                      <p className="text-slate-900 dark:text-white font-medium">{asset.address || asset.poletical || "Unknown"}</p>
                    </div>
                    <div>
                      <p className="text-blue-600 dark:text-slate-400">Coordinates</p>
                      <p className="text-slate-900 dark:text-white font-medium">{asset.latitude?.toFixed(3) || asset.lat?.toFixed(3)}, {asset.longitude?.toFixed(3) || asset.lng?.toFixed(3)}</p>
                    </div>
                    {asset.voltage && (
                      <div>
                        <p className="text-blue-600 dark:text-slate-400">Voltage</p>
                        <p className="text-slate-900 dark:text-white font-medium">{asset.voltage} kV</p>
                      </div>
                    )}
                    {asset.capacity && (
                      <div>
                        <p className="text-blue-600 dark:text-slate-400">Capacity</p>
                        <p className="text-slate-900 dark:text-white font-medium">{asset.capacity} MW</p>
                      </div>
                    )}
                  </div>
                )}
                {/* Admin Edit Asset Form */}
                {userRole === "admin" && editAssetId === asset.id && editAsset && (
                  <div className="p-2 mt-2 bg-slate-50 dark:bg-slate-900 rounded">
                    <div className="flex flex-wrap gap-2">
                      <input className="border p-1 rounded" placeholder="Name" value={editAsset.name} onChange={e => setEditAsset({ ...editAsset, name: e.target.value })} />
                      <input className="border p-1 rounded" placeholder="Type" value={editAsset.type} onChange={e => setEditAsset({ ...editAsset, type: e.target.value })} />
                      <input className="border p-1 rounded" placeholder="Status" value={editAsset.status} onChange={e => setEditAsset({ ...editAsset, status: e.target.value })} />
                      <input className="border p-1 rounded" placeholder="Address" value={editAsset.address} onChange={e => setEditAsset({ ...editAsset, address: e.target.value })} />
                      <input className="border p-1 rounded" type="number" placeholder="Latitude" value={editAsset.latitude} onChange={e => setEditAsset({ ...editAsset, latitude: parseFloat(e.target.value) })} />
                      <input className="border p-1 rounded" type="number" placeholder="Longitude" value={editAsset.longitude} onChange={e => setEditAsset({ ...editAsset, longitude: parseFloat(e.target.value) })} />
                      <input className="border p-1 rounded" type="number" placeholder="Voltage" value={editAsset.voltage} onChange={e => setEditAsset({ ...editAsset, voltage: parseInt(e.target.value) })} />
                      <input className="border p-1 rounded" type="number" placeholder="Load" value={editAsset.load} onChange={e => setEditAsset({ ...editAsset, load: parseFloat(e.target.value) })} />
                      <input className="border p-1 rounded" type="number" placeholder="Capacity" value={editAsset.capacity} onChange={e => setEditAsset({ ...editAsset, capacity: parseInt(e.target.value) })} />
                      <Button size="sm" onClick={() => { onUpdateAsset && onUpdateAsset(asset.id, editAsset); setEditAssetId(null); setEditAsset(null); }}>Save</Button>
                      <Button size="sm" variant="outline" onClick={() => { setEditAssetId(null); setEditAsset(null); }}>Cancel</Button>
=======
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
>>>>>>> 84061cf73c66a09a4f9d9542250c164b87a3ac9d
                    </div>
                  </div>
                )}
              </div>
<<<<<<< HEAD
            );
=======
            )
>>>>>>> 84061cf73c66a09a4f9d9542250c164b87a3ac9d
          })}
        </div>
      </CardContent>
    </Card>
<<<<<<< HEAD
  );
=======
  )
>>>>>>> 84061cf73c66a09a4f9d9542250c164b87a3ac9d
}