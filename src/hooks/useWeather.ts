// src/utils/demoData.ts
export interface DemoLocation {
  id: string;
  name: string;
  country: string;
  description: string;
  image: string;
  coordinates: { lat: number; lon: number };
  featured?: boolean;
}

const DEMO_LOCATIONS: DemoLocation[] = [
  // ... (same as before - unchanged)
];

const STORAGE_KEY = 'r3alm-custom-locations';

const loadCustomLocations = (): DemoLocation[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveCustomLocations = (locations: DemoLocation[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(locations));
};

let customLocations = loadCustomLocations();

export const demoLocations = DEMO_LOCATIONS;
export const getDemoLocationById = (id: string) => demoLocations.find(l => l.id === id);
export const getFeaturedLocations = () => demoLocations.filter(l => l.featured);

export const addCustomLocation = (loc: Omit<DemoLocation, 'id'>): DemoLocation => {
  const newLoc = {
    ...loc,
    id: `custom-${Date.now()}`,
    image: loc.image || 'https://images.pexels.com/photos/1519088/pexels-photo-1519088.jpeg?auto=compress&cs=tinysrgb&w=800'
  };
  customLocations.push(newLoc);
  saveCustomLocations(customLocations);
  return newLoc;
};

export const getAllLocations = () => [...demoLocations, ...customLocations];
export const getCustomLocations = () => [...customLocations];
export const removeCustomLocation = (id: string) => {
  customLocations = customLocations.filter(l => l.id !== id);
  saveCustomLocations(customLocations);
  return true;
};