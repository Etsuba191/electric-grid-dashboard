"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { TopStats } from "@/components/dashboard/top-stats"
import { ChartsSection } from "@/components/dashboard/charts-section"
import { GridMap } from "@/components/dashboard/grid-map"
import { CustomMap } from "@/components/dashboard/custom-map"
import { CalendarWidget } from "@/components/dashboard/calendar-widget"
import { SearchFilters } from "@/components/dashboard/search-filters"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { loadEthiopianData, type EthiopianGridAsset } from "@/lib/ethiopia-data"
import { GridStatus } from "@/components/pages/grid-status"
import { Analytics } from "@/components/pages/analytics"
import { AlertsPage } from "@/components/pages/alerts"
import { UsersPage } from "@/components/pages/users"
import { SettingsPage } from "@/components/pages/settings"
import { AboutPage } from "@/components/pages/about"

export default function Dashboard() {
  const [userRole, setUserRole] = useState<"admin" | "user">("admin")
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [filters, setFilters] = useState({
    location: "",
    assetType: "",
    alertSeverity: "",
    searchQuery: "",
  })
  const [currentPage, setCurrentPage] = useState("dashboard")
  const [ethiopianAssets, setEthiopianAssets] = useState<EthiopianGridAsset[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const assets = await loadEthiopianData()
        setEthiopianAssets(assets)
        console.log(`Loaded ${assets.length} Ethiopian grid assets`)
      } catch (error) {
        console.error("Failed to load Ethiopian data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const renderCurrentPage = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-white text-xl">Loading Ethiopian Grid Data...</div>
        </div>
      )
    }

    switch (currentPage) {
      case "grid":
        return <GridStatus assets={ethiopianAssets} />
      case "analytics":
        return <Analytics assets={ethiopianAssets} />
      case "alerts":
        return <AlertsPage assets={ethiopianAssets} />
      case "users":
        return <UsersPage />
      case "settings":
        return <SettingsPage />
      case "about":
        return <AboutPage />
      case "map":
        return <CustomMap assets={ethiopianAssets} filters={filters} userRole={userRole} />
      case "dashboard":
      default:
        return (
          <div className="space-y-6">
            <SearchFilters filters={filters} onFiltersChange={setFilters} userRole={userRole} />
            <TopStats filters={filters} />
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-2 space-y-6">
                <ChartsSection filters={filters} selectedDate={selectedDate} userRole={userRole} />
              </div>
              <div className="space-y-6">
                <CalendarWidget selectedDate={selectedDate} onDateChange={setSelectedDate} />
                <GridMap filters={filters} userRole={userRole} />
              </div>
            </div>
          </div>
        )
    }
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <div className="flex h-screen bg-slate-950 text-white overflow-hidden">
        <Sidebar
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
          userRole={userRole}
          onRoleChange={setUserRole}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />

        <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-16"} overflow-auto`}>
          <div className="p-6">{renderCurrentPage()}</div>
        </main>

        <Toaster />
      </div>
    </ThemeProvider>
  )
}
