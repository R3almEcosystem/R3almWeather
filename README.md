# R3alm Weather Dashboard

A beautiful, modern weather dashboard built for the R3alm Web3 ecosystem, powered by the OpenWeatherMap API.

## Features

- **Real-time Weather Data**: Current conditions, temperature, humidity, wind speed, and more
- **5-Day Forecast**: Extended weather predictions with daily highs and lows
- **Location Search**: Search for weather in any city worldwide
- **Geolocation Support**: Automatic detection of your current location
- **Temperature Units**: Toggle between Celsius and Fahrenheit
- **Web3 Design**: Modern, dark theme with neon gradients and glassmorphism effects
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices

## Setup Instructions

### 1. Get OpenWeatherMap API Key

1. Visit [OpenWeatherMap](https://openweathermap.org/api)
2. Sign up for a free account
3. Navigate to the API Keys section
4. Copy your API key

### 2. Configure Environment Variables

1. Copy `.env.example` to `.env`
2. Replace `your_api_key_here` with your actual OpenWeatherMap API key:

```
VITE_OPENWEATHER_API_KEY=your_actual_api_key_here
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Start Development Server

```bash
npm run dev
```

## Technologies Used

- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Vite** for build tooling
- **OpenWeatherMap API** for weather data
- **Lucide React** for icons

## API Usage

The dashboard uses the following OpenWeatherMap API endpoints:
- Current Weather Data API
- 5 Day Weather Forecast API

## Design Features

- **Dark Web3 Theme**: Inspired by blockchain and crypto aesthetics
- **Glassmorphism Effects**: Semi-transparent cards with backdrop blur
- **Gradient Backgrounds**: Purple, cyan, and blue color schemes
- **Smooth Animations**: Hover effects and loading states
- **Responsive Layout**: Grid-based design that adapts to all screen sizes

## Browser Support

- Modern browsers with ES2020 support
- Geolocation API support for automatic location detection

## License

Built for the R3alm Web3 Ecosystem