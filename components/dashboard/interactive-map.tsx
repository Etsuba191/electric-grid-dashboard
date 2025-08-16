"use client"

import { useEffect, useRef } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import type { ProcessedAsset } from "@/lib/processed-data"

// Fix for default markers in Leaflet with Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
})

interface InteractiveMapProps {
  assets: ProcessedAsset[]
  mapView: "satellite" | "street" | "terrain"
  onAssetSelect: (asset: ProcessedAsset | null) => void
  selectedAsset: ProcessedAsset | null
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
      const map = L.map("map").setView([9.145, 40.489673], 6)
      mapRef.current = map

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

      tileLayers.street.addTo(map)
      ;(map as any).tileLayers = tileLayers

      markersRef.current = L.layerGroup().addTo(map)
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    if (mapRef.current && (mapRef.current as any).tileLayers) {
      const tileLayers = (mapRef.current as any).tileLayers
      Object.values(tileLayers).forEach((layer: any) => {
        mapRef.current!.removeLayer(layer)
      })
      tileLayers[mapView].addTo(mapRef.current)
    }
  }, [mapView])

  useEffect(() => {
    if (!mapRef.current || !markersRef.current) return
    markersRef.current.clearLayers()

    assets.forEach((asset) => {
      if (!asset.lat || !asset.lng || asset.lat == null || asset.lng == null) {
        console.warn("Skipping asset with missing location:", asset)
        return
      }

      const color = getStatusColor(asset.status || 'unknown')
      const icon = getAssetIcon(asset.source || 'unknown')

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

      const marker = L.marker([asset.lat, asset.lng], { icon: customIcon })

      const popupContent = `
        <div style="color: #1e293b; min-width: 250px; font-family: system-ui, -apple-system, sans-serif;">
          <h3 style="margin: 0 0 12px 0; font-weight: bold; color: #0f172a; font-size: 16px;">
            ${asset.name || `${asset.source} ${asset.id}`}
          </h3>

          <div style="margin-bottom: 12px;">
            <span style="display: inline-block; padding: 3px 8px; background-color: ${color}; color: white; border-radius: 4px; font-size: 11px; margin-right: 6px; font-weight: 500;">
              ${(asset.status || 'UNKNOWN').toUpperCase()}
            </span>
            <span style="display: inline-block; padding: 3px 8px; background-color: #64748b; color: white; border-radius: 4px; font-size: 11px; font-weight: 500;">
              ${(asset.source || 'ASSET').toUpperCase()}
            </span>
          </div>

          <div style="font-size: 13px; line-height: 1.6; color: #374151;">
            ${asset.source === 'tower' ? `
              ${asset.site ? `<div><strong>Site:</strong> ${asset.site}</div>` : ''}
              ${asset.zone ? `<div><strong>Zone:</strong> ${asset.zone}</div>` : ''}
              ${asset.woreda ? `<div><strong>Woreda:</strong> ${asset.woreda}</div>` : ''}
              ${asset.category ? `<div><strong>Category:</strong> ${asset.category}</div>` : ''}
              ${asset.name_link ? `<div><strong>Link:</strong> ${asset.name_link}</div>` : ''}
            ` : `
              ${asset.voltage_le ? `<div><strong>Voltage Level:</strong> ${asset.voltage_le} kV</div>` : ''}
              ${asset.voltage_sp ? `<div><strong>Voltage Spec:</strong> ${asset.voltage_sp}</div>` : ''}
            `}
            ${asset.poletical ? `<div><strong>Region:</strong> ${asset.poletical}</div>` : ''}

            <div style="margin-top: 12px; padding-top: 8px; border-top: 1px solid #e5e7eb; font-size: 11px; color: #6b7280;">
              <div><strong>Coordinates:</strong></div>
              <div>Lat: ${asset.lat.toFixed(6)}, Lng: ${asset.lng.toFixed(6)}</div>
            </div>
          </div>
        </div>
      `

      marker.bindPopup(popupContent)
      marker.on("click", () => onAssetSelect(asset))
      markersRef.current!.addLayer(marker)
    })
  }, [assets, selectedAsset, getStatusColor, getAssetIcon, onAssetSelect])

  return <div id="map" style={{ height: "100%", width: "100%" }} />
}
