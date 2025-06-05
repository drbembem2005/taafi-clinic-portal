
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, Camera, Loader2, Utensils, TrendingUp, Award, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface NutritionAnalysis {
  foodItems: string[];
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
  fiber: number;
  vitamins: string[];
  minerals: string[];
  healthScore: number;
  recommendations: string[];
  warnings: string[];
}

const FoodAnalyzer = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<NutritionAnalysis | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleImageSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'خطأ في الملف',
        description: 'يرجى اختيار ملف صورة صحيح',
        variant: 'destructive',
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      toast({
        title: 'حجم الملف كبير',
        description: 'يرجى اختيار صورة أصغر من 10 ميجابايت',
        variant: 'destructive',
      });
      return;
    }

    setSelectedImage(file);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
    
    // Reset previous analysis
    setAnalysis(null);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleImageSelect(file);
    }
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      handleImageSelect(file);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const analyzeFood = async () => {
    if (!selectedImage) {
      toast({
        title: 'لا توجد صورة',
        description: 'يرجى اختيار صورة أولاً',
        variant: 'destructive',
      });
      return;
    }

    setIsAnalyzing(true);
    
    try {
      const formData = new FormData();
      formData.append('image', selectedImage);

      const response = await fetch('/api/analyze-food', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('فشل في تحليل الصورة');
      }

      const result = await response.json();
      setAnalysis(result);
      
      toast({
        title: 'تم التحليل بنجاح',
        description: 'تم تحليل صورة الطعام وإنتاج التقرير الغذائي',
      });
    } catch (error) {
      console.error('Error analyzing food:', error);
      toast({
        title: 'خطأ في التحليل',
        description: 'حدث خطأ أثناء تحليل الصورة. يرجى المحاولة مرة أخرى.',
        variant: 'destructive',
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetAnalysis = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setAnalysis(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Camera className="h-8 w-8 text-brand" />
          <h2 className="text-2xl font-bold text-gray-900">محلل الطعام الذكي</h2>
        </div>
        <p className="text-gray-600">
          قم بتحميل صورة وجبتك للحصول على تحليل غذائي مفصل باستخدام الذكاء الاصطناعي
        </p>
      </div>

      {/* Image Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            تحميل صورة الطعام
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-brand transition-colors cursor-pointer"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            
            {imagePreview ? (
              <div className="space-y-4">
                <img
                  src={imagePreview}
                  alt="معاينة الطعام"
                  className="max-w-full max-h-64 mx-auto rounded-lg shadow-md"
                />
                <div className="flex gap-2 justify-center">
                  <Button onClick={analyzeFood} disabled={isAnalyzing} className="bg-brand hover:bg-brand-dark">
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                        جاري التحليل...
                      </>
                    ) : (
                      <>
                        <Utensils className="ml-2 h-4 w-4" />
                        تحليل الطعام
                      </>
                    )}
                  </Button>
                  <Button variant="outline" onClick={resetAnalysis}>
                    صورة جديدة
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <Camera className="h-16 w-16 text-gray-400 mx-auto" />
                <div>
                  <p className="text-lg font-medium text-gray-700">اسحب وأفلت الصورة هنا</p>
                  <p className="text-gray-500">أو انقر لاختيار ملف</p>
                </div>
                <Button variant="outline">
                  <Upload className="ml-2 h-4 w-4" />
                  اختيار صورة
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Analysis Results */}
      {analysis && (
        <div className="space-y-4">
          {/* Food Items */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Utensils className="h-5 w-5" />
                الأطعمة المكتشفة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {analysis.foodItems.map((item, index) => (
                  <span
                    key={index}
                    className="bg-brand/10 text-brand px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Nutrition Facts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                القيم الغذائية (لكل 100 جرام)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                <div className="text-center p-3 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">{analysis.calories}</div>
                  <div className="text-sm text-gray-600">سعرة حرارية</div>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{analysis.protein}g</div>
                  <div className="text-sm text-gray-600">بروتين</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{analysis.carbohydrates}g</div>
                  <div className="text-sm text-gray-600">كربوهيدرات</div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{analysis.fat}g</div>
                  <div className="text-sm text-gray-600">دهون</div>
                </div>
                <div className="text-center p-3 bg-amber-50 rounded-lg">
                  <div className="text-2xl font-bold text-amber-600">{analysis.fiber}g</div>
                  <div className="text-sm text-gray-600">ألياف</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Health Score */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                تقييم الوجبة الصحي
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="text-4xl font-bold text-brand">{analysis.healthScore}/10</div>
                <div className="flex-1">
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-brand to-brand-light h-3 rounded-full transition-all duration-500"
                      style={{ width: `${analysis.healthScore * 10}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    {analysis.healthScore >= 8 ? 'وجبة صحية ممتازة!' :
                     analysis.healthScore >= 6 ? 'وجبة صحية جيدة' :
                     analysis.healthScore >= 4 ? 'وجبة متوسطة الصحة' :
                     'وجبة تحتاج تحسين'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Vitamins and Minerals */}
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>الفيتامينات</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {analysis.vitamins.map((vitamin, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">{vitamin}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>المعادن</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {analysis.minerals.map((mineral, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm">{mineral}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recommendations and Warnings */}
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-green-700">نصائح للتحسين</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {analysis.recommendations.map((rec, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <TrendingUp className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{rec}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {analysis.warnings.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-amber-700">تنبيهات هامة</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {analysis.warnings.map((warning, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{warning}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 justify-center">
          <Button onClick={resetAnalysis} variant="outline">
            تحليل صورة جديدة
          </Button>
        </div>
      )}
    </div>
  );
};

export default FoodAnalyzer;
