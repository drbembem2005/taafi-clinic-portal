import { 
  Calculator, 
  Target, 
  Brain, 
  Baby, 
  Stethoscope,
  Scale,
  Droplets,
  Timer,
  Heart,
  Activity,
  Zap,
  Users,
  Calendar,
  Sun,
  Dumbbell,
  Bone,
  AlertTriangle,
  Trophy,
  User,
  Eye,
  TrendingUp,
  Moon,
  Camera
} from 'lucide-react';

export interface HealthToolData {
  id: string;
  title: string;
  description: string;
  icon: any;
  category: 'calculation' | 'assessment' | 'mental' | 'pregnancy' | 'guidance' | 'nutrition';
  keywords?: string[];
}

export const healthToolsData: HealthToolData[] = [
  // Medical Calculators
  {
    id: 'bmi-calculator',
    title: 'حاسبة كتلة الجسم (BMI)',
    description: 'احسب مؤشر كتلة الجسم وتعرف على وزنك الصحي مع توصيات مخصصة',
    icon: Scale,
    category: 'calculation',
    keywords: ['وزن', 'كتلة', 'سمنة', 'نحافة', 'bmi']
  },
  {
    id: 'calories-calculator',
    title: 'حاسبة السعرات اليومية',
    description: 'احسب احتياجك اليومي من السعرات الحرارية بناءً على نشاطك ومعدل الأيض',
    icon: Calculator,
    category: 'calculation',
    keywords: ['سعرات', 'calories', 'طعام', 'حرق', 'ريجيم']
  },
  {
    id: 'water-calculator',
    title: 'حاسبة نسبة الماء اليومية',
    description: 'اعرف كمية الماء المناسبة لجسمك يومياً مع جدول شرب مخصص',
    icon: Droplets,
    category: 'calculation',
    keywords: ['ماء', 'water', 'سوائل', 'ترطيب']
  },
  {
    id: 'heart-rate-calculator',
    title: 'حاسبة معدل النبض الطبيعي حسب العمر',
    description: 'تحقق من معدل نبضك الطبيعي واكتشف المناطق المستهدفة للتمرين',
    icon: Heart,
    category: 'calculation',
    keywords: ['نبض', 'قلب', 'heart', 'pulse', 'تمرين']
  },
  {
    id: 'waist-calculator',
    title: 'حاسبة محيط الخصر الصحي',
    description: 'تأكد من أن محيط خصرك ضمن المعدل الصحي وتقييم المخاطر',
    icon: Target,
    category: 'calculation',
    keywords: ['خصر', 'محيط', 'waist', 'بطن']
  },
  {
    id: 'steps-calories',
    title: 'حاسبة خطوات المشي إلى سعرات حرارية',
    description: 'احسب السعرات المحروقة من خطوات المشي مع تتبع التقدم',
    icon: Activity,
    category: 'calculation',
    keywords: ['مشي', 'خطوات', 'steps', 'walking', 'رياضة']
  },
  {
    id: 'biological-age',
    title: 'حاسبة العمر البيولوجي',
    description: 'اكتشف عمرك الحقيقي بناءً على نمط حياتك وعاداتك الصحية',
    icon: Calendar,
    category: 'calculation',
    keywords: ['عمر', 'age', 'biological', 'صحة']
  },
  {
    id: 'male-fertility',
    title: 'حاسبة مؤشر الخصوبة للرجال',
    description: 'تقييم عوامل نمط الحياة المؤثرة على صحة الحيوانات المنوية',
    icon: Users,
    category: 'calculation',
    keywords: ['خصوبة', 'fertility', 'رجال', 'انجاب']
  },
  {
    id: 'metabolism-calculator',
    title: 'حاسبة الأيض والحرق',
    description: 'احسب معدل الأيض الأساسي وسرعة حرق السعرات الحرارية',
    icon: Zap,
    category: 'calculation',
    keywords: ['أيض', 'metabolism', 'حرق', 'طاقة']
  },
  {
    id: 'vitamin-d-calculator',
    title: 'حاسبة فيتامين د المطلوب',
    description: 'احسب احتياجك من فيتامين د بناءً على التعرض للشمس ونمط الحياة',
    icon: Sun,
    category: 'calculation',
    keywords: ['فيتامين', 'vitamin', 'شمس', 'sun']
  },
  {
    id: 'muscle-mass-calculator',
    title: 'حاسبة مؤشر الكتلة العضلية',
    description: 'احسب كتلتك العضلية ونسبة العضلات إلى الدهون في الجسم',
    icon: Dumbbell,
    category: 'calculation',
    keywords: ['عضلات', 'muscle', 'كتلة', 'قوة']
  },

  // Health Risk Assessments
  {
    id: 'diabetes-risk',
    title: 'اختبار خطر السكري من النوع الثاني',
    description: 'تقييم شامل لمخاطر الإصابة بمرض السكري مع خطة وقائية',
    icon: Target,
    category: 'assessment',
    keywords: ['سكري', 'سكر', 'diabetes', 'غلوكوز']
  },
  {
    id: 'blood-pressure-risk',
    title: 'اختبار خطر ارتفاع ضغط الدم',
    description: 'تقييم مخاطر ارتفاع ضغط الدم مع نصائح للوقاية والعلاج',
    icon: Heart,
    category: 'assessment',
    keywords: ['ضغط', 'blood pressure', 'قلب']
  },
  {
    id: 'healthy-habits',
    title: 'اختبار عاداتك الصحية',
    description: 'قيّم نمط حياتك الشامل واكتشف نقاط التحسين مع خطة عملية',
    icon: TrendingUp,
    category: 'assessment',
    keywords: ['عادات', 'habits', 'نمط حياة', 'صحة']
  },
  {
    id: 'dental-decay-risk',
    title: 'اختبار خطر تسوس الأسنان',
    description: 'تقييم مخاطر تسوس أسنانك بناءً على عاداتك اليومية ونصائح الوقاية',
    icon: Eye,
    category: 'assessment',
    keywords: ['أسنان', 'dental', 'تسوس', 'فم']
  },
  {
    id: 'osteoporosis-risk',
    title: 'تقييم خطر هشاشة العظام',
    description: 'تقييم مخاطر الإصابة بهشاشة العظام وكسور المستقبل',
    icon: Bone,
    category: 'assessment',
    keywords: ['عظام', 'osteoporosis', 'هشاشة', 'كسور']
  },
  {
    id: 'eye-health-assessment',
    title: 'تقييم صحة العين والرؤية',
    description: 'تقييم أولي لصحة عينيك ومخاطر مشاكل الرؤية',
    icon: Eye,
    category: 'assessment',
    keywords: ['عيون', 'eye', 'رؤية', 'نظر']
  },
  {
    id: 'heart-disease-risk',
    title: 'تقييم خطر أمراض القلب',
    description: 'تقييم مخاطر الإصابة بأمراض القلب والشرايين',
    icon: Heart,
    category: 'assessment',
    keywords: ['قلب', 'heart', 'شرايين', 'كولسترول']
  },
  {
    id: 'insulin-resistance-test',
    title: 'تقييم مقاومة الأنسولين',
    description: 'تقييم مخاطر الإصابة بمقاومة الأنسولين والسكري المبكر',
    icon: Activity,
    category: 'assessment',
    keywords: ['أنسولين', 'insulin', 'مقاومة', 'سكري']
  },

  // Mental Health & Relaxation
  {
    id: 'anxiety-test',
    title: 'اختبار القلق (مبسط)',
    description: 'تقييم علمي لمستوى القلق والتوتر مع استراتيجيات التأقلم',
    icon: Brain,
    category: 'mental',
    keywords: ['قلق', 'anxiety', 'خوف', 'توتر']
  },
  {
    id: 'depression-test',
    title: 'اختبار الاكتئاب (مبسط)',
    description: 'تقييم أولي مبني على المعايير الطبية لأعراض الاكتئاب',
    icon: Brain,
    category: 'mental',
    keywords: ['اكتئاب', 'depression', 'حزن', 'مزاج']
  },
  {
    id: 'breathing-timer',
    title: 'مؤقت تمارين التنفس العميق',
    description: 'تمارين تنفس مرشدة للاسترخاء وتقليل التوتر مع أنماط متنوعة',
    icon: Timer,
    category: 'mental',
    keywords: ['تنفس', 'breathing', 'استرخاء', 'هدوء']
  },
  {
    id: 'sleep-quality',
    title: 'تقييم جودة النوم',
    description: 'تحليل شامل لجودة نومك ونصائح للتحسين والراحة',
    icon: Moon,
    category: 'mental',
    keywords: ['نوم', 'sleep', 'أرق', 'راحة']
  },
  {
    id: 'emotional-intelligence-test',
    title: 'اختبار الذكاء العاطفي',
    description: 'تقييم مهاراتك في فهم وإدارة المشاعر والتفاعل الاجتماعي',
    icon: Brain,
    category: 'mental',
    keywords: ['ذكاء عاطفي', 'emotions', 'مشاعر', 'تفاعل']
  },
  {
    id: 'stress-test',
    title: 'اختبار الضغط النفسي والتوتر',
    description: 'تقييم مستوى التوتر اليومي مع استراتيجيات التعامل المتقدمة',
    icon: AlertTriangle,
    category: 'mental',
    keywords: ['توتر', 'ضغط', 'stress', 'نفسي']
  },
  {
    id: 'meditation-timer',
    title: 'مؤقت التأمل المرشد',
    description: 'جلسات تأمل بأوقات مختلفة مع إرشادات وتقنيات متنوعة',
    icon: Timer,
    category: 'mental',
    keywords: ['تأمل', 'meditation', 'استرخاء', 'هدوء']
  },
  {
    id: 'confidence-test',
    title: 'اختبار الثقة بالنفس',
    description: 'تقييم مستوى ثقتك بنفسك مع خطة شخصية للتطوير',
    icon: Trophy,
    category: 'mental',
    keywords: ['ثقة', 'confidence', 'شخصية', 'تطوير']
  },
  {
    id: 'work-life-balance',
    title: 'حاسبة التوازن بين العمل والحياة',
    description: 'تقييم التوازن في حياتك المهنية والشخصية مع خطة للتحسين',
    icon: Scale,
    category: 'mental',
    keywords: ['توازن', 'work life', 'عمل', 'حياة']
  },
  {
    id: 'personality-test',
    title: 'اختبار أنماط الشخصية',
    description: 'اكتشف نمط شخصيتك وفهم طريقة تفكيرك وتفاعلك مع العالم',
    icon: User,
    category: 'mental',
    keywords: ['شخصية', 'personality', 'نمط', 'تفكير']
  },

  // Pregnancy & Reproductive Health
  {
    id: 'pregnancy-calculator',
    title: 'حاسبة الحمل / موعد الولادة',
    description: 'احسبي موعد الولادة المتوقع مع متابعة مراحل الحمل والنصائح',
    icon: Baby,
    category: 'pregnancy',
    keywords: ['حمل', 'ولادة', 'حامل', 'pregnancy']
  },
  {
    id: 'ovulation-calculator',
    title: 'حاسبة التبويض',
    description: 'احسبي أيام التبويض والخصوبة مع نصائح لزيادة فرص الحمل',
    icon: Baby,
    category: 'pregnancy',
    keywords: ['تبويض', 'ovulation', 'خصوبة', 'دورة']
  },
  {
    id: 'pregnancy-symptoms',
    title: 'هل أعراضك طبيعية أثناء الحمل؟',
    description: 'تحققي من طبيعية أعراض الحمل وتحديد ما يحتاج متابعة طبية',
    icon: Baby,
    category: 'pregnancy',
    keywords: ['أعراض حمل', 'symptoms', 'حامل', 'pregnancy']
  },

  // Medical Guidance
  {
    id: 'dental-visit-needed',
    title: 'هل تحتاج لزيارة طبيب الأسنان؟',
    description: 'اكتشف إذا كانت أعراضك تستدعي زيارة فورية للطبيب مع إرشادات الإسعاف',
    icon: Stethoscope,
    category: 'guidance',
    keywords: ['أسنان', 'dental', 'طبيب', 'زيارة']
  },
  {
    id: 'medical-specialty-guide',
    title: 'هل تحتاج زيارة طبيب باطنة أم تخصص آخر؟',
    description: 'مرشد ذكي لاختيار التخصص الطبي المناسب لحالتك',
    icon: Users,
    category: 'guidance',
    keywords: ['تخصص', 'specialty', 'طبيب', 'باطنة']
  },
  {
    id: 'specialty-finder',
    title: 'ما التخصص المناسب لحالتك؟',
    description: 'خوارزمية ذكية لربط أعراضك بالتخصص الطبي الأنسب',
    icon: Stethoscope,
    category: 'guidance',
    keywords: ['تخصص', 'specialty', 'أعراض', 'طبيب']
  },

  // Add new food analyzer tool
  {
    id: 'food-analyzer',
    title: 'محلل الطعام الذكي',
    description: 'حلل صور طعامك للحصول على تقرير غذائي مفصل بالذكاء الاصطناعي',
    category: 'nutrition',
    icon: Camera,
    keywords: ['طعام', 'تحليل', 'غذاء', 'سعرات', 'بروتين', 'كربوهيدرات', 'فيتامين', 'تصوير', 'ذكي']
  }
];

