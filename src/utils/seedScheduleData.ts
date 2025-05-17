
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

export async function seedDoctorSchedules() {
  try {
    console.log("Starting to seed doctor schedules...");
    
    // First, check if schedules already exist
    const { data: existingSchedules, error: checkError } = await supabase
      .from('doctor_schedules')
      .select('*')
      .limit(1);
      
    if (checkError) {
      console.error("Error checking existing schedules:", checkError);
      return;
    }
    
    // If schedules already exist, don't seed more
    if (existingSchedules && existingSchedules.length > 0) {
      console.log("Doctor schedules already exist, skipping seeding");
      return;
    }
    
    // Sample schedules for testing - match these to your existing doctor IDs
    const sampleSchedules = [
      { doctor_id: 1, day: 'Sun', time: '18:00' },
      { doctor_id: 1, day: 'Tue', time: '18:00' },
      { doctor_id: 1, day: 'Thu', time: '18:00' },
      { doctor_id: 2, day: 'Sat', time: '19:00' },
      { doctor_id: 2, day: 'Mon', time: '19:00' },
      { doctor_id: 2, day: 'Wed', time: '19:00' },
      { doctor_id: 3, day: 'Mon', time: '19:30' },
      { doctor_id: 3, day: 'Wed', time: '19:30' },
    ];
    
    // Insert sample schedules
    const { data, error } = await supabase
      .from('doctor_schedules')
      .insert(sampleSchedules);
      
    if (error) {
      console.error("Error seeding doctor schedules:", error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء إضافة جداول الأطباء",
        variant: "destructive",
      });
      return;
    }
    
    console.log("Successfully seeded doctor schedules");
    toast({
      title: "تم بنجاح",
      description: "تم إضافة جداول الأطباء بنجاح",
    });
    
    return true;
  } catch (error) {
    console.error("Error in seedDoctorSchedules:", error);
    return false;
  }
}
