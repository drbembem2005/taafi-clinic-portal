
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
  Users
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
    id: 'dental-decay-risk',
    title: 'اختبار خطر تسوس الأسنان',
    description: 'تقييم مخاطر تسوس أسنانك بناءً على عاداتك اليومية',
    icon: Eye,
    category: 'assessment'
  },
  {
    id: 'dental-visit-needed',
    title: 'هل تحتاج لزيارة طبيب الأسنان؟',
    description: 'اكتشف إذا كانت أعراضك تستدعي زيارة فورية للطبيب',
    icon: Stethoscope,
    category: 'guidance'
  },
  {
    id: 'bmi-calculator',
    title: 'حاسبة كتلة الجسم (BMI)',
    description: 'احسب مؤشر كتلة الجسم وتعرف على وزنك الصحي',
    icon: Scale,
    category: 'calculation'
  },
  {
    id: 'calories-calculator',
    title: 'حاسبة السعرات اليومية',
    description: 'احسب احتياجك اليومي من السعرات الحرارية',
    icon: Calculator,
    category: 'calculation'
  },
  {
    id: 'water-calculator',
    title: 'حاسبة نسبة الماء اليومية',
    description: 'اعرف كمية الماء المناسبة لجسمك يومياً',
    icon: Droplets,
    category: 'calculation'
  },
  {
    id: 'healthy-habits',
    title: 'اختبار عاداتك الصحية',
    description: 'قيّم نمط حياتك واكتشف نقاط التحسين',
    icon: Activity,
    category: 'assessment'
  },
  {
    id: 'diabetes-risk',
    title: 'اختبار خطر السكري من النوع الثاني',
    description: 'تقييم مخاطر الإصابة بمرض السكري',
    icon: Target,
    category: 'assessment'
  },
  {
    id: 'blood-pressure-risk',
    title: 'اختبار خطر ارتفاع ضغط الدم',
    description: 'تقييم مخاطر ارتفاع ضغط الدم لديك',
    icon: Heart,
    category: 'assessment'
  },
  {
    id: 'heart-rate-calculator',
    title: 'حاسبة معدل النبض الطبيعي حسب العمر',
    description: 'تحقق من معدل نبضك الطبيعي حسب عمرك',
    icon: Activity,
    category: 'calculation'
  },
  {
    id: 'waist-calculator',
    title: 'حاسبة محيط الخصر الصحي',
    description: 'تأكد من أن محيط خصرك ضمن المعدل الصحي',
    icon: Scale,
    category: 'calculation'
  },
  {
    id: 'pregnancy-calculator',
    title: 'حاسبة الحمل / موعد الولادة',
    description: 'احسبي موعد الولادة المتوقع',
    icon: Baby,
    category: 'pregnancy'
  },
  {
    id: 'ovulation-calculator',
    title: 'حاسبة التبويض',
    description: 'احسبي أيام التبويض والخصوبة',
    icon: Baby,
    category: 'pregnancy'
  },
  {
    id: 'pregnancy-symptoms',
    title: 'هل أعراضك طبيعية أثناء الحمل؟',
    description: 'تحققي من طبيعية أعراض الحمل التي تمرين بها',
    icon: Baby,
    category: 'pregnancy'
  },
  {
    id: 'anxiety-test',
    title: 'اختبار القلق (مبسط)',
    description: 'تقييم مستوى القلق والتوتر لديك',
    icon: Brain,
    category: 'mental'
  },
  {
    id: 'depression-test',
    title: 'اختبار الاكتئاب (مبسط)',
    description: 'تقييم أولي لأعراض الاكتئاب',
    icon: Brain,
    category: 'mental'
  },
  {
    id: 'breathing-timer',
    title: 'مؤقت تمارين التنفس العميق',
    description: 'مارس تمارين التنفس للاسترخاء وتقليل التوتر',
    icon: Timer,
    category: 'mental'
  },
  {
    id: 'steps-calories',
    title: 'حاسبة خطوات المشي إلى سعرات حرارية',
    description: 'احسب السعرات المحروقة من خطوات المشي',
    icon: Activity,
    category: 'calculation'
  },
  {
    id: 'medical-specialty-guide',
    title: 'هل تحتاج زيارة طبيب باطنة أم تخصص آخر؟',
    description: 'اكتشف التخصص الطبي المناسب لحالتك',
    icon: Users,
    category: 'guidance'
  },
  {
    id: 'specialty-finder',
    title: 'ما التخصص المناسب لحالتك؟',
    description: 'ابحث عن التخصص الطبي الأنسب بناءً على أعراضك',
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

const HealthTools = () => {
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);

  const filteredTools = selectedCategory 
    ? healthTools.filter(tool => tool.category === selectedCategory)
    : healthTools;

  const categories = Object.keys(categoryNames) as Array<keyof typeof categoryNames>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-l from-brand/10 via-blue-50 to-indigo-100 py-12 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-5xl font-bold mb-6 text-gray-900 leading-tight">
              🤖 مساعد تعافي الذكية
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 mb-8 font-medium">
              أدوات صحية تفاعلية بين يديك!
            </p>
            <p className="text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto">
              استكشف مجموعة شاملة من الأدوات الصحية التفاعلية التي تساعدك في تقييم حالتك الصحية، 
              حساب مؤشراتك الطبية، والحصول على توجيهات صحية مفيدة - كل ذلك بشكل آمن وسري.
            </p>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 bg-white border-b border-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              onClick={() => setSelectedCategory(null)}
              className="rounded-full px-6 py-3"
            >
              جميع الأدوات ({healthTools.length})
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className="rounded-full px-6 py-3"
              >
                {categoryNames[category]} ({healthTools.filter(t => t.category === category).length})
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {filteredTools.map((tool) => {
              const IconComponent = tool.icon;
              return (
                <Card 
                  key={tool.id} 
                  className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden border-0 shadow-lg rounded-2xl bg-white"
                >
                  <CardHeader className="pb-4">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${categoryColors[tool.category]} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-xl font-bold text-gray-900 leading-tight">
                      {tool.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-gray-600 leading-relaxed mb-6">
                      {tool.description}
                    </p>
                    <Button 
                      className="w-full bg-brand hover:bg-brand-dark text-white rounded-xl py-3 font-medium transition-all duration-300 group-hover:shadow-lg"
                      onClick={() => {
                        // TODO: Open tool modal or navigate to tool page
                        console.log(`Opening tool: ${tool.id}`);
                      }}
                    >
                      ابدأ الآن
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-l from-brand/10 via-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900">
              هل تحتاج استشارة طبية متخصصة؟
            </h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              هذه الأدوات مخصصة للتوعية الصحية فقط ولا تغني عن الاستشارة الطبية المتخصصة
            </p>
            <Button 
              size="lg" 
              className="bg-brand hover:bg-brand-dark text-white px-8 py-4 rounded-xl font-medium text-lg"
            >
              احجز موعدك الآن
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HealthTools;
