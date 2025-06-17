import {
  BMIResult,
  CalorieResult,
  HealthToolResult,
  AnxietyResult,
  WaterResult,
  HeartRateResult,
  PregnancyResult,
  OvulationResult,
  DentalResult,
  DentalVisitResult,
  WaistResult,
  StepsCaloriesResult,
  BloodPressureRiskResult,
  HealthyHabitsResult,
  PregnancySymptomsResult,
  MedicalSpecialtyResult,
  VaccinationResult,
  VaccinationEntry,
  MedicationDosageResult,
  BloodTypeResult,
  BloodTypePossibility
} from '@/types/healthTools';

export const calculateBMI = (
  weight: number, 
  height: number, 
  age: number, 
  gender: string, 
  activityLevel?: string
): BMIResult => {
  const heightInMeters = height / 100;
  const bmi = weight / (heightInMeters * heightInMeters);
  let category = '';
  let recommendations: string[] = [];

  // More nuanced BMI categorization with age and gender considerations
  let lowerNormal = 18.5;
  let upperNormal = 24.9;
  let upperOverweight = 29.9;

  // Adjust ranges for age (older adults can have slightly higher healthy BMI)
  if (age > 65) {
    lowerNormal = 22;
    upperNormal = 27;
    upperOverweight = 32;
  } else if (age > 45) {
    upperNormal = 25.5;
    upperOverweight = 30.5;
  }

  // Gender-specific adjustments
  if (gender === 'female') {
    upperNormal += 0.5; // Women can have slightly higher BMI in healthy range
  }

  // Activity level adjustments for muscle mass
  if (activityLevel === 'veryActive' || activityLevel === 'active') {
    upperNormal += 1; // Athletes may have higher BMI due to muscle mass
    upperOverweight += 1;
  }

  if (bmi < lowerNormal) {
    category = bmi < 16 ? 'نحافة شديدة' : bmi < 17 ? 'نحافة متوسطة' : 'نحافة خفيفة';
    recommendations = [
      'استشر طبيباً أو أخصائي تغذية لزيادة الوزن بشكل صحي',
      'تناول وجبات غنية بالسعرات الحرارية الصحية',
      'زد من كمية البروتين والدهون الصحية في غذائك',
      'مارس تمارين القوة لبناء العضلات',
      'تناول وجبات صغيرة متكررة على مدار اليوم',
      'أضف المكسرات والفواكه المجففة لنظامك الغذائي'
    ];
  } else if (bmi <= upperNormal) {
    if (bmi < 20) {
      category = 'وزن طبيعي (على الحد الأدنى)';
    } else if (bmi < 23) {
      category = 'وزن طبيعي مثالي';
    } else {
      category = 'وزن طبيعي (على الحد الأعلى)';
    }
    
    recommendations = [
      'ممتاز! حافظ على نمط حياة صحي',
      'مارس الرياضة بانتظام 150 دقيقة أسبوعياً',
      'تناول غذاء متوازن غني بالخضروات والفواكه',
      'احرص على النوم الكافي 7-8 ساعات يومياً',
      'حافظ على شرب الماء بكميات كافية',
      'تجنب الأطعمة المصنعة والسكريات المضافة'
    ];
  } else if (bmi <= upperOverweight) {
    if (bmi < 27) {
      category = 'زيادة وزن خفيفة';
    } else if (bmi < 29) {
      category = 'زيادة وزن متوسطة';
    } else {
      category = 'زيادة وزن تقترب من السمنة';
    }
    
    recommendations = [
      'ينصح بإنقاص الوزن تدريجياً بمعدل 0.5-1 كجم أسبوعياً',
      'مارس الرياضة بانتظام 300 دقيقة أسبوعياً',
      'قلل من السعرات الحرارية 300-500 سعرة يومياً',
      'ركز على البروتين الخالي من الدهون والخضروات',
      'تجنب المشروبات السكرية والوجبات السريعة',
      'استشر أخصائي تغذية لخطة غذائية مناسبة'
    ];
  } else {
    if (bmi < 35) {
      category = 'سمنة من الدرجة الأولى';
    } else if (bmi < 40) {
      category = 'سمنة من الدرجة الثانية';
    } else {
      category = 'سمنة مفرطة (الدرجة الثالثة)';
    }
    
    recommendations = [
      'استشر طبيبك فوراً لتقييم حالتك الصحية الشاملة',
      'احصل على خطة غذائية مخصصة من أخصائي تغذية',
      'ابدأ بتمارين خفيفة تدريجياً تحت إشراف طبي',
      'راقب ضغط الدم ومستوى السكر بانتظام',
      'فكر في استشارة جراح السمنة إذا لزم الأمر',
      'انضم لمجموعات الدعم لإنقاص الوزن'
    ];
  }

  // Enhanced ideal weight calculation with more precision
  let idealWeightMin = lowerNormal * (heightInMeters * heightInMeters);
  let idealWeightMax = upperNormal * (heightInMeters * heightInMeters);

  // Fine-tune based on gender and age
  if (gender === 'male') {
    idealWeightMin += 2;
    idealWeightMax += 2;
  }

  if (age < 25) {
    idealWeightMin -= 1;
    idealWeightMax -= 1;
  }

  return {
    bmi: parseFloat(bmi.toFixed(1)),
    category,
    idealWeight: {
      min: parseFloat(idealWeightMin.toFixed(1)),
      max: parseFloat(idealWeightMax.toFixed(1))
    },
    recommendations
  };
};

