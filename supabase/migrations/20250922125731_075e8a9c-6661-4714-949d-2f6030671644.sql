-- Create matching engine database function
CREATE OR REPLACE FUNCTION public.find_compatible_donors(request_id_param UUID)
RETURNS TABLE(donor_id UUID, compatibility_score INT) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    req_record RECORD;
BEGIN
    -- Get request details
    SELECT r.blood_type_needed, r.organ_needed, r.city, h.name as hospital_name
    INTO req_record
    FROM requests r
    JOIN hospitals h ON r.hospital_id = h.id
    WHERE r.id = request_id_param;
    
    -- Find compatible donors based on blood type, organ type, availability, and location
    RETURN QUERY
    SELECT 
        d.id as donor_id,
        CASE 
            WHEN d.blood_type = req_record.blood_type_needed AND req_record.organ_needed = ANY(d.organ_types) AND d.city = req_record.city THEN 100
            WHEN d.blood_type = req_record.blood_type_needed AND req_record.organ_needed = ANY(d.organ_types) THEN 80
            WHEN d.blood_type = req_record.blood_type_needed AND d.city = req_record.city THEN 60
            WHEN req_record.organ_needed = ANY(d.organ_types) AND d.city = req_record.city THEN 50
            WHEN d.blood_type = req_record.blood_type_needed THEN 40
            WHEN req_record.organ_needed = ANY(d.organ_types) THEN 30
            ELSE 10
        END as compatibility_score
    FROM donors d
    WHERE d.availability = true
    AND (
        d.blood_type = req_record.blood_type_needed 
        OR req_record.organ_needed = ANY(d.organ_types)
        OR d.city = req_record.city
    )
    ORDER BY compatibility_score DESC, d.last_donation_date ASC NULLS LAST;
END;
$$;

-- Create automatic matching trigger function
CREATE OR REPLACE FUNCTION public.auto_match_donors()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    donor_record RECORD;
BEGIN
    -- Only run for new requests
    IF TG_OP = 'INSERT' THEN
        -- Find compatible donors and create matches
        FOR donor_record IN 
            SELECT donor_id, compatibility_score 
            FROM find_compatible_donors(NEW.id)
            LIMIT 10  -- Limit to top 10 matches
        LOOP
            INSERT INTO matches (request_id, donor_id, status, notes)
            VALUES (
                NEW.id, 
                donor_record.donor_id, 
                'pending', 
                'Compatibility score: ' || donor_record.compatibility_score::text
            );
        END LOOP;
    END IF;
    
    RETURN COALESCE(NEW, OLD);
END;
$$;

-- Create trigger for automatic matching
DROP TRIGGER IF EXISTS trigger_auto_match_donors ON requests;
CREATE TRIGGER trigger_auto_match_donors
    AFTER INSERT ON requests
    FOR EACH ROW
    EXECUTE FUNCTION auto_match_donors();

-- Enable realtime for matches table
ALTER TABLE matches REPLICA IDENTITY FULL;
ALTER publication supabase_realtime ADD TABLE matches;