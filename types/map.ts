export interface Building {
  id: string;
  longitude: number;
  latitude: number;
  address: string;
  build_year: number;
  area: number;
  building_type: string;
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
}

export interface MapProps {
  location?: Location;
  zoom?: number;
  markers?: MapMarker[];
  clusters?: Cluster[];
  onMarkerClick?: (marker: MapMarker) => void;
}