export const calculateCalories = (
  weight: number,
  height: number,
  age: number,
  gender: string,
  activityLevel: string,
  goal: string
): CalorieResult => {
  // BMR Calculation
  let bmr: number;
  if (gender === 'male') {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  }

  // TDEE Calculation
  let tdee: number;
  switch (activityLevel) {
    case 'sedentary':
      tdee = bmr * 1.2;
      break;
    case 'light':
      tdee = bmr * 1.375;
      break;
    case 'moderate':
      tdee = bmr * 1.55;
      break;
    case 'active':
      tdee = bmr * 1.725;
      break;
    case 'veryActive':
      tdee = bmr * 1.9;
      break;
    default:
      tdee = bmr * 1.2;
  }

  // Calorie Adjustment for Goal
  let targetCalories: number;
  switch (goal) {
    case 'lose':
      targetCalories = tdee * 0.85; // 15% deficit
      break;
    case 'gain':
      targetCalories = tdee * 1.15; // 15% surplus
      break;
    default:
      targetCalories = tdee;
  }

  // Macro Distribution (Example: 40% Carbs, 30% Protein, 30% Fat)
  const protein = (targetCalories * 0.3) / 4;
  const carbs = (targetCalories * 0.4) / 4;
  const fats = (targetCalories * 0.3) / 9;

  // Meal Plan (Example)
  const mealPlan = [
    'وجبة الإفطار: بيض مع خبز أسمر وخضروات',
    'وجبة الغداء: صدر دجاج مشوي مع أرز أسمر وسلطة',
    'وجبة العشاء: سمك سلمون مع خضار مشكلة',
    'وجبات خفيفة: فواكه ومكسرات'
  ];

  return {
    bmr: Math.round(bmr),
    tdee: Math.round(tdee),
    targetCalories: Math.round(targetCalories),
    macros: {
      protein: Math.round(protein),
      carbs: Math.round(carbs),
      fats: Math.round(fats)
    },
    mealPlan
  };
};

export const calculateWaterNeeds = (
  weight: number,
  age: number,
  activityLevel: string,
  climate: string,
  pregnancy: string,
  medicalConditions: string
): WaterResult => {
  let dailyWater = weight * 35; // Default: 35ml per kg

  // Adjustments
  if (age < 18) {
    dailyWater *= 1.1;
  }
  if (activityLevel === 'light') {
    dailyWater *= 1.2;
  } else if (activityLevel === 'moderate') {
    dailyWater *= 1.3;
  } else if (activityLevel === 'active') {
    dailyWater *= 1.4;
  } else if (activityLevel === 'veryActive') {
    dailyWater *= 1.5;
  }
  if (climate === 'hot') {
    dailyWater *= 1.2;
  } else if (climate === 'humid') {
    dailyWater *= 1.1;
  }
  if (pregnancy === 'pregnant') {
    dailyWater += 300;
  } else if (pregnancy === 'breastfeeding') {
    dailyWater += 700;
  }
  if (medicalConditions === 'fever') {
    dailyWater += 500;
  } else if (medicalConditions === 'diabetes') {
    dailyWater += 400;
  } else if (medicalConditions === 'kidney') {
    dailyWater -= 300;
  } else if (medicalConditions === 'heart') {
    dailyWater -= 200;
  }

  const schedule = [
    'عند الاستيقاظ: 250 مل',
    'بين الإفطار والغداء: 500 مل',
    'مع الغداء: 250 مل',
    'بين الغداء والعشاء: 500 مل',
    'مع العشاء: 250 مل',
    'قبل النوم: 250 مل'
  ];

  const factors = [
    `الوزن: ${weight} كجم`,
    `العمر: ${age} سنة`,
    `مستوى النشاط: ${activityLevel}`,
    `المناخ: ${climate}`,
    `الحالة الخاصة: ${pregnancy || 'لا يوجد'}`,
    `الحالات الطبية: ${medicalConditions || 'لا يوجد'}`
  ];

  return {
    dailyWater: Math.round(dailyWater),
    schedule,
    factors
  };
};

export const calculateHeartRate = (
  age: number,
  fitnessLevel: string,
  restingHR?: number,
  medications?: string
): HeartRateResult => {
  // Maximum Heart Rate (MHR)
  let mhr = 220 - age;

  // Adjust MHR based on fitness level
  switch (fitnessLevel) {
    case 'beginner':
      mhr *= 0.9;
      break;
    case 'intermediate':
      mhr *= 0.95;
      break;
    case 'advanced':
      break; // No adjustment
    case 'athlete':
      mhr *= 1.05;
      break;
  }

  // Adjust MHR based on medications
  if (medications === 'betaBlockers') {
    mhr *= 0.8;
  } else if (medications === 'stimulants') {
    mhr *= 1.1;
  }

  // Target Heart Rate Zones
  const fatBurnMin = Math.round((0.5 * (mhr - (restingHR || 60))) + (restingHR || 60));
  const fatBurnMax = Math.round((0.7 * (mhr - (restingHR || 60))) + (restingHR || 60));
  const cardioMin = Math.round((0.7 * (mhr - (restingHR || 60))) + (restingHR || 60));
  const cardioMax = Math.round((0.85 * (mhr - (restingHR || 60))) + (restingHR || 60));
  const peakMin = Math.round((0.85 * (mhr - (restingHR || 60))) + (restingHR || 60));
  const peakMax = Math.round((0.95 * (mhr - (restingHR || 60))) + (restingHR || 60));

  const recommendations = [
    'ابدأ ببطء وزد الشدة تدريجياً',
    'استشر طبيبك قبل البدء في أي برنامج رياضي جديد',
    'راقب معدل ضربات قلبك أثناء التمرين',
    'حافظ على رطوبة الجسم بشرب الماء بانتظام'
  ];

  return {
    restingHR: restingHR ? `${restingHR} نبضة/دقيقة` : 'غير محدد',
    targetZones: {
      fatBurn: { min: fatBurnMin, max: fatBurnMax },
      cardio: { min: cardioMin, max: cardioMax },
      peak: { min: peakMin, max: peakMax }
    },
    recommendations
  };
};

export const assessDiabetesRisk = (answers: { [key: string]: any }): HealthToolResult => {
  let score = 0;

  if (answers.age >= 45) score += 2;
  if (answers.bmi >= 27.5) score += 3;
  if (answers.familyHistory) score += 3;
  if (!answers.physicalActivity) score += 2;
  if (answers.previousHighBloodSugar) score += 5;
  if (answers.highBloodPressure) score += 2;
  if (answers.waistCircumference) score += 2;
  if (answers.gestationalDiabetes) score += 5;

  let level: 'low' | 'moderate' | 'high' | 'very-high';
  let category: string;
  let details: string;
  let needsAttention = false;

  if (score <= 5) {
    level = 'low';
    category = 'مخاطر منخفضة';
    details = 'احتمالية منخفضة للإصابة بالسكري';
  } else if (score <= 10) {
    level = 'moderate';
    category = 'مخاطر متوسطة';
    details = 'احتمالية متوسطة للإصابة بالسكري';
  } else if (score <= 15) {
    level = 'high';
    category = 'مخاطر عالية';
    details = 'احتمالية عالية للإصابة بالسكري';
    needsAttention = true;
  } else {
    level = 'very-high';
    category = 'مخاطر عالية جداً';
    details = 'احتمالية عالية جداً للإصابة بالسكري';
    needsAttention = true;
  }

  const recommendations = [
    'مارس الرياضة بانتظام',
    'اتبع نظام غذائي صحي',
    'حافظ على وزن صحي',
    'افحص مستوى السكر بانتظام',
    'استشر طبيبك لتقييم حالتك'
  ];

  return {
    score,
    category,
    level,
    recommendations,
    details,
    needsAttention
  };
};

