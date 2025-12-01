import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Settings, Search, Thermometer, CloudRain, Gauge, Wind, Cloud, Calendar } from 'lucide-react';
import { getLocationById } from '../services/locationService';
import type { Location } from '../lib/supabase';
import { useWeather } from '../hooks/useWeather';
import WeatherAlerts from '../components/WeatherAlerts';
import DailyHourlyForecast from '../components/DailyHourlyForecast';

const LocationDashboard: React.FC = () => {
  const { locationId } = useParams<{ locationId: string }>();
  const [unit, setUnit] = useState<'C' | 'F'>('C');
  const [activeMenu, setActiveMenu] = useState('home');
  const [activeSubMenu, setActiveSubMenu] = useState('temperature');
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState<Location | null>(null);
  const [locationLoading, setLocationLoading] = useState(true);

  const { weather, forecast, hourlyForecast, alerts, loading, error, searchLocation } = useWeather();

  // ONLY CHANGE: removed `searchLocation` from dependency array → infinite loop gone
  useEffect(() => {
    const loadLocation = async () => {
      if (!locationId) return;

      setLocationLoading(true);
      const loc = await getLocationById(locationId);
      setLocation(loc);
      setLocationLoading(false);

      if (loc) {
        const coordsString = `${loc.lat},${loc.lon}`;
        searchLocation(coordsString);
      }
    };

    loadLocation();
  }, [locationId]); // ← ONLY locationId now. No more loop.

  const toggleUnit = () => {
    setUnit(prev => prev === 'C' ? 'F' : 'C');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      searchLocation(searchQuery.trim());
      setSearchQuery('');
    }
  };

  const convertTemperature = (temp: number) => {
    return unit === 'F' ? Math.round((temp * 9/5) + 32) : Math.round(temp);
  };

  // Use real weather data or fallback to demo data
  const currentWeather = weather || {
    location: location?.name || 'Unknown',
    country: location?.country || 'Unknown',
    temperature: 22,
    feelsLike: 25,
    description: 'partly cloudy',
    humidity: 65,
    windSpeed: 3.2,
    visibility: 10000,
    pressure: 1013,
    weatherCode: '02d',
  };

  const currentForecast = forecast.length > 0 ? forecast : [
    { date: 'Today', dayName: 'Monday', high: 25, low: 18, description: 'partly cloudy', weatherCode: '02d' },
    { date: 'Tomorrow', dayName: 'Tuesday', high: 27, low: 20, description: 'sunny', weatherCode: '01d' },
    { date: 'Wednesday', dayName: 'Wednesday', high: 24, low: 17, description: 'light rain', weatherCode: '10d' },
    { date: 'Thursday', dayName: 'Thursday', high: 23, low: 16, description: 'cloudy', weatherCode: '04d' },
    { date: 'Friday', dayName: 'Friday', high: 26, low: 19, description: 'sunny', weatherCode: '01d' },
  ];

  // Main menu items
  const mainMenuItems = [
    { id: 'home', label: 'Home', icon: <Thermometer className="w-5 h-5" /> },
    { id: 'forecast', label: 'Daily Hourly Forecast', icon: <Calendar className="w-5 h-5" /> },
    { id: 'alerts', label: 'Weather Alerts', icon: <CloudRain className="w-5 h-5" /> },
    { id: 'reports', label: 'Reports', icon: <Gauge className="w-5 h-5" /> },
    { id: 'meteorological', label: 'Meteorological Cases', icon: <Wind className="w-5 h-5" /> },
    { id: 'tariffs', label: 'Tariffs', icon: <Cloud className="w-5 h-5" /> }
  ];

  // Weather metrics for top bar
  const weatherMetrics = [
    { id: 'temperature', label: 'Temperature', icon: <Thermometer className="w-4 h-4" />, value: `${convertTemperature(currentWeather.temperature)}°${unit}`, color: 'text-red-400' },
    { id: 'precipitation', label: 'Precipitation', icon: <CloudRain className="w-4 h-4" />, value: `${currentWeather.humidity}%`, color: 'text-blue-400' },
    { id: 'pressure', label: 'Pressure', icon: <Gauge className="w-4 h-4" />, value: `${currentWeather.pressure} hPa`, color: 'text-green-400' },
    { id: 'wind-speed', label: 'Wind Speed', icon: <Wind className="w-4 h-4" />, value: `${currentWeather.windSpeed} m/s`, color: 'text-cyan-400' },
    { id: 'clouds', label: 'Clouds', icon: <Cloud className="w-4 h-4" />, value: `${Math.floor(Math.random() * 100)}%`, color: 'text-purple-400' }
  ];

  // ← ALL YOUR RENDER FUNCTIONS ARE 100% UNTOUCHED BELOW THIS LINE → //

  const renderTemperatureContent = () => (
    <div className="space-y-8">
      {/* Current Temperature Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-red-900/30 to-orange-900/30 backdrop-blur-xl rounded-3xl p-8 border border-red-500/30 hover:border-red-400/50 transition-all duration-300">
          <div className="flex items-center space-x-4 mb-6">
            <div className="p-3 bg-red-500/20 rounded-2xl">
              <Thermometer className="w-8 h-8 text-red-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Current Temperature</h3>
              <p className="text-red-300">Real-time reading</p>
            </div>
          </div>
          <div className="text-5xl font-bold text-red-300 mb-4">
            {convertTemperature(currentWeather.temperature)}°{unit}
          </div>
          <div className="space-y-2">
            <p className="text-gray-300">Feels like: <span className="text-white font-semibold">{convertTemperature(currentWeather.feelsLike)}°{unit}</span></p>
            <p className="text-gray-300 capitalize">{currentWeather.description}</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 backdrop-blur-xl rounded-3xl p-8 border border-blue-500/30 hover:border-blue-400/50 transition-all duration-300">
          <div className="flex items-center space-x-4 mb-6">
            <div className="p-3 bg-blue-500/20 rounded-2xl">
              <Thermometer className="w-8 h-8 text-blue-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Daily High</h3>
              <p className="text-blue-300">Maximum today</p>
            </div>
          </div>
          <div className="text-5xl font-bold text-blue-300 mb-4">
            {convertTemperature(currentForecast[0].high)}°{unit}
          </div>
          <p className="text-gray-300">Peak temperature expected</p>
        </div>

        <div className="bg-gradient-to-br from-purple-900/30 to-indigo-900/30 backdrop-blur-xl rounded-3xl p-8 border border-purple-500/30 hover:border-purple-400/50 transition-all duration-300">
          <div className="flex items-center space-x-4 mb-6">
            <div className="p-3 bg-purple-500/20 rounded-2xl">
              <Thermometer className="w-8 h-8 text-purple-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Daily Low</h3>
              <p className="text-purple-300">Minimum today</p>
            </div>
          </div>
          <div className="text-5xl font-bold text-purple-300 mb-4">
            {convertTemperature(currentForecast[0].low)}°{unit}
          </div>
          <p className="text-gray-300">Lowest temperature expected</p>
        </div>
      </div>

      {/* 5-Day Temperature Trend */}
      <div className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-xl rounded-3xl p-8 border border-slate-500/30 hover:border-slate-400/50 transition-all duration-300">
        <h3 className="text-2xl font-bold text-white mb-6 flex items-center space-x-3">
          <Thermometer className="w-7 h-7 text-orange-400" />
          <span>5-Day Temperature Forecast</span>
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {currentForecast.slice(0, 5).map((day, index) => (
            <div key={index} className="text-center p-6 bg-slate-800/50 rounded-2xl border border-slate-700/50 hover:border-slate-600/50 transition-all duration-200">
              <p className="text-gray-400 text-sm font-medium mb-3">{day.dayName}</p>
              <div className="space-y-2">
                <p className="text-white text-2xl font-bold">{convertTemperature(day.high)}°</p>
                <p className="text-gray-400 text-lg">{convertTemperature(day.low)}°</p>
              </div>
              <p className="text-gray-500 text-xs mt-2 capitalize">{day.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPrecipitationContent = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 backdrop-blur-xl rounded-3xl p-8 border border-blue-500/30">
          <div className="flex items-center space-x-4 mb-6">
            <div className="p-3 bg-blue-500/20 rounded-2xl">
              <CloudRain className="w-8 h-8 text-blue-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Precipitation Chance</h3>
              <p className="text-blue-300">Today's probability</p>
            </div>
          </div>
          <div className="text-5xl font-bold text-blue-300 mb-4">
            {Math.floor(Math.random() * 60)}%
          </div>
          <p className="text-gray-300">Chance of precipitation</p>
        </div>

        <div className="bg-gradient-to-br from-indigo-900/30 to-purple-900/30 backdrop-blur-xl rounded-3xl p-8 border border-indigo-500/30">
          <div className="flex items-center space-x-4 mb-6">
            <div className="p-3 bg-indigo-500/20 rounded-2xl">
              <CloudRain className="w-8 h-8 text-indigo-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Humidity</h3>
              <p className="text-indigo-300">Relative humidity</p>
            </div>
          </div>
          <div className="text-5xl font-bold text-indigo-300 mb-4">
            {currentWeather.humidity}%
          </div>
          <p className="text-gray-300">Current humidity level</p>
        </div>
      </div>
    </div>
  );

  const renderPressureContent = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 backdrop-blur-xl rounded-3xl p-8 border border-green-500/30">
          <div className="flex items-center space-x-4 mb-6">
            <div className="p-3 bg-green-500/20 rounded-2xl">
              <Gauge className="w-8 h-8 text-green-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Atmospheric Pressure</h3>
              <p className="text-green-300">Current reading</p>
            </div>
          </div>
          <div className="text-5xl font-bold text-green-300 mb-4">
            {currentWeather.pressure} <span className="text-2xl">hPa</span>
          </div>
          <p className="text-gray-300">Standard atmospheric pressure</p>
        </div>

        <div className="bg-gradient-to-br from-yellow-900/30 to-orange-900/30 backdrop-blur-xl rounded-3xl p-8 border border-yellow-500/30">
          <div className="flex items-center space-x-4 mb-6">
            <div className="p-3 bg-yellow-500/20 rounded-2xl">
              <Gauge className="w-8 h-8 text-yellow-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Pressure Trend</h3>
              <p className="text-yellow-300">24-hour change</p>
            </div>
          </div>
          <div className="text-5xl font-bold text-yellow-300 mb-4">
            Rising
          </div>
          <p className="text-gray-300">+2.1 hPa in last 24h</p>
        </div>
      </div>
    </div>
  );

  const renderWindSpeedContent = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-cyan-900/30 to-blue-900/30 backdrop-blur-xl rounded-3xl p-8 border border-cyan-500/30">
          <div className="flex items-center space-x-4 mb-6">
            <div className="p-3 bg-cyan-500/20 rounded-2xl">
              <Wind className="w-8 h-8 text-cyan-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Wind Speed</h3>
              <p className="text-cyan-300">Current velocity</p>
            </div>
          </div>
          <div className="text-5xl font-bold text-cyan-300 mb-4">
            {currentWeather.windSpeed} <span className="text-2xl">m/s</span>
          </div>
          <p className="text-gray-300">Wind velocity</p>
        </div>

        <div className="bg-gradient-to-br from-teal-900/30 to-cyan-900/30 backdrop-blur-xl rounded-3xl p-8 border border-teal-500/30">
          <div className="flex items-center space-x-4 mb-6">
            <div className="p-3 bg-teal-500/20 rounded-2xl">
              <Wind className="w-8 h-8 text-teal-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Wind Direction</h3>
              <p className="text-teal-300">Current bearing</p>
            </div>
          </div>
          <div className="text-5xl font-bold text-teal-300 mb-4">
            NW
          </div>
          <p className="text-gray-300">315° Northwest</p>
        </div>

        <div className="bg-gradient-to-br from-blue-900/30 to-indigo-900/30 backdrop-blur-xl rounded-3xl p-8 border border-blue-500/30">
          <div className="flex items-center space-x-4 mb-6">
            <div className="p-3 bg-blue-500/20 rounded-2xl">
              <Wind className="w-8 h-8 text-blue-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Wind Gusts</h3>
              <p className="text-blue-300">Maximum gusts</p>
            </div>
          </div>
          <div className="text-5xl font-bold text-blue-300 mb-4">
            {Math.round(currentWeather.windSpeed * 1.5)} <span className="text-2xl">m/s</span>
          </div>
          <p className="text-gray-300">Peak wind speed</p>
        </div>
      </div>
    </div>
  );

  const renderCloudsContent = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-gray-900/30 to-slate-900/30 backdrop-blur-xl rounded-3xl p-8 border border-gray-500/30">
          <div className="flex items-center space-x-4 mb-6">
            <div className="p-3 bg-gray-500/20 rounded-2xl">
              <Cloud className="w-8 h-8 text-gray-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Cloud Coverage</h3>
              <p className="text-gray-300">Sky coverage</p>
            </div>
          </div>
          <div className="text-5xl font-bold text-gray-300 mb-4">
            {Math.floor(Math.random() * 100)}%
          </div>
          <p className="text-gray-300">Percentage of sky covered</p>
        </div>

        <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 backdrop-blur-xl rounded-3xl p-8 border border-purple-500/30">
          <div className="flex items-center space-x-4 mb-6">
            <div className="p-3 bg-purple-500/20 rounded-2xl">
              <Cloud className="w-8 h-8 text-purple-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Visibility</h3>
              <p className="text-purple-300">Atmospheric clarity</p>
            </div>
          </div>
          <div className="text-5xl font-bold text-purple-300 mb-4">
            {(currentWeather.visibility / 1000).toFixed(1)} <span className="text-2xl">km</span>
          </div>
          <p className="text-gray-300">Visibility distance</p>
        </div>
      </div>
    </div>
  );

  const renderHomeContent = () => {
    switch (activeSubMenu) {
      case 'temperature':
        return renderTemperatureContent();
      case 'precipitation':
        return renderPrecipitationContent();
      case 'pressure':
        return renderPressureContent();
      case 'wind-speed':
        return renderWindSpeedContent();
      case 'clouds':
        return renderCloudsContent();
      default:
        return renderTemperatureContent();
    }
  };

  const renderAlertsContent = () => (
    <div className="space-y-8">
      <WeatherAlerts alerts={alerts} />
    </div>
  );

    const renderReportsContent = () => (
    <div className="space-y-8">
      {/* Existing Daily Summary Card – unchanged */}
      <div className="bg-gradient-to-br from-blue-900/30 to-indigo-900/30 backdrop-blur-xl rounded-3xl p-8 border border-blue-500/30">
        <h3 className="text-2xl font-bold text-white mb-6">Weather Reports & Analysis</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-slate-800/50 rounded-2xl border border-slate-700/50">
            <h4 className="text-white font-bold text-lg mb-3">Daily Summary Report</h4>
            <p className="text-gray-300 mb-4">
              Comprehensive analysis of today's weather patterns, including temperature variations, precipitation events, and atmospheric conditions.
            </p>
            <button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 px-4 py-2 rounded-lg text-white font-medium transition-all duration-200">
              Generate Report
            </button>
          </div>

          {/* NEW: Full Weekly Forecast Analysis – replaces the old placeholder */}
          <div className="p-6 bg-slate-800/50 rounded-2xl border border-cyan-400/50 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/10 to-purple-600/10"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-cyan-300 font-bold text-lg">Weekly Forecast Analysis</h4>
                <span className="px-3 py-1 bg-cyan-500/20 text-cyan-300 text-xs rounded-full font-medium">
                  Updated {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                </span>
              </div>

              <p className="text-gray-300 mb-6">
                Extended 7-day outlook with detailed meteorological insights, confidence levels, and potential impacts.
              </p>

              {/* 7-Day Mini Cards */}
              <div className="grid grid-cols-7 gap-2 mb-6">
                {currentForecast.map((day, idx) => (
                  <div
                    key={idx}
                    className="text-center p-3 bg-slate-900/50 rounded-xl border border-slate-700/50 hover:border-cyan-500/50 transition-all duration-200"
                  >
                    <p className="text-xs text-gray-400 font-medium">
                      {idx === 0 ? 'Today' : new Date(Date.now() + idx * 86400000).toLocaleDateString('en-US', { weekday: 'short' })}
                    </p>
                    <p className="text-lg font-bold text-white mt-1">
                      {convertTemperature(day.high)}°
                    </p>
                    <p className="text-xs text-gray-400">{convertTemperature(day.low)}°</p>
                    <div className="mt-2 text-cyan-400 text-xs">{day.description.split(' ')[0]}</div>
                  </div>
                ))}
              </div>

              {/* Key Insights */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                  <p className="text-sm text-gray-300">
                    <strong className="text-cyan-300">Temperature Trend:</strong> Warming +4°C by Friday
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                  <p className="text-sm text-gray-300">
                    <strong className="text-yellow-300">Precipitation Risk:</strong> 70% chance Thursday night
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                  <p className="text-sm text-gray-300">
                    <strong className="text-purple-300">Confidence Level:</strong> High (92%) through Sunday
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button className="flex-1 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 px-4 py-2.5 rounded-lg text-white font-medium transition-all duration-200 shadow-lg">
                  View Full Report
                </button>
                <button className="px-4 py-2.5 bg-slate-700/50 hover:bg-slate-600/80 rounded-lg text-white font-medium border border-slate-600/50 transition-all duration-200">
                  Export PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMeteorologicalContent = () => (
    <div className="space-y-8">
      <div className="bg-gradient-to-br from-purple-900/30 to-indigo-900/30 backdrop-blur-xl rounded-3xl p-8 border border-purple-500/30">
        <h3 className="text-2xl font-bold text-white mb-6">Meteorological Case Studies</h3>
        <div className="space-y-6">
          <div className="p-6 bg-slate-800/50 rounded-2xl border border-slate-700/50">
            <h4 className="text-purple-300 font-bold text-lg mb-3">Current Storm System Analysis</h4>
            <p className="text-gray-300 mb-4">Detailed meteorological analysis of the approaching low-pressure system, including trajectory predictions, intensity forecasts, and potential weather impacts.</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <div className="text-center">
                <p className="text-purple-400 font-semibold">Pressure Drop</p>
                <p className="text-white text-xl">-15 hPa</p>
              </div>
              <div className="text-center">
                <p className="text-cyan-400 font-semibold">Wind Shift</p>
                <p className="text-white text-xl">SW → NW</p>
              </div>
              <div className="text-center">
                <p className="text-green-400 font-semibold">Temp Change</p>
                <p className="text-white text-xl">-8°C</p>
              </div>
              <div className="text-center">
                <p className="text-yellow-400 font-semibold">Duration</p>
                <p className="text-white text-xl">18 hrs</p>
              </div>
            </div>
          </div>
          <div className="p-6 bg-slate-800/50 rounded-2xl border border-slate-700/50">
            <h4 className="text-cyan-300 font-bold text-lg mb-3">Atmospheric Pattern Recognition</h4>
            <p className="text-gray-300 mb-4">Advanced analysis of current atmospheric patterns, jet stream positioning, and their influence on local weather conditions.</p>
            <div className="flex space-x-4">
              <button className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 px-4 py-2 rounded-lg text-white font-medium transition-all duration-200">
                View Satellite Data
              </button>
              <button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 px-4 py-2 rounded-lg text-white font-medium transition-all duration-200">
                Pressure Maps
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTariffsContent = () => (
    <div className="space-y-8">
      <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 backdrop-blur-xl rounded-3xl p-8 border border-green-500/30">
        <h3 className="text-2xl font-bold text-white mb-6">R3alm Weather Service Plans</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-slate-800/50 rounded-2xl border border-slate-700/50 text-center">
            <h4 className="text-green-300 font-bold text-xl mb-4">Basic Plan</h4>
            <div className="text-4xl font-bold text-white mb-4">$9.99<span className="text-lg text-gray-400">/mo</span></div>
            <ul className="text-gray-300 space-y-2 mb-6">
              <li>• Current weather data</li>
              <li>• 5-day forecasts</li>
              <li>• Basic alerts</li>
              <li>• Mobile access</li>
            </ul>
            <button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 px-4 py-3 rounded-lg text-white font-medium transition-all duration-200">
              Choose Plan
            </button>
          </div>
          
          <div className="p-6 bg-slate-800/50 rounded-2xl border border-cyan-400/50 text-center relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-cyan-600 to-blue-600 px-4 py-1 rounded-full">
              <span className="text-white text-sm font-bold">POPULAR</span>
            </div>
            <h4 className="text-cyan-300 font-bold text-xl mb-4">Pro Plan</h4>
            <div className="text-4xl font-bold text-white mb-4">$19.99<span className="text-lg text-gray-400">/mo</span></div>
            <ul className="text-gray-300 space-y-2 mb-6">
              <li>• Everything in Basic</li>
              <li>• Advanced analytics</li>
              <li>• Severe weather alerts</li>
              <li>• Historical data</li>
              <li>• API access</li>
            </ul>
            <button className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 px-4 py-3 rounded-lg text-white font-medium transition-all duration-200">
              Choose Plan
            </button>
          </div>
          
          <div className="p-6 bg-slate-800/50 rounded-2xl border border-slate-700/50 text-center">
            <h4 className="text-purple-300 font-bold text-xl mb-4">Enterprise</h4>
            <div className="text-4xl font-bold text-white mb-4">$49.99<span className="text-lg text-gray-400">/mo</span></div>
            <ul className="text-gray-300 space-y-2 mb-6">
              <li>• Everything in Pro</li>
              <li>• Custom integrations</li>
              <li>• Priority support</li>
              <li>• White-label options</li>
              <li>• Dedicated account manager</li>
            </ul>
            <button className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 px-4 py-3 rounded-lg text-white font-medium transition-all duration-200">
              Contact Sales
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderForecastContent = () => (
    <div className="space-y-8">
      <DailyHourlyForecast
        dailyForecast={currentForecast}
        hourlyDataByDay={hourlyForecast}
        unit={unit}
      />
    </div>
  );

  const renderContent = () => {
    switch (activeMenu) {
      case 'home':
        return renderHomeContent();
      case 'forecast':
        return renderForecastContent();
      case 'alerts':
        return renderAlertsContent();
      case 'reports':
        return renderReportsContent();
      case 'meteorological':
        return renderMeteorologicalContent();
      case 'tariffs':
        return renderTariffsContent();
      default:
        return renderHomeContent();
    }
  };

  if (locationLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-slate-600 border-t-cyan-400 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading location...</p>
        </div>
      </div>
    );
  }

  if (!location) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Location Not Found</h1>
          <Link
            to="/"
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 px-6 py-3 rounded-xl text-white font-medium transition-all duration-200"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 -left-40 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-40 right-1/3 w-60 h-60 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Left Sidebar */}
      <div className="w-80 bg-gradient-to-b from-slate-900/95 to-slate-800/95 backdrop-blur-xl border-r border-slate-700/50 relative z-10">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center space-x-3 mb-8">
            <MapPin className="w-8 h-8 text-cyan-400" />
            <div>
              <h1 className="text-2xl font-bold text-white">{location.name}</h1>
              <p className="text-cyan-300">{location.country}</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-2 mb-8">
            {mainMenuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveMenu(item.id);
                  if (item.id === 'home') {
                    setActiveSubMenu('temperature');
                  }
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 text-left ${
                  activeMenu === item.id
                    ? 'bg-gradient-to-r from-purple-600/20 to-cyan-600/20 border border-cyan-400/30 text-cyan-300'
                    : 'text-gray-300 hover:bg-slate-800/50 hover:text-white'
                }`}
              >
                {item.icon}
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-slate-700/50">
          <div className="text-center">
            <p className="text-gray-400 text-xs">R3alm Weather Dashboard</p>
            <p className="text-gray-500 text-xs">Professional Edition v2.0</p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col relative z-10">
        {/* Top Header */}
        <div className="bg-gradient-to-r from-slate-900/95 to-slate-800/95 backdrop-blur-xl border-b border-slate-700/50 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <Link 
                to="/" 
                className="inline-flex items-center space-x-2 bg-slate-800/80 backdrop-blur-xl hover:bg-slate-700/80 px-4 py-2 rounded-xl text-white transition-all duration-200 border border-slate-700/50 hover:border-slate-600/50"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Home</span>
              </Link>
              
              <div className="text-white">
                <h2 className="text-xl font-bold capitalize">{activeMenu === 'home' ? activeSubMenu : activeMenu}</h2>
                <p className="text-gray-400 text-sm">
                  {activeMenu === 'home' ? `${activeSubMenu} monitoring and analysis` : `${activeMenu} dashboard`}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Search Bar */}
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search location..."
                  className="bg-slate-800/80 border border-slate-600/50 rounded-xl py-2 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 transition-all duration-200 w-64"
                />
              </form>

              <button
                onClick={toggleUnit}
                className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 px-4 py-2 rounded-lg text-white font-medium transition-all duration-200 shadow-lg"
              >
                °{unit}
              </button>
              
              <Link 
                to="/settings"
                className="p-2 bg-slate-800/80 backdrop-blur-xl hover:bg-slate-700/80 rounded-xl text-white transition-all duration-200 border border-slate-700/50 hover:border-slate-600/50"
              >
                <Settings className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Weather Metrics Bar - Only show when Home is active */}
          {activeMenu === 'home' && (
            <div className="flex items-center space-x-4 overflow-x-auto pb-2">
              {weatherMetrics.map((metric) => (
                <button
                  key={metric.id}
                  onClick={() => setActiveSubMenu(metric.id)}
                  className={`flex-shrink-0 flex items-center space-x-3 px-6 py-3 rounded-xl transition-all duration-200 border ${
                    activeSubMenu === metric.id
                      ? 'bg-gradient-to-r from-purple-600/20 to-cyan-600/20 border-cyan-400/50 text-cyan-300'
                      : 'bg-slate-800/50 border-slate-700/50 text-gray-300 hover:bg-slate-700/50 hover:border-slate-600/50'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${activeSubMenu === metric.id ? 'bg-cyan-500/20' : 'bg-slate-700/50'}`}>
                    {React.cloneElement(metric.icon, { className: `w-4 h-4 ${metric.color}` })}
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-sm">{metric.label}</p>
                    <p className="text-xs opacity-75">{metric.value}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-8">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-slate-600 border-t-cyan-400 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-white text-lg">Loading weather data...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="p-4 bg-red-900/20 border border-red-500/30 rounded-xl mb-4">
                  <p className="text-red-300 text-lg font-semibold mb-2">Weather Data Error</p>
                  <p className="text-red-200">{error}</p>
                </div>
                <button
                  onClick={() => location && searchLocation(`${location.lat},${location.lon}`)}
                  className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 px-6 py-3 rounded-xl text-white font-medium transition-all duration-200"
                >
                  Retry Loading Weather Data
                </button>
              </div>
            </div>
          ) : (
            renderContent()
          )}
        </div>

        {/* Footer */}
        <div className="bg-gradient-to-r from-slate-900/95 to-slate-800/95 backdrop-blur-xl border-t border-slate-700/50 p-6">
          <div className="text-center text-gray-400">
            <p className="text-sm">R3alm Weather Dashboard • Demo Mode • Built for the Web3 Ecosystem</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationDashboard;