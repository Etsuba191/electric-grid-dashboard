"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useRef } from "react"

interface SettingsPageProps {
  assets?: any[]
}

export function SettingsPage({ assets = [] }: SettingsPageProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleExportData = () => {
    if (assets.length === 0) {
      alert('No data available to export')
      return
    }

    // Create comprehensive export data
    const exportData = assets.map(asset => ({
      id: asset.id,
      name: asset.name || 'Unknown',
      type: asset.source || asset.type,
      latitude: asset.lat,
      longitude: asset.lng,
      status: asset.status || 'Unknown',
      site: asset.site || '',
      zone: asset.zone || '',
      woreda: asset.woreda || '',
      category: asset.category || '',
      political_region: asset.poletical || '',
      voltage_level: asset.voltage_le || '',
      voltage_specification: asset.voltage_sp || '',
      link_name: asset.name_link || ''
    }))

    const csvContent = [
      'ID,Name,Type,Latitude,Longitude,Status,Site,Zone,Woreda,Category,Political Region,Voltage Level,Voltage Specification,Link Name',
      ...exportData.map(item =>
        `"${item.id}","${item.name}","${item.type}","${item.latitude}","${item.longitude}","${item.status}","${item.site}","${item.zone}","${item.woreda}","${item.category}","${item.political_region}","${item.voltage_level}","${item.voltage_specification}","${item.link_name}"`
      )
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')

    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', `grid_data_export_${new Date().toISOString().split('T')[0]}.csv`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const handleImportData = () => {
    fileInputRef.current?.click()
  }

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      alert('Please select a CSV file')
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const csvContent = e.target?.result as string
        const lines = csvContent.split('\n')
        const headers = lines[0].split(',')
        const dataLines = lines.slice(1).filter(line => line.trim())

        console.log(`Imported ${dataLines.length} records from ${file.name}`)
        alert(`Successfully imported ${dataLines.length} records from ${file.name}`)

        // Reset the input
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
      } catch (error) {
        console.error('Error importing file:', error)
        alert('Error importing file. Please check the file format.')
      }
    }
    reader.readAsText(file)
  }

  const handleBackupSystem = () => {
    // Create a comprehensive backup
    const backupData = {
      timestamp: new Date().toISOString(),
      version: '2.1.0',
      assets: assets,
      settings: {
        systemName: 'Ethiopian Grid Monitor',
        refreshInterval: 30,
        autoAlerts: true,
        criticalLoadThreshold: 95,
        warningLoadThreshold: 80,
        emailNotifications: true
      },
      metadata: {
        totalAssets: assets.length,
        towers: assets.filter(a => a.source === 'tower').length,
        substations: assets.filter(a => a.source === 'substation').length,
        regions: new Set(assets.map(a => a.poletical).filter(Boolean)).size
      }
    }

    const jsonContent = JSON.stringify(backupData, null, 2)
    const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' })
    const link = document.createElement('a')

    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', `grid_system_backup_${new Date().toISOString().split('T')[0]}.json`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      alert('System backup created successfully!')
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-foreground">System Settings</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-card-foreground">General Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="system-name" className="text-muted-foreground">
                System Name
              </Label>
              <Input
                id="system-name"
                defaultValue="Ethiopian Grid Monitor"
                className="bg-background border-border text-foreground"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="refresh-interval" className="text-muted-foreground">
                Data Refresh Interval (seconds)
              </Label>
              <Input
                id="refresh-interval"
                type="number"
                defaultValue="30"
                className="bg-background border-border text-foreground"
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="auto-alerts" className="text-muted-foreground">
                Enable Auto Alerts
              </Label>
              <Switch id="auto-alerts" defaultChecked />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-card-foreground">Alert Thresholds</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="critical-load" className="text-muted-foreground">
                Critical Load Threshold (%)
              </Label>
              <Input
                id="critical-load"
                type="number"
                defaultValue="95"
                className="bg-background border-border text-foreground"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="warning-load" className="text-muted-foreground">
                Warning Load Threshold (%)
              </Label>
              <Input
                id="warning-load"
                type="number"
                defaultValue="80"
                className="bg-background border-border text-foreground"
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="email-notifications" className="text-muted-foreground">
                Email Notifications
              </Label>
              <Switch id="email-notifications" defaultChecked />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-card-foreground">Data Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <Button onClick={handleExportData} className="bg-blue-600 hover:bg-blue-700 text-white">Export Data</Button>
            <Button onClick={handleImportData} className="bg-blue-600 hover:bg-blue-700 text-white">Import Data</Button>
            <Button onClick={handleBackupSystem} className="bg-blue-600 hover:bg-blue-700 text-white">Backup System</Button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileImport}
            style={{ display: 'none' }}
          />
        </CardContent>
      </Card>
    </div>
  )
}
