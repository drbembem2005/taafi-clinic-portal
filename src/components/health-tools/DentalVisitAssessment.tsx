
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { assessDentalVisitNeed } from '@/utils/healthCalculations';
import { DentalVisitResult } from '@/types/healthTools';
import { AlertCircle, CheckCircle2, Clock, Zap } from 'lucide-react';

const DentalVisitAssessment = () => {
  const [formData, setFormData] = useState({
    severePain: '',
    swelling: '',
    trauma: '',
    bleeding: '',
    looseTooth: '',
    infection: '',
    sensitivity: '',
    badBreath: ''
  });
  const [result, setResult] = useState<DentalVisitResult | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const resultRef = useRef<HTMLDivElement>(null);

  const questions = [
    { id: 'severePain', label: 'هل يوجد تورم في الوجه أو اللثة؟', options: [
      { value: 'yes', label: 'نعم' },
      { value: 'no', label: 'لا' }
    ]},
    { id: 'swelling', label: 'هل يوجد تورم في الوجه أو اللثة؟', options: [
      { value: 'yes', label: 'نعم' },
      { value: 'no', label: 'لا' }
    ]},
    { id: 'trauma', label: 'هل تعرضت لإصابة في الأسنان مؤخراً؟', options: [
      { value: 'yes', label: 'نعم' },
      { value: 'no', label: 'لا' }
    ]},
    { id: 'bleeding', label: 'هل تنزف لثتك؟', options: [
      { value: 'persistent', label: 'نزيف مستمر' },
      { value: 'occasional', label: 'نزيف أحياناً' },
      { value: 'no', label: 'لا يوجد نزيف' }
    ]},
    { id: 'looseTooth', label: 'هل لديك سن متحرك؟', options: [
      { value: 'yes', label: 'نعم' },
      { value: 'no', label: 'لا' }
    ]},
    { id: 'infection', label: 'هل تشك في وجود التهاب أو خراج؟', options: [
      { value: 'yes', label: 'نعم' },
      { value: 'no', label: 'لا' }
    ]},
    { id: 'sensitivity', label: 'هل تعاني من حساسية الأسنان؟', options: [
      { value: 'severe', label: 'حساسية شديدة' },
      { value: 'mild', label: 'حساسية خفيفة' },
      { value: 'no', label: 'لا توجد حساسية' }
    ]},
    { id: 'badBreath', label: 'هل تعاني من رائحة فم كريهة؟', options: [
      { value: 'persistent', label: 'رائحة مستمرة' },
      { value: 'occasional', label: 'أحياناً' },
      { value: 'no', label: 'لا' }
    ]}
  ];

  const handleSubmit = () => {
    const newErrors: string[] = [];
    
    // Check each required field with proper typing
    Object.keys(formData).forEach(key => {
      const fieldKey = key as keyof typeof formData;
      if (!formData[fieldKey] || formData[fieldKey] === '') {
        const question = questions.find(q => q.id === key);
        if (question) {
          newErrors.push(`يرجى الإجابة على: ${question.label}`);
        }
      }
    });

    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors([]);
    const assessment = assessDentalVisitNeed(formData);
    setResult(assessment);
    
    // Auto-scroll to result
    setTimeout(() => {
      resultRef.current?.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }, 100);
  };

  const getUrgencyIcon = (urgency: string) => {
    switch (urgency) {
      case 'routine': return <CheckCircle2 className="h-6 w-6" />;
      case 'soon': return <Clock className="h-6 w-6" />;
      case 'urgent': return <AlertCircle className="h-6 w-6" />;
      case 'emergency': return <Zap className="h-6 w-6" />;
      default: return <CheckCircle2 className="h-6 w-6" />;
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'routine': return 'text-green-600';
      case 'soon': return 'text-yellow-600';
      case 'urgent': return 'text-orange-600';
      case 'emergency': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getUrgencyBgColor = (urgency: string) => {
    switch (urgency) {
      case 'routine': return 'bg-green-50 border-green-200';
      case 'soon': return 'bg-yellow-50 border-yellow-200';
      case 'urgent': return 'bg-orange-50 border-orange-200';
      case 'emergency': return 'bg-red-50 border-red-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  if (result) {
    return (
      <div ref={resultRef} className="space-y-6">
        <Card className="border-2 border-brand/20 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-brand/5 to-brand/10">
            <CardTitle className="text-xl text-center text-brand flex items-center justify-center gap-2">
              {getUrgencyIcon(result.urgency)}
              تقييم الحاجة لزيارة طبيب الأسنان
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            <div className={`p-6 rounded-xl border-2 ${getUrgencyBgColor(result.urgency)} shadow-sm`}>
              <div className="text-center">
                <div className={`text-3xl font-bold ${getUrgencyColor(result.urgency)} mb-3 flex items-center justify-center gap-2`}>
                  {getUrgencyIcon(result.urgency)}
                  {result.category}
                </div>
                <div className="text-lg text-gray-700 font-medium">
                  الإطار الزمني: {result.timeframe}
                </div>
              </div>
            </div>

            {result.firstAid && (
              <div className="p-6 bg-red-50 border-2 border-red-200 rounded-xl shadow-sm">
                <h5 className="font-bold text-red-900 mb-3 flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  إسعافات أولية:
                </h5>
                <ul className="space-y-2">
                  {result.firstAid.map((aid, index) => (
                    <li key={index} className="flex items-start text-red-800">
                      <span className="text-red-600 ml-2 mt-1 font-bold">•</span>
                      <span className="text-sm leading-relaxed">{aid}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="space-y-4">
              <h4 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-brand" />
                التوصيات:
              </h4>
              <ul className="space-y-3">
                {result.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start bg-gray-50 p-3 rounded-lg">
                    <span className="text-brand ml-2 mt-1 font-bold">•</span>
                    <span className="text-gray-700 leading-relaxed">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Button 
              onClick={() => setResult(null)} 
              className="w-full bg-brand hover:bg-brand-dark text-white py-4 rounded-xl font-medium text-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              إعادة التقييم
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <Card className="shadow-xl border-0">
        <CardHeader className="bg-gradient-to-r from-brand/5 to-brand/10 rounded-t-lg">
          <CardTitle className="text-xl text-right text-brand">هل تحتاج لزيارة طبيب الأسنان؟</CardTitle>
          <p className="text-sm text-gray-600 text-right leading-relaxed">
            أجب على الأسئلة التالية لتحديد مدى إلحاح حاجتك لزيارة طبيب الأسنان
          </p>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          {errors.length > 0 && (
            <div className="p-4 bg-red-50 border-2 border-red-200 rounded-xl shadow-sm">
              <h5 className="font-bold text-red-900 mb-3 flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                يرجى إكمال البيانات المطلوبة:
              </h5>
              <ul className="space-y-2">
                {errors.map((error, index) => (
                  <li key={index} className="text-red-800 text-sm flex items-start">
                    <span className="text-red-600 ml-2 mt-1">•</span>
                    {error}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {questions.map((question) => (
            <div key={question.id} className="space-y-3 p-4 bg-gray-50 rounded-xl">
              <Label className="text-right block font-medium text-base text-gray-800">
                {question.label}
              </Label>
              <Select 
                value={formData[question.id as keyof typeof formData]} 
                onValueChange={(value) => setFormData({ ...formData, [question.id]: value })}
              >
                <SelectTrigger className="text-right h-12 border-2 border-gray-200 focus:border-brand">
                  <SelectValue placeholder="اختر إجابة" />
                </SelectTrigger>
                <SelectContent>
                  {question.options.map((option) => (
                    <SelectItem key={option.value} value={option.value} className="text-right">
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}
          
          <Button 
            onClick={handleSubmit} 
            className="w-full bg-brand hover:bg-brand-dark text-white py-4 rounded-xl font-medium text-lg shadow-lg hover:shadow-xl transition-all duration-300 mt-8"
          >
            تقييم الحالة
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default DentalVisitAssessment;
