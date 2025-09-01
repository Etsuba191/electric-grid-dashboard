"use client"

import { useMemo, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Search, Filter, X, MapPin, Zap, AlertTriangle } from "lucide-react"
import type { ProcessedAsset } from "@/lib/processed-data"

interface SearchFiltersProps {
  assets: ProcessedAsset[]
  filters: {
    location: string
    assetType: string
    alertSeverity: string
    searchQuery: string
  }
  onFiltersChange: (filters: any) => void
  userRole: "admin" | "user"
}

export function SearchFilters({ assets, filters, onFiltersChange, userRole }: SearchFiltersProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const updateFilter = (key: string, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    })
  }

  const clearFilters = () => {
    onFiltersChange({
      location: "",
      assetType: "",
      alertSeverity: "",
      searchQuery: "",
    })
  }

  const activeFiltersCount = Object.values(filters).filter((value) => value !== "").length

  // Build dynamic options from dataset
  const { regions, locations, assetTypes, alertSeverities } = useMemo(() => {
    const locSet = new Set<string>()
    const typeSet = new Set<string>()
    const sevSet = new Set<string>()

    // Predefined regions
    const regions = [
      "Addis Abeba",
      "Oromiya", 
      "Tigray",
      "Amhara",
      "South",
      "Somali",
      "Afar",
      "Dire Dawa",
      "Benishangul",
      "Gambela"
    ]

    // Loop through assets and collect type, location, and severity
    let hasLow = false
    let hasMedium = false
    let hasHigh = false
    let hasCritical = false

    for (const a of assets) {
      if (a.source) typeSet.add(a.source)

      // Locations
      if (a.source === "tower") {
        if (a.zone) locSet.add(a.zone)
        if (a.woreda) locSet.add(a.woreda)
        if (a.site) locSet.add(a.site)
      } else if (a.poletical) {
        locSet.add(a.poletical)
      }

      // Severities
      if (a.source === "tower") {
        const s = (a.status || "").toUpperCase()
        if (s === "WARNING") hasHigh = true
        if (s === "CRITICAL") hasCritical = true
        if (s && s !== "GOOD" && s !== "EXCELLENT" && s !== "WARNING" && s !== "CRITICAL") hasMedium = true
      } else {
        const missingVoltage = !(a.voltage_le && a.voltage_le > 0) && !a.voltage_sp
        if (missingVoltage) hasMedium = true
      }
    }

    if (hasLow) sevSet.add("low")
    if (hasMedium) sevSet.add("medium")
    if (hasHigh) sevSet.add("high")
    if (hasCritical) sevSet.add("critical")

    return {
      regions,
      locations: Array.from(locSet).sort((a, b) => a.localeCompare(b)),
      assetTypes: Array.from(typeSet),
      alertSeverities: Array.from(sevSet),
    }
  }, [assets])

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start justify-between">
      {/* Search Bar */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-500 dark:text-slate-400" />
        <Input
          placeholder="Search assets, locations, or alerts..."
          value={filters.searchQuery}
          onChange={(e) => updateFilter("searchQuery", e.target.value)}
          className="pl-10 bg-white dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="bg-white dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white">
              <Filter className="h-4 w-4 mr-2" />
              Filters
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 flex items-center justify-center">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700" align="end">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-slate-900 dark:text-white">Filters</h4>
                {activeFiltersCount > 0 && (
                  <Button variant="ghost" size="sm" onClick={clearFilters} className="text-blue-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
                    Clear all
                  </Button>
                )}
              </div>

              {/* Region Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Region</label>
                <Select value={filters.location} onValueChange={(value) => updateFilter("location", value)}>
                  <SelectTrigger className="bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white">
                    <SelectValue placeholder="Select region" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 max-h-64 overflow-auto">
                    {regions.map((region) => (
                      <SelectItem key={region} value={region}>
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4" />
                          <span>{region}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Location Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Location</label>
                <Select value={filters.location} onValueChange={(value) => updateFilter("location", value)}>
                  <SelectTrigger className="bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white">
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 max-h-64 overflow-auto">
                    {locations.map((location) => (
                      <SelectItem key={location} value={location}>
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4" />
                          <span>{location}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Asset Type Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Asset Type</label>
                <Select value={filters.assetType} onValueChange={(value) => updateFilter("assetType", value)}>
                  <SelectTrigger className="bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white">
                    <SelectValue placeholder="Select asset type" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600">
                    {assetTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        <div className="flex items-center space-x-2">
                          <Zap className="h-4 w-4" />
                          <span>{type}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Alert Severity Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Alert Severity</label>
                <Select value={filters.alertSeverity} onValueChange={(value) => updateFilter("alertSeverity", value)}>
                  <SelectTrigger className="bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white">
                    <SelectValue placeholder="Select severity" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600">
                    {(alertSeverities.length ? alertSeverities : ["low", "medium", "high", "critical"]).map((severity) => (
                      <SelectItem key={severity} value={severity}>
                        <div className="flex items-center space-x-2">
                          <AlertTriangle className="h-4 w-4" />
                          <span className="capitalize">{severity}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}
