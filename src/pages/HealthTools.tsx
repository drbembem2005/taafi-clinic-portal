import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import HealthToolsManager from '@/components/health-tools/HealthToolsManager';
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
  ArrowLeft
} from 'lucide-react';

interface HealthTool {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  category: 'calculation' | 'assessment' | 'mental' | 'pregnancy' | 'guidance';
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
  {
    id: 'bmi-calculator',
    title: 'حاسبة كتلة الجسم (BMI)',
    description: 'احسب مؤشر كتلة الجسم وتعرف على وزنك الصحي مع توصيات مخصصة',
    icon: Scale,
    category: 'calculation'
  },
  {
    id: 'calories-calculator',
    title: 'حاسبة السعرات اليومية',
    description: 'احسب احتياجك اليومي من السعرات الحرارية بناءً على نشاطك ومعدل الأيض',
    icon: Calculator,
    category: 'calculation'
  },
  {
    id: 'water-calculator',
    title: 'حاسبة نسبة الماء اليومية',
    description: 'اعرف كمية الماء المناسبة لجسمك يومياً مع جدول شرب مخصص',
    icon: Droplets,
    category: 'calculation'
  },
  {
    id: 'heart-rate-calculator',
    title: 'حاسبة معدل النبض الطبيعي حسب العمر',
    description: 'تحقق من معدل نبضك الطبيعي واكتشف المناطق المستهدفة للتمرين',
    icon: Heart,
    category: 'calculation'
  },
  {
    id: 'waist-calculator',
    title: 'حاسبة محيط الخصر الصحي',
    description: 'تأكد من أن محيط خصرك ضمن المعدل الصحي وتقييم المخاطر',
    icon: Target,
    category: 'calculation'
  },
  {
    id: 'steps-calories',
    title: 'حاسبة خطوات المشي إلى سعرات حرارية',
    description: 'احسب السعرات المحروقة من خطوات المشي مع تتبع التقدم',
    icon: Activity,
    category: 'calculation'
  },
  {
    id: 'diabetes-risk',
    title: 'اختبار خطر السكري من النوع الثاني',
    description: 'تقييم شامل لمخاطر الإصابة بمرض السكري مع خطة وقائية',
    icon: Target,
    category: 'assessment'
  },
  {
    id: 'blood-pressure-risk',
    title: 'اختبار خطر ارتفاع ضغط الدم',
    description: 'تقييم مخاطر ارتفاع ضغط الدم مع نصائح للوقاية والعلاج',
    icon: Heart,
    category: 'assessment'
  },
  {
    id: 'healthy-habits',
    title: 'اختبار عاداتك الصحية',
    description: 'قيّم نمط حياتك الشامل واكتشف نقاط التحسين مع خطة عملية',
    icon: TrendingUp,
    category: 'assessment'
  },
  {
    id: 'dental-decay-risk',
    title: 'اختبار خطر تسوس الأسنان',
    description: 'تقييم مخاطر تسوس أسنانك بناءً على عاداتك اليومية ونصائح الوقاية',
    icon: Eye,
    category: 'assessment'
  },
  {
    id: 'dental-visit-needed',
    title: 'هل تحتاج لزيارة طبيب الأسنان؟',
    description: 'اكتشف إذا كانت أعراضك تستدعي زيارة فورية للطبيب مع إرشادات الإسعاف',
    icon: Stethoscope,
    category: 'guidance'
  },
  {
    id: 'anxiety-test',
    title: 'اختبار القلق (مبسط)',
    description: 'تقييم علمي لمستوى القلق والتوتر مع استراتيجيات التأقلم',
    icon: Brain,
    category: 'mental'
  },
  {
    id: 'depression-test',
    title: 'اختبار الاكتئاب (مبسط)',
    description: 'تقييم أولي مبني على المعايير الطبية لأعراض الاكتئاب',
    icon: Brain,
    category: 'mental'
  },
  {
    id: 'breathing-timer',
    title: 'مؤقت تمارين التنفس العميق',
    description: 'تمارين تنفس مرشدة للاسترخاء وتقليل التوتر مع أنماط متنوعة',
    icon: Timer,
    category: 'mental'
  },
  {
    id: 'pregnancy-calculator',
    title: 'حاسبة الحمل / موعد الولادة',
    description: 'احسبي موعد الولادة المتوقع مع متابعة مراحل الحمل والنصائح',
    icon: Baby,
    category: 'pregnancy'
  },
  {
    id: 'ovulation-calculator',
    title: 'حاسبة التبويض',
    description: 'احسبي أيام التبويض والخصوبة مع نصائح لزيادة فرص الحمل',
    icon: Baby,
    category: 'pregnancy'
  },
  {
    id: 'pregnancy-symptoms',
    title: 'هل أعراضك طبيعية أثناء الحمل؟',
    description: 'تحققي من طبيعية أعراض الحمل وتحديد ما يحتاج متابعة طبية',
    icon: Baby,
    category: 'pregnancy'
  },
  {
    id: 'medical-specialty-guide',
    title: 'هل تحتاج زيارة طبيب باطنة أم تخصص آخر؟',
    description: 'مرشد ذكي لاختيار التخصص الطبي المناسب لحالتك',
    icon: Users,
    category: 'guidance'
  },
  {
    id: 'specialty-finder',
    title: 'ما التخصص المناسب لحالتك؟',
    description: 'خوارزمية ذكية لربط أعراضك بالتخصص الطبي الأنسب',
    icon: Stethoscope,
    category: 'guidance'
  }
];

const healthCategories: HealthCategory[] = [
  {
    id: 'calculation',
    name: 'الحاسبات الطبية',
    description: 'احسب مؤشراتك الصحية الأساسية مثل كتلة الجسم والسعرات الحرارية ومعدل النبض',
    icon: Calculator,
    color: 'from-blue-500 to-cyan-500',
    toolsCount: healthTools.filter(t => t.category === 'calculation').length
  },
  {
    id: 'assessment',
    name: 'تقييم المخاطر الصحية',
    description: 'اكتشف مخاطر الإصابة بالأمراض الشائعة مثل السكري وضغط الدم وتسوس الأسنان',
    icon: Target,
    color: 'from-red-500 to-pink-500',
    toolsCount: healthTools.filter(t => t.category === 'assessment').length
  },
  {
    id: 'mental',
    name: 'الصحة النفسية والاسترخاء',
    description: 'تقييم حالتك النفسية وتعلم تقنيات الاسترخاء والتنفس العميق لتحسين صحتك النفسية',
    icon: Brain,
    color: 'from-purple-500 to-indigo-500',
    toolsCount: healthTools.filter(t => t.category === 'mental').length
  },
  {
    id: 'pregnancy',
    name: 'صحة الحمل والإنجاب',
    description: 'أدوات متخصصة للحوامل لحساب موعد الولادة والتبويض ومتابعة أعراض الحمل',
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

  const selectedCategoryData = selectedCategory 
    ? healthCategories.find(cat => cat.id === selectedCategory)
    : null;

  const filteredTools = selectedCategory 
    ? healthTools.filter(tool => tool.category === selectedCategory)
    : [];

  const openTool = (toolId: string) => {
    setActiveToolId(toolId);
  };

  const closeTool = () => {
    setActiveToolId(null);
  };

  const goBackToCategories = () => {
    setSelectedCategory(null);
  };

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
                : 'اختر الفئة التي تحتاجها من الأدوات الصحية المتخصصة'
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
              {filteredTools.map((tool) => {
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
