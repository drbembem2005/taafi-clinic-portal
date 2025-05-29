import {
  BMIResult,
  CalorieResult,
  HealthToolResult,
  WaterResult,
  HeartRateResult,
  PregnancyResult,
  OvulationResult,
  AnxietyResult,
  DentalResult,
  WaistResult,
  StepsCaloriesResult,
  BloodPressureRiskResult,
  HealthyHabitsResult,
  PregnancySymptomsResult,
  MedicalSpecialtyResult,
} from '@/types/healthTools';

export const calculateBMI = (weight: number, height: number): BMIResult => {
  const heightInMeters = height / 100;
  const bmi = weight / (heightInMeters * heightInMeters);
  let category = '';
  let recommendations: string[] = [];

  if (bmi < 18.5) {
    category = 'نحافة';
    recommendations = [
      'تناول وجبات غنية بالسعرات الحرارية',
      'زد من كمية البروتين في غذائك',
      'استشر أخصائي تغذية لزيادة الوزن بشكل صحي'
    ];
  } else if (bmi < 25) {
    category = 'وزن طبيعي';
    recommendations = [
      'حافظ على نمط حياة صحي',
      'مارس الرياضة بانتظام',
      'تناول غذاء متوازن'
    ];
  } else if (bmi < 30) {
    category = 'زيادة في الوزن';
    recommendations = [
      'مارس الرياضة بانتظام',
      'قلل من السعرات الحرارية في غذائك',
      'استشر أخصائي تغذية لإنقاص الوزن بشكل صحي'
    ];
  } else {
    category = 'سمنة';
    recommendations = [
      'استشر طبيبك لتقييم حالتك الصحية',
      'اتبع نظام غذائي صحي وممارسة الرياضة بانتظام',
      'فكر في استشارة أخصائي تغذية أو مدرب شخصي'
    ];
  }

  const idealWeight = {
    min: 18.5 * (heightInMeters * heightInMeters),
    max: 24.9 * (heightInMeters * heightInMeters)
  };

  return {
    bmi: parseFloat(bmi.toFixed(1)),
    category,
    idealWeight: {
      min: parseFloat(idealWeight.min.toFixed(1)),
      max: parseFloat(idealWeight.max.toFixed(1))
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
  
  // Calculate risk score based on answers
  const scoring = {
    brushingFrequency: { never: 4, once: 3, twice: 1, moreThanTwice: 0 },
    flossing: { never: 3, sometimes: 2, regularly: 0 },
    sugarIntake: { rarely: 0, once: 1, twiceThree: 2, moreThanThree: 3 },
    dentalVisits: { sixMonths: 0, year: 1, twoYears: 2, moreThanTwo: 3 },
    fluoride: { yes: 0, no: 2, dontKnow: 1 },
    dryMouth: { no: 0, sometimes: 1, often: 2 },
    previousCavities: { never: 0, few: 1, several: 2, many: 3 },
    smoking: { no: 0, occasionally: 1, regularly: 2 }
  };
  
  Object.keys(answers).forEach(key => {
    if (scoring[key as keyof typeof scoring]) {
      score += scoring[key as keyof typeof scoring][answers[key] as keyof typeof scoring[typeof key]] || 0;
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
