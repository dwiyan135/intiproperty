'use client'

import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import * as L from 'leaflet'

const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
})
L.Marker.prototype.options.icon = DefaultIcon

export default function LeafletMap({
  value,
  onChange,
}: {
  value: string
  onChange: (val: string) => void
}) {
  const [lat, lng] = value
    ? value.split(',').map(v => parseFloat(v))
    : [-6.2, 106.816666]

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
      style={{ height: '300px', width: '100%' }}
      className="rounded-lg border border-blue-900"
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={[lat, lng]} />
      <ClickHandler />
    </MapContainer>
  )
}
