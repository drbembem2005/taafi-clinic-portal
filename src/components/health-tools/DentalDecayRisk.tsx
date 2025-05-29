
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { assessDentalDecayRisk } from '@/utils/healthCalculations';
import { DentalResult } from '@/types/healthTools';

const DentalDecayRisk = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: any }>({});
  const [result, setResult] = useState<DentalResult | null>(null);

  const questions = [
    {
      id: 'brushingFrequency',
      question: 'كم مرة تنظف أسنانك يومياً؟',
      options: [
        { value: 'never', label: 'لا أنظفها' },
        { value: 'once', label: 'مرة واحدة' },
        { value: 'twice', label: 'مرتين' },
        { value: 'moreThanTwice', label: 'أكثر من مرتين' }
      ]
    },
    {
      id: 'flossing',
      question: 'هل تستخدم خيط الأسنان؟',
      options: [
        { value: 'never', label: 'أبداً' },
        { value: 'sometimes', label: 'أحياناً' },
        { value: 'regularly', label: 'بانتظام يومياً' }
      ]
    },
    {
      id: 'sugarIntake',
      question: 'كم مرة تتناول الحلويات أو المشروبات السكرية يومياً؟',
      options: [
        { value: 'rarely', label: 'نادراً أو لا أتناولها' },
        { value: 'once', label: 'مرة واحدة' },
        { value: 'twiceThree', label: '2-3 مرات' },
        { value: 'moreThanThree', label: 'أكثر من 3 مرات' }
      ]
    },
    {
      id: 'dentalVisits',
      question: 'متى كانت آخر زيارة لطبيب الأسنان؟',
      options: [
        { value: 'sixMonths', label: 'خلال آخر 6 أشهر' },
        { value: 'year', label: 'خلال آخر سنة' },
        { value: 'twoYears', label: 'خلال آخر سنتين' },
        { value: 'moreThanTwo', label: 'أكثر من سنتين أو لم أزر قط' }
      ]
    },
    {
      id: 'fluoride',
      question: 'هل تستخدم معجون أسنان يحتوي على الفلورايد؟',
      options: [
        { value: 'yes', label: 'نعم' },
        { value: 'no', label: 'لا' },
        { value: 'dontKnow', label: 'لا أعرف' }
      ]
    },
    {
      id: 'dryMouth',
      question: 'هل تعاني من جفاف الفم بشكل متكرر؟',
      options: [
        { value: 'no', label: 'لا' },
        { value: 'sometimes', label: 'أحياناً' },
        { value: 'often', label: 'غالباً' }
      ]
    },
    {
      id: 'previousCavities',
      question: 'هل سبق أن أصبت بتسوس في الأسنان؟',
      options: [
        { value: 'never', label: 'لم أصب قط' },
        { value: 'few', label: 'عدد قليل (1-3)' },
        { value: 'several', label: 'عدد متوسط (4-6)' },
        { value: 'many', label: 'عدد كثير (أكثر من 6)' }
      ]
    },
    {
      id: 'smoking',
      question: 'هل تدخن أو تستخدم منتجات التبغ؟',
      options: [
        { value: 'no', label: 'لا' },
        { value: 'occasionally', label: 'أحياناً' },
        { value: 'regularly', label: 'بانتظام' }
      ]
    }
  ];

  const handleAnswerChange = (questionId: string, value: any) => {
    setAnswers({ ...answers, [questionId]: value });
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      calculateRisk();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const calculateRisk = () => {
    const assessment = assessDentalDecayRisk(answers);
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
          <CardTitle className="text-xl text-center text-brand">نتائج تقييم مخاطر تسوس الأسنان</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className={`p-6 rounded-lg border-2 ${getRiskBgColor(result.riskLevel)}`}>
            <div className="text-center">
              <div className={`text-3xl font-bold ${getRiskColor(result.riskLevel)} mb-2`}>
                {result.category}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-gray-900">توصيات العناية بالأسنان:</h4>
            <ul className="space-y-2">
              {result.recommendations.map((rec, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-brand ml-2">•</span>
                  <span className="text-gray-700">{rec}</span>
                </li>
              ))}
            </ul>
          </div>

          {result.warningSign && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 font-medium">
                🚨 يُنصح بزيارة طبيب الأسنان في أقرب وقت ممكن
              </p>
            </div>
          )}

          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h5 className="font-bold text-blue-900 mb-2">نصائح سريعة للوقاية:</h5>
            <ul className="text-blue-800 text-sm space-y-1">
              <li>• نظف أسنانك مرتين يومياً بمعجون يحتوي على الفلورايد</li>
              <li>• استخدم خيط الأسنان يومياً</li>
              <li>• قلل من السكريات والمشروبات الغازية</li>
              <li>• زر طبيب الأسنان كل 6 أشهر</li>
            </ul>
          </div>

          <Button 
            onClick={() => {
              setResult(null);
              setCurrentStep(0);
              setAnswers({});
            }} 
            className="w-full bg-brand hover:bg-brand-dark"
          >
            إعادة التقييم
          </Button>
        </CardContent>
      </Card>
    );
  }

  const currentQuestion = questions[currentStep];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl text-right">اختبار خطر تسوس الأسنان</CardTitle>
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
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {currentQuestion.question}
            </h3>

            <Select 
              value={answers[currentQuestion.id]?.toString()} 
              onValueChange={(value) => handleAnswerChange(currentQuestion.id, value)}
            >
              <SelectTrigger className="text-lg">
                <SelectValue placeholder="اختر إجابتك" />
              </SelectTrigger>
              <SelectContent>
                {currentQuestion.options?.map((option, index) => (
                  <SelectItem key={index} value={option.value.toString()}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
              disabled={!answers[currentQuestion.id]}
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

export default DentalDecayRisk;
