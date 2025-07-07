'use client';

import { useState, useEffect } from "react";
import MapComponent from "@/components/map";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Building, Location, MapMarker } from "@/types/map";
import { escapeCsvValue } from "@/utils/csvUtils";

export default function TwinBuildingPage() {
  const [street, setStreet] = useState<string>('');
  const [houseNumber, setHouseNumber] = useState<number | null>(null);
  const [houseNumberAddition, setHouseNumberAddition] = useState<string>('');
  const [referenceBuilding, setReferenceBuilding] = useState<Building | null>(null);
  const [twinBuildings, setTwinBuildings] = useState<Building[]>([])
  const [markers, setMarkers] = useState<MapMarker[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentLocation, setCurrentLocation] = useState<Location | undefined>(undefined);

  const findTwinBuildings = async () => {
    if (isLoading) return;

    setIsLoading(true);

    try {
      const response = await fetch('/api/analysis/twin-buildings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          street: street,
          house_number: houseNumber,
          house_number_addition: houseNumberAddition,
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
    <div>
      <Label htmlFor="street">Street:</Label>
      <Input id="street" type='text' value={street} onChange={e => setStreet(e.target.value)} required />

      <Label htmlFor="houseNumber">House Number:</Label>
      <Input id="houseNumber" type='number' value={String(houseNumber)} onChange={e => setHouseNumber(parseInt(e.target.value))} required />

      <Label htmlFor="houseNumberAddition">House Number Addition:</Label>
      <Input id="houseNumberAddition" type='text' value={houseNumberAddition} onChange={e => setHouseNumberAddition(e.target.value)} />

      <Button type='submit' onClick={findTwinBuildings} className="border-2 border-black border-solid">Predict</Button>

      <Button onClick={exportToCsv} className="border-2 border-black border-solid">Export</Button>

      <div className="h-[600px] w-[1000px]">
        <MapComponent
          location={currentLocation}
          markers={markers}
          onMarkerClick={handleMarkerClick}
        />
      </div>
    </div>
  )
}