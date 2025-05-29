
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
  TrendingUp
} from 'lucide-react';

interface HealthTool {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  category: 'calculation' | 'assessment' | 'mental' | 'pregnancy' | 'guidance';
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

const categoryNames = {
  calculation: 'الحاسبات الطبية',
  assessment: 'تقييم المخاطر الصحية',
  mental: 'الصحة النفسية والاسترخاء',
  pregnancy: 'صحة الحمل والإنجاب',
  guidance: 'التوجيه الطبي'
};

const categoryColors = {
  calculation: 'from-blue-500 to-cyan-500',
  assessment: 'from-red-500 to-pink-500',
  mental: 'from-purple-500 to-indigo-500',
  pregnancy: 'from-pink-500 to-rose-500',
  guidance: 'from-green-500 to-emerald-500'
};

const categoryIcons = {
  calculation: Calculator,
  assessment: Target,
  mental: Brain,
  pregnancy: Baby,
  guidance: Stethoscope
};

const HealthTools = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [activeToolId, setActiveToolId] = useState<string | null>(null);

  const filteredTools = selectedCategory 
    ? healthTools.filter(tool => tool.category === selectedCategory)
    : healthTools;

  const categories = Object.keys(categoryNames) as Array<keyof typeof categoryNames>;

  const openTool = (toolId: string) => {
    setActiveToolId(toolId);
  };

  const closeTool = () => {
    setActiveToolId(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <section className="bg-gradient-to-l from-brand/10 via-blue-50 to-indigo-100 py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%231373b4\" fill-opacity=\"0.05\"%3E%3Ccircle cx=\"30\" cy=\"30\" r=\"2\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Sparkles className="h-8 w-8 md:h-12 md:w-12 text-brand animate-pulse" />
              <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                مساعد تعافي الذكية
              </h1>
              <Sparkles className="h-8 w-8 md:h-12 md:w-12 text-brand animate-pulse" />
            </div>
            <p className="text-xl md:text-2xl lg:text-3xl text-brand mb-8 font-bold">
              🤖 أدوات صحية تفاعلية بين يديك!
            </p>
            <p className="text-base md:text-lg lg:text-xl text-gray-600 leading-relaxed max-w-4xl mx-auto mb-8">
              استكشف مجموعة شاملة من الأدوات الصحية التفاعلية المدعومة بالذكاء الاصطناعي. 
              احسب مؤشراتك الصحية، قيّم مخاطرك الطبية، واحصل على توجيهات صحية مخصصة - 
              كل ذلك بشكل آمن وسري ومجاني تماماً.
            </p>
            <div className="flex flex-wrap justify-center gap-3 md:gap-4 text-sm md:text-base">
              <span className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full text-brand font-medium shadow-lg border border-white/20">
                ✅ 19 أداة صحية متطورة
              </span>
              <span className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full text-brand font-medium shadow-lg border border-white/20">
                🔒 آمن وسري 100%
              </span>
              <span className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full text-brand font-medium shadow-lg border border-white/20">
                📱 متوافق مع الجوال
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-20 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-2 md:gap-3">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              onClick={() => setSelectedCategory(null)}
              className="rounded-full px-4 md:px-6 py-2 md:py-3 font-medium shadow-md hover:shadow-lg transition-all duration-300 border-2"
              size="sm"
            >
              <Calculator className="ml-2 h-3 w-3 md:h-4 md:w-4" />
              <span className="text-xs md:text-sm">جميع الأدوات ({healthTools.length})</span>
            </Button>
            {categories.map((category) => {
              const IconComponent = categoryIcons[category];
              return (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category)}
                  className="rounded-full px-4 md:px-6 py-2 md:py-3 font-medium shadow-md hover:shadow-lg transition-all duration-300 border-2"
                  size="sm"
                >
                  <IconComponent className="ml-2 h-3 w-3 md:h-4 md:w-4" />
                  <span className="text-xs md:text-sm">{categoryNames[category]} ({healthTools.filter(t => t.category === category).length})</span>
                </Button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {filteredTools.map((tool) => {
              const IconComponent = tool.icon;
              return (
                <Card 
                  key={tool.id} 
                  className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden border-0 shadow-xl rounded-3xl bg-white/95 backdrop-blur-sm relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-brand/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <CardHeader className="pb-4 relative z-10">
                    <div className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl md:rounded-3xl bg-gradient-to-br ${categoryColors[tool.category]} flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition-transform duration-500 shadow-lg mx-auto`}>
                      <IconComponent className="h-8 w-8 md:h-10 md:w-10 text-white" />
                    </div>
                    <CardTitle className="text-lg md:text-xl xl:text-2xl font-bold text-gray-900 leading-tight mb-3 text-center min-h-[3rem] md:min-h-[4rem] flex items-center justify-center px-2">
                      {tool.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0 relative z-10 px-4 md:px-6">
                    <p className="text-gray-600 leading-relaxed mb-6 md:mb-8 text-sm md:text-base text-center min-h-[4rem] md:min-h-[5rem] flex items-center justify-center">
                      {tool.description}
                    </p>
                    <Button 
                      className="w-full bg-gradient-to-r from-brand to-brand-light hover:from-brand-dark hover:to-brand text-white rounded-xl md:rounded-2xl py-3 md:py-4 font-bold transition-all duration-500 group-hover:shadow-xl transform group-hover:scale-105 text-base md:text-lg shadow-lg"
                      onClick={() => openTool(tool.id)}
                    >
                      <Zap className="ml-2 h-4 w-4 md:h-5 md:w-5" />
                      ابدأ الآن
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-r from-brand/10 via-blue-50 to-indigo-100 relative">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\"100\" height=\"100\" viewBox=\"0 0 100 100\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%231373b4\" fill-opacity=\"0.03\"%3E%3Cpath d=\"M50 50l25-25v50l-25-25z\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-2xl border border-white/20">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6 text-gray-900">
                هل تحتاج استشارة طبية متخصصة؟
              </h2>
              <p className="text-base md:text-lg lg:text-xl text-gray-600 mb-8 leading-relaxed">
                هذه الأدوات مخصصة للتوعية الصحية والتقييم الأولي فقط ولا تغني عن الاستشارة الطبية المتخصصة. 
                إذا كانت نتائجك تشير لضرورة المتابعة، لا تتردد في حجز موعد مع أطبائنا المتخصصين.
              </p>
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-brand to-brand-light hover:from-brand-dark hover:to-brand text-white px-8 md:px-12 py-4 md:py-5 rounded-2xl font-bold text-lg md:text-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              >
                <Stethoscope className="ml-3 h-5 w-5 md:h-6 md:w-6" />
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
