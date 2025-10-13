/*
  # Create locations table

  1. New Tables
    - `locations`
      - `id` (uuid, primary key) - Unique identifier for each location
      - `name` (text) - City name
      - `country` (text) - Country name
      - `description` (text) - Description of the location
      - `image` (text) - URL to location image
      - `lat` (numeric) - Latitude coordinate
      - `lon` (numeric) - Longitude coordinate
      - `featured` (boolean) - Whether location is featured (default false)
      - `is_custom` (boolean) - Whether location was added by user (default true)
      - `created_at` (timestamptz) - Timestamp when location was added
  
  2. Security
    - Enable RLS on `locations` table
    - Add policy for anyone to read all locations (public data)
    - Add policy for anyone to insert new locations (for demo purposes)
    - Add policy for anyone to delete custom locations (for demo purposes)
*/

CREATE TABLE IF NOT EXISTS locations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  country text NOT NULL,
  description text DEFAULT '',
  image text DEFAULT 'https://images.pexels.com/photos/1519088/pexels-photo-1519088.jpeg?auto=compress&cs=tinysrgb&w=800',
  lat numeric NOT NULL,
  lon numeric NOT NULL,
  featured boolean DEFAULT false,
  is_custom boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE locations ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read all locations (public data)
CREATE POLICY "Anyone can view locations"
  ON locations
  FOR SELECT
  USING (true);

-- Allow anyone to insert new locations (for demo purposes)
CREATE POLICY "Anyone can insert locations"
  ON locations
  FOR INSERT
  WITH CHECK (true);

-- Allow anyone to delete custom locations (for demo purposes)
CREATE POLICY "Anyone can delete custom locations"
  ON locations
  FOR DELETE
  USING (is_custom = true);

-- Insert default featured locations
INSERT INTO locations (name, country, description, image, lat, lon, featured, is_custom)
VALUES
  ('Tokyo', 'Japan', 'The bustling metropolis where tradition meets innovation', 'https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg?auto=compress&cs=tinysrgb&w=800', 35.6762, 139.6503, true, false),
  ('New York', 'United States', 'The city that never sleeps, heart of global finance', 'https://images.pexels.com/photos/466685/pexels-photo-466685.jpeg?auto=compress&cs=tinysrgb&w=800', 40.7128, -74.0060, true, false),
  ('London', 'United Kingdom', 'Historic capital bridging centuries of culture and commerce', 'https://images.pexels.com/photos/460672/pexels-photo-460672.jpeg?auto=compress&cs=tinysrgb&w=800', 51.5074, -0.1278, true, false),
  ('Singapore', 'Singapore', 'The garden city-state, a hub of innovation and sustainability', 'https://images.pexels.com/photos/2265876/pexels-photo-2265876.jpeg?auto=compress&cs=tinysrgb&w=800', 1.3521, 103.8198, false, false),
  ('Dubai', 'United Arab Emirates', 'Futuristic oasis where desert meets cutting-edge architecture', 'https://images.pexels.com/photos/1470502/pexels-photo-1470502.jpeg?auto=compress&cs=tinysrgb&w=800', 25.2048, 55.2708, false, false),
  ('Sydney', 'Australia', 'Harbor city combining natural beauty with urban sophistication', 'https://images.pexels.com/photos/783682/pexels-photo-783682.jpeg?auto=compress&cs=tinysrgb&w=800', -33.8688, 151.2093, false, false),
  ('Paris', 'France', 'The city of light, where art and elegance converge', 'https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg?auto=compress&cs=tinysrgb&w=800', 48.8566, 2.3522, false, false),
  ('San Francisco', 'United States', 'Tech capital by the bay, where innovation shapes the future', 'https://images.pexels.com/photos/208745/pexels-photo-208745.jpeg?auto=compress&cs=tinysrgb&w=800', 37.7749, -122.4194, false, false)
ON CONFLICT DO NOTHING;
