import { Building, GeoJsonFeatureCollection, GeoJsonPointFeature } from "@/types/map";

export function escapeCsvValue(value: number | string): string {
  if (value === null || value === undefined) {
    return '';
  }

  // Getallen krijgen geen extra quotes
  if (typeof value === 'number') {
    return String(value);
  }

  let stringValue = String(value);

  stringValue = stringValue.replace(/"/g, '""');

  // Tekstwaarden krijgen extra quotes
  return `"${stringValue}"`;
}

export function convertToGeoJsonPointFeature(buildings: Building[], twin_type: string): GeoJsonFeatureCollection {
  const features: GeoJsonPointFeature[] = buildings.map(building => {
    const { longitude, latitude, ...properties } = building;

    return {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [longitude, latitude]
      },
      properties: {
        twin_type: twin_type,
        building_props: properties
      }
    }
  });

  return {
    type: 'FeatureCollection',
    features: features
  }
}