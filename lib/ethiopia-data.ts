// Ethiopian Grid Data Types and Processing
export interface EthiopianRegion {
  ADM1_EN: string // Region name (e.g., "Addis Ababa", "Oromia")
  ADM1_PCODE: string // Region code (e.g., "ET01", "ET02")
  Shape_Area: number
  coordinates: number[][][] // Geographic boundaries
}

export interface EthiopianGridAsset {
  id: string
  name: string
  type: "substation" | "transformer" | "transmission" | "meter" | "generator"
  status: "normal" | "warning" | "critical" | "maintenance"
  region: string // Ethiopian region name
  regionCode: string // ET01, ET02, etc.
  location: {
    lat: number
    lng: number
    address: string
  }
  voltage: number
  load: number
  capacity: number
  lastUpdate: string
  alerts: Array<{
    severity: "low" | "medium" | "high" | "critical"
    message: string
  }>
}

// Mock Ethiopian regions data (replace with your actual data)
export const mockEthiopianRegions: EthiopianRegion[] = [
  {
    ADM1_EN: "Addis Ababa",
    ADM1_PCODE: "ET01",
    Shape_Area: 527.0,
    coordinates: [
      [
        [38.7, 9.0],
        [38.8, 9.0],
        [38.8, 9.1],
        [38.7, 9.1],
        [38.7, 9.0],
      ],
    ],
  },
  {
    ADM1_EN: "Oromia",
    ADM1_PCODE: "ET02",
    Shape_Area: 353006.81,
    coordinates: [
      [
        [34.0, 4.0],
        [42.0, 4.0],
        [42.0, 12.0],
        [34.0, 12.0],
        [34.0, 4.0],
      ],
    ],
  },
  {
    ADM1_EN: "Amhara",
    ADM1_PCODE: "ET03",
    Shape_Area: 159173.66,
    coordinates: [
      [
        [36.0, 10.0],
        [40.0, 10.0],
        [40.0, 14.0],
        [36.0, 14.0],
        [36.0, 10.0],
      ],
    ],
  },
  {
    ADM1_EN: "Tigray",
    ADM1_PCODE: "ET04",
    Shape_Area: 41410.0,
    coordinates: [
      [
        [36.5, 12.5],
        [39.5, 12.5],
        [39.5, 14.5],
        [36.5, 14.5],
        [36.5, 12.5],
      ],
    ],
  },
  {
    ADM1_EN: "Somali",
    ADM1_PCODE: "ET05",
    Shape_Area: 279252.0,
    coordinates: [
      [
        [40.0, 4.0],
        [48.0, 4.0],
        [48.0, 11.0],
        [40.0, 11.0],
        [40.0, 4.0],
      ],
    ],
  },
  {
    ADM1_EN: "SNNP",
    ADM1_PCODE: "ET06",
    Shape_Area: 105887.0,
    coordinates: [
      [
        [34.0, 4.5],
        [38.5, 4.5],
        [38.5, 8.5],
        [34.0, 8.5],
        [34.0, 4.5],
      ],
    ],
  },
  {
    ADM1_EN: "Afar",
    ADM1_PCODE: "ET07",
    Shape_Area: 96707.0,
    coordinates: [
      [
        [39.0, 8.0],
        [42.5, 8.0],
        [42.5, 14.5],
        [39.0, 14.5],
        [39.0, 8.0],
      ],
    ],
  },
  {
    ADM1_EN: "Benishangul Gumuz",
    ADM1_PCODE: "ET08",
    Shape_Area: 49289.0,
    coordinates: [
      [
        [34.0, 9.0],
        [36.5, 9.0],
        [36.5, 12.0],
        [34.0, 12.0],
        [34.0, 9.0],
      ],
    ],
  },
  {
    ADM1_EN: "Gambela",
    ADM1_PCODE: "ET09",
    Shape_Area: 25802.0,
    coordinates: [
      [
        [33.0, 7.0],
        [35.5, 7.0],
        [35.5, 9.0],
        [33.0, 9.0],
        [33.0, 7.0],
      ],
    ],
  },
  {
    ADM1_EN: "Harari",
    ADM1_PCODE: "ET10",
    Shape_Area: 334.0,
    coordinates: [
      [
        [42.0, 9.2],
        [42.2, 9.2],
        [42.2, 9.4],
        [42.0, 9.4],
        [42.0, 9.2],
      ],
    ],
  },
  {
    ADM1_EN: "Dire Dawa",
    ADM1_PCODE: "ET11",
    Shape_Area: 1559.0,
    coordinates: [
      [
        [41.8, 9.5],
        [42.0, 9.5],
        [42.0, 9.7],
        [41.8, 9.7],
        [41.8, 9.5],
      ],
    ],
  },
  {
    ADM1_EN: "Sidama",
    ADM1_PCODE: "ET12",
    Shape_Area: 6972.0,
    coordinates: [
      [
        [38.0, 6.0],
        [39.0, 6.0],
        [39.0, 7.0],
        [38.0, 7.0],
        [38.0, 6.0],
      ],
    ],
  },
]

