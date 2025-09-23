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
      console.log('useHospital: User not logged in or not hospital role', { user: !!user, role: profile?.role });
      setLoading(false);
      return;
    }

    console.log('useHospital: Fetching hospital for user', user.id);
    
    try {
      const { data, error } = await supabase
        .from('hospitals')
        .select('*')
        .eq('user_id', user.id)
        .single();

      console.log('useHospital: Hospital query result', { data, error });

      if (error) {
        if (error.code === 'PGRST116') {
          // No hospital record found
          console.log('useHospital: No hospital record found for user');
          toast({
            title: "Hospital Profile Missing",  
            description: "You must complete your hospital registration to submit requests.",
            variant: "destructive",
          });
        } else {
          throw error;
        }
      } else {
        console.log('useHospital: Hospital found', data);
        setHospital(data);
      }
    } catch (error: any) {
      console.error('useHospital: Error fetching hospital:', error);
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