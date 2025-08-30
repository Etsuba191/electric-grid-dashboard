"use client"

import { useState, useEffect } from "react"
import { gridApi, type GridAsset, type GridStatistics } from "@/lib/api"

export function useGridData(filters: any) {
  const [assets, setAssets] = useState<GridAsset[]>([])
  const [statistics, setStatistics] = useState<GridStatistics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        const [assetsData, statsData] = await Promise.all([gridApi.getAssets(filters), gridApi.getStatistics()])

        setAssets(assetsData.assets)
        setStatistics(statsData.statistics)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch data")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [filters])

  return { assets, statistics, loading, error }
}

export function useRealTimeData() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRealTimeData = async () => {
      try {
        const response = await gridApi.getRealTimeData()
        setData(response.realTimeData)
      } catch (error) {
        console.error("Failed to fetch real-time data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchRealTimeData()

    // Set up real-time updates every 30 seconds
    const interval = setInterval(fetchRealTimeData, 30000)

    return () => clearInterval(interval)
  }, [])

  return { data, loading }
}
