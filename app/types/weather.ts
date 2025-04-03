export interface WeatherData {
  city: string;
  temperature: number;
  humidity: number;
  conditions: string;
  icon: string;
  timestamp: number;
}

export interface WeatherHistory {
  city: string;
  data: {
    temperature: number;
    timestamp: number;
  }[];
}

export interface City {
  id: string;
  name: string;
  isFavorite: boolean;
}

export interface WeatherAlert {
  id: string;
  type: 'weather_alert';
  city: string;
  message: string;
  severity: 'info' | 'warning' | 'danger';
  timestamp: number;
}