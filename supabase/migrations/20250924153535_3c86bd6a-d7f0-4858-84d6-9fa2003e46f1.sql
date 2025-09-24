-- Fix security issue: Remove overly broad donor data access
-- Drop the existing policy that allows all hospitals/NGOs to view all donor data
DROP POLICY IF EXISTS "Hospitals and NGOs can view donors" ON public.donors;

-- Create more restrictive policies that only allow access through legitimate matches
CREATE POLICY "Hospitals can view matched donors only" 
ON public.donors 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 
    FROM matches m
    JOIN requests r ON m.request_id = r.id
    JOIN hospitals h ON r.hospital_id = h.id
    WHERE m.donor_id = donors.id 
    AND h.user_id = auth.uid()
    AND m.status IN ('accepted', 'pending')
  )
);

-- NGOs should have very limited access - only to anonymized statistical data
-- For now, removing their broad access entirely
CREATE POLICY "Admins can view all donors" 
ON public.donors 
FOR SELECT 
USING (get_user_role(auth.uid()) = 'admin'::user_role);

-- Ensure donors still have full control over their own data
-- (This policy already exists but keeping it explicit)
-- CREATE POLICY "Donors can manage their own data" already exists