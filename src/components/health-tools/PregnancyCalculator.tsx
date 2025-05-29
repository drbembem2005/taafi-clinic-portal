
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { calculatePregnancy } from '@/utils/healthCalculations';
import { PregnancyResult } from '@/types/healthTools';

const PregnancyCalculator = () => {
  const [lastPeriod, setLastPeriod] = useState<Date>();
  const [cycleLength, setCycleLength] = useState('28');
  const [result, setResult] = useState<PregnancyResult | null>(null);

  const handleCalculate = () => {
    if (!lastPeriod) {
      alert('يرجى إدخال تاريخ آخر دورة شهرية');
      return;
    }

    const calculatedResult = calculatePregnancy(lastPeriod, parseInt(cycleLength));
    setResult(calculatedResult);
  };

  const getTrimesterColor = (trimester: number) => {
    switch (trimester) {
      case 1: return 'bg-green-100 border-green-300 text-green-800';
      case 2: return 'bg-blue-100 border-blue-300 text-blue-800';
      case 3: return 'bg-purple-100 border-purple-300 text-purple-800';
      default: return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl text-right">حاسبة الحمل وموعد الولادة</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-right block">تاريخ آخر دورة شهرية</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !lastPeriod && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {lastPeriod ? format(lastPeriod, "PPP") : <span>اختر التاريخ</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={lastPeriod}
                    onSelect={setLastPeriod}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label htmlFor="cycleLength" className="text-right block">طول الدورة الشهرية (بالأيام)</Label>
              <Input
                id="cycleLength"
                type="number"
                placeholder="28"
                value={cycleLength}
                onChange={(e) => setCycleLength(e.target.value)}
                className="text-right"
              />
            </div>
          </div>
          <Button onClick={handleCalculate} className="w-full bg-brand hover:bg-brand-dark">
            احسب موعد الولادة المتوقع
          </Button>
        </CardContent>
      </Card>

      {result && (
        <Card className="border-2 border-brand/20">
          <CardHeader>
            <CardTitle className="text-xl text-center text-brand">نتائج حساب الحمل</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="text-center p-4 bg-pink-50 rounded-lg">
                <div className="text-2xl font-bold text-pink-600 mb-2">
                  {format(result.dueDate, 'dd/MM/yyyy')}
                </div>
                <div className="text-sm text-gray-600">موعد الولادة المتوقع</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 mb-2">
                  {result.weeksPregnant} أسبوع
                </div>
                <div className="text-sm text-gray-600">مدة الحمل الحالية</div>
              </div>
            </div>

            <div className={`p-4 rounded-lg border-2 ${getTrimesterColor(result.trimester)}`}>
              <h4 className="font-bold mb-2">الثلث الحالي من الحمل</h4>
              <div className="text-xl font-bold">
                الثلث {result.trimester === 1 ? 'الأول' : result.trimester === 2 ? 'الثاني' : 'الثالث'}
              </div>
              <p className="text-sm mt-2">
                {result.trimester === 1 && '(الأسابيع 1-12): فترة تكوين الأعضاء الأساسية'}
                {result.trimester === 2 && '(الأسابيع 13-28): فترة النمو السريع'}
                {result.trimester === 3 && '(الأسابيع 29-40): فترة النضج والاستعداد للولادة'}
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="font-bold text-gray-900">معالم مهمة في هذه المرحلة:</h4>
              <ul className="space-y-2">
                {result.milestones.map((milestone, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-brand ml-2">🌟</span>
                    <span className="text-gray-700">{milestone}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="font-bold text-gray-900">توصيات هذه المرحلة:</h4>
              <ul className="space-y-2">
                {result.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-brand ml-2">💡</span>
                    <span className="text-gray-700">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h5 className="font-bold text-yellow-900 mb-2">تذكير مهم:</h5>
              <p className="text-yellow-800 text-sm">
                هذه التقديرات تعتمد على متوسط مدة الحمل (40 أسبوعاً). قد يختلف موعد الولادة الفعلي بأسبوعين قبل أو بعد التاريخ المحسوب.
                استشيري طبيبك المختص للمتابعة الدقيقة.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PregnancyCalculator;
