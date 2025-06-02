
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Trophy, Star, Target } from 'lucide-react';

const ConfidenceTest = () => {
  const [answers, setAnswers] = useState<{ [key: string]: number }>({});
  const [result, setResult] = useState<any>(null);

  const questions = [
    { id: 'q1', text: 'أثق في قدرتي على اتخاذ القرارات الصحيحة' },
    { id: 'q2', text: 'أشعر بالراحة عند التحدث أمام مجموعة من الناس' },
    { id: 'q3', text: 'أتقبل المدح والثناء بطريقة طبيعية' },
    { id: 'q4', text: 'أجرب أشياء جديدة دون خوف من الفشل' },
    { id: 'q5', text: 'أستطيع التعبير عن رأيي حتى لو كان مختلفاً' },
    { id: 'q6', text: 'أشعر بالراحة مع مظهري وشخصيتي' },
    { id: 'q7', text: 'أسعى لتحقيق أهدافي حتى لو كانت صعبة' },
    { id: 'q8', text: 'أتعامل مع النقد بطريقة إيجابية' },
    { id: 'q9', text: 'أثق في قدرتي على حل المشاكل' },
    { id: 'q10', text: 'أشعر بأنني أستحق النجاح والسعادة' },
    { id: 'q11', text: 'أستطيع قول "لا" عندما أحتاج لذلك' },
    { id: 'q12', text: 'أؤمن بأن لدي قدرات ومواهب مميزة' },
  ];

  const calculateConfidence = () => {
    const totalScore = Object.values(answers).reduce((sum, score) => sum + score, 0);
    const maxScore = questions.length * 5;
    const percentage = (totalScore / maxScore) * 100;

    let level: 'low' | 'moderate' | 'high' | 'very-high' = 'low';
    let category = '';
    let recommendations: string[] = [];
    let strengths: string[] = [];

    if (percentage >= 80) {
      level = 'very-high';
      category = 'ثقة عالية جداً بالنفس';
      strengths = [
        'قدرة ممتازة على اتخاذ القرارات',
        'ثقة في التعبير عن الآراء',
        'تقبل جيد للذات والمظهر',
        'استعداد لمواجهة التحديات'
      ];
      recommendations = [
        'استمر في تطوير مهاراتك القيادية',
        'ساعد الآخرين في بناء ثقتهم',
        'تحدى نفسك بأهداف أكبر',
        'شارك خبراتك مع المجتمع',
        'كن مرشداً للآخرين'
      ];
    } else if (percentage >= 60) {
      level = 'high';
      category = 'ثقة جيدة بالنفس';
      strengths = [
        'ثقة متوسطة في القدرات',
        'تقبل نسبي للذات',
        'استعداد للتجارب الجديدة',
        'قدرة على التعبير عن الرأي'
      ];
      recommendations = [
        'تدرب على التحدث أمام الآخرين',
        'ضع أهدافاً تحديك تدريجياً',
        'تعلم مهارات جديدة تثق فيها',
        'اطلب تغذية راجعة إيجابية',
        'احتفل بإنجازاتك الصغيرة'
      ];
    } else if (percentage >= 40) {
      level = 'moderate';
      category = 'ثقة متوسطة بالنفس';
      strengths = [
        'بعض الثقة في مجالات معينة',
        'قدرة محدودة على التعبير',
        'استعداد للتعلم والتحسين'
      ];
      recommendations = [
        'ابدأ بأهداف صغيرة قابلة للتحقيق',
        'تعلم تقنيات التحدث الإيجابي مع الذات',
        'مارس الأنشطة التي تجيدها',
        'ابني شبكة دعم اجتماعي قوية',
        'تذكر إنجازاتك السابقة يومياً'
      ];
    } else {
      level = 'low';
      category = 'ثقة منخفضة بالنفس';
      strengths = [
        'وعي بالحاجة للتحسين',
        'رغبة في التطوير',
        'صدق مع الذات'
      ];
      recommendations = [
        'ابدأ بتمارين التأكيدات الإيجابية',
        'اطلب المساعدة من مختص',
        'انضم لمجموعات دعم',
        'تجنب الأشخاص السلبيين',
        'ركز على نقاط قوتك ولو كانت بسيطة'
      ];
    }

    setResult({
      totalScore,
      percentage: Math.round(percentage),
      level,
      category,
      recommendations,
      strengths
    });
  };

  const isComplete = questions.every(q => answers[q.id] !== undefined);

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2 text-2xl text-brand">
            <Trophy className="h-6 w-6" />
            اختبار الثقة بالنفس
          </CardTitle>
          <p className="text-gray-600">
            تقييم مستوى ثقتك بنفسك وقدراتك الشخصية
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
            onClick={calculateConfidence} 
            className="w-full bg-brand hover:bg-brand-dark text-white py-3 rounded-xl"
            disabled={!isComplete}
          >
            تقييم الثقة بالنفس
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

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <Trophy className="h-5 w-5 text-brand" />
                      نقاط القوة
                    </h3>
                    <ul className="space-y-2">
                      {result.strengths.map((strength: string, index: number) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-green-500 text-lg">✓</span>
                          <span className="text-sm">{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <Target className="h-5 w-5 text-brand" />
                      خطة التطوير
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

export default ConfidenceTest;
