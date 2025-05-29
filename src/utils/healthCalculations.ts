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

export const calculateWaterNeeds = (
  weight: number, 
  age: number, 
  activityLevel: string, 
  climate: string,
  pregnancy?: string,
  medicalConditions?: string
) => {
  // Base calculation: 35ml per kg of body weight
  let dailyWater = weight * 35;
  
  // Activity adjustments
  const activityMultipliers: { [key: string]: number } = {
    sedentary: 0,
    light: 300,
    moderate: 500,
    active: 750,
    veryActive: 1000
  };
  dailyWater += activityMultipliers[activityLevel] || 0;
  
  // Climate adjustments
  const climateAdjustments: { [key: string]: number } = {
    temperate: 0,
    hot: 500,
    humid: 300,
    cold: -200
  };
  dailyWater += climateAdjustments[climate] || 0;
  
  // Age adjustments
  if (age > 65) dailyWater += 200;
  if (age < 18) dailyWater += 300;
  
  // Pregnancy and breastfeeding
  if (pregnancy === 'pregnant') dailyWater += 300;
  if (pregnancy === 'breastfeeding') dailyWater += 700;
  
  // Medical conditions
  if (medicalConditions === 'fever') dailyWater += 500;
  if (medicalConditions === 'diabetes') dailyWater += 400;
  
  // Ensure minimum and maximum limits
  dailyWater = Math.max(1500, Math.min(4000, dailyWater));
  
  const schedule = [
    'الاستيقاظ: 250 مل (كوب ماء فاتر)',
    'قبل الإفطار بـ30 دقيقة: 250 مل',
    'بين الإفطار والغداء: 500 مل (كوبين)',
    'قبل الغداء بـ30 دقيقة: 250 مل',
    'بعد الظهر: 500 مل (كوبين)',
    'قبل العشاء بـ30 دقيقة: 250 مل',
    'المساء المبكر: 250 مل',
    'قبل النوم بساعتين: 250 مل'
  ];
  
  const factors = [
    `الوزن: ${weight} كجم (${weight * 35} مل أساسي)`,
    `مستوى النشاط: ${activityLevel} (+${activityMultipliers[activityLevel] || 0} مل)`,
    `المناخ: ${climate} (${climateAdjustments[climate] > 0 ? '+' : ''}${climateAdjustments[climate] || 0} مل)`,
    `العمر: ${age} سنة`
  ];
  
  if (pregnancy && pregnancy !== 'none') {
    factors.push(`حالة خاصة: ${pregnancy}`);
  }
  
  if (medicalConditions && medicalConditions !== 'none') {
    factors.push(`حالة طبية: ${medicalConditions}`);
  }
  
  return {
    dailyWater: Math.round(dailyWater),
    schedule: schedule.slice(0, Math.ceil(dailyWater / 250)),
    factors
  };
};

