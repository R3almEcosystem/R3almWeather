import React from 'react';
import { 
  Home, 
  AlertTriangle, 
  FileText, 
  CloudSnow, 
  DollarSign,
  Thermometer,
  CloudRain,
  Gauge,
  Wind,
  Cloud
} from 'lucide-react';

interface SidebarProps {
  activeMenu: string;
  activeSubMenu: string;
  onMenuChange: (menu: string) => void;
  onSubMenuChange: (subMenu: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  activeMenu, 
  activeSubMenu, 
  onMenuChange, 
  onSubMenuChange 
}) => {
  const mainMenuItems = [
    { id: 'home', label: 'Home', icon: <Home className="w-5 h-5" /> },
    { id: 'alerts', label: 'Weather Alerts', icon: <AlertTriangle className="w-5 h-5" /> },
    { id: 'reports', label: 'Reports', icon: <FileText className="w-5 h-5" /> },
    { id: 'meteorological', label: 'Meteorological Cases', icon: <CloudSnow className="w-5 h-5" /> },
    { id: 'tariffs', label: 'Tariffs', icon: <DollarSign className="w-5 h-5" /> }
  ];

  const homeSubMenuItems = [
    { id: 'temperature', label: 'Temperature', icon: <Thermometer className="w-4 h-4" /> },
    { id: 'precipitation', label: 'Precipitation', icon: <CloudRain className="w-4 h-4" /> },
    { id: 'pressure', label: 'Pressure', icon: <Gauge className="w-4 h-4" /> },
    { id: 'wind-speed', label: 'Wind Speed', icon: <Wind className="w-4 h-4" /> },
    { id: 'clouds', label: 'Clouds', icon: <Cloud className="w-4 h-4" /> }
  ];

  return (
    <div className="w-64 bg-gradient-to-b from-slate-900/95 to-slate-800/95 backdrop-blur-xl border-r border-slate-700/50 h-full flex flex-col">
      {/* Main Navigation */}
      <div className="p-6">
        <h2 className="text-white text-lg font-bold mb-6">Dashboard Menu</h2>
        <nav className="space-y-2">
          {mainMenuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onMenuChange(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 text-left ${
                activeMenu === item.id
                  ? 'bg-gradient-to-r from-purple-600/20 to-cyan-600/20 border border-cyan-400/30 text-cyan-300'
                  : 'text-gray-300 hover:bg-slate-800/50 hover:text-white'
              }`}
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Home Sub-menu */}
      {activeMenu === 'home' && (
        <div className="px-6 pb-6">
          <div className="border-t border-slate-700/50 pt-6">
            <h3 className="text-cyan-300 text-sm font-semibold mb-4 uppercase tracking-wide">
              Weather Metrics
            </h3>
            <nav className="space-y-1">
              {homeSubMenuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onSubMenuChange(item.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 text-left text-sm ${
                    activeSubMenu === item.id
                      ? 'bg-cyan-600/20 border border-cyan-400/30 text-cyan-300'
                      : 'text-gray-400 hover:bg-slate-800/30 hover:text-gray-300'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="mt-auto p-6 border-t border-slate-700/50">
        <div className="text-center">
          <p className="text-gray-400 text-xs">R3alm Weather</p>
          <p className="text-gray-500 text-xs">Dashboard v2.0</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;