export const assessAnxiety = (answers: number[]): AnxietyResult => {
  const totalScore = answers.reduce((sum, answer) => sum + answer, 0);

  let level: 'low' | 'moderate' | 'high' | 'very-high';
  let category: string;
  let details: string;
  let needsAttention = false;

  if (totalScore <= 5) {
    level = 'low';
    category = 'قلق خفيف';
    details = 'مستوى قلق طبيعي';
  } else if (totalScore <= 10) {
    level = 'moderate';
    category = 'قلق متوسط';
    details = 'قد تحتاج إلى بعض الدعم';
  } else if (totalScore <= 15) {
    level = 'high';
    category = 'قلق شديد';
    details = 'يُنصح بالتحدث مع أخصائي';
    needsAttention = true;
  } else {
    level = 'very-high';
    category = 'قلق حاد';
    details = 'يجب التحدث مع أخصائي في أقرب وقت ممكن';
    needsAttention = true;
  }

  const recommendations = [
    'مارس تقنيات الاسترخاء',
    'مارس الرياضة بانتظام',
    'تجنب الكافيين والكحول',
    'احصل على قسط كاف من النوم',
    'تحدث مع شخص تثق به'
  ];

  return {
    score: totalScore,
    category,
    level,
    recommendations,
    details,
    needsAttention
  };
};

export const assessDepression = (answers: number[]): HealthToolResult => {
  const totalScore = answers.reduce((sum, answer) => sum + answer, 0);

  let level: 'low' | 'moderate' | 'high' | 'very-high';
  let category: string;
  let details: string;
  let needsAttention = false;

  if (totalScore <= 4) {
    level = 'low';
    category = 'لا يوجد اكتئاب';
    details = 'لا تظهر عليك أعراض اكتئاب';
  } else if (totalScore <= 9) {
    level = 'moderate';
    category = 'اكتئاب خفيف';
    details = 'قد تعاني من أعراض اكتئاب خفيفة';
  } else if (totalScore <= 14) {
    level = 'high';
    category = 'اكتئاب متوسط';
    details = 'يُنصح بالتحدث مع أخصائي';
    needsAttention = true;
  } else if (totalScore <= 19) {
    level = 'high';
    category = 'اكتئاب شديد';
    details = 'يجب التحدث مع أخصائي في أقرب وقت ممكن';
    needsAttention = true;
  } else {
    level = 'very-high';
    category = 'اكتئاب حاد';
    details = 'يجب طلب المساعدة فوراً';
    needsAttention = true;
  }

  const recommendations = [
    'مارس الرياضة بانتظام',
    'احصل على قسط كاف من النوم',
    'تجنب العزلة الاجتماعية',
    'تحدث مع شخص تثق به',
    'استشر أخصائي نفسي'
  ];

  return {
    score: totalScore,
    category,
    level,
    recommendations,
    details,
    needsAttention
  };
};

export const calculatePregnancy = (lastPeriod: Date, cycleLength: number): PregnancyResult => {
  const ovulationDate = new Date(lastPeriod);
  ovulationDate.setDate(lastPeriod.getDate() + cycleLength - 14);

  const dueDate = new Date(lastPeriod);
  dueDate.setDate(lastPeriod.getDate() + 280);

  const today = new Date();
  const timeDiff = today.getTime() - lastPeriod.getTime();
  const weeksPregnant = Math.floor(timeDiff / (1000 * 3600 * 24 * 7));

  let trimester = 1;
  if (weeksPregnant > 13 && weeksPregnant <= 27) {
    trimester = 2;
  } else if (weeksPregnant > 27) {
    trimester = 3;
  }

  const milestones = [
    'الأسبوع 8: يبدأ تكون الأعضاء الرئيسية',
    'الأسبوع 12: يمكن سماع نبضات قلب الجنين',
    'الأسبوع 20: يمكنك معرفة جنس الجنين',
    'الأسبوع 30: يكتمل نمو معظم الأعضاء'
  ];

  const recommendations = [
    'تناولي حمض الفوليك',
    'احصلي على غذاء متوازن',
    'مارسي الرياضة الخفيفة',
    'تجنبي التدخين والكحول',
    'زوري طبيبك بانتظام'
  ];

  return {
    dueDate,
    weeksPregnant,
    trimester,
    milestones,
    recommendations
  };
};

export const calculateOvulation = (lastPeriod: Date, cycleLength: number, periodLength: number): OvulationResult => {
  const ovulationDate = new Date(lastPeriod);
  ovulationDate.setDate(lastPeriod.getDate() + cycleLength - 14);

  const fertilityWindowStart = new Date(ovulationDate);
  fertilityWindowStart.setDate(ovulationDate.getDate() - 5);

  const fertilityWindowEnd = new Date(ovulationDate);
  fertilityWindowEnd.setDate(ovulationDate.getDate() + 1);

  const nextPeriod = new Date(lastPeriod);
  nextPeriod.setDate(lastPeriod.getDate() + cycleLength);

  let cycle = 'دورة منتظمة';
  if (cycleLength < 21 || cycleLength > 35) {
    cycle = 'دورة غير منتظمة';
  }

  const tips = [
    'مارسي الجماع بانتظام خلال نافذة الخصوبة',
    'استخدمي اختبارات التبويض لتحديد موعد التبويض بدقة',
    'حافظي على وزن صحي',
    'تجنبي التدخين والكحول',
    'قللي من التوتر'
  ];

  return {
    ovulationDate,
    fertilityWindow: { start: fertilityWindowStart, end: fertilityWindowEnd },
    nextPeriod,
    cycle,
    tips
  };
};

