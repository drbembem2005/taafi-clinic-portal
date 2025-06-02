
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Brain, Star } from 'lucide-react';

const EmotionalIntelligenceTest = () => {
  const [answers, setAnswers] = useState<{ [key: string]: number }>({});
  const [result, setResult] = useState<any>(null);

  const questions = [
    { id: 'q1', text: 'أستطيع التعرف على مشاعري بوضوح', category: 'selfAware' },
    { id: 'q2', text: 'أفهم أسباب مشاعري ودوافعها', category: 'selfAware' },
    { id: 'q3', text: 'أستطيع التحكم في انفعالاتي عند الغضب', category: 'selfManage' },
    { id: 'q4', text: 'أتعامل مع التوتر بطريقة إيجابية', category: 'selfManage' },
    { id: 'q5', text: 'أستطيع قراءة مشاعر الآخرين بسهولة', category: 'socialAware' },
    { id: 'q6', text: 'أنتبه لتعبيرات الوجه ولغة الجسد', category: 'socialAware' },
    { id: 'q7', text: 'أتواصل بفعالية مع الآخرين', category: 'relationSkills' },
    { id: 'q8', text: 'أحل النزاعات بطريقة دبلوماسية', category: 'relationSkills' },
    { id: 'q9', text: 'أتقبل النقد البناء بصدر رحب', category: 'selfManage' },
    { id: 'q10', text: 'أتعاطف مع مشاكل الآخرين', category: 'socialAware' },
    { id: 'q11', text: 'أحفز نفسي لتحقيق أهدافي', category: 'selfManage' },
    { id: 'q12', text: 'أعمل بشكل جيد ضمن فريق', category: 'relationSkills' },
  ];

  const calculateEQ = () => {
    const categories = {
      selfAware: 0,
      selfManage: 0,
      socialAware: 0,
      relationSkills: 0
    };

    let totalScore = 0;
    questions.forEach(question => {
      const score = answers[question.id] || 0;
      categories[question.category as keyof typeof categories] += score;
      totalScore += score;
    });

    const maxScore = questions.length * 5;
    const percentage = (totalScore / maxScore) * 100;

    let level: 'low' | 'moderate' | 'high' | 'very-high' = 'low';
    let category = '';
    let recommendations: string[] = [];

    if (percentage >= 85) {
      level = 'very-high';
      category = 'ذكاء عاطفي ممتاز';
      recommendations = [
        'استمر في تطوير مهاراتك القيادية',
        'ساعد الآخرين في تطوير ذكائهم العاطفي',
        'كن مرشداً أو موجهاً للآخرين',
        'اطلب تحديات جديدة في العمل',
        'شارك خبراتك مع المجتمع'
      ];
    } else if (percentage >= 70) {
      level = 'high';
      category = 'ذكاء عاطفي جيد جداً';
      recommendations = [
        'طور مهارات الاستماع الفعال',
        'تدرب على حل النزاعات',
        'اقرأ عن التواصل غير اللفظي',
        'مارس التأمل اليقظ',
        'احضر ورش تطوير الذات'
      ];
    } else if (percentage >= 55) {
      level = 'moderate';
      category = 'ذكاء عاطفي متوسط';
      recommendations = [
        'تعلم تقنيات إدارة المشاعر',
        'تدرب على التعبير عن مشاعرك',
        'طور مهارات التعاطف',
        'اقرأ كتب الذكاء العاطفي',
        'مارس الأنشطة الاجتماعية'
      ];
    } else {
      level = 'low';
      category = 'ذكاء عاطفي يحتاج تطوير';
      recommendations = [
        'ابدأ بتسمية مشاعرك يومياً',
        'تعلم تقنيات التنفس العميق',
        'اطلب المساعدة من المختصين',
        'انضم لمجموعات دعم اجتماعي',
        'تدرب على الصبر والهدوء'
      ];
    }

    setResult({
      totalScore,
      percentage: Math.round(percentage),
      level,
      category,
      recommendations,
      categories: {
        selfAware: Math.round((categories.selfAware / (2 * 5)) * 100),
        selfManage: Math.round((categories.selfManage / (3 * 5)) * 100),
        socialAware: Math.round((categories.socialAware / (3 * 5)) * 100),
        relationSkills: Math.round((categories.relationSkills / (4 * 5)) * 100)
      }
    });
  };

  const isComplete = questions.every(q => answers[q.id]);

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2 text-2xl text-brand">
            <Brain className="h-6 w-6" />
            اختبار الذكاء العاطفي
          </CardTitle>
          <p className="text-gray-600">
            تقييم مهاراتك في فهم وإدارة المشاعر والتفاعل الاجتماعي
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
                <div className="grid grid-cols-5 gap-2 text-sm">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <RadioGroupItem value="1" id={`${question.id}-1`} />
                    <Label htmlFor={`${question.id}-1`}>لا أبداً</Label>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <RadioGroupItem value="2" id={`${question.id}-2`} />
                    <Label htmlFor={`${question.id}-2`}>نادراً</Label>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <RadioGroupItem value="3" id={`${question.id}-3`} />
                    <Label htmlFor={`${question.id}-3`}>أحياناً</Label>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <RadioGroupItem value="4" id={`${question.id}-4`} />
                    <Label htmlFor={`${question.id}-4`}>غالباً</Label>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <RadioGroupItem value="5" id={`${question.id}-5`} />
                    <Label htmlFor={`${question.id}-5`}>دائماً</Label>
                  </div>
                </div>
              </RadioGroup>
            </Card>
          ))}

          <Button 
            onClick={calculateEQ} 
            className="w-full bg-brand hover:bg-brand-dark text-white py-3 rounded-xl"
            disabled={!isComplete}
          >
            تقييم الذكاء العاطفي
          </Button>

          {result && (
            <Card className={`mt-6 border-2 ${
              result.level === 'very-high' ? 'bg-green-50 border-green-200' :
              result.level === 'high' ? 'bg-blue-50 border-blue-200' :
              result.level === 'moderate' ? 'bg-yellow-50 border-yellow-200' :
              'bg-orange-50 border-orange-200'
            }`}>
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className="text-3xl font-bold text-brand mb-2">{result.percentage}%</div>
                  <div className={`text-xl font-semibold p-3 rounded-lg ${
                    result.level === 'very-high' ? 'bg-green-100 text-green-800' :
                    result.level === 'high' ? 'bg-blue-100 text-blue-800' :
                    result.level === 'moderate' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-orange-100 text-orange-800'
                  }`}>
                    {result.category}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">تفاصيل النتائج</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>الوعي الذاتي:</span>
                        <span className="font-bold">{result.categories.selfAware}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>إدارة الذات:</span>
                        <span className="font-bold">{result.categories.selfManage}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>الوعي الاجتماعي:</span>
                        <span className="font-bold">{result.categories.socialAware}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>مهارات العلاقات:</span>
                        <span className="font-bold">{result.categories.relationSkills}%</span>
                      </div>
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
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EmotionalIntelligenceTest;
