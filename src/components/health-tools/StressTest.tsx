
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { AlertTriangle, Star, Heart } from 'lucide-react';

const StressTest = () => {
  const [answers, setAnswers] = useState<{ [key: string]: number }>({});
  const [result, setResult] = useState<any>(null);

  const questions = [
    { id: 'q1', text: 'أشعر بالإرهاق والتعب معظم الوقت' },
    { id: 'q2', text: 'أجد صعوبة في التركيز على المهام' },
    { id: 'q3', text: 'أعاني من مشاكل في النوم أو الأرق' },
    { id: 'q4', text: 'أشعر بالقلق أو التوتر بشكل مستمر' },
    { id: 'q5', text: 'أفقد أعصابي بسهولة أو أنفعل بسرعة' },
    { id: 'q6', text: 'أعاني من صداع متكرر أو آلام عضلية' },
    { id: 'q7', text: 'أشعر بضيق في التنفس أو خفقان القلب' },
    { id: 'q8', text: 'تغيرت شهيتي للطعام (زيادة أو نقصان)' },
    { id: 'q9', text: 'أتجنب الأنشطة الاجتماعية' },
    { id: 'q10', text: 'أشعر بالحزن أو اليأس أحياناً' },
    { id: 'q11', text: 'أعتمد على المنبهات أو المهدئات للتأقلم' },
    { id: 'q12', text: 'أشعر أن الأمور خارجة عن سيطرتي' },
  ];

  const calculateStress = () => {
    const totalScore = Object.values(answers).reduce((sum, score) => sum + score, 0);
    const maxScore = questions.length * 4;
    const percentage = (totalScore / maxScore) * 100;

    let level: 'low' | 'moderate' | 'high' | 'very-high' = 'low';
    let category = '';
    let recommendations: string[] = [];

    if (percentage >= 75) {
      level = 'very-high';
      category = 'مستوى توتر عالي جداً';
      recommendations = [
        'اطلب المساعدة المهنية فوراً',
        'تحدث مع طبيب أو مختص نفسي',
        'مارس تقنيات التنفس العميق يومياً',
        'تجنب الكافيين والمنبهات',
        'احصل على دعم من الأصدقاء والعائلة'
      ];
    } else if (percentage >= 50) {
      level = 'high';
      category = 'مستوى توتر عالي';
      recommendations = [
        'خذ فترات راحة منتظمة',
        'مارس الرياضة أو المشي يومياً',
        'تعلم تقنيات إدارة الوقت',
        'احصل على نوم كافي (7-9 ساعات)',
        'فكر في استشارة مختص'
      ];
    } else if (percentage >= 25) {
      level = 'moderate';
      category = 'مستوى توتر متوسط';
      recommendations = [
        'مارس التأمل أو اليوغا',
        'نظم جدولك اليومي',
        'خصص وقت للهوايات',
        'تواصل مع الأصدقاء',
        'تجنب المثيرات غير الضرورية'
      ];
    } else {
      level = 'low';
      category = 'مستوى توتر منخفض';
      recommendations = [
        'استمر في الحفاظ على نمط حياتك الصحي',
        'شارك تجربتك مع الآخرين',
        'كن متاحاً لدعم المحتاجين',
        'طور مهارات جديدة للتأقلم',
        'احتفل بإنجازاتك الصغيرة'
      ];
    }

    setResult({
      totalScore,
      percentage: Math.round(percentage),
      level,
      category,
      recommendations
    });
  };

  const isComplete = questions.every(q => answers[q.id] !== undefined);

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2 text-2xl text-brand">
            <AlertTriangle className="h-6 w-6" />
            اختبار الضغط النفسي والتوتر
          </CardTitle>
          <p className="text-gray-600">
            تقييم مستوى التوتر والضغط النفسي في حياتك اليومية
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {questions.map((question, index) => (
            <Card key={question.id} className="p-4">
              <Label className="text-base font-medium mb-4 block">
                {index + 1}. {question.text}
              </Label>
              <RadioGroup 
                value={answers[question.id]?.toString()} 
                onValueChange={(value) => setAnswers({...answers, [question.id]: parseInt(value)})}
              >
                <div className="grid grid-cols-4 gap-2 text-sm">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <RadioGroupItem value="0" id={`${question.id}-0`} />
                    <Label htmlFor={`${question.id}-0`}>أبداً</Label>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <RadioGroupItem value="1" id={`${question.id}-1`} />
                    <Label htmlFor={`${question.id}-1`}>أحياناً</Label>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <RadioGroupItem value="2" id={`${question.id}-2`} />
                    <Label htmlFor={`${question.id}-2`}>غالباً</Label>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <RadioGroupItem value="4" id={`${question.id}-4`} />
                    <Label htmlFor={`${question.id}-4`}>دائماً</Label>
                  </div>
                </div>
              </RadioGroup>
            </Card>
          ))}

          <Button 
            onClick={calculateStress} 
            className="w-full bg-brand hover:bg-brand-dark text-white py-3 rounded-xl"
            disabled={!isComplete}
          >
            تقييم مستوى التوتر
          </Button>

          {result && (
            <Card className={`mt-6 border-2 ${
              result.level === 'very-high' ? 'bg-red-50 border-red-200' :
              result.level === 'high' ? 'bg-orange-50 border-orange-200' :
              result.level === 'moderate' ? 'bg-yellow-50 border-yellow-200' :
              'bg-green-50 border-green-200'
            }`}>
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className="text-3xl font-bold text-brand mb-2">{result.percentage}%</div>
                  <div className={`text-xl font-semibold p-3 rounded-lg ${
                    result.level === 'very-high' ? 'bg-red-100 text-red-800' :
                    result.level === 'high' ? 'bg-orange-100 text-orange-800' :
                    result.level === 'moderate' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {result.category}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Star className="h-5 w-5 text-brand" />
                    التوصيات
                  </h3>
                  <ul className="space-y-2">
                    {result.recommendations.map((rec: string, index: number) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-brand text-lg">•</span>
                        <span className="text-sm">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StressTest;
