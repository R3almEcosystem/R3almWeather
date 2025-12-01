import { useState, useEffect } from 'react';
import { getCurrentWeather, getForecastByCoords } from '../services/weatherApi';

export interface WeatherData {
  temperature: number;
  feelsLike: number;
  description: string;
  humidity: number;
  windSpeed: number;
  visibility: number;
  pressure: number;
  weatherCode: string;
  location: string;
  country: string;
}

export interface ForecastData {
  date: string;
  dayName: string;
  high: number;
  low: number;
  description: string;
  weatherCode: string;
}

export const useWeather = (lat?: number, lon?: number, locationId?: string) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!lat || !lon) {
      setLoading(false);
      return;
    }

    const fetchWeather = async () => {
      try {
        setLoading(true);
        setError(null);

        const [current, forecastData] = await Promise.all([
          getCurrentWeather(lat, lon),
          getForecastByCoords(lat, lon)
        ]);

        setWeather(current);
        setForecast(forecastData);
      } catch (err) {
        console.error('Weather fetch failed:', err);
        setError('Failed to load weather data');
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [lat, lon, locationId]);

  return { weather, forecast, loading, error };
};