
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { format, addDays, startOfDay } from 'date-fns';
import { ar } from 'date-fns/locale';

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
  schedule?: Record<string, any>; // Keep for backward compatibility during transition
}

// Define the DoctorSchedule type
export interface DoctorSchedule {
  id: number;
  doctor_id: number;
  day: string;
  time: string;
}

// Days of the week in both languages for reference
const dayMappings = {
  'السبت': 'Sat',
  'الأحد': 'Sun',
  'الاثنين': 'Mon',
  'الثلاثاء': 'Tue',
  'الأربعاء': 'Wed',
  'الخميس': 'Thu',
  'الجمعة': 'Fri'
};

export const arabicDayNames = {
  'Sat': 'السبت',
  'Sun': 'الأحد',
  'Mon': 'الاثنين',
  'Tue': 'الثلاثاء',
  'Wed': 'الأربعاء',
  'Thu': 'الخميس',
  'Fri': 'الجمعة'
};

// Map JavaScript day index (0-6, where 0 is Sunday) to our day codes
export const dayIndexToCode = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

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

    if (!data || data.length === 0) {
      console.log('No doctors found in the database');
      return [];
    }

    console.log('Doctors data from Supabase:', data);

    // Parse fees JSON string if needed and convert to Doctor type
    return data.map(doctor => ({
      ...doctor,
      fees: typeof doctor.fees === 'string' 
        ? JSON.parse(doctor.fees) 
        : (doctor.fees as unknown as Fees)
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

    // Parse fees JSON string if needed and convert to Doctor type
    return {
      ...data,
      fees: typeof data.fees === 'string' 
        ? JSON.parse(data.fees) 
        : (data.fees as unknown as Fees)
    } as Doctor;
  } catch (error) {
    console.error('Error in getDoctor:', error);
    return null;
  }
}

export async function getDoctorsBySpecialtyId(specialtyId: number): Promise<Doctor[]> {
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

    // Parse fees JSON string if needed and convert to Doctor type
    return data.map(doctor => ({
      ...doctor,
      fees: typeof doctor.fees === 'string' 
        ? JSON.parse(doctor.fees) 
        : (doctor.fees as unknown as Fees)
    })) as Doctor[];
  } catch (error) {
    console.error('Error in getDoctorsBySpecialty:', error);
    return [];
  }
}

// For backward compatibility
export const getDoctorsBySpecialty = getDoctorsBySpecialtyId;

// Enhanced function to get a doctor's schedule from the doctor_schedules table
export async function getDoctorSchedule(doctorId: number): Promise<Record<string, string[]>> {
  try {
    console.log(`Fetching schedule for doctor ID: ${doctorId}`);
    const { data, error } = await supabase
      .from('doctor_schedules')
      .select('*')
      .eq('doctor_id', doctorId);
    
    if (error) {
      console.error('Error fetching doctor schedule:', error);
      toast({
        title: "خطأ",
        description: error.message,
        variant: "destructive",
      });
      return {};
    }

    console.log(`Retrieved ${data.length} schedule entries for doctor ${doctorId}:`, data);

    // Convert the flat structure to the grouped day -> times[] format
    const schedule: Record<string, string[]> = {};
    
    data.forEach((item: DoctorSchedule) => {
      if (!schedule[item.day]) {
        schedule[item.day] = [];
      }
      schedule[item.day].push(item.time);
    });

    console.log(`Formatted schedule for doctor ${doctorId}:`, schedule);
    return schedule;
  } catch (error) {
    console.error('Error in getDoctorSchedule:', error);
    return {};
  }
}

// Function to get the next 3 available appointment days for a doctor
export async function getNextAvailableDays(doctorId: number): Promise<Array<{date: Date, dayName: string, dayCode: string, times: string[]}>> {
  try {
    // Get doctor schedule
    const schedule = await getDoctorSchedule(doctorId);
    if (Object.keys(schedule).length === 0) {
      console.log(`No schedule found for doctor ${doctorId}`);
      return [];
    }

    const today = startOfDay(new Date());
    const availableDays: Array<{date: Date, dayName: string, dayCode: string, times: string[]}> = [];
    let currentDate = today;
    let daysChecked = 0;
    
    // Look up to 14 days ahead to find 3 available days
    while (availableDays.length < 3 && daysChecked < 14) {
      const dayIndex = currentDate.getDay(); // 0 = Sunday, 1 = Monday, etc.
      const dayCode = dayIndexToCode[dayIndex];
      
      // Check if doctor works on this day
      if (schedule[dayCode] && schedule[dayCode].length > 0) {
        availableDays.push({
          date: new Date(currentDate),
          dayName: format(currentDate, 'EEEE', { locale: ar }),
          dayCode,
          times: schedule[dayCode]
        });
      }
      
      // Move to next day
      currentDate = addDays(currentDate, 1);
      daysChecked++;
    }

    console.log(`Found ${availableDays.length} available days for doctor ${doctorId}:`, availableDays);
    return availableDays;
  } catch (error) {
    console.error('Error in getNextAvailableDays:', error);
    toast({
      title: "خطأ",
      description: "حدث خطأ أثناء جلب المواعيد المتاحة",
      variant: "destructive",
    });
    return [];
  }
}

