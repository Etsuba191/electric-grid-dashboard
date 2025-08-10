"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Search, Filter, X, MapPin, Zap, AlertTriangle } from "lucide-react"

interface SearchFiltersProps {
  filters: {
    location: string
    assetType: string
    alertSeverity: string
    searchQuery: string
  }
  onFiltersChange: (filters: any) => void
  userRole: "admin" | "user"
}

export function SearchFilters({ filters, onFiltersChange, userRole }: SearchFiltersProps) {
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

  const locations = [
    "New York",
    "Los Angeles",
    "Chicago",
    "Houston",
    "Phoenix",
    "Philadelphia",
    "San Antonio",
    "San Diego",
    "Dallas",
    "San Jose",
  ]

  const assetTypes = ["Substation", "Transformer", "Transmission Line", "Smart Meter", "Generator"]

  const alertSeverities = ["Low", "Medium", "High", "Critical"]

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
      {/* Search Bar */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input
          placeholder="Search assets, locations, or alerts..."
          value={filters.searchQuery}
          onChange={(e) => updateFilter("searchQuery", e.target.value)}
          className="pl-10 bg-slate-800/50 border-slate-700 text-white placeholder-slate-400"
        />
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-2">
        <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="bg-slate-800/50 border-slate-700 text-white">
              <Filter className="h-4 w-4 mr-2" />
              Filters
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 flex items-center justify-center">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 bg-slate-800 border-slate-700" align="end">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-white">Filters</h4>
                {activeFiltersCount > 0 && (
                  <Button variant="ghost" size="sm" onClick={clearFilters} className="text-slate-400 hover:text-white">
                    Clear all
                  </Button>
                )}
              </div>

              {/* Location Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Location</label>
                <Select value={filters.location} onValueChange={(value) => updateFilter("location", value)}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    {locations.map((location) => (
                      <SelectItem key={location} value={location.toLowerCase()}>
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
                <label className="text-sm font-medium text-slate-300">Asset Type</label>
                <Select value={filters.assetType} onValueChange={(value) => updateFilter("assetType", value)}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue placeholder="Select asset type" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    {assetTypes.map((type) => (
                      <SelectItem key={type} value={type.toLowerCase()}>
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
                <label className="text-sm font-medium text-slate-300">Alert Severity</label>
                <Select value={filters.alertSeverity} onValueChange={(value) => updateFilter("alertSeverity", value)}>
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue placeholder="Select severity" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    {alertSeverities.map((severity) => (
                      <SelectItem key={severity} value={severity.toLowerCase()}>
                        <div className="flex items-center space-x-2">
                          <AlertTriangle className="h-4 w-4" />
                          <span>{severity}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Active Filters Display */}
        {activeFiltersCount > 0 && (
          <div className="flex items-center space-x-2">
            {filters.location && (
              <Badge variant="secondary" className="bg-slate-700 text-white">
                {filters.location}
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-1 h-4 w-4 p-0 hover:bg-slate-600"
                  onClick={() => updateFilter("location", "")}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}
            {filters.assetType && (
              <Badge variant="secondary" className="bg-slate-700 text-white">
                {filters.assetType}
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-1 h-4 w-4 p-0 hover:bg-slate-600"
                  onClick={() => updateFilter("assetType", "")}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}
            {filters.alertSeverity && (
              <Badge variant="secondary" className="bg-slate-700 text-white">
                {filters.alertSeverity}
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-1 h-4 w-4 p-0 hover:bg-slate-600"
                  onClick={() => updateFilter("alertSeverity", "")}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
