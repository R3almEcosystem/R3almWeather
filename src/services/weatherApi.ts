// Secure API key — only from .env.local
const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

if (!API_KEY) {
  console.error('OpenWeatherMap API key is missing! Check VITE_OPENWEATHER_API_KEY in .env.local');
}

const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const ONECALL_URL = 'https://api.openweathermap.org/data/3.0/onecall';

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
  wind: { speed: number };
  visibility: number;
  name: string;
  sys: { country: string };
}

export interface ForecastResponse {
  list: Array<any>;
  city: { name: string; country: string };
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

const request = async <T>(url: string): Promise<T> => {
  const response = await fetch(url);
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `API request failed: ${response.status}`);
  }
  return response.json();
};

export const getCurrentWeather = (location: string) =>
  request<WeatherResponse>(`${BASE_URL}/weather?q=${encodeURIComponent(location)}&appid=${API_KEY}&units=metric`);

export const getCurrentWeatherByCoords = (lat: number, lon: number) =>
  request<WeatherResponse>(`${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);

export const getForecast = (location: string) =>
  request<ForecastResponse>(`${BASE_URL}/forecast?q=${encodeURIComponent(location)}&appid=${API_KEY}&units=metric`);

export const getForecastByCoords = (lat: number, lon: number) =>
  request<ForecastResponse>(`${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);

export const getWeatherAlerts = async (lat: number, lon: number): Promise<WeatherAlert[]> => {
  try {
    const data = await request<any>(`${ONECALL_URL}?lat=${lat}&lon=${lon}&exclude=current,minutely,hourly,daily&appid=${API_KEY}`);

    if (!data.alerts?.length) return [];

    return data.alerts.map((alert: any, i: number) => {
      const severity = determineSeverity(alert.event);
      const type = determineAlertType(alert.event);

      return {
        id: `${alert.start}-${i}`,
        type,
        title: alert.event,
        description: alert.description,
        severity,
        startTime: new Date(alert.start * 1000).toLocaleString(),
        endTime: new Date(alert.end * 1000).toLocaleString(),
      };
    });
  } catch (error) {
    console.warn('Alerts unavailable (possibly not supported in free tier):', error);
    return [];
  }
};

const determineSeverity = (event: string): 'low' | 'medium' | 'high' | 'extreme' => {
  const e = event.toLowerCase();
  if (/(extreme|severe|tornado|hurricane)/.test(e)) return 'extreme';
  if (/(warning|storm|flood)/.test(e)) return 'high';
  if (/(watch|advisory)/.test(e)) return 'medium';
  return 'low';
};

const determineAlertType = (event: string): 'warning' | 'watch' | 'advisory' | 'info' => {
  const e = event.toLowerCase();
  if (e.includes('warning')) return 'warning';
  if (e.includes('watch')) return 'watch';
  if (e.includes('advisory')) return 'advisory';
  return 'info';
};