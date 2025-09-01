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
    for (const asset of assets) {
      if (asset.poletical && asset.poletical.trim() !== "") {
        regionCounts[asset.poletical] = (regionCounts[asset.poletical] || 0) + 1
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

        {/* Tabs content (overview, status, types, voltages, regions) goes here */}
      </Tabs>
    </div>
  )
}
