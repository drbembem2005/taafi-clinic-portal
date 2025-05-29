
export const calculateBMI = (weight: number, height: number, age: number, gender: string, activityLevel: string) => {
  const heightInMeters = height / 100;
  const bmi = weight / (heightInMeters * heightInMeters);
  
  let category = '';
  let recommendations: string[] = [];
  
  if (bmi < 18.5) {
    category = 'نقص في الوزن';
    recommendations = [
      'زيادة السعرات الحرارية اليومية بتدرج',
      'التركيز على الأطعمة الغنية بالبروتين',
      'ممارسة تمارين المقاومة لبناء العضلات',
      'استشارة أخصائي تغذية'
    ];
  } else if (bmi < 25) {
    category = 'وزن طبيعي';
    recommendations = [
      'الحفاظ على نمط الحياة الصحي الحالي',
      'ممارسة الرياضة بانتظام',
      'تناول غذاء متوازن',
      'شرب كميات كافية من الماء'
    ];
  } else if (bmi < 30) {
    category = 'زيادة في الوزن';
    recommendations = [
      'تقليل السعرات الحرارية بنسبة 10-15%',
      'زيادة النشاط البدني إلى 150 دقيقة أسبوعياً',
      'التركيز على الخضروات والألياف',
      'تجنب المشروبات السكرية'
    ];
  } else {
    category = 'سمنة';
    recommendations = [
      'استشارة طبيب مختص في السمنة',
      'وضع خطة إنقاص وزن طبية مراقبة',
      'ممارسة نشاط بدني تدريجي',
      'فحص الأمراض المرتبطة بالسمنة'
    ];
  }
  
  // Calculate ideal weight range
  const idealBMIMin = 18.5;
  const idealBMIMax = 24.9;
  const idealWeightMin = idealBMIMin * (heightInMeters * heightInMeters);
  const idealWeightMax = idealBMIMax * (heightInMeters * heightInMeters);
  
  return {
    bmi: Math.round(bmi * 10) / 10,
    category,
    idealWeight: {
      min: Math.round(idealWeightMin),
      max: Math.round(idealWeightMax)
    },
    recommendations
  };
};

export const calculateCalories = (weight: number, height: number, age: number, gender: string, activityLevel: string, goal: string) => {
  // Mifflin-St Jeor Equation
  let bmr: number;
  if (gender === 'male') {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  }
  
  // Activity multipliers
  const activityMultipliers: { [key: string]: number } = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    veryActive: 1.9
  };
  
  const tdee = bmr * (activityMultipliers[activityLevel] || 1.2);
  
  // Adjust for goal
  let targetCalories = tdee;
  if (goal === 'lose') targetCalories = tdee - 500;
  else if (goal === 'gain') targetCalories = tdee + 300;
  
  // Calculate macros (40% carbs, 30% protein, 30% fat)
  const protein = Math.round((targetCalories * 0.3) / 4);
  const carbs = Math.round((targetCalories * 0.4) / 4);
  const fats = Math.round((targetCalories * 0.3) / 9);
  
  const mealPlan = [
    'الإفطار: 25% من السعرات اليومية',
    'الغداء: 35% من السعرات اليومية',
    'العشاء: 25% من السعرات اليومية',
    'وجبات خفيفة: 15% من السعرات اليومية'
  ];
  
  return {
    bmr: Math.round(bmr),
    tdee: Math.round(tdee),
    targetCalories: Math.round(targetCalories),
    macros: { protein, carbs, fats },
    mealPlan
  };
};

