export interface Building {
  id: string;
  longitude: number;
  latitude: number;
  address: string;
  build_year: number;
  area: number;
  building_type: string;
}

export interface Demolition extends Building {
  age: number;
  relative_age: number;
  predicted_lifespan: number;
  area_ratio: number;
  prediction: boolean;
  demolition_probability: number;
  materials?: Material[];
}

export interface Material {
  name: string;
  quantity: number;
}

export interface Address {
  street: string;
  house_number: number;
  house_number_addition?: string;
}

export interface Cluster {
  id: number;
  buildings: Building[];
  color?: string;
  average_age?: number;
}

export interface Location {
  longitude: number;
  latitude: number;
}

export interface MapMarker {
  id: string;
  longitude: number;
  latitude: number;
  color?: string;
  address?: string;
  buildYear?: number;
  area?: number;
  materials?: Material[]
}

export interface MapProps {
  location?: Location;
  zoom?: number;
  markers?: MapMarker[];
  clusters?: Cluster[];
  onMarkerClick?: (marker: MapMarker) => void;
}

export interface GeoJsonPointFeature {
  type: 'Feature';
  geometry: {
    type: 'Point';
    coordinates: [number, number];
  };
  properties: {
    twin_type: string;
    building_props: Omit<Building, 'longitude' | 'latitude'>;
  }
}

export interface GeoJsonFeatureCollection {
  type: 'FeatureCollection';
  features: GeoJsonPointFeature[];
}