'use client';

import { useState, useEffect } from "react";
import MapComponent, { MapMarker } from "@/components/map";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface TwinBuilding {
  id: string;
  longitude: number;
  latitude: number;
  build_year: number;
  area: number;
  building_type: string;
}

export default function TwinBuildingPage() {
  const [street, setStreet] = useState<string>('');
  const [houseNumber, setHouseNumber] = useState<number | null>(null);
  const [houseNumberAddition, setHouseNumberAddition] = useState<string>('');
  const [referenceBuilding, setReferenceBuilding] = useState<TwinBuilding | null>(null);
  const [twinBuildings, setTwinBuildings] = useState<TwinBuilding[]>([])
  const [markers, setMarkers] = useState<MapMarker[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

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
    }

    newMarkers.push(marker);

    twinBuildings.forEach(twinBuilding => {
      const marker: MapMarker = {
        id: twinBuilding.id,
        longitude: twinBuilding.longitude,
        latitude: twinBuilding.latitude,
        color: '#329dd7',
      }

      newMarkers.push(marker);
    });

    setMarkers(newMarkers);
  }, [referenceBuilding, twinBuildings]);

  return (
    <div>
      <Label htmlFor="street">Street:</Label>
      <Input id="street" type='text' value={street} onChange={e => setStreet(e.target.value)} required />

      <Label htmlFor="houseNumber">House Number:</Label>
      <Input id="houseNumber" type='number' value={String(houseNumber)} onChange={e => setHouseNumber(parseInt(e.target.value))} required />

      <Label htmlFor="houseNumberAddition">House Number Addition:</Label>
      <Input id="houseNumberAddition" type='text' value={houseNumberAddition} onChange={e => setHouseNumberAddition(e.target.value)} />

      <Button type='submit' onClick={findTwinBuildings} className="border-2 border-black border-solid" >Predict</Button>

      <div className="h-[600px] w-[1000px]">
        <MapComponent
          longitude={referenceBuilding?.longitude}
          latitude={referenceBuilding?.latitude}
          markers={markers}
        />
      </div>
    </div>
  )
}