"use client"

import { useEffect, useRef } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import type { EthiopianGridAsset } from "@/lib/ethiopia-data"

// Fix for default markers in Leaflet with Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
})

interface InteractiveMapProps {
  assets: EthiopianGridAsset[]
  mapView: "satellite" | "street" | "terrain"
  onAssetSelect: (asset: EthiopianGridAsset | null) => void
  selectedAsset: EthiopianGridAsset | null
  getStatusColor: (status: string) => string
  getAssetIcon: (type: string) => string
}

export default function InteractiveMap({
  assets,
  mapView,
  onAssetSelect,
  selectedAsset,
  getStatusColor,
  getAssetIcon,
}: InteractiveMapProps) {
  const mapRef = useRef<L.Map | null>(null)
  const markersRef = useRef<L.LayerGroup | null>(null)

  useEffect(() => {
    if (!mapRef.current) {
      // Initialize map centered on Ethiopia
      const map = L.map("map").setView([9.145, 40.489673], 6)
      mapRef.current = map

      // Add tile layers
      const tileLayers = {
        street: L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }),
        satellite: L.tileLayer(
          "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
          {
            attribution:
              "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
          },
        ),
        terrain: L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png", {
          attribution:
            'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
        }),
      }

      // Add default layer
      tileLayers.street.addTo(map)

      // Store tile layers for switching
      ;(map as any).tileLayers = tileLayers

      // Initialize markers layer
      markersRef.current = L.layerGroup().addTo(map)
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [])

  // Update map view when mapView changes
  useEffect(() => {
    if (mapRef.current && (mapRef.current as any).tileLayers) {
      const tileLayers = (mapRef.current as any).tileLayers

      // Remove all layers
      Object.values(tileLayers).forEach((layer: any) => {
        mapRef.current!.removeLayer(layer)
      })

      // Add selected layer
      tileLayers[mapView].addTo(mapRef.current)
    }
  }, [mapView])

  // Update markers when assets change
  useEffect(() => {
    if (!mapRef.current || !markersRef.current) return

    // Clear existing markers
    markersRef.current.clearLayers()

    // Add new markers
    assets.forEach((asset) => {
      const color = getStatusColor(asset.status)
      const icon = getAssetIcon(asset.type)

      // Create custom icon
      const customIcon = L.divIcon({
        html: `
          <div style="
            background-color: ${color};
            width: 20px;
            height: 20px;
            border-radius: 50%;
            border: 2px solid white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 10px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.3);
            ${selectedAsset?.id === asset.id ? "transform: scale(1.5); z-index: 1000;" : ""}
          ">
            ${icon}
          </div>
        `,
        className: "custom-marker",
        iconSize: [20, 20],
        iconAnchor: [10, 10],
      })

      const marker = L.marker([asset.location.lat, asset.location.lng], { icon: customIcon })

      // Create popup content
      const popupContent = `
        <div style="color: #1e293b; min-width: 200px;">
          <h3 style="margin: 0 0 8px 0; font-weight: bold; color: #0f172a;">${asset.name}</h3>
          <div style="margin-bottom: 8px;">
            <span style="display: inline-block; padding: 2px 6px; background-color: ${color}; color: white; border-radius: 4px; font-size: 11px; margin-right: 4px;">
              ${asset.status.toUpperCase()}
            </span>
            <span style="display: inline-block; padding: 2px 6px; background-color: #64748b; color: white; border-radius: 4px; font-size: 11px;">
              ${asset.type.toUpperCase()}
            </span>
          </div>
          <div style="font-size: 12px; line-height: 1.4;">
            <div><strong>Region:</strong> ${asset.region}</div>
            <div><strong>Load:</strong> ${asset.load.toFixed(1)}%</div>
            <div><strong>Voltage:</strong> ${asset.voltage.toLocaleString()} V</div>
            ${asset.alerts.length > 0 ? `<div style="color: #dc2626; margin-top: 4px;"><strong>⚠️ ${asset.alerts.length} Alert(s)</strong></div>` : ""}
          </div>
        </div>
      `

      marker.bindPopup(popupContent)

      // Add click event
      marker.on("click", () => {
        onAssetSelect(asset)
      })

      // Add to markers layer
      markersRef.current!.addLayer(marker)
    })
  }, [assets, selectedAsset, getStatusColor, getAssetIcon, onAssetSelect])

  return <div id="map" style={{ height: "100%", width: "100%" }} />
}
