import React, { useState } from 'react';
import { MapPin, ArrowRight, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Location } from '../lib/supabase';
import { deleteLocation } from '../services/locationService';

interface LocationCardProps {
  location: Location;
  featured?: boolean;
  onDelete?: () => void;
}

const LocationCard: React.FC<LocationCardProps> = ({ location, featured = false, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!location.is_custom) return;

    if (!confirm(`Are you sure you want to remove ${location.name}?`)) {
      return;
    }

    setIsDeleting(true);
    const success = await deleteLocation(location.id);

    if (success && onDelete) {
      onDelete();
    } else {
      setIsDeleting(false);
    }
  };
  return (
    <Link 
      to={`/location/${location.id}`}
      className="group block"
    >
      <div className={`
        relative overflow-hidden rounded-3xl shadow-2xl transition-all duration-500 
        hover:scale-105 hover:shadow-cyan-500/25 cursor-pointer
        ${featured ? 'h-80' : 'h-64'}
        bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl
        border border-slate-700/50 hover:border-cyan-400/50
      `}>
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src={location.image} 
            alt={location.name}
            className="w-full h-full object-cover opacity-30 group-hover:opacity-40 transition-opacity duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/40 to-transparent"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 p-6 h-full flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-cyan-400" />
              <span className="text-cyan-300 text-sm font-medium">{location.country}</span>
            </div>
            <div className="flex items-center space-x-2">
              {featured && (
                <div className="bg-gradient-to-r from-purple-600 to-cyan-600 px-3 py-1 rounded-full">
                  <span className="text-white text-xs font-bold">FEATURED</span>
                </div>
              )}
              {location.is_custom && (
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="p-2 bg-red-600/20 hover:bg-red-600/40 rounded-lg text-red-400 hover:text-red-300 transition-all duration-200 opacity-0 group-hover:opacity-100 disabled:opacity-50"
                  title="Delete location"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <h3 className={`font-bold text-white group-hover:text-cyan-300 transition-colors duration-300 ${
              featured ? 'text-3xl' : 'text-2xl'
            }`}>
              {location.name}
            </h3>
            
            <p className="text-gray-300 text-sm leading-relaxed">
              {location.description}
            </p>

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center space-x-2 text-cyan-400 group-hover:text-cyan-300 transition-colors duration-300">
                <span className="text-sm font-medium">View Dashboard</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            </div>
          </div>
        </div>

        {/* Hover Glow Effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-cyan-600/10 rounded-3xl"></div>
        </div>
      </div>
    </Link>
  );
};

export default LocationCard;