export const calculateWaistRisk = (waist: number, height: number, age: number, gender: string): WaistResult => {
  const waistToHeightRatio = waist / height;
  
  let riskLevel: 'low' | 'moderate' | 'high' | 'very-high';
  let category: string;
  
  if (waistToHeightRatio < 0.4) {
    riskLevel = 'low';
    category = 'مخاطر منخفضة';
  } else if (waistToHeightRatio < 0.5) {
    riskLevel = 'moderate';
    category = 'مخاطر متوسطة';
  } else if (waistToHeightRatio < 0.6) {
    riskLevel = 'high';
    category = 'مخاطر عالية';
  } else {
    riskLevel = 'very-high';
    category = 'مخاطر عالية جداً';
  }
  
  const idealRange = {
    min: Math.round(height * 0.35),
    max: Math.round(height * 0.45)
  };
  
  const recommendations = [
    'مارس التمارين الرياضية بانتظام لتقليل دهون البطن',
    'اتبع نظاماً غذائياً متوازناً وقلل من السكريات',
    'زد من تناول الألياف والبروتينات الصحية',
    'احرص على النوم الكافي (7-8 ساعات)',
    'قلل من التوتر بممارسة تقنيات الاسترخاء',
    'تجنب المشروبات السكرية والكحولية'
  ];
  
  return {
    waistToHeightRatio,
    riskLevel,
    category,
    recommendations,
    idealRange
  };
};

export const calculateStepsCalories = (
  steps: number, 
  weight: number, 
  height: number, 
  age: number, 
  gender: string,
  intensity: string
): StepsCaloriesResult => {
  // Calculate stride length based on height and gender
  const strideLength = gender === 'male' ? height * 0.415 : height * 0.413;
  const distance = (steps * strideLength) / 100000; // in km
  
  // Calculate calories based on intensity
  let caloriesPerStep: number;
  switch (intensity) {
    case 'slow': caloriesPerStep = 0.04; break;
    case 'moderate': caloriesPerStep = 0.05; break;
    case 'fast': caloriesPerStep = 0.06; break;
    case 'veryFast': caloriesPerStep = 0.08; break;
    default: caloriesPerStep = 0.05;
  }
  
  // Adjust for weight
  const weightFactor = weight / 70; // 70kg as baseline
  const caloriesBurned = Math.round(steps * caloriesPerStep * weightFactor);
  
  const activeMinutes = Math.round(steps / 100); // Approximate active minutes
  
  const recommendations = [
    `زد عدد خطواتك تدريجياً للوصول إلى ${Math.min(steps + 2000, 15000)} خطوة يومياً`,
    'اجعل المشي جزءاً من روتينك اليومي',
    'استخدم السلالم بدلاً من المصعد',
    'امش لمسافات قصيرة بدلاً من استخدام السيارة',
    'مارس المشي مع أصدقائك أو عائلتك'
  ];
  
  const weeklyProgress = [
    `الاثنين: ${steps} خطوة - مشي عادي`,
    `الثلاثاء: ${Math.round(steps * 1.1)} خطوة - زيادة 10%`,
    `الأربعاء: ${steps} خطوة - مشي متوسط`,
    `الخميس: ${Math.round(steps * 1.2)} خطوة - تحدي إضافي`,
    `الجمعة: ${steps} خطوة - مشي مريح`,
    `السبت: ${Math.round(steps * 1.3)} خطوة - مشي طويل`,
    `الأحد: ${Math.round(steps * 0.8)} خطوة - راحة نسبية`
  ];
  
  return {
    caloriesBurned,
    distance,
    activeMinutes,
    recommendations,
    weeklyProgress
  };
};

export const assessDentalDecayRisk = (answers: { [key: string]: string }): DentalResult => {
  let score = 0;
  
  // Define scoring system with proper typing
  const scoringRules: { [key: string]: { [key: string]: number } } = {
    brushingFrequency: { never: 4, once: 3, twice: 1, moreThanTwice: 0 },
    flossing: { never: 3, sometimes: 2, regularly: 0 },
    sugarIntake: { rarely: 0, once: 1, twiceThree: 2, moreThanThree: 3 },
    dentalVisits: { sixMonths: 0, year: 1, twoYears: 2, moreThanTwo: 3 },
    fluoride: { yes: 0, no: 2, dontKnow: 1 },
    dryMouth: { no: 0, sometimes: 1, often: 2 },
    previousCavities: { never: 0, few: 1, several: 2, many: 3 },
    smoking: { no: 0, occasionally: 1, regularly: 2 }
  };
  
  // Calculate score safely
  Object.keys(answers).forEach(key => {
    if (scoringRules[key] && scoringRules[key][answers[key]]) {
      score += scoringRules[key][answers[key]];
    }
  });
  
  let riskLevel: 'low' | 'moderate' | 'high' | 'very-high';
  let category: string;
  
  if (score <= 5) {
    riskLevel = 'low';
    category = 'مخاطر منخفضة لتسوس الأسنان';
  } else if (score <= 10) {
    riskLevel = 'moderate';
    category = 'مخاطر متوسطة لتسوس الأسنان';
  } else if (score <= 15) {
    riskLevel = 'high';
    category = 'مخاطر عالية لتسوس الأسنان';
  } else {
    riskLevel = 'very-high';
    category = 'مخاطر عالية جداً لتسوس الأسنان';
  }
  
  const recommendations = [
    'نظف أسنانك مرتين يومياً بمعجون يحتوي على الفلورايد',
    'استخدم خيط الأسنان يومياً لإزالة البلاك',
    'قلل من تناول السكريات والحلويات',
    'زر طبيب الأسنان كل 6 أشهر للفحص والتنظيف',
    'استخدم غسول الفم المضاد للبكتيريا',
    'تجنب التدخين ومنتجات التبغ',
    'اشرب الماء بكثرة لتجنب جفاف الفم'
  ];
  
  return {
    riskLevel,
    category,
    recommendations,
    warningSign: score > 15
  };
};

