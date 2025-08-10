"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export function SettingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">System Settings</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">General Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="system-name" className="text-slate-300">
                System Name
              </Label>
              <Input
                id="system-name"
                defaultValue="Ethiopian Grid Monitor"
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="refresh-interval" className="text-slate-300">
                Data Refresh Interval (seconds)
              </Label>
              <Input
                id="refresh-interval"
                type="number"
                defaultValue="30"
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="auto-alerts" className="text-slate-300">
                Enable Auto Alerts
              </Label>
              <Switch id="auto-alerts" defaultChecked />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Alert Thresholds</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="critical-load" className="text-slate-300">
                Critical Load Threshold (%)
              </Label>
              <Input
                id="critical-load"
                type="number"
                defaultValue="95"
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="warning-load" className="text-slate-300">
                Warning Load Threshold (%)
              </Label>
              <Input
                id="warning-load"
                type="number"
                defaultValue="80"
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="email-notifications" className="text-slate-300">
                Email Notifications
              </Label>
              <Switch id="email-notifications" defaultChecked />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Data Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <Button>Export Data</Button>
            <Button variant="outline">Import Data</Button>
            <Button variant="outline">Backup System</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
