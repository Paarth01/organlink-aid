-- Create missing hospital record for existing hospital user
INSERT INTO public.hospitals (user_id, name, address, verified)
SELECT 
  p.id,
  COALESCE(p.full_name, p.email) as name,
  'Address to be updated' as address,
  false as verified
FROM profiles p 
WHERE p.role = 'hospital' 
AND NOT EXISTS (SELECT 1 FROM hospitals h WHERE h.user_id = p.id);

-- Ensure the trigger exists on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();