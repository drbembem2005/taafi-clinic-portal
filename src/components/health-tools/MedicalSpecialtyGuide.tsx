
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { assessMedicalSpecialty } from '@/utils/healthCalculations';
import { MedicalSpecialtyResult } from '@/types/healthTools';

const MedicalSpecialtyGuide = () => {
  const [formData, setFormData] = useState({
    primarySymptom: '',
    duration: '',
    severity: '',
    bodyPart: '',
    additionalSymptoms: '',
    age: '',
    medicalHistory: ''
  });
  const [result, setResult] = useState<MedicalSpecialtyResult | null>(null);

  const handleCalculate = () => {
    if (!formData.primarySymptom || !formData.duration || !formData.severity) {
      alert('يرجى إدخال الأعراض الأساسية والمدة والشدة على الأقل');
      return;
    }

    const calculatedResult = assessMedicalSpecialty(formData);
    setResult(calculatedResult);
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'emergency': return 'text-red-600';
      case 'high': return 'text-orange-600';
      case 'moderate': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getUrgencyBgColor = (urgency: string) => {
    switch (urgency) {
      case 'emergency': return 'bg-red-50 border-red-200';
      case 'high': return 'bg-orange-50 border-orange-200';
      case 'moderate': return 'bg-yellow-50 border-yellow-200';
      case 'low': return 'bg-green-50 border-green-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl text-right">مرشد التخصصات الطبية</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-right block">العرض الرئيسي</Label>
              <Select value={formData.primarySymptom} onValueChange={(value) => setFormData({ ...formData, primarySymptom: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر العرض الرئيسي" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pain">ألم</SelectItem>
                  <SelectItem value="fever">حمى</SelectItem>
                  <SelectItem value="breathing">صعوبة تنفس</SelectItem>
                  <SelectItem value="headache">صداع</SelectItem>
                  <SelectItem value="digestive">مشاكل هضمية</SelectItem>
                  <SelectItem value="skin">مشاكل جلدية</SelectItem>
                  <SelectItem value="vision">مشاكل بصرية</SelectItem>
                  <SelectItem value="hearing">مشاكل سمعية</SelectItem>
                  <SelectItem value="mental">أعراض نفسية</SelectItem>
                  <SelectItem value="other">أخرى</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-right block">مدة الأعراض</Label>
              <Select value={formData.duration} onValueChange={(value) => setFormData({ ...formData, duration: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="منذ متى بدأت الأعراض" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hours">ساعات قليلة</SelectItem>
                  <SelectItem value="days">أيام قليلة</SelectItem>
                  <SelectItem value="weeks">أسابيع</SelectItem>
                  <SelectItem value="months">أشهر</SelectItem>
                  <SelectItem value="chronic">مزمنة (أكثر من سنة)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-right block">شدة الأعراض</Label>
              <Select value={formData.severity} onValueChange={(value) => setFormData({ ...formData, severity: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="مستوى الألم أو الإزعاج" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mild">خفيف</SelectItem>
                  <SelectItem value="moderate">متوسط</SelectItem>
                  <SelectItem value="severe">شديد</SelectItem>
                  <SelectItem value="unbearable">لا يُحتمل</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-right block">المنطقة المصابة</Label>
              <Select value={formData.bodyPart} onValueChange={(value) => setFormData({ ...formData, bodyPart: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="أين تشعر بالأعراض" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="head">الرأس</SelectItem>
                  <SelectItem value="chest">الصدر</SelectItem>
                  <SelectItem value="abdomen">البطن</SelectItem>
                  <SelectItem value="back">الظهر</SelectItem>
                  <SelectItem value="extremities">الأطراف</SelectItem>
                  <SelectItem value="joints">المفاصل</SelectItem>
                  <SelectItem value="skin">الجلد</SelectItem>
                  <SelectItem value="general">عام في الجسم</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="additionalSymptoms" className="text-right block">أعراض إضافية</Label>
            <Textarea
              id="additionalSymptoms"
              placeholder="اذكر أي أعراض أخرى تشعر بها..."
              value={formData.additionalSymptoms}
              onChange={(e) => setFormData({ ...formData, additionalSymptoms: e.target.value })}
              className="text-right"
            />
          </div>

          <Button onClick={handleCalculate} className="w-full bg-brand hover:bg-brand-dark">
            احصل على التوجيه الطبي
          </Button>
        </CardContent>
      </Card>

      {result && (
        <Card className="border-2 border-brand/20">
          <CardHeader>
            <CardTitle className="text-xl text-center text-brand">التوجيه الطبي المناسب</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className={`p-6 rounded-lg border-2 ${getUrgencyBgColor(result.urgency)}`}>
              <div className="text-center">
                <div className={`text-2xl font-bold ${getUrgencyColor(result.urgency)} mb-2`}>
                  {result.recommendedSpecialty}
                </div>
                <div className="text-lg text-gray-700">{result.reasoning}</div>
              </div>
            </div>

            {result.urgency === 'emergency' && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 font-bold text-center">
                  🚨 حالة طارئة - توجه فوراً لأقرب مستشفى أو اتصل بالإسعاف
                </p>
              </div>
            )}

            <div className="space-y-3">
              <h4 className="font-bold text-gray-900">أسئلة مهمة للطبيب:</h4>
              <ul className="space-y-2">
                {result.questionsForDoctor.map((question, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-brand ml-2">❓</span>
                    <span className="text-gray-700">{question}</span>
                  </li>
                ))}
              </ul>
            </div>

            {result.firstAid && result.firstAid.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-bold text-gray-900">إسعافات أولية فورية:</h4>
                <ul className="space-y-2">
                  {result.firstAid.map((aid, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-red-600 ml-2">🩹</span>
                      <span className="text-gray-700">{aid}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h5 className="font-bold text-blue-900 mb-2">نصائح مهمة:</h5>
              <ul className="text-blue-800 text-sm space-y-1">
                <li>• هذا التوجيه للمساعدة فقط وليس تشخيصاً طبياً</li>
                <li>• احضر معك قائمة بالأدوية التي تتناولها</li>
                <li>• اكتب الأعراض ومتى بدأت</li>
                <li>• لا تتردد في طلب رأي ثانٍ إذا لزم الأمر</li>
              </ul>
            </div>

            <Button 
              onClick={() => setResult(null)} 
              className="w-full bg-brand hover:bg-brand-dark"
            >
              استشارة جديدة
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MedicalSpecialtyGuide;
