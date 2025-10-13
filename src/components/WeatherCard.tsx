import React from 'react';
import { Cloud, Sun, CloudRain, CloudSnow, Zap, Wind, Droplets, Eye, Thermometer } from 'lucide-react';

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

interface WeatherCardProps {
  weather: WeatherData;
  unit: 'C' | 'F';
  onUnitChange: () => void;
}

const WeatherCard: React.FC<WeatherCardProps> = ({ weather, unit, onUnitChange }) => {
  const getWeatherIcon = (code: string) => {
    const iconClass = "w-16 h-16 text-cyan-400";
    
    if (code.includes('01')) return <Sun className={iconClass} />;
    if (code.includes('02') || code.includes('03') || code.includes('04')) return <Cloud className={iconClass} />;
    if (code.includes('09') || code.includes('10')) return <CloudRain className={iconClass} />;
    if (code.includes('11')) return <Zap className={iconClass} />;
    if (code.includes('13')) return <CloudSnow className={iconClass} />;
    
    return <Sun className={iconClass} />;
  };

  const convertTemperature = (temp: number) => {
    return unit === 'F' ? Math.round((temp * 9/5) + 32) : Math.round(temp);
  };

  return (
    <div className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-cyan-500/20 hover:border-cyan-400/40 transition-all duration-300">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">{weather.location}</h2>
          <p className="text-cyan-300 text-lg">{weather.country}</p>
        </div>
        <button
          onClick={onUnitChange}
          className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 px-4 py-2 rounded-lg text-white font-medium transition-all duration-200 shadow-lg"
        >
          °{unit}
        </button>
      </div>

      {/* Main Weather Display */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-6">
          {getWeatherIcon(weather.weatherCode)}
          <div>
            <div className="text-6xl font-bold text-white mb-2">
              {convertTemperature(weather.temperature)}°
            </div>
            <p className="text-gray-300 text-lg capitalize">{weather.description}</p>
          </div>
        </div>
      </div>

      {/* Weather Details Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
          <div className="flex items-center space-x-2 mb-2">
            <Thermometer className="w-5 h-5 text-orange-400" />
            <span className="text-gray-300 text-sm">Feels like</span>
          </div>
          <p className="text-white text-xl font-semibold">{convertTemperature(weather.feelsLike)}°</p>
        </div>

        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
          <div className="flex items-center space-x-2 mb-2">
            <Droplets className="w-5 h-5 text-blue-400" />
            <span className="text-gray-300 text-sm">Humidity</span>
          </div>
          <p className="text-white text-xl font-semibold">{weather.humidity}%</p>
        </div>

        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
          <div className="flex items-center space-x-2 mb-2">
            <Wind className="w-5 h-5 text-green-400" />
            <span className="text-gray-300 text-sm">Wind</span>
          </div>
          <p className="text-white text-xl font-semibold">{weather.windSpeed} m/s</p>
        </div>

        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
          <div className="flex items-center space-x-2 mb-2">
            <Eye className="w-5 h-5 text-purple-400" />
            <span className="text-gray-300 text-sm">Visibility</span>
          </div>
          <p className="text-white text-xl font-semibold">{(weather.visibility / 1000).toFixed(1)} km</p>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;