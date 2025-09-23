-- Update handle_new_user function to create hospital records for hospital users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Insert profile first
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'donor')
  );
  
  -- If the user is a hospital, create a hospital record
  IF COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'donor') = 'hospital' THEN
    INSERT INTO public.hospitals (user_id, name, address)
    VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'hospital_name', NEW.raw_user_meta_data->>'full_name', NEW.email),
      COALESCE(NEW.raw_user_meta_data->>'hospital_address', 'Address not provided')
    );
  END IF;
  
  RETURN NEW;
END;
$$;