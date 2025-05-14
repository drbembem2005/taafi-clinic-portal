
export interface Doctor {
  name: string;
  specialty: string; // Keeping this as "specialty" in the interface to maintain compatibility
  fees: {
    examination: number | string;
    consultation: number | string | null;
  };
  schedule: {
    [key: string]: string[];
  };
  image?: string;
  bio?: string;
}

// Note: This static data is mainly for reference now that we're using the database
export const doctors: Doctor[] = [
  {"name":"د. حنان زغلول","specialty":"طب الأطفال وحديثي الولادة","fees":{"examination":400,"consultation":200},"schedule":{"Sat":[],"Sun":["18:00"],"Mon":[],"Tue":["18:00"],"Wed":[],"Thu":["18:00"]}},
  {"name":"د. سمية علي عسكر","specialty":"طب الأطفال وحديثي الولادة","fees":{"examination":400,"consultation":100},"schedule":{"Sat":["19:00"],"Sun":[],"Mon":["19:00"],"Tue":[],"Wed":["19:00"],"Thu":[]}},
  {"name":"د. نرمين ابراهيم","specialty":"الجلدية والتجميل","fees":{"examination":100,"consultation":null},"schedule":{"Mon":["19:30"],"Wed":["19:30"]}},
  {"name":"د. بسمة محمد ربيع","specialty":"الجلدية والتجميل","fees":{"examination":400,"consultation":100},"schedule":{"Sun":["18:00"],"Wed":["18:00"],"Thu":["18:00"]}},
  {"name":"د. عزة عبدالوارث","specialty":"النساء والتوليد والعقم","fees":{"examination":400,"consultation":100},"schedule":{"Sun":["19:00"],"Tue":["19:00"]}},
  {"name":"د. عبير عوض","specialty":"النساء والتوليد والعقم","fees":{"examination":400,"consultation":100},"schedule":{"Mon":["11:00"],"Thu":["11:00"]}},
  {"name":"د. جمال عبدالصادق","specialty":"الجراحة العامة والمناظير","fees":{"examination":450,"consultation":100},"schedule":{"Sat":["18:00"],"Sun":["18:00"],"Mon":["18:00"],"Tue":["18:00"],"Wed":["18:00"],"Thu":["18:00"]}},
  {"name":"د. حنان جمال","specialty":"الجراحة العامة والمناظير","fees":{"examination":400,"consultation":100},"schedule":{"Mon":["09:00"]}},
  {"name":"د. بهاء دويدار","specialty":"الجراحة العامة والمناظير","fees":{"examination":450,"consultation":50},"schedule":{"Sat":["19:00"],"Sun":["19:00"],"Mon":["19:00"],"Tue":["19:00"],"Wed":["19:00"],"Thu":["19:00"]}},
  {"name":"د. أسامة العطار","specialty":"الجراحة العامة والمناظير","fees":{"examination":400,"consultation":100},"schedule":{"Sun":["08:30"],"Tue":["08:30"]}},
  {"name":"د. وليد قداح","specialty":"الجراحة العامة والمناظير","fees":{"examination":400,"consultation":100},"schedule":{}},
  {"name":"د. حاتم حسين","specialty":"الجراحة العامة والمناظير","fees":{"examination":450,"consultation":100},"schedule":{"Sat":["08:00"],"Mon":["08:00"],"Wed":["08:00"]}},
  {"name":"د. محمد عبدالودود","specialty":"الجلدية والتجميل","fees":{"examination":400,"consultation":100},"schedule":{"Sat":["16:00"],"Mon":["16:00"],"Thu":["16:00"]}},
  {"name":"د. أحمد تمساح","specialty":"الذكورة وتأخر الإنجاب","fees":{"examination":500,"consultation":100},"schedule":{"Sat":["20:00"],"Mon":["20:00"],"Wed":["20:00"]}},
  {"name":"د. يسري عبدالغفار","specialty":"الباطنة والسكري والغدد والكلى","fees":{"examination":600,"consultation":100},"schedule":{"Sat":["18:30"],"Mon":["18:30"],"Wed":["18:30"]}},
  {"name":"د. صبحي محمود","specialty":"الباطنة والسكري والغدد والكلى","fees":{"examination":500,"consultation":100},"schedule":{"Sat":["18:00"],"Wed":["18:00"]}},
  {"name":"د. منى عبدالفتاح","specialty":"الباطنة والسكري والغدد والكلى","fees":{"examination":500,"consultation":100},"schedule":{"Sun":["18:30"],"Tue":["18:30"],"Thu":["18:30"]}},
  {"name":"د. حسن هندام","specialty":"الباطنة والسكري والغدد والكلى","fees":{"examination":"500 شامل السونار","consultation":null},"schedule":{"Sat":["08:00"],"Mon":["08:00"],"Wed":["08:00"],"Thu":["08:00"]}},
  {"name":"د. محمد نبيل","specialty":"الباطنة والسكري والغدد والكلى","fees":{"examination":"500 شامل السونار","consultation":100},"schedule":{"Sat":["07:00"],"Sun":["14:00"],"Mon":["14:00"],"Tue":["14:00"],"Thu":["14:00"]}},
  {"name":"د. أحمد سعد","specialty":"الباطنة والسكري والغدد والكلى","fees":{"examination":400,"consultation":100},"schedule":{"Sat":["08:20"],"Sun":["08:20"],"Mon":["08:20"],"Tue":["08:20"],"Wed":["08:20"],"Thu":["08:20"]}},
  {"name":"د. عزت شعلان","specialty":"الأمراض النفسية وتعديل السلوك","fees":{"examination":700,"consultation":400},"schedule":{"Sat":["18:00"],"Wed":["18:00"]}},
  {"name":"د. مروة أبو الوفا","specialty":"الأمراض النفسية وتعديل السلوك","fees":{"examination":400,"consultation":null},"schedule":{"Sat":["18:00"],"Mon":["18:00"],"Wed":["18:00"]}},
  {"name":"د. إيهاب الصياد","specialty":"علاج الأورام والمناظير","fees":{"examination":500,"consultation":100},"schedule":{"Sat":["18:00"],"Tue":["18:00"],"Thu":["18:00"]}},
  {"name":"د. مجدي محمد شلبي","specialty":"جراحة المخ والأعصاب والعمود الفقري","fees":{"examination":600,"consultation":100},"schedule":{"Thu":["17:00"]}},
  {"name":"د. عبدالعزيز أبو العلا","specialty":"جراحة المخ والأعصاب والعمود الفقري","fees":{"examination":600,"consultation":100},"schedule":{"Sat":["14:00"],"Tue":["17:00"],"Wed":["13:30"]}},
  {"name":"د. هاني محرم","specialty":"الأنف والأذن والحنجرة","fees":{"examination":400,"consultation":100},"schedule":{"Sat":["08:00"],"Mon":["08:00"],"Wed":["08:00"],"Thu":["حسب الحالات"]}},
  {"name":"د. أحمد منصور","specialty":"الأنف والأذن والحنجرة","fees":{"examination":400,"consultation":100},"schedule":{"Sat":["08:00"],"Sun":["08:00"],"Mon":["08:00"],"Tue":["08:00"],"Wed":["08:00"],"Thu":["08:00"]}},
  {"name":"د. وليد محمود","specialty":"العظام والمفاصل وإصابات الملاعب","fees":{"examination":400,"consultation":100},"schedule":{"Thu":["15:00"]}},
  {"name":"د. بدر علي بدر","specialty":"العظام والمفاصل وإصابات الملاعب","fees":{"examination":500,"consultation":100},"schedule":{"Mon":["19:00"],"Wed":["19:00"]}},
  {"name":"د. محمد السباعي","specialty":"العظام والمفاصل وإصابات الملاعب","fees":{"examination":400,"consultation":100},"schedule":{"Sat":["08:00"],"Sun":["08:00"],"Mon":["08:00"],"Tue":["08:00"]}},
  {"name":"د. محمود عابدين","specialty":"الروماتيزم والمفاصل","fees":{"examination":400,"consultation":100},"schedule":{"Sat":["08:00"],"Sun":["08:00"],"Mon":["08:00"],"Tue":["08:00"],"Wed":["08:00"],"Thu":["08:00"]}},
  {"name":"د. إيمان راشد","specialty":"التغذية العلاجية والعلاج الطبيعي","fees":{"examination":"300 (فيزيتا 400)","consultation":"100"},"schedule":{"Sat":["16:00"],"Sun":["16:00"],"Tue":["16:00"]}},
  {"name":"د. مصطفى حفناوي","specialty":"التغذية العلاجية والعلاج الطبيعي","fees":{"examination":250,"consultation":400},"schedule":{"Sat":["09:00"],"Mon":["09:00"],"Wed":["09:00"]}},
  {"name":"د. ميرنا ياسر","specialty":"التغذية العلاجية والعلاج الطبيعي","fees":{"examination":250,"consultation":400},"schedule":{"Sat":["08:00"],"Mon":["08:00"],"Wed":["08:00"]}},
  {"name":"د. آلاء حسن","specialty":"التغذية العلاجية والعلاج الطبيعي","fees":{"examination":250,"consultation":400},"schedule":{"Sun":["18:00"],"Tue":["18:00"],"Thu":["18:00"]}},
  {"name":"د. محمود البصيلي","specialty":"طب وجراحة الأسنان","fees":{"examination":300,"consultation":null},"schedule":{"Sat":["18:00"],"Sun":["18:00"],"Mon":["18:00"],"Tue":["18:00"],"Wed":["18:00"],"Thu":["15:00"]}},
  {"name":"د. مصعب إسماعيل","specialty":"طب وجراحة الأسنان","fees":{"examination":300,"consultation":null},"schedule":{"Sat":["07:00"],"Wed":["19:00"]}}
];

