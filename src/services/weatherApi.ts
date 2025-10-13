const getApiKey = () => {
  // Try to get from localStorage first (user settings)
  const savedSettings = localStorage.getItem('r3alm-weather-settings');
  if (savedSettings) {
    try {
      const settings = JSON.parse(savedSettings);
      if (settings.apiKey && settings.apiKey.trim()) {
        return settings.apiKey.trim();
      }
    } catch (error) {
      console.error('Failed to parse saved settings:', error);
    }
  }
  
  // Fallback to environment variable
  return import.meta.env.VITE_OPENWEATHER_API_KEY || '4fe43bcbf16c9bb51b01b8197eaadc02';
};
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export interface WeatherResponse {
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
  };
  weather: Array<{
    main: string;
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number;
  };
  visibility: number;
  name: string;
  sys: {
    country: string;
  };
}

export interface ForecastResponse {
  list: Array<{
    dt: number;
    main: {
      temp_max: number;
      temp_min: number;
      pressure: number;
      humidity: number;
    };
    weather: Array<{
      main: string;
      description: string;
      icon: string;
    }>;
    wind: {
      speed: number;
    };
    clouds: {
      all: number;
    };
    pop?: number;
  }>;
  city: {
    name: string;
    country: string;
  };
}

export interface WeatherAlert {
  id: string;
  type: 'warning' | 'watch' | 'advisory' | 'info';
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'extreme';
  startTime: string;
  endTime: string;
}

export interface OneCallResponse {
  alerts?: Array<{
    sender_name: string;
    event: string;
    start: number;
    end: number;
    description: string;
    tags: string[];
  }>;
}

export const getCurrentWeather = async (location: string): Promise<WeatherResponse> => {
  const API_KEY = getApiKey();
  const response = await fetch(
    `${BASE_URL}/weather?q=${encodeURIComponent(location)}&appid=${API_KEY}&units=metric`
  );
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error('Weather API Error:', response.status, errorData);
    throw new Error(`Weather data not found for "${location}"`);
  }
  
  return response.json();
};

export const getCurrentWeatherByCoords = async (lat: number, lon: number): Promise<WeatherResponse> => {
  const API_KEY = getApiKey();
  const response = await fetch(
    `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
  );
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error('Weather API Error:', response.status, errorData);
    throw new Error('Weather data not found for your location');
  }
  
  return response.json();
};

export const getForecast = async (location: string): Promise<ForecastResponse> => {
  const API_KEY = getApiKey();
  const response = await fetch(
    `${BASE_URL}/forecast?q=${encodeURIComponent(location)}&appid=${API_KEY}&units=metric`
  );
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error('Forecast API Error:', response.status, errorData);
    throw new Error(`Forecast data not found for "${location}"`);
  }
  
  return response.json();
};

export const getForecastByCoords = async (lat: number, lon: number): Promise<ForecastResponse> => {
  const API_KEY = getApiKey();
  const response = await fetch(
    `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error('Forecast API Error:', response.status, errorData);
    throw new Error('Forecast data not found for your location');
  }

  return response.json();
};

export const getWeatherAlerts = async (lat: number, lon: number): Promise<WeatherAlert[]> => {
  const API_KEY = getApiKey();

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,daily,current&appid=${API_KEY}`
    );

    if (!response.ok) {
      console.warn('Weather alerts API returned non-OK status:', response.status);
      return [];
    }

    const data: OneCallResponse = await response.json();

    if (!data.alerts || data.alerts.length === 0) {
      return [];
    }

    return data.alerts.map((alert, index) => {
      const severity = determineSeverity(alert.event);
      const type = determineAlertType(alert.event);

      return {
        id: `${alert.start}-${index}`,
        type,
        title: alert.event,
        description: alert.description,
        severity,
        startTime: new Date(alert.start * 1000).toLocaleString(),
        endTime: new Date(alert.end * 1000).toLocaleString()
      };
    });
  } catch (error) {
    console.error('Failed to fetch weather alerts:', error);
    return [];
  }
};

const determineSeverity = (event: string): 'low' | 'medium' | 'high' | 'extreme' => {
  const eventLower = event.toLowerCase();

  if (eventLower.includes('extreme') || eventLower.includes('severe') ||
      eventLower.includes('tornado') || eventLower.includes('hurricane')) {
    return 'extreme';
  }

  if (eventLower.includes('warning') || eventLower.includes('storm') ||
      eventLower.includes('flood')) {
    return 'high';
  }

  if (eventLower.includes('watch') || eventLower.includes('advisory')) {
    return 'medium';
  }

  return 'low';
};

const determineAlertType = (event: string): 'warning' | 'watch' | 'advisory' | 'info' => {
  const eventLower = event.toLowerCase();

  if (eventLower.includes('warning')) {
    return 'warning';
  }

  if (eventLower.includes('watch')) {
    return 'watch';
  }

  if (eventLower.includes('advisory')) {
    return 'advisory';
  }

  return 'info';
};