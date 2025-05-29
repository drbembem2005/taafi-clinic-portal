
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { calculateHeartRate } from '@/utils/healthCalculations';
import { HeartRateResult } from '@/types/healthTools';

const HeartRateCalculator = () => {
  const [formData, setFormData] = useState({
    age: '',
    fitnessLevel: '',
    restingHR: '',
    medications: ''
  });
  const [result, setResult] = useState<HeartRateResult | null>(null);

  const handleCalculate = () => {
    if (!formData.age || !formData.fitnessLevel) {
      alert('يرجى إدخال العمر ومستوى اللياقة على الأقل');
      return;
    }

    const calculatedResult = calculateHeartRate(
      parseInt(formData.age),
      formData.fitnessLevel,
      formData.restingHR ? parseInt(formData.restingHR) : undefined,
      formData.medications
    );

    setResult(calculatedResult);
  };

  const getZoneColor = (zone: string) => {
    switch (zone) {
      case 'fatBurn': return 'bg-green-100 border-green-300 text-green-800';
      case 'cardio': return 'bg-yellow-100 border-yellow-300 text-yellow-800';
      case 'peak': return 'bg-red-100 border-red-300 text-red-800';
      default: return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl text-right">حاسبة معدل النبض المستهدف</CardTitle>
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
              <Label htmlFor="restingHR" className="text-right block">معدل النبض أثناء الراحة (اختياري)</Label>
              <Input
                id="restingHR"
                type="number"
                placeholder="70"
                value={formData.restingHR}
                onChange={(e) => setFormData({ ...formData, restingHR: e.target.value })}
                className="text-right"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-right block">مستوى اللياقة البدنية</Label>
              <Select value={formData.fitnessLevel} onValueChange={(value) => setFormData({ ...formData, fitnessLevel: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر مستوى اللياقة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">مبتدئ</SelectItem>
                  <SelectItem value="intermediate">متوسط</SelectItem>
                  <SelectItem value="advanced">متقدم</SelectItem>
                  <SelectItem value="athlete">رياضي</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-right block">الأدوية المؤثرة على القلب</Label>
              <Select value={formData.medications} onValueChange={(value) => setFormData({ ...formData, medications: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر إذا كان ينطبق" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">لا يوجد</SelectItem>
                  <SelectItem value="betaBlockers">حاصرات بيتا</SelectItem>
                  <SelectItem value="stimulants">منشطات</SelectItem>
                  <SelectItem value="other">أدوية أخرى</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button onClick={handleCalculate} className="w-full bg-brand hover:bg-brand-dark">
            احسب معدل النبض المستهدف
          </Button>
        </CardContent>
      </Card>

      {result && (
        <Card className="border-2 border-brand/20">
          <CardHeader>
            <CardTitle className="text-xl text-center text-brand">مناطق معدل النبض المستهدف</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className={`p-4 rounded-lg border-2 ${getZoneColor('fatBurn')}`}>
                <h4 className="font-bold mb-2">منطقة حرق الدهون (50-70%)</h4>
                <div className="text-2xl font-bold">
                  {result.targetZones.fatBurn.min} - {result.targetZones.fatBurn.max} نبضة/دقيقة
                </div>
                <p className="text-sm mt-2">مثالية للمبتدئين وحرق الدهون</p>
              </div>

              <div className={`p-4 rounded-lg border-2 ${getZoneColor('cardio')}`}>
                <h4 className="font-bold mb-2">المنطقة القلبية (70-85%)</h4>
                <div className="text-2xl font-bold">
                  {result.targetZones.cardio.min} - {result.targetZones.cardio.max} نبضة/دقيقة
                </div>
                <p className="text-sm mt-2">لتحسين اللياقة القلبية والتحمل</p>
              </div>

              <div className={`p-4 rounded-lg border-2 ${getZoneColor('peak')}`}>
                <h4 className="font-bold mb-2">المنطقة القصوى (85-95%)</h4>
                <div className="text-2xl font-bold">
                  {result.targetZones.peak.min} - {result.targetZones.peak.max} نبضة/دقيقة
                </div>
                <p className="text-sm mt-2">للرياضيين المتقدمين والتدريب المكثف</p>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-bold text-gray-900">تقييم معدل النبض والتوصيات:</h4>
              <ul className="space-y-2">
                {result.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-brand ml-2">•</span>
                    <span className="text-gray-700">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h5 className="font-bold text-blue-900 mb-2">نصائح لقياس معدل النبض:</h5>
              <ul className="text-blue-800 text-sm space-y-1">
                <li>• اقس معدل النبض أثناء الراحة صباحاً قبل النهوض من السرير</li>
                <li>• استخدم إصبعي السبابة والوسطى على المعصم أو الرقبة</li>
                <li>• اعد لمدة 15 ثانية واضرب في 4 للحصول على المعدل بالدقيقة</li>
                <li>• تجنب القياس بعد الأكل أو ممارسة الرياضة مباشرة</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default HeartRateCalculator;