export const assessDentalVisitNeed = (symptoms: { [key: string]: string }): DentalVisitResult => {
  let urgencyScore = 0;
  
  // Emergency symptoms
  if (symptoms.severePain === 'yes' || symptoms.swelling === 'yes' || symptoms.trauma === 'yes') {
    urgencyScore += 10;
  }
  
  // Urgent symptoms  
  if (symptoms.bleeding === 'persistent' || symptoms.looseTooth === 'yes' || symptoms.infection === 'yes') {
    urgencyScore += 7;
  }
  
  // Moderate symptoms
  if (symptoms.sensitivity === 'severe' || symptoms.badBreath === 'persistent' || symptoms.gumPain === 'yes') {
    urgencyScore += 4;
  }
  
  // Mild symptoms
  if (symptoms.staining === 'yes' || symptoms.mildPain === 'yes' || symptoms.tartar === 'yes') {
    urgencyScore += 2;
  }
  
  let urgency: 'routine' | 'soon' | 'urgent' | 'emergency';
  let category: string;
  let timeframe: string;
  let firstAid: string[] = [];
  
  if (urgencyScore >= 10) {
    urgency = 'emergency';
    category = 'حالة طوارئ أسنان';
    timeframe = 'خلال ساعات قليلة';
    firstAid = [
      'اتصل بطبيب الأسنان فوراً أو توجه للطوارئ',
      'ضع كمادة باردة على الخد المتورم',
      'تناول مسكن ألم مناسب',
      'لا تضع أسبرين مباشرة على السن'
    ];
  } else if (urgencyScore >= 7) {
    urgency = 'urgent';
    category = 'يحتاج زيارة عاجلة';
    timeframe = 'خلال 24-48 ساعة';
  } else if (urgencyScore >= 4) {
    urgency = 'soon';
    category = 'يحتاج زيارة قريبة';
    timeframe = 'خلال أسبوع';
  } else {
    urgency = 'routine';
    category = 'فحص روتيني';
    timeframe = 'خلال شهر أو عند الفحص الدوري';
  }
  
  const recommendations = [
    'حافظ على نظافة الأسنان حتى موعد الزيارة',
    'تجنب الأطعمة الصلبة إذا كان هناك ألم',
    'استخدم مسكن ألم مناسب حسب الحاجة',
    'تجنب المشروبات الساخنة أو الباردة جداً'
  ];
  
  return {
    urgency,
    category,
    recommendations,
    firstAid: firstAid.length > 0 ? firstAid : undefined,
    timeframe
  };
};

export const assessBloodPressureRisk = (formData: { [key: string]: any }): BloodPressureRiskResult => {
  let score = 0;
  
  // Age factor
  if (formData.age >= 65) score += 3;
  else if (formData.age >= 45) score += 2;
  else if (formData.age >= 35) score += 1;
  
  // Family history
  if (formData.familyHistory === 'yes') score += 3;
  
  // Lifestyle factors
  if (formData.smoking === 'yes') score += 2;
  if (formData.alcohol === 'heavy') score += 2;
  else if (formData.alcohol === 'moderate') score += 1;
  
  // Physical factors
  if (formData.bmi >= 30) score += 3;
  else if (formData.bmi >= 25) score += 2;
  
  if (formData.exercise === 'never') score += 2;
  else if (formData.exercise === 'rarely') score += 1;
  
  // Medical conditions
  if (formData.diabetes === 'yes') score += 2;
  if (formData.kidney === 'yes') score += 2;
  if (formData.stress === 'high') score += 2;
  
  // Salt intake
  if (formData.saltIntake === 'high') score += 2;
  else if (formData.saltIntake === 'moderate') score += 1;
  
  let riskLevel: 'low' | 'moderate' | 'high' | 'very-high';
  let category: string;
  let needsAttention = false;
  
  if (score <= 3) {
    riskLevel = 'low';
    category = 'مخاطر منخفضة لارتفاع ضغط الدم';
  } else if (score <= 7) {
    riskLevel = 'moderate';
    category = 'مخاطر متوسطة لارتفاع ضغط الدم';
  } else if (score <= 12) {
    riskLevel = 'high';
    category = 'مخاطر عالية لارتفاع ضغط الدم';
    needsAttention = true;
  } else {
    riskLevel = 'very-high';
    category = 'مخاطر عالية جداً لارتفاع ضغط الدم';
    needsAttention = true;
  }
  
  const recommendations = [
    'قس ضغط دمك بانتظام',
    'قلل من تناول الملح والصوديوم',
    'مارس الرياضة بانتظام 30 دقيقة يومياً',
    'حافظ على وزن صحي',
    'تجنب التدخين والكحول',
    'تناول غذاء غني بالبوتاسيوم والمغنيسيوم'
  ];
  
  const lifestyle = [
    'نظام DASH الغذائي (غني بالخضروات والفواكه)',
    'تقليل التوتر بتقنيات الاسترخاء',
    'النوم الكافي 7-8 ساعات يومياً',
    'تجنب الأطعمة المصنعة والوجبات السريعة'
  ];
  
  return {
    riskLevel,
    category,
    recommendations,
    lifestyle,
    needsAttention
  };
};

export const assessHealthyHabits = (habits: { [key: string]: number }): HealthyHabitsResult => {
  const categories = {
    nutrition: habits.nutrition || 0,
    exercise: habits.exercise || 0,
    sleep: habits.sleep || 0,
    stress: habits.stress || 0,
    social: habits.social || 0
  };
  
  const overallScore = Math.round(
    (categories.nutrition + categories.exercise + categories.sleep + categories.stress + categories.social) / 5
  );
  
  const recommendations = [];
  const priority = [];
  
  if (categories.nutrition < 7) {
    recommendations.push('حسّن نظامك الغذائي بتناول المزيد من الخضروات والفواكه');
    priority.push('التغذية');
  }
  
  if (categories.exercise < 7) {
    recommendations.push('زد من نشاطك البدني لـ 150 دقيقة أسبوعياً');
    priority.push('الرياضة');
  }
  
  if (categories.sleep < 7) {
    recommendations.push('حسّن جودة نومك والتزم بمواعيد ثابتة');
    priority.push('النوم');
  }
  
  if (categories.stress < 7) {
    recommendations.push('طبق تقنيات إدارة التوتر والاسترخاء');
    priority.push('إدارة التوتر');
  }
  
  if (categories.social < 7) {
    recommendations.push('عزز علاقاتك الاجتماعية وشارك في أنشطة جماعية');
    priority.push('التواصل الاجتماعي');
  }
  
  if (recommendations.length === 0) {
    recommendations.push('ممتاز! حافظ على نمط حياتك الصحي الحالي');
  }
  
  return {
    overallScore,
    categories,
    recommendations,
    priority
  };
};

