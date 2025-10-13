import { useState, useCallback } from 'react';
import {
  getCurrentWeather,
  getCurrentWeatherByCoords,
  getForecast,
  getForecastByCoords,
  getWeatherAlerts,
  type WeatherResponse,
  type ForecastResponse,
  type WeatherAlert
} from '../services/weatherApi';

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
}

interface ForecastDay {
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
  const [forecast, setForecast] = useState<ForecastDay[]>([]);
  const [hourlyForecast, setHourlyForecast] = useState<{ [key: string]: HourlyData[] }>({});
  const [alerts, setAlerts] = useState<WeatherAlert[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const transformWeatherData = (data: WeatherResponse): WeatherData => ({
    location: data.name,
    country: data.sys.country,
    temperature: data.main.temp,
    feelsLike: data.main.feels_like,
    description: data.weather[0].description,
    humidity: data.main.humidity,
    windSpeed: data.wind.speed,
    visibility: data.visibility,
    pressure: data.main.pressure,
    weatherCode: data.weather[0].icon,
  });

  const transformForecastData = (data: ForecastResponse): ForecastDay[] => {
    const dailyData: { [key: string]: any } = {};

    data.list.forEach(item => {
      const date = new Date(item.dt * 1000);
      const dateKey = date.toDateString();

      if (!dailyData[dateKey]) {
        dailyData[dateKey] = {
          date: dateKey,
          dayName: date.toLocaleDateString('en-US', { weekday: 'long' }),
          high: item.main.temp_max,
          low: item.main.temp_min,
          description: item.weather[0].description,
          weatherCode: item.weather[0].icon,
        };
      } else {
        dailyData[dateKey].high = Math.max(dailyData[dateKey].high, item.main.temp_max);
        dailyData[dateKey].low = Math.min(dailyData[dateKey].low, item.main.temp_min);
      }
    });

    return Object.values(dailyData).slice(1, 6); // Skip today, get next 5 days
  };

  const transformHourlyData = (data: ForecastResponse): { [key: string]: HourlyData[] } => {
    const hourlyByDay: { [key: string]: HourlyData[] } = {};
    const now = new Date();
    const currentHour = now.getHours();
    const todayKey = now.toDateString();

    data.list.forEach(item => {
      const date = new Date(item.dt * 1000);
      const dateKey = date.toDateString();
      const hour = date.getHours();

      const isToday = dateKey === todayKey;
      const isFutureDay = date > now && !isToday;

      if (isToday && hour < currentHour) {
        return;
      }

      if (isToday && hour <= 23) {
        if (!hourlyByDay[dateKey]) {
          hourlyByDay[dateKey] = [];
        }

        hourlyByDay[dateKey].push({
          time: date.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true }),
          temperature: item.main.temp_max,
          description: item.weather[0].description,
          weatherCode: item.weather[0].icon,
          precipitation: Math.round((item.pop || 0) * 100),
          pressure: item.main.pressure,
          windSpeed: item.wind.speed,
          clouds: item.clouds.all,
          humidity: item.main.humidity
        });
      } else if (isFutureDay && hour >= 0 && hour <= 23) {
        if (!hourlyByDay[dateKey]) {
          hourlyByDay[dateKey] = [];
        }

        hourlyByDay[dateKey].push({
          time: date.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true }),
          temperature: item.main.temp_max,
          description: item.weather[0].description,
          weatherCode: item.weather[0].icon,
          precipitation: Math.round((item.pop || 0) * 100),
          pressure: item.main.pressure,
          windSpeed: item.wind.speed,
          clouds: item.clouds.all,
          humidity: item.main.humidity
        });
      }
    });

    return hourlyByDay;
  };

  const fetchWeatherByLocation = useCallback(async (location: string) => {
    setLoading(true);
    setError(null);

    try {
      const coordsMatch = location.match(/^(-?\d+\.?\d*),(-?\d+\.?\d*)$/);

      const [weatherData, forecastData, alertsData] = await Promise.all([
        coordsMatch
          ? getCurrentWeatherByCoords(parseFloat(coordsMatch[1]), parseFloat(coordsMatch[2]))
          : getCurrentWeather(location),
        coordsMatch
          ? getForecastByCoords(parseFloat(coordsMatch[1]), parseFloat(coordsMatch[2]))
          : getForecast(location),
        coordsMatch
          ? getWeatherAlerts(parseFloat(coordsMatch[1]), parseFloat(coordsMatch[2]))
          : []
      ]);

      setWeather(transformWeatherData(weatherData));
      setForecast(transformForecastData(forecastData));
      setHourlyForecast(transformHourlyData(forecastData));
      setAlerts(alertsData);
    } catch (err) {
      console.error('Weather API Error:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchWeatherByCoords = useCallback(async (lat: number, lon: number) => {
    setLoading(true);
    setError(null);

    try {
      const [weatherData, forecastData, alertsData] = await Promise.all([
        getCurrentWeatherByCoords(lat, lon),
        getForecastByCoords(lat, lon),
        getWeatherAlerts(lat, lon)
      ]);

      setWeather(transformWeatherData(weatherData));
      setForecast(transformForecastData(forecastData));
      setHourlyForecast(transformHourlyData(forecastData));
      setAlerts(alertsData);
    } catch (err) {
      console.error('Weather API Error:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  }, []);

  const getCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser');
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        fetchWeatherByCoords(position.coords.latitude, position.coords.longitude);
      },
      (error) => {
        console.error('Geolocation Error:', error);
        setError('Unable to get your location');
        setLoading(false);
      }
    );
  }, [fetchWeatherByCoords]);


  return {
    weather,
    forecast,
    hourlyForecast,
    alerts,
    loading,
    error,
    searchLocation: fetchWeatherByLocation,
    getCurrentLocation,
  };
};