// Process your TopoJSON data
export function processEthiopianRegions(topoJsonData: any): EthiopianRegion[] {
  const regions: EthiopianRegion[] = []

  try {
    if (topoJsonData.objects && topoJsonData.objects.regions) {
      const geometries = topoJsonData.objects.regions.geometries

      geometries.forEach((geometry: any) => {
        if (geometry.properties) {
          regions.push({
            ADM1_EN: geometry.properties.ADM1_EN,
            ADM1_PCODE: geometry.properties.ADM1_PCODE,
            Shape_Area: geometry.properties.Shape_Area,
            coordinates: geometry.coordinates || [],
          })
        }
      })
    }
  } catch (error) {
    console.error("Error processing TopoJSON data:", error)
    return mockEthiopianRegions
  }

  return regions.length > 0 ? regions : mockEthiopianRegions
}

// Generate realistic Ethiopian grid assets based on regions
export function generateEthiopianGridAssets(regions: EthiopianRegion[], count = 45000): EthiopianGridAsset[] {
  const assets: EthiopianGridAsset[] = []
  const assetTypes = ["substation", "transformer", "transmission", "meter", "generator"] as const

  // Adjust status distribution to have more alerts
  const statuses = ["normal", "warning", "critical", "maintenance"] as const
  const statusWeights = [0.6, 0.25, 0.1, 0.05] // 60% normal, 25% warning, 10% critical, 5% maintenance

  // Ethiopian regions with approximate coordinates
  const regionCoordinates: Record<string, { lat: number; lng: number }> = {
    "Addis Ababa": { lat: 9.032, lng: 38.7469 },
    Oromia: { lat: 8.5, lng: 39.5 },
    Amhara: { lat: 11.5, lng: 37.5 },
    Tigray: { lat: 14.0, lng: 38.5 },
    Somali: { lat: 6.5, lng: 44.0 },
    SNNP: { lat: 6.5, lng: 37.0 },
    Afar: { lat: 11.5, lng: 41.0 },
    "Benishangul Gumuz": { lat: 10.5, lng: 35.0 },
    Gambela: { lat: 8.0, lng: 34.5 },
    Harari: { lat: 9.3, lng: 42.1 },
    "Dire Dawa": { lat: 9.6, lng: 41.9 },
    Sidama: { lat: 6.2, lng: 38.4 },
  }

  for (let i = 0; i < count; i++) {
    const region = regions[Math.floor(Math.random() * regions.length)]
    const regionName = region.ADM1_EN
    const baseCoords = regionCoordinates[regionName] || { lat: 9.0, lng: 38.0 }

    // Add some random variation to coordinates within the region
    const lat = baseCoords.lat + (Math.random() - 0.5) * 2
    const lng = baseCoords.lng + (Math.random() - 0.5) * 2

    const assetType = assetTypes[Math.floor(Math.random() * assetTypes.length)]

    // Use weighted random selection for status
    const random = Math.random()
    let status = statuses[0]
    let cumulativeWeight = 0

    for (let j = 0; j < statuses.length; j++) {
      cumulativeWeight += statusWeights[j]
      if (random <= cumulativeWeight) {
        status = statuses[j]
        break
      }
    }

    assets.push({
      id: `ET_${region.ADM1_PCODE}_${String(i).padStart(6, "0")}`,
      name: `${regionName} ${assetType.charAt(0).toUpperCase() + assetType.slice(1)} ${i + 1}`,
      type: assetType,
      status,
      region: regionName,
      regionCode: region.ADM1_PCODE,
      location: {
        lat,
        lng,
        address: `${regionName}, Ethiopia`,
      },
      voltage: getVoltageByType(assetType),
      load: Math.random() * 100,
      capacity: getCapacityByType(assetType),
      lastUpdate: new Date(Date.now() - Math.random() * 3600000).toISOString(),
      alerts: generateAlerts(status),
    })
  }

  return assets
}