export const healthCategories = [
  {
    id: 'calculation',
    name: 'الحاسبات الطبية',
    description: 'احسب مؤشراتك الصحية الأساسية مثل كتلة الجسم والسعرات الحرارية ومعدل النبض والعمر البيولوجي',
    icon: Calculator,
    color: 'from-blue-500 to-cyan-500',
    toolsCount: healthToolsData.filter(t => t.category === 'calculation').length
  },
  {
    id: 'assessment',
    name: 'تقييم المخاطر الصحية',
    description: 'اكتشف مخاطر الإصابة بالأمراض الشائعة مثل السكري وضغط الدم وتسوس الأسنان وهشاشة العظام',
    icon: Target,
    color: 'from-red-500 to-pink-500',
    toolsCount: healthToolsData.filter(t => t.category === 'assessment').length
  },
  {
    id: 'mental',
    name: 'الصحة النفسية والاسترخاء',
    description: 'تقييم حالتك النفسية وجودة النوم وتعلم تقنيات الاسترخاء والتأمل والتوازن في الحياة',
    icon: Brain,
    color: 'from-purple-500 to-indigo-500',
    toolsCount: healthToolsData.filter(t => t.category === 'mental').length
  },
  {
    id: 'pregnancy',
    name: 'صحة الحمل والإنجاب',
    description: 'أدوات متخصصة للحوامل لحساب موعد الولادة والتبويض ومتابعة أعراض الحمل والخصوبة',
    icon: Baby,
    color: 'from-pink-500 to-rose-500',
    toolsCount: healthToolsData.filter(t => t.category === 'pregnancy').length
  },
  {
    id: 'guidance',
    name: 'التوجيه الطبي',
    description: 'احصل على إرشادات طبية ذكية لاختيار التخصص المناسب وتقييم حاجتك لزيارة الطبيب',
    icon: Stethoscope,
    color: 'from-green-500 to-emerald-500',
    toolsCount: healthToolsData.filter(t => t.category === 'guidance').length
  },
  {
    id: 'nutrition',
    name: 'الصحة الغذائية',
    description: 'أدوات لتحليل وتحليل الأطعمة وتحديد الأغذية الصحية',
    icon: Camera,
    color: 'from-yellow-500 to-lime-500',
    toolsCount: healthToolsData.filter(t => t.category === 'nutrition').length
  }
];
