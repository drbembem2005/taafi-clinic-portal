import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import HealthToolsManager from '@/components/health-tools/HealthToolsManager';
import HealthToolsSearch from '@/components/health-tools/HealthToolsSearch';
import { 
  Heart, 
  Calculator, 
  Activity, 
  Brain, 
  Baby, 
  Stethoscope,
  Scale,
  Droplets,
  Timer,
  Target,
  Eye,
  Zap,
  Users,
  Sparkles,
  TrendingUp,
  ArrowRight,
  ArrowLeft,
  Sun,
  Calendar,
  Moon,
  Dumbbell,
  Bone,
  AlertTriangle,
  Trophy,
  User,
  Syringe,
  Dna
} from 'lucide-react';

interface HealthTool {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  category: 'calculation' | 'assessment' | 'mental' | 'pregnancy' | 'guidance';
  keywords?: string[];
}

interface SearchHealthTool {
  id: string;
  title: string;
  description: string;
  category: string;
  keywords?: string[];
  icon: React.ComponentType<any>;
}

interface HealthCategory {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  toolsCount: number;
}

const healthTools: HealthTool[] = [
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
  {
    id: 'vaccination-schedule',
    title: 'حاسبة مواعيد تطعيمات الأطفال',
    description: 'جدول التطعيمات الإجبارية والاختيارية للأطفال حسب العمر في مصر',
    icon: Syringe,
    category: 'calculation',
    keywords: ['تطعيمات', 'vaccination', 'أطفال', 'مناعة', 'لقاحات']
  },
  {
    id: 'blood-type-predictor',
    title: 'حاسبة فصيلة الدم للأطفال',
    description: 'تنبؤ علمي بفصائل الدم المحتملة للطفل بناءً على فصيلة الوالدين',
    icon: Dna,
    category: 'calculation',
    keywords: ['فصيلة دم', 'blood type', 'وراثة', 'جينات', 'أطفال']
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
  }
];

const healthCategories: HealthCategory[] = [
  {
    id: 'calculation',
    name: 'الحاسبات الطبية',
    description: 'احسب مؤشراتك الصحية الأساسية مثل كتلة الجسم والسعرات الحرارية ومعدل النبض والعمر البيولوجي',
    icon: Calculator,
    color: 'from-blue-500 to-cyan-500',
    toolsCount: healthTools.filter(t => t.category === 'calculation').length
  },
  {
    id: 'assessment',
    name: 'تقييم المخاطر الصحية',
    description: 'اكتشف مخاطر الإصابة بالأمراض الشائعة مثل السكري وضغط الدم وتسوس الأسنان وهشاشة العظام',
    icon: Target,
    color: 'from-red-500 to-pink-500',
    toolsCount: healthTools.filter(t => t.category === 'assessment').length
  },
  {
    id: 'mental',
    name: 'الصحة النفسية والاسترخاء',
    description: 'تقييم حالتك النفسية وجودة النوم وتعلم تقنيات الاسترخاء والتأمل والتوازن في الحياة',
    icon: Brain,
    color: 'from-purple-500 to-indigo-500',
    toolsCount: healthTools.filter(t => t.category === 'mental').length
  },
  {
    id: 'pregnancy',
    name: 'صحة الحمل والإنجاب',
    description: 'أدوات متخصصة للحوامل لحساب موعد الولادة والتبويض ومتابعة أعراض الحمل والخصوبة',
    icon: Baby,
    color: 'from-pink-500 to-rose-500',
    toolsCount: healthTools.filter(t => t.category === 'pregnancy').length
  },
  {
    id: 'guidance',
    name: 'التوجيه الطبي',
    description: 'احصل على إرشادات طبية ذكية لاختيار التخصص المناسب وتقييم حاجتك لزيارة الطبيب',
    icon: Stethoscope,
    color: 'from-green-500 to-emerald-500',
    toolsCount: healthTools.filter(t => t.category === 'guidance').length
  }
];