// Map Arabic day names to English keys used in the doctor schedules
export const dayMappings = {
  'السبت': 'Sat',
  'الأحد': 'Sun',
  'الاثنين': 'Mon',
  'الثلاثاء': 'Tue',
  'الأربعاء': 'Wed',
  'الخميس': 'Thu',
  'الجمعة': 'Fri'
};

export const weekDays = [
  'السبت',
  'الأحد',
  'الاثنين',
  'الثلاثاء',
  'الأربعاء',
  'الخميس',
  'الجمعة'
];

// Get all unique specialties from doctors
export const getUniqueSpecialties = (): string[] => {
  const specialties = new Set<string>();
  
  doctors.forEach(doctor => {
    specialties.add(doctor.specialty);
  });
  
  return Array.from(specialties);
};

// Get doctors by specialty
export const getDoctorsBySpecialty = (specialty: string): Doctor[] => {
  return doctors.filter(doctor => doctor.specialty === specialty);
};

// Get available days from a doctor's schedule
export const getAvailableDays = (doctor: Doctor): string[] => {
  return Object.entries(doctor.schedule)
    .filter(([_, times]) => times.length > 0)
    .map(([day, _]) => {
      // Map English day key back to Arabic
      const arabicDay = Object.keys(dayMappings).find(
        (key) => dayMappings[key as keyof typeof dayMappings] === day
      );
      return arabicDay || day;
    });
};

// Check if doctor is available on a specific day
export const isDoctorAvailableOnDay = (doctor: Doctor, arabicDay: string): boolean => {
  const englishDay = dayMappings[arabicDay as keyof typeof dayMappings];
  return doctor.schedule[englishDay]?.length > 0;
};
