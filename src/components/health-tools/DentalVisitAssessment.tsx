
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { assessDentalVisitNeed } from '@/utils/healthCalculations';
import { DentalVisitResult } from '@/types/healthTools';

const DentalVisitAssessment = () => {
  const [formData, setFormData] = useState({
    severePain: '',
    swelling: '',
    trauma: '',
    bleeding: '',
    looseTooth: '',
    infection: '',
    sensitivity: '',
    badBreath: '',
    gumPain: '',
    staining: '',
    mildPain: '',
    tartar: ''
  });
  const [result, setResult] = useState<DentalVisitResult | null>(null);

  const questions = [
    { id: 'severePain', label: 'هل تعاني من ألم شديد في الأسنان؟', options: [
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
    const emptyFields = Object.values(formData).filter(value => !value);
    if (emptyFields.length > 0) {
      alert('يرجى الإجابة على جميع الأسئلة');
      return;
    }

    const assessment = assessDentalVisitNeed(formData);
    setResult(assessment);
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
      <Card className="border-2 border-brand/20">
        <CardHeader>
          <CardTitle className="text-xl text-center text-brand">تقييم الحاجة لزيارة طبيب الأسنان</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className={`p-6 rounded-lg border-2 ${getUrgencyBgColor(result.urgency)}`}>
            <div className="text-center">
              <div className={`text-3xl font-bold ${getUrgencyColor(result.urgency)} mb-2`}>
                {result.category}
              </div>
              <div className="text-lg text-gray-700">
                الإطار الزمني: {result.timeframe}
              </div>
            </div>
          </div>

          {result.firstAid && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <h5 className="font-bold text-red-900 mb-2">إسعافات أولية:</h5>
              <ul className="space-y-1">
                {result.firstAid.map((aid, index) => (
                  <li key={index} className="flex items-start text-red-800">
                    <span className="text-red-600 ml-2">•</span>
                    <span className="text-sm">{aid}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="space-y-3">
            <h4 className="font-bold text-gray-900">التوصيات:</h4>
            <ul className="space-y-2">
              {result.recommendations.map((rec, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-brand ml-2">•</span>
                  <span className="text-gray-700">{rec}</span>
                </li>
              ))}
            </ul>
          </div>

          <Button 
            onClick={() => setResult(null)} 
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
          <CardTitle className="text-xl text-right">هل تحتاج لزيارة طبيب الأسنان؟</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {questions.map((question) => (
            <div key={question.id} className="space-y-2">
              <Label className="text-right block font-medium">{question.label}</Label>
              <Select 
                value={formData[question.id as keyof typeof formData]} 
                onValueChange={(value) => setFormData({ ...formData, [question.id]: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="اختر إجابة" />
                </SelectTrigger>
                <SelectContent>
                  {question.options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}
          
          <Button onClick={handleSubmit} className="w-full bg-brand hover:bg-brand-dark">
            تقييم الحالة
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default DentalVisitAssessment;
