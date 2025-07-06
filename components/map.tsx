'use client';

import { createRoot } from 'react-dom/client';
import { useEffect, useRef, useState } from 'react';
import { Map, Marker } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { MapProps, MapMarker } from '@/types/map';
import MarkerComponent from './map-marker';

export default function MapComponent({ location, zoom, markers = [], onMarkerClick }: MapProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<maplibregl.Map | null>(null)
  const markersRef = useRef<Marker[]>([]);
  const [currentLongitude, setCurrentLongitude] = useState<number | null>(null);
  const [currentLatitude, setCurrentLatitude] = useState<number | null>(null);
  const [currentZoom, setCurrentZoom] = useState<number | null>(null);
  const [mapInitialized, setMapInitialized] = useState(false)

  const defaultLongitude = 5.9804;
  const defaultLatitude = 50.8860;
  const defaultZoom = 13;


  // Haal gebruiker locatie op
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLongitude(position.coords.longitude);
          setCurrentLatitude(position.coords.latitude);
          setCurrentZoom(defaultZoom);
        },
        (error) => {
          console.warn("Geolocation error:", error)

          setCurrentLongitude(defaultLongitude);
          setCurrentLatitude(defaultLatitude);
          setCurrentZoom(defaultZoom);
        },
        {
          enableHighAccuracy: true,
          timeout: 2500,
          maximumAge: 0,
        },
      )
    }
    else {
      setCurrentLongitude(defaultLongitude);
      setCurrentLatitude(defaultLatitude);
      setCurrentZoom(defaultZoom);
    }
  }, []);

  const createMarkerElement = (marker: MapMarker) => {
    const markerElement = document.createElement('div');
    markerElement.className = 'map-marker';

    const reactRoot = createRoot(markerElement);
    reactRoot.render(
      <MarkerComponent marker={marker} onMarkerClick={onMarkerClick} />
    );

    markerElement.addEventListener('mouseenter', () => {
      markerElement.style.zIndex = '1';
    });

    markerElement.addEventListener('mouseleave', () => {
      markerElement.style.zIndex = '';
    });

    return markerElement;
  }

  const clearMarkers = () => {
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];
  }

  // Initialiseer map
  useEffect(() => {
    if (!mapContainer.current || !currentLongitude || !currentLatitude || mapInitialized) return

    const lng = location?.longitude || currentLongitude;
    const lat = location?.latitude || currentLatitude;
    const z = zoom || currentZoom;

    const initializeMap = async () => {
      try {
        const response = await fetch('/api/map-style');

        if (!response.ok) {
          throw new Error('Failed to fetch map style');
        }

        const mapStyle = await response.json();

        map.current = new Map({
          container: mapContainer.current!,
          style: mapStyle,
          center: [lng, lat],
          zoom: z || defaultZoom,
        })

        map.current.on("load", () => {
          setMapInitialized(true)
        })
      }
      catch (error) {
        console.error(error);
      }
    }

    initializeMap();

    return () => {
      clearMarkers();
      if (map.current) {
        map.current.remove()
        setMapInitialized(false)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentLongitude, currentLatitude, currentZoom])

  // Verander locatie
  useEffect(() => {
    if (!map.current || !location || !mapInitialized) return

    map.current.flyTo({
      center: [location.longitude, location.latitude],
      zoom: map.current.getZoom(),
      duration: 2000,
      essential: true,
    })
  }, [location, zoom, mapInitialized])

  useEffect(() => {
    const addMarkersToMap = () => {
      if (!map.current || !mapInitialized) return;

      clearMarkers();

      markers.forEach(markerData => {
        const markerElement = createMarkerElement(markerData);

        const marker = new Marker({ element: markerElement })
          .setLngLat([markerData.longitude, markerData.latitude])
          .addTo(map.current!);

        markersRef.current.push(marker);
      });
    }

    if (mapInitialized) {
      addMarkersToMap();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [markers, mapInitialized]);

  return (
    <div ref={mapContainer} className='h-full w-full' />
  )
}