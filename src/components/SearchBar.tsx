import React, { useState } from 'react';
import { Search, MapPin } from 'lucide-react';

interface SearchBarProps {
  onSearch: (location: string) => void;
  onCurrentLocation: () => void;
  loading: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, onCurrentLocation, loading }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      setQuery('');
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto mb-8">
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex items-center space-x-3">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for a city..."
              className="w-full bg-slate-800/80 backdrop-blur-xl border border-slate-600/50 rounded-2xl py-4 pl-12 pr-6 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 transition-all duration-200"
              disabled={loading}
            />
          </div>
          
          <button
            type="button"
            onClick={onCurrentLocation}
            disabled={loading}
            className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 disabled:from-gray-600 disabled:to-gray-500 p-4 rounded-2xl text-white transition-all duration-200 shadow-lg disabled:cursor-not-allowed"
            title="Use current location"
          >
            <MapPin className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchBar;