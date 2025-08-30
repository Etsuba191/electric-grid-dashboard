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

interface AnalyticsProps {
  assets: ProcessedAsset[]
}

export function Analytics({ assets }: AnalyticsProps) {
  const { statusData, typeData, voltageHistogram, sourceCounts, regionData } = useMemo(() => {
    const towers = assets.filter((a) => a.source === "tower")
    const subs = assets.filter((a) => a.source === "substation")
    const generationPlants = assets.filter((a) => a.source === "generation_plant")
    const transmissionLines = assets.filter((a) => a.source === "transmission_line")

    // Towers: normalize status to GOOD/EXCELLENT/WARNING/CRITICAL/MAINTENANCE buckets
    const statusCounts: Record<string, number> = {}
    for (const t of towers) {
      const s = (t.status || "").toUpperCase()
      const bucket = s || "UNKNOWN"
      statusCounts[bucket] = (statusCounts[bucket] || 0) + 1
    }

    const statusPalette: Record<string, string> = {
      EXCELLENT: "#10B981",    // Green - Best status
      GOOD: "#22D3EE",         // Cyan - Good status
      FAIR: "#F59E0B",         // Orange - Fair status
      EXCLLENT: "#3B82F6",     // Blue - Misspelled excellent
      EXELLENT: "#8B5CF6",     // Purple - Another misspelled excellent
      UNKNOWN: "#6B7280",      // Gray - Unknown status
      "VERY GOOD": "#34D399",  // Light green - Very good status
      POOR: "#EF4444",         // Red - Poor status
      "OUT DATED": "#F97316",  // Dark orange - Outdated
      GEDO: "#EC4899",         // Pink - GEDO status
    }

    const statusData = Object.entries(statusCounts).map(([name, value]) => ({
      name,
      value,
      color: statusPalette[name] || "#A3A3A3",
    }))

    // Type data: counts all asset types
    const typeData = [
      { type: "Electric Towers", count: towers.length },
      { type: "Substations", count: subs.length },
      { type: "Generation Plants", count: generationPlants.length },
      { type: "Transmission Lines", count: transmissionLines.length },
    ].filter(item => item.count > 0) // Only show items with count > 0

    // Voltage histogram (substations VOLTAGE_LE)
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
    ].filter(item => item.value > 0) // Only show items with values > 0

    // Region data for all assets
    const regionCounts: Record<string, number> = {}
    for (const asset of assets) {
      if (asset.poletical && asset.poletical.trim() !== '') {
        regionCounts[asset.poletical] = (regionCounts[asset.poletical] || 0) + 1
      }
    }
    
    const regionData = Object.entries(regionCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([name, value]) => ({
        name,
        value,
        color: "#3B82F6"
      }))

    console.log('Analytics - Source counts for pie chart:', sourceCounts)
    console.log('Analytics - Generation plants found:', generationPlants.map(p => ({ name: p.name, type: p.plant_type, capacity: p.capacity_mw })))
    
    return { statusData, typeData, voltageHistogram, sourceCounts, regionData }
  }, [assets])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Analytics Dashboard</h1>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-slate-200 dark:bg-slate-700">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="status">Tower Status</TabsTrigger>
          <TabsTrigger value="types">Asset Types</TabsTrigger>
          <TabsTrigger value="voltages">Voltage Levels</TabsTrigger>
          <TabsTrigger value="regions">Regions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
              <CardHeader>
                <CardTitle className="text-slate-900 dark:text-white">Assets Split</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie data={sourceCounts} cx="50%" cy="50%" outerRadius={70} fill="#8884d8" dataKey="value" label={false}>
                        {sourceCounts.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  
                  {/* Color Legend */}
                  <div className="grid grid-cols-1 gap-2 text-sm">
                    {sourceCounts.map((entry, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div 
                          className="w-3 h-3 rounded-full flex-shrink-0" 
                          style={{ backgroundColor: entry.color }}
                        ></div>
                        <span className="text-slate-700 dark:text-slate-300">
                          {entry.name}: {entry.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
              <CardHeader>
                <CardTitle className="text-slate-900 dark:text-white">Asset Type Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={typeData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="type" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip contentStyle={{ backgroundColor: "#1F2937", border: "1px solid #374151", borderRadius: 8 }} />
                    <Bar dataKey="count" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="status" className="space-y-6">
          <Card className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
            <CardHeader>
              <CardTitle className="text-slate-900 dark:text-white">Tower Status Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie data={statusData} cx="50%" cy="50%" outerRadius={70} fill="#8884d8" dataKey="value" label={false}>
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                
                {/* Color Legend */}
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {statusData.map((entry, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded-full flex-shrink-0" 
                        style={{ backgroundColor: entry.color }}
                      ></div>
                      <span className="text-slate-700 dark:text-slate-300 truncate">
                        {entry.name}: {entry.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="types" className="space-y-6">
          <Card className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
            <CardHeader>
              <CardTitle className="text-slate-900 dark:text-white">Asset Type Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={typeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="type" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip contentStyle={{ backgroundColor: "#1F2937", border: "1px solid #374151", borderRadius: 8 }} />
                  <Bar dataKey="count" fill="#10B981" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="voltages" className="space-y-6">
          <Card className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
            <CardHeader>
              <CardTitle className="text-slate-900 dark:text-white">Substation Voltage Levels (kV)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={voltageHistogram}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="bucket" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip contentStyle={{ backgroundColor: "#1F2937", border: "1px solid #374151", borderRadius: 8 }} />
                  <Bar dataKey="count" fill="#F59E0B" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="regions" className="space-y-6">
          <Card className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
            <CardHeader>
              <CardTitle className="text-slate-900 dark:text-white">Asset Distribution by Region</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={regionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip contentStyle={{ backgroundColor: "#1F2937", border: "1px solid #374151", borderRadius: 8 }} />
                  <Bar dataKey="value" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}