
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

// Function to seed specialties data for tables
export async function seedSpecialties() {
  try {
    // Check if specialties already exist
    const { data: existingSpecialties, error: checkError } = await supabase
      .from('specialties')
      .select('id');
    
    if (checkError) {
      console.error("Error checking existing specialties:", checkError);
      return false;
    }
    
    // If there are already specialties, don't re-seed
    if (existingSpecialties && existingSpecialties.length > 0) {
      console.log("Specialties already exist, skipping seed");
      return true;
    }

    const specialties = [
      {
        name: "طب الأطفال وحديثي الولادة",
        icon: "baby",
        description: "رعاية متكاملة للأطفال من الولادة حتى البلوغ",
        details: "نقدم رعاية طبية شاملة للأطفال من حديثي الولادة إلى سن المراهقة، متخصصون في تطعيمات الأطفال، متابعة النمو والتطور، وعلاج الأمراض الشائعة والمزمنة لدى الأطفال."
      },
      {
        name: "النساء والتوليد والعقم",
        icon: "female",
        description: "رعاية متكاملة لصحة المرأة والحمل والولادة",
        details: "خدمات شاملة للمرأة تتضمن متابعة الحمل، رعاية ما قبل الولادة وبعدها، علاج مشاكل العقم، اضطرابات الدورة الشهرية، وجميع الأمراض النسائية."
      },
      {
        name: "الجلدية والتجميل",
        icon: "sparkles",
        description: "علاج أمراض الجلد والتجميل غير الجراحي",
        details: "نعالج مختلف مشاكل البشرة والشعر والأظافر، بالإضافة إلى تقديم خدمات التجميل غير الجراحي مثل حقن البوتوكس والفيلر وجلسات التقشير والليزر."
      },
      {
        name: "الجراحة العامة والمناظير",
        icon: "syringe",
        description: "إجراءات جراحية متقدمة للبطن والصدر",
        details: "فريق متخصص في مختلف العمليات الجراحية العامة بأحدث التقنيات، بما في ذلك جراحات المناظير قليلة التدخل، جراحات المسالك البولية، والقدم السكري."
      },
      {
        name: "الذكورة وتأخر الإنجاب",
        icon: "male",
        description: "علاج مشاكل الصحة الجنسية للرجال وتحسين الخصوبة",
        details: "نعالج اضطرابات الصحة الجنسية الذكورية، ضعف الانتصاب، مشاكل القذف، تأخر الإنجاب، وضعف الحيوانات المنوية، مع تقديم حلول فعالة وخصوصية تامة."
      },
      {
        name: "الباطنة والسكري والغدد والكلى",
        icon: "stomach",
        description: "تشخيص وعلاج أمراض الباطنة والغدد الصماء",
        details: "تشخيص وعلاج أمراض السكري، اضطرابات الغدد الصماء، أمراض الكلى، الجهاز الهضمي، الكبد، والأمراض المزمنة الأخرى باستخدام أحدث البروتوكولات العلاجية."
      },
      {
        name: "الأمراض النفسية وتعديل السلوك",
        icon: "brain",
        description: "العلاج النفسي والسلوكي والاستشارات الأسرية",
        details: "نقدم خدمات التقييم والعلاج النفسي للاضطرابات النفسية، تعديل السلوك، علاج الإدمان، الاستشارات الأسرية، وخدمات التخاطب وتنمية المهارات للأطفال."
      },
      {
        name: "علاج الأورام والمناظير",
        icon: "microscope",
        description: "فحص وعلاج الأورام الحميدة والخبيثة",
        details: "نقدم خدمات تشخيص الأورام بمختلف أنواعها، التدخلات الجراحية المناسبة، والمتابعة المستمرة للحالات باستخدام أحدث تقنيات المناظير والجراحة."
      },
      {
        name: "جراحة المخ والأعصاب والعمود الفقري",
        icon: "brain",
        description: "جراحات متخصصة للمخ والأعصاب والعمود الفقري",
        details: "متخصصون في جراحات المخ والأعصاب والعمود الفقري، علاج الانزلاق الغضروفي، الآلام العصبية، إصابات الرأس، وأورام الجهاز العصبي."
      },
      {
        name: "الأنف والأذن والحنجرة",
        icon: "ear",
        description: "علاج مشاكل الأنف والأذن والحنجرة للأطفال والكبار",
        details: "نعالج مختلف مشاكل الأنف، الأذن، الحنجرة، الجيوب الأنفية، والحساسية. نقدم أيضاً جراحات المناظير للأنف والجيوب الأنفية، واستئصال اللوزتين والغدد."
      },
      {
        name: "العظام والمفاصل وإصابات الملاعب",
        icon: "bone",
        description: "علاج كسور وإصابات العظام والمفاصل",
        details: "نقدم خدمات شاملة لعلاج كسور العظام، إصابات المفاصل، مشاكل العمود الفقري، الإصابات الرياضية، وإجراء العمليات الجراحية التقويمية."
      },
      {
        name: "الروماتيزم والمفاصل",
        icon: "bone",
        description: "تشخيص وعلاج أمراض الروماتيزم وآلام المفاصل",
        details: "نقدم تشخيصاً وعلاجاً لمختلف أمراض الروماتيزم، التهاب المفاصل، هشاشة العظام، النقرس، والفيبروميالغيا (آلام العضلات الليفية)."
      },
      {
        name: "التغذية العلاجية والعلاج الطبيعي",
        icon: "heartbeat",
        description: "برامج غذائية شخصية وتأهيل حركي",
        details: "نقدم برامج غذائية علاجية شخصية للسمنة، النحافة، أمراض السكري، ضغط الدم، والكوليسترول، بالإضافة لخدمات العلاج الطبيعي وإعادة التأهيل بعد الإصابات."
      },
      {
        name: "طب وجراحة الأسنان",
        icon: "tooth",
        description: "رعاية شاملة للأسنان واللثة والتجميل",
        details: "نقدم جميع خدمات طب الأسنان، من التنظيف والحشوات إلى علاج الجذور، تركيب الأسنان، زراعة الأسنان، وتجميل الأسنان والابتسامة."
      }
    ];
    
    // Insert specialties
    const { error } = await supabase.from('specialties').insert(specialties);
    
    if (error) {
      console.error("Error seeding specialties:", error);
      return false;
    }
    
    console.log("Specialties have been seeded successfully");
    return true;
  } catch (error) {
    console.error("Error seeding specialties data:", error);
    return false;
  }
}