// Function to seed the doctors data manually through JavaScript
export async function seedDoctorsData() {
  try {
    // First, seed specialties
    const specialties = [
      {
        name: "طب الأطفال وحديثي الولادة",
        description: "رعاية صحية للأطفال منذ الولادة",
        details: "تشخيص وعلاج أمراض الأطفال والرضع مع متابعة النمو والتطور",
        icon: "baby"
      },
      {
        name: "الجلدية والتجميل",
        description: "علاج أ��راض البشرة والتجميل",
        details: "علاج أمراض الجلد المختلفة وإجراءات التجميل غير الجراحية",
        icon: "sparkles"
      },
      {
        name: "النساء والتوليد والعقم",
        description: "رعاية صحية للمرأة والحمل",
        details: "متابعة صحة المرأة والحمل وعلاج مشاكل العقم",
        icon: "baby"
      },
      {
        name: "الجراحة العامة والمناظير",
        description: "عمليات جراحية وتشخيص بالمناظير",
        details: "إجراء العمليات الجراحية والتشخيص باستخدام المناظير الطبية",
        icon: "scissors"
      },
      {
        name: "الذكورة وتأخر الإنجاب",
        description: "علاج مشاكل الصحة الإنجابية للرجال",
        details: "علاج مشاكل الخصوبة وتأخر الإنجاب والصحة الجنسية للرجال",
        icon: "male"
      },
      {
        name: "الباطنة والسكري والغدد والكلى",
        description: "علاج أمراض الباطنة والغدد الصماء",
        details: "تشخيص وعلاج أمراض الباطنة والسكري والغدد الصماء والكلى",
        icon: "activity"
      }
    ];

    // Insert specialties
    for (const specialty of specialties) {
      const { error: specialtyError } = await supabase
        .from('specialties')
        .upsert([specialty], { onConflict: 'name' });
      
      if (specialtyError) {
        console.error('Error inserting specialty:', specialtyError);
      }
    }

    // Get specialty IDs for reference
    const { data: specialtyData, error: specialtyFetchError } = await supabase
      .from('specialties')
      .select('id, name');
    
    if (specialtyFetchError) {
      console.error('Error fetching specialty IDs:', specialtyFetchError);
      return;
    }

    // Map specialty names to IDs
    const specialtyMap = new Map();
    specialtyData.forEach(s => {
      specialtyMap.set(s.name, s.id);
    });

    // Sample doctors data
    const doctors = [
      {
        name: "د. حنان زغلول",
        specialty_id: specialtyMap.get("طب الأطفال وحديثي الولادة"),
        fees: { examination: 400, consultation: 200 },
        schedule: { "Sat": [], "Sun": ["18:00"], "Mon": [], "Tue": ["18:00"], "Wed": [], "Thu": ["18:00"] },
        bio: "استشاري طب الاطفال وحديثي الولادة"
      },
      {
        name: "د. سمية علي عسكر",
        specialty_id: specialtyMap.get("طب الأطفال وحديثي الولادة"),
        fees: { examination: 400, consultation: 100 },
        schedule: { "Sat": ["19:00"], "Sun": [], "Mon": ["19:00"], "Tue": [], "Wed": ["19:00"], "Thu": [] },
        bio: "استشاري طب الاطفال وحديثي الولادة"
      },
      {
        name: "د. نرمين ابراهيم",
        specialty_id: specialtyMap.get("الجلدية والتجميل"),
        fees: { examination: 100, consultation: null },
        schedule: { "Sat": [], "Sun": [], "Mon": ["19:30"], "Tue": [], "Wed": ["19:30"], "Thu": [] },
        bio: "اخصائي التجميل اللاجراحي والعناية بالبشرة"
      }
    ];

    // Insert doctors
    for (const doctor of doctors) {
      const { error: doctorError } = await supabase
        .from('doctors')
        .upsert([doctor], { onConflict: 'name' });
      
      if (doctorError) {
        console.error('Error inserting doctor:', doctorError);
      }
    }

    console.log("Doctors data has been seeded successfully.");
    return true;
  } catch (error) {
    console.error("Error seeding doctors data:", error);
    return false;
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
}
