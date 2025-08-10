"use client"

import { useState, useEffect } from "react"
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
import type { EthiopianGridAsset } from "@/lib/ethiopia-data"

interface AnalyticsProps {
  assets: EthiopianGridAsset[]
}

export function Analytics({ assets }: AnalyticsProps) {
  const [regionData, setRegionData] = useState<any[]>([])
  const [statusData, setStatusData] = useState<any[]>([])
  const [typeData, setTypeData] = useState<any[]>([])
  const [loadTrends, setLoadTrends] = useState<any[]>([])

  useEffect(() => {
    // Process region distribution
    const regionCounts = assets.reduce(
      (acc, asset) => {
        acc[asset.region] = (acc[asset.region] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    setRegionData(
      Object.entries(regionCounts).map(([region, count]) => ({
        region,
        count,
        percentage: ((count / assets.length) * 100).toFixed(1),
      })),
    )

    // Process status distribution
    const statusCounts = assets.reduce(
      (acc, asset) => {
        acc[asset.status] = (acc[asset.status] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    const statusColors = {
      normal: "#10B981",
      warning: "#F59E0B",
      critical: "#EF4444",
      maintenance: "#6B7280",
    }

    setStatusData(
      Object.entries(statusCounts).map(([status, count]) => ({
        name: status,
        value: count,
        color: statusColors[status as keyof typeof statusColors] || "#6B7280",
      })),
    )

    // Process type distribution
    const typeCounts = assets.reduce(
      (acc, asset) => {
        acc[asset.type] = (acc[asset.type] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    setTypeData(
      Object.entries(typeCounts).map(([type, count]) => ({
        type,
        count,
        avgLoad: assets.filter((a) => a.type === type).reduce((sum, a) => sum + a.load, 0) / count,
      })),
    )

    // Generate load trends (simulated hourly data)
    const trends = []
    for (let hour = 0; hour < 24; hour++) {
      const avgLoad = assets.reduce((sum, asset) => sum + asset.load, 0) / assets.length
      trends.push({
        hour: `${hour}:00`,
        load: avgLoad + Math.sin((hour / 24) * Math.PI * 2) * 15 + (Math.random() - 0.5) * 10,
      })
    }
    setLoadTrends(trends)
  }, [assets])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Analytics Dashboard</h1>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-slate-700">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="regions">Regions</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">System Status Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Asset Type Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={typeData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="type" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1F2937",
                        border: "1px solid #374151",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar dataKey="count" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="regions" className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Assets by Region</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={regionData} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis type="number" stroke="#9CA3AF" />
                  <YAxis dataKey="region" type="category" stroke="#9CA3AF" width={100} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1F2937",
                      border: "1px solid #374151",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="count" fill="#10B981" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Average Load by Asset Type</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={typeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="type" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1F2937",
                      border: "1px solid #374151",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="avgLoad" fill="#F59E0B" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">24-Hour Load Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={loadTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="hour" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1F2937",
                      border: "1px solid #374151",
                      borderRadius: "8px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="load"
                    stroke="#3B82F6"
                    strokeWidth={2}
                    dot={{ fill: "#3B82F6", strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
