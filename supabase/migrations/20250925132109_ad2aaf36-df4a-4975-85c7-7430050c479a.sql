-- Fix infinite recursion in RLS policies by creating security definer functions

-- Drop problematic policies that cause recursion
DROP POLICY IF EXISTS "Donors can manage their own data" ON public.donors;
DROP POLICY IF EXISTS "Hospitals can view matched donors only" ON public.donors;
DROP POLICY IF EXISTS "Admins can view all donors" ON public.donors;
DROP POLICY IF EXISTS "Donors can view their own matches" ON public.matches;
DROP POLICY IF EXISTS "Donors can update their own matches" ON public.matches;
DROP POLICY IF EXISTS "Hospitals can view matches for their requests" ON public.matches;
DROP POLICY IF EXISTS "Admins can view all matches" ON public.matches;

-- Create security definer functions to prevent recursion
CREATE OR REPLACE FUNCTION public.is_donor_owner(donor_id uuid)
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.donors 
    WHERE id = donor_id AND user_id = auth.uid()
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.is_hospital_user()
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'hospital'
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.can_view_donor_match(donor_id uuid)
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.matches m
    JOIN public.requests r ON m.request_id = r.id
    JOIN public.hospitals h ON r.hospital_id = h.id
    WHERE m.donor_id = donor_id 
    AND h.user_id = auth.uid()
    AND m.status IN ('accepted', 'pending')
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public;

-- Recreate RLS policies using security definer functions
CREATE POLICY "Donors can manage their own data" ON public.donors
FOR ALL TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Hospitals can view matched donors only" ON public.donors
FOR SELECT TO authenticated
USING (public.can_view_donor_match(id));

CREATE POLICY "Admins can view all donors" ON public.donors
FOR SELECT TO authenticated
USING (public.get_user_role(auth.uid()) = 'admin');

CREATE POLICY "Donors can view their own matches" ON public.matches
FOR SELECT TO authenticated
USING (public.is_donor_owner(donor_id));

CREATE POLICY "Donors can update their own matches" ON public.matches
FOR UPDATE TO authenticated
USING (public.is_donor_owner(donor_id))
WITH CHECK (public.is_donor_owner(donor_id));

CREATE POLICY "Hospitals can view matches for their requests" ON public.matches
FOR SELECT TO authenticated
USING (EXISTS (
  SELECT 1 FROM public.requests r
  JOIN public.hospitals h ON r.hospital_id = h.id
  WHERE r.id = matches.request_id AND h.user_id = auth.uid()
));

CREATE POLICY "Admins can view all matches" ON public.matches
FOR ALL TO authenticated
USING (public.get_user_role(auth.uid()) = 'admin')
WITH CHECK (public.get_user_role(auth.uid()) = 'admin');

-- Add data anonymization function for enhanced security
CREATE OR REPLACE FUNCTION public.anonymize_patient_data(patient_name text, request_id uuid)
RETURNS text AS $$
BEGIN
  -- Return anonymized patient identifier using first part of request ID
  RETURN 'Patient-' || substring(request_id::text, 1, 8);
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public;

-- Add audit logging trigger for sensitive operations
CREATE TABLE IF NOT EXISTS public.audit_log (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  table_name text NOT NULL,
  operation text NOT NULL,
  user_id uuid,
  old_data jsonb,
  new_data jsonb,
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view audit logs" ON public.audit_log
FOR SELECT TO authenticated
USING (public.get_user_role(auth.uid()) = 'admin');

-- Create audit trigger function
CREATE OR REPLACE FUNCTION public.audit_trigger()
RETURNS trigger AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    INSERT INTO public.audit_log (table_name, operation, user_id, old_data)
    VALUES (TG_TABLE_NAME, TG_OP, auth.uid(), to_jsonb(OLD));
    RETURN OLD;
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO public.audit_log (table_name, operation, user_id, old_data, new_data)
    VALUES (TG_TABLE_NAME, TG_OP, auth.uid(), to_jsonb(OLD), to_jsonb(NEW));
    RETURN NEW;
  ELSIF TG_OP = 'INSERT' THEN
    INSERT INTO public.audit_log (table_name, operation, user_id, new_data)
    VALUES (TG_TABLE_NAME, TG_OP, auth.uid(), to_jsonb(NEW));
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Add audit triggers to sensitive tables
CREATE TRIGGER audit_requests_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.requests
  FOR EACH ROW EXECUTE FUNCTION public.audit_trigger();

CREATE TRIGGER audit_matches_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.matches
  FOR EACH ROW EXECUTE FUNCTION public.audit_trigger();

CREATE TRIGGER audit_donors_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.donors
  FOR EACH ROW EXECUTE FUNCTION public.audit_trigger();