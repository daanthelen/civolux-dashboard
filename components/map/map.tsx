'use client';

import { createRoot } from 'react-dom/client';
import { useEffect, useRef, useState } from 'react';
import { Map, Marker, LngLatBounds } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { MapProps, MapMarker, Cluster } from '@/types/map';
import MarkerComponent from './map-marker';

export default function MapComponent({ location, zoom, markers = [], clusters = [], onMarkerClick }: MapProps) {
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
        () => {
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

  const createClusterGeoJSON = (cluster: Cluster) => {
    return {
      type: "FeatureCollection" as const,
      features: cluster.buildings.map(building => ({
        type: "Feature" as const,
        properties: {
          id: building.id,
          address: building.address,
          build_year: building.build_year,
          area: building.area,
          building_type: building.building_type,
          cluster_id: cluster.id,
        },
        geometry: {
          type: "Point" as const,
          coordinates: [building.longitude, building.latitude],
        },
      })),
    }
  }

  const addClustersToMap = () => {
    if (!map.current || !mapInitialized) return;

    removeClustersFromMap();

    clusters.forEach(cluster => {
      const sourceId = `cluster-${cluster.id}`;
      const layerId = `cluster-${cluster.id}-layer`;
      
      if (!map.current!.getSource(sourceId)) {
        map.current!.addSource(sourceId, {
          type: 'geojson',
          data: createClusterGeoJSON(cluster),
        });

        map.current!.addLayer({
          id: layerId,
          type: "circle",
          source: sourceId,
          filter: ["!", ["has", "point_count"]],
          paint: {
            "circle-color": cluster.color || "#3b82f6",
            "circle-radius": ["interpolate", ["linear"], ["zoom"], 10, 3, 15, 5, 20, 8],
            "circle-stroke-width": 1,
            "circle-stroke-color": "#fff",
          },
        });
      }
    })
  }

  const addMarkersToMap = () => {
    if (!map.current || !mapInitialized) return;

    removeMarkersFromMap();

    markers.forEach(markerData => {
      const markerElement = createMarkerElement(markerData);

      const marker = new Marker({ element: markerElement })
        .setLngLat([markerData.longitude, markerData.latitude])
        .addTo(map.current!);

      markersRef.current.push(marker);
    });
  }

  const removeClustersFromMap = () => {
    if (!map.current) return

    clusters.forEach((cluster) => {
      const sourceId = `cluster-${cluster.id}`
      const layerId = `cluster-${cluster.id}-layer`

      if (map.current!.getLayer(layerId)) map.current!.removeLayer(layerId)
      if (map.current!.getSource(sourceId)) map.current!.removeSource(sourceId)
    })
  }

  const removeMarkersFromMap = () => {
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];
  }

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
      removeClustersFromMap();
      removeMarkersFromMap();
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
  }, [location, zoom, mapInitialized]);

  function calculateClusterBounds(clusters: Cluster[]) {
    if (!clusters || clusters.length === 0) return;
    
    const bounds = new LngLatBounds();

    clusters.forEach(cluster => {
      cluster.buildings.forEach(building => {
        bounds.extend([building.longitude, building.latitude]);
      });
    });

    map.current!.fitBounds(bounds, {
      padding: 50,
      duration: 2000,
      maxZoom: 16,
      minZoom: 12,
    });
  }

  function calculateMarkerBounds(markers: MapMarker[]) {
    if (!markers || markers.length === 0) return;

    const bounds = new LngLatBounds();

    markers.forEach(marker => {
      bounds.extend([marker.longitude, marker.latitude]);
    });

    map.current!.fitBounds(bounds, {
      padding: 50,
      duration: 2000,
      maxZoom: 16,
      minZoom: 12,
    });
  }

  useEffect(() => {
    if (mapInitialized) {
      addMarkersToMap();

      if (!location) {
        calculateMarkerBounds(markers);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [markers, mapInitialized]);

  useEffect(() => {
    if (mapInitialized) {
      addClustersToMap();
      calculateClusterBounds(clusters);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clusters, mapInitialized]);

  return (
    <div ref={mapContainer} className='h-full w-full' />
  )
}