
import { supabase } from '@/integrations/supabase/client';
import { Doctor } from '@/integrations/supabase/types';
import { defaultDoctors } from '@/data/doctors';

// Create a type for the fees with examination and consultation properties
interface Fees {
  examination: number;
  consultation: number;
}

export async function getDoctors(): Promise<Doctor[]> {
  const { data, error } = await supabase
    .from('doctors')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching doctors:', error);
    return [];
  }

  // Parse fees JSON string if needed
  return data.map(doctor => ({
    ...doctor,
    fees: typeof doctor.fees === 'string' 
      ? JSON.parse(doctor.fees) 
      : doctor.fees as Fees
  }));
}

export async function getDoctor(id: string): Promise<Doctor | null> {
  const { data, error } = await supabase
    .from('doctors')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching doctor:', error);
    return null;
  }

  // Parse fees JSON string if needed
  return {
    ...data,
    fees: typeof data.fees === 'string' 
      ? JSON.parse(data.fees) 
      : data.fees as Fees
  };
}

export async function getDoctorsBySpecialty(specialtyId: string): Promise<Doctor[]> {
  const { data, error } = await supabase
    .from('doctors')
    .select('*')
    .eq('specialty_id', specialtyId)
    .order('name');

  if (error) {
    console.error('Error fetching doctors by specialty:', error);
    return [];
  }

  // Parse fees JSON string if needed
  return data.map(doctor => ({
    ...doctor,
    fees: typeof doctor.fees === 'string' 
      ? JSON.parse(doctor.fees) 
      : doctor.fees as Fees
  }));
}

// Function to seed doctors data if table is empty
export async function seedDoctorsData() {
  // Check if doctors table already has data
  const { count, error: countError } = await supabase
    .from('doctors')
    .select('*', { count: 'exact', head: true });

  if (countError) {
    console.error('Error checking doctors count:', countError);
    return;
  }

  // If table is empty (count is 0 or null), seed with default data
  if (!count) {
    console.log('Seeding doctors table...');
    
    // Format the data properly for insertion
    const doctorsToInsert = defaultDoctors.map(doctor => ({
      ...doctor,
      fees: JSON.stringify({
        examination: doctor.fees.examination,
        consultation: doctor.fees.consultation
      })
    }));

    const { error: insertError } = await supabase
      .from('doctors')
      .insert(doctorsToInsert);

    if (insertError) {
      console.error('Error seeding doctors data:', insertError);
    } else {
      console.log('Successfully seeded doctors table.');
    }
  } else {
    console.log('Doctors table already has data, skipping seed.');
  }
}
