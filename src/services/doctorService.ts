
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export interface Doctor {
  id: number;
  name: string;
  specialty_id: number;
  fees: {
    examination: number | null;
    consultation: number | null;
  };
  schedule: Record<string, string[]>;
  image: string | null;
  bio: string | null;
  specialty?: string; // For joining with specialty name
}

export const getDoctors = async (): Promise<Doctor[]> => {
  try {
    const { data, error } = await supabase
      .from('doctors')
      .select(`
        *,
        specialties:specialty_id (name)
      `);
    
    if (error) {
      toast({
        title: "Error fetching doctors",
        description: error.message,
        variant: "destructive",
      });
      return [];
    }
    
    // Map the joined data to include specialty name
    return (data || []).map(doctor => ({
      ...doctor,
      specialty: doctor.specialties?.name
    }));
  } catch (error) {
    console.error("Error fetching doctors:", error);
    return [];
  }
};

export const getDoctorsBySpecialty = async (specialtyId: number): Promise<Doctor[]> => {
  try {
    const { data, error } = await supabase
      .from('doctors')
      .select(`
        *,
        specialties:specialty_id (name)
      `)
      .eq('specialty_id', specialtyId);
    
    if (error) {
      toast({
        title: "Error fetching doctors",
        description: error.message,
        variant: "destructive",
      });
      return [];
    }
    
    return (data || []).map(doctor => ({
      ...doctor,
      specialty: doctor.specialties?.name
    }));
  } catch (error) {
    console.error("Error fetching doctors by specialty:", error);
    return [];
  }
};
