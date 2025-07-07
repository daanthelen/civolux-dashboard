'use client';

import { useState, useEffect } from "react";
import MapComponent from "@/components/map";
import { Button } from "@/components/ui/button";
import { Building, Location, MapMarker, Address } from "@/types/map";
import { escapeCsvValue } from "@/utils/csvUtils";
import { AddressInput } from "@/components/address-input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download } from "lucide-react";
import { TwinBuildingList } from "@/components/twin-building-list";

export default function TwinBuildingPage() {
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [referenceBuilding, setReferenceBuilding] = useState<Building | null>(null);
  const [twinBuildings, setTwinBuildings] = useState<Building[]>([])
  const [markers, setMarkers] = useState<MapMarker[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentLocation, setCurrentLocation] = useState<Location | undefined>(undefined);

  const findTwinBuildings = async () => {
    if (isLoading || !selectedAddress) return;

    setIsLoading(true);

    try {
      const response = await fetch('/api/analysis/twin-buildings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          street: selectedAddress.street,
          house_number: selectedAddress.house_number,
          house_number_addition: selectedAddress.house_number_addition,
        }),
      });

      const buildings = await response.json();
      setTwinBuildings(buildings.twin_buildings);
      setReferenceBuilding(buildings.reference_building);
    }
    catch (error) {
      console.error(error);
    }
    finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (!referenceBuilding) {
      setMarkers([]);
      return;
    }

    const newMarkers: MapMarker[] = [];

    const marker: MapMarker = {
      id: referenceBuilding.id,
      longitude: referenceBuilding.longitude,
      latitude: referenceBuilding.latitude,
      color: '#ca3728',
      address: referenceBuilding.address,
      buildYear: referenceBuilding.build_year,
      area: referenceBuilding.area,
    }

    newMarkers.push(marker);

    twinBuildings.forEach(twinBuilding => {
      const marker: MapMarker = {
        id: twinBuilding.id,
        longitude: twinBuilding.longitude,
        latitude: twinBuilding.latitude,
        color: '#329dd7',
        address: twinBuilding.address,
        buildYear: twinBuilding.build_year,
        area: twinBuilding.area,
      }

      newMarkers.push(marker);
    });

    setMarkers(newMarkers);
    setCurrentLocation({
      longitude: referenceBuilding.longitude,
      latitude: referenceBuilding.latitude,
    });
  }, [referenceBuilding, twinBuildings]);

  useEffect(() => {
    console.log(twinBuildings);
  }, [twinBuildings]);

  const handleMarkerClick = (marker: MapMarker) => {
    setCurrentLocation({
      longitude: marker.longitude,
      latitude: marker.latitude,
    });
  }

  const exportToCsv = async () => {
    if (!referenceBuilding) return;

    const headers = Object.keys(referenceBuilding) as (keyof Building)[];
    const headerRow = ['twin_type', ...headers].join(',');

    const referenceBuildingString = [escapeCsvValue("\"reference_building\""), ...headers.map(header => escapeCsvValue(referenceBuilding[header]))].join(',');
    const twinBuildingsString = twinBuildings.map(twinBuilding => {
      return [escapeCsvValue("\"twin_building\""), ...headers.map(header => escapeCsvValue(twinBuilding[header]))].join(',');
    });

    const csvString = [headerRow, referenceBuildingString, ...twinBuildingsString].join('\n');

    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `twin_buildings_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex h-full gap-4">
      <div className="w-fit shrink-1 bg-white border-r rounded-xl border-gray-200 flex flex-col">
        <Card className="m-4">
          <CardHeader>
            <CardTitle className="text-lg">Adres Zoeken</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <AddressInput onSelect={setSelectedAddress} />
            <Button onClick={findTwinBuildings} disabled={!selectedAddress} className="w-full cursor-pointer">Selecteer Adres</Button>
          </CardContent>
        </Card>

        <Card className="m-4 flex-1 flex flex-col">
          <CardHeader>
            <CardTitle className="text-lg">Gevonden Twin Buildings ({twinBuildings?.length || 0})</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col">
            <div className="flex-1">
              <TwinBuildingList twinBuildings={twinBuildings} />
            </div>
            <Button
              onClick={exportToCsv}
              disabled={twinBuildings?.length === 0}
              className="w-full mt-4 bg-transparent cursor-pointer"
              variant="outline"
            >
              <Download className="h-4 w-4 mr-2" />
              Export Naar CSV
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="h-full w-6xl shrink-1">
        <CardContent className="h-full">
          <MapComponent
            location={currentLocation}
            markers={markers}
            onMarkerClick={handleMarkerClick}
          />
        </CardContent>
      </Card>
    </div>
  )
}