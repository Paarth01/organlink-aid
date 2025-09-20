-- Create enum types
CREATE TYPE public.user_role AS ENUM ('donor', 'hospital', 'ngo', 'admin');
CREATE TYPE public.urgency_level AS ENUM ('low', 'medium', 'high');
CREATE TYPE public.request_status AS ENUM ('pending', 'matched', 'completed', 'cancelled');
CREATE TYPE public.match_status AS ENUM ('pending', 'accepted', 'declined');
CREATE TYPE public.blood_type AS ENUM ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-');
CREATE TYPE public.organ_type AS ENUM ('kidney', 'liver', 'heart', 'lung', 'cornea', 'bone_marrow', 'skin', 'blood');

-- Create profiles table for user roles and basic info
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  role user_role NOT NULL DEFAULT 'donor',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create donors table
CREATE TABLE public.donors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  blood_type blood_type,
  organ_types organ_type[] DEFAULT '{}',
  city TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  availability BOOLEAN DEFAULT true,
  last_donation_date DATE,
  medical_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create hospitals table
CREATE TABLE public.hospitals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  license_number TEXT,
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create requests table
CREATE TABLE public.requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hospital_id UUID NOT NULL REFERENCES public.hospitals(id) ON DELETE CASCADE,
  patient_name TEXT NOT NULL,
  patient_age INTEGER,
  organ_needed organ_type NOT NULL,
  blood_type_needed blood_type NOT NULL,
  urgency urgency_level NOT NULL DEFAULT 'medium',
  status request_status NOT NULL DEFAULT 'pending',
  description TEXT,
  required_by DATE,
  city TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create matches table
CREATE TABLE public.matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID NOT NULL REFERENCES public.requests(id) ON DELETE CASCADE,
  donor_id UUID NOT NULL REFERENCES public.donors(id) ON DELETE CASCADE,
  status match_status NOT NULL DEFAULT 'pending',
  matched_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  responded_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  UNIQUE(request_id, donor_id)
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hospitals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;

-- Helper function to get user role
CREATE OR REPLACE FUNCTION public.get_user_role(user_uuid UUID)
RETURNS user_role
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT role FROM public.profiles WHERE id = user_uuid;
$$;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR ALL USING (public.get_user_role(auth.uid()) = 'admin');

-- RLS Policies for donors
CREATE POLICY "Donors can manage their own data" ON public.donors
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Hospitals and NGOs can view donors" ON public.donors
  FOR SELECT USING (
    public.get_user_role(auth.uid()) IN ('hospital', 'ngo', 'admin')
  );

-- RLS Policies for hospitals
CREATE POLICY "Hospitals can manage their own data" ON public.hospitals
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "All authenticated users can view verified hospitals" ON public.hospitals
  FOR SELECT USING (verified = true AND auth.uid() IS NOT NULL);

CREATE POLICY "Admins can view all hospitals" ON public.hospitals
  FOR SELECT USING (public.get_user_role(auth.uid()) = 'admin');

-- RLS Policies for requests
CREATE POLICY "Hospitals can manage their own requests" ON public.requests
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.hospitals h 
      WHERE h.id = hospital_id AND h.user_id = auth.uid()
    )
  );

CREATE POLICY "Donors can view all requests" ON public.requests
  FOR SELECT USING (public.get_user_role(auth.uid()) = 'donor');

CREATE POLICY "NGOs and Admins can view all requests" ON public.requests
  FOR SELECT USING (public.get_user_role(auth.uid()) IN ('ngo', 'admin'));

-- RLS Policies for matches
CREATE POLICY "Donors can view their own matches" ON public.matches
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.donors d 
      WHERE d.id = donor_id AND d.user_id = auth.uid()
    )
  );

CREATE POLICY "Donors can update their own matches" ON public.matches
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.donors d 
      WHERE d.id = donor_id AND d.user_id = auth.uid()
    )
  );

CREATE POLICY "Hospitals can view matches for their requests" ON public.matches
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.requests r
      JOIN public.hospitals h ON r.hospital_id = h.id
      WHERE r.id = request_id AND h.user_id = auth.uid()
    )
  );

CREATE POLICY "System can create matches" ON public.matches
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can view all matches" ON public.matches
  FOR ALL USING (public.get_user_role(auth.uid()) = 'admin');

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'donor')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add update triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_donors_updated_at BEFORE UPDATE ON public.donors
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_hospitals_updated_at BEFORE UPDATE ON public.hospitals
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_requests_updated_at BEFORE UPDATE ON public.requests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();