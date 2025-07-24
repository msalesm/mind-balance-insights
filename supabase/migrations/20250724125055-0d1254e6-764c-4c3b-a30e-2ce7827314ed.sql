-- Fix subscribers table RLS policies - Critical Security Fix
-- Remove overly permissive policies and add proper user-specific restrictions

-- Drop existing permissive policies
DROP POLICY IF EXISTS "Insert subscription" ON public.subscribers;
DROP POLICY IF EXISTS "Update own subscription" ON public.subscribers;
DROP POLICY IF EXISTS "Users can view own subscription" ON public.subscribers;

-- Create secure policies that properly restrict access
CREATE POLICY "Users can create their own subscription"
ON public.subscribers
FOR INSERT
WITH CHECK (
  auth.uid() = user_id OR 
  (user_id IS NULL AND email = auth.email())
);

CREATE POLICY "Users can view their own subscription"
ON public.subscribers
FOR SELECT
USING (
  auth.uid() = user_id OR 
  (user_id IS NULL AND email = auth.email())
);

CREATE POLICY "Users can update their own subscription"
ON public.subscribers
FOR UPDATE
USING (
  auth.uid() = user_id OR 
  (user_id IS NULL AND email = auth.email())
);