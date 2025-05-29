
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { assessAnxiety } from '@/utils/healthCalculations';
import { HealthToolResult } from '@/types/healthTools';

const AnxietyTest = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>(new Array(7).fill(0));
  const [result, setResult] = useState<HealthToolResult | null>(null);

  const questions = [
    'الشعور بالعصبية أو القلق أو التوتر',
    'عدم القدرة على التوقف عن القلق أو السيطرة عليه',
    'القلق المفرط حول أشياء مختلفة',
    'صعوبة في الاسترخاء',
    'الشعور بالضيق لدرجة صعوبة البقاء ساكناً',
    'سهولة الانزعاج أو التهيج',
    'الشعور بالخوف كما لو أن شيئاً فظيعاً قد يحدث'
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
    const assessment = assessAnxiety(answers);
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
          <CardTitle className="text-xl text-center text-brand">نتائج تقييم القلق</CardTitle>
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
            <h4 className="font-bold text-gray-900">التوصيات للتعامل مع القلق:</h4>
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
                🚨 يُنصح بالتحدث مع أخصائي الصحة النفسية
              </p>
            </div>
          )}

          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h5 className="font-bold text-blue-900 mb-2">تقنيات سريعة للتهدئة:</h5>
            <ul className="text-blue-800 text-sm space-y-1">
              <li>• تنفس عميق: 4 ثوانِ شهيق، 4 ثوانِ حبس، 4 ثوانِ زفير</li>
              <li>• تقنية 5-4-3-2-1: حدد 5 أشياء تراها، 4 تسمعها، 3 تلمسها، 2 تشمها، 1 تتذوقه</li>
              <li>• التأمل لـ 10 دقائق يومياً</li>
              <li>• المشي في الطبيعة أو ممارسة رياضة خفيفة</li>
            </ul>
          </div>

          <Button 
            onClick={() => {
              setResult(null);
              setCurrentStep(0);
              setAnswers(new Array(7).fill(0));
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
          <CardTitle className="text-xl text-right">اختبار تقييم القلق (GAD-7)</CardTitle>
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

export default AnxietyTest;
