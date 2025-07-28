-- Create table for user custom locations
CREATE TABLE public.user_locations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  address TEXT,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  radius_meters INTEGER NOT NULL DEFAULT 100,
  location_type TEXT NOT NULL DEFAULT 'custom',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_locations ENABLE ROW LEVEL SECURITY;

-- Create policies for user_locations
CREATE POLICY "Users can view their own locations" 
ON public.user_locations 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own locations" 
ON public.user_locations 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own locations" 
ON public.user_locations 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own locations" 
ON public.user_locations 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create table for location visits tracking
CREATE TABLE public.location_visits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  location_id UUID,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  address TEXT,
  arrived_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  left_at TIMESTAMP WITH TIME ZONE,
  duration_minutes INTEGER,
  mood_score DOUBLE PRECISION,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.location_visits ENABLE ROW LEVEL SECURITY;

-- Create policies for location_visits
CREATE POLICY "Users can view their own visits" 
ON public.location_visits 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own visits" 
ON public.location_visits 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own visits" 
ON public.location_visits 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create table for mood-location correlations
CREATE TABLE public.mood_location_correlations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  location_id UUID,
  location_name TEXT NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  avg_mood_score DOUBLE PRECISION NOT NULL,
  visit_count INTEGER NOT NULL DEFAULT 1,
  total_duration_minutes INTEGER NOT NULL DEFAULT 0,
  mood_trend TEXT, -- 'improving', 'declining', 'stable'
  last_visit_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.mood_location_correlations ENABLE ROW LEVEL SECURITY;

-- Create policies for mood_location_correlations
CREATE POLICY "Users can view their own correlations" 
ON public.mood_location_correlations 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own correlations" 
ON public.mood_location_correlations 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own correlations" 
ON public.mood_location_correlations 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Add trigger for updating timestamps
CREATE TRIGGER update_user_locations_updated_at
BEFORE UPDATE ON public.user_locations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_mood_location_correlations_updated_at
BEFORE UPDATE ON public.mood_location_correlations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add indexes for better performance
CREATE INDEX idx_user_locations_user_id ON public.user_locations(user_id);
CREATE INDEX idx_user_locations_coordinates ON public.user_locations(latitude, longitude);
CREATE INDEX idx_location_visits_user_id ON public.location_visits(user_id);
CREATE INDEX idx_location_visits_arrived_at ON public.location_visits(arrived_at);
CREATE INDEX idx_mood_location_correlations_user_id ON public.mood_location_correlations(user_id);