export const assessPregnancySymptoms = (symptoms: { [key: string]: string }, weeks: number): PregnancySymptomsResult => {
  let warningScore = 0;
  let warningSign = false;
  
  // Emergency symptoms
  if (symptoms.severeBleeding === 'yes' || symptoms.severePain === 'yes' || symptoms.noMovement === 'yes') {
    warningScore = 10;
    warningSign = true;
  }
  
  // Warning symptoms
  if (symptoms.bleeding === 'yes' || symptoms.fever === 'yes' || symptoms.severeHeadache === 'yes') {
    warningScore += 5;
  }
  
  // Moderate concerns
  if (symptoms.swelling === 'sudden' || symptoms.visionChanges === 'yes' || symptoms.contractions === 'yes') {
    warningScore += 3;
  }
  
  let status: 'normal' | 'monitor' | 'urgent';
  let category: string;
  
  if (warningScore >= 10) {
    status = 'urgent';
    category = 'أعراض تحتاج رعاية طبية فورية';
  } else if (warningScore >= 5) {
    status = 'monitor';
    category = 'أعراض تحتاج متابعة طبية';
  } else {
    status = 'normal';
    category = 'أعراض طبيعية للحمل';
  }
  
  const recommendations = [];
  const nextSteps = [];
  
  if (status === 'urgent') {
    recommendations.push('اتصلي بطبيبك فوراً أو توجه للطوارئ');
    nextSteps.push('لا تنتظري - اطلبي المساعدة الطبية الآن');
  } else if (status === 'monitor') {
    recommendations.push('احجزي موعداً مع طبيبك خلال يوم أو يومين');
    nextSteps.push('راقبي الأعراض وسجلي أي تغييرات');
  } else {
    recommendations.push('هذه أعراض طبيعية للحمل');
    nextSteps.push('واصلي متابعتك الدورية مع الطبيب');
  }
  
  return {
    status,
    category,
    recommendations,
    warningSign,
    nextSteps
  };
};

export const assessMedicalSpecialty = (formData: { [key: string]: string }): MedicalSpecialtyResult => {
  const { primarySymptom, duration, severity, bodyPart, additionalSymptoms } = formData;
  
  // Emergency conditions check
  if (severity === 'unbearable' || 
      (primarySymptom === 'breathing' && severity === 'severe') ||
      (primarySymptom === 'pain' && bodyPart === 'chest' && severity === 'severe') ||
      (additionalSymptoms && additionalSymptoms.toLowerCase().includes('فقدان وعي'))) {
    
    return {
      recommendedSpecialty: 'طوارئ - توجه فوراً للمستشفى',
      urgency: 'emergency',
      reasoning: 'أعراضك تشير إلى حالة طارئة تتطلب تدخلاً طبياً فورياً',
      questionsForDoctor: [
        'منذ متى بدأت هذه الأعراض؟',
        'هل تناولت أي أدوية؟',
        'هل لديك حساسية من أدوية معينة؟'
      ],
      firstAid: [
        'حافظ على الهدوء',
        'اتصل بالإسعاف فوراً',
        'لا تأخذ أي أدوية بدون استشارة طبية'
      ]
    };
  }
  
  // Specialty determination logic
  let recommendedSpecialty = 'طب عام (باطنة)';
  let reasoning = 'ننصح بزيارة طبيب الباطنة للتقييم الأولي';
  let urgency: 'low' | 'moderate' | 'high' | 'emergency' = 'moderate';
  
  // Specific specialty routing
  if (primarySymptom === 'headache' || primarySymptom === 'mental') {
    if (primarySymptom === 'mental') {
      recommendedSpecialty = 'طب نفسي';
      reasoning = 'الأعراض النفسية تحتاج لتقييم أخصائي الصحة النفسية';
    } else {
      recommendedSpecialty = 'طب أعصاب';
      reasoning = 'الصداع المستمر يحتاج لتقييم أخصائي الأعصاب';
    }
  } else if (primarySymptom === 'vision') {
    recommendedSpecialty = 'طب عيون';
    reasoning = 'مشاكل البصر تحتاج لفحص أخصائي العيون';
  } else if (primarySymptom === 'hearing') {
    recommendedSpecialty = 'أنف وأذن وحنجرة';
    reasoning = 'مشاكل السمع تحتاج لفحص أخصائي الأنف والأذن والحنجرة';
  } else if (primarySymptom === 'skin') {
    recommendedSpecialty = 'طب جلدية';
    reasoning = 'مشاكل الجلد تحتاج لفحص أخصائي الجلدية';
  } else if (primarySymptom === 'digestive') {
    recommendedSpecialty = 'طب جهاز هضمي';
    reasoning = 'مشاكل الهضم تحتاج لتقييم أخصائي الجهاز الهضمي';
  } else if (bodyPart === 'joints' || (primarySymptom === 'pain' && bodyPart === 'back')) {
    recommendedSpecialty = 'طب عظام ومفاصل';
    reasoning = 'آلام المفاصل والظهر تحتاج لفحص أخصائي العظام';
  } else if (primarySymptom === 'breathing' || bodyPart === 'chest') {
    recommendedSpecialty = 'طب قلب وصدر';
    reasoning = 'مشاكل التنفس والصدر تحتاج لفحص أخصائي القلب والصدر';
  }
  
  // Urgency assessment
  if (severity === 'severe') {
    urgency = 'high';
  } else if (severity === 'moderate' || duration === 'weeks') {
    urgency = 'moderate';
  } else {
    urgency = 'low';
  }
  
  const questionsForDoctor = [
    'ما هي شدة الأعراض من 1 إلى 10؟',
    'هل تتحسن الأعراض أم تزداد سوءاً؟',
    'هل هناك شيء يخفف من الأعراض؟',
    'هل لديك تاريخ عائلي لمشاكل مشابهة؟',
    'ما الأدوية التي تتناولها حالياً؟'
  ];
  
  return {
    recommendedSpecialty,
    urgency,
    reasoning,
    questionsForDoctor
  };
};

