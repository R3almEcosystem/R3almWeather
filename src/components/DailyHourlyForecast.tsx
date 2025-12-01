import React from 'react';
import { Cloud, CloudRain, CloudSnow, Zap, Sun, Droplets, Wind, Gauge } from 'lucide-react';

interface ForecastItem {
  date: string;
  dayName: string;
  high: number;
  low: number;
  description: string;
  weatherCode: string;
}

interface DailyHourlyForecastProps {
  forecast: ForecastItem[];
}

const DailyHourlyForecast: React.FC<DailyHourlyForecastProps> = ({ forecast = [] }) => {
  // Safety guard — if no forecast, show friendly message
  if (!forecast || forecast.length === 0) {
    return (
      <div className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl rounded-3xl p-12 text-center border border-slate-700/50">
        <Cloud className="w-20 h-20 text-gray-500 mx-auto mb-4 opacity-50" />
        <p className="text-xl text-gray-400">No forecast data available</p>
        <p className="text-sm text-gray-500 mt-2">Try again later or check your connection</p>
      </div>
    );
  }

  const getWeatherIcon = (code: string) => {
    if (code.includes('01')) return <Sun className="w-16 h-16 text-yellow-400" />;
    if (code.includes('02')) return <Sun className="w-16 h-16 text-yellow-300" />;
    if (code.includes('03') || code.includes('04')) return <Cloud className="w-16 h-16 text-gray-400" />;
    if (code.includes('09') || code.includes('10')) return <CloudRain className="w-16 h-16 text-blue-400" />;
    if (code.includes('11')) return <Zap className="w-16 h-16 text-yellow-500" />;
    if (code.includes('13')) return <CloudSnow className="w-16 h-16 text-blue-200" />;
    return <Sun className="w-16 h-16 text-yellow-400" />;
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-cyan-500/30">
        <div className="flex items-center gap-4 mb-8">
          <div className="bg-gradient-to-br from-cyan-500 to-blue-600 p-4 rounded-2xl">
            <Sun className="w-10 h-10 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white">5-Day Forecast</h2>
            <p className="text-cyan-300">Highs and lows for the coming days</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {forecast.map((day, index) => (
            <div
              key={index}
              className="group relative bg-gradient-to-br from-slate-800/70 to-slate-700/70 rounded-3xl p-6 border border-slate-600/50 hover:border-cyan-500/60 transition-all duration-500 hover:shadow-2xl hover:shadow-cyan-500/20 overflow-hidden"
            >
              {/* Animated background glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl opacity-0 group-hover:opacity-70 transition-opacity duration-700"></div>

              <div className="relative z-10">
                <p className="text-sm font-medium text-cyan-300 mb-2">{day.dayName}</p>
                <p className="text-xs text-gray-400 mb-6">
                  {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </p>

                <div className="flex justify-center mb-4">
                  {getWeatherIcon(day.weatherCode)}
                </div>

                <div className="text-center space-y-1">
                  <div className="text-4xl font-bold text-white">
                    {day.high}°
                  </div>
                  <div className="text-2xl text-gray-400">
                    {day.low}°
                  </div>
                  <p className="text-xs text-gray-400 capitalize mt-3">{day.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Beautiful inline animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .group {
          animation: fadeInUp 0.6s ease-out forwards;
          animation-delay: ${forecast.map((_, i) => `${i * 100}ms`).join(', ')};
        }
      `}</style>
    </div>
  );
};

export default DailyHourlyForecast;