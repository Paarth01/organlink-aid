import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export interface NGOAnonymizedRequest {
  id: string;
  anonymized_patient_name: string;
  organ_needed: string;
  blood_type_needed: string;
  urgency: string;
  city: string;
  required_by?: string;
  status: string;
  created_at: string;
  hospital_id: string;
  hospital_name: string;
  hospital_address: string;
  hospital_verified: boolean;
}

export const useNGORequests = () => {
  const [requests, setRequests] = useState<NGOAnonymizedRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const { toast } = useToast();
  const { profile } = useAuth();

  const checkVerificationStatus = async () => {
    if (!profile || profile.role !== 'ngo') {
      setIsVerified(false);
      return;
    }

    try {
      const { data, error } = await supabase.rpc('is_verified_ngo');
      if (error) throw error;
      setIsVerified(data || false);
    } catch (error: any) {
      console.error('Error checking NGO verification:', error);
      setIsVerified(false);
    }
  };

  const fetchNGORequests = async () => {
    if (!isVerified) {
      setRequests([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.rpc('get_ngo_anonymized_requests');

      if (error) throw error;
      setRequests(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching requests",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkVerificationStatus();
  }, [profile]);

  useEffect(() => {
    if (isVerified) {
      fetchNGORequests();
    } else {
      setRequests([]);
      setLoading(false);
    }
  }, [isVerified]);

  return {
    requests,
    loading,
    isVerified,
    refetch: fetchNGORequests,
  };
};