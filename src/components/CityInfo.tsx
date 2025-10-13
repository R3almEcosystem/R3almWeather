import React from 'react';
import { MapPin, Users, Clock, Globe, Calendar } from 'lucide-react';

interface CityInfoProps {
  location: {
    name: string;
    country: string;
    description: string;
    coordinates: {
      lat: number;
      lon: number;
    };
  };
  currentTime?: string;
  population?: string;
  timezone?: string;
}

const CityInfo: React.FC<CityInfoProps> = ({ location, currentTime, population, timezone }) => {
  const getCurrentTime = () => {
    return new Date().toLocaleTimeString('en-US', {
      hour12: true,
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  const getCurrentDate = () => {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const cityData = [
    {
      icon: <MapPin className="w-5 h-5 text-cyan-400" />,
      label: 'Coordinates',
      value: `${location.coordinates.lat.toFixed(2)}°, ${location.coordinates.lon.toFixed(2)}°`
    },
    {
      icon: <Clock className="w-5 h-5 text-green-400" />,
      label: 'Local Time',
      value: currentTime || getCurrentTime()
    },
    {
      icon: <Calendar className="w-5 h-5 text-purple-400" />,
      label: 'Date',
      value: getCurrentDate()
    },
    {
      icon: <Users className="w-5 h-5 text-orange-400" />,
      label: 'Population',
      value: population || 'N/A'
    },
    {
      icon: <Globe className="w-5 h-5 text-blue-400" />,
      label: 'Timezone',
      value: timezone || Intl.DateTimeFormat().resolvedOptions().timeZone
    }
  ];

  return (
    <div className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-emerald-500/20 hover:border-emerald-400/40 transition-all duration-300">
      <h3 className="text-2xl font-bold text-white mb-6 flex items-center space-x-3">
        <Globe className="w-7 h-7 text-emerald-400" />
        <span>City Information</span>
      </h3>
      
      <div className="space-y-4 mb-6">
        <p className="text-gray-300 text-lg leading-relaxed">{location.description}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {cityData.map((item, index) => (
          <div key={index} className="flex items-center space-x-3 p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
            <div className="p-2 bg-slate-700/50 rounded-lg">
              {item.icon}
            </div>
            <div>
              <p className="text-gray-400 text-sm">{item.label}</p>
              <p className="text-white font-semibold">{item.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CityInfo;