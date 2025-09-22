import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export interface Match {
  id: string;
  request_id: string;
  donor_id: string;
  status: 'pending' | 'accepted' | 'declined' | 'completed';
  matched_at: string;
  responded_at?: string;
  notes?: string;
  requests: {
    id: string;
    patient_name: string;
    organ_needed: any;
    blood_type_needed: any;
    urgency: any;
    description?: string;
    city: string;
    created_at: string;
    hospitals: {
      name: string;
      address: string;
    };
  };
}

export const useMatches = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { profile } = useAuth();

  const fetchMatches = async () => {
    if (!profile || profile.role !== 'donor') return;

    try {
      // First get the donor record for the current user
      const { data: donorData, error: donorError } = await supabase
        .from('donors')
        .select('id')
        .eq('user_id', profile.id)
        .single();

      if (donorError) {
        console.log('No donor profile found');
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('matches')
        .select(`
          *,
          requests (
            id,
            patient_name,
            organ_needed,
            blood_type_needed,
            urgency,
            description,
            city,
            created_at,
            hospitals (
              name,
              address
            )
          )
        `)
        .eq('donor_id', donorData.id)
        .order('matched_at', { ascending: false });

      if (error) throw error;
      setMatches(data || []);
    } catch (error: any) {
      console.error('Error fetching matches:', error);
      toast({
        title: "Error fetching matches",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateMatchStatus = async (matchId: string, status: 'accepted' | 'declined') => {
    try {
      const { error } = await supabase
        .from('matches')
        .update({ 
          status,
          responded_at: new Date().toISOString()
        })
        .eq('id', matchId);

      if (error) throw error;

      toast({
        title: status === 'accepted' ? "Match accepted" : "Match declined",
        description: status === 'accepted' 
          ? "The hospital will contact you with next steps." 
          : "Thank you for your response.",
      });

      await fetchMatches(); // Refresh the list
    } catch (error: any) {
      toast({
        title: "Error updating match",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Set up real-time subscription
  useEffect(() => {
    if (!profile || profile.role !== 'donor') return;

    const channel = supabase
      .channel('matches-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'matches'
        },
        (payload) => {
          console.log('New match received:', payload);
          fetchMatches(); // Refresh matches when new ones are created
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'matches'
        },
        (payload) => {
          console.log('Match updated:', payload);
          fetchMatches(); // Refresh matches when updated
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [profile]);

  useEffect(() => {
    fetchMatches();
  }, [profile]);

  return {
    matches,
    loading,
    updateMatchStatus,
    refetch: fetchMatches,
  };
};