"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Zap, MapPin, Users, BarChart3 } from "lucide-react"

export function AboutPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">About Ethiopian Grid Monitor</h1>

      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <Zap className="h-6 w-6 text-blue-400" />
            <span>System Overview</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-slate-300">
            The Ethiopian Grid Monitor is a comprehensive power grid monitoring and management system designed
            specifically for Ethiopia's electrical infrastructure. It provides real-time monitoring, analytics, and
            management capabilities for the entire national grid.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">45,000+</div>
              <div className="text-sm text-slate-400">Grid Assets</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">12</div>
              <div className="text-sm text-slate-400">Regions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">24/7</div>
              <div className="text-sm text-slate-400">Monitoring</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">Real-time</div>
              <div className="text-sm text-slate-400">Analytics</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Features</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-slate-300">
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
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">System Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-slate-400">Version:</span>
              <Badge variant="outline">v2.1.0</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Last Updated:</span>
              <span className="text-white">January 2024</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">License:</span>
              <span className="text-white">Government Use</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Support:</span>
              <span className="text-white">24/7 Technical Support</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
