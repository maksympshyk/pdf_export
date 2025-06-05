// Directory: /src/types/index.ts

export interface CheckboxItem {
  id: string;
  label: string;
  checkedColumns: boolean;
  checkedBullets: boolean;
  inColumns: boolean;
  inBullets: boolean;
}

export interface Overview {
  hq_detail: string | null;
  // founding_year: string | null;
  AUM_detail: string | null;
  client_detail: string | null;
  location_detail: string | null;
}

export interface Location {
  lat: number;
  long: number;
  country: string;
}

export interface CompanyRow {
  company: string;
  headquarter: string;
  headquarter_detail: string;
  year_founded: string;
  aum: string;
  customOverview: string;
  locations: Location[];
  midLat: number;
  midLng: number;
  zoom: number;
}

export type HAlign = 'left' | 'center' | 'right';