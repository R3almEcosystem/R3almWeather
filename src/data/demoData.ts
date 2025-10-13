export interface DemoLocation {
  id: string;
  name: string;
  country: string;
  description: string;
  image: string;
  coordinates: {
    lat: number;
    lon: number;
  };
  featured?: boolean;
}

export const demoLocations: DemoLocation[] = [
  {
    id: 'tokyo',
    name: 'Tokyo',
    country: 'Japan',
    description: 'The bustling metropolis where tradition meets innovation',
    image: 'https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg?auto=compress&cs=tinysrgb&w=800',
    coordinates: { lat: 35.6762, lon: 139.6503 },
    featured: true
  },
  {
    id: 'new-york',
    name: 'New York',
    country: 'United States',
    description: 'The city that never sleeps, heart of global finance',
    image: 'https://images.pexels.com/photos/466685/pexels-photo-466685.jpeg?auto=compress&cs=tinysrgb&w=800',
    coordinates: { lat: 40.7128, lon: -74.0060 },
    featured: true
  },
  {
    id: 'london',
    name: 'London',
    country: 'United Kingdom',
    description: 'Historic capital bridging centuries of culture and commerce',
    image: 'https://images.pexels.com/photos/460672/pexels-photo-460672.jpeg?auto=compress&cs=tinysrgb&w=800',
    coordinates: { lat: 51.5074, lon: -0.1278 },
    featured: true
  },
  {
    id: 'singapore',
    name: 'Singapore',
    country: 'Singapore',
    description: 'The garden city-state, a hub of innovation and sustainability',
    image: 'https://images.pexels.com/photos/2265876/pexels-photo-2265876.jpeg?auto=compress&cs=tinysrgb&w=800',
    coordinates: { lat: 1.3521, lon: 103.8198 }
  },
  {
    id: 'dubai',
    name: 'Dubai',
    country: 'United Arab Emirates',
    description: 'Futuristic oasis where desert meets cutting-edge architecture',
    image: 'https://images.pexels.com/photos/1470502/pexels-photo-1470502.jpeg?auto=compress&cs=tinysrgb&w=800',
    coordinates: { lat: 25.2048, lon: 55.2708 }
  },
  {
    id: 'sydney',
    name: 'Sydney',
    country: 'Australia',
    description: 'Harbor city combining natural beauty with urban sophistication',
    image: 'https://images.pexels.com/photos/783682/pexels-photo-783682.jpeg?auto=compress&cs=tinysrgb&w=800',
    coordinates: { lat: -33.8688, lon: 151.2093 }
  },
  {
    id: 'paris',
    name: 'Paris',
    country: 'France',
    description: 'The city of light, where art and elegance converge',
    image: 'https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg?auto=compress&cs=tinysrgb&w=800',
    coordinates: { lat: 48.8566, lon: 2.3522 }
  },
  {
    id: 'san-francisco',
    name: 'San Francisco',
    country: 'United States',
    description: 'Tech capital by the bay, where innovation shapes the future',
    image: 'https://images.pexels.com/photos/208745/pexels-photo-208745.jpeg?auto=compress&cs=tinysrgb&w=800',
    coordinates: { lat: 37.7749, lon: -122.4194 }
  }
];

export const getDemoLocationById = (id: string): DemoLocation | undefined => {
  return demoLocations.find(location => location.id === id);
};

export const getFeaturedLocations = (): DemoLocation[] => {
  return demoLocations.filter(location => location.featured);
};

// Location management functions
let customLocations: DemoLocation[] = [];

export const addCustomLocation = (location: Omit<DemoLocation, 'id'>): DemoLocation => {
  const newLocation: DemoLocation = {
    ...location,
    id: `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    image: 'https://images.pexels.com/photos/1519088/pexels-photo-1519088.jpeg?auto=compress&cs=tinysrgb&w=800' // Default image
  };
  
  customLocations.push(newLocation);
  return newLocation;
};

export const getAllLocations = (): DemoLocation[] => {
  return [...demoLocations, ...customLocations];
};

export const getCustomLocations = (): DemoLocation[] => {
  return customLocations;
};

export const removeCustomLocation = (id: string): boolean => {
  const index = customLocations.findIndex(location => location.id === id);
  if (index > -1) {
    customLocations.splice(index, 1);
    return true;
  }
  return false;
};