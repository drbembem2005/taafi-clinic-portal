
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { assessPregnancySymptoms } from '@/utils/healthCalculations';
import { PregnancySymptomsResult } from '@/types/healthTools';

const PregnancySymptomsChecker = () => {
  const [weeks, setWeeks] = useState('');
  const [symptoms, setSymptoms] = useState({
    severeBleeding: '',
    severePain: '',
    noMovement: '',
    bleeding: '',
    fever: '',
    severeHeadache: '',
    swelling: '',
    visionChanges: '',
    contractions: '',
    nausea: '',
    fatigue: '',
    backPain: ''
  });
  const [result, setResult] = useState<PregnancySymptomsResult | null>(null);

  const questions = [
    { id: 'severeBleeding', label: 'نزيف مهبلي شديد', emergency: true },
    { id: 'severePain', label: 'ألم شديد في البطن أو الحوض', emergency: true },
    { id: 'noMovement', label: 'عدم حركة الجنين لأكثر من 24 ساعة', emergency: true },
    { id: 'bleeding', label: 'نزيف مهبلي خفيف', warning: true },
    { id: 'fever', label: 'حمى أكثر من 38 درجة', warning: true },
    { id: 'severeHeadache', label: 'صداع شديد مستمر', warning: true },
    { id: 'swelling', label: 'تورم مفاجئ في الوجه أو اليدين', warning: true },
    { id: 'visionChanges', label: 'تغيرات في الرؤية', warning: true },
    { id: 'contractions', label: 'انقباضات منتظمة', warning: true },
    { id: 'nausea', label: 'غثيان وقيء', normal: true },
    { id: 'fatigue', label: 'تعب وإرهاق', normal: true },
    { id: 'backPain', label: 'ألم في الظهر', normal: true }
  ];

  const handleSubmit = () => {
    if (!weeks) {
      alert('يرجى إدخال أسبوع الحمل');
      return;
    }

    const assessment = assessPregnancySymptoms(symptoms, parseInt(weeks));
    setResult(assessment);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return 'text-green-600';
      case 'monitor': return 'text-yellow-600';
      case 'urgent': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case 'normal': return 'bg-green-50 border-green-200';
      case 'monitor': return 'bg-yellow-50 border-yellow-200';
      case 'urgent': return 'bg-red-50 border-red-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  if (result) {
    return (
      <Card className="border-2 border-brand/20">
        <CardHeader>
          <CardTitle className="text-xl text-center text-brand">تقييم أعراض الحمل</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className={`p-6 rounded-lg border-2 ${getStatusBgColor(result.status)}`}>
            <div className="text-center">
              <div className={`text-3xl font-bold ${getStatusColor(result.status)} mb-2`}>
                {result.category}
              </div>
            </div>
          </div>

          {result.warningSign && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 font-medium">
                🚨 تحتاجين رعاية طبية فورية
              </p>
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

          <div className="space-y-3">
            <h4 className="font-bold text-gray-900">الخطوات التالية:</h4>
            <ul className="space-y-2">
              {result.nextSteps.map((step, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-green-600 ml-2">•</span>
                  <span className="text-gray-700">{step}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h5 className="font-bold text-blue-900 mb-2">أعراض طبيعية في الحمل:</h5>
            <ul className="text-blue-800 text-sm space-y-1">
              <li>• غثيان وقيء (خاصة في الثلث الأول)</li>
              <li>• تعب وإرهاق</li>
              <li>• ألم خفيف في الظهر</li>
              <li>• تغيرات في الثدي</li>
              <li>• كثرة التبول</li>
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
          <CardTitle className="text-xl text-right">فاحص أعراض الحمل</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="weeks" className="text-right block">أسبوع الحمل الحالي</Label>
            <Input
              id="weeks"
              type="number"
              placeholder="20"
              value={weeks}
              onChange={(e) => setWeeks(e.target.value)}
              className="text-right"
              min="1"
              max="42"
            />
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-lg text-right">الأعراض التي تعانين منها:</h3>
            
            {questions.filter(q => q.emergency).length > 0 && (
              <div className="space-y-3">
                <h4 className="font-medium text-red-600">أعراض طارئة:</h4>
                {questions.filter(q => q.emergency).map((question) => (
                  <div key={question.id} className="space-y-2">
                    <Label className="text-right block">{question.label}</Label>
                    <Select 
                      value={symptoms[question.id as keyof typeof symptoms]} 
                      onValueChange={(value) => setSymptoms({ ...symptoms, [question.id]: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="اختر" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">نعم</SelectItem>
                        <SelectItem value="no">لا</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
            )}

            {questions.filter(q => q.warning).length > 0 && (
              <div className="space-y-3">
                <h4 className="font-medium text-yellow-600">أعراض تحتاج انتباه:</h4>
                {questions.filter(q => q.warning).map((question) => (
                  <div key={question.id} className="space-y-2">
                    <Label className="text-right block">{question.label}</Label>
                    <Select 
                      value={symptoms[question.id as keyof typeof symptoms]} 
                      onValueChange={(value) => setSymptoms({ ...symptoms, [question.id]: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="اختر" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">نعم</SelectItem>
                        <SelectItem value="no">لا</SelectItem>
                        {question.id === 'swelling' && (
                          <SelectItem value="sudden">تورم مفاجئ</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
            )}

            {questions.filter(q => q.normal).length > 0 && (
              <div className="space-y-3">
                <h4 className="font-medium text-green-600">أعراض طبيعية:</h4>
                {questions.filter(q => q.normal).map((question) => (
                  <div key={question.id} className="space-y-2">
                    <Label className="text-right block">{question.label}</Label>
                    <Select 
                      value={symptoms[question.id as keyof typeof symptoms]} 
                      onValueChange={(value) => setSymptoms({ ...symptoms, [question.id]: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="اختر" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">نعم</SelectItem>
                        <SelectItem value="no">لا</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <Button onClick={handleSubmit} className="w-full bg-brand hover:bg-brand-dark">
            تقييم الأعراض
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default PregnancySymptomsChecker;
