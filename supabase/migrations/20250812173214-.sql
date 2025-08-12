-- Secure analysis_cache: restrict reads to admins only, remove public access

-- 1) Ensure RLS is enabled
ALTER TABLE public.analysis_cache ENABLE ROW LEVEL SECURITY;

-- 2) Remove any known permissive/public policies (idempotent best-effort)
DROP POLICY IF EXISTS "System can manage cache" ON public.analysis_cache;
DROP POLICY IF EXISTS "Public can view analysis cache" ON public.analysis_cache;
DROP POLICY IF EXISTS "Public can select analysis cache" ON public.analysis_cache;
DROP POLICY IF EXISTS "Allow public read" ON public.analysis_cache;
DROP POLICY IF EXISTS "Allow anon read" ON public.analysis_cache;
DROP POLICY IF EXISTS "Allow read to everyone" ON public.analysis_cache;

-- 3) Allow ONLY admins to read cache data
CREATE POLICY "Admins can view analysis cache"
ON public.analysis_cache
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Note:
-- - No INSERT/UPDATE/DELETE policies are added for regular users.
--   This ensures that only service-role contexts (which bypass RLS) can write to the cache,
--   and human users cannot modify cache contents.
