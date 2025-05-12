// src/components/DynamicLeafletMap.tsx
'use client'

import React from 'react'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// ── Fix Leaflet’s missing-icon issue ──────────────────────────────────────────
// kita paksa cast ke any supaya TS gak complain
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png',
  iconUrl:
    'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
  shadowUrl:
    'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
})
// ─────────────────────────────────────────────────────────────────────────────

interface Props {
  /** format "lat,lng" */
  value: string
  onChange: (val: string) => void
}

export default function DynamicLeafletMap({ value, onChange }: Props) {
  // parse atau default ke Jakarta
  const [lat, lng] = value
    ? value.split(',').map((v) => parseFloat(v))
    : [-6.2, 106.816666]

  // komponen hanya untuk menangkap click
  function ClickHandler() {
    useMapEvents({
      click(e) {
        const coord = `${e.latlng.lat.toFixed(6)},${e.latlng.lng.toFixed(6)}`
        onChange(coord)
      },
    })
    return null
  }

  return (
    <MapContainer
      center={[lat, lng]}
      zoom={13}
      style={{ height: 300, width: '100%' }}
      className="rounded-lg border border-blue-900"
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={[lat, lng]} />
      <ClickHandler />
    </MapContainer>
  )
}
