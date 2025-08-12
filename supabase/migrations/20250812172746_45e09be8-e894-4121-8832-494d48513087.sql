
-- Lock down analysis_cache: remove public access and restrict reads to admins only

-- Ensure RLS is enabled (idempotent)
ALTER TABLE public.analysis_cache ENABLE ROW LEVEL SECURITY;

-- Remove permissive public access
DROP POLICY IF EXISTS "System can manage cache" ON public.analysis_cache;

-- Allow ONLY admins to read cache data
CREATE POLICY "Admins can view analysis cache"
ON public.analysis_cache
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Note:
-- - No INSERT/UPDATE/DELETE policies are added for regular users.
--   This ensures that only service-role contexts (which bypass RLS) can write to the cache,
--   and human users cannot modify or read cache contents unless they're admins.
