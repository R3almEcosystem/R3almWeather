// src/hooks/useWeather.ts
import { useState, useCallback } from 'react';
import {
  getCurrentWeather,
  getCurrentWeatherByCoords,
  getForecast,
  getForecastByCoords,
  type WeatherResponse,
  type ForecastResponse,
} from '../services/weatherApi';
import { getDemoLocationById } from '../utils/demoData';

interface WeatherData {
  location: string;
  country: string;
  temperature: number;
  feelsLike: number;
  description: string;
  humidity: number;
  windSpeed: number;
  visibility: number;
  pressure: number;
  weatherCode: string;
  icon: string;
}

interface ForecastDay {
  date: string;
  dayName: string;
  high: number;
  low: number;
  description: string;
  weatherCode: string;
  icon: string;
}

interface HourlyData {
  time: string;
  temp: number;
  description: string;
  icon: string;
  precipitation: number;
  pressure: number;
  windSpeed: number;
  clouds: number;
  humidity: number;
}

const useWeather = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastDay[]>([]);
  const [hourlyForecast, setHourlyForecast] = useState<{ [key: string]: HourlyData[] }>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const transformWeatherData = (data: WeatherResponse): WeatherData => ({
    location: data.name,
    country: data.sys.country,
    temperature: Math.round(data.main.temp),
    feelsLike: Math.round(data.main.feels_like),
    description: data.weather[0].description,
    humidity: data.main.humidity,
    windSpeed: data.wind.speed,
    visibility: data.visibility ? data.visibility / 1000 : 10,
    pressure: data.main.pressure,
    weatherCode: data.weather[0].id.toString(),
    icon: data.weather[0].icon,
  });

  const transformForecastData = (data: ForecastResponse): ForecastDay[] => {
    const dailyMap = new Map<string, ForecastDay>();

    data.list.forEach(item => {
      const date = new Date(item.dt * 1000);
      const dateKey = date.toISOString().split('T')[0];

      if (!dailyMap.has(dateKey)) {
        dailyMap.set(dateKey, {
          date: dateKey,
          dayName: date.toLocaleDateString('en-US', { weekday: 'long' }),
          high: item.main.temp_max,
          low: item.main.temp_min,
          description: item.weather[0].description,
          weatherCode: item.weather[0].id.toString(),
          icon: item.weather[0].icon,
        });
      } else {
        const day = dailyMap.get(dateKey)!;
        day.high = Math.max(day.high, item.main.temp_max);
        day.low = Math.min(day.low, item.main.temp_min);
      }
    });

    const result = Array.from(dailyMap.values());
    return result.slice(1, 6).map(day => ({
      ...day,
      high: Math.round(day.high),
      low: Math.round(day.low),
    }));
  };

  const transformHourlyData = (data: ForecastResponse): { [key: string]: HourlyData[] } => {
    const hourlyByDay: { [key: string]: HourlyData[] } = {};
    const now = new Date();
    const todayKey = now.toISOString().split('T')[0];

    data.list.slice(0, 40).forEach(item => {
      const dt = new Date(item.dt * 1000);
      const dateKey = dt.toISOString().split('T')[0];
      const hourStr = dt.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });

      if (dateKey === todayKey && dt < now) return;

      if (!hourlyByDay[dateKey]) hourlyByDay[dateKey] = [];

      hourlyByDay[dateKey].push({
        time: hourStr,
        temp: Math.round(item.main.temp),
        description: item.weather[0].description,
        icon: item.weather[0].icon,
        precipitation: Math.round((item.pop || 0) * 100),
        pressure: item.main.pressure,
        windSpeed: item.wind.speed,
        clouds: item.clouds.all,
        humidity: item.main.humidity,
      });
    });

    return hourlyByDay;
  };

  const fetchWeather = useCallback(async (location: string) => {
    setLoading(true);
    setError(null);

    try {
      const coordsMatch = location.match(/^(-?\d+\.?\d*),(-?\d+\.?\d*)$/);
      const lat = coordsMatch ? parseFloat(coordsMatch[1]) : null;
      const lon = coordsMatch ? parseFloat(coordsMatch[2]) : null;

      const [weatherData, forecastData] = await Promise.all([
        coordsMatch
          ? getCurrentWeatherByCoords(lat!, lon!)
          : getCurrentWeather(location),
        coordsMatch
          ? getForecastByCoords(lat!, lon!)
          : getForecast(location),
      ]);

      setWeather(transformWeatherData(weatherData));
      setForecast(transformForecastData(forecastData));
      setHourlyForecast(transformHourlyData(forecastData));
    } catch (err: any) {
      console.warn('Live API failed, falling back to demo data:', err.message);

      const demo = getDemoLocationById(location) || getDemoLocationById('tokyo');
      if (demo) {
        setWeather({
          location: demo.name,
          country: demo.country,
          temperature: 22,
          feelsLike: 24,
          description: 'Clear sky',
          humidity: 65,
          windSpeed: 3.5,
          visibility: 10,
          pressure: 1013,
          weatherCode: '800',
          icon: '01d',
        });
        setError('Using demo data (API unavailable)');
      } else {
        setError(err.message || 'Failed to fetch weather data');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const getCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation not supported');
      return;
    }

    setLoading(true);
    const timeout = setTimeout(() => {
      setError('Location request timed out');
      setLoading(false);
    }, 10000);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        clearTimeout(timeout);
        fetchWeather(`${pos.coords.latitude},${pos.coords.longitude}`);
      },
      (err) => {
        clearTimeout(timeout);
        setError('Location access denied');
        setLoading(false);
      },
      { timeout: 10000, maximumAge: 600000 }
    );
  }, [fetchWeather]);

  return {
    weather,
    forecast,
    hourlyForecast,
    loading,
    error,
    searchLocation: fetchWeather,
    getCurrentLocation,
  };
};

export default useWeather;