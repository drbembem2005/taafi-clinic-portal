
export interface HealthToolResult {
  score?: number;
  category: string;
  level: 'low' | 'moderate' | 'high' | 'very-high';
  recommendations: string[];
  details: string;
  needsAttention?: boolean;
}

export interface BMIResult {
  bmi: number;
  category: string;
  idealWeight: { min: number; max: number };
  recommendations: string[];
}

export interface CalorieResult {
  bmr: number;
  tdee: number;
  targetCalories: number;
  macros: {
    protein: number;
    carbs: number;
    fats: number;
  };
  mealPlan: string[];
}

export interface WaterResult {
  dailyWater: number;
  schedule: string[];
  factors: string[];
}

export interface HeartRateResult {
  restingHR: string;
  targetZones: {
    fatBurn: { min: number; max: number };
    cardio: { min: number; max: number };
    peak: { min: number; max: number };
  };
  recommendations: string[];
}

export interface PregnancyResult {
  dueDate: Date;
  weeksPregnant: number;
  trimester: number;
  milestones: string[];
  recommendations: string[];
}

export interface OvulationResult {
  ovulationDate: Date;
  fertilityWindow: { start: Date; end: Date };
  nextPeriod: Date;
  cycle: string;
  tips: string[];
}

export interface DentalResult {
  riskLevel: 'low' | 'moderate' | 'high' | 'very-high';
  category: string;
  recommendations: string[];
  warningSign: boolean;
}

export interface BreathingSession {
  pattern: string;
  duration: number;
  benefits: string[];
  instructions: string[];
}

export interface FormData {
  [key: string]: any;
}