export const calculateWaterNeeds = (weight: number, age: number, activityLevel: string, climate: string) => {
  // Base calculation: 35ml per kg of body weight
  let dailyWater = weight * 35;
  
  // Adjustments for activity
  if (activityLevel === 'active') dailyWater += 500;
  else if (activityLevel === 'veryActive') dailyWater += 1000;
  
  // Climate adjustments
  if (climate === 'hot') dailyWater += 300;
  else if (climate === 'humid') dailyWater += 200;
  
  // Age adjustments
  if (age > 65) dailyWater += 200;
  
  const schedule = [
    'الاستيقاظ: 250 مل',
    'قبل الإفطار بـ30 دقيقة: 250 مل',
    'بين الإفطار والغداء: 500 مل',
    'قبل الغداء بـ30 دقيقة: 250 مل',
    'بعد الظهر: 500 مل',
    'قبل العشاء: 250 مل',
    'المساء: 250 مل'
  ];
  
  const factors = [
    `الوزن: ${weight} كجم`,
    `مستوى النشاط: ${activityLevel}`,
    `المناخ: ${climate}`,
    `العمر: ${age} سنة`
  ];
  
  return {
    dailyWater: Math.round(dailyWater),
    schedule: schedule.slice(0, Math.ceil(dailyWater / 250)),
    factors
  };
};

export const calculateHeartRate = (age: number, fitnessLevel: string, restingHR?: number) => {
  const maxHR = 220 - age;
  
  // Target zones
  const fatBurnMin = Math.round(maxHR * 0.5);
  const fatBurnMax = Math.round(maxHR * 0.7);
  const cardioMin = Math.round(maxHR * 0.7);
  const cardioMax = Math.round(maxHR * 0.85);
  const peakMin = Math.round(maxHR * 0.85);
  const peakMax = maxHR;
  
  let recommendations = [
    `الحد الأقصى لمعدل النبض: ${maxHR} نبضة/دقيقة`,
    'منطقة حرق الدهون: للمبتدئين ولفقدان الوزن',
    'المنطقة القلبية: لتحسين اللياقة العامة',
    'المنطقة القصوى: للرياضيين المتقدمين'
  ];
  
  let restingCategory = 'غير محدد';
  if (restingHR) {
    if (restingHR < 60) restingCategory = 'ممتاز (رياضي)';
    else if (restingHR < 70) restingCategory = 'جيد جداً';
    else if (restingHR < 80) restingCategory = 'جيد';
    else if (restingHR < 90) restingCategory = 'متوسط';
    else restingCategory = 'يحتاج تحسين';
    
    recommendations.unshift(`معدل النبض أثناء الراحة: ${restingCategory}`);
  }
  
  return {
    restingHR: restingCategory,
    targetZones: {
      fatBurn: { min: fatBurnMin, max: fatBurnMax },
      cardio: { min: cardioMin, max: cardioMax },
      peak: { min: peakMin, max: peakMax }
    },
    recommendations
  };
};

export const calculatePregnancy = (lastPeriod: Date, cycleLength: number = 28) => {
  const today = new Date();
  const timeDiff = today.getTime() - lastPeriod.getTime();
  const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
  const weeksPregnant = Math.floor(daysDiff / 7);
  
  // Calculate due date (280 days from last period)
  const dueDate = new Date(lastPeriod);
  dueDate.setDate(dueDate.getDate() + 280);
  
  const trimester = weeksPregnant <= 12 ? 1 : weeksPregnant <= 28 ? 2 : 3;
  
  const milestones = [];
  const recommendations = [];
  
  if (trimester === 1) {
    milestones.push('تكوين الأعضاء الرئيسية', 'بداية نبضات القلب', 'تطور الجهاز العصبي');
    recommendations.push('تناول حمض الفوليك', 'تجنب الكافيين الزائد', 'المتابعة الطبية المنتظمة');
  } else if (trimester === 2) {
    milestones.push('تحديد جنس الجنين', 'بداية الحركة', 'نمو الشعر والأظافر');
    recommendations.push('فحص الموجات فوق الصوتية', 'تناول الكالسيوم', 'ممارسة رياضة خفيفة');
  } else {
    milestones.push('اكتمال نمو الرئتين', 'استعداد للولادة', 'زيادة الوزن السريعة');
    recommendations.push('التحضير للولادة', 'مراقبة حركة الجنين', 'تجهيز حقيبة المستشفى');
  }
  
  return {
    dueDate,
    weeksPregnant,
    trimester,
    milestones,
    recommendations
  };
};

