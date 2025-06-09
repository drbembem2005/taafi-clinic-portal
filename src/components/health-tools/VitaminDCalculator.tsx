
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sun, Droplets } from 'lucide-react';

const VitaminDCalculator = () => {
  const [formData, setFormData] = useState({
    age: '',
    weight: '',
    skinType: '',
    sunExposure: '',
    geographicLocation: '',
    season: '',
    sunscreenUse: '',
    dietaryIntake: '',
    supplementation: '',
    medicalConditions: ''
  });
  const [result, setResult] = useState<any>(null);

  const calculateVitaminD = () => {
    const age = parseInt(formData.age);
    const weight = parseFloat(formData.weight);

    // الاحتياج الأساسي حسب العمر (وحدة دولية يومياً)
    let baseRequirement;
    if (age < 1) baseRequirement = 400;
    else if (age < 18) baseRequirement = 600;
    else if (age < 70) baseRequirement = 600;
    else baseRequirement = 800;

    // تعديل حسب الوزن
    let adjustedRequirement = baseRequirement;
    if (weight > 90) adjustedRequirement += 200;
    else if (weight < 50) adjustedRequirement -= 100;

    // تأثير نوع البشرة
    const skinTypeMultiplier = {
      'very-fair': 0.8, // تحتاج تعرض أقل
      'fair': 0.9,
      'medium': 1.0,
      'olive': 1.2,
      'dark': 1.5,
      'very-dark': 2.0 // تحتاج تعرض أكثر
    };
    adjustedRequirement *= skinTypeMultiplier[formData.skinType as keyof typeof skinTypeMultiplier] || 1;

    // تأثير التعرض للشمس
    const sunExposureReduction = {
      'none': 0,
      'minimal': 200,
      'moderate': 400,
      'high': 600
    };
    const sunReduction = sunExposureReduction[formData.sunExposure as keyof typeof sunExposureReduction] || 0;

    // تأثير الموقع الجغرافي
    const locationMultiplier = {
      'equatorial': 0.7,
      'tropical': 0.8,
      'subtropical': 0.9,
      'temperate': 1.0,
      'polar': 1.5
    };
    adjustedRequirement *= locationMultiplier[formData.geographicLocation as keyof typeof locationMultiplier] || 1;

    // تأثير الفصل
    const seasonMultiplier = {
      'summer': 0.7,
      'spring': 0.9,
      'autumn': 1.1,
      'winter': 1.3
    };
    adjustedRequirement *= seasonMultiplier[formData.season as keyof typeof seasonMultiplier] || 1;

    // تأثير استخدام واقي الشمس
    const sunscreenImpact = {
      'never': 0,
      'rarely': 50,
      'sometimes': 100,
      'always': 200
    };
    adjustedRequirement += sunscreenImpact[formData.sunscreenUse as keyof typeof sunscreenImpact] || 0;

    // تأثير النظام الغذائي
    const dietaryReduction = {
      'none': 0,
      'low': 100,
      'moderate': 200,
      'high': 400
    };
    const dietReduction = dietaryReduction[formData.dietaryIntake as keyof typeof dietaryReduction] || 0;

    // تأثير المكملات الحالية
    const currentSupplementation = parseInt(formData.supplementation) || 0;

    // الاحتياج النهائي
    const finalRequirement = Math.max(0, adjustedRequirement - sunReduction - dietReduction - currentSupplementation);

    // تقييم الحالة
    let status = '';
    let recommendations = [];
    let riskLevel = '';

    if (finalRequirement <= 0) {
      status = 'احتياجك من فيتامين د مُغطى حالياً';
      riskLevel = 'منخفض';
      recommendations = [
        'استمر في نظامك الحالي',
        'فحص دوري لمستوى فيتامين د كل 6 أشهر',
        'تجنب الإفراط في المكملات'
      ];
    } else if (finalRequirement <= 200) {
      status = 'احتياجك قريب من المستوى المطلوب';
      riskLevel = 'منخفض';
      recommendations = [
        'زيادة التعرض للشمس قليلاً',
        'تناول الأسماك الدهنية مرتين أسبوعياً',
        'إضافة الحليب المدعم بفيتامين د'
      ];
    } else if (finalRequirement <= 500) {
      status = 'تحتاج لزيادة مدخولك من فيتامين د';
      riskLevel = 'متوسط';
      recommendations = [
        'التعرض للشمس 15-20 دقيقة يومياً',
        'مكمل غذائي 1000 وحدة دولية يومياً',
        'تناول صفار البيض والأسماك الدهنية',
        'فحص مستوى فيتامين د كل 3 أشهر'
      ];
    } else {
      status = 'نقص محتمل في فيتامين د - يحتاج تدخل';
      riskLevel = 'مرتفع';
      recommendations = [
        'استشارة طبية لفحص مستوى فيتامين د',
        'مكمل غذائي عالي الجرعة حسب وصفة الطبيب',
        'زيادة التعرض الآمن للشمس',
        'نظام غذائي غني بفيتامين د',
        'فحص دوري شهري حتى تحسن المستوى'
      ];
    }

    // حساب وقت التعرض للشمس المطلوب
    const sunExposureTime = Math.round(finalRequirement / 100 * 10); // تقدير تقريبي

    setResult({
      dailyRequirement: Math.round(adjustedRequirement),
      currentIntake: sunReduction + dietReduction + currentSupplementation,
      additionalNeeded: Math.round(finalRequirement),
      status,
      riskLevel,
      recommendations,
      sunExposureTime: Math.max(10, Math.min(30, sunExposureTime))
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2 text-2xl text-brand">
            <Sun className="h-6 w-6" />
            حاسبة فيتامين د المطلوب
          </CardTitle>
          <p className="text-gray-600">
            احسب احتياجك اليومي من فيتامين د بناءً على نمط حياتك وتعرضك للشمس
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="age">العمر</Label>
              <Input
                id="age"
                type="number"
                placeholder="30"
                value={formData.age}
                onChange={(e) => setFormData({...formData, age: e.target.value})}
              />
            </div>

            <div>
              <Label htmlFor="weight">الوزن (كجم)</Label>
              <Input
                id="weight"
                type="number"
                placeholder="70"
                value={formData.weight}
                onChange={(e) => setFormData({...formData, weight: e.target.value})}
              />
            </div>

            <div>
              <Label>نوع البشرة</Label>
              <Select value={formData.skinType} onValueChange={(value) => setFormData({...formData, skinType: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="very-fair">فاتحة جداً (تحترق بسرعة)</SelectItem>
                  <SelectItem value="fair">فاتحة</SelectItem>
                  <SelectItem value="medium">متوسطة</SelectItem>
                  <SelectItem value="olive">سمراء فاتحة</SelectItem>
                  <SelectItem value="dark">سمراء</SelectItem>
                  <SelectItem value="very-dark">سمراء داكنة</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>التعرض اليومي للشمس</Label>
              <Select value={formData.sunExposure} onValueChange={(value) => setFormData({...formData, sunExposure: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">لا أتعرض للشمس</SelectItem>
                  <SelectItem value="minimal">أقل من 15 دقيقة</SelectItem>
                  <SelectItem value="moderate">15-30 دقيقة</SelectItem>
                  <SelectItem value="high">أكثر من 30 دقيقة</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>الموقع الجغرافي</Label>
              <Select value={formData.geographicLocation} onValueChange={(value) => setFormData({...formData, geographicLocation: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="equatorial">استوائي (قرب خط الاستواء)</SelectItem>
                  <SelectItem value="tropical">مداري</SelectItem>
                  <SelectItem value="subtropical">شبه مداري</SelectItem>
                  <SelectItem value="temperate">معتدل</SelectItem>
                  <SelectItem value="polar">قطبي أو شمالي بارد</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>الفصل الحالي</Label>
              <Select value={formData.season} onValueChange={(value) => setFormData({...formData, season: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="summer">صيف</SelectItem>
                  <SelectItem value="spring">ربيع</SelectItem>
                  <SelectItem value="autumn">خريف</SelectItem>
                  <SelectItem value="winter">شتاء</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>استخدام واقي الشمس</Label>
              <Select value={formData.sunscreenUse} onValueChange={(value) => setFormData({...formData, sunscreenUse: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="never">لا أستخدمه</SelectItem>
                  <SelectItem value="rarely">نادراً</SelectItem>
                  <SelectItem value="sometimes">أحياناً</SelectItem>
                  <SelectItem value="always">دائماً</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>فيتامين د من الطعام</Label>
              <Select value={formData.dietaryIntake} onValueChange={(value) => setFormData({...formData, dietaryIntake: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">لا آكل أطعمة غنية بفيتامين د</SelectItem>
                  <SelectItem value="low">قليل (أسماك نادراً)</SelectItem>
                  <SelectItem value="moderate">متوسط (أسماك 1-2 مرة أسبوعياً)</SelectItem>
                  <SelectItem value="high">عالي (أسماك ومنتجات ألبان يومياً)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="supplementation">مكملات فيتامين د الحالية (وحدة دولية يومياً)</Label>
              <Input
                id="supplementation"
                type="number"
                placeholder="0"
                value={formData.supplementation}
                onChange={(e) => setFormData({...formData, supplementation: e.target.value})}
              />
            </div>
          </div>

          <Button 
            onClick={calculateVitaminD} 
            className="w-full bg-brand hover:bg-brand-dark text-white py-3 rounded-xl"
            disabled={!formData.age || !formData.weight || !formData.skinType}
          >
            احسب احتياج فيتامين د
          </Button>

          {result && (
            <Card className="mt-6 bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-orange/20">
              <CardContent className="p-6">
                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-brand">{result.dailyRequirement}</div>
                    <div className="text-sm text-gray-600">الاحتياج اليومي</div>
                    <div className="text-xs text-gray-500">وحدة دولية</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{result.currentIntake}</div>
                    <div className="text-sm text-gray-600">المدخول الحالي</div>
                    <div className="text-xs text-gray-500">وحدة دولية</div>
                  </div>

                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">{result.additionalNeeded}</div>
                    <div className="text-sm text-gray-600">المطلوب إضافياً</div>
                    <div className="text-xs text-gray-500">وحدة دولية</div>
                  </div>
                </div>

                <div className="text-center mb-6">
                  <div className={`text-lg font-semibold p-3 rounded-lg ${
                    result.riskLevel === 'منخفض' ? 'bg-green-100 text-green-800' :
                    result.riskLevel === 'متوسط' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {result.status}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <Sun className="h-5 w-5 text-orange-500" />
                      وقت التعرض للشمس المقترح
                    </h3>
                    <div className="text-center p-4 bg-yellow-100 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">{result.sunExposureTime}</div>
                      <div className="text-sm text-gray-600">دقيقة يومياً</div>
                      <div className="text-xs text-gray-500">بدون واقي شمس، في الصباح أو المساء</div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <Droplets className="h-5 w-5 text-brand" />
                      التوصيات
                    </h3>
                    <ul className="space-y-2 text-sm">
                      {result.recommendations.map((rec: string, index: number) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-brand text-lg">•</span>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-blue-800 text-sm">
                    <strong>نصيحة:</strong> فيتامين د ضروري لصحة العظام والمناعة. 
                    أفضل مصدر هو التعرض المعتدل للشمس، يليه الأسماك الدهنية والمكملات عند الحاجة.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VitaminDCalculator;
