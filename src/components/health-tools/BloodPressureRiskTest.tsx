
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { assessBloodPressureRisk } from '@/utils/healthCalculations';
import { BloodPressureRiskResult } from '@/types/healthTools';

const BloodPressureRiskTest = () => {
  const [formData, setFormData] = useState({
    age: '',
    familyHistory: '',
    smoking: '',
    alcohol: '',
    bmi: '',
    exercise: '',
    diabetes: '',
    kidney: '',
    stress: '',
    saltIntake: ''
  });
  const [result, setResult] = useState<BloodPressureRiskResult | null>(null);

  const handleSubmit = () => {
    if (!formData.age || !formData.bmi) {
      alert('يرجى إدخال العمر ومؤشر كتلة الجسم');
      return;
    }

    const processedData = {
      ...formData,
      age: parseInt(formData.age),
      bmi: parseFloat(formData.bmi)
    };

    const assessment = assessBloodPressureRisk(processedData);
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
          <CardTitle className="text-xl text-center text-brand">تقييم مخاطر ارتفاع ضغط الدم</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className={`p-6 rounded-lg border-2 ${getRiskBgColor(result.riskLevel)}`}>
            <div className="text-center">
              <div className={`text-3xl font-bold ${getRiskColor(result.riskLevel)} mb-2`}>
                {result.category}
              </div>
            </div>
          </div>

          {result.needsAttention && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 font-medium">
                🚨 ينصح بمراجعة الطبيب لفحص ضغط الدم بانتظام
              </p>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-bold text-gray-900">التوصيات الطبية:</h4>
              <ul className="space-y-2">
                {result.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-brand ml-2">•</span>
                    <span className="text-gray-700 text-sm">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="font-bold text-gray-900">تغييرات نمط الحياة:</h4>
              <ul className="space-y-2">
                {result.lifestyle.map((lifestyle, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-green-600 ml-2">•</span>
                    <span className="text-gray-700 text-sm">{lifestyle}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h5 className="font-bold text-blue-900 mb-2">قيم ضغط الدم الطبيعية:</h5>
            <div className="grid grid-cols-2 gap-4 text-sm text-blue-800">
              <div>الطبيعي: أقل من 120/80</div>
              <div>مرتفع قليلاً: 120-129/أقل من 80</div>
              <div>المرحلة الأولى: 130-139/80-89</div>
              <div>المرحلة الثانية: 140/90 أو أكثر</div>
            </div>
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
          <CardTitle className="text-xl text-right">اختبار خطر ارتفاع ضغط الدم</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="age" className="text-right block">العمر</Label>
              <Input
                id="age"
                type="number"
                placeholder="30"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                className="text-right"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bmi" className="text-right block">مؤشر كتلة الجسم</Label>
              <Input
                id="bmi"
                type="number"
                step="0.1"
                placeholder="25.0"
                value={formData.bmi}
                onChange={(e) => setFormData({ ...formData, bmi: e.target.value })}
                className="text-right"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-right block">التاريخ العائلي لارتفاع ضغط الدم</Label>
              <Select value={formData.familyHistory} onValueChange={(value) => setFormData({ ...formData, familyHistory: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">نعم</SelectItem>
                  <SelectItem value="no">لا</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-right block">التدخين</Label>
              <Select value={formData.smoking} onValueChange={(value) => setFormData({ ...formData, smoking: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">أدخن</SelectItem>
                  <SelectItem value="no">لا أدخن</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-right block">شرب الكحول</Label>
              <Select value={formData.alcohol} onValueChange={(value) => setFormData({ ...formData, alcohol: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="never">لا أشرب</SelectItem>
                  <SelectItem value="light">خفيف</SelectItem>
                  <SelectItem value="moderate">متوسط</SelectItem>
                  <SelectItem value="heavy">كثير</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-right block">ممارسة الرياضة</Label>
              <Select value={formData.exercise} onValueChange={(value) => setFormData({ ...formData, exercise: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="regular">منتظم (3+ مرات أسبوعياً)</SelectItem>
                  <SelectItem value="sometimes">أحياناً</SelectItem>
                  <SelectItem value="rarely">نادراً</SelectItem>
                  <SelectItem value="never">لا أمارس</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-right block">مرض السكري</Label>
              <Select value={formData.diabetes} onValueChange={(value) => setFormData({ ...formData, diabetes: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">نعم</SelectItem>
                  <SelectItem value="no">لا</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-right block">أمراض الكلى</Label>
              <Select value={formData.kidney} onValueChange={(value) => setFormData({ ...formData, kidney: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">نعم</SelectItem>
                  <SelectItem value="no">لا</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-right block">مستوى التوتر</Label>
              <Select value={formData.stress} onValueChange={(value) => setFormData({ ...formData, stress: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">منخفض</SelectItem>
                  <SelectItem value="moderate">متوسط</SelectItem>
                  <SelectItem value="high">عالي</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-right block">تناول الملح</Label>
              <Select value={formData.saltIntake} onValueChange={(value) => setFormData({ ...formData, saltIntake: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">قليل</SelectItem>
                  <SelectItem value="moderate">متوسط</SelectItem>
                  <SelectItem value="high">كثير</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Button onClick={handleSubmit} className="w-full bg-brand hover:bg-brand-dark">
            تقييم المخاطر
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default BloodPressureRiskTest;