const HealthTools = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [activeToolId, setActiveToolId] = useState<string | null>(null);
  const [filteredTools, setFilteredTools] = useState<SearchHealthTool[]>(
    healthTools.map(tool => ({
      id: tool.id,
      title: tool.title,
      description: tool.description,
      category: tool.category,
      keywords: tool.keywords,
      icon: tool.icon
    }))
  );

  // Check for URL parameter to auto-open tool
  React.useEffect(() => {
    console.log('🔍 HealthTools: Checking URL parameters');
    const urlParams = new URLSearchParams(window.location.search);
    const toolParam = urlParams.get('tool');
    console.log('🎯 Found tool parameter:', toolParam);
    
    if (toolParam && healthTools.find(t => t.id === toolParam)) {
      console.log('✅ Valid tool found, opening:', toolParam);
      setActiveToolId(toolParam);
    } else if (toolParam) {
      console.warn('⚠️ Invalid tool ID in URL:', toolParam);
    }
  }, []);

  const selectedCategoryData = selectedCategory 
    ? healthCategories.find(cat => cat.id === selectedCategory)
    : null;

  const toolsToDisplay = selectedCategory 
    ? filteredTools.filter(tool => tool.category === selectedCategory)
    : filteredTools;

  const handleFilteredToolsChange = (tools: SearchHealthTool[]) => {
    setFilteredTools(tools);
  };

  const openTool = (toolId: string) => {
    console.log('🚀 HealthTools: Opening tool:', toolId);
    setActiveToolId(toolId);
  };

  const closeTool = () => {
    console.log('❌ HealthTools: Closing tool');
    setActiveToolId(null);
  };

  const goBackToCategories = () => {
    setSelectedCategory(null);
  };

  // Convert healthTools to SearchHealthTool format for search component
  const searchTools: SearchHealthTool[] = React.useMemo(() => {
    const baseTools = selectedCategory 
      ? healthTools.filter(t => t.category === selectedCategory)
      : healthTools;
    
    return baseTools.map(tool => ({
      id: tool.id,
      title: tool.title,
      description: tool.description,
      category: tool.category,
      keywords: tool.keywords,
      icon: tool.icon
    }));
  }, [selectedCategory]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <section className="bg-gradient-to-l from-brand/10 via-blue-50 to-indigo-100 py-8 md:py-12 relative overflow-hidden">
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="h-6 w-6 md:h-8 md:w-8 text-brand animate-pulse" />
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                🤖 أدوات صحية ذكية بين يديك!
              </h1>
              <Sparkles className="h-6 w-6 md:h-8 md:w-8 text-brand animate-pulse" />
            </div>
            <p className="text-sm md:text-base lg:text-lg text-gray-600 leading-relaxed mb-6">
              {selectedCategory 
                ? `اختر الأداة المناسبة من فئة ${selectedCategoryData?.name}`
                : 'ابحث واستكشف الأدوات الصحية المتخصصة التي تحتاجها'
              }
            </p>
            <div className="flex flex-wrap justify-center gap-2 text-xs md:text-sm">
              <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-brand font-medium shadow-md border border-white/20">
                ✅ {healthTools.length} أداة متطورة
              </span>
              <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-brand font-medium shadow-md border border-white/20">
                🔒 آمن وسري 100%
              </span>
              <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-brand font-medium shadow-md border border-white/20">
                📱 متوافق مع الجوال
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Back Button */}
      {selectedCategory && (
        <section className="py-4 bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-20 shadow-sm">
          <div className="container mx-auto px-4">
            <Button
              variant="outline"
              onClick={goBackToCategories}
              className="rounded-full px-4 py-2 font-medium shadow-md hover:shadow-lg transition-all duration-300 border-2"
              size="sm"
            >
              <ArrowRight className="ml-2 h-4 w-4" />
              العودة للفئات
            </Button>
          </div>
        </section>
      )}

      {/* Search and Filter */}
      <section className="py-6 bg-white/50">
        <div className="container mx-auto px-4">
          <HealthToolsSearch
            tools={searchTools}
            onFilteredToolsChange={handleFilteredToolsChange}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        </div>
      </section>

      {/* Categories View */}
      {!selectedCategory && (
        <section className="py-8 md:py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {healthCategories.map((category) => {
                const IconComponent = category.icon;
                return (
                  <Card 
                    key={category.id} 
                    className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden border-0 shadow-md rounded-2xl bg-white/95 backdrop-blur-sm relative cursor-pointer"
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-brand/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <CardHeader className="pb-4 pt-6 relative z-10">
                      <div className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br ${category.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg mx-auto`}>
                        <IconComponent className="h-8 w-8 md:h-10 md:w-10 text-white" />
                      </div>
                      <CardTitle className="text-xl md:text-2xl font-bold text-gray-900 leading-tight text-center min-h-[3rem] flex items-center justify-center">
                        {category.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0 relative z-10 px-6 pb-6">
                      <p className="text-gray-600 leading-relaxed mb-6 text-center min-h-[4rem] text-sm md:text-base">
                        {category.description}
                      </p>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-brand font-bold text-lg">
                          {category.toolsCount} أداة
                        </span>
                        <ArrowLeft className="h-5 w-5 text-brand group-hover:translate-x-1 transition-transform" />
                      </div>
                      <Button 
                        className="w-full bg-gradient-to-r from-brand to-brand-light hover:from-brand-dark hover:to-brand text-white rounded-xl py-3 font-bold transition-all duration-300 group-hover:shadow-lg transform group-hover:scale-105 shadow-md"
                      >
                        <Zap className="ml-2 h-4 w-4" />
                        استكشف الأدوات
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Tools View */}
      {selectedCategory && (
        <section className="py-6 md:py-8">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {toolsToDisplay.map((tool) => {
                const IconComponent = tool.icon;
                return (
                  <Card 
                    key={tool.id} 
                    className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden border-0 shadow-md rounded-2xl bg-white/95 backdrop-blur-sm relative"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-brand/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <CardHeader className="pb-3 pt-4 relative z-10">
                      <div className={`w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-br ${selectedCategoryData?.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300 shadow-lg mx-auto`}>
                        <IconComponent className="h-6 w-6 md:h-7 md:w-7 text-white" />
                      </div>
                      <CardTitle className="text-base md:text-lg font-bold text-gray-900 leading-tight text-center min-h-[2.5rem] flex items-center justify-center px-2">
                        {tool.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0 relative z-10 px-4 pb-4">
                      <p className="text-gray-600 leading-relaxed mb-4 text-sm text-center min-h-[3rem] flex items-center justify-center">
                        {tool.description}
                      </p>
                      <Button 
                        className="w-full bg-gradient-to-r from-brand to-brand-light hover:from-brand-dark hover:to-brand text-white rounded-xl py-2.5 font-bold transition-all duration-300 group-hover:shadow-lg transform group-hover:scale-105 text-sm shadow-md"
                        onClick={() => openTool(tool.id)}
                      >
                        <Zap className="ml-2 h-4 w-4" />
                        ابدأ الآن
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-12 bg-gradient-to-r from-brand/10 via-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-xl border border-white/20">
              <h2 className="text-xl md:text-2xl font-bold mb-4 text-gray-900">
                هل تحتاج استشارة طبية متخصصة؟
              </h2>
              <p className="text-sm md:text-base text-gray-600 mb-6 leading-relaxed">
                هذه الأدوات مخصصة للتوعية الصحية والتقييم الأولي فقط ولا تغني عن الاستشارة الطبية المتخصصة
              </p>
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-brand to-brand-light hover:from-brand-dark hover:to-brand text-white px-6 md:px-8 py-3 md:py-4 rounded-xl font-bold text-base shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <Stethoscope className="ml-2 h-5 w-5" />
                احجز موعدك الآن
              </Button>
            </div>
          </div>
        </div>
      </section>

      <HealthToolsManager 
        activeToolId={activeToolId}
        onCloseTool={closeTool}
      />
    </div>
  );
};

export default HealthTools;
