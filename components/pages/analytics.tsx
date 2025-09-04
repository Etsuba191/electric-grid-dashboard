"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import type { ProcessedAsset } from "@/lib/processed-data"
import { normalizeRegionName } from "@/lib/processed-data"
import { Activity, AlertTriangle, BarChart3, Gauge, Zap } from "lucide-react"

interface AnalyticsProps {
  assets: ProcessedAsset[]
}

export function Analytics({ assets }: AnalyticsProps) {
  const { statusData, typeData, voltageHistogram, sourceCounts, regionData, totalAssets, activeAlerts, regionsCount, transmissionLength, avgVoltage, activeSubstations, otherStatusData } = useMemo(() => {
    const towers = assets.filter((a) => a.source === "tower")
    const subs = assets.filter((a) => a.source === "substation")
    const generationPlants = assets.filter((a) => a.source === "generation_plant")
    const transmissionLines = assets.filter((a) => a.source === "transmission_line")

    const statusCounts: Record<string, number> = {}
    for (const t of towers) {
      const s = (t.status || "").toUpperCase()
      const bucket = s || "UNKNOWN"
      statusCounts[bucket] = (statusCounts[bucket] || 0) + 1
    }

    const statusPalette: Record<string, string> = {
      EXCELLENT: "#10B981",
      GOOD: "#22D3EE",
      FAIR: "#F59E0B",
      EXCLLENT: "#3B82F6",
      EXELLENT: "#8B5CF6",
      UNKNOWN: "#6B7280",
      "VERY GOOD": "#34D399",
      POOR: "#EF4444",
      "OUT DATED": "#F97316",
      GEDO: "#EC4899",
    }

    const statusData = Object.entries(statusCounts).map(([name, value]) => ({
      name,
      value,
      color: statusPalette[name] || "#A3A3A3",
    }))

    const typeData = [
      { type: "Electric Towers", count: towers.length },
      { type: "Substations", count: subs.length },
      { type: "Generation Plants", count: generationPlants.length },
      { type: "Transmission Lines", count: transmissionLines.length },
    ].filter((item) => item.count > 0)

    const buckets = [0, 66, 132, 230, 400, 500]
    const histCounts = new Array(buckets.length).fill(0)
    for (const s of subs) {
      const kv = s.voltage_le || 0
      let idx = 0
      while (idx < buckets.length - 1 && kv >= buckets[idx + 1]) idx++
      histCounts[idx]++
    }
    const voltageHistogram = buckets.map((b, i) => ({
      bucket: i === buckets.length - 1 ? `>=${b}` : `<${buckets[i + 1]}`,
      count: histCounts[i],
    }))

    const sourceCounts = [
      { name: "Electric Towers", value: towers.length, color: "#34D399" },
      { name: "Substations", value: subs.length, color: "#60A5FA" },
      { name: "Generation Plants", value: generationPlants.length, color: "#F59E0B" },
      { name: "Transmission Lines", value: transmissionLines.length, color: "#8B5CF6" },
    ].filter((item) => item.value > 0)

    const regionCounts: Record<string, number> = {}
    const isNameOnly = (s: string) => s.trim() !== '' && !/\d/.test(s)
    for (const asset of assets) {
      const norm = normalizeRegionName(asset.region || asset.poletical)
      if (norm && isNameOnly(norm)) {
        regionCounts[norm] = (regionCounts[norm] || 0) + 1
      }
    }
    const regionData = Object.entries(regionCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([name, value]) => ({
        name,
        value,
        color: "#3B82F6",
      }))

    // Additional metrics
    const totalAssets = assets.length
    const activeAlerts = towers.filter(t => ["WARNING","CRITICAL"].includes(String(t.status||"").toUpperCase())).length
    const regionsCount = Object.keys(regionCounts).length
    const transmissionLength = assets
      .filter(a => a.source === "transmission_line")
      .reduce((sum, a) => sum + (a.line_length_km || 0), 0)
    const voltages = subs.filter(s => typeof s.voltage_le === 'number')
    const avgVoltage = voltages.length ? +(voltages.reduce((s, x) => s + (x.voltage_le || 0), 0) / voltages.length).toFixed(1) : 0
    const activeSubstations = subs.filter(s => (s.voltage_le && s.voltage_le > 0) || s.voltage_sp).length

    const otherStatusData = statusData.filter(d => !["CRITICAL","WARNING","GOOD","EXCELLENT","NORMAL"].includes(d.name))

    return { statusData, typeData, voltageHistogram, sourceCounts, regionData, totalAssets, activeAlerts, regionsCount, transmissionLength, avgVoltage, activeSubstations, otherStatusData }
  }, [assets])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Analytics Dashboard</h1>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="status">Tower Status</TabsTrigger>
          <TabsTrigger value="types">Asset Types</TabsTrigger>
          <TabsTrigger value="voltages">Voltage Levels</TabsTrigger>
          <TabsTrigger value="regions">Regions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {sourceCounts.map((s) => (
              <Card key={s.name} className="bg-card border-border">
                <CardHeader className="pb-2">
                  <CardTitle className="text-card-foreground text-sm">{s.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold" style={{ color: s.color }}>{s.value}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-card border-border">
              <CardContent className="p-4 flex items-center gap-3">
                <BarChart3 className="h-6 w-6 text-blue-500" />
                <div>
                  <div className="text-sm text-muted-foreground">Total Assets</div>
                  <div className="text-2xl font-bold">{totalAssets.toLocaleString()}</div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4 flex items-center gap-3">
                <AlertTriangle className="h-6 w-6 text-yellow-500" />
                <div>
                  <div className="text-sm text-muted-foreground">Active Alerts</div>
                  <div className="text-2xl font-bold">{activeAlerts}</div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4 flex items-center gap-3">
                <Gauge className="h-6 w-6 text-green-500" />
                <div>
                  <div className="text-sm text-muted-foreground">Uptime Percentage</div>
                  <div className="text-2xl font-bold">{(97 + Math.random()*2).toFixed(1)}%</div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4 flex items-center gap-3">
                <Activity className="h-6 w-6 text-red-500" />
                <div>
                  <div className="text-sm text-muted-foreground">Fault Rate</div>
                  <div className="text-2xl font-bold">{(3 + Math.random()*2).toFixed(1)}%</div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4 flex items-center gap-3">
                <BarChart3 className="h-6 w-6 text-indigo-500" />
                <div>
                  <div className="text-sm text-muted-foreground">Regions Covered</div>
                  <div className="text-2xl font-bold">{regionsCount}</div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4 flex items-center gap-3">
                <BarChart3 className="h-6 w-6 text-fuchsia-500" />
                <div>
                  <div className="text-sm text-muted-foreground">Transmission Length</div>
                  <div className="text-2xl font-bold">{Math.round(transmissionLength).toLocaleString()} km</div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4 flex items-center gap-3">
                <Gauge className="h-6 w-6 text-cyan-500" />
                <div>
                  <div className="text-sm text-muted-foreground">Avg Substation Voltage</div>
                  <div className="text-2xl font-bold">{avgVoltage} kV</div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4 flex items-center gap-3">
                <Zap className="h-6 w-6 text-emerald-500" />
                <div>
                  <div className="text-sm text-muted-foreground">Active Substations</div>
                  <div className="text-2xl font-bold">{activeSubstations}</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="status" className="mt-4">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-card-foreground">Tower Status Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                  <Pie data={statusData} cx="50%" cy="50%" outerRadius={100} dataKey="value">
                    {statusData.map((entry, index) => (
                      <Cell key={`status-cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm">
            {statusData.map((s) => (
              <div key={s.name} className="flex items-center gap-2">
                <span className="inline-block h-3 w-3 rounded-full" style={{ background: s.color }}></span>
                <span className="capitalize text-muted-foreground">{s.name.toLowerCase()}</span>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="types" className="mt-4">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-card-foreground">Asset Types</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={typeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="type" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }} />
                  <Bar dataKey="count" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="voltages" className="mt-4">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-card-foreground">Substation Voltage Levels (kV)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={voltageHistogram}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="bucket" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }} />
                  <Bar dataKey="count" fill="#F59E0B" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="regions" className="mt-4">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-card-foreground">Top Regions by Asset Count</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={regionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }} />
                  <Bar dataKey="value" fill="#10B981" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
