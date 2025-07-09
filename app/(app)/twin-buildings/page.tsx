'use client';

import { useState, useEffect } from "react";
import MapComponent from "@/components/map/map";
import { Button } from "@/components/ui/button";
import { Building, Location, MapMarker, Address, GeoJsonFeatureCollection } from "@/types/map";
import { convertToGeoJsonPointFeature, escapeCsvValue } from "@/utils/exportUtils";
import { AddressInput } from "@/components/twin-buildings/address-input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Download } from "lucide-react";
import { TwinBuildingList } from "@/components/twin-buildings/twin-building-list";
import { calculateEuclideanDistance } from "@/utils/distance";

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
      setReferenceBuilding(buildings.reference_building);
      
      // Sorteer op afstand - oplopend
      buildings.twin_buildings.sort((a: Building, b: Building) => {
        const referenceLocation = { longitude: buildings.reference_building.longitude, latitude: buildings.reference_building.latitude};
        const distA = calculateEuclideanDistance(referenceLocation, { longitude: a.longitude, latitude: a.latitude });
        const distB = calculateEuclideanDistance(referenceLocation, { longitude: b.longitude, latitude: b.latitude });
        return distA - distB;
      });
      
      setTwinBuildings(buildings.twin_buildings);
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

  const handleTwinBuildingClick = (twinBuilding: Building) => {
    setCurrentLocation({
      longitude: twinBuilding.longitude,
      latitude: twinBuilding.latitude,
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
    downloadExport(csvString, 'csv');
  }

  const exportToGeoJson = async () => {
    if (!referenceBuilding) return;

    const referenceBuildingFeatures = convertToGeoJsonPointFeature([referenceBuilding], 'reference_building');
    const twinBuildingsFeatures = convertToGeoJsonPointFeature(twinBuildings, 'twin_building');
    const geoJsonCollection: GeoJsonFeatureCollection = {
      type: 'FeatureCollection',
      features: [...referenceBuildingFeatures.features, ...twinBuildingsFeatures.features]
    };

    const jsonString = JSON.stringify(geoJsonCollection, null, 2);
    downloadExport(jsonString, 'geojson');
  }

  const downloadExport = async (content: string, fileType: 'csv' | 'geojson') => {
    const mimeType = fileType == 'csv' ? 'text/csv' : 'application/geo+json';

    const blob = new Blob([content], { type: `${mimeType};charset=utf-8;` });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `twin_buildings_${new Date().toISOString().split('T')[0]}.${fileType}`)
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex gap-4 h-full max-w-full">
      <div className="w-96 max-h-screen shrink-1 bg-white border-r rounded-xl border-gray-200 flex flex-col">
        <h1 className="ml-6 mt-6 mb-2 text-xl 2xl:text-2xl font-bold">Twinbuildings</h1>
        <Card className="m-4">
          <CardHeader>
            <CardTitle className="text-base 2xl:text-lg">Adres Zoeken</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <AddressInput onSelect={setSelectedAddress} />
            <Button onClick={findTwinBuildings} disabled={!selectedAddress} className="w-full cursor-pointer text-xs 2xl:text-sm">Selecteer Adres</Button>
          </CardContent>
        </Card>

        <Card className="m-4 flex-1 flex flex-col overflow-auto">
          <CardHeader>
            <CardTitle className="text-base 2xl:text-lg">Gevonden Twin Buildings ({twinBuildings?.length || 0})</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 min-h-20">
            <TwinBuildingList
              twinBuildings={twinBuildings}
              onTwinBuildingClick={handleTwinBuildingClick}
            />
          </CardContent>
          <CardFooter className="flex flex-col">
            <Button
              onClick={exportToCsv}
              disabled={twinBuildings?.length === 0}
              className="w-full mt-4 bg-transparent cursor-pointer text-xs 2xl:text-sm"
              variant="outline"
            >
              <Download className="h-4 w-4 mr-2" />
              Export Naar CSV
            </Button>
            <Button
              onClick={exportToGeoJson}
              disabled={twinBuildings?.length === 0}
              className="w-full mt-4 bg-transparent cursor-pointer text-xs 2xl:text-sm"
              variant="outline"
            >
              <Download className="h-4 w-4 mr-2" />
              Export Naar GeoJSON
            </Button>
          </CardFooter>
        </Card>
      </div>

      <Card className="h-full w-4xl 2xl:w-6xl">
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