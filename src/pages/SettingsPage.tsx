import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Settings, 
  Thermometer, 
  Key, 
  Bell, 
  Palette, 
  Globe, 
  Shield,
  Save,
  RotateCcw,
  Eye,
  EyeOff,
  Check,
  X
} from 'lucide-react';

interface SettingsData {
  apiKey: string;
  temperatureUnit: 'C' | 'F';
  windSpeedUnit: 'ms' | 'kmh' | 'mph';
  pressureUnit: 'hPa' | 'inHg' | 'mmHg';
  timeFormat: '12h' | '24h';
  language: string;
  notifications: {
    weatherAlerts: boolean;
    dailyForecast: boolean;
    severeWeather: boolean;
  };
  theme: 'dark' | 'light' | 'auto';
  autoLocation: boolean;
  refreshInterval: number;
}

const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<SettingsData>({
    apiKey: '',
    temperatureUnit: 'C',
    windSpeedUnit: 'ms',
    pressureUnit: 'hPa',
    timeFormat: '12h',
    language: 'en',
    notifications: {
      weatherAlerts: true,
      dailyForecast: false,
      severeWeather: true,
    },
    theme: 'dark',
    autoLocation: true,
    refreshInterval: 10,
  });

  const [showApiKey, setShowApiKey] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [hasChanges, setHasChanges] = useState(false);
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [testMessage, setTestMessage] = useState('');

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('r3alm-weather-settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings(prev => ({ ...prev, ...parsed }));
      } catch (error) {
        console.error('Failed to load settings:', error);
      }
    }

    // Load API key from environment or localStorage
    const envApiKey = import.meta.env.VITE_OPENWEATHER_API_KEY || '4fe43bcbf16c9bb51b01b8197eaadc02';
    if (envApiKey) {
      setSettings(prev => ({ ...prev, apiKey: envApiKey }));
    }
  }, []);

  const handleSettingChange = (key: keyof SettingsData, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleNotificationChange = (key: keyof SettingsData['notifications'], value: boolean) => {
    setSettings(prev => ({
      ...prev,
      notifications: { ...prev.notifications, [key]: value }
    }));
    setHasChanges(true);
  };

  const testApiKey = async () => {
    if (!settings.apiKey.trim()) {
      setTestStatus('error');
      setTestMessage('Please enter an API key first');
      setTimeout(() => setTestStatus('idle'), 3000);
      return;
    }

    setTestStatus('testing');
    setTestMessage('');

    try {
      // Test API key with a simple weather request for London
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=London&appid=${settings.apiKey}&units=metric`
      );
      
      if (response.ok) {
        const data = await response.json();
        setTestStatus('success');
        setTestMessage(`API key is valid! Test location: ${data.name}, ${data.sys.country}`);
      } else {
        const errorData = await response.json();
        setTestStatus('error');
        setTestMessage(`API Error: ${errorData.message || 'Invalid API key or request failed'}`);
      }
    } catch (error) {
      setTestStatus('error');
      setTestMessage('Network error: Unable to connect to OpenWeatherMap API');
    }

    // Reset status after 5 seconds
    setTimeout(() => {
      setTestStatus('idle');
      setTestMessage('');
    }, 5000);
  };

  const saveSettings = async () => {
    setSaveStatus('saving');
    try {
      // Save to localStorage
      localStorage.setItem('r3alm-weather-settings', JSON.stringify(settings));
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSaveStatus('saved');
      setHasChanges(false);
      
      // Reset status after 2 seconds
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }
  };

  const resetSettings = () => {
    const defaultSettings: SettingsData = {
      apiKey: import.meta.env.VITE_OPENWEATHER_API_KEY || '4fe43bcbf16c9bb51b01b8197eaadc02',
      temperatureUnit: 'C',
      windSpeedUnit: 'ms',
      pressureUnit: 'hPa',
      timeFormat: '12h',
      language: 'en',
      notifications: {
        weatherAlerts: true,
        dailyForecast: false,
        severeWeather: true,
      },
      theme: 'dark',
      autoLocation: true,
      refreshInterval: 10,
    };
    setSettings(defaultSettings);
    setHasChanges(true);
  };

  const getSaveButtonContent = () => {
    switch (saveStatus) {
      case 'saving':
        return (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Saving...</span>
          </>
        );
      case 'saved':
        return (
          <>
            <Check className="w-5 h-5" />
            <span>Saved!</span>
          </>
        );
      case 'error':
        return (
          <>
            <X className="w-5 h-5" />
            <span>Error</span>
          </>
        );
      default:
        return (
          <>
            <Save className="w-5 h-5" />
            <span>Save Settings</span>
          </>
        );
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

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link 
              to="/" 
              className="inline-flex items-center space-x-2 bg-slate-900/80 backdrop-blur-xl hover:bg-slate-800/80 px-4 py-2 rounded-xl text-white transition-all duration-200 border border-slate-700/50 hover:border-slate-600/50"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Home</span>
            </Link>
            
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-2xl">
                <Settings className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white">Settings</h1>
                <p className="text-gray-300">Configure your R3alm Weather experience</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            <button
              onClick={resetSettings}
              className="inline-flex items-center space-x-2 bg-slate-800/80 backdrop-blur-xl hover:bg-slate-700/80 px-4 py-2 rounded-xl text-white transition-all duration-200 border border-slate-700/50 hover:border-slate-600/50"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset</span>
            </button>
            
            <button
              onClick={saveSettings}
              disabled={!hasChanges || saveStatus === 'saving'}
              className={`inline-flex items-center space-x-2 px-6 py-2 rounded-xl font-medium transition-all duration-200 ${
                hasChanges && saveStatus !== 'saving'
                  ? 'bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white'
                  : 'bg-slate-700/50 text-gray-400 cursor-not-allowed'
              }`}
            >
              {getSaveButtonContent()}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* API Configuration */}
          <div className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-red-500/20 hover:border-red-400/40 transition-all duration-300">
            <div className="flex items-center space-x-3 mb-6">
              <Key className="w-7 h-7 text-red-400" />
              <h2 className="text-2xl font-bold text-white">API Configuration</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  OpenWeatherMap API Key
                </label>
                <div className="relative">
                  <input
                    type={showApiKey ? 'text' : 'password'}
                    value={settings.apiKey}
                    onChange={(e) => handleSettingChange('apiKey', e.target.value)}
                    placeholder="Enter your API key..."
                    className="w-full bg-slate-800/50 border border-slate-600/50 rounded-xl py-3 px-4 pr-12 text-white placeholder-gray-400 focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-400/30 transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {showApiKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <p className="text-gray-400 text-xs mt-2">
                  Get your free API key from{' '}
                  <a href="https://openweathermap.org/api" target="_blank" rel="noopener noreferrer" className="text-red-400 hover:text-red-300">
                    OpenWeatherMap.org
                  </a>
                </p>
              </div>
              
              <div className="mt-4">
                <button
                  type="button"
                  onClick={testApiKey}
                  disabled={testStatus === 'testing' || !settings.apiKey.trim()}
                  className={`inline-flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                    testStatus === 'testing'
                      ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
                      : testStatus === 'success'
                      ? 'bg-green-600 hover:bg-green-500 text-white'
                      : testStatus === 'error'
                      ? 'bg-red-600 hover:bg-red-500 text-white'
                      : 'bg-red-600 hover:bg-red-500 text-white disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed'
                  }`}
                >
                  {testStatus === 'testing' ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Testing...</span>
                    </>
                  ) : testStatus === 'success' ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>API Key Valid</span>
                    </>
                  ) : testStatus === 'error' ? (
                    <>
                      <X className="w-4 h-4" />
                      <span>Test Failed</span>
                    </>
                  ) : (
                    <>
                      <Key className="w-4 h-4" />
                      <span>Test API Key</span>
                    </>
                  )}
                </button>
                
                {testMessage && (
                  <div className={`mt-3 p-3 rounded-xl border ${
                    testStatus === 'success'
                      ? 'bg-green-900/20 border-green-500/30 text-green-300'
                      : 'bg-red-900/20 border-red-500/30 text-red-300'
                  }`}>
                    <p className="text-sm">{testMessage}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Units & Display */}
          <div className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-cyan-500/20 hover:border-cyan-400/40 transition-all duration-300">
            <div className="flex items-center space-x-3 mb-6">
              <Thermometer className="w-7 h-7 text-cyan-400" />
              <h2 className="text-2xl font-bold text-white">Units & Display</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-3">Temperature Unit</label>
                <div className="flex space-x-3">
                  {[
                    { value: 'C', label: 'Celsius (°C)' },
                    { value: 'F', label: 'Fahrenheit (°F)' }
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleSettingChange('temperatureUnit', option.value)}
                      className={`flex-1 py-3 px-4 rounded-xl border transition-all duration-200 ${
                        settings.temperatureUnit === option.value
                          ? 'bg-cyan-600/20 border-cyan-400 text-cyan-300'
                          : 'bg-slate-800/50 border-slate-600/50 text-gray-300 hover:border-slate-500/50'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-3">Wind Speed Unit</label>
                <select
                  value={settings.windSpeedUnit}
                  onChange={(e) => handleSettingChange('windSpeedUnit', e.target.value)}
                  className="w-full bg-slate-800/50 border border-slate-600/50 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 transition-all duration-200"
                >
                  <option value="ms">Meters per second (m/s)</option>
                  <option value="kmh">Kilometers per hour (km/h)</option>
                  <option value="mph">Miles per hour (mph)</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-3">Time Format</label>
                <div className="flex space-x-3">
                  {[
                    { value: '12h', label: '12 Hour' },
                    { value: '24h', label: '24 Hour' }
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleSettingChange('timeFormat', option.value)}
                      className={`flex-1 py-3 px-4 rounded-xl border transition-all duration-200 ${
                        settings.timeFormat === option.value
                          ? 'bg-cyan-600/20 border-cyan-400 text-cyan-300'
                          : 'bg-slate-800/50 border-slate-600/50 text-gray-300 hover:border-slate-500/50'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-yellow-500/20 hover:border-yellow-400/40 transition-all duration-300">
            <div className="flex items-center space-x-3 mb-6">
              <Bell className="w-7 h-7 text-yellow-400" />
              <h2 className="text-2xl font-bold text-white">Notifications</h2>
            </div>
            
            <div className="space-y-4">
              {[
                { key: 'weatherAlerts', label: 'Weather Alerts', description: 'Severe weather warnings and advisories' },
                { key: 'dailyForecast', label: 'Daily Forecast', description: 'Daily weather summary notifications' },
                { key: 'severeWeather', label: 'Severe Weather', description: 'Critical weather emergency alerts' }
              ].map((notification) => (
                <div key={notification.key} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                  <div>
                    <h4 className="text-white font-semibold">{notification.label}</h4>
                    <p className="text-gray-400 text-sm">{notification.description}</p>
                  </div>
                  <button
                    onClick={() => handleNotificationChange(notification.key as keyof SettingsData['notifications'], !settings.notifications[notification.key as keyof SettingsData['notifications']])}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                      settings.notifications[notification.key as keyof SettingsData['notifications']]
                        ? 'bg-yellow-500'
                        : 'bg-slate-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                        settings.notifications[notification.key as keyof SettingsData['notifications']]
                          ? 'translate-x-6'
                          : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Preferences */}
          <div className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-purple-500/20 hover:border-purple-400/40 transition-all duration-300">
            <div className="flex items-center space-x-3 mb-6">
              <Globe className="w-7 h-7 text-purple-400" />
              <h2 className="text-2xl font-bold text-white">Preferences</h2>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                <div>
                  <h4 className="text-white font-semibold">Auto-detect Location</h4>
                  <p className="text-gray-400 text-sm">Automatically use your current location</p>
                </div>
                <button
                  onClick={() => handleSettingChange('autoLocation', !settings.autoLocation)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                    settings.autoLocation ? 'bg-purple-500' : 'bg-slate-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                      settings.autoLocation ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-3">
                  Data Refresh Interval (minutes)
                </label>
                <select
                  value={settings.refreshInterval}
                  onChange={(e) => handleSettingChange('refreshInterval', parseInt(e.target.value))}
                  className="w-full bg-slate-800/50 border border-slate-600/50 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/30 transition-all duration-200"
                >
                  <option value={5}>5 minutes</option>
                  <option value={10}>10 minutes</option>
                  <option value={15}>15 minutes</option>
                  <option value={30}>30 minutes</option>
                  <option value={60}>1 hour</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-3">Language</label>
                <select
                  value={settings.language}
                  onChange={(e) => handleSettingChange('language', e.target.value)}
                  className="w-full bg-slate-800/50 border border-slate-600/50 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/30 transition-all duration-200"
                >
                  <option value="en">English</option>
                  <option value="es">Español</option>
                  <option value="fr">Français</option>
                  <option value="de">Deutsch</option>
                  <option value="ja">日本語</option>
                  <option value="zh">中文</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center mt-16 pb-8">
          <div className="text-gray-400">
            <p className="mb-2">R3alm Weather Dashboard Settings</p>
            <p className="text-sm">Configure your personalized weather experience</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default SettingsPage;