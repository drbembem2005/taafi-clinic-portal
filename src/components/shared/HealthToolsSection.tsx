import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Heart, 
  Calculator, 
  Activity, 
  Brain, 
  Baby, 
  Scale,
  ArrowLeft,
  Calendar,
  Zap,
  Sun
} from 'lucide-react';
import { trackUserInteraction } from '@/utils/analytics';

const featuredTools = [
  {
    id: 'bmi-calculator',
    title: 'حاسبة كتلة الجسم',
    description: 'احسب مؤشر كتلة الجسم وتعرف على وزنك الصحي',
    icon: Scale,
    gradient: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'biological-age',
    title: 'حاسبة العمر البيولوجي',
    description: 'اكتشف عمرك الحقيقي بناءً على نمط حياتك',
    icon: Calendar,
    gradient: 'from-purple-500 to-indigo-500'
  },
  {
    id: 'metabolism-calculator',
    title: 'حاسبة الأيض والحرق',
    description: 'احسب معدل الأيض وسرعة حرق السعرات',
    icon: Zap,
    gradient: 'from-orange-500 to-red-500'
  },
  {
    id: 'diabetes-risk',
    title: 'اختبار خطر السكري',
    description: 'تقييم مخاطر الإصابة بمرض السكري من النوع الثاني',
    icon: Heart,
    gradient: 'from-red-500 to-pink-500'
  },
  {
    id: 'vitamin-d-calculator',
    title: 'حاسبة فيتامين د',
    description: 'احسب احتياجك من فيتامين د حسب تعرضك للشمس',
    icon: Sun,
    gradient: 'from-yellow-500 to-orange-500'
  },
  {
    id: 'pregnancy-calculator',
    title: 'حاسبة الحمل والولادة',
    description: 'احسبي موعد الولادة المتوقع بدقة',
    icon: Baby,
    gradient: 'from-pink-500 to-rose-500'
  }
];

const HealthToolsSection = () => {
  const handleToolClick = (toolId: string, toolName: string) => {
    // Track health tool button clicks from homepage
    trackUserInteraction.click(
      'Health Tool Button',
      'homepage',
      toolId,
      `homepage-featured-${toolName}`
    );
    
    // TODO: Open specific tool
    console.log(`Opening tool: ${toolId}`);
  };

  const handleViewAllToolsClick = () => {
    // Track "View All Tools" button click
    trackUserInteraction.ctaClick(
      'View All Health Tools',
      'homepage-health-tools-section'
    );
  };

  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
            🤖 مساعد تعافي الذكية
          </h2>
          <p className="text-xl md:text-2xl text-brand font-medium mb-4">
            أدوات صحية تفاعلية بين يديك!
          </p>
          <p className="text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto">
            استكشف مجموعة من الأدوات الصحية التفاعلية التي تساعدك في تقييم حالتك الصحية وحساب مؤشراتك الطبية بشكل آمن ومجاني
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-brand to-brand-light mx-auto mt-6 rounded-full"></div>
        </div>

        {/* Featured Tools Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12">
          {featuredTools.map((tool) => {
            const IconComponent = tool.icon;
            return (
              <Card 
                key={tool.id} 
                className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden border-0 shadow-lg rounded-2xl bg-white"
              >
                <CardHeader className="pb-4">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${tool.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
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
                    onClick={() => handleToolClick(tool.id, tool.title)}
                  >
                    ابدأ الآن
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* View All Tools Button */}
        <div className="text-center">
          <Link to="/health-tools" onClick={handleViewAllToolsClick}>
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-brand to-brand-light hover:from-brand-dark hover:to-brand text-white px-8 py-4 rounded-xl font-medium text-lg shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              <span>عرض جميع الأدوات الصحية ({featuredTools.length + 15} أداة)</span>
              <ArrowLeft className="mr-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        {/* Disclaimer */}
        <div className="mt-12 p-6 bg-yellow-50 border border-yellow-200 rounded-2xl text-center">
          <p className="text-yellow-800 font-medium">
            ⚠️ هذه الأدوات مخصصة للتوعية الصحية فقط ولا تغني عن الاستشارة الطبية المتخصصة
          </p>
        </div>
      </div>
    </section>
  );
};

export default HealthToolsSection;
