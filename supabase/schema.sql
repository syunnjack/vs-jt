CREATE EXTENSION IF NOT EXISTS postgis;

CREATE TABLE public.spots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  address TEXT,
  location GEOGRAPHY(POINT, 4326) NOT NULL,
  smoking_type TEXT DEFAULT 'both' CHECK (smoking_type IN ('heated', 'paper', 'both')),
  is_indoor BOOLEAN DEFAULT false,
  affiliate_url TEXT,
  is_sponsored BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);
CREATE INDEX spots_location_idx ON public.spots USING GIST (location);

CREATE TABLE public.congestion_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  spot_id UUID REFERENCES public.spots(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  guest_id UUID,
  status TEXT NOT NULL CHECK (status IN ('empty', 'normal', 'full')),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  CHECK (user_id IS NOT NULL OR guest_id IS NOT NULL)
);
CREATE INDEX congestion_spot_created_idx ON public.congestion_reports (spot_id, created_at DESC);

CREATE TABLE public.ugc_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  spot_id UUID REFERENCES public.spots(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  guest_id UUID,
  comment TEXT NOT NULL CHECK (char_length(comment) BETWEEN 1 AND 500),
  images TEXT[] DEFAULT '{}',
  helpful_count INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  CHECK (user_id IS NOT NULL OR guest_id IS NOT NULL)
);

CREATE TABLE public.checkins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  spot_id UUID REFERENCES public.spots(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  guest_id UUID,
  earned_points INTEGER DEFAULT 10 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE TABLE public.push_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guest_id UUID,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  endpoint TEXT UNIQUE NOT NULL,
  p256dh TEXT NOT NULL,
  auth TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE OR REPLACE FUNCTION get_nearby_spots(user_lat DOUBLE PRECISION, user_lng DOUBLE PRECISION, radius_meters DOUBLE PRECISION DEFAULT 1500)
RETURNS TABLE (id UUID, name TEXT, slug TEXT, address TEXT, is_indoor BOOLEAN, distance_meters DOUBLE PRECISION, lat DOUBLE PRECISION, lng DOUBLE PRECISION)
LANGUAGE sql STABLE AS $$
  SELECT s.id, s.name, s.slug, s.address, s.is_indoor,
    ST_Distance(s.location, ST_SetSRID(ST_MakePoint(user_lng, user_lat), 4326)::geography),
    ST_Y(s.location::geometry), ST_X(s.location::geometry)
  FROM public.spots s
  WHERE ST_DWithin(s.location, ST_SetSRID(ST_MakePoint(user_lng, user_lat), 4326)::geography, radius_meters)
  ORDER BY s.is_sponsored DESC, 6 ASC;
$$;
