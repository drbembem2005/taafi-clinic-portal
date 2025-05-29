
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
import { calculateOvulation } from '@/utils/healthCalculations';
import { OvulationResult } from '@/types/healthTools';

const OvulationCalculator = () => {
  const [lastPeriod, setLastPeriod] = useState<Date>();
  const [cycleLength, setCycleLength] = useState('28');
  const [periodLength, setPeriodLength] = useState('5');
  const [result, setResult] = useState<OvulationResult | null>(null);

  const handleCalculate = () => {
    if (!lastPeriod) {
      alert('يرجى إدخال تاريخ آخر دورة شهرية');
      return;
    }

    const calculatedResult = calculateOvulation(
      lastPeriod, 
      parseInt(cycleLength), 
      parseInt(periodLength)
    );
    setResult(calculatedResult);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl text-right">حاسبة التبويض ونافذة الخصوبة</CardTitle>
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
            <div className="grid md:grid-cols-2 gap-4">
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
              <div className="space-y-2">
                <Label htmlFor="periodLength" className="text-right block">مدة الحيض (بالأيام)</Label>
                <Input
                  id="periodLength"
                  type="number"
                  placeholder="5"
                  value={periodLength}
                  onChange={(e) => setPeriodLength(e.target.value)}
                  className="text-right"
                />
              </div>
            </div>
          </div>
          <Button onClick={handleCalculate} className="w-full bg-brand hover:bg-brand-dark">
            احسب موعد التبويض ونافذة الخصوبة
          </Button>
        </CardContent>
      </Card>

      {result && (
        <Card className="border-2 border-brand/20">
          <CardHeader>
            <CardTitle className="text-xl text-center text-brand">نتائج حساب التبويض</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-pink-50 rounded-lg">
                <div className="text-lg font-bold text-pink-600 mb-2">
                  {format(result.ovulationDate, 'dd/MM')}
                </div>
                <div className="text-sm text-gray-600">موعد التبويض المتوقع</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-lg font-bold text-green-600 mb-2">
                  {format(result.fertilityWindow.start, 'dd/MM')} - {format(result.fertilityWindow.end, 'dd/MM')}
                </div>
                <div className="text-sm text-gray-600">نافذة الخصوبة</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-lg font-bold text-blue-600 mb-2">
                  {format(result.nextPeriod, 'dd/MM')}
                </div>
                <div className="text-sm text-gray-600">الدورة القادمة المتوقعة</div>
              </div>
            </div>

            <div className="p-4 bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-200 rounded-lg">
              <h4 className="font-bold text-gray-900 mb-2">تقييم دورتك الشهرية:</h4>
              <p className="text-gray-700">{result.cycle}</p>
            </div>

            <div className="space-y-3">
              <h4 className="font-bold text-gray-900">نصائح لزيادة فرص الحمل:</h4>
              <ul className="space-y-2">
                {result.tips.map((tip, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-brand ml-2">💡</span>
                    <span className="text-gray-700">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h5 className="font-bold text-blue-900 mb-2">علامات التبويض الطبيعية:</h5>
              <ul className="text-blue-800 text-sm space-y-1">
                <li>• زيادة في الإفرازات المهبلية (شفافة ومطاطية)</li>
                <li>• ارتفاع طفيف في درجة حرارة الجسم الأساسية</li>
                <li>• ألم خفيف في جانب واحد من البطن</li>
                <li>• زيادة في الرغبة الجنسية</li>
                <li>• تحسن في المزاج والطاقة</li>
              </ul>
            </div>

            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800 text-sm">
                ⚠️ هذه التقديرات تعتمد على دورات منتظمة. إذا كانت دورتك غير منتظمة، استشيري طبيبك المختص
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default OvulationCalculator;