export const assessDiabetesRisk = (answers: { [key: string]: any }) => {
  let score = 0;
  
  // Age scoring
  if (answers.age >= 45) score += 2;
  else if (answers.age >= 35) score += 1;
  
  // BMI scoring
  if (answers.bmi >= 30) score += 3;
  else if (answers.bmi >= 25) score += 1;
  
  // Family history
  if (answers.familyHistory) score += 2;
  
  // Physical activity
  if (!answers.physicalActivity) score += 2;
  
  // Previous high blood sugar
  if (answers.previousHighBloodSugar) score += 2;
  
  // High blood pressure
  if (answers.highBloodPressure) score += 1;
  
  // Additional risk factors
  if (answers.gestationalDiabetes) score += 2;
  if (answers.largeInfant) score += 1;
  
  let level: 'low' | 'moderate' | 'high' | 'very-high';
  let recommendations: string[] = [];
  
  if (score < 3) {
    level = 'low';
    recommendations = [
      'الحفاظ على نمط الحياة الصحي',
      'ممارسة الرياضة بانتظام',
      'تناول نظام غذائي متوازن',
      'فحص دوري كل 3 سنوات'
    ];
  } else if (score < 6) {
    level = 'moderate';
    recommendations = [
      'فحص مستوى السكر سنوياً',
      'تقليل الوزن إذا كان زائداً',
      'زيادة النشاط البدني',
      'تقليل السكريات والكربوهيدرات المكررة'
    ];
  } else if (score < 9) {
    level = 'high';
    recommendations = [
      'فحص مستوى السكر كل 6 أشهر',
      'استشارة أخصائي تغذية',
      'برنامج إنقاص وزن مراقب طبياً',
      'مراقبة ضغط الدم والكوليسترول'
    ];
  } else {
    level = 'very-high';
    recommendations = [
      'فحص فوري مع طبيب الغدد الصماء',
      'فحص مستوى السكر كل 3 أشهر',
      'برنامج وقاية شامل من السكري',
      'متابعة طبية مكثفة'
    ];
  }
  
  return {
    score,
    level,
    category: `مخاطر السكري: ${level === 'low' ? 'منخفضة' : level === 'moderate' ? 'متوسطة' : level === 'high' ? 'عالية' : 'عالية جداً'}`,
    recommendations,
    details: `النتيجة: ${score} من 15 نقطة`,
    needsAttention: level === 'high' || level === 'very-high'
  };
};

export const assessAnxiety = (answers: number[]) => {
  const totalScore = answers.reduce((sum, score) => sum + score, 0);
  
  let level: 'low' | 'moderate' | 'high' | 'very-high';
  let category: string;
  let recommendations: string[] = [];
  
  if (totalScore <= 4) {
    level = 'low';
    category = 'قلق طبيعي';
    recommendations = [
      'تقنيات الاسترخاء والتأمل',
      'ممارسة الرياضة بانتظام',
      'الحفاظ على نمط نوم منتظم',
      'التواصل الاجتماعي الإيجابي'
    ];
  } else if (totalScore <= 9) {
    level = 'moderate';
    category = 'قلق خفيف';
    recommendations = [
      'تمارين التنفس العميق',
      'تقنيات إدارة التوتر',
      'تقليل الكافيين',
      'ممارسة اليوغا أو التأمل'
    ];
  } else if (totalScore <= 14) {
    level = 'high';
    category = 'قلق متوسط';
    recommendations = [
      'استشارة أخصائي نفسي',
      'العلاج السلوكي المعرفي',
      'تقنيات الاسترخاء المتقدمة',
      'تجنب محفزات القلق'
    ];
  } else {
    level = 'very-high';
    category = 'قلق شديد';
    recommendations = [
      'استشارة طبيب نفسي فوراً',
      'تقييم طبي شامل',
      'خطة علاج متخصصة',
      'دعم من الأهل والأصدقاء'
    ];
  }
  
  return {
    score: totalScore,
    level,
    category,
    recommendations,
    details: `النتيجة: ${totalScore} من 21 نقطة`,
    needsAttention: level === 'high' || level === 'very-high'
  };
};
