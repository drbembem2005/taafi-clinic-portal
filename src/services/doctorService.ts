
import { supabase } from '@/integrations/supabase/client';
import { doctors as defaultDoctors } from '@/data/doctors';

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
      : doctor.fees,
    schedule: typeof doctor.schedule === 'string'
      ? JSON.parse(doctor.schedule)
      : doctor.schedule
  })) as Doctor[];
}

export async function getDoctor(id: number): Promise<Doctor | null> {
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
      : data.fees,
    schedule: typeof data.schedule === 'string'
      ? JSON.parse(data.schedule)
      : data.schedule
  } as Doctor;
}

export async function getDoctorsBySpecialty(specialtyId: number): Promise<Doctor[]> {
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
      : doctor.fees,
    schedule: typeof doctor.schedule === 'string'
      ? JSON.parse(doctor.schedule)
      : doctor.schedule
  })) as Doctor[];
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

// Function to seed doctors data with the new data provided
export async function seedDoctorsData() {
  // Check if doctors table already has data
  const { count, error: countError } = await supabase
    .from('doctors')
    .select('*', { count: 'exact', head: true });

  if (countError) {
    console.error('Error checking doctors count:', countError);
    return;
  }

  // If table is empty (count is 0 or null), seed with the new doctor data
  if (!count) {
    console.log('Seeding doctors table with new data...');

    // Create new doctors data from the CSV provided
    const newDoctors = [
      {
        name: "د. حنان زغلول",
        specialty: "استشاري طب الاطفال وحديثي الولادة",
        fees: { examination: 400, consultation: 200 },
        schedule: { "Sat": [], "Sun": ["18:00"], "Mon": [], "Tue": ["18:00"], "Wed": [], "Thu": ["18:00"] },
      },
      {
        name: "د. سمية علي عسكر",
        specialty: "استشاري طب الاطفال وحديثي الولادة",
        fees: { examination: 400, consultation: 100 },
        schedule: { "Sat": ["19:00"], "Sun": [], "Mon": ["19:00"], "Tue": [], "Wed": ["19:00"], "Thu": [] },
      },
      {
        name: "د. نرمين ابراهيم",
        specialty: "اخصائي التجميل اللاجراحي والعناية بالبشرة",
        fees: { examination: 100, consultation: null },
        schedule: { "Sat": [], "Sun": [], "Mon": ["19:30"], "Tue": [], "Wed": ["19:30"], "Thu": [] },
      },
      {
        name: "د.بسمة محمد ربيع",
        specialty: "اخصائي الامراض الجلدية",
        fees: { examination: 400, consultation: 100 },
        schedule: { "Sat": [], "Sun": ["18:00"], "Mon": [], "Tue": [], "Wed": ["18:00"], "Thu": ["18:00"] },
      },
      {
        name: "د. عزة عبدالوارث",
        specialty: "استشاري أمراض النساء والتوليد والعقم",
        fees: { examination: 400, consultation: 100 },
        schedule: { "Sat": [], "Sun": ["19:00"], "Mon": [], "Tue": ["19:00"], "Wed": [], "Thu": [] },
      },
      {
        name: "د. عبير عوض",
        specialty: "استشاري أمراض النساء والتوليد والعقم",
        fees: { examination: 400, consultation: 100 },
        schedule: { "Sat": [], "Sun": [], "Mon": ["11:00"], "Tue": [], "Wed": [], "Thu": ["11:00"] },
      },
      {
        name: "د. جمال عبدالصادق",
        specialty: "استشاري الجراحة العامة و الاوعية الدموية والقدم السكري",
        fees: { examination: 450, consultation: 100 },
        schedule: { "Sat": ["18:00"], "Sun": ["18:00"], "Mon": ["18:00"], "Tue": ["18:00"], "Wed": ["18:00"], "Thu": ["18:00"] },
      },
      {
        name: "د. حنان جمال",
        specialty: "اخصائي الجراحة العامة و الاوعية الدموية والقدم السكري",
        fees: { examination: 400, consultation: 100 },
        schedule: { "Sat": [], "Sun": [], "Mon": [], "Tue": ["9:00"], "Wed": [], "Thu": [] },
      },
      {
        name: "د. بهاء دويدار",
        specialty: "استشاري الجراحة العامة والمسالك",
        fees: { examination: 450, consultation: 50 },
        schedule: { "Sat": ["19:00"], "Sun": ["19:00"], "Mon": ["19:00"], "Tue": ["19:00"], "Wed": ["19:00"], "Thu": ["19:00"] },
      },
      {
        name: "د. اسامة العطار",
        specialty: "استشاري الجراحة العامة والمناظير",
        fees: { examination: 400, consultation: 100 },
        schedule: { "Sat": [], "Sun": ["8:30"], "Mon": [], "Tue": ["8:30"], "Wed": [], "Thu": [] },
      },
      {
        name: "د. وليد قداح",
        specialty: "استشاري الجراحة العامة والتجميل",
        fees: { examination: 400, consultation: 100 },
        schedule: {},
      },
      {
        name: "د. حاتم حسين",
        specialty: "استشاري الجراحة العامة والتجميل والحروق",
        fees: { examination: 450, consultation: 100 },
        schedule: { "Sat": ["8:00"], "Sun": [], "Mon": ["8:00"], "Tue": [], "Wed": ["8:00"], "Thu": [] },
      },
      {
        name: "د. محمد عبدالودود",
        specialty: "اخصائي جراحات التجميل",
        fees: { examination: 400, consultation: 100 },
        schedule: { "Sat": ["16:00"], "Sun": [], "Mon": ["16:00"], "Tue": [], "Wed": [], "Thu": ["16:00"] },
      },
      {
        name: "د. احمد تمساح",
        specialty: "استشاري امراض الذكوره وتأخر الانجاب",
        fees: { examination: 500, consultation: 100 },
        schedule: { "Sat": ["20:00"], "Sun": [], "Mon": ["20:00"], "Tue": [], "Wed": ["20:00"], "Thu": [] },
      },
      {
        name: "د. يسري عبدالغفار",
        specialty: "استشاري الباطنة والجهاز الهضمي والسكر والغدد الصماء وامراض الكلي",
        fees: { examination: 600, consultation: 100 },
        schedule: { "Sat": ["18:30"], "Sun": [], "Mon": ["18:30"], "Tue": [], "Wed": ["18:30"], "Thu": [] },
      },
      {
        name: "د. صبحي محمود",
        specialty: "استشاري الباطنة والجهاز الهضمي وأمراض الكبد",
        fees: { examination: 500, consultation: 100 },
        schedule: { "Sat": ["18:00"], "Sun": [], "Mon": [], "Tue": [], "Wed": ["18:00"], "Thu": [] },
      },
      {
        name: "د. منى عبدالفتاح",
        specialty: "استشاري الباطنة والسكر والغدد الصماء والجهاز الهضمي",
        fees: { examination: 500, consultation: 100 },
        schedule: { "Sat": [], "Sun": ["18:30"], "Mon": [], "Tue": ["18:30"], "Wed": [], "Thu": ["18:30"] },
      },
      {
        name: "د.حسن هندام",
        specialty: "اخصائي الباطنة والجهاز الهضمي وأمراض الكبد",
        fees: { examination: "500 شامل السونار", consultation: null },
        schedule: { "Sat": ["8:00"], "Sun": [], "Mon": ["8:00"], "Tue": [], "Wed": ["8:00"], "Thu": ["8:00"] },
      },
      {
        name: "د. محمد نبيل",
        specialty: "اخصائي الباطنة والجهاز الهضمي وأمراض الكبد",
        fees: { examination: "500 شامل السونار", consultation: 100 },
        schedule: { "Sat": ["7:00"], "Sun": ["14:00"], "Mon": ["14:00"], "Tue": ["14:00"], "Wed": [], "Thu": ["14:00"] },
      },
      {
        name: "د. احمد سعد",
        specialty: "استشاري الامراض الصدرية والحساسية والدرن",
        fees: { examination: 400, consultation: 100 },
        schedule: { "Sat": ["8:20"], "Sun": ["8:20"], "Mon": ["8:20"], "Tue": ["8:20"], "Wed": ["8:20"], "Thu": ["8:20"] },
      },
      {
        name: "د.عزت شعلان",
        specialty: "استشاري الامراض النفسية و علاج الادمان والاستشارات الاسرية",
        fees: { examination: 700, consultation: 400 },
        schedule: { "Sat": ["18:00"], "Sun": [], "Mon": [], "Tue": [], "Wed": ["18:00"], "Thu": [] },
      },
      {
        name: "د. مروة ابوالوفا",
        specialty: "اخصائي تخاطب وتعديل سلوك و تنمية مهارات",
        fees: { examination: 400, consultation: null },
        schedule: { "Sat": ["18:00"], "Sun": [], "Mon": ["18:00"], "Tue": [], "Wed": ["18:00"], "Thu": [] },
      },
      {
        name: "د. ايهاب الصياد",
        specialty: "استشاري جراحة الاورام والمناظير",
        fees: { examination: 500, consultation: 100 },
        schedule: { "Sat": ["18:00"], "Sun": [], "Mon": [], "Tue": ["18:00"], "Wed": [], "Thu": ["18:00"] },
      },
      {
        name: "د. مجدي محمد شلبي",
        specialty: "استشاري جراحة المخ و الاعصاب والعمود الفقري",
        fees: { examination: 600, consultation: 100 },
        schedule: { "Sat": [], "Sun": [], "Mon": [], "Tue": [], "Wed": [], "Thu": ["17:00"] },
      },
      {
        name: "د. عبدالعزيز ابوالعلا",
        specialty: "استشاري جراحة المخ و الاعصاب والعمود الفقري",
        fees: { examination: 600, consultation: 100 },
        schedule: { "Sat": ["14:00"], "Sun": [], "Mon": [], "Tue": ["17:00"], "Wed": ["13:30"], "Thu": [] },
      },
      {
        name: "د. هاني محرم",
        specialty: "استشاري الانف و الاذن و الحنجرة و جراحات المناظير",
        fees: { examination: 400, consultation: 100 },
        schedule: { "Sat": ["8:00"], "Sun": [], "Mon": ["8:00"], "Tue": [], "Wed": ["8:00"], "Thu": ["حسب الحالات"] },
      },
      {
        name: "د. أحمد منصور",
        specialty: "اخصائي الانف والاذن والحنجرة",
        fees: { examination: 400, consultation: 100 },
        schedule: { "Sat": ["8:00"], "Sun": ["8:00"], "Mon": ["8:00"], "Tue": ["8:00"], "Wed": ["8:00"], "Thu": ["8:00"] },
      },
      {
        name: "د.وليد محمود",
        specialty: "استشاري جراحة العظام وعلاج المفاصل",
        fees: { examination: 400, consultation: 100 },
        schedule: { "Sat": [], "Sun": [], "Mon": [], "Tue": [], "Wed": ["15:00"], "Thu": [] },
      },
      {
        name: "د. بدر علي بدر",
        specialty: "استشاري جراحة العظام وعلاج المفاصل",
        fees: { examination: 500, consultation: 100 },
        schedule: { "Sat": [], "Sun": [], "Mon": ["19:00"], "Tue": [], "Wed": ["19:00"], "Thu": [] },
      },
      {
        name: "د. محمد السباعي",
        specialty: "اخصائي جراحة العظام واصابات الملاعب",
        fees: { examination: 400, consultation: 100 },
        schedule: { "Sat": ["8:00"], "Sun": ["8:00"], "Mon": ["8:00"], "Tue": ["8:00"], "Wed": [], "Thu": [] },
      },
      {
        name: "د.محمود عابدين",
        specialty: "استشاري الروماتيزم والالام المفاصل",
        fees: { examination: 400, consultation: 100 },
        schedule: { "Sat": ["8:00"], "Sun": ["8:00"], "Mon": ["8:00"], "Tue": ["8:00"], "Wed": ["8:00"], "Thu": ["8:00"] },
      },
      {
        name: "د. ايمان راشد",
        specialty: "اخصائي التغذية العلاجيه",
        fees: { examination: "300 فيزيتا 400", consultation: "م. تغذية 100" },
        schedule: { "Sat": ["16:00"], "Sun": ["16:00"], "Mon": [], "Tue": ["16:00"], "Wed": [], "Thu": [] },
      },
      {
        name: "د. مصطفى حفناوي",
        specialty: "استشاري العلاج الطبيعي والتأهيل واصابات الملاعب",
        fees: { examination: 250, consultation: 400 },
        schedule: { "Sat": ["9:00"], "Sun": [], "Mon": ["9:00"], "Tue": [], "Wed": ["9:00"], "Thu": [] },
      },
      {
        name: "د. ميرنا ياسر",
        specialty: "اخصائي العلاج الطبيعي والتأهيل واصابات الملاعب",
        fees: { examination: 250, consultation: 400 },
        schedule: { "Sat": ["8:00"], "Sun": [], "Mon": ["8:00"], "Tue": [], "Wed": ["8:00"], "Thu": [] },
      },
      {
        name: "د. الاء حسن",
        specialty: "اخصائي العلاج الطبيعي والتأهيل واصابات الملاعب",
        fees: { examination: 250, consultation: 400 },
        schedule: { "Sat": [], "Sun": ["18:00"], "Mon": [], "Tue": ["18:00"], "Wed": [], "Thu": ["18:00"] },
      },
      {
        name: "د. محمود البصيلي",
        specialty: "استشاري طب وجراحة الفم والاسنان",
        fees: { examination: 300, consultation: null },
        schedule: { "Sat": ["18:00"], "Sun": ["18:00"], "Mon": ["18:00"], "Tue": ["18:00"], "Wed": ["18:00"], "Thu": ["15:00"] },
      },
      {
        name: "د. مصعب اسماعيل",
        specialty: "اخصائي طب وجراحة الفم و الاسنان",
        fees: { examination: 300, consultation: null },
        schedule: { "Sat": ["7:00"], "Sun": [], "Mon": [], "Tue": [], "Wed": ["19:00"], "Thu": [] },
      }
    ];

    // First, get the specialties to map by name
    const { data: specialtyData, error: specialtyError } = await supabase
      .from('specialties')
      .select('id, name');

    if (specialtyError) {
      console.error('Error fetching specialties:', specialtyError);
      return;
    }

    // Map specialty names to their IDs
    const specialtyMap = new Map();
    
    // First create a map of existing specialties
    specialtyData.forEach(specialty => {
      specialtyMap.set(specialty.name, specialty.id);
    });

    // Extract unique specialty names from new doctors
    const newSpecialtyNames = [...new Set(newDoctors.map(doctor => doctor.specialty))];
    
    // Insert any new specialties that don't exist yet
    for (const specialtyName of newSpecialtyNames) {
      if (!specialtyMap.has(specialtyName)) {
        const { data, error } = await supabase
          .from('specialties')
          .insert([{ 
            name: specialtyName, 
            icon: 'stethoscope', // Default icon
            description: specialtyName,
            details: specialtyName
          }])
          .select();

        if (error) {
          console.error(`Error creating specialty "${specialtyName}":`, error);
        } else if (data && data.length > 0) {
          specialtyMap.set(specialtyName, data[0].id);
        }
      }
    }

    // Format doctors data for insertion
    const doctorsToInsert = newDoctors.map(doctor => {
      // Find specialty_id by name
      const specialty_id = specialtyMap.get(doctor.specialty) || 1;
      
      return {
        name: doctor.name,
        specialty_id: specialty_id,
        bio: "",
        fees: JSON.stringify(doctor.fees),
        schedule: JSON.stringify(doctor.schedule),
      };
    });

    // Insert in batches of 20 (Supabase has a limit)
    const batchSize = 20;
    for (let i = 0; i < doctorsToInsert.length; i += batchSize) {
      const batch = doctorsToInsert.slice(i, i + batchSize);
      const { error: insertError } = await supabase
        .from('doctors')
        .insert(batch);

      if (insertError) {
        console.error(`Error seeding doctors data (batch ${i}):`, insertError);
        return;
      }
    }

    console.log('Successfully seeded doctors table with new data.');
  } else {
    console.log('Doctors table already has data, skipping seed.');
  }
}
