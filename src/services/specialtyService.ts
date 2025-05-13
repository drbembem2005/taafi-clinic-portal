
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

export interface Specialty {
  id: number;
  name: string;
  icon: string;
  description: string;
  details: string;
}

export const getSpecialties = async (): Promise<Specialty[]> => {
  try {
    const { data, error } = await supabase
      .from('specialties')
      .select('*');
    
    if (error) {
      toast({
        title: "Error fetching specialties",
        description: error.message,
        variant: "destructive",
      });
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error("Error fetching specialties:", error);
    return [];
  }
};

export const getSpecialtyById = async (id: number): Promise<Specialty | null> => {
  try {
    const { data, error } = await supabase
      .from('specialties')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      toast({
        title: "Error fetching specialty",
        description: error.message,
        variant: "destructive",
      });
      return null;
    }
    
    return data;
  } catch (error) {
    console.error("Error fetching specialty:", error);
    return null;
  }
};
