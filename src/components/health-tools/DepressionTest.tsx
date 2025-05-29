
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { assessDepression } from '@/utils/healthCalculations';
import { HealthToolResult } from '@/types/healthTools';

const DepressionTest = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>(new Array(9).fill(0));
  const [result, setResult] = useState<HealthToolResult | null>(null);

  const questions = [
    'قلة الاهتمام أو المتعة في أداء الأشياء',
    'الشعور بالإحباط أو الاكتئاب أو اليأس',
    'صعوبة في النوم أو البقاء نائماً، أو النوم أكثر من اللازم',
    'الشعور بالتعب أو قلة الطاقة',
    'ضعف الشهية أو الإفراط في الأكل',
    'الشعور بالسوء تجاه نفسك - أو أنك فاشل أو خذلت نفسك أو عائلتك',
    'صعوبة في التركيز على الأشياء، مثل قراءة الصحيفة أو مشاهدة التلفزيون',
    'التحرك أو التحدث ببطء لدرجة أن الآخرين لاحظوا، أو العكس - كونك مضطرباً أو لا تهدأ',
    'أفكار أنه من الأفضل أن تموت، أو إيذاء نفسك بطريقة ما'
  ];

  const options = [
    { value: 0, label: 'لا على الإطلاق' },
    { value: 1, label: 'عدة أيام' },
    { value: 2, label: 'أكثر من نصف الأيام' },
    { value: 3, label: 'تقريباً كل يوم' }
  ];

  const handleAnswerChange = (value: number) => {
    const newAnswers = [...answers];
    newAnswers[currentStep] = value;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      calculateResult();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const calculateResult = () => {
    const assessment = assessDepression(answers);
    setResult(assessment);
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-600';
      case 'moderate': return 'text-yellow-600';
      case 'high': return 'text-orange-600';
      case 'very-high': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getRiskBgColor = (level: string) => {
    switch (level) {
      case 'low': return 'bg-green-50 border-green-200';
      case 'moderate': return 'bg-yellow-50 border-yellow-200';
      case 'high': return 'bg-orange-50 border-orange-200';
      case 'very-high': return 'bg-red-50 border-red-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  if (result) {
    return (
      <Card className="border-2 border-brand/20">
        <CardHeader>
          <CardTitle className="text-xl text-center text-brand">نتائج تقييم أعراض الاكتئاب</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className={`p-6 rounded-lg border-2 ${getRiskBgColor(result.level)}`}>
            <div className="text-center">
              <div className={`text-3xl font-bold ${getRiskColor(result.level)} mb-2`}>
                {result.category}
              </div>
              <div className="text-lg text-gray-700">{result.details}</div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-gray-900">التوصيات للتعامل مع الاكتئاب:</h4>
            <ul className="space-y-2">
              {result.recommendations.map((rec, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-brand ml-2">•</span>
                  <span className="text-gray-700">{rec}</span>
                </li>
              ))}
            </ul>
          </div>

          {result.needsAttention && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 font-medium">
                🚨 يُنصح بشدة بالتحدث مع أخصائي الصحة النفسية في أقرب وقت ممكن
              </p>
            </div>
          )}

          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h5 className="font-bold text-blue-900 mb-2">استراتيجيات سريعة لتحسين المزاج:</h5>
            <ul className="text-blue-800 text-sm space-y-1">
              <li>• ممارسة 30 دقيقة من المشي يومياً</li>
              <li>• الحصول على 7-9 ساعات نوم منتظم</li>
              <li>• التواصل مع الأصدقاء والعائلة</li>
              <li>• ممارسة تقنيات الاسترخاء والتأمل</li>
              <li>• تناول وجبات متوازنة ومنتظمة</li>
            </ul>
          </div>

          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <h5 className="font-bold text-green-900 mb-2">خط المساعدة النفسية:</h5>
            <p className="text-green-800 text-sm">
              إذا كانت لديك أفكار إيذاء النفس، تواصل فوراً مع خط المساعدة النفسية أو توجه لأقرب مستشفى
            </p>
          </div>

          <Button 
            onClick={() => {
              setResult(null);
              setCurrentStep(0);
              setAnswers(new Array(9).fill(0));
            }} 
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
          <CardTitle className="text-xl text-right">اختبار تقييم أعراض الاكتئاب (PHQ-9)</CardTitle>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-brand h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
            />
          </div>
          <p className="text-sm text-gray-600">
            السؤال {currentStep + 1} من {questions.length}
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-6">
              خلال الأسبوعين الماضيين، كم مرة تم إزعاجك بواسطة:
            </h3>
            <p className="text-xl font-semibold text-brand mb-6">
              {questions[currentStep]}
            </p>

            <div className="space-y-3">
              {options.map((option) => (
                <Label
                  key={option.value}
                  className={`flex items-center space-x-3 space-x-reverse p-3 rounded-lg cursor-pointer transition-all ${
                    answers[currentStep] === option.value
                      ? 'bg-brand text-white'
                      : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
                  }`}
                  onClick={() => handleAnswerChange(option.value)}
                >
                  <input
                    type="radio"
                    name={`question-${currentStep}`}
                    value={option.value}
                    checked={answers[currentStep] === option.value}
                    onChange={() => handleAnswerChange(option.value)}
                    className="sr-only"
                  />
                  <span className="text-lg">{option.label}</span>
                </Label>
              ))}
            </div>
          </div>

          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
            >
              السابق
            </Button>
            <Button
              onClick={handleNext}
              className="bg-brand hover:bg-brand-dark"
            >
              {currentStep === questions.length - 1 ? 'عرض النتائج' : 'التالي'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DepressionTest;
