
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Scale, Clock, Heart, Star } from 'lucide-react';

const WorkLifeBalance = () => {
  const [answers, setAnswers] = useState<{ [key: string]: number }>({});
  const [result, setResult] = useState<any>(null);

  const questions = [
    { id: 'q1', text: 'أستطيع إنهاء عملي في الوقت المحدد', category: 'work' },
    { id: 'q2', text: 'أشعر بالرضا عن أدائي في العمل', category: 'work' },
    { id: 'q3', text: 'لدي وقت كافي للأنشطة الشخصية', category: 'personal' },
    { id: 'q4', text: 'أحصل على نوم كافي ومريح', category: 'health' },
    { id: 'q5', text: 'أقضي وقتاً جيداً مع العائلة والأصدقاء', category: 'social' },
    { id: 'q6', text: 'أتمكن من ممارسة الرياضة بانتظام', category: 'health' },
    { id: 'q7', text: 'أتوقف عن التفكير في العمل خارج أوقات العمل', category: 'work' },
    { id: 'q8', text: 'لدي وقت للهوايات والأنشطة الممتعة', category: 'personal' },
    { id: 'q9', text: 'أشعر بأنني أدير ضغوط الحياة بشكل جيد', category: 'stress' },
    { id: 'q10', text: 'أستطيع أخذ إجازات دون القلق بشأن العمل', category: 'work' },
    { id: 'q11', text: 'أشعر بالطاقة والحيوية معظم الوقت', category: 'health' },
    { id: 'q12', text: 'أحقق التوازن بين طموحاتي وواقعي', category: 'personal' },
  ];

  const calculateBalance = () => {
    const categories = {
      work: 0,
      personal: 0,
      health: 0,
      social: 0,
      stress: 0
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

    if (percentage >= 80) {
      level = 'very-high';
      category = 'توازن ممتاز بين العمل والحياة';
      recommendations = [
        'استمر في الحفاظ على هذا التوازن الرائع',
        'شارك خبراتك مع الآخرين',
        'كن مثالاً يحتذى به في محيط العمل',
        'طور مهارات إدارة الوقت أكثر',
        'ساعد الآخرين في تحقيق التوازن'
      ];
    } else if (percentage >= 60) {
      level = 'high';
      category = 'توازن جيد بين العمل والحياة';
      recommendations = [
        'ضع حدوداً واضحة بين وقت العمل والراحة',
        'خصص وقتاً محدداً للأنشطة الشخصية',
        'تعلم قول "لا" للمهام الإضافية غير الضرورية',
        'مارس تقنيات إدارة التوتر',
        'خطط لأنشطة ممتعة مع الأحباب'
      ];
    } else if (percentage >= 40) {
      level = 'moderate';
      category = 'توازن متوسط يحتاج تحسين';
      recommendations = [
        'راجع أولوياتك وأعد ترتيبها',
        'تعلم تقنيات إدارة الوقت الفعالة',
        'اطلب المساعدة في المهام الثقيلة',
        'خصص وقتاً يومياً للراحة والاسترخاء',
        'تواصل مع مديرك حول الأعباء الزائدة'
      ];
    } else {
      level = 'low';
      category = 'عدم توازن يحتاج تدخل فوري';
      recommendations = [
        'فكر في إعادة تقييم خيارات العمل الحالية',
        'اطلب المساعدة المهنية لإدارة الضغوط',
        'ضع خطة واضحة لاستعادة التوازن',
        'تحدث مع المختصين حول حالتك',
        'لا تتردد في طلب إجازة للراحة'
      ];
    }

    const detailedScores = {
      work: Math.round((categories.work / (4 * 5)) * 100),
      personal: Math.round((categories.personal / (3 * 5)) * 100),
      health: Math.round((categories.health / (3 * 5)) * 100),
      social: Math.round((categories.social / (1 * 5)) * 100),
      stress: Math.round((categories.stress / (1 * 5)) * 100)
    };

    setResult({
      totalScore,
      percentage: Math.round(percentage),
      level,
      category,
      recommendations,
      detailedScores
    });
  };

  const isComplete = questions.every(q => answers[q.id] !== undefined);

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2 text-2xl text-brand">
            <Scale className="h-6 w-6" />
            حاسبة التوازن بين العمل والحياة
          </CardTitle>
          <p className="text-gray-600">
            تقييم مستوى التوازن في حياتك المهنية والشخصية
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
            onClick={calculateBalance} 
            className="w-full bg-brand hover:bg-brand-dark text-white py-3 rounded-xl"
            disabled={!isComplete}
          >
            تقييم التوازن
          </Button>

          {result && (
            <Card className={`mt-6 border-2 ${
              result.level === 'very-high' ? 'bg-green-50 border-green-200' :
              result.level === 'high' ? 'bg-blue-50 border-blue-200' :
              result.level === 'moderate' ? 'bg-yellow-50 border-yellow-200' :
              'bg-red-50 border-red-200'
            }`}>
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className="text-3xl font-bold text-brand mb-2">{result.percentage}%</div>
                  <div className={`text-xl font-semibold p-3 rounded-lg ${
                    result.level === 'very-high' ? 'bg-green-100 text-green-800' :
                    result.level === 'high' ? 'bg-blue-100 text-blue-800' :
                    result.level === 'moderate' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {result.category}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">تفاصيل التقييم</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          إدارة العمل:
                        </span>
                        <span className="font-bold">{result.detailedScores.work}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="flex items-center gap-2">
                          <Heart className="h-4 w-4" />
                          الحياة الشخصية:
                        </span>
                        <span className="font-bold">{result.detailedScores.personal}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="flex items-center gap-2">
                          <Star className="h-4 w-4" />
                          الصحة:
                        </span>
                        <span className="font-bold">{result.detailedScores.health}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>الحياة الاجتماعية:</span>
                        <span className="font-bold">{result.detailedScores.social}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>إدارة التوتر:</span>
                        <span className="font-bold">{result.detailedScores.stress}%</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <Star className="h-5 w-5 text-brand" />
                      توصيات التحسين
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

export default WorkLifeBalance;
