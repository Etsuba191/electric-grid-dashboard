"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { Progress } from "@/components/ui/progress"

interface ChartsSectionProps {
  filters: any
  selectedDate: Date
  userRole: "admin" | "user"
}



export function ChartsSection({ filters, selectedDate, userRole }: ChartsSectionProps) {
  const [voltageData, setVoltageData] = useState([])
  const [assetData, setAssetData] = useState([])
  const [statusData, setStatusData] = useState([])
  const [performanceData, setPerformanceData] = useState([])

  useEffect(() => {
    // Mock data generation
    const generateVoltageData = () => {
      const data = []
      for (let i = 0; i < 24; i++) {
        data.push({
          time: `${i}:00`,
          voltage: 220 + Math.random() * 20,
          current: 15 + Math.random() * 10,
          power: 3300 + Math.random() * 500,
        })
      }
      return data
    }

    const generateAssetData = () => [
      { name: "Substations", count: 89, capacity: 2500 },
      { name: "Transformers", count: 234, capacity: 1800 },
      { name: "Transmission Lines", count: 156, capacity: 3200 },
      { name: "Smart Meters", count: 1247, capacity: 500 },
      { name: "Generators", count: 45, capacity: 4500 },
    ]

    const generateStatusData = () => [
      { name: "Normal", value: 75, color: "#10B981" },
      { name: "Warning", value: 15, color: "#F59E0B" },
      { name: "Critical", value: 5, color: "#EF4444" },
      { name: "Maintenance", value: 5, color: "#3B82F6" },
    ]

    const generatePerformanceData = () => [
      { metric: "Grid Stability", value: 94 },
      { metric: "Load Balance", value: 87 },
      { metric: "Efficiency", value: 92 },
      { metric: "Reliability", value: 96 },
    ]

    setVoltageData(generateVoltageData())
    setAssetData(generateAssetData())
    setStatusData(generateStatusData())
    setPerformanceData(generatePerformanceData())
  }, [filters, selectedDate])

  return (
    <div className="space-y-6">
      {/* Voltage Trends */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-card-foreground flex items-center space-x-2">
            <span>Real-time Grid Parameters</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="voltage" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-muted">
              <TabsTrigger value="voltage">Voltage</TabsTrigger>
              <TabsTrigger value="current">Current</TabsTrigger>
              <TabsTrigger value="power">Power</TabsTrigger>
            </TabsList>
            <TabsContent value="voltage" className="mt-4">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={voltageData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="time" stroke="#9CA3AF" />
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
                    dataKey="voltage"
                    stroke="#3B82F6"
                    strokeWidth={2}
                    dot={{ fill: "#3B82F6", strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </TabsContent>
            <TabsContent value="current" className="mt-4">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={voltageData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="time" stroke="#9CA3AF" />
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
                    dataKey="current"
                    stroke="#10B981"
                    strokeWidth={2}
                    dot={{ fill: "#10B981", strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </TabsContent>
            <TabsContent value="power" className="mt-4">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={voltageData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="time" stroke="#9CA3AF" />
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
                    dataKey="power"
                    stroke="#F59E0B"
                    strokeWidth={2}
                    dot={{ fill: "#F59E0B", strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Asset Distribution */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-card-foreground">Asset Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={assetData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" />
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

        {/* System Status */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-card-foreground">System Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center space-y-4">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      color: "hsl(var(--card-foreground))"
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>

              {/* Legend */}
              <div className="grid grid-cols-2 gap-3 w-full">
                {statusData.map((entry, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: entry.color }}
                    ></div>
                    <span className="text-sm text-card-foreground font-medium">
                      {entry.name}
                    </span>
                    <span className="text-sm text-muted-foreground ml-auto">
                      {entry.value}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-card-foreground">Performance Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {performanceData.map((metric, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{metric.metric}</span>
                  <span className="text-card-foreground font-medium">{metric.value}%</span>
                </div>
                <Progress value={metric.value} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
