'use client';

import { createRoot } from 'react-dom/client';
import { useEffect, useRef, useState } from 'react';
import { Map, Marker, Popup } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { BsHouseFill } from "react-icons/bs";

export interface MapMarker {
  id: string;
  longitude: number;
  latitude: number;
  title?: string;
  color?: string;
}

export interface MapProps {
  longitude?: number;
  latitude?: number;
  zoom?: number;
  markers?: MapMarker[];
}

export default function MapComponent({ longitude, latitude, zoom, markers = [] }: MapProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<maplibregl.Map | null>(null)
  const markersRef = useRef<Marker[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentLongitude, setCurrentLongitude] = useState<number | null>(null);
  const [currentLatitude, setCurrentLatitude] = useState<number | null>(null);
  const [currentZoom, setCurrentZoom] = useState<number | null>(null);
  const [mapInitialized, setMapInitialized] = useState(false)

  // Haal gebruiker locatie op
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLongitude(position.coords.longitude);
          setCurrentLatitude(position.coords.latitude);
          setCurrentZoom(13);
        },
        (error) => {
          console.warn("Geolocation error:", error)

          setCurrentLongitude(5.83);
          setCurrentLatitude(51.18);
          setCurrentZoom(13);
        },
        {
          enableHighAccuracy: true,
          timeout: 2500,
          maximumAge: 0,
        },
      )
    }
    else {
      setCurrentLongitude(5.83);
      setCurrentLatitude(51.18);
      setCurrentZoom(13);
    }
  }, []);

  const createMarkerElement = (marker: MapMarker) => {
    const markerElement = document.createElement('div');
    markerElement.className = 'map-marker';

    const reactRoot = createRoot(markerElement);
    reactRoot.render(
      <div className='flex flex-col items-center drop-shadow-xl/25 transition-all duration-200 ease hover:translate-y-[-2px] hover:drop-shadow-xl/30'>
        <div className='flex justify-center items-center w-[40px] h-[40px] rounded-full'
          style={{ backgroundColor: marker.color || '#329dd7' }}
        >
          <BsHouseFill size={22} fill='white' className='mb-[2px]' />
        </div>
        <div className='h-[0px] w-[0px] mt-[-6px] border-l-14 border-l-transparent border-r-14 border-r-transparent border-t-18'
          style={{ borderTopColor: marker.color || '#329dd7' }}
        />
      </div>
    );

    return markerElement;
  }

  const clearMarkers = () => {
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];
  }

  // Initialiseer map
  useEffect(() => {
    if (!mapContainer.current || !currentLongitude || !currentLatitude || mapInitialized) return

    const lng = longitude || currentLongitude;
    const lat = latitude || currentLatitude;
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
          zoom: z || 13,
        })

        map.current.on("load", () => {
          setIsLoading(false)
          setMapInitialized(true)
        })

        map.current.on("error", () => {
          setIsLoading(false)
        })
      }
      catch (error) {
        console.error(error);
        setIsLoading(false);
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
    if (!map.current || !longitude || !latitude || !mapInitialized) return

    map.current.flyTo({
      center: [longitude, latitude],
      zoom: zoom || map.current.getZoom(),
      duration: 2000,
      essential: true,
    })
  }, [longitude, latitude, zoom, mapInitialized])

  useEffect(() => {
    const addMarkersToMap = () => {
      if (!map.current || !mapInitialized) return;

      clearMarkers();

      markers.forEach(markerData => {
        const markerElement = createMarkerElement(markerData);

        const marker = new Marker({ element: markerElement })
          .setLngLat([markerData.longitude, markerData.latitude])
          .addTo(map.current!);

        if (markerData.title) {
          const popup = new Popup({ offset: 25 })
            .setHTML(`<h3 class="font-bold">${markerData.title}</h3>`);
            marker.setPopup(popup);
        }

        markersRef.current.push(marker);
      });
    }

    if (mapInitialized) {
      addMarkersToMap();
    }
  }, [markers, mapInitialized]);

  return (
    <div ref={mapContainer} className='h-full w-full' />
  )
}