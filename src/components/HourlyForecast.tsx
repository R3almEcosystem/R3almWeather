import React from 'react';
import { Clock, Cloud, Sun, CloudRain, CloudSnow, Zap } from 'lucide-react';

interface HourlyData {
  time: string;
  temperature: number;
  description: string;
  weatherCode: string;
  precipitation?: number;
}

interface HourlyForecastProps {
  hourlyData: HourlyData[];
  unit: 'C' | 'F';
}

const HourlyForecast: React.FC<HourlyForecastProps> = ({ hourlyData, unit }) => {
  const getWeatherIcon = (code: string) => {
    const iconClass = "w-6 h-6 text-cyan-400";
    
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
    <div className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-indigo-500/20 hover:border-indigo-400/40 transition-all duration-300">
      <h3 className="text-2xl font-bold text-white mb-6 flex items-center space-x-3">
        <Clock className="w-7 h-7 text-indigo-400" />
        <span>24-Hour Forecast</span>
      </h3>
      
      <div className="overflow-x-auto">
        <div className="flex space-x-4 pb-4 min-w-max">
          {hourlyData.map((hour, index) => (
            <div key={index} className="flex-shrink-0 bg-slate-800/50 rounded-2xl p-4 border border-slate-700/50 hover:border-slate-600/50 transition-all duration-200 min-w-[120px]">
              <div className="text-center space-y-3">
                <p className="text-gray-300 text-sm font-medium">{hour.time}</p>
                <div className="flex justify-center">
                  {getWeatherIcon(hour.weatherCode)}
                </div>
                <p className="text-white text-xl font-bold">{convertTemperature(hour.temperature)}°</p>
                <p className="text-gray-400 text-xs capitalize leading-tight">{hour.description}</p>
                {hour.precipitation && hour.precipitation > 0 && (
                  <div className="flex items-center justify-center space-x-1">
                    <CloudRain className="w-3 h-3 text-blue-400" />
                    <span className="text-blue-300 text-xs">{hour.precipitation}%</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HourlyForecast;