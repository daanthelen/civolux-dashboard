'use client';

import { useState } from "react";
import MapComponent from "@/components/map";
import { Cluster } from "@/types/map";
import { Button } from "@/components/ui/button";
import { ColorPaletteGenerator } from "@/utils/color";

export default function ClusterPage() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [clusters, setClusters] = useState<Cluster[]>([]);
  const colorPaletteGenerator = new ColorPaletteGenerator();

  const displayClusters = async () => {
    if (isLoading) return;

    setIsLoading(true);

    try {
      const response = await fetch('/api/analysis/clusters');

      const clusterResponse: Cluster[] = await response.json();

      if (clusterResponse && clusterResponse.length != 0) {
        clusterResponse.forEach(cluster => {
          cluster.color = colorPaletteGenerator.getColor(cluster.id).toHslString();
        });
      }

      setClusters(clusterResponse);
    }
    catch (error) {
      console.error(error);
    }
    finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      <Button type='submit' onClick={displayClusters} className="border-2 border-black border-solid">Display Clusters</Button>

      <div className="h-[600px] w-[1000px]">
        <MapComponent clusters={clusters} />
      </div>
    </div>
  )
}