
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { calculateWaistRisk } from '@/utils/healthCalculations';
import { WaistResult } from '@/types/healthTools';

const WaistCalculator = () => {
  const [formData, setFormData] = useState({
    waist: '',
    height: '',
    age: '',
    gender: ''
  });
  const [result, setResult] = useState<WaistResult | null>(null);

  const handleCalculate = () => {
    if (!formData.waist || !formData.height || !formData.age || !formData.gender) {
      alert('يرجى إدخال جميع البيانات المطلوبة');
      return;
    }

    const calculatedResult = calculateWaistRisk(
      parseFloat(formData.waist),
      parseFloat(formData.height),
      parseInt(formData.age),
      formData.gender
    );

    setResult(calculatedResult);
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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl text-right">حاسبة محيط الخصر الصحي</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="waist" className="text-right block">محيط الخصر (سنتيمتر)</Label>
              <Input
                id="waist"
                type="number"
                placeholder="80"
                value={formData.waist}
                onChange={(e) => setFormData({ ...formData, waist: e.target.value })}
                className="text-right"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="height" className="text-right block">الطول (سنتيمتر)</Label>
              <Input
                id="height"
                type="number"
                placeholder="170"
                value={formData.height}
                onChange={(e) => setFormData({ ...formData, height: e.target.value })}
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
              <Label className="text-right block">الجنس</Label>
              <Select value={formData.gender} onValueChange={(value) => setFormData({ ...formData, gender: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر الجنس" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">ذكر</SelectItem>
                  <SelectItem value="female">أنثى</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button onClick={handleCalculate} className="w-full bg-brand hover:bg-brand-dark">
            احسب مخاطر محيط الخصر
          </Button>
        </CardContent>
      </Card>

      {result && (
        <Card className="border-2 border-brand/20">
          <CardHeader>
            <CardTitle className="text-xl text-center text-brand">نتائج تقييم محيط الخصر</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className={`p-6 rounded-lg border-2 ${getRiskBgColor(result.riskLevel)}`}>
              <div className="text-center">
                <div className={`text-3xl font-bold ${getRiskColor(result.riskLevel)} mb-2`}>
                  {result.category}
                </div>
                <div className="text-lg text-gray-700">
                  نسبة الخصر للطول: {result.waistToHeightRatio.toFixed(2)}
                </div>
              </div>
            </div>

            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-lg font-bold text-blue-600 mb-2">
                النطاق المثالي لمحيط الخصر
              </div>
              <div className="text-xl font-bold text-blue-800">
                {result.idealRange.min} - {result.idealRange.max} سم
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

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h5 className="font-bold text-blue-900 mb-2">كيفية قياس محيط الخصر بدقة:</h5>
              <ul className="text-blue-800 text-sm space-y-1">
                <li>• قف مستقيماً واسترخ</li>
                <li>• ضع شريط القياس حول أضيق جزء من الخصر</li>
                <li>• تأكد من أن الشريط أفقي ومحكم لكن غير ضاغط</li>
                <li>• اقرأ القياس بعد الزفير الطبيعي</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default WaistCalculator;
