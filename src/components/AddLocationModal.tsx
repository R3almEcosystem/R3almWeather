import React, { useState } from 'react';
import { X, MapPin, Plus, Search, Globe } from 'lucide-react';

interface AddLocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddLocation: (location: {
    name: string;
    country: string;
    description: string;
    coordinates: { lat: number; lon: number };
  }) => void;
}

const AddLocationModal: React.FC<AddLocationModalProps> = ({ isOpen, onClose, onAddLocation }) => {
  const [formData, setFormData] = useState({
    name: '',
    country: '',
    description: '',
    lat: '',
    lon: ''
  });
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const searchLocation = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setErrorMessage('');
      return;
    }

    setIsSearching(true);
    try {
      // Using OpenWeatherMap Geocoding API with environment variable
      const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
      const response = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=5&appid=${apiKey}`
      );
      const results = await response.json();
      setSearchResults(results);
    } catch (error) {
      console.error('Search failed:', error);
      setSearchResults([]);
      setErrorMessage('Failed to search location. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const selectSearchResult = (result: any) => {
    setErrorMessage('');
    setFormData({
      name: result.name,
      country: result.country,
      description: `${result.name}, ${result.state ? result.state + ', ' : ''}${result.country}`,
      lat: result.lat.toString(),
      lon: result.lon.toString()
    });
    setSearchResults([]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.country || !formData.lat || !formData.lon) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    onAddLocation({
      name: formData.name,
      country: formData.country,
      description: formData.description || `${formData.name}, ${formData.country}`,
      coordinates: {
        lat: parseFloat(formData.lat),
        lon: parseFloat(formData.lon)
      }
    });

    // Reset form
    setFormData({
      name: '',
      country: '',
      description: '',
      lat: '',
      lon: ''
    });
    setSearchResults([]);
    setErrorMessage('');
    onClose();
  };

  const handleModalOpen = () => {
    setErrorMessage('');
  };

  const getCurrentLocation = () => {
    setErrorMessage('');
    
    if (!navigator.geolocation) {
      setErrorMessage('Geolocation is not supported by this browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          // Reverse geocoding with environment variable
          const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
          const response = await fetch(
            `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${apiKey}`
          );
          const results = await response.json();
          
          if (results.length > 0) {
            const result = results[0];
            setFormData({
              name: result.name,
              country: result.country,
              description: `${result.name}, ${result.state ? result.state + ', ' : ''}${result.country}`,
              lat: latitude.toString(),
              lon: longitude.toString()
            });
          } else {
            setErrorMessage('No location found for these coordinates.');
          }
        } catch (error) {
          console.error('Reverse geocoding failed:', error);
          setErrorMessage('Failed to fetch location details.');
        }
      },
      (error) => {
        setErrorMessage('Unable to retrieve your location. Please try again.');
        console.error('Geolocation error:', error);
      }
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl rounded-3xl p-8 w-full max-w-2xl border border-slate-700/50 shadow-2xl animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <MapPin className="w-7 h-7 text-cyan-400" />
            <h2 className="text-2xl font-bold text-white">Add New Location</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-700/50 rounded-full transition-all duration-200"
          >
            <X className="w-6 h-6 text-gray-300" />
          </button>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 bg-red-900/20 border border-red-500/30 rounded-xl text-red-300 text-sm">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">Search Location</label>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  onChange={(e) => {
                    handleInputChange('name', e.target.value);
                    searchLocation(e.target.value);
                  }}
                  value={formData.name}
                  placeholder="e.g., Tokyo"
                  className="w-full bg-slate-700/50 border border-slate-600/50 rounded-xl py-3 pl-12 pr-6 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/30 transition-all duration-200"
                />
              </div>

              {isSearching && (
                <div className="mt-2 flex items-center space-x-2 text-gray-400">
                  <div className="w-4 h-4 border-2 border-t-purple-400 rounded-full animate-spin"></div>
                  <span>Searching...</span>
                </div>
              )}

              {searchResults.length > 0 && (
                <div className="mt-2 bg-slate-800/80 rounded-xl border border-slate-700/50 max-h-48 overflow-y-auto">
                  {searchResults.map((result, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => selectSearchResult(result)}
                      className="w-full text-left px-4 py-3 hover:bg-slate-700/50 transition-all duration-200 flex items-center space-x-3 border-b border-slate-700/50 last:border-b-0"
                    >
                      <Globe className="w-4 h-4 text-cyan-400" />
                      <span className="text-white">
                        {result.name}, {result.state ? `${result.state}, ` : ''}{result.country}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">Country *</label>
                <input
                  type="text"
                  value={formData.country}
                  onChange={(e) => handleInputChange('country', e.target.value)}
                  placeholder="e.g., Japan"
                  required
                  className="w-full bg-slate-700/50 border border-slate-600/50 rounded-xl py-3 px-4 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/30 transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">Latitude *</label>
                <input
                  type="number"
                  step="any"
                  value={formData.lat}
                  onChange={(e) => handleInputChange('lat', e.target.value)}
                  placeholder="e.g., 35.6762"
                  required
                  className="w-full bg-slate-700/50 border border-slate-600/50 rounded-xl py-3 px-4 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/30 transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">Longitude *</label>
                <input
                  type="number"
                  step="any"
                  value={formData.lon}
                  onChange={(e) => handleInputChange('lon', e.target.value)}
                  placeholder="e.g., 139.6503"
                  required
                  className="w-full bg-slate-700/50 border border-slate-600/50 rounded-xl py-3 px-4 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/30 transition-all duration-200"
                />
              </div>

              <div>
                <button
                  type="button"
                  onClick={getCurrentLocation}
                  className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 rounded-xl py-3 px-4 text-white font-medium transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <MapPin className="w-5 h-5" />
                  <span>Use Current Location</span>
                </button>
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-gray-300 text-sm font-medium mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Brief description of the location..."
                rows={3}
                className="w-full bg-slate-700/50 border border-slate-600/50 rounded-xl py-3 px-4 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/30 transition-all duration-200 resize-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-slate-700/50 hover:bg-slate-600/50 rounded-xl text-white font-medium transition-all duration-200 border border-slate-600/50 hover:border-slate-500/50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!formData.name || !formData.country || !formData.lat || !formData.lon}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 disabled:from-gray-600 disabled:to-gray-500 rounded-xl text-white font-medium transition-all duration-200 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Add Location</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddLocationModal;