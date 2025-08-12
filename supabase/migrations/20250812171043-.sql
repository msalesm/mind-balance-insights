-- Lock down PII exposure on user_profiles by removing public read access

-- Ensure RLS is enabled (safe if already enabled)
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Drop overly permissive public SELECT policy that exposed PII
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.user_profiles;