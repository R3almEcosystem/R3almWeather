import React from 'react';
import { 
  Thermometer, 
  CloudRain, 
  Gauge, 
  Wind, 
  Cloud,
  TrendingUp,
  TrendingDown,
  Activity
} from 'lucide-react';

interface DashboardContentProps {
  activeMenu: string;
  activeSubMenu: string;
  weather: any;
  forecast: any[];
  unit: 'C' | 'F';
}

const DashboardContent: React.FC<DashboardContentProps> = ({ 
  activeMenu, 
  activeSubMenu, 
  weather, 
  forecast, 
  unit 
}) => {
  const convertTemperature = (temp: number) => {
    return unit === 'F' ? Math.round((temp * 9/5) + 32) : Math.round(temp);
  };

  const renderTemperatureContent = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-red-900/20 to-orange-900/20 backdrop-blur-xl rounded-2xl p-6 border border-red-500/20">
          <div className="flex items-center space-x-3 mb-4">
            <Thermometer className="w-8 h-8 text-red-400" />
            <h3 className="text-xl font-bold text-white">Current Temperature</h3>
          </div>
          <div className="text-4xl font-bold text-red-300 mb-2">
            {weather ? convertTemperature(weather.temperature) : '--'}°{unit}
          </div>
          <p className="text-gray-300">Feels like {weather ? convertTemperature(weather.feelsLike) : '--'}°{unit}</p>
        </div>

        <div className="bg-gradient-to-br from-blue-900/20 to-cyan-900/20 backdrop-blur-xl rounded-2xl p-6 border border-blue-500/20">
          <div className="flex items-center space-x-3 mb-4">
            <TrendingUp className="w-8 h-8 text-blue-400" />
            <h3 className="text-xl font-bold text-white">Daily High</h3>
          </div>
          <div className="text-4xl font-bold text-blue-300 mb-2">
            {forecast[0] ? convertTemperature(forecast[0].high) : '--'}°{unit}
          </div>
          <p className="text-gray-300">Maximum today</p>
        </div>

        <div className="bg-gradient-to-br from-purple-900/20 to-indigo-900/20 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/20">
          <div className="flex items-center space-x-3 mb-4">
            <TrendingDown className="w-8 h-8 text-purple-400" />
            <h3 className="text-xl font-bold text-white">Daily Low</h3>
          </div>
          <div className="text-4xl font-bold text-purple-300 mb-2">
            {forecast[0] ? convertTemperature(forecast[0].low) : '--'}°{unit}
          </div>
          <p className="text-gray-300">Minimum today</p>
        </div>
      </div>

      <div className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-xl rounded-2xl p-6 border border-slate-500/20">
        <h3 className="text-xl font-bold text-white mb-4">Temperature Trends</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {forecast.slice(0, 5).map((day, index) => (
            <div key={index} className="text-center p-4 bg-slate-800/50 rounded-xl">
              <p className="text-gray-400 text-sm mb-2">{day.dayName}</p>
              <div className="space-y-1">
                <p className="text-white font-bold">{convertTemperature(day.high)}°</p>
                <p className="text-gray-400">{convertTemperature(day.low)}°</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPrecipitationContent = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-blue-900/20 to-cyan-900/20 backdrop-blur-xl rounded-2xl p-6 border border-blue-500/20">
          <div className="flex items-center space-x-3 mb-4">
            <CloudRain className="w-8 h-8 text-blue-400" />
            <h3 className="text-xl font-bold text-white">Precipitation Probability</h3>
          </div>
          <div className="text-4xl font-bold text-blue-300 mb-2">
            {Math.floor(Math.random() * 40)}%
          </div>
          <p className="text-gray-300">Chance of rain today</p>
        </div>

        <div className="bg-gradient-to-br from-indigo-900/20 to-purple-900/20 backdrop-blur-xl rounded-2xl p-6 border border-indigo-500/20">
          <div className="flex items-center space-x-3 mb-4">
            <Activity className="w-8 h-8 text-indigo-400" />
            <h3 className="text-xl font-bold text-white">Humidity</h3>
          </div>
          <div className="text-4xl font-bold text-indigo-300 mb-2">
            {weather ? weather.humidity : '--'}%
          </div>
          <p className="text-gray-300">Relative humidity</p>
        </div>
      </div>

      <div className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-xl rounded-2xl p-6 border border-slate-500/20">
        <h3 className="text-xl font-bold text-white mb-4">Precipitation Forecast</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {forecast.slice(0, 5).map((day, index) => (
            <div key={index} className="text-center p-4 bg-slate-800/50 rounded-xl">
              <p className="text-gray-400 text-sm mb-2">{day.dayName}</p>
              <CloudRain className="w-6 h-6 text-blue-400 mx-auto mb-2" />
              <p className="text-white font-bold">{Math.floor(Math.random() * 60)}%</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPressureContent = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 backdrop-blur-xl rounded-2xl p-6 border border-green-500/20">
          <div className="flex items-center space-x-3 mb-4">
            <Gauge className="w-8 h-8 text-green-400" />
            <h3 className="text-xl font-bold text-white">Atmospheric Pressure</h3>
          </div>
          <div className="text-4xl font-bold text-green-300 mb-2">
            {weather ? weather.pressure : '--'} hPa
          </div>
          <p className="text-gray-300">Current pressure</p>
        </div>

        <div className="bg-gradient-to-br from-yellow-900/20 to-orange-900/20 backdrop-blur-xl rounded-2xl p-6 border border-yellow-500/20">
          <div className="flex items-center space-x-3 mb-4">
            <TrendingUp className="w-8 h-8 text-yellow-400" />
            <h3 className="text-xl font-bold text-white">Pressure Trend</h3>
          </div>
          <div className="text-4xl font-bold text-yellow-300 mb-2">
            Rising
          </div>
          <p className="text-gray-300">+2.3 hPa/hr</p>
        </div>
      </div>
    </div>
  );

  const renderWindSpeedContent = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-cyan-900/20 to-blue-900/20 backdrop-blur-xl rounded-2xl p-6 border border-cyan-500/20">
          <div className="flex items-center space-x-3 mb-4">
            <Wind className="w-8 h-8 text-cyan-400" />
            <h3 className="text-xl font-bold text-white">Wind Speed</h3>
          </div>
          <div className="text-4xl font-bold text-cyan-300 mb-2">
            {weather ? weather.windSpeed : '--'} m/s
          </div>
          <p className="text-gray-300">Current wind speed</p>
        </div>

        <div className="bg-gradient-to-br from-teal-900/20 to-cyan-900/20 backdrop-blur-xl rounded-2xl p-6 border border-teal-500/20">
          <div className="flex items-center space-x-3 mb-4">
            <Activity className="w-8 h-8 text-teal-400" />
            <h3 className="text-xl font-bold text-white">Wind Direction</h3>
          </div>
          <div className="text-4xl font-bold text-teal-300 mb-2">
            NW
          </div>
          <p className="text-gray-300">315° direction</p>
        </div>

        <div className="bg-gradient-to-br from-blue-900/20 to-indigo-900/20 backdrop-blur-xl rounded-2xl p-6 border border-blue-500/20">
          <div className="flex items-center space-x-3 mb-4">
            <TrendingUp className="w-8 h-8 text-blue-400" />
            <h3 className="text-xl font-bold text-white">Gusts</h3>
          </div>
          <div className="text-4xl font-bold text-blue-300 mb-2">
            {weather ? Math.round(weather.windSpeed * 1.5) : '--'} m/s
          </div>
          <p className="text-gray-300">Maximum gusts</p>
        </div>
      </div>
    </div>
  );

  const renderCloudsContent = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-gray-900/20 to-slate-900/20 backdrop-blur-xl rounded-2xl p-6 border border-gray-500/20">
          <div className="flex items-center space-x-3 mb-4">
            <Cloud className="w-8 h-8 text-gray-400" />
            <h3 className="text-xl font-bold text-white">Cloud Coverage</h3>
          </div>
          <div className="text-4xl font-bold text-gray-300 mb-2">
            {Math.floor(Math.random() * 100)}%
          </div>
          <p className="text-gray-300">Sky coverage</p>
        </div>

        <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/20">
          <div className="flex items-center space-x-3 mb-4">
            <Activity className="w-8 h-8 text-purple-400" />
            <h3 className="text-xl font-bold text-white">Visibility</h3>
          </div>
          <div className="text-4xl font-bold text-purple-300 mb-2">
            {weather ? (weather.visibility / 1000).toFixed(1) : '--'} km
          </div>
          <p className="text-gray-300">Atmospheric visibility</p>
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
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-red-900/20 to-orange-900/20 backdrop-blur-xl rounded-2xl p-6 border border-red-500/20">
        <h3 className="text-xl font-bold text-white mb-4">Active Weather Alerts</h3>
        <div className="space-y-4">
          <div className="p-4 bg-red-900/30 rounded-xl border border-red-500/30">
            <h4 className="text-red-300 font-semibold mb-2">High Wind Warning</h4>
            <p className="text-red-200 text-sm">Strong winds expected with gusts up to 65 mph. Secure loose objects.</p>
            <p className="text-red-400 text-xs mt-2">Valid until: Tomorrow 6:00 AM</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderReportsContent = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-blue-900/20 to-indigo-900/20 backdrop-blur-xl rounded-2xl p-6 border border-blue-500/20">
        <h3 className="text-xl font-bold text-white mb-4">Weather Reports</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-slate-800/50 rounded-xl">
            <h4 className="text-white font-semibold mb-2">Daily Summary</h4>
            <p className="text-gray-300 text-sm">Comprehensive daily weather analysis and trends.</p>
          </div>
          <div className="p-4 bg-slate-800/50 rounded-xl">
            <h4 className="text-white font-semibold mb-2">Weekly Forecast</h4>
            <p className="text-gray-300 text-sm">Extended 7-day weather predictions and patterns.</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMeteorologicalContent = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-purple-900/20 to-indigo-900/20 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/20">
        <h3 className="text-xl font-bold text-white mb-4">Meteorological Cases</h3>
        <div className="space-y-4">
          <div className="p-4 bg-slate-800/50 rounded-xl">
            <h4 className="text-purple-300 font-semibold mb-2">Storm System Analysis</h4>
            <p className="text-gray-300 text-sm">Detailed analysis of current and approaching weather systems.</p>
          </div>
          <div className="p-4 bg-slate-800/50 rounded-xl">
            <h4 className="text-cyan-300 font-semibold mb-2">Atmospheric Patterns</h4>
            <p className="text-gray-300 text-sm">Study of pressure systems and atmospheric dynamics.</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTariffsContent = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 backdrop-blur-xl rounded-2xl p-6 border border-green-500/20">
        <h3 className="text-xl font-bold text-white mb-4">Weather Service Tariffs</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-slate-800/50 rounded-xl text-center">
            <h4 className="text-green-300 font-semibold mb-2">Basic Plan</h4>
            <div className="text-2xl font-bold text-white mb-2">$9.99/mo</div>
            <p className="text-gray-300 text-sm">Standard weather data and forecasts</p>
          </div>
          <div className="p-4 bg-slate-800/50 rounded-xl text-center border border-cyan-400/30">
            <h4 className="text-cyan-300 font-semibold mb-2">Pro Plan</h4>
            <div className="text-2xl font-bold text-white mb-2">$19.99/mo</div>
            <p className="text-gray-300 text-sm">Advanced analytics and alerts</p>
          </div>
          <div className="p-4 bg-slate-800/50 rounded-xl text-center">
            <h4 className="text-purple-300 font-semibold mb-2">Enterprise</h4>
            <div className="text-2xl font-bold text-white mb-2">$49.99/mo</div>
            <p className="text-gray-300 text-sm">Full meteorological suite</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeMenu) {
      case 'home':
        return renderHomeContent();
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

  return (
    <div className="flex-1 p-8">
      {renderContent()}
    </div>
  );
};

export default DashboardContent;