function getVoltageByType(type: string): number {
  switch (type) {
    case "substation":
      return 138000 + Math.random() * 100000
    case "transformer":
      return 13800 + Math.random() * 5000
    case "transmission":
      return 230000 + Math.random() * 200000
    case "meter":
      return 240 + Math.random() * 100
    case "generator":
      return 13800 + Math.random() * 10000
    default:
      return 240
  }
}

function getCapacityByType(type: string): number {
  switch (type) {
    case "substation":
      return 100000 + Math.random() * 200000
    case "transformer":
      return 10000 + Math.random() * 20000
    case "transmission":
      return 200000 + Math.random() * 300000
    case "meter":
      return 500 + Math.random() * 1000
    case "generator":
      return 25000 + Math.random() * 100000
    default:
      return 1000
  }
}

function generateAlerts(status: string) {
  const alerts = []

  if (status === "normal") {
    // Even normal assets might have low-priority alerts occasionally
    if (Math.random() > 0.8) {
      alerts.push({
        severity: "low" as const,
        message: "Routine maintenance scheduled",
      })
    }
    return alerts
  }

  if (status === "warning") {
    const warningMessages = [
      "Load approaching capacity limits",
      "Temperature above normal range",
      "Voltage fluctuation detected",
      "Minor equipment malfunction",
      "Scheduled maintenance overdue",
    ]
    alerts.push({
      severity: Math.random() > 0.5 ? ("medium" as const) : ("low" as const),
      message: warningMessages[Math.floor(Math.random() * warningMessages.length)],
    })
  } else if (status === "critical") {
    const criticalMessages = [
      "Critical system fault detected",
      "Emergency shutdown required",
      "Severe overload condition",
      "Equipment failure imminent",
      "Safety threshold exceeded",
    ]
    alerts.push({
      severity: Math.random() > 0.3 ? ("critical" as const) : ("high" as const),
      message: criticalMessages[Math.floor(Math.random() * criticalMessages.length)],
    })
  } else if (status === "maintenance") {
    alerts.push({
      severity: "low" as const,
      message: "Scheduled maintenance in progress",
    })
  }

  return alerts
}

// Function to load Ethiopian data with fallback
export async function loadEthiopianData(): Promise<EthiopianGridAsset[]> {
  try {
    // Try to load your actual TopoJSON file
    const response = await fetch("/data/ethiopia-regions.json")

    if (!response.ok) {
      console.warn("TopoJSON file not found, using mock data")
      return generateEthiopianGridAssets(mockEthiopianRegions, 45000)
    }

    const topoJsonData = await response.json()
    const regions = processEthiopianRegions(topoJsonData)
    return generateEthiopianGridAssets(regions, 45000)
  } catch (error) {
    console.warn("Failed to load TopoJSON data, using mock data:", error)
    return generateEthiopianGridAssets(mockEthiopianRegions, 45000)
  }
}
