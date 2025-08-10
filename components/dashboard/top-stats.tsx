"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Zap, Activity, AlertTriangle, TrendingUp, Building2, Gauge } from "lucide-react"

interface TopStatsProps {
  filters: {
    location: string
    assetType: string
    alertSeverity: string
    searchQuery: string
  }
}

export function TopStats({ filters }: TopStatsProps) {
  const [stats, setStats] = useState({
    totalAssets: 0,
    activeSubstations: 0,
    faultAlerts: 0,
    systemLoad: 0,
    efficiency: 0,
    powerGenerated: 0,
  })

  useEffect(() => {
    // Simulate API call with filters
    const fetchStats = async () => {
      // Mock data that changes based on filters
      const mockStats = {
        totalAssets: 1247 + Math.floor(Math.random() * 100),
        activeSubstations: 89 + Math.floor(Math.random() * 10),
        faultAlerts: 12 + Math.floor(Math.random() * 5),
        systemLoad: 78.5 + Math.random() * 10,
        efficiency: 94.2 + Math.random() * 5,
        powerGenerated: 2847.6 + Math.random() * 200,
      }
      setStats(mockStats)
    }

    fetchStats()
  }, [filters])

  const statCards = [
    {
      title: "Total Assets",
      value: stats.totalAssets.toLocaleString(),
      icon: Building2,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
      change: "+5.2%",
      changeType: "positive",
    },
    {
      title: "Active Substations",
      value: stats.activeSubstations.toString(),
      icon: Zap,
      color: "text-green-400",
      bgColor: "bg-green-500/10",
      change: "+2.1%",
      changeType: "positive",
    },
    {
      title: "Fault Alerts",
      value: stats.faultAlerts.toString(),
      icon: AlertTriangle,
      color: "text-red-400",
      bgColor: "bg-red-500/10",
      change: "-8.3%",
      changeType: "negative",
    },
    {
      title: "System Load",
      value: `${stats.systemLoad.toFixed(1)}%`,
      icon: Gauge,
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/10",
      change: "+1.5%",
      changeType: "positive",
    },
    {
      title: "Efficiency",
      value: `${stats.efficiency.toFixed(1)}%`,
      icon: Activity,
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
      change: "+0.8%",
      changeType: "positive",
    },
    {
      title: "Power Generated",
      value: `${stats.powerGenerated.toFixed(1)} MW`,
      icon: TrendingUp,
      color: "text-cyan-400",
      bgColor: "bg-cyan-500/10",
      change: "+12.4%",
      changeType: "positive",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {statCards.map((stat, index) => (
        <Card key={index} className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <Badge variant={stat.changeType === "positive" ? "default" : "destructive"} className="text-xs">
                {stat.change}
              </Badge>
            </div>
            <div className="mt-3">
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-sm text-slate-400">{stat.title}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
