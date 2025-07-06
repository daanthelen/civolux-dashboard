export interface TwinBuilding {
  id: string;
  longitude: number;
  latitude: number;
  address: string;
  build_year: number;
  area: number;
  building_type: string;
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
  onMarkerClick?: (marker: MapMarker) => void;
}