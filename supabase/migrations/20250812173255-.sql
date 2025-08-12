-- Secure analysis_cache with idempotent steps

-- 0) Drop existing admin policy to avoid duplicate errors
DROP POLICY IF EXISTS "Admins can view analysis cache" ON public.analysis_cache;

-- 1) Ensure RLS is enabled
ALTER TABLE public.analysis_cache ENABLE ROW LEVEL SECURITY;

-- 2) Remove any known permissive/public policies (idempotent best-effort)
DROP POLICY IF EXISTS "System can manage cache" ON public.analysis_cache;
DROP POLICY IF EXISTS "Public can view analysis cache" ON public.analysis_cache;
DROP POLICY IF EXISTS "Public can select analysis cache" ON public.analysis_cache;
DROP POLICY IF EXISTS "Allow public read" ON public.analysis_cache;
DROP POLICY IF EXISTS "Allow anon read" ON public.analysis_cache;
DROP POLICY IF EXISTS "Allow read to everyone" ON public.analysis_cache;

-- 3) Recreate admin-only read policy
CREATE POLICY "Admins can view analysis cache"
ON public.analysis_cache
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));
