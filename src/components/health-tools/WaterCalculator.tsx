
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { calculateWaterNeeds } from '@/utils/healthCalculations';
import { WaterResult } from '@/types/healthTools';

const WaterCalculator = () => {
  const [formData, setFormData] = useState({
    weight: '',
    age: '',
    activityLevel: '',
    climate: '',
    pregnancy: '',
    medicalConditions: ''
  });
  const [result, setResult] = useState<WaterResult | null>(null);

  const handleCalculate = () => {
    if (!formData.weight || !formData.age || !formData.activityLevel || !formData.climate) {
      alert('يرجى إدخال جميع البيانات المطلوبة');
      return;
    }

    const calculatedResult = calculateWaterNeeds(
      parseFloat(formData.weight),
      parseInt(formData.age),
      formData.activityLevel,
      formData.climate,
      formData.pregnancy,
      formData.medicalConditions
    );

    setResult(calculatedResult);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl text-right">حاسبة احتياج الماء اليومي الذكية</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="weight" className="text-right block">الوزن (كيلوغرام)</Label>
              <Input
                id="weight"
                type="number"
                placeholder="70"
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                className="text-right"
              />
            </div>
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
              <Label className="text-right block">مستوى النشاط البدني</Label>
              <Select value={formData.activityLevel} onValueChange={(value) => setFormData({ ...formData, activityLevel: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر مستوى النشاط" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sedentary">قليل الحركة</SelectItem>
                  <SelectItem value="light">نشاط خفيف</SelectItem>
                  <SelectItem value="moderate">نشاط متوسط</SelectItem>
                  <SelectItem value="active">نشاط عالي</SelectItem>
                  <SelectItem value="veryActive">نشاط مكثف</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-right block">المناخ</Label>
              <Select value={formData.climate} onValueChange={(value) => setFormData({ ...formData, climate: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر نوع المناخ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="temperate">معتدل</SelectItem>
                  <SelectItem value="hot">حار</SelectItem>
                  <SelectItem value="humid">رطب</SelectItem>
                  <SelectItem value="cold">بارد</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-right block">الحالة الخاصة</Label>
              <Select value={formData.pregnancy} onValueChange={(value) => setFormData({ ...formData, pregnancy: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر إذا كان ينطبق" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">لا يوجد</SelectItem>
                  <SelectItem value="pregnant">حامل</SelectItem>
                  <SelectItem value="breastfeeding">مرضع</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-right block">حالات طبية</Label>
              <Select value={formData.medicalConditions} onValueChange={(value) => setFormData({ ...formData, medicalConditions: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر إذا كان ينطبق" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">لا يوجد</SelectItem>
                  <SelectItem value="fever">حمى</SelectItem>
                  <SelectItem value="diabetes">السكري</SelectItem>
                  <SelectItem value="kidney">مشاكل الكلى</SelectItem>
                  <SelectItem value="heart">مشاكل القلب</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button onClick={handleCalculate} className="w-full bg-brand hover:bg-brand-dark">
            احسب احتياج الماء اليومي
          </Button>
        </CardContent>
      </Card>

      {result && (
        <Card className="border-2 border-brand/20">
          <CardHeader>
            <CardTitle className="text-xl text-center text-brand">نتائج احتياج الماء اليومي</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {result.dailyWater} مل
              </div>
              <div className="text-lg text-gray-700">
                احتياجك اليومي من الماء ({Math.round(result.dailyWater/250)} كوب)
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-bold text-gray-900">جدولة شرب الماء المقترحة:</h4>
              <div className="grid gap-2">
                {result.schedule.map((schedule, index) => (
                  <div key={index} className="flex items-center p-2 bg-blue-50 rounded-lg">
                    <span className="text-blue-600 ml-2">💧</span>
                    <span className="text-gray-700">{schedule}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-bold text-gray-900">العوامل المؤثرة على الحساب:</h4>
              <ul className="space-y-1">
                {result.factors.map((factor, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-brand ml-2">•</span>
                    <span className="text-gray-700">{factor}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h5 className="font-bold text-blue-900 mb-2">نصائح لشرب الماء:</h5>
              <ul className="text-blue-800 text-sm space-y-1">
                <li>• اشرب الماء تدريجياً على مدار اليوم</li>
                <li>• تجنب شرب كميات كبيرة دفعة واحدة</li>
                <li>• زد الكمية عند ممارسة الرياضة أو في الطقس الحار</li>
                <li>• راقب لون البول كمؤشر على مستوى الترطيب</li>
                <li>• تناول الأطعمة الغنية بالماء مثل الفواكه والخضروات</li>
              </ul>
            </div>

            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800 text-sm">
                ⚠️ هذه التقديرات عامة وقد تختلف حسب الحالة الصحية. استشر طبيبك إذا كان لديك حالات طبية خاصة
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default WaterCalculator;
