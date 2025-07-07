'use client';

import { useState, useEffect } from "react";
import MapComponent from "@/components/map";
import { Location, MapMarker, Cluster } from "@/types/map";
import { Button } from "@/components/ui/button";
import { ColorPaletteGenerator } from "@/lib/color";

export default function ClusterPage() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [clusters, setClusters] = useState<Cluster[]>([]);
  const [markers, setMarkers] = useState<MapMarker[]>([]);
  const [currentLocation, setCurrentLocation] = useState<Location | undefined>(undefined);
  const colorPaletteGenerator = new ColorPaletteGenerator();

  const displayClusters = async () => {
    if (isLoading) return;

    setIsLoading(true);

    try {
      const response = await fetch('/api/analysis/clusters');

      const clusterResponse = await response.json();
      setClusters(clusterResponse);
    }
    catch (error) {
      console.error(error);
    }
    finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (clusters.length === 0) {
      setMarkers([]);
      return;
    }

    const newMarkers: MapMarker[] = [];

    clusters.forEach(cluster => {
      const color = colorPaletteGenerator.getColor(cluster.id).toHslString();

      cluster.buildings.forEach(building => {
        const marker: MapMarker = {
          id: building.id,
          longitude: building.longitude,
          latitude: building.latitude,
          color: color,
          address: building.address,
          buildYear: building.build_year,
          area: building.area,
        }

        newMarkers.push(marker);
      });
    });

    setMarkers(newMarkers);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clusters]);

  return (
    <div>
      <Button type='submit' onClick={displayClusters} className="border-2 border-black border-solid">Display Clusters</Button>

      <div className="h-[600px] w-[1000px]">
        <MapComponent markers={markers} />
      </div>
    </div>
  )
}