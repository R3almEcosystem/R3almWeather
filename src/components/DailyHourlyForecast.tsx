import React, { useState, useMemo } from 'react';
import { Calendar, Clock, Sun, Cloud, CloudRain, CloudSnow, Zap, ChevronDown, Droplets, Gauge, Wind, CloudDrizzle, Thermometer } from 'lucide-react';

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

interface DailyData {
  date: string;
  dayName: string;
  high: number;
  low: number;
  description: string;
  weatherCode: string;
}

interface DailyHourlyForecastProps {
  dailyForecast: DailyData[];
  hourlyDataByDay: { [key: string]: HourlyData[] };
  unit: 'C' | 'F';
}

const DailyHourlyForecast: React.FC<DailyHourlyForecastProps> = ({
  dailyForecast,
  hourlyDataByDay,
  unit
}) => {
  const dayOptions = useMemo(() => {
    const today = new Date().toDateString();
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toDateString();

    const options = [
      { value: today, label: 'Today' },
      { value: tomorrow, label: 'Tomorrow' }
    ];

    dailyForecast.forEach(day => {
      if (day.date !== today && day.date !== tomorrow) {
        const date = new Date(day.date);
        const formattedDate = date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric'
        });
        options.push({
          value: day.date,
          label: `${day.dayName}, ${formattedDate}`
        });
      }
    });

    return options;
  }, [dailyForecast]);

  const [selectedDay, setSelectedDay] = useState(dayOptions[0]?.value || '');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const currentHourlyData = hourlyDataByDay[selectedDay] || [];

  const getWeatherIcon = (code: string, size: string = 'w-8 h-8') => {
    const iconClass = `${size}`;

    if (code.includes('01')) return <Sun className={`${iconClass} text-yellow-400`} />;
    if (code.includes('02')) return <Cloud className={`${iconClass} text-gray-300`} />;
    if (code.includes('03') || code.includes('04')) return <Cloud className={`${iconClass} text-gray-400`} />;
    if (code.includes('09')) return <CloudDrizzle className={`${iconClass} text-blue-400`} />;
    if (code.includes('10')) return <CloudRain className={`${iconClass} text-blue-500`} />;
    if (code.includes('11')) return <Zap className={`${iconClass} text-yellow-500`} />;
    if (code.includes('13')) return <CloudSnow className={`${iconClass} text-blue-200`} />;

    return <Sun className={`${iconClass} text-yellow-400`} />;
  };

  const convertTemperature = (temp: number) => {
    return unit === 'F' ? Math.round((temp * 9/5) + 32) : Math.round(temp);
  };

  const selectedDayLabel = dayOptions.find(opt => opt.value === selectedDay)?.label || 'Today';

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-cyan-500/30 animate-fade-in">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-br from-cyan-500 to-blue-500 p-3 rounded-xl animate-pulse-soft">
              <Clock className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-3xl font-bold text-white">Hourly Forecast</h3>
              <p className="text-cyan-300 text-sm mt-1">Detailed weather metrics by hour</p>
            </div>
          </div>

          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-3 bg-gradient-to-r from-slate-800 to-slate-700 hover:from-slate-700 hover:to-slate-600 px-6 py-3.5 rounded-xl border border-cyan-500/30 hover:border-cyan-400/50 transition-all duration-200 min-w-[220px] shadow-lg"
            >
              <Calendar className="w-5 h-5 text-cyan-400" />
              <span className="text-white font-semibold flex-1 text-left">{selectedDayLabel}</span>
              <ChevronDown className={`w-5 h-5 text-cyan-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-full min-w-[260px] bg-slate-800 rounded-xl border border-cyan-500/30 shadow-2xl z-50 overflow-hidden animate-slide-down">
                {dayOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setSelectedDay(option.value);
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full px-6 py-3.5 text-left hover:bg-slate-700/70 transition-colors duration-150 ${
                      selectedDay === option.value ? 'bg-cyan-900/40 text-cyan-300 border-l-4 border-cyan-400' : 'text-white'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-5">
          {currentHourlyData.length > 0 ? (
            currentHourlyData.map((hour, index) => (
              <div
                key={index}
                className="hour-card group relative bg-gradient-to-br from-slate-800/80 via-slate-800/60 to-slate-700/80 rounded-3xl p-8 border border-slate-600/40 hover:border-cyan-500/60 transition-all duration-500 shadow-xl hover:shadow-2xl hover:shadow-cyan-500/20 overflow-hidden"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <div className="bg-gradient-to-br from-cyan-600/30 to-blue-600/30 p-3 rounded-xl border border-cyan-500/20">
                        {getWeatherIcon(hour.weatherCode, 'w-12 h-12')}
                      </div>
                      <div>
                        <div className="text-sm text-gray-400 mb-1 capitalize">{hour.description}</div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="sub-card bg-gradient-to-br from-slate-700/50 to-slate-800/50 rounded-2xl p-5 border border-slate-600/30 hover:border-cyan-400/40 transition-all duration-300 hover:scale-105 hover:shadow-lg">
                      <div className="flex items-center justify-between mb-3">
                        <Clock className="w-6 h-6 text-cyan-400" />
                      </div>
                      <div className="text-sm text-gray-400 mb-1">Time</div>
                      <div className="text-3xl font-bold text-white">{hour.time}</div>
                    </div>

                    <div className="sub-card bg-gradient-to-br from-orange-900/20 to-red-900/20 rounded-2xl p-5 border border-orange-500/30 hover:border-orange-400/50 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-orange-500/20">
                      <div className="flex items-center justify-between mb-3">
                        <Thermometer className="w-6 h-6 text-orange-400" />
                      </div>
                      <div className="text-sm text-gray-400 mb-1">Temperature</div>
                      <div className="text-3xl font-bold text-white">{convertTemperature(hour.temperature)}°{unit}</div>
                    </div>

                    <div className="sub-card bg-gradient-to-br from-blue-900/20 to-cyan-900/20 rounded-2xl p-5 border border-blue-500/30 hover:border-blue-400/50 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/20">
                      <div className="flex items-center justify-between mb-3">
                        <Droplets className="w-6 h-6 text-blue-400" />
                      </div>
                      <div className="text-sm text-gray-400 mb-1">Precipitation</div>
                      <div className="text-3xl font-bold text-white">{hour.precipitation}%</div>
                    </div>

                    <div className="sub-card bg-gradient-to-br from-purple-900/20 to-pink-900/20 rounded-2xl p-5 border border-purple-500/30 hover:border-purple-400/50 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20">
                      <div className="flex items-center justify-between mb-3">
                        <Gauge className="w-6 h-6 text-purple-400" />
                      </div>
                      <div className="text-sm text-gray-400 mb-1">Pressure</div>
                      <div className="text-3xl font-bold text-white">{hour.pressure}</div>
                      <div className="text-xs text-gray-500 mt-1">hPa</div>
                    </div>

                    <div className="sub-card bg-gradient-to-br from-emerald-900/20 to-green-900/20 rounded-2xl p-5 border border-emerald-500/30 hover:border-emerald-400/50 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/20">
                      <div className="flex items-center justify-between mb-3">
                        <Wind className="w-6 h-6 text-emerald-400" />
                      </div>
                      <div className="text-sm text-gray-400 mb-1">Wind Speed</div>
                      <div className="text-3xl font-bold text-white">{hour.windSpeed}</div>
                      <div className="text-xs text-gray-500 mt-1">m/s</div>
                    </div>

                    <div className="sub-card bg-gradient-to-br from-slate-700/30 to-gray-800/30 rounded-2xl p-5 border border-slate-500/30 hover:border-slate-400/50 transition-all duration-300 hover:scale-105 hover:shadow-lg">
                      <div className="flex items-center justify-between mb-3">
                        <Cloud className="w-6 h-6 text-gray-400" />
                      </div>
                      <div className="text-sm text-gray-400 mb-1">Cloud Cover</div>
                      <div className="text-3xl font-bold text-white">{hour.clouds}%</div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16 bg-slate-800/30 rounded-2xl border border-slate-700/30 animate-fade-in">
              <Cloud className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">No hourly data available for this day</p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulse-soft {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }

        .animate-slide-down {
          animation: slide-down 0.3s ease-out forwards;
        }

        .animate-pulse-soft {
          animation: pulse-soft 3s ease-in-out infinite;
        }

        .hour-card {
          animation: fade-in 0.6s ease-out forwards;
          opacity: 0;
        }

        .sub-card {
          transform-origin: center;
        }

        .hour-card:hover .sub-card {
          transition-delay: 0s;
        }

        .sub-card:nth-child(1) {
          animation: fade-in 0.7s ease-out forwards;
          animation-delay: 0.1s;
        }

        .sub-card:nth-child(2) {
          animation: fade-in 0.7s ease-out forwards;
          animation-delay: 0.15s;
        }

        .sub-card:nth-child(3) {
          animation: fade-in 0.7s ease-out forwards;
          animation-delay: 0.2s;
        }

        .sub-card:nth-child(4) {
          animation: fade-in 0.7s ease-out forwards;
          animation-delay: 0.25s;
        }

        .sub-card:nth-child(5) {
          animation: fade-in 0.7s ease-out forwards;
          animation-delay: 0.3s;
        }

        .sub-card:nth-child(6) {
          animation: fade-in 0.7s ease-out forwards;
          animation-delay: 0.35s;
        }
      `}</style>
    </div>
  );
};

export default DailyHourlyForecast;
