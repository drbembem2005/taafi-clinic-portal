
import { supabase } from '@/integrations/supabase/client';
import { Json } from '@/integrations/supabase/types';

export interface Fees {
  examination: number;
  consultation: number | null;
}

export interface Doctor {
  id: number;
  name: string;
  specialty_id: number;
  bio: string | null;
  image: string | null;
  fees: Fees;
  old_schedule: Json;
}

export async function getDoctors(): Promise<Doctor[]> {
  try {
    const { data, error } = await supabase
      .from('doctors')
      .select('*');
      
    if (error) {
      throw error;
    }
    
    return data as Doctor[];
  } catch (error) {
    console.error('Error fetching doctors:', error);
    return [];
  }
}

export async function getDoctorById(id: number): Promise<Doctor | null> {
  try {
    const { data, error } = await supabase
      .from('doctors')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) {
      throw error;
    }
    
    return data as Doctor;
  } catch (error) {
    console.error(`Error fetching doctor with ID ${id}:`, error);
    return null;
  }
}

export async function getDoctorsBySpecialtyId(specialtyId: number): Promise<Doctor[]> {
  try {
    const { data, error } = await supabase
      .from('doctors')
      .select('*')
      .eq('specialty_id', specialtyId);
      
    if (error) {
      throw error;
    }
    
    return data as Doctor[];
  } catch (error) {
    console.error(`Error fetching doctors with specialty ID ${specialtyId}:`, error);
    return [];
  }
}
