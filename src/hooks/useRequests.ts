import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export interface Request {
  id: string;
  patient_name: string;
  patient_age?: number;
  organ_needed: string;
  blood_type_needed: string;
  urgency: string;
  description?: string;
  city: string;
  required_by?: string;
  status: string;
  created_at: string;
  updated_at?: string;
  hospitals: {
    id: string;
    name: string;
    address: string;
    verified: boolean;
  };
}

export interface CreateRequestData {
  patient_name: string;
  organ_needed: string;
  blood_type_needed: string;
  urgency: string;
  description?: string;
  patient_age?: number;
  city: string;
  required_by?: string;
}

export const useRequests = () => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('requests')
        .select(`
          *,
          hospitals (
            id,
            name,
            address,
            verified
          )
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

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

  const createRequest = async (requestData: CreateRequestData) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to create a request",
        variant: "destructive",
      });
      return;
    }

    try {
      // First get the hospital record for the current user
      const { data: hospitalData, error: hospitalError } = await supabase
        .from('hospitals')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (hospitalError) {
        throw new Error('You must be associated with a hospital to create requests');
      }

      const { data, error } = await supabase
        .from('requests')
        .insert([{
          ...requestData,
          hospital_id: hospitalData.id,
          status: 'pending'
        } as any])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Request created successfully",
        description: "Compatible donors will be automatically matched.",
      });

      await fetchRequests(); // Refresh the list
      return { data, error: null };
    } catch (error: any) {
      toast({
        title: "Error creating request",
        description: error.message,
        variant: "destructive",
      });
      return { data: null, error };
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return {
    requests,
    loading,
    createRequest,
    refetch: fetchRequests,
  };
};