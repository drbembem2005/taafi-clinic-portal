
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { assessHealthyHabits } from '@/utils/healthCalculations';
import { HealthyHabitsResult } from '@/types/healthTools';

const HealthyHabitsAssessment = () => {
  const [habits, setHabits] = useState({
    nutrition: 5,
    exercise: 5,
    sleep: 5,
    stress: 5,
    social: 5
  });
  const [result, setResult] = useState<HealthyHabitsResult | null>(null);

  const categories = [
    {
      id: 'nutrition',
      label: 'التغذية الصحية',
      description: 'تناول الخضروات والفواكه، شرب الماء، تجنب الوجبات السريعة'
    },
    {
      id: 'exercise',
      label: 'النشاط البدني',
      description: 'ممارسة الرياضة، المشي، الحركة اليومية'
    },
    {
      id: 'sleep',
      label: 'جودة النوم',
      description: 'النوم 7-8 ساعات، مواعيد منتظمة، بيئة نوم صحية'
    },
    {
      id: 'stress',
      label: 'إدارة التوتر',
      description: 'تقنيات الاسترخاء، التأمل، التوازن بين العمل والحياة'
    },
    {
      id: 'social',
      label: 'التواصل الاجتماعي',
      description: 'قضاء وقت مع الأصدقاء والعائلة، الأنشطة الجماعية'
    }
  ];

  const handleSubmit = () => {
    const assessment = assessHealthyHabits(habits);
    setResult(assessment);
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 6) return 'text-yellow-600';
    if (score >= 4) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 8) return 'bg-green-50 border-green-200';
    if (score >= 6) return 'bg-yellow-50 border-yellow-200';
    if (score >= 4) return 'bg-orange-50 border-orange-200';
    return 'bg-red-50 border-red-200';
  };

  if (result) {
    return (
      <Card className="border-2 border-brand/20">
        <CardHeader>
          <CardTitle className="text-xl text-center text-brand">تقييم العادات الصحية</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className={`p-6 rounded-lg border-2 ${getScoreBgColor(result.overallScore)}`}>
            <div className="text-center">
              <div className={`text-4xl font-bold ${getScoreColor(result.overallScore)} mb-2`}>
                {result.overallScore}/10
              </div>
              <div className="text-lg text-gray-700">النتيجة الإجمالية للعادات الصحية</div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold text-gray-900">تفصيل النتائج:</h4>
            {categories.map((category) => {
              const score = result.categories[category.id as keyof typeof result.categories];
              return (
                <div key={category.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{category.label}</div>
                    <div className="text-sm text-gray-600">{category.description}</div>
                  </div>
                  <div className={`text-xl font-bold ${getScoreColor(score)} ml-4`}>
                    {score}/10
                  </div>
                </div>
              );
            })}
          </div>

          {result.priority.length > 0 && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h5 className="font-bold text-yellow-900 mb-2">أولويات التحسين:</h5>
              <div className="flex flex-wrap gap-2">
                {result.priority.map((priority, index) => (
                  <span key={index} className="px-3 py-1 bg-yellow-200 text-yellow-800 rounded-full text-sm">
                    {priority}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-3">
            <h4 className="font-bold text-gray-900">خطة التحسين:</h4>
            <ul className="space-y-2">
              {result.recommendations.map((rec, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-brand ml-2">•</span>
                  <span className="text-gray-700">{rec}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h5 className="font-bold text-blue-900 mb-2">نصائح سريعة:</h5>
            <ul className="text-blue-800 text-sm space-y-1">
              <li>• ابدأ بتحسين عادة واحدة كل أسبوع</li>
              <li>• سجل تقدمك يومياً لتحفيز نفسك</li>
              <li>• اطلب الدعم من الأصدقاء والعائلة</li>
              <li>• كافئ نفسك عند تحقيق الأهداف</li>
            </ul>
          </div>

          <Button 
            onClick={() => setResult(null)} 
            className="w-full bg-brand hover:bg-brand-dark"
          >
            إعادة التقييم
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl text-right">تقييم العادات الصحية الشامل</CardTitle>
          <p className="text-gray-600 text-right">
            قيّم عاداتك الصحية من 1 (سيء جداً) إلى 10 (ممتاز)
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {categories.map((category) => (
            <div key={category.id} className="space-y-4">
              <div>
                <Label className="text-right block font-medium text-lg">
                  {category.label}
                </Label>
                <p className="text-sm text-gray-600 text-right mt-1">
                  {category.description}
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">سيء</span>
                  <span className={`text-2xl font-bold ${getScoreColor(habits[category.id as keyof typeof habits])}`}>
                    {habits[category.id as keyof typeof habits]}
                  </span>
                  <span className="text-sm text-gray-500">ممتاز</span>
                </div>
                <Slider
                  value={[habits[category.id as keyof typeof habits]]}
                  onValueChange={(value) => setHabits({ ...habits, [category.id]: value[0] })}
                  max={10}
                  min={1}
                  step={1}
                  className="w-full"
                />
              </div>
            </div>
          ))}
          
          <Button onClick={handleSubmit} className="w-full bg-brand hover:bg-brand-dark">
            تقييم العادات الصحية
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default HealthyHabitsAssessment;
