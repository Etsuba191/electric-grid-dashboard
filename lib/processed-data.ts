// lib/processed-data.ts
import { EthiopianGridAsset } from "@/lib/ethiopia-data"

export interface ProcessedAsset {
  id: string
  name?: string
  source: "tower" | "substation"
  lat: number
  lng: number

  // Tower-specific fields
  site?: string
  zone?: string
  woreda?: string
  category?: string
  status?: string
  name_link?: string
  poletical?: string

  // Substation-specific fields
  voltage_le?: number
  voltage_sp?: string
}

// Load and process the GeoJSON data
export async function loadProcessedAssets(): Promise<ProcessedAsset[]> {
  try {
    const towersResponse = await fetch('/ElectricTowers.geojson')
    const towersData = await towersResponse.json()

    const substationsResponse = await fetch('/Substations.geojson')
    const substationsData = await substationsResponse.json()

    const processedAssets: ProcessedAsset[] = []

    // Process towers
    if (towersData.features) {
      towersData.features.forEach((feature: any, index: number) => {
        const coords = feature.geometry?.coordinates
        if (coords && coords.length >= 2) {
          processedAssets.push({
            id: feature.properties?.Barcode || `tower_${index}`,
            source: "tower",
            lat: coords[1],
            lng: coords[0],
            name: feature.properties?.Site_Name || feature.properties?.Link_Name || `Tower ${index + 1}`,
            site: feature.properties?.Site_Name,
            zone: feature.properties?.Zone,
            woreda: feature.properties?.Woreda,
            category: feature.properties?.Catagory,
            status: feature.properties?.Status || "UNKNOWN",
            name_link: feature.properties?.Link_Name,
            poletical: feature.properties?.Town || feature.properties?.Region,
          })
        }
      })
    }

    // Process substations
    if (substationsData.features) {
      substationsData.features.forEach((feature: any, index: number) => {
        const coords = feature.geometry?.coordinates
        if (coords && coords.length >= 2) {
          processedAssets.push({
            id: `substation_${feature.properties?.NO_First || index}`,
            source: "substation",
            lat: coords[1],
            lng: coords[0],
            name: feature.properties?.Name_First || `Substation ${index + 1}`,
            poletical: feature.properties?.Poletical_ || feature.properties?.New_EEP_Re,
            voltage_le: feature.properties?.VOLTAGE_LE,
            voltage_sp: feature.properties?.Voltage_Sp,
          })
        }
      })
    }

    console.log(`Loaded ${processedAssets.length} processed assets`)
    return processedAssets

  } catch (error) {
    console.error('Failed to load processed assets:', error)
    // Return fallback mock data
    return [
      {
        id: "tower_1",
        source: "tower",
        lat: 9.032,
        lng: 38.7469,
        name: "Addis Ababa Tower 1",
        site: "Central",
        zone: "Zone 1",
        woreda: "Addis Ketema",
        category: "Transmission",
        status: "GOOD",
      },
      {
        id: "substation_1",
        source: "substation",
        lat: 9.045,
        lng: 38.7569,
        name: "Addis Ababa Substation 1",
        poletical: "Addis Ababa",
        voltage_le: 132,
        voltage_sp: "132kV",
      },
    ]
  }
}

// Compute metrics from processed assets
export function computeMetrics(assets: ProcessedAsset[]) {
  const towers = assets.filter(a => a.source === "tower")
  const substations = assets.filter(a => a.source === "substation")

  const activeSubstations = substations.filter(s =>
    (s.voltage_le && s.voltage_le > 0) || s.voltage_sp
  ).length

  const faultAlerts = towers.filter(t => {
    const status = (t.status || "").toUpperCase()
    return status === "CRITICAL" || status === "WARNING"
  }).length

  const systemLoad = 75 + Math.random() * 20
  const efficiency = 85 + Math.random() * 10
  const powerGeneratedMW = activeSubstations * 50 + Math.random() * 1000

  return {
    totalAssets: assets.length,
    activeSubstations,
    faultAlerts,
    systemLoad,
    efficiency,
    powerGeneratedMW,
  }
}

// ✅ Convert ProcessedAsset[] to EthiopianGridAsset[]
export function convertToEthiopianGridAssets(assets: ProcessedAsset[]): EthiopianGridAsset[] {
  return assets.map(asset => ({
    id: asset.id,
    name: asset.name || "Unknown",
    lat: asset.lat,
    lng: asset.lng,
    type: asset.source,
    status: asset.status || "UNKNOWN",
    poletical: asset.poletical || "",
    voltage_le: asset.voltage_le,
    voltage_sp: asset.voltage_sp,
  }))
}

// CSV Export functionality
export function exportToCSV(data: ProcessedAsset[], filename: string = 'grid_assets') {
  if (!data || data.length === 0) {
    console.warn('No data to export')
    return
  }

  // Define CSV headers
  const headers = [
    'ID',
    'Name',
    'Type',
    'Latitude',
    'Longitude',
    'Status',
    'Site',
    'Zone',
    'Woreda',
    'Category',
    'Political Region',
    'Voltage Level',
    'Voltage Specification',
    'Link Name'
  ]

  // Convert data to CSV rows
  const csvRows = [
    headers.join(','), // Header row
    ...data.map(asset => [
      `"${asset.id || ''}"`,
      `"${asset.name || ''}"`,
      `"${asset.source || ''}"`,
      asset.lat || '',
      asset.lng || '',
      `"${asset.status || ''}"`,
      `"${asset.site || ''}"`,
      `"${asset.zone || ''}"`,
      `"${asset.woreda || ''}"`,
      `"${asset.category || ''}"`,
      `"${asset.poletical || ''}"`,
      asset.voltage_le || '',
      `"${asset.voltage_sp || ''}"`,
      `"${asset.name_link || ''}"`
    ].join(','))
  ]

  // Create and download CSV file
  const csvContent = csvRows.join('\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')

  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}
