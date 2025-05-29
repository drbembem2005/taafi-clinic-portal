
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { assessAnxiety } from '@/utils/healthCalculations';
import { AnxietyResult } from '@/types/healthTools';

const AnxietyTest = () => {
  const [answers, setAnswers] = useState<number[]>(new Array(7).fill(-1));
  const [result, setResult] = useState<AnxietyResult | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const questions = [
    'هل تشعر بالقلق أو التوتر بشكل مستمر؟',
    'هل تجد صعوبة في التحكم في مشاعر القلق؟',
    'هل تقلق بشأن أشياء مختلفة أكثر من اللازم؟',
    'هل تجد صعوبة في الاسترخاء؟',
    'هل تشعر بالانزعاج لدرجة يصعب معها الجلوس بهدوء؟',
    'هل تصبح منزعجاً أو غاضباً بسهولة؟',
    'هل تشعر بالخوف كما لو أن شيئاً فظيعاً قد يحدث؟'
  ];

  const options = [
    { value: 0, label: 'لا على الإطلاق' },
    { value: 1, label: 'عدة أيام' },
    { value: 2, label: 'أكثر من نصف الأيام' },
    { value: 3, label: 'تقريباً كل يوم' }
  ];

  const handleAnswerChange = (questionIndex: number, value: number) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = value;
    setAnswers(newAnswers);
  };

  const handleSubmit = () => {
    if (answers.some(answer => answer === -1)) {
      alert('يرجى الإجابة على جميع الأسئلة');
      return;
    }

    const assessment = assessAnxiety(answers);
    setResult(assessment);
    
    // Auto-scroll to result
    setTimeout(() => {
      resultRef.current?.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }, 100);
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-600';
      case 'moderate': return 'text-yellow-600';
      case 'high': return 'text-orange-600';
      case 'very-high': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getLevelBgColor = (level: string) => {
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
      <div ref={resultRef} className="space-y-6">
        <Card className="border-2 border-brand/20">
          <CardHeader>
            <CardTitle className="text-xl text-center text-brand">نتائج اختبار القلق</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className={`p-4 md:p-6 rounded-lg border-2 ${getLevelBgColor(result.level)}`}>
              <div className="text-center">
                <div className={`text-2xl md:text-3xl font-bold ${getLevelColor(result.level)} mb-2`}>
                  النتيجة: {result.score}/21
                </div>
                <div className="text-lg md:text-xl text-gray-700 font-medium">
                  {result.category}
                </div>
                <div className="text-sm md:text-base text-gray-600 mt-2">
                  {result.details}
                </div>
              </div>
            </div>

            {result.needsAttention && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 font-medium text-center">
                  ⚠️ يُنصح بالتحدث مع أخصائي نفسي للحصول على الدعم المناسب
                </p>
              </div>
            )}

            <div className="space-y-3">
              <h4 className="font-bold text-gray-900">التوصيات المخصصة:</h4>
              <ul className="space-y-2">
                {result.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-brand ml-2 mt-1">•</span>
                    <span className="text-gray-700 text-sm md:text-base">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Button 
              onClick={() => setResult(null)} 
              className="w-full bg-brand hover:bg-brand-dark"
            >
              إعادة الاختبار
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg md:text-xl text-right">اختبار مستوى القلق</CardTitle>
          <p className="text-sm text-gray-600 text-right">
            خلال الأسبوعين الماضيين، كم مرة انزعجت من المشاكل التالية؟
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {questions.map((question, index) => (
            <div key={index} className="space-y-3">
              <Label className="text-right block font-medium text-sm md:text-base">
                {index + 1}. {question}
              </Label>
              <RadioGroup
                value={answers[index]?.toString()}
                onValueChange={(value) => handleAnswerChange(index, parseInt(value))}
                className="space-y-2"
              >
                {options.map((option) => (
                  <div key={option.value} className="flex items-center space-x-2 space-x-reverse">
                    <RadioGroupItem value={option.value.toString()} id={`q${index}-${option.value}`} />
                    <Label htmlFor={`q${index}-${option.value}`} className="text-sm md:text-base">
                      {option.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          ))}

          <Button 
            onClick={handleSubmit} 
            className="w-full bg-brand hover:bg-brand-dark mt-6"
            disabled={answers.some(answer => answer === -1)}
          >
            عرض النتائج
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnxietyTest;
