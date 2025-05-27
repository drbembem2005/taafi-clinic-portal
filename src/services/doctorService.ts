
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
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
  image?: string;
  bio?: string;
  fees?: {
    examination: number;
    consultation: number | null;
  };
  old_schedule?: Record<string, unknown>;
  title?: string;
  experience?: number;
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
  'Fri': 'الجمعة',
  'sat': 'السبت'  // Added lowercase version since it appears in the data
};

// Map JavaScript day index (0-6, where 0 is Sunday) to our day codes
export const dayIndexToCode = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// Standard day codes we'll use throughout the app for consistency
export const standardDayCodes = ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

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
      // Normalize day codes to standard format (first letter uppercase, rest lowercase)
      const normalizedDay = normalizeDay(item.day);
      
      if (!schedule[normalizedDay]) {
        schedule[normalizedDay] = [];
      }
      schedule[normalizedDay].push(item.time);
    });

    console.log(`Formatted schedule for doctor ${doctorId}:`, schedule);
    return schedule;
  } catch (error) {
    console.error('Error in getDoctorSchedule:', error);
    return {};
  }
}

// Helper function to normalize day codes
function normalizeDay(day: string): string {
  // First check if it's already a standard day code
  if (standardDayCodes.includes(day)) {
    return day;
  }
  
  // Convert lowercase versions to standard format
  if (day.toLowerCase() === 'sat') return 'Sat';
  if (day.toLowerCase() === 'sun') return 'Sun';
  if (day.toLowerCase() === 'mon') return 'Mon';
  if (day.toLowerCase() === 'tue') return 'Tue';
  if (day.toLowerCase() === 'wed') return 'Wed';
  if (day.toLowerCase() === 'thu') return 'Thu';
  if (day.toLowerCase() === 'fri') return 'Fri';
  
  // If it's an Arabic day name, convert to English
  for (const [arabic, english] of Object.entries(dayMappings)) {
    if (day === arabic) return english;
  }
  
  // If we can't normalize, return as is but log a warning
  console.warn(`Could not normalize day code: ${day}`);
  return day;
}

// Function to get the next 3 available appointment days for a doctor
export async function getNextAvailableDays(doctorId: number): Promise<Array<{date: Date, dayName: string, dayCode: string, times: string[], uniqueId: string}>> {
  try {
    // Get doctor schedule
    const schedule = await getDoctorSchedule(doctorId);
    if (Object.keys(schedule).length === 0) {
      console.log(`No schedule found for doctor ${doctorId}`);
      return [];
    }

    console.log("Doctor schedule for available days:", schedule);
    
    const today = startOfDay(new Date());
    const availableDays: Array<{date: Date, dayName: string, dayCode: string, times: string[], uniqueId: string}> = [];
    let currentDate = today;
    let daysChecked = 0;
    
    // Look up to 14 days ahead to find 3 available days
    while (availableDays.length < 3 && daysChecked < 14) {
      const dayIndex = currentDate.getDay(); // 0 = Sunday, 1 = Monday, etc.
      const dayCode = dayIndexToCode[dayIndex];
      
      console.log(`Checking day ${dayCode} for date ${currentDate.toISOString()}`);
      
      // Check if doctor works on this day
      if (schedule[dayCode] && schedule[dayCode].length > 0) {
        // Create a unique ID that distinguishes between different dates with the same day of week
        const uniqueId = `${dayCode}-${currentDate.getTime()}`;
        
        console.log(`Found available day: ${dayCode} with times:`, schedule[dayCode]);
        
        availableDays.push({
          date: new Date(currentDate),
          dayName: format(currentDate, 'EEEE', { locale: ar }),
          dayCode,
          times: schedule[dayCode],
          uniqueId // Include the unique ID
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
