"use client"

import { useEffect, useRef, useState } from "react"
import L from "leaflet"
import "./interactive-map.css"
import "leaflet/dist/leaflet.css"
import type { ProcessedAsset } from "@/lib/processed-data"

// Fix default Leaflet markers for Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
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
  const containerRef = useRef<HTMLDivElement | null>(null)
  const markersRef = useRef<L.LayerGroup | null>(null)
  const rafRef = useRef<number | null>(null)
  const [refreshTick, setRefreshTick] = useState(0)
  const hasFitRef = useRef(false)

  // --- initialize map ---
  useEffect(() => {
    const mapContainer = containerRef.current
    if (!mapRef.current && mapContainer) {
      const map = L.map(mapContainer, {
        preferCanvas: true,
        center: [9.145, 40.489673], // Ethiopia default center
        zoom: 6,
      })
      mapRef.current = map

      // This is a workaround for a race condition in Leaflet where a zoom animation
      // can complete after the map has been removed from the DOM, causing an error.
      // See: https://github.com/Leaflet/Leaflet/issues/6966
      const original_onZoomTransitionEnd = map._onZoomTransitionEnd
      map._onZoomTransitionEnd = function (...args) {
        // If the map pane is gone, the map has been removed.
        // Stop processing to prevent errors.
        if (!this._mapPane) {
          return
        }
        return original_onZoomTransitionEnd.apply(this, args)
      }

      const tileLayers = {
        street: L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; OpenStreetMap contributors',
        }),
        satellite: L.tileLayer(
          "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
          { attribution: "Tiles &copy; Esri &mdash; Sources: Esri, USGS, NOAA" }
        ),
        terrain: L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png", {
          attribution: "&copy; OpenStreetMap contributors",
        }),
      }

      tileLayers.street.addTo(map)
      ;(map as any).tileLayers = tileLayers
      Object.values(tileLayers).forEach(layer =>
        layer.on("load", () => map.invalidateSize())
      )

      markersRef.current = L.layerGroup([], { renderer: L.svg() }).addTo(map)

      let debounceTimer: ReturnType<typeof setTimeout> | null = null
      const refresh = () => {
        if (debounceTimer) clearTimeout(debounceTimer)
        debounceTimer = setTimeout(() => setRefreshTick(t => t + 1), 120)
      }
      map.on("moveend", refresh)
      map.on("zoomend", refresh)

      const onResize = () => map.invalidateSize()
      window.addEventListener("resize", onResize)

      let ro: ResizeObserver | null = null
      if ("ResizeObserver" in window) {
        ro = new ResizeObserver(() => map.invalidateSize())
        ro.observe(mapContainer)
      }

      refresh()

      ;(map as any)._cleanupHandlers = () => {
        map.off("moveend", refresh)
        map.off("zoomend", refresh)
        window.removeEventListener("resize", onResize)
        if (ro) ro.disconnect()
        if (debounceTimer) clearTimeout(debounceTimer)
      }
    }

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      if (mapRef.current) {
        ;(mapRef.current as any)._cleanupHandlers?.()
        mapRef.current.remove()
        mapRef.current = null
        markersRef.current = null
        hasFitRef.current = false
      }
    }
  }, [])

  // --- switch basemap ---
  useEffect(() => {
    const map = mapRef.current
    if (!map) return
    const tileLayers = (map as any).tileLayers
    if (!tileLayers) return
    Object.values(tileLayers).forEach((layer: L.TileLayer) => {
      if (map.hasLayer(layer)) map.removeLayer(layer)
    })
    tileLayers[mapView].addTo(map)
    const timer = setTimeout(() => {
      if (mapRef.current) {
        map.invalidateSize()
      }
    }, 50)

    return () => clearTimeout(timer)
  }, [mapView])

  // --- render markers ---
  useEffect(() => {
    const map = mapRef.current
    const layers = markersRef.current
    if (!map || !layers) return

    layers.clearLayers()
    const bounds = map.getBounds()
    if (!bounds.isValid()) return

    const visible = assets.filter(
      a =>
        Number.isFinite(a.lat) &&
        Number.isFinite(a.lng) &&
        bounds.contains([a.lat, a.lng])
    )

    const MAX_VISIBLE = 3000
    let filtered = visible
    const zoom = map.getZoom()
    if (visible.length > MAX_VISIBLE || zoom < 7) {
      const step = Math.ceil(visible.length / MAX_VISIBLE)
      filtered = visible.filter((_, idx) => idx % step === 0)
    }

    let i = 0
    const CHUNK = 400
    const addBatch = () => {
      const map = mapRef.current
      const layers = markersRef.current
      if (!map || !layers) return

      const end = Math.min(i + CHUNK, filtered.length)
      const zoomNow = map.getZoom()

      for (; i < end; i++) {
        const asset = filtered[i]
        if (!Number.isFinite(asset.lat) || !Number.isFinite(asset.lng)) continue

        const isTower = asset.source === "tower"
        const isSub = asset.source === "substation"
        const isPlant = asset.source === "generation_plant"
        const isLine = asset.source === "transmission_line"
        const emoji = getAssetIcon?.(asset.source || "unknown") ?? "📍"

        const color = "#111827"

        const sizeBase = zoomNow >= 12 ? 28 : zoomNow >= 10 ? 24 : 20
        const size = selectedAsset?.id === asset.id ? sizeBase + 6 : sizeBase

        let marker: L.Marker<any> | L.CircleMarker
        try {
          if (filtered.length > 2800 && zoom < 6) {
            marker = L.circleMarker([asset.lat, asset.lng], {
              radius: Math.max(3, size / 3),
              color: "#ffffff",
              weight: 1,
              fillColor: color,
              fillOpacity: 0.9,
              renderer: L.svg(),
            })
          } else {
            const icon = L.divIcon({
              html: `<span>${emoji}</span>`,
              className: "custom-marker",
              iconSize: [size, size],
              iconAnchor: [size / 2, size / 2],
            })
            marker = L.marker([asset.lat, asset.lng], { icon }).on("add", e => {
              const el = (e.target as any)?._icon
              if (el) {
                el.style.setProperty("--marker-color", color)
                el.style.setProperty("--marker-size", `${size}px`)
              }
            })
          }
        } catch (err) {
          console.warn("Skipping marker due to render error:", asset, err)
          continue
        }

        const popupContent = `<div class="map-popup">
          <h3 class="map-popup-title">${
            asset.name || `${asset.source} ${asset.id}`
          }</h3>
          <div class="map-popup-tags">
            ${
              isTower
                ? `<span class="map-popup-tag">${(
                    asset.status || "UNKNOWN"
                  ).toUpperCase()}</span>`
                : ""
            }
            <span class="map-popup-tag map-popup-tag-type">${(
              asset.source || "ASSET"
            ).toUpperCase()}</span>
          </div>
          <div class="map-popup-details">
            ${
              isTower
                ? `${
                    asset.site
                      ? `<div><strong>Site:</strong>${asset.site}</div>`
                      : ""
                  }${
                    asset.zone
                      ? `<div><strong>Zone:</strong>${asset.zone}</div>`
                      : ""
                  }`
                : ""
            }
            ${
              asset.poletical
                ? `<div><strong>Region:</strong>${asset.poletical}</div>`
                : ""
            }
            <div class="map-popup-coords">
              <div><strong>Coordinates:</strong></div>
              <div>Lat:${asset.lat.toFixed(6)}, Lng:${asset.lng.toFixed(6)}</div>
            </div>
          </div>
        </div>`

        marker.bindPopup(popupContent)
        marker.on("click", () => onAssetSelect(asset))
        layers.addLayer(marker)
      }

      if (i < filtered.length) rafRef.current = requestAnimationFrame(addBatch)
    }

    addBatch()
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [assets, selectedAsset, refreshTick, getAssetIcon, getStatusColor])

  // --- fit map to assets (deferred & safe) ---
  useEffect(() => {
    if (!assets || assets.length === 0) return

    const pts = assets
      .filter(a => Number.isFinite(a.lat) && Number.isFinite(a.lng))
      .map(a => [a.lat, a.lng] as [number, number])

    if (pts.length === 0) return

    const bounds = L.latLngBounds(pts)
    if (!bounds.isValid() || hasFitRef.current) return

    const timer = setTimeout(() => {
      const m = mapRef.current
      if (!m || !containerRef.current?.isConnected) return // ensure map & DOM exist

      try {
        m.fitBounds(bounds.pad(0.1))
        setTimeout(() => {
          if (mapRef.current && containerRef.current?.isConnected) {
            mapRef.current.invalidateSize()
          }
        }, 100)
        hasFitRef.current = true
      } catch (err) {
        console.warn("Skipping fitBounds due to map state issue:", err)
      }
    }, 200)

    return () => clearTimeout(timer)
  }, [assets])

  return <div ref={containerRef} style={{ height: "100%", width: "100%" }} />
}
