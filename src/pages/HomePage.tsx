import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Cloud, Zap, Globe, TrendingUp, Settings } from 'lucide-react';
import LocationGrid from '../components/LocationGrid';
import AddLocationModal from '../components/AddLocationModal';
import { addLocation } from '../services/locationService';

const HomePage: React.FC = () => {
  const [isAddLocationModalOpen, setIsAddLocationModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleAddLocation = async (locationData: {
    name: string;
    country: string;
    description: string;
    coordinates: { lat: number; lon: number };
  }) => {
    const result = await addLocation(locationData);
    if (result) {
      setIsAddLocationModalOpen(false);
      setRefreshKey(prev => prev + 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 -left-40 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-40 right-1/3 w-60 h-60 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-16">
          {/* Settings Icon */}
          <div className="absolute top-8 right-8">
            <Link 
              to="/settings"
              className="p-3 bg-slate-800/80 backdrop-blur-xl hover:bg-slate-700/80 rounded-2xl text-white transition-all duration-200 border border-slate-700/50 hover:border-slate-600/50 group inline-block"
            >
              <Settings className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
            </Link>
          </div>

          <div className="flex items-center justify-center space-x-4 mb-6">
            <div className="p-4 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-3xl shadow-2xl">
              <Cloud className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-6xl font-bold bg-gradient-to-r from-white via-cyan-200 to-purple-300 bg-clip-text text-transparent">
              R3alm Weather
            </h1>
          </div>
          <p className="text-gray-300 text-2xl mb-8">Your Web3 Weather Experience</p>
          
          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <div className="flex items-center space-x-2 bg-slate-800/50 backdrop-blur-xl rounded-full px-6 py-3 border border-slate-700/50">
              <Zap className="w-5 h-5 text-yellow-400" />
              <span className="text-white font-medium">Real-time Data</span>
            </div>
            <div className="flex items-center space-x-2 bg-slate-800/50 backdrop-blur-xl rounded-full px-6 py-3 border border-slate-700/50">
              <Globe className="w-5 h-5 text-green-400" />
              <span className="text-white font-medium">Global Coverage</span>
            </div>
            <div className="flex items-center space-x-2 bg-slate-800/50 backdrop-blur-xl rounded-full px-6 py-3 border border-slate-700/50">
              <TrendingUp className="w-5 h-5 text-blue-400" />
              <span className="text-white font-medium">5-Day Forecasts</span>
            </div>
          </div>
        </header>

        {/* Location Grid */}
        <LocationGrid key={refreshKey} onAddLocation={() => setIsAddLocationModalOpen(true)} />

        {/* Footer */}
        <footer className="text-center mt-20 pb-8">
          <div className="text-gray-400 space-y-2">
            <p className="text-lg">Powered by OpenWeatherMap API</p>
            <p className="text-sm">Built for the R3alm Web3 Ecosystem</p>
            <div className="flex justify-center space-x-6 mt-4">
              <span className="text-cyan-400">•</span>
              <span className="text-purple-400">•</span>
              <span className="text-blue-400">•</span>
            </div>
          </div>
        </footer>
      </div>

      {/* Add Location Modal */}
      <AddLocationModal
        isOpen={isAddLocationModalOpen}
        onClose={() => setIsAddLocationModalOpen(false)}
        onAddLocation={handleAddLocation}
      />
    </div>
  );
};

export default HomePage;