export const calculateHeartRate = (
  age: number, 
  fitnessLevel: string, 
  restingHR?: number,
  medications?: string
) => {
  const maxHR = 220 - age;
  
  // Target zones based on Karvonen method if resting HR is provided
  let fatBurnMin, fatBurnMax, cardioMin, cardioMax, peakMin, peakMax;
  
  if (restingHR) {
    const hrReserve = maxHR - restingHR;
    fatBurnMin = Math.round(restingHR + (hrReserve * 0.5));
    fatBurnMax = Math.round(restingHR + (hrReserve * 0.7));
    cardioMin = Math.round(restingHR + (hrReserve * 0.7));
    cardioMax = Math.round(restingHR + (hrReserve * 0.85));
    peakMin = Math.round(restingHR + (hrReserve * 0.85));
    peakMax = Math.round(restingHR + (hrReserve * 0.95));
  } else {
    // Simple percentage method
    fatBurnMin = Math.round(maxHR * 0.5);
    fatBurnMax = Math.round(maxHR * 0.7);
    cardioMin = Math.round(maxHR * 0.7);
    cardioMax = Math.round(maxHR * 0.85);
    peakMin = Math.round(maxHR * 0.85);
    peakMax = maxHR;
  }
  
  // Adjust for medications
  if (medications === 'betaBlockers') {
    fatBurnMin = Math.round(fatBurnMin * 0.8);
    fatBurnMax = Math.round(fatBurnMax * 0.8);
    cardioMin = Math.round(cardioMin * 0.8);
    cardioMax = Math.round(cardioMax * 0.8);
  }
  
  let recommendations = [
    `الحد الأقصى المحسوب لمعدل النبض: ${maxHR} نبضة/دقيقة`,
    'منطقة حرق الدهون: مثالية للمبتدئين والتعافي',
    'المنطقة القلبية: لتحسين اللياقة العامة والتحمل',
    'المنطقة القصوى: للرياضيين ذوي الخبرة فقط'
  ];
  
  let restingCategory = 'غير محدد';
  if (restingHR) {
    if (restingHR < 60) restingCategory = 'ممتاز (مستوى رياضي)';
    else if (restingHR < 70) restingCategory = 'جيد جداً';
    else if (restingHR < 80) restingCategory = 'جيد';
    else if (restingHR < 90) restingCategory = 'متوسط';
    else restingCategory = 'يحتاج تحسين - استشر طبيب';
    
    recommendations.unshift(`تقييم معدل النبض أثناء الراحة: ${restingCategory}`);
  }
  
  // Fitness level specific advice
  const fitnessAdvice: { [key: string]: string[] } = {
    beginner: [
      'ابدأ بالمنطقة الدنيا من حرق الدهون',
      'تدرج في زيادة شدة التمرين',
      'استرح يوماً بين أيام التمرين'
    ],
    intermediate: [
      'امزج بين منطقة حرق الدهون والمنطقة القلبية',
      'مارس تمارين متقطعة عالية الشدة مرة أسبوعياً'
    ],
    advanced: [
      'ركز على المنطقة القلبية والقصوى',
      'راقب التعافي بعد التمرين'
    ],
    athlete: [
      'استخدم جميع المناطق في برنامجك التدريبي',
      'راقب التعافي وتجنب الإفراط في التدريب'
    ]
  };
  
  recommendations.push(...(fitnessAdvice[fitnessLevel] || []));
  
  if (medications === 'betaBlockers') {
    recommendations.push('تم تعديل المناطق بسبب أدوية حاصرات بيتا');
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
  
  const milestones: string[] = [];
  const recommendations: string[] = [];
  
  if (trimester === 1) {
    milestones.push(
      'تكوين الأعضاء الرئيسية للجنين',
      'بداية نبضات القلب (الأسبوع 6)',
      'تطور الجهاز العصبي',
      'تكوين الأطراف والأصابع'
    );
    recommendations.push(
      'تناولي حمض الفوليك (400 ميكروغرام يومياً)',
      'تجنبي الكافيين الزائد والكحول',
      'ابدئي بالمتابعة الطبية المنتظمة',
      'تناولي وجبات صغيرة ومتكررة للتعامل مع الغثيان'
    );
  } else if (trimester === 2) {
    milestones.push(
      'إمكانية تحديد جنس الجنين',
      'بداية الشعور بحركة الجنين',
      'نمو الشعر والأظافر',
      'تطور حاسة السمع'
    );
    recommendations.push(
      'إجراء فحص الموجات فوق الصوتية التفصيلي',
      'زيدي من تناول الكالسيوم والبروتين',
      'مارسي رياضة خفيفة آمنة للحمل',
      'ابدئي بتحضير الثدي للرضاعة'
    );
  } else {
    milestones.push(
      'اكتمال نمو الرئتين',
      'اتخاذ الجنين وضعية الولادة',
      'زيادة الوزن السريعة للجنين',
      'نضج جميع الأجهزة الحيوية'
    );
    recommendations.push(
      'حضري خطة الولادة مع طبيبك',
      'راقبي حركة الجنين يومياً',
      'جهزي حقيبة المستشفى',
      'تعلمي تقنيات التنفس للولادة'
    );
  }
  
  return {
    dueDate,
    weeksPregnant,
    trimester,
    milestones,
    recommendations
  };
};

export const calculateOvulation = (lastPeriod: Date, cycleLength: number, periodLength: number) => {
  // Ovulation typically occurs 14 days before next period
  const ovulationDay = cycleLength - 14;
  const ovulationDate = new Date(lastPeriod);
  ovulationDate.setDate(ovulationDate.getDate() + ovulationDay);
  
  // Fertility window: 5 days before ovulation + ovulation day
  const fertilityStart = new Date(ovulationDate);
  fertilityStart.setDate(fertilityStart.getDate() - 5);
  const fertilityEnd = new Date(ovulationDate);
  fertilityEnd.setDate(fertilityEnd.getDate() + 1);
  
  // Next period
  const nextPeriod = new Date(lastPeriod);
  nextPeriod.setDate(nextPeriod.getDate() + cycleLength);
  
  let cycle = '';
  if (cycleLength < 21) {
    cycle = 'دورة قصيرة - قد تحتاجين لاستشارة طبية';
  } else if (cycleLength <= 35) {
    cycle = 'دورة طبيعية ومنتظمة';
  } else {
    cycle = 'دورة طويلة - قد تحتاجين لاستشارة طبية';
  }
  
  const tips = [
    'تتبعي درجة حرارة جسمك الأساسية صباحاً',
    'لاحظي تغيرات الإفرازات المهبلية',
    'استخدمي اختبارات التبويض المنزلية',
    'حافظي على وزن صحي ونظام غذائي متوازن',
    'تجنبي التوتر والضغوط الزائدة',
    'احصلي على نوم كافي (7-8 ساعات)',
    'تناولي الفيتامينات المناسبة (حمض الفوليك)',
    'تواصلي مع شريكك خلال نافذة الخصوبة'
  ];
  
  return {
    ovulationDate,
    fertilityWindow: { start: fertilityStart, end: fertilityEnd },
    nextPeriod,
    cycle,
    tips
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

export const assessDepression = (answers: number[]) => {
  const totalScore = answers.reduce((sum, score) => sum + score, 0);
  
  let level: 'low' | 'moderate' | 'high' | 'very-high';
  let category: string;
  let recommendations: string[] = [];
  
  if (totalScore <= 4) {
    level = 'low';
    category = 'أعراض قليلة أو معدومة';
    recommendations = [
      'الحفاظ على نمط حياة صحي',
      'ممارسة الرياضة بانتظام',
      'الحفاظ على علاقات اجتماعية إيجابية',
      'ممارسة هوايات ممتعة'
    ];
  } else if (totalScore <= 9) {
    level = 'moderate';
    category = 'أعراض اكتئاب خفيفة';
    recommendations = [
      'ممارسة تمارين اليوغا والتأمل',
      'تنظيم جدول نوم منتظم',
      'قضاء وقت في الطبيعة',
      'التحدث مع أصدقاء أو عائلة مقربة'
    ];
  } else if (totalScore <= 14) {
    level = 'high';
    category = 'أعراض اكتئاب متوسطة';
    recommendations = [
      'استشارة أخصائي نفسي أو طبيب نفسي',
      'النظر في العلاج النفسي (CBT)',
      'تجنب الكحول والمواد المخدرة',
      'إنشاء روتين يومي ثابت'
    ];
  } else if (totalScore <= 19) {
    level = 'very-high';
    category = 'أعراض اكتئاب شديدة إلى متوسطة';
    recommendations = [
      'طلب المساعدة الطبية العاجلة',
      'استشارة طبيب نفسي متخصص',
      'النظر في العلاج الدوائي والنفسي',
      'طلب دعم الأهل والأصدقاء'
    ];
  } else {
    level = 'very-high';
    category = 'أعراض اكتئاب شديدة';
    recommendations = [
      'طلب المساعدة الطبية الفورية',
      'الاتصال بخط المساعدة النفسية',
      'تجنب البقاء وحيداً',
      'إبلاغ شخص موثوق بحالتك'
    ];
  }
  
  return {
    score: totalScore,
    level,
    category,
    recommendations,
    details: `النتيجة: ${totalScore} من 27 نقطة`,
    needsAttention: level === 'high' || level === 'very-high'
  };
};
