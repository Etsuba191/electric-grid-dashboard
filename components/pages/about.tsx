"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Zap, MapPin, Users, BarChart3, Radio, Building2 } from "lucide-react"
import type { ProcessedAsset } from "@/lib/processed-data"

interface AboutPageProps {
  assets?: ProcessedAsset[]
}

export function AboutPage({ assets = [] }: AboutPageProps) {
  // Calculate real statistics from the assets
  const totalAssets = assets.length
  const towers = assets.filter(asset => asset.source === 'tower').length
  const substations = assets.filter(asset => asset.source === 'substation').length
  const uniqueRegions = new Set(assets.map(asset => asset.poletical).filter(Boolean)).size
  const uniqueZones = new Set(assets.map(asset => asset.zone).filter(Boolean)).size
  const uniqueWoredas = new Set(assets.map(asset => asset.woreda).filter(Boolean)).size

  // Status distribution
  const statusCounts = assets.reduce((acc, asset) => {
    const status = (asset.status || 'unknown').toLowerCase()
    acc[status] = (acc[status] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const excellentCount = statusCounts.excellent || 0
  const goodCount = statusCounts.good || 0
  const warningCount = statusCounts.warning || 0
  const criticalCount = statusCounts.critical || statusCounts.poor || 0
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-foreground">About Ethiopian Grid Monitor</h1>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-card-foreground flex items-center space-x-2">
            <Zap className="h-6 w-6 text-blue-400" />
            <span>System Overview</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            The Ethiopian Grid Monitor is a comprehensive power grid monitoring and management system designed
            specifically for Ethiopia's electrical infrastructure. It provides real-time monitoring, analytics, and
            management capabilities for the entire national grid.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">{totalAssets.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Total Assets</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">{uniqueRegions}</div>
              <div className="text-sm text-muted-foreground">Regions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">{uniqueZones}</div>
              <div className="text-sm text-muted-foreground">Zones</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">{uniqueWoredas}</div>
              <div className="text-sm text-muted-foreground">Woredas</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Asset Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-card-foreground flex items-center space-x-2">
              <Radio className="h-5 w-5 text-blue-400" />
              <span>Asset Distribution</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Electric Towers:</span>
              <Badge variant="outline" className="text-blue-400 border-blue-400">
                {towers.toLocaleString()}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Substations:</span>
              <Badge variant="outline" className="text-green-400 border-green-400">
                {substations.toLocaleString()}
              </Badge>
            </div>
            <div className="pt-2 border-t border-border">
              <div className="text-sm text-muted-foreground">Coverage:</div>
              <div className="text-xs text-muted-foreground mt-1">
                Spanning {uniqueRegions} regions, {uniqueZones} zones, and {uniqueWoredas} woredas across Ethiopia
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-card-foreground flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-green-400" />
              <span>System Health</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Excellent:</span>
              <Badge className="bg-green-500/20 text-green-400 border-green-400">
                {excellentCount.toLocaleString()}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Good:</span>
              <Badge className="bg-blue-500/20 text-blue-400 border-blue-400">
                {goodCount.toLocaleString()}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Warning:</span>
              <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-400">
                {warningCount.toLocaleString()}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Critical:</span>
              <Badge className="bg-red-500/20 text-red-400 border-red-400">
                {criticalCount.toLocaleString()}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-card-foreground">Features</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-center space-x-2">
                <BarChart3 className="h-4 w-4 text-blue-400" />
                <span>Real-time grid monitoring</span>
              </li>
              <li className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-green-400" />
                <span>Geographic asset mapping</span>
              </li>
              <li className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-yellow-400" />
                <span>Multi-user role management</span>
              </li>
              <li className="flex items-center space-x-2">
                <Zap className="h-4 w-4 text-purple-400" />
                <span>Automated alert system</span>
              </li>
              <li className="flex items-center space-x-2">
                <Building2 className="h-4 w-4 text-orange-400" />
                <span>GeoJSON data integration</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-card-foreground">System Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Version:</span>
              <Badge variant="outline">v2.1.0</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Last Updated:</span>
              <span className="text-card-foreground">{new Date().toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Data Source:</span>
              <span className="text-card-foreground">Ethiopian Electric Power</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">License:</span>
              <span className="text-card-foreground">Government Use</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Support:</span>
              <span className="text-card-foreground">24/7 Technical Support</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
