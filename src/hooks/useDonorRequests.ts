import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface AnonymizedRequest {
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

export const useDonorRequests = () => {
  const [requests, setRequests] = useState<AnonymizedRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchAnonymizedRequests = async () => {
    try {
      const { data, error } = await supabase.rpc('get_donor_matching_requests');

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
    fetchAnonymizedRequests();
  }, []);

  return {
    requests,
    loading,
    refetch: fetchAnonymizedRequests,
  };
};