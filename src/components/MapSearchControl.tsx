// src/components/MapSearchControl.tsx
'use client';

import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import 'leaflet-geosearch/dist/geosearch.css';

interface MapSearchControlProps {
  onSelect: (lat: number, lng: number) => void;
}

export default function MapSearchControl({ onSelect }: MapSearchControlProps) {
  const map = useMap();

  useEffect(() => {
    let control: any;

    // Dynamic import supaya hanya jalan di client
    (async () => {
        const { OpenStreetMapProvider, GeoSearchControl } = await import(
            'leaflet-geosearch'
        );

      const provider = new OpenStreetMapProvider();
      // @ts-ignore: constructor signature
      control = new GeoSearchControl({
        provider,
        style: 'bar',
        showMarker: false,
        retainZoomLevel: false,
        animateZoom: true,
        autoClose: true,
        keepResult: true,
      });

      map.addControl(control);

      // tangani event hasil pencarian
      map.on('geosearch/showlocation', (e: any) => {
        const { x: lng, y: lat } = e.location;
        onSelect(lat, lng);
        map.setView([lat, lng], 15);
      });
    })();

    return () => {
      if (control) {
        // @ts-ignore
        map.removeControl(control);
      }
      map.off('geosearch/showlocation');
    };
  }, [map, onSelect]);

  return null;
}
