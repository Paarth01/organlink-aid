-- Fix NGO access security issue by adding verification and anonymization

-- 1. Add verified field for NGO users
ALTER TABLE public.profiles ADD COLUMN verified BOOLEAN DEFAULT false;

-- 2. Create a security definer function to check if NGO is verified
CREATE OR REPLACE FUNCTION public.is_verified_ngo()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role = 'ngo' 
    AND verified = true
  );
$$;

-- 3. Create anonymized view function for NGOs (similar to donor view)
CREATE OR REPLACE FUNCTION public.get_ngo_anonymized_requests()
RETURNS TABLE(
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
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT 
    r.id,
    'Patient-' || SUBSTRING(r.id::text, 1, 8) AS anonymized_patient_name,
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

-- 4. Drop the existing overly permissive NGO policy
DROP POLICY IF EXISTS "NGOs and Admins can view all requests" ON public.requests;

-- 5. Create new restrictive policies
CREATE POLICY "Admins can view all requests" 
ON public.requests 
FOR SELECT 
USING (get_user_role(auth.uid()) = 'admin'::user_role);

CREATE POLICY "Verified NGOs can view anonymized requests through function only" 
ON public.requests 
FOR SELECT 
USING (
  get_user_role(auth.uid()) = 'ngo'::user_role 
  AND is_verified_ngo() 
  AND false -- Force NGOs to use the anonymized function instead
);

-- 6. Keep existing hospital policy
-- (Hospitals can manage their own requests policy already exists)

-- 7. Add audit logging for NGO verification changes
CREATE OR REPLACE FUNCTION public.audit_ngo_verification()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  IF TG_OP = 'UPDATE' AND OLD.verified != NEW.verified AND NEW.role = 'ngo' THEN
    INSERT INTO public.audit_log (table_name, operation, user_id, old_data, new_data)
    VALUES (
      'profiles', 
      'NGO_VERIFICATION_CHANGE', 
      auth.uid(), 
      jsonb_build_object('verified', OLD.verified, 'user_id', OLD.id),
      jsonb_build_object('verified', NEW.verified, 'user_id', NEW.id)
    );
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- 8. Add trigger for NGO verification audit
CREATE TRIGGER audit_ngo_verification_trigger
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.audit_ngo_verification();