import type { GridAsset } from "@/lib/api"
import type { Feature, Point } from "geojson"

// A type guard to check if a feature's geometry is a Point
function isFeatureWithPoint(
  feature: GeoJSON.Feature
): feature is GeoJSON.Feature<Point> {
  return feature.geometry?.type === "Point"
}

export async function loadRealDataFromGeoJSON(
  url: string
): Promise<GridAsset[]> {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Failed to fetch GeoJSON from ${url}: ${response.statusText}`)
  }
  const geojsonData: GeoJSON.FeatureCollection = await response.json()

  const assetType = url.includes("Towers") ? "Tower" : "Substation"

  return geojsonData.features.filter(isFeatureWithPoint).map((feature, index) => ({
    id: feature.properties?.id ?? feature.id ?? `${assetType}-${index}`,
    type: assetType,
    geometry: feature.geometry,
    properties: feature.properties || {},
  }))
}

export async function loadZoneData(
  url: string
): Promise<GeoJSON.FeatureCollection> {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Failed to fetch GeoJSON from ${url}: ${response.statusText}`)
  }
  const geojsonData: GeoJSON.FeatureCollection = await response.json()
  return geojsonData
}