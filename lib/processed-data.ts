// lib/processed-data.ts
import { EthiopianGridAsset } from "@/lib/ethiopia-data"

export interface ProcessedAsset {
<<<<<<< HEAD
  properties: any
  id: string
  name?: string
  source: "tower" | "substation" | "generation_plant" | "transmission_line"
  lat: number
  lng: number
  region?: any
=======
  id: string
  name?: string
  source: "tower" | "substation"
  lat: number
  lng: number
>>>>>>> 84061cf73c66a09a4f9d9542250c164b87a3ac9d

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
<<<<<<< HEAD

  // Generation plant specific fields
  plant_type?: string
  capacity_mw?: number
  year_operational?: string

  // Transmission line specific fields
  line_voltage?: number
  line_length_km?: number
=======
>>>>>>> 84061cf73c66a09a4f9d9542250c164b87a3ac9d
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
<<<<<<< HEAD
            region: feature.properties?.Region,
            properties: feature.properties,
=======
>>>>>>> 84061cf73c66a09a4f9d9542250c164b87a3ac9d
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
<<<<<<< HEAD
            region: feature.properties?.Poletical_,
            properties: feature.properties,
=======
>>>>>>> 84061cf73c66a09a4f9d9542250c164b87a3ac9d
          })
        }
      })
    }

<<<<<<< HEAD
    // Derive generation plants from substations with SwitchYared type
    let generationPlantsCount = 0
    if (substationsData.features) {
      const generationPlants = substationsData.features.filter((feature: any) => 
        feature.properties?.TYPE_First === "SwitchYared" || 
        feature.properties?.Work_Unit_ === "GO"
      )
      
      generationPlantsCount = generationPlants.length
      console.log(`Found ${generationPlants.length} generation plants from substations data`)
      console.log('Generation plant types:', generationPlants.map((f: any) => f.properties?.TYPE_First))
      console.log('Generation plant work units:', generationPlants.map((f: any) => f.properties?.Work_Unit_))
      
      generationPlants.forEach((feature: any, index: number) => {
        const coords = feature.geometry?.coordinates
        if (coords && coords.length >= 2) {
          // Determine plant type based on name and properties
          let plantType = "Hydroelectric"
          let capacity = 0
          
          const name = feature.properties?.Name_First || ""
          if (name.toLowerCase().includes("wind")) {
            plantType = "Wind"
            capacity = name.includes("II") ? 153 : 51
          } else if (name.toLowerCase().includes("fincha")) {
            plantType = "Hydroelectric"
            capacity = 134
          } else if (name.toLowerCase().includes("muger")) {
            plantType = "Hydroelectric"
            capacity = 184
          } else if (name.toLowerCase().includes("koka")) {
            plantType = "Hydroelectric"
            capacity = 43.2
          } else if (name.toLowerCase().includes("tekeze")) {
            plantType = "Hydroelectric"
            capacity = 300
          } else if (name.toLowerCase().includes("gibe")) {
            plantType = "Hydroelectric"
            capacity = name.includes("III") ? 1870 : 420
          } else if (name.toLowerCase().includes("neshe")) {
            plantType = "Hydroelectric"
            capacity = 97
          } else {
            // Default capacity based on voltage level
            capacity = (feature.properties?.VOLTAGE_LE || 132) * 0.5
          }

          const plantAsset: ProcessedAsset = {
            id: `plant_${feature.properties?.NO_First || index}`,
            source: "generation_plant" as const,
            lat: coords[1],
            lng: coords[0],
            name: feature.properties?.Name_First || `Generation Plant ${index + 1}`,
            plant_type: plantType,
            capacity_mw: capacity,
            year_operational: feature.properties?.Year_of_Op || "Unknown",
            poletical: feature.properties?.Poletical_,
            region: feature.properties?.Poletical_,
            properties: feature.properties,
          }
          processedAssets.push(plantAsset)
          console.log(`Added generation plant: ${plantAsset.name} (${plantAsset.plant_type})`)
        }
      })
    }

    // Derive transmission lines by connecting nearby substations and towers
    const transmissionLines: ProcessedAsset[] = []
    
    // Get all substations
    const substations = processedAssets.filter(a => a.source === "substation")
    const towers = processedAssets.filter(a => a.source === "tower")
    
    // Create transmission lines between substations
    for (let i = 0; i < substations.length; i++) {
      for (let j = i + 1; j < substations.length; j++) {
        const sub1 = substations[i]
        const sub2 = substations[j]
        
        // Calculate distance between substations
        const distance = calculateDistance(sub1.lat, sub1.lng, sub2.lat, sub2.lng)
        
        // Only create lines for reasonably close substations (within 200km)
        if (distance < 200) {
          const midLat = (sub1.lat + sub2.lat) / 2
          const midLng = (sub1.lng + sub2.lng) / 2
          
          // Determine voltage based on the higher voltage substation
          const voltage = Math.max(sub1.voltage_le || 0, sub2.voltage_le || 0)
          
          transmissionLines.push({
            id: `line_${sub1.id}_${sub2.id}`,
            source: "transmission_line",
            lat: midLat,
            lng: midLng,
            name: `${sub1.name} to ${sub2.name}`,
            line_voltage: voltage,
            line_length_km: Math.round(distance),
            poletical: sub1.poletical || sub2.poletical,
            region: sub1.poletical || sub2.poletical,
            properties: {
              from_substation: sub1.name,
              to_substation: sub2.name,
              voltage: voltage,
              length: Math.round(distance)
            }
          })
        }
      }
    }
    
    // Create transmission lines from generation plants to nearby substations
    const generationPlants = processedAssets.filter(a => a.source === "generation_plant")
    
    for (const plant of generationPlants) {
      for (const substation of substations) {
        const distance = calculateDistance(plant.lat, plant.lng, substation.lat, substation.lng)
        
        // Only create lines for reasonably close connections (within 150km)
        if (distance < 150) {
          const midLat = (plant.lat + substation.lat) / 2
          const midLng = (plant.lng + substation.lng) / 2
          
          const voltage = Math.max(plant.properties?.VOLTAGE_LE || 0, substation.voltage_le || 0)
          
          transmissionLines.push({
            id: `line_${plant.id}_${substation.id}`,
            source: "transmission_line",
            lat: midLat,
            lng: midLng,
            name: `${plant.name} to ${substation.name}`,
            line_voltage: voltage,
            line_length_km: Math.round(distance),
            poletical: plant.poletical || substation.poletical,
            region: plant.poletical || substation.poletical,
            properties: {
              from_plant: plant.name,
              to_substation: substation.name,
              voltage: voltage,
              length: Math.round(distance)
            }
          })
        }
      }
    }
    
    // Add transmission lines to processed assets
    processedAssets.push(...transmissionLines)

    console.log(`Loaded ${processedAssets.length} processed assets`)
    console.log(`- Towers: ${towers.length}`)
    console.log(`- Substations: ${substations.length}`)
    console.log(`- Generation Plants: ${generationPlantsCount}`)
    console.log(`- Transmission Lines: ${transmissionLines.length}`)
    
    // Debug: Check if generation plants are in the final array
    const finalGenerationPlants = processedAssets.filter(a => a.source === "generation_plant")
    console.log(`Final generation plants count: ${finalGenerationPlants.length}`)
    console.log('Generation plant names:', finalGenerationPlants.map(p => p.name))
    
