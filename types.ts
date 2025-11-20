export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface Recommendation {
  title: string;
  uri: string;
  address?: string;
}

export interface SearchOptions {
  time: string;
  style: string;
}
