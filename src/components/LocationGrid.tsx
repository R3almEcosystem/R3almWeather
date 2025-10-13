import React, { useEffect, useState } from 'react';
import { Globe, Plus } from 'lucide-react';
import LocationCard from './LocationCard';
import { getAllLocations, getFeaturedLocations, getCustomLocations } from '../services/locationService';
import type { Location } from '../lib/supabase';

interface LocationGridProps {
  onAddLocation: () => void;
}

const LocationGrid: React.FC<LocationGridProps> = ({ onAddLocation }) => {
  const [featuredLocations, setFeaturedLocations] = useState<Location[]>([]);
  const [customLocations, setCustomLocations] = useState<Location[]>([]);
  const [regularLocations, setRegularLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLocations();
  }, []);

  const loadLocations = async () => {
    setLoading(true);
    const [allLocs, featuredLocs, customLocs] = await Promise.all([
      getAllLocations(),
      getFeaturedLocations(),
      getCustomLocations()
    ]);

    setFeaturedLocations(featuredLocs);
    setCustomLocations(customLocs);
    setRegularLocations(allLocs.filter(location => !location.featured));
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-slate-600 border-t-cyan-400 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading locations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Featured Locations */}
      {featuredLocations.length > 0 && (
        <section>
          <div className="flex items-center space-x-3 mb-8">
            <div className="p-2 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-xl">
              <Globe className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white">Featured Locations</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredLocations.map((location) => (
              <LocationCard
                key={location.id}
                location={location}
                featured={true}
                onDelete={() => loadLocations()}
              />
            ))}
          </div>
        </section>
      )}

      {/* Custom Locations */}
      {customLocations.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white">Your Locations</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {customLocations.map((location) => (
              <LocationCard
                key={location.id}
                location={location}
                onDelete={() => loadLocations()}
              />
            ))}
          </div>
        </section>
      )}

      {/* All Locations */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-slate-700 to-slate-600 rounded-xl">
              <Globe className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white">Explore More Cities</h2>
          </div>
          
          <button
            onClick={onAddLocation}
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 px-6 py-3 rounded-xl text-white font-medium transition-all duration-200 shadow-lg"
          >
            <Plus className="w-5 h-5" />
            <span>Add Location</span>
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Add Location Card */}
          <button
            onClick={onAddLocation}
            className="group h-64 bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl rounded-3xl shadow-2xl border-2 border-dashed border-slate-600/50 hover:border-cyan-400/50 transition-all duration-300 hover:scale-105 flex flex-col items-center justify-center space-y-4"
          >
            <div className="p-4 bg-gradient-to-r from-purple-600/20 to-cyan-600/20 rounded-full group-hover:from-purple-500/30 group-hover:to-cyan-500/30 transition-all duration-300">
              <Plus className="w-12 h-12 text-cyan-400 group-hover:text-cyan-300" />
            </div>
            <div className="text-center">
              <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors duration-300">
                Add New Location
              </h3>
              <p className="text-gray-400 text-sm mt-2">
                Add your favorite cities
              </p>
            </div>
          </button>

          {regularLocations.map((location) => (
            <LocationCard
              key={location.id}
              location={location}
              onDelete={() => loadLocations()}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default LocationGrid;