export const calculateVaccinationSchedule = (birthDate: Date): VaccinationResult => {
  const today = new Date();
  const schedule: VaccinationEntry[] = [];
  let nextDue: VaccinationEntry | null = null;
  
  EGYPTIAN_VACCINATION_SCHEDULE.forEach(vaccine => {
    const dueDate = new Date(birthDate);
    dueDate.setMonth(dueDate.getMonth() + vaccine.ageMonths);
    
    const ageDisplay = vaccine.ageMonths === 0 ? 'عند الولادة' : 
                      vaccine.ageMonths < 12 ? `${vaccine.ageMonths} شهر` : 
                      `${Math.floor(vaccine.ageMonths / 12)} سنة`;
    
    const daysDiff = Math.floor((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
    const isOverdue = daysDiff > 30; // Consider overdue if more than 30 days late
    const isDue = daysDiff >= -7 && daysDiff <= 30; // Due within a week or up to 30 days late
    
    const entry: VaccinationEntry = {
      name: vaccine.name,
      arabicName: vaccine.arabicName,
      ageMonths: vaccine.ageMonths,
      ageDisplay,
      dueDate,
      description: vaccine.description,
      isOverdue,
      isDue,
      category: vaccine.category
    };
    
    schedule.push(entry);
    
    // Find next due vaccination
    if (!nextDue && (isDue || dueDate > today)) {
      nextDue = entry;
    }
  });
  
  // Sort by age months
  schedule.sort((a, b) => a.ageMonths - b.ageMonths);
  
  const completedCount = schedule.filter(v => !v.isDue && !v.isOverdue && v.dueDate <= today).length;
  const overdueCount = schedule.filter(v => v.isOverdue).length;
  
  const recommendations: string[] = [
    'تأكدي من الاحتفاظ بسجل التطعيمات',
    'استشيري طبيب الأطفال قبل موعد كل تطعيم',
    'راقبي الطفل لمدة 24 ساعة بعد التطعيم',
    'التطعيمات الاختيارية مهمة أيضاً لحماية أفضل'
  ];
  
  const warnings: string[] = [];
  if (overdueCount > 0) {
    warnings.push(`يوجد ${overdueCount} تطعيم متأخر - راجعي طبيب الأطفال فوراً`);
  }
  if (nextDue && nextDue.isDue) {
    warnings.push(`موعد تطعيم ${nextDue.arabicName} مستحق الآن`);
  }
  
  return {
    schedule,
    nextDue,
    completedCount,
    totalCount: EGYPTIAN_VACCINATION_SCHEDULE.length,
    recommendations,
    warnings
  };
};

export const calculateSafeDosage = (
  weight: number, 
  ageMonths: number, 
  medication: 'paracetamol' | 'ibuprofen'
): MedicationDosageResult => {
  const ageYears = ageMonths / 12;
  
  // Paracetamol calculations (10-15 mg/kg per dose, max 60 mg/kg/day)
  const paracetamolSingle = Math.round(weight * 12.5); // Average 12.5 mg/kg
  const paracetamolDaily = Math.round(weight * 50); // 50 mg/kg/day (safe limit)
  const paracetamolMax = Math.round(weight * 60); // Maximum daily
  const paracetamolTimes = 4; // Every 6 hours
  
  // Ibuprofen calculations (5-10 mg/kg per dose, max 30 mg/kg/day)
  // Not recommended under 6 months
  const ibuprofenSingle = ageMonths >= 6 ? Math.round(weight * 7.5) : 0; // Average 7.5 mg/kg
  const ibuprofenDaily = ageMonths >= 6 ? Math.round(weight * 25) : 0; // 25 mg/kg/day
  const ibuprofenMax = ageMonths >= 6 ? Math.round(weight * 30) : 0; // Maximum daily
  const ibuprofenTimes = ageMonths >= 6 ? 3 : 0; // Every 8 hours
  
  const warnings: string[] = [];
  const recommendations: string[] = [
    'استخدمي الجرعة حسب الوزن وليس العمر',
    'لا تتجاوزي الجرعة القصوى اليومية',
    'استشيري الطبيب إذا استمرت الأعراض أكثر من 3 أيام',
    'احتفظي بسجل مواعيد وجرعات الدواء'
  ];
  
  const emergencyInfo: string[] = [
    'في حالة تناول جرعة زائدة: اتصلي بالطوارئ فوراً',
    'علامات التسمم: قيء، ألم بطن شديد، صعوبة تنفس',
    'رقم مركز السموم: 0223684828'
  ];
  
  if (ageMonths < 3) {
    warnings.push('لا يُنصح بإعطاء الأدوية للأطفال أقل من 3 شهور بدون استشارة طبية');
  }
  
  if (ageMonths < 6) {
    warnings.push('الإيبوبروفين غير مناسب للأطفال أقل من 6 شهور');
  }
  
  if (weight < 4) {
    warnings.push('الوزن منخفض جداً - يجب استشارة طبيب الأطفال');
  }
  
  return {
    paracetamol: {
      singleDose: paracetamolSingle,
      dailyDose: paracetamolDaily,
      maxDailyDose: paracetamolMax,
      timesPerDay: paracetamolTimes,
      isWithinSafeLimit: paracetamolDaily <= paracetamolMax
    },
    ibuprofen: {
      singleDose: ibuprofenSingle,
      dailyDose: ibuprofenDaily,
      maxDailyDose: ibuprofenMax,
      timesPerDay: ibuprofenTimes,
      isWithinSafeLimit: ibuprofenDaily <= ibuprofenMax,
      ageRestriction: ageMonths < 6
    },
    warnings,
    recommendations,
    emergencyInfo
  };
};

export const predictBloodType = (motherType: string, fatherType: string): BloodTypeResult => {
  // Define alleles for each blood type
  const getAlleles = (bloodType: string): string[] => {
    switch (bloodType) {
      case 'A+': return ['A+', 'A+'];
      case 'A-': return ['A-', 'A-'];
      case 'B+': return ['B+', 'B+'];
      case 'B-': return ['B-', 'B-'];
      case 'AB+': return ['A+', 'B+'];
      case 'AB-': return ['A-', 'B-'];
      case 'O+': return ['O+', 'O+'];
      case 'O-': return ['O-', 'O-'];
      default: return ['O+', 'O+'];
    }
  };
  
  const motherAlleles = getAlleles(motherType);
  const fatherAlleles = getAlleles(fatherType);
  
  const combinations: { [key: string]: number } = {};
  
  // Calculate all possible combinations
  motherAlleles.forEach(mAllele => {
    fatherAlleles.forEach(fAllele => {
      const combo = [mAllele, fAllele].sort().join('');
      combinations[combo] = (combinations[combo] || 0) + 1;
    });
  });
  
  // Convert combinations to blood types
  const getBloodTypeFromAlleles = (alleles: string): string => {
    if (alleles.includes('A') && alleles.includes('B')) return alleles.includes('+') ? 'AB+' : 'AB-';
    if (alleles.includes('A')) return alleles.includes('+') ? 'A+' : 'A-';
    if (alleles.includes('B')) return alleles.includes('+') ? 'B+' : 'B-';
    return alleles.includes('+') ? 'O+' : 'O-';
  };
  
  const possibilities: BloodTypePossibility[] = [];
  const total = Object.values(combinations).reduce((sum, count) => sum + count, 0);
  
  Object.entries(combinations).forEach(([combo, count]) => {
    const bloodType = getBloodTypeFromAlleles(combo);
    const probability = Math.round((count / total) * 100);
    
    const existing = possibilities.find(p => p.bloodType === bloodType);
    if (existing) {
      existing.probability += probability;
    } else {
      possibilities.push({
        bloodType,
        probability,
        geneticCombination: combo
      });
    }
  });
  
  possibilities.sort((a, b) => b.probability - a.probability);
  
  const mostLikely = possibilities[0]?.bloodType || 'غير محدد';
  
  const explanation = `بناءً على قوانين الوراثة، عند تزاوج شخص بفصيلة ${motherType} مع شخص بفصيلة ${fatherType}، يمكن أن ينتج الأطفال بالفصائل المذكورة بالاحتماليات المبينة.`;
  
  const genetics = 'فصيلة الدم تتحدد بواسطة الجينات التي يحملها كل من الوالدين. كل شخص يحمل جينين لفصيلة الدم، ويورث جين واحد لكل طفل.';
  
  const recommendations = [
    'هذا التنبؤ للتوعية العلمية فقط',
    'فصيلة الدم الفعلية تُحدد بالتحليل المعملي',
    'يُنصح بمعرفة فصيلة دم الطفل مبكراً للطوارئ',
    'احتفظي بسجل فصائل دم العائلة'
  ];
  
  return {
    possibleTypes: possibilities,
    mostLikely,
    explanation,
    genetics,
    recommendations
  };
};

export const EGYPTIAN_VACCINATION_SCHEDULE = [
  { name: 'BCG', arabicName: 'لقاح السل', ageMonths: 0, description: 'يحمي من مرض السل', category: 'mandatory' as const },
  { name: 'Hepatitis B (Birth)', arabicName: 'التهاب الكبد ب (الولادة)', ageMonths: 0, description: 'الجرعة الأولى من لقاح التهاب الكبد الوبائي ب', category: 'mandatory' as const },
  { name: 'OPV 1', arabicName: 'شلل الأطفال الأولى', ageMonths: 2, description: 'الجرعة الأولى من لقاح شلل الأطفال', category: 'mandatory' as const },
  { name: 'DTP-HepB-Hib 1', arabicName: 'الخماسي الأولى', ageMonths: 2, description: 'اللقاح الخماسي (الدفتريا والتيتانوس والسعال الديكي والتهاب الكبد ب والإنفلونزا)', category: 'mandatory' as const },
  { name: 'OPV 2', arabicName: 'شلل الأطفال الثانية', ageMonths: 4, description: 'الجرعة الثانية من لقاح شلل الأطفال', category: 'mandatory' as const },
  { name: 'DTP-HepB-Hib 2', arabicName: 'الخماسي الثانية', ageMonths: 4, description: 'الجرعة الثانية من اللقاح الخماسي', category: 'mandatory' as const },
  { name: 'OPV 3', arabicName: 'شلل الأطفال الثالثة', ageMonths: 6, description: 'الجرعة الثالثة من لقاح شلل الأطفال', category: 'mandatory' as const },
  { name: 'DTP-HepB-Hib 3', arabicName: 'الخماسي الثالثة', ageMonths: 6, description: 'الجرعة الثالثة من اللقاح الخماسي', category: 'mandatory' as const },
  { name: 'MMR 1', arabicName: 'الحصبة والحصبة الألمانية والنكاف الأولى', ageMonths: 12, description: 'لقاح الحصبة والحصبة الألمانية والنكاف', category: 'mandatory' as const },
  { name: 'OPV Booster', arabicName: 'شلل الأطفال المنشطة', ageMonths: 18, description: 'الجرعة المنشطة من لقاح شلل الأطفال', category: 'mandatory' as const },
  { name: 'DTP Booster', arabicName: 'الثلاثي المنشطة', ageMonths: 18, description: 'الجرعة المنشطة من اللقاح الثلاثي', category: 'mandatory' as const },
  { name: 'MMR 2', arabicName: 'الحصبة والحصبة الألمانية والنكاف الثانية', ageMonths: 18, description: 'الجرعة الثانية من لقاح الحصبة والحصبة الألمانية والنكاف', category: 'mandatory' as const },
  { name: 'DT Booster', arabicName: 'الثنائي المنشطة', ageMonths: 72, description: 'اللقاح الثنائي المنشط في سن المدرسة', category: 'mandatory' as const },
  // Optional vaccines
  { name: 'Rotavirus 1', arabicName: 'فيروس الروتا الأولى', ageMonths: 2, description: 'يحمي من الإسهال الشديد', category: 'optional' as const },
  { name: 'Rotavirus 2', arabicName: 'فيروس الروتا الثانية', ageMonths: 4, description: 'الجرعة الثانية من لقاح فيروس الروتا', category: 'optional' as const },
  { name: 'Pneumococcal 1', arabicName: 'المكورات الرئوية الأولى', ageMonths: 2, description: 'يحمي من عدوى المكورات الرئوية', category: 'optional' as const },
  { name: 'Pneumococcal 2', arabicName: 'المكورات الرئوية الثانية', ageMonths: 4, description: 'الجرعة الثانية من لقاح المكورات الرئوية', category: 'optional' as const },
  { name: 'Pneumococcal 3', arabicName: 'المكورات الرئوية الثالثة', ageMonths: 6, description: 'الجرعة الثالثة من لقاح المكورات الرئوية', category: 'optional' as const },
  { name: 'Pneumococcal Booster', arabicName: 'المكورات الرئوية المنشطة', ageMonths: 12, description: 'الجرعة المنشطة من لقاح المكورات الرئوية', category: 'optional' as const },
];
