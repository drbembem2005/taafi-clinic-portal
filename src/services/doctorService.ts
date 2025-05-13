
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

// Create a type for the fees with examination and consultation properties
export interface Fees {
  examination: number | string;
  consultation: number | string | null;
}

// Define the Doctor type
export interface Doctor {
  id: number;
  name: string;
  specialty_id: number;
  bio?: string;
  image?: string;
  fees: Fees;
  schedule: Record<string, any>;
}

export async function getDoctors(): Promise<Doctor[]> {
  try {
    const { data, error } = await supabase
      .from('doctors')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching doctors:', error);
      toast({
        title: "خطأ",
        description: error.message,
        variant: "destructive",
      });
      return [];
    }

    // Parse fees JSON string if needed
    return data.map(doctor => ({
      ...doctor,
      fees: typeof doctor.fees === 'string' 
        ? JSON.parse(doctor.fees) 
        : doctor.fees,
      schedule: typeof doctor.schedule === 'string'
        ? JSON.parse(doctor.schedule)
        : doctor.schedule
    })) as Doctor[];
  } catch (error) {
    console.error('Error in getDoctors:', error);
    return [];
  }
}

export async function getDoctor(id: number): Promise<Doctor | null> {
  try {
    const { data, error } = await supabase
      .from('doctors')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching doctor:', error);
      toast({
        title: "خطأ",
        description: error.message,
        variant: "destructive",
      });
      return null;
    }

    // Parse fees JSON string if needed
    return {
      ...data,
      fees: typeof data.fees === 'string' 
        ? JSON.parse(data.fees) 
        : data.fees,
      schedule: typeof data.schedule === 'string'
        ? JSON.parse(data.schedule)
        : data.schedule
    } as Doctor;
  } catch (error) {
    console.error('Error in getDoctor:', error);
    return null;
  }
}

export async function getDoctorsBySpecialty(specialtyId: number): Promise<Doctor[]> {
  try {
    const { data, error } = await supabase
      .from('doctors')
      .select('*')
      .eq('specialty_id', specialtyId)
      .order('name');

    if (error) {
      console.error('Error fetching doctors by specialty:', error);
      toast({
        title: "خطأ",
        description: error.message,
        variant: "destructive",
      });
      return [];
    }

    // Parse fees JSON string if needed
    return data.map(doctor => ({
      ...doctor,
      fees: typeof doctor.fees === 'string' 
        ? JSON.parse(doctor.fees) 
        : doctor.fees,
      schedule: typeof doctor.schedule === 'string'
        ? JSON.parse(doctor.schedule)
        : doctor.schedule
    })) as Doctor[];
  } catch (error) {
    console.error('Error in getDoctorsBySpecialty:', error);
    return [];
  }
}

// Convert time format from 24h to AM/PM format for schedule
const convertTimeFormat = (time: string): string => {
  if (!time) return '';
  
  // Handle special cases like "على حسب الحالات"
  if (time === 'على حسب الحالات' || time === 'حسب الحالات') {
    return time;
  }
  
  // Parse hour and format properly
  try {
    const hour = parseInt(time.split(':')[0], 10);
    const minutes = time.includes(':') ? time.split(':')[1] : '00';
    return `${hour}:${minutes}`;
  } catch (e) {
    console.error('Error parsing time:', time, e);
    return time;
  }
};
