import React from 'react';
import { AlertTriangle, Info, Shield, Zap } from 'lucide-react';

interface WeatherAlert {
  id: string;
  type: 'warning' | 'watch' | 'advisory' | 'info';
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'extreme';
  startTime: string;
  endTime: string;
}

interface WeatherAlertsProps {
  alerts: WeatherAlert[];
}

const WeatherAlerts: React.FC<WeatherAlertsProps> = ({ alerts }) => {
  if (!alerts || alerts.length === 0) {
    return (
      <div className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-green-500/20">
        <div className="flex items-center space-x-3 mb-4">
          <Shield className="w-7 h-7 text-green-400" />
          <h3 className="text-2xl font-bold text-white">Weather Alerts</h3>
        </div>
        <div className="flex items-center space-x-3 p-4 bg-green-900/20 rounded-xl border border-green-500/30">
          <Shield className="w-6 h-6 text-green-400" />
          <div>
            <p className="text-green-300 font-semibold">All Clear</p>
            <p className="text-green-200 text-sm">No active weather alerts for this location</p>
          </div>
        </div>
      </div>
    );
  }

  const getAlertIcon = (type: string, severity: string) => {
    const iconClass = severity === 'extreme' ? 'w-6 h-6 text-red-400' : 
                     severity === 'high' ? 'w-6 h-6 text-orange-400' :
                     severity === 'medium' ? 'w-6 h-6 text-yellow-400' : 'w-6 h-6 text-blue-400';

    switch (type) {
      case 'warning':
        return <AlertTriangle className={iconClass} />;
      case 'watch':
        return <Zap className={iconClass} />;
      default:
        return <Info className={iconClass} />;
    }
  };

  const getAlertColors = (severity: string) => {
    switch (severity) {
      case 'extreme':
        return 'bg-red-900/20 border-red-500/30 text-red-300';
      case 'high':
        return 'bg-orange-900/20 border-orange-500/30 text-orange-300';
      case 'medium':
        return 'bg-yellow-900/20 border-yellow-500/30 text-yellow-300';
      default:
        return 'bg-blue-900/20 border-blue-500/30 text-blue-300';
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-red-500/20 hover:border-red-400/40 transition-all duration-300">
      <div className="flex items-center space-x-3 mb-6">
        <AlertTriangle className="w-7 h-7 text-red-400" />
        <h3 className="text-2xl font-bold text-white">Weather Alerts</h3>
        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">{alerts.length}</span>
      </div>
      
      <div className="space-y-4">
        {alerts.map((alert) => (
          <div key={alert.id} className={`p-4 rounded-xl border ${getAlertColors(alert.severity)}`}>
            <div className="flex items-start space-x-3">
              {getAlertIcon(alert.type, alert.severity)}
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h4 className="font-bold text-lg">{alert.title}</h4>
                  <span className="text-xs px-2 py-1 bg-slate-700 rounded-full text-gray-300 uppercase">
                    {alert.type}
                  </span>
                </div>
                <p className="text-sm mb-3 opacity-90">{alert.description}</p>
                <div className="flex items-center space-x-4 text-xs opacity-75">
                  <span>From: {alert.startTime}</span>
                  <span>Until: {alert.endTime}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeatherAlerts;