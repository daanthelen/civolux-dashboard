'use client';

import { useState } from "react";
import MapComponent from "@/components/map";
import { Cluster } from "@/types/map";
import { Button } from "@/components/ui/button";
import { ColorPaletteGenerator } from "@/utils/color";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClusterListPage } from "@/components/cluster-list";

export default function ClusterPage() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [clusters, setClusters] = useState<Cluster[]>([]);
  const colorPaletteGenerator = new ColorPaletteGenerator();

  const getClusters = async () => {
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

      clusterResponse.sort((a, b) => a.id - b.id);

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
    <div className="flex h-full gap-4">
      <div className="w-96 shrink-1 bg-white border-r rounded-xl border-gray-200 flex flex-col">
        <h1 className="m-6 text-2xl font-bold">Clusters</h1>
        <Button
          onClick={getClusters}
          disabled={isLoading}
          className="w-auto m-4 cursor-pointer"
        >
          Haal clusters op
        </Button>
        <Card className="m-4 flex-1 flex flex-col">
          <CardHeader>
            <CardTitle className="text-lg">Clusters ({clusters?.length || 0})</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col">
            <div className="flex-1">
              <ClusterListPage clusters={clusters} />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="h-full w-6xl shrink-1">
        <CardContent className="h-full">
          <MapComponent clusters={clusters} />
        </CardContent>
      </Card>
    </div>
  )
}