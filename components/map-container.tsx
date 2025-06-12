'use client';

import { useEffect, useRef, useState } from "react";
import { Map as MapLibreMap } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

export default function MapContainer() {
  const defaultLocation = {
    lng: 50.8858,
    lat: 5.9816,
    zoom: 13,
  };

  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<MapLibreMap | null>(null);
  const [lng, setLng] = useState(defaultLocation.lng);
  const [lat, setLat] = useState(defaultLocation.lat);
  const [zoom, setZoom] = useState(defaultLocation.zoom);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLng(position.coords.longitude);
          setLat(position.coords.latitude);
        },
        () => 
        {
          // Do nothing
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        },
      )
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    if (map.current || !mapContainer.current || loading) return;

    map.current = new MapLibreMap({
      container: mapContainer.current,
      style: 'https://api.maptiler.com/maps/streets-v2/style.json?key=9LiNYOZcR4SEvdjBsnLz',
      center: [lng, lat],
      zoom: zoom,
    });

    return () => {
      map.current?.remove();
      map.current = null;
    }
  }, [loading, lng, lat, zoom]);

  return (
    <div className="relative h-[500px] w-full">
      <div ref={mapContainer} className="h-full w-full"></div>
    </div>
  )
}