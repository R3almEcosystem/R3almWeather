// src/hooks/useWeather.ts
import { useState, useEffect } from 'react';
import { getCurrentWeatherByCoords, getForecastByCoords } from '../services/weatherApi';

interface WeatherData {
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

interface DailyData {
  date: string;
  dayName: string;
  high: number;
  low: number;
  description: string;
  weatherCode: string;
}

interface HourlyData {
  time: string;
  temperature: number;
  description: string;
  weatherCode: string;
  precipitation: number;
  pressure: number;
  windSpeed: number;
  clouds: number;
  humidity: number;
}

export const useWeather = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<DailyData[]>([]);
  const [hourlyForecast, setHourlyForecast] = useState<{ [key: string]: HourlyData[] }>({});
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchLocation = async (query: string) => {
    setLoading(true);
    setError(null);

    try {
      // Accept both "lat,lon" and city name
      let lat: number, lon: number;

      if (query.includes(',')) {
        [lat, lon] = query.split(',').map(Number);
      } else {
        // Optional: use geocoding API if you prefer
        throw new Error('City search not implemented yet');
      }

      const [current, forecastData] = await Promise.all([
        getCurrentWeatherByCoords(lat, lon),
        getForecastByCoords(lat, lon)
      ]);

      // Current weather
      setWeather({
        temperature: Math.round(current.main.temp),
        feelsLike: Math.round(current.main.feels_like),
        description: current.weather[0].description,
        humidity: current.main.humidity,
        windSpeed: current.wind.speed,
        visibility: current.visibility,
        pressure: current.main.pressure,
        weatherCode: current.weather[0].icon,
        location: current.name,
        country: current.sys.country
      });

      // Build daily & hourly forecast
      const dailyMap: { [key: string]: DailyData } = {};
      const hourlyMap: { [key: string]: HourlyData[] } = {};

      forecastData.list.forEach((item: any) => {
        const dt = new Date(item.dt * 1000);
        const dateKey = dt.toDateString();
        const timeStr = dt.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });

        // Hourly
        const hourlyEntry: HourlyData = {
          time: timeStr,
          temperature: item.main.temp,
          description: item.weather[0].description,
          weatherCode: item.weather[0].icon,
          precipitation: Math.round((item.pop || 0) * 100),
          pressure: item.main.pressure,
          windSpeed: Math.round(item.wind.speed * 10) / 10,
          clouds: item.clouds.all,
          humidity: item.main.humidity
        };

        if (!hourlyMap[dateKey]) hourlyMap[dateKey] = [];
        hourlyMap[dateKey].push(hourlyEntry);

        // Daily aggregation
        if (!dailyMap[dateKey]) {
          dailyMap[dateKey] = {
            date: dateKey,
            dayName: dt.toLocaleDateString('en-US', { weekday: 'long' }),
            high: item.main.temp_max,
            low: item.main.temp_min,
            description: item.weather[0].description,
            weatherCode: item.weather[0].icon
          };
        } else {
          dailyMap[dateKey].high = Math.max(dailyMap[dateKey].high, item.main.temp_max);
          dailyMap[dateKey].low = Math.min(dailyMap[dateKey].low, item.main.temp_min);
        }
      });

      const dailyArray = Object.values(dailyMap).slice(0, 7).map(d => ({
        ...d,
        high: Math.round(d.high),
        low: Math.round(d.low)
      }));

      setForecast(dailyArray);
      setHourlyForecast(hourlyMap);
      setAlerts(forecastData.alerts || []);

    } catch (err: any) {
      setError(err.message || 'Failed to fetch weather data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return {
    weather,
    forecast,
    hourlyForecast,
    alerts,
    loading,
    error,
    searchLocation
  };
};