
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { healthCategories } from '@/data/healthToolsData';
import { 
  Sparkles,
  ArrowLeft,
  Zap
} from 'lucide-react';

const HealthToolsCategories = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (categoryId: string) => {
    navigate(`/health-tools/category/${categoryId}`);
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
                🏥 فئات الأدوات الصحية
              </h1>
              <Sparkles className="h-6 w-6 md:h-8 md:w-8 text-brand animate-pulse" />
            </div>
            <p className="text-sm md:text-base lg:text-lg text-gray-600 leading-relaxed mb-6">
              اختر الفئة المناسبة لاحتياجاتك الصحية واستكشف الأدوات المتخصصة
            </p>
            <div className="flex flex-wrap justify-center gap-2 text-xs md:text-sm">
              <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-brand font-medium shadow-md border border-white/20">
                ✅ {healthCategories.length} فئة متخصصة
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
      <section className="py-4 bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-20 shadow-sm">
        <div className="container mx-auto px-4">
          <Button
            variant="outline"
            onClick={() => navigate('/health-tools')}
            className="rounded-full px-4 py-2 font-medium shadow-md hover:shadow-lg transition-all duration-300 border-2"
            size="sm"
          >
            <ArrowLeft className="ml-2 h-4 w-4" />
            العودة للأدوات
          </Button>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {healthCategories.map((category) => {
              const IconComponent = category.icon;
              return (
                <Card 
                  key={category.id} 
                  className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden border-0 shadow-md rounded-2xl bg-white/95 backdrop-blur-sm relative cursor-pointer"
                  onClick={() => handleCategoryClick(category.id)}
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
    </div>
  );
};

export default HealthToolsCategories;
