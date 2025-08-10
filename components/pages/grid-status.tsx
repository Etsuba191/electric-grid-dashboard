"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Zap, AlertTriangle, CheckCircle, Settings, Search } from "lucide-react"
import type { EthiopianGridAsset } from "@/lib/ethiopia-data"

interface GridStatusProps {
  assets: EthiopianGridAsset[]
}

export function GridStatus({ assets }: GridStatusProps) {
  const [filteredAssets, setFilteredAssets] = useState<EthiopianGridAsset[]>(assets)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [regionFilter, setRegionFilter] = useState("all")

  const regions = Array.from(new Set(assets.map((asset) => asset.region)))

  useEffect(() => {
    let filtered = assets

    if (searchQuery) {
      filtered = filtered.filter(
        (asset) =>
          asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          asset.region.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((asset) => asset.status === statusFilter)
    }

    if (regionFilter !== "all") {
      filtered = filtered.filter((asset) => asset.region === regionFilter)
    }

    setFilteredAssets(filtered)
  }, [assets, searchQuery, statusFilter, regionFilter])

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
        return Zap
    }
  }

  const getStatusColor = (status: string) => {
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Grid Status</h1>
        <Badge variant="outline" className="text-white">
          {filteredAssets.length} Assets
        </Badge>
      </div>

      {/* Filters */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search assets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48 bg-slate-700 border-slate-600 text-white">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
              </SelectContent>
            </Select>
            <Select value={regionFilter} onValueChange={setRegionFilter}>
              <SelectTrigger className="w-48 bg-slate-700 border-slate-600 text-white">
                <SelectValue placeholder="Filter by region" />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600">
                <SelectItem value="all">All Regions</SelectItem>
                {regions.map((region) => (
                  <SelectItem key={region} value={region}>
                    {region}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Assets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAssets.slice(0, 50).map((asset) => {
          const StatusIcon = getStatusIcon(asset.status)
          return (
            <Card key={asset.id} className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg text-white truncate">{asset.name}</CardTitle>
                  <Badge className={getStatusColor(asset.status)}>
                    <StatusIcon className="h-3 w-3 mr-1" />
                    {asset.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Region:</span>
                    <span className="text-white">{asset.region}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Type:</span>
                    <span className="text-white capitalize">{asset.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Load:</span>
                    <span className="text-white">{asset.load.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Voltage:</span>
                    <span className="text-white">{asset.voltage.toLocaleString()} V</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredAssets.length > 50 && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-4 text-center">
            <p className="text-slate-400">
              Showing 50 of {filteredAssets.length} assets. Use filters to narrow down results.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