=======
    console.log(`Loaded ${processedAssets.length} processed assets`)
>>>>>>> 84061cf73c66a09a4f9d9542250c164b87a3ac9d
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
<<<<<<< HEAD
        poletical: "Addis Abeba",
        region: "Addis Abeba",
=======
>>>>>>> 84061cf73c66a09a4f9d9542250c164b87a3ac9d
      },
      {
        id: "substation_1",
        source: "substation",
        lat: 9.045,
        lng: 38.7569,
        name: "Addis Ababa Substation 1",
<<<<<<< HEAD
        poletical: "Addis Abeba",
        voltage_le: 132,
        voltage_sp: "132kV",
        region: "Addis Abeba",
=======
        poletical: "Addis Ababa",
        voltage_le: 132,
        voltage_sp: "132kV",
>>>>>>> 84061cf73c66a09a4f9d9542250c164b87a3ac9d
      },
    ]
  }
}

<<<<<<< HEAD
// Helper function to calculate distance between two points
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371 // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLng/2) * Math.sin(dLng/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c
}

// Get unique regions from the data
export function getUniqueRegions(assets: ProcessedAsset[]): string[] {
  const regions = new Set<string>()
  assets.forEach(asset => {
    if (asset.poletical && asset.poletical.trim() !== '') {
      regions.add(asset.poletical)
    }
  })
  return Array.from(regions).sort()
}

=======
>>>>>>> 84061cf73c66a09a4f9d9542250c164b87a3ac9d
// Compute metrics from processed assets
export function computeMetrics(assets: ProcessedAsset[]) {
  const towers = assets.filter(a => a.source === "tower")
  const substations = assets.filter(a => a.source === "substation")
<<<<<<< HEAD
  const generationPlants = assets.filter(a => a.source === "generation_plant")
  const transmissionLines = assets.filter(a => a.source === "transmission_line")
  
  console.log('Analytics - Asset counts:', {
    towers: towers.length,
    substations: substations.length,
    generationPlants: generationPlants.length,
    transmissionLines: transmissionLines.length
  })
=======
>>>>>>> 84061cf73c66a09a4f9d9542250c164b87a3ac9d

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
<<<<<<< HEAD
    totalTowers: towers.length,
    totalSubstations: substations.length,
    totalGenerationPlants: generationPlants.length,
    totalTransmissionLines: transmissionLines.length,
=======
>>>>>>> 84061cf73c66a09a4f9d9542250c164b87a3ac9d
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
<<<<<<< HEAD
    'Link Name',
    'Plant Type',
    'Capacity MW',
    'Year Operational',
    'Line Voltage',
    'Line Length KM'
=======
    'Link Name'
>>>>>>> 84061cf73c66a09a4f9d9542250c164b87a3ac9d
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
<<<<<<< HEAD
      `"${asset.name_link || ''}"`,
      `"${asset.plant_type || ''}"`,
      asset.capacity_mw || '',
      `"${asset.year_operational || ''}"`,
      asset.line_voltage || '',
      asset.line_length_km || ''
=======
      `"${asset.name_link || ''}"`
>>>>>>> 84061cf73c66a09a4f9d9542250c164b87a3ac9d
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
