
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
  specialty: string; // For joining with specialty name
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
    
    // Map the joined data to include specialty name and ensure correct types
    return (data || []).map(doctor => ({
      ...doctor,
      specialty: doctor.specialties?.name || '',
      // Parse JSON fields
      schedule: typeof doctor.schedule === 'string' 
        ? JSON.parse(doctor.schedule) 
        : doctor.schedule as Record<string, string[]>,
      fees: {
        examination: doctor.fees?.examination || null,
        consultation: doctor.fees?.consultation || null
      }
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
    
    // Map the joined data to include specialty name and ensure correct types
    return (data || []).map(doctor => ({
      ...doctor,
      specialty: doctor.specialties?.name || '',
      // Parse JSON fields
      schedule: typeof doctor.schedule === 'string' 
        ? JSON.parse(doctor.schedule) 
        : doctor.schedule as Record<string, string[]>,
      fees: {
        examination: doctor.fees?.examination || null,
        consultation: doctor.fees?.consultation || null
      }
    }));
  } catch (error) {
    console.error("Error fetching doctors by specialty:", error);
    return [];
  }
};

// Function to seed doctors data
export const seedDoctorsData = async (): Promise<void> => {
  try {
    // Check if doctors table is empty
    const { count, error: countError } = await supabase
      .from('doctors')
      .select('*', { count: 'exact', head: true });
    
    if (countError) {
      toast({
        title: "Error checking doctors data",
        description: countError.message,
        variant: "destructive",
      });
      return;
    }
    
    // If table already has data, don't seed
    if (count && count > 0) {
      console.log("Doctors table already has data, skipping seed");
      return;
    }
    
    // Get specialties to map IDs
    const { data: specialties, error: specialtiesError } = await supabase
      .from('specialties')
      .select('id, name');
    
    if (specialtiesError || !specialties) {
      toast({
        title: "Error fetching specialties",
        description: specialtiesError?.message || "No specialties found",
        variant: "destructive",
      });
      return;
    }
    
    // Sample doctors data
    const doctorsToInsert = [
      {
        name: "د. حنان زغلول",
        specialty_id: specialties.find(s => s.name === 'طب الأطفال وحديثي الولادة')?.id,
        fees: { examination: 400, consultation: 200 },
        schedule: { Sat: [], Sun: ["18:00"], Mon: [], Tue: ["18:00"], Wed: [], Thu: ["18:00"] },
        bio: "طبيبة أطفال متخصصة مع خبرة 15 عاماً في مجال طب الأطفال وحديثي الولادة"
      },
      {
        name: "د. سمية علي عسكر",
        specialty_id: specialties.find(s => s.name === 'طب الأطفال وحديثي الولادة')?.id,
        fees: { examination: 400, consultation: 100 },
        schedule: { Sat: ["19:00"], Sun: [], Mon: ["19:00"], Tue: [], Wed: ["19:00"], Thu: [] },
        bio: "خبيرة في تغذية الأطفال والتطعيمات الحديثة"
      },
      {
        name: "د. بسمة محمد ربيع",
        specialty_id: specialties.find(s => s.name === 'الجلدية والتجميل')?.id,
        fees: { examination: 400, consultation: 100 },
        schedule: { Sun: ["18:00"], Wed: ["18:00"], Thu: ["18:00"] },
        bio: "متخصصة في علاج مشاكل البشرة والتجميل غير الجراحي"
      },
      {
        name: "د. عزة عبدالوارث",
        specialty_id: specialties.find(s => s.name === 'النساء والتوليد والعقم')?.id,
        fees: { examination: 400, consultation: 100 },
        schedule: { Sun: ["19:00"], Tue: ["19:00"] },
        bio: "استشارية في أمراض النساء والتوليد والعقم"
      },
      {
        name: "د. جمال عبدالصادق",
        specialty_id: specialties.find(s => s.name === 'الجراحة العامة والمناظير')?.id,
        fees: { examination: 450, consultation: 100 },
        schedule: { Sat: ["18:00"], Sun: ["18:00"], Mon: ["18:00"], Tue: ["18:00"], Wed: ["18:00"], Thu: ["18:00"] },
        bio: "جراح متخصص في العمليات الجراحية العامة والمناظير"
      },
      {
        name: "د. أحمد تمساح",
        specialty_id: specialties.find(s => s.name === 'الذكورة وتأخر الإنجاب')?.id,
        fees: { examination: 500, consultation: 100 },
        schedule: { Sat: ["20:00"], Mon: ["20:00"], Wed: ["20:00"] },
        bio: "استشاري في أمراض الذكورة وتأخر الإنجاب"
      },
      {
        name: "د. يسري عبدالغفار",
        specialty_id: specialties.find(s => s.name === 'الباطنة والسكري والغدد والكلى')?.id,
        fees: { examination: 600, consultation: 100 },
        schedule: { Sat: ["18:30"], Mon: ["18:30"], Wed: ["18:30"] },
        bio: "أستاذ الباطنة والسكري والغدد الصماء"
      },
      {
        name: "د. عزت شعلان",
        specialty_id: specialties.find(s => s.name === 'الأمراض النفسية وتعديل السلوك')?.id,
        fees: { examination: 700, consultation: 400 },
        schedule: { Sat: ["18:00"], Wed: ["18:00"] },
        bio: "استشاري في علاج الأمراض النفسية وتعديل السلوك"
      }
    ];
    
    // Filter out any doctors with missing specialty_id
    const validDoctors = doctorsToInsert.filter(doctor => doctor.specialty_id);
    
    if (validDoctors.length === 0) {
      toast({
        title: "Error preparing doctor data",
        description: "No valid specialty mappings found",
        variant: "destructive",
      });
      return;
    }
    
    // Insert the data
    const { error: insertError } = await supabase
      .from('doctors')
      .insert(validDoctors);
    
    if (insertError) {
      toast({
        title: "Error seeding doctors data",
        description: insertError.message,
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Doctor data seeded successfully",
      description: `Added ${validDoctors.length} doctors to the database`,
    });
  } catch (error) {
    console.error("Error seeding doctors data:", error);
    toast({
      title: "Error seeding doctors data",
      description: "An unexpected error occurred",
      variant: "destructive",
    });
  }
};
