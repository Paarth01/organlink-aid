import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface Hospital {
  id: string;
  name: string;
  address: string;
  license_number?: string;
  verified?: boolean;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export const useHospital = () => {
  const [hospital, setHospital] = useState<Hospital | null>(null);
  const [loading, setLoading] = useState(true);
  const { user, profile } = useAuth();
  const { toast } = useToast();

  const fetchHospital = async () => {
    if (!user || profile?.role !== 'hospital') {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('hospitals')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // No hospital record found
          toast({
            title: "Hospital Profile Missing",
            description: "You must complete your hospital registration to submit requests.",
            variant: "destructive",
          });
        } else {
          throw error;
        }
      } else {
        setHospital(data);
      }
    } catch (error: any) {
      console.error('Error fetching hospital:', error);
      toast({
        title: "Error loading hospital data",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHospital();
  }, [user, profile]);

  return {
    hospital,
    loading,
    refetch: fetchHospital,
  };
};