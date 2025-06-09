
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { healthToolsData, healthCategories } from '@/data/healthToolsData';
import HealthToolsManager from '@/components/health-tools/HealthToolsManager';
import { 
  Sparkles,
  ArrowLeft,
  Zap,
  ArrowRight
} from 'lucide-react';

const HealthToolsCategory = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const [activeToolId, setActiveToolId] = React.useState<string | null>(null);

  const category = healthCategories.find(cat => cat.id === categoryId);
  const categoryTools = healthToolsData.filter(tool => tool.category === categoryId);

  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const toolParam = urlParams.get('tool');
    if (toolParam && categoryTools.find(t => t.id === toolParam)) {
      setActiveToolId(toolParam);
    }
  }, [categoryTools]);

  if (!category) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">الفئة غير موجودة</h1>
          <Button onClick={() => navigate('/health-tools/categories')}>
            العودة للفئات
          </Button>
        </div>
      </div>
    );
  }

  const openTool = (toolId: string) => {
    setActiveToolId(toolId);
    const url = new URL(window.location.href);
    url.searchParams.set('tool', toolId);
    window.history.pushState({}, '', url);
  };

  const closeTool = () => {
    setActiveToolId(null);
    const url = new URL(window.location.href);
    url.searchParams.delete('tool');
    window.history.replaceState({}, '', url);
  };

  const IconComponent = category.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <section className="bg-gradient-to-l from-brand/10 via-blue-50 to-indigo-100 py-8 md:py-12 relative overflow-hidden">
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className={`w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br ${category.color} flex items-center justify-center shadow-lg`}>
                <IconComponent className="h-6 w-6 md:h-8 md:w-8 text-white" />
              </div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                {category.name}
              </h1>
            </div>
            <p className="text-sm md:text-base lg:text-lg text-gray-600 leading-relaxed mb-6">
              {category.description}
            </p>
            <div className="flex flex-wrap justify-center gap-2 text-xs md:text-sm">
              <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-brand font-medium shadow-md border border-white/20">
                ✅ {categoryTools.length} أداة متاحة
              </span>
              <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-brand font-medium shadow-md border border-white/20">
                🔒 آمن وسري 100%
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation */}
      <section className="py-4 bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-20 shadow-sm">
        <div className="container mx-auto px-4 flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => navigate('/health-tools/categories')}
            className="rounded-full px-4 py-2 font-medium shadow-md hover:shadow-lg transition-all duration-300 border-2"
            size="sm"
          >
            <ArrowRight className="ml-2 h-4 w-4" />
            الفئات
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate('/health-tools')}
            className="rounded-full px-4 py-2 font-medium shadow-md hover:shadow-lg transition-all duration-300 border-2"
            size="sm"
          >
            <ArrowLeft className="ml-2 h-4 w-4" />
            جميع الأدوات
          </Button>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="py-6 md:py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categoryTools.map((tool) => {
              const ToolIconComponent = tool.icon;
              return (
                <Card 
                  key={tool.id} 
                  className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden border-0 shadow-md rounded-2xl bg-white/95 backdrop-blur-sm relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-brand/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <CardHeader className="pb-3 pt-4 relative z-10">
                    <div className={`w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300 shadow-lg mx-auto`}>
                      <ToolIconComponent className="h-6 w-6 md:h-7 md:w-7 text-white" />
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

      <HealthToolsManager 
        activeToolId={activeToolId}
        onCloseTool={closeTool}
      />
    </div>
  );
};

export default HealthToolsCategory;
