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
      { name: "Normal", value: 78, color: "#10B981" },
      { name: "Warning", value: 15, color: "#F59E0B" },
      { name: "Critical", value: 5, color: "#EF4444" },
      { name: "Maintenance", value: 2, color: "#6B7280" },
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
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <span>Real-time Grid Parameters</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="voltage" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-slate-700">
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
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Asset Distribution</CardTitle>
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
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">System Status</CardTitle>
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
      </div>

      {/* Performance Metrics */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Performance Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {performanceData.map((metric, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-300">{metric.metric}</span>
                  <span className="text-white font-medium">{metric.value}%</span>
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
