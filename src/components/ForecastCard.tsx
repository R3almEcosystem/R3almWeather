import React from 'react';
import { Cloud, Sun, CloudRain, CloudSnow, Zap } from 'lucide-react';

interface ForecastDay {
  date: string;
  dayName: string;
  high: number;
  low: number;
  description: string;
  weatherCode: string;
}

interface ForecastCardProps {
  forecast: ForecastDay[];
  unit: 'C' | 'F';
}

const ForecastCard: React.FC<ForecastCardProps> = ({ forecast, unit }) => {
  const getWeatherIcon = (code: string) => {
    const iconClass = "w-8 h-8 text-cyan-400";
    
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
    <div className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-purple-500/20 hover:border-purple-400/40 transition-all duration-300">
      <h3 className="text-2xl font-bold text-white mb-6">5-Day Forecast</h3>
      
      <div className="space-y-4">
        {forecast.map((day, index) => (
          <div key={index} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl border border-slate-700/50 hover:border-slate-600/50 transition-all duration-200">
            <div className="flex items-center space-x-4">
              {getWeatherIcon(day.weatherCode)}
              <div>
                <p className="text-white font-semibold text-lg">{day.dayName}</p>
                <p className="text-gray-400 text-sm capitalize">{day.description}</p>
              </div>
            </div>
            
            <div className="text-right">
              <div className="flex items-center space-x-3">
                <span className="text-white text-xl font-bold">{convertTemperature(day.high)}°</span>
                <span className="text-gray-400 text-lg">{convertTemperature(day.low)}°</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ForecastCard;