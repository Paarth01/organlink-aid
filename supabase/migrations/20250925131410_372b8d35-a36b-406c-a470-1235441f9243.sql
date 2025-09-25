-- Fix critical security issue: Remove donor access to patient medical information
-- Drop the policy that allows all donors to view sensitive patient data
DROP POLICY IF EXISTS "Donors can view all requests" ON public.requests;

-- Create a security definer function to get anonymized requests for donors
CREATE OR REPLACE FUNCTION public.get_donor_matching_requests()
RETURNS TABLE (
  id uuid,
  anonymized_patient_name text,
  organ_needed organ_type,
  blood_type_needed blood_type,
  urgency urgency_level,
  city text,
  required_by date,
  status request_status,
  created_at timestamp with time zone,
  hospital_id uuid,
  hospital_name text,
  hospital_address text,
  hospital_verified boolean
)
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT 
    r.id,
    'Patient ' || SUBSTRING(r.id::text, 1, 8) AS anonymized_patient_name,
    r.organ_needed,
    r.blood_type_needed,
    r.urgency,
    r.city,
    r.required_by,
    r.status,
    r.created_at,
    r.hospital_id,
    h.name,
    h.address,
    h.verified
  FROM requests r
  JOIN hospitals h ON r.hospital_id = h.id
  WHERE r.status = 'pending'
  ORDER BY r.created_at DESC;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.get_donor_matching_requests() TO authenticated;