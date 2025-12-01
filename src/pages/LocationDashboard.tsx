// src/pages/LocationDashboard.tsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getLocationById } from '../services/locationService';
import { getCurrentWeatherByCoords, getForecastByCoords } from '../services/weatherApi';
import WeatherCard from '../components/WeatherCard';
import DailyHourlyForecast from '../components/DailyHourlyForecast';
import LoadingSpinner from '../components/LoadingSpinner';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Location {
  id: string;
  name: string;
  country: string;
  description: string;
  lat: number;
  lon: number;
}

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

interface ForecastItem {
  date: string;
  dayName: string;
  high: number;
  low: number;
  description: string;
  weatherCode: string;
}

const LocationDashboard: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [location, setLocation] = useState<Location | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadLocation = async () => {
      if (!id) {
        setError('No location ID provided');
        setLoading(false);
        return;
      }

      try {
        const loc = await getLocationById(id);
        if (!loc) {
          setError('Location not found');
          setLoading(false);
          return;
        }

        setLocation(loc);

        // Fetch real weather data
        const [currentWeather, forecastData] = await Promise.all([
          getCurrentWeatherByCoords(loc.lat, loc.lon),
          getForecastByCoords(loc.lat, loc.lon)
        ]);

        // Transform current weather
        setWeather({
          temperature: Math.round(currentWeather.main.temp),
          feelsLike: Math.round(currentWeather.main.feels_like),
          description: currentWeather.weather[0].description,
          humidity: currentWeather.main.humidity,
          windSpeed: currentWeather.wind.speed,
          visibility: currentWeather.visibility / 1000,
          pressure: currentWeather.main.pressure,
          weatherCode: currentWeather.weather[0].icon,
          location: currentWeather.name,
          country: currentWeather.sys.country
        });

        // Transform forecast
        const daily: Record<string, ForecastItem> = {};

        forecastData.list.forEach((item: any) => {
          const date = new Date(item.dt * 1000);
          const dateKey = date.toDateString();

          if (!daily[dateKey]) {
            daily[dateKey] = {
              date: dateKey,
              dayName: date.toLocaleDateString('en-US', { weekday: 'long' }),
              high: -Infinity,
              low: Infinity,
              description: item.weather[0].description,
              weatherCode: item.weather[0].icon
            };
          }

          daily[dateKey].high = Math.max(daily[dateKey].high, item.main.temp_max);
          daily[dateKey].low = Math.min(daily[dateKey].low, item.main.temp_min);
        });

        setForecast(Object.values(daily).slice(0, 5).map(day => ({
          ...day,
          high: Math.round(day.high),
          low: Math.round(day.low)
        })));

      } catch (err) {
        console.error('Failed to load location data:', err);
        setError('Failed to load weather data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadLocation();
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-400 text-center p-8">{error}</div>;
  if (!location) return <div className="text-gray-400 text-center p-8">Location not found</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </Link>

        <h1 className="text-4xl font-bold text-white mb-2">
          {location.name}, {location.country}
        </h1>
        <p className="text-white/70 mb-8">{location.description}</p>

        {weather && (
          <div className="mb-8">
            <WeatherCard weather={weather} />
          </div>
        )}

        {forecast.length > 0 && (
          <DailyHourlyForecast forecast={forecast} />
        )}
      </div>
    </div>
  );
};

export default LocationDashboard;