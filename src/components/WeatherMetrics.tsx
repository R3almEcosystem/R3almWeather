import React from 'react';
import { 
  Thermometer, 
  Droplets, 
  Wind, 
  Eye, 
  Gauge, 
  Sun, 
  Moon,
  CloudRain,
  Compass
} from 'lucide-react';

interface WeatherMetricsProps {
  weather: {
    temperature: number;
    feelsLike: number;
    humidity: number;
    windSpeed: number;
    visibility: number;
    pressure: number;
    uvIndex?: number;
    dewPoint?: number;
    windDirection?: number;
  };
  unit: 'C' | 'F';
}

const WeatherMetrics: React.FC<WeatherMetricsProps> = ({ weather, unit }) => {
  const convertTemperature = (temp: number) => {
    return unit === 'F' ? Math.round((temp * 9/5) + 32) : Math.round(temp);
  };

  const getWindDirection = (degrees: number) => {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    return directions[Math.round(degrees / 22.5) % 16];
  };

  const metrics = [
    {
      icon: <Thermometer className="w-6 h-6 text-orange-400" />,
      label: 'Feels Like',
      value: `${convertTemperature(weather.feelsLike)}°`,
      description: 'Apparent temperature'
    },
    {
      icon: <Droplets className="w-6 h-6 text-blue-400" />,
      label: 'Humidity',
      value: `${weather.humidity}%`,
      description: 'Relative humidity'
    },
    {
      icon: <Wind className="w-6 h-6 text-green-400" />,
      label: 'Wind Speed',
      value: `${weather.windSpeed} m/s`,
      description: weather.windDirection ? getWindDirection(weather.windDirection) : 'Wind velocity'
    },
    {
      icon: <Eye className="w-6 h-6 text-purple-400" />,
      label: 'Visibility',
      value: `${(weather.visibility / 1000).toFixed(1)} km`,
      description: 'Atmospheric visibility'
    },
    {
      icon: <Gauge className="w-6 h-6 text-cyan-400" />,
      label: 'Pressure',
      value: `${weather.pressure} hPa`,
      description: 'Atmospheric pressure'
    },
    {
      icon: <Sun className="w-6 h-6 text-yellow-400" />,
      label: 'UV Index',
      value: weather.uvIndex ? weather.uvIndex.toString() : 'N/A',
      description: 'UV radiation level'
    }
  ];

  return (
    <div className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-slate-500/20 hover:border-slate-400/40 transition-all duration-300">
      <h3 className="text-2xl font-bold text-white mb-6 flex items-center space-x-3">
        <Gauge className="w-7 h-7 text-cyan-400" />
        <span>Weather Metrics</span>
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {metrics.map((metric, index) => (
          <div key={index} className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50 hover:border-slate-600/50 transition-all duration-200 group">
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-2 bg-slate-700/50 rounded-xl group-hover:bg-slate-600/50 transition-colors duration-200">
                {metric.icon}
              </div>
              <div>
                <h4 className="text-white font-semibold text-lg">{metric.label}</h4>
                <p className="text-gray-400 text-sm">{metric.description}</p>
              </div>
            </div>
            <div className="text-3xl font-bold text-white">{metric.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeatherMetrics;