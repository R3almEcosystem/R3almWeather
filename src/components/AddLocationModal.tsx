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
      // Using OpenWeatherMap Geocoding API
      const response = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=5&appid=4fe43bcbf16c9bb51b01b8197eaadc02`
      );
      const results = await response.json();
      setSearchResults(results);
    } catch (error) {
      console.error('Search failed:', error);
      setSearchResults([]);
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
          // Reverse geocoding to get location name
          const response = await fetch(
            `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=4fe43bcbf16c9bb51b01b8197eaadc02`
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
          }
        } catch (error) {
          console.error('Reverse geocoding failed:', error);
          setFormData(prev => ({
            ...prev,
            lat: latitude.toString(),
            lon: longitude.toString()
          }));
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
        let errorMsg = 'Unable to get your location';
        if (error.code === error.PERMISSION_DENIED) {
          errorMsg = 'Location access denied. Please enable location permissions or search manually.';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          errorMsg = 'Location information unavailable. Please search manually.';
        } else if (error.code === error.TIMEOUT) {
          errorMsg = 'Location request timed out. Please try again or search manually.';
        }
        setErrorMessage(errorMsg);
      }
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-slate-700/50 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-2xl">
              <Plus className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white">Add New Location</h2>
              <p className="text-gray-300">Add a city to your weather dashboard</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-slate-800/80 hover:bg-slate-700/80 rounded-xl text-white transition-all duration-200 border border-slate-700/50 hover:border-slate-600/50"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Search Section */}
          <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
              <Search className="w-6 h-6 text-cyan-400" />
              <span>Search for a City</span>
            </h3>
            
            <div className="relative mb-4">
              <input
                type="text"
                placeholder="Search for a city (e.g., Tokyo, New York, London)..."
                onChange={(e) => searchLocation(e.target.value)}
                className="w-full bg-slate-700/50 border border-slate-600/50 rounded-xl py-3 px-4 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 transition-all duration-200"
              />
              {isSearching && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="w-5 h-5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="space-y-2 mb-4">
                {searchResults.map((result, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => selectSearchResult(result)}
                    className="w-full text-left p-3 bg-slate-700/50 hover:bg-slate-600/50 rounded-xl border border-slate-600/50 hover:border-slate-500/50 transition-all duration-200"
                  >
                    <div className="flex items-center space-x-3">
                      <MapPin className="w-5 h-5 text-cyan-400" />
                      <div>
                        <p className="text-white font-semibold">{result.name}</p>
                        <p className="text-gray-400 text-sm">
                          {result.state ? `${result.state}, ` : ''}{result.country} • {result.lat.toFixed(2)}, {result.lon.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Error Message */}
            {errorMessage && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-xl">
                <p className="text-red-300 text-sm">{errorMessage}</p>
              </div>
            )}

            <button
              type="button"
              onClick={getCurrentLocation}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 px-4 py-3 rounded-xl text-white font-medium transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <Globe className="w-5 h-5" />
              <span>Use Current Location</span>
            </button>
          </div>

          {/* Manual Entry Section */}
          <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
              <MapPin className="w-6 h-6 text-purple-400" />
              <span>Location Details</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">City Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="e.g., Tokyo"
                  required
                  className="w-full bg-slate-700/50 border border-slate-600/50 rounded-xl py-3 px-4 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/30 transition-all duration-200"
                />
              </div>

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

          {/* Action Buttons */}
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