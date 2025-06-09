import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import HealthToolsManager from '@/components/health-tools/HealthToolsManager';
import HealthToolsSearch from '@/components/health-tools/HealthToolsSearch';
import { healthToolsData, healthCategories } from '@/data/healthToolsData';
import { 
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Zap,
  Stethoscope
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SearchHealthTool {
  id: string;
  title: string;
  description: string;
  category: string;
  keywords?: string[];
  icon: React.ComponentType<any>;
}

const HealthTools = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [activeToolId, setActiveToolId] = useState<string | null>(null);
  const [filteredTools, setFilteredTools] = useState<SearchHealthTool[]>(
    healthToolsData.map(tool => ({
      id: tool.id,
      title: tool.title,
      description: tool.description,
      category: tool.category,
      keywords: tool.keywords,
      icon: tool.icon
    }))
  );
  const navigate = useNavigate();

  // Check for URL parameter to auto-open tool
  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const toolParam = urlParams.get('tool');
    console.log('HealthTools: Checking URL param for tool:', toolParam);
    if (toolParam && healthToolsData.find(t => t.id === toolParam)) {
      console.log('HealthTools: Found tool, opening:', toolParam);
      setActiveToolId(toolParam);
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
    console.log('HealthTools: Opening tool:', toolId);
    setActiveToolId(toolId);
    // Update URL parameter
    const url = new URL(window.location.href);
    url.searchParams.set('tool', toolId);
    window.history.pushState({}, '', url);
  };

  const closeTool = () => {
    console.log('HealthTools: Closing tool');
    setActiveToolId(null);
    // Remove tool parameter from URL
    const url = new URL(window.location.href);
    url.searchParams.delete('tool');
    window.history.replaceState({}, '', url);
  };

  const goBackToCategories = () => {
    setSelectedCategory(null);
  };

  // Convert healthToolsData to SearchHealthTool format for search component
  const searchTools: SearchHealthTool[] = React.useMemo(() => {
    const baseTools = selectedCategory 
      ? healthToolsData.filter(t => t.category === selectedCategory)
      : healthToolsData;
    
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
            <div className="flex flex-wrap justify-center gap-2 text-xs md:text-sm mb-4">
              <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-brand font-medium shadow-md border border-white/20">
                ✅ {healthToolsData.length} أداة متطورة
              </span>
              <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-brand font-medium shadow-md border border-white/20">
                🔒 آمن وسري 100%
              </span>
              <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-brand font-medium shadow-md border border-white/20">
                📱 متوافق مع الجوال
              </span>
            </div>
            {/* Quick Navigation */}
            <div className="flex justify-center gap-3">
              <Button 
                onClick={() => navigate('/health-tools/categories')}
                className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-xl px-4 py-2 font-bold transition-all duration-300 shadow-md text-sm"
              >
                🏥 تصفح بالفئات
              </Button>
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
