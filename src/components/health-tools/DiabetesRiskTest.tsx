
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { assessDiabetesRisk } from '@/utils/healthCalculations';
import { HealthToolResult } from '@/types/healthTools';

const DiabetesRiskTest = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: any }>({});
  const [result, setResult] = useState<HealthToolResult | null>(null);

  const questions = [
    {
      id: 'age',
      question: 'كم عمرك؟',
      type: 'number',
      placeholder: 'العمر بالسنوات'
    },
    {
      id: 'bmi',
      question: 'ما هو مؤشر كتلة الجسم تقريباً؟ (إذا كنت لا تعرف، يمكنك تقدير وزنك)',
      type: 'select',
      options: [
        { value: 22, label: 'أقل من 25 (وزن طبيعي)' },
        { value: 27.5, label: '25-30 (زيادة في الوزن)' },
        { value: 32, label: 'أكثر من 30 (سمنة)' }
      ]
    },
    {
      id: 'familyHistory',
      question: 'هل يوجد تاريخ عائلي لمرض السكري؟',
      type: 'select',
      options: [
        { value: false, label: 'لا يوجد' },
        { value: true, label: 'نعم، في الأقارب من الدرجة الأولى' }
      ]
    },
    {
      id: 'physicalActivity',
      question: 'هل تمارس نشاطاً بدنياً منتظماً؟',
      type: 'select',
      options: [
        { value: true, label: 'نعم، أكثر من 150 دقيقة أسبوعياً' },
        { value: false, label: 'لا، أقل من 150 دقيقة أسبوعياً' }
      ]
    },
    {
      id: 'previousHighBloodSugar',
      question: 'هل سبق أن أظهرت فحوصاتك ارتفاعاً في مستوى السكر؟',
      type: 'select',
      options: [
        { value: false, label: 'لا، دائماً طبيعي' },
        { value: true, label: 'نعم، مرة أو أكثر' }
      ]
    },
    {
      id: 'highBloodPressure',
      question: 'هل تعاني من ارتفاع ضغط الدم؟',
      type: 'select',
      options: [
        { value: false, label: 'لا' },
        { value: true, label: 'نعم، أو أتناول أدوية لضغط الدم' }
      ]
    },
    {
      id: 'waistCircumference',
      question: 'ما هو محيط الخصر تقريباً؟',
      type: 'select',
      options: [
        { value: false, label: 'أقل من 94 سم (رجال) أو 80 سم (نساء)' },
        { value: true, label: 'أكثر من 94 سم (رجال) أو 80 سم (نساء)' }
      ]
    },
    {
      id: 'gestationalDiabetes',
      question: '(للنساء) هل أصبت بسكري الحمل من قبل؟',
      type: 'select',
      options: [
        { value: false, label: 'لا ينطبق / لا' },
        { value: true, label: 'نعم' }
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
    const assessment = assessDiabetesRisk(answers);
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
          <CardTitle className="text-xl text-center text-brand">نتائج تقييم مخاطر السكري</CardTitle>
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
            <h4 className="font-bold text-gray-900">التوصيات الشخصية:</h4>
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
                🚨 يُنصح بمراجعة طبيب مختص في أقرب وقت ممكن
              </p>
            </div>
          )}

          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h5 className="font-bold text-blue-900 mb-2">معلومات مهمة:</h5>
            <ul className="text-blue-800 text-sm space-y-1">
              <li>• هذا التقييم مبني على عوامل الخطر المعروفة علمياً</li>
              <li>• النتيجة لا تشخص مرض السكري وإنما تقدر احتمالية الإصابة</li>
              <li>• للتشخيص الدقيق، يجب إجراء فحوصات طبية مختصة</li>
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
          <CardTitle className="text-xl text-right">اختبار خطر الإصابة بالسكري من النوع الثاني</CardTitle>
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

            {currentQuestion.type === 'number' && (
              <div className="space-y-2">
                <Input
                  type="number"
                  placeholder={currentQuestion.placeholder}
                  value={answers[currentQuestion.id] || ''}
                  onChange={(e) => handleAnswerChange(currentQuestion.id, parseInt(e.target.value))}
                  className="text-center text-lg"
                />
              </div>
            )}

            {currentQuestion.type === 'select' && (
              <Select 
                value={answers[currentQuestion.id]?.toString()} 
                onValueChange={(value) => handleAnswerChange(currentQuestion.id, value === 'true' ? true : value === 'false' ? false : parseFloat(value))}
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
            )}
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

export default DiabetesRiskTest;
