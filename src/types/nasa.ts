export interface ApodData {
  copyright?: string;
  date: string;
  explanation: string;
  hdurl?: string;
  media_type: 'image' | 'video';
  service_version: string;
  title: string;
  url: string;
}

export interface NeoEstimatedDiameter {
  estimated_diameter_min: number;
  estimated_diameter_max: number;
}

export interface NeoObject {
  id: string;
  name: string;
  nasa_jpl_url: string;
  absolute_magnitude_h: number;
  is_potentially_hazardous_asteroid: boolean;
  estimated_diameter: {
    kilometers: NeoEstimatedDiameter;
    meters: NeoEstimatedDiameter;
  };
  close_approach_data: Array<{
    close_approach_date: string;
    close_approach_date_full: string;
    relative_velocity: {
      kilometers_per_hour: string;
      kilometers_per_second: string;
    };
    miss_distance: {
      astronomical: string;
      kilometers: string;
      lunar: string;
    };
    orbiting_body: string;
  }>;
}

export interface NeoFeedResponse {
  element_count: number;
  near_earth_objects: {
    [date: string]: NeoObject[];
  };
}

export interface FavoriteItem {
  id: string;
  type: 'apod' | 'neo';
  data: ApodData | NeoObject;
  savedAt: string;
}
