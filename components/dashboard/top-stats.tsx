"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Zap, Activity, AlertTriangle, TrendingUp, Building2, Gauge } from "lucide-react"
import type { ProcessedAsset } from "@/lib/processed-data"
import { computeMetrics } from "@/lib/processed-data"

interface TopStatsProps {
  assets: ProcessedAsset[]
  filters?: {
    location: string
    assetType: string
    alertSeverity: string
    searchQuery: string
  }
}

export function TopStats({ assets }: TopStatsProps) {
  const [stats, setStats] = useState({
    totalAssets: 0,
    activeSubstations: 0,
    faultAlerts: 0,
    systemLoad: 0,
    efficiency: 0,
    powerGeneratedMW: 0,
  })

  useEffect(() => {
    const m = computeMetrics(assets)
    setStats(m)
  }, [assets])

  const statCards = [
    {
      title: "Total Assets",
      value: stats.totalAssets.toLocaleString(),
      icon: Building2,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-100 dark:bg-blue-500/10",
      change: "+5.2%",
      changeType: "positive",
    },
    {
      title: "Active Substations",
      value: stats.activeSubstations.toString(),
      icon: Zap,
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-100 dark:bg-green-500/10",
      change: "+2.1%",
      changeType: "positive",
    },
    {
      title: "Fault Alerts",
      value: stats.faultAlerts.toString(),
      icon: AlertTriangle,
      color: "text-red-600 dark:text-red-400",
      bgColor: "bg-red-100 dark:bg-red-500/10",
      change: "-8.3%",
      changeType: "negative",
    },
    {
      title: "System Load",
      value: `${stats.systemLoad.toFixed(1)}%`,
      icon: Gauge,
      color: "text-yellow-600 dark:text-yellow-400",
      bgColor: "bg-yellow-100 dark:bg-yellow-500/10",
      change: "+1.5%",
      changeType: "positive",
    },
    {
      title: "Efficiency",
      value: `${stats.efficiency.toFixed(0)}%`,
      icon: Activity,
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-100 dark:bg-purple-500/10",
      change: "+0.8%",
      changeType: "positive",
    },
    {
      title: "Power Generated",
      value: `${stats.powerGeneratedMW.toLocaleString()} MW`,
      icon: TrendingUp,
      color: "text-cyan-600 dark:text-cyan-400",
      bgColor: "bg-cyan-100 dark:bg-cyan-500/10",
      change: "+12.4%",
      changeType: "positive",
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 md:gap-4">
      {statCards.map((stat, index) => (
        <Card key={index} className="bg-card border-border hover:bg-accent transition-colors">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </div>
            <div className="mt-3">
              <p className="text-2xl font-bold text-card-foreground">{stat.value}</p>
              <p className="text-sm text-blue-600 dark:text-blue-400">{stat.title}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}