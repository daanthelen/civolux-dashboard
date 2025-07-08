'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import MapComponent from "@/components/map";
import { useEffect, useState } from 'react';
import { Demolition, MapMarker } from '@/types/map';
import { Button } from '@/components/ui/button';
import { DemolitionList } from '@/components/demolition-list';

export default function DemolitionPage() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [demolitions, setDemolitions] = useState<Demolition[]>([]);
  const [markers, setMarkers] = useState<MapMarker[]>([]);

  const getDemolitions = async () => {
    if (isLoading) return;

    setIsLoading(true);
    
    try {
      const response = await fetch('/api/analysis/demolitions');

      const demolitionResponse: Demolition[] = await response.json();
      
      setDemolitions(demolitionResponse.slice(0, 1000));
    }
    catch (error) {
      console.error(error);
    }
    finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (!demolitions || demolitions.length === 0) {
      setMarkers([]);
      return;
    }

    const newMarkers: MapMarker[] = [];

    demolitions.forEach(demolition => {
      const marker: MapMarker = {
        id: demolition.id,
        longitude: demolition.longitude,
        latitude: demolition.latitude,
        address: demolition.address,
        materials: demolition.materials,
      }

      newMarkers.push(marker);
    });

    setMarkers(newMarkers);
  }, [demolitions]);

  return (
    <div className="flex h-full gap-4">
      <div className="w-96 shrink-1 bg-white border-r rounded-xl border-gray-200 flex flex-col">
        <h1 className="m-6 text-2xl font-bold">Sloopprojecten</h1>
        <Button
          onClick={getDemolitions}
          disabled={isLoading}
          className="w-auto m-4 cursor-pointer"
        >
          Haal sloopprojecten op
        </Button>
        <Card className="m-4 flex-1 flex flex-col overflow-auto">
          <CardHeader>
            <CardTitle className="text-lg">Sloopprojecten ({demolitions?.length || 0})</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col">
            <div className="flex-1">
              <DemolitionList demolitions={demolitions} />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="h-full w-6xl shrink-1">
        <CardContent className="h-full">
          <MapComponent markers={markers} />
        </CardContent>
      </Card>
    </div>
  )
}