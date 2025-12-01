import { supabase, type Location } from '../lib/supabase';

export const getAllLocations = async (): Promise<Location[]> => {
  const { data, error } = await supabase
    .from('locations')
    .select('*')
    .order('featured', { ascending: false })
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching all locations:', error);
    return [];
  }

  return data || [];
};

export const getLocationById = async (id: string): Promise<Location | null> => {
  const { data, error } = await supabase
    .from('locations')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    console.error('Error fetching location by ID:', error);
    return null;
  }

  return data;
};

export const getFeaturedLocations = async (): Promise<Location[]> => {
  const { data, error } = await supabase
    .from('locations')
    .select('*')
    .eq('featured', true)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching featured locations:', error);
    return [];
  }

  return data || [];
};

export const getCustomLocations = async (): Promise<Location[]> => {
  const { data, error } = await supabase
    .from('locations')
    .select('*')
    .eq('is_custom', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching custom locations:', error);
    return [];
  }

  return data || [];
};

export const addLocation = async (location: {
  name: string;
  country: string;
  description: string;
  coordinates: { lat: number; lon: number };
}): Promise<Location | null> => {
  const { data, error } = await supabase
    .from('locations')
    .insert({
      name: location.name,
      country: location.country,
      description: location.description,
      lat: location.coordinates.lat,
      lon: location.coordinates.lon,
      image: `https://source.unsplash.com/featured/800x600/?${encodeURIComponent(location.name)},weather`,
      is_custom: true,
      featured: false
    })
    .select()
    .single();

  if (error) {
    console.error('Error adding location:', error);
    return null;
  }

  return data;
};

export const deleteLocation = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('locations')
    .delete()
    .eq('id', id)
    .eq('is_custom', true); // Safety: only allow deleting custom locations

  if (error) {
    console.error('Error deleting location:', error);
    return false;
  }

  return true;
};