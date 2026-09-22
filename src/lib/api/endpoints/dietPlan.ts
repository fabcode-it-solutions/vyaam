import { apiRequest } from '../client';

/**
 * Matches vyaam-backend src/validators/dietPlan.validators.ts and
 * src/models/DietIntake.ts exactly — these enums are the wire contract, not
 * display strings (see the intake screens for label mappings).
 */
export type DietGoal =
  | 'lose_fat'
  | 'build_muscle'
  | 'gain_weight'
  | 'maintain'
  | 'improve_endurance'
  | 'general_health';

export type SafetyFlag =
  | 'pregnant_postpartum'
  | 'heart_condition_or_high_bp'
  | 'diabetes'
  | 'thyroid_condition'
  | 'pcos_pcod'
  | 'kidney_or_liver_condition'
  | 'recent_surgery'
  | 'on_regular_medication'
  | 'under_doctors_care';

export type DietType = 'vegetarian' | 'non_vegetarian' | 'vegetarian_with_eggs' | 'vegan' | 'jain' | 'other';

export type Allergy =
  | 'dairy'
  | 'gluten_wheat'
  | 'peanuts'
  | 'eggs'
  | 'soy'
  | 'fish'
  | 'tree_nuts'
  | 'sesame'
  | 'mustard'
  | 'shellfish';

export type DigestiveIssue =
  | 'bloating'
  | 'constipation'
  | 'acidity_reflux'
  | 'gas'
  | 'ibs'
  | 'loose_motions'
  | 'indigestion'
  | 'lactose_intolerance'
  | 'gluten_sensitivity';

export type RegionalCuisine = 'north_indian' | 'south_indian' | 'east_indian' | 'west_indian' | 'other';

export type DietIntakeInput = {
  goal: DietGoal;
  heightCm: number;
  weightKg: number;
  dob?: string;
  safetyFlags?: SafetyFlag[];
  surgeryDetails?: string;
  dietType: DietType;
  allergies?: Allergy[];
  digestiveIssues?: DigestiveIssue[];
  regionalCuisine?: RegionalCuisine;
  mealsPerDay?: number;
};

/** POST /plans/intake/diet — 202, queues generation and returns the job to poll. */
export function submitDietIntake(input: DietIntakeInput) {
  return apiRequest<{ jobId: string }>('/plans/intake/diet', { method: 'POST', body: input });
}

export type PlanGenerationStatus = 'queued' | 'processing' | 'ready' | 'failed';

export type PlanGenerationJobResult = {
  jobId: string;
  status: PlanGenerationStatus;
  planId?: string;
  error?: string;
};

/** GET /plans/intake/jobs/:jobId — shared by both diet and workout generation jobs. */
export function getPlanJobStatus(jobId: string) {
  return apiRequest<PlanGenerationJobResult>(`/plans/intake/jobs/${jobId}`);
}

export type Macros = { proteinG: number; carbsG: number; fatG: number };

export type DietPlanMeal = {
  id: string;
  type: 'breakfast' | 'lunch' | 'snack' | 'dinner';
  name: string;
  calories: number;
  macros: Macros;
  servings: number;
  eaten: boolean;
};

export type DietPlanForDate = {
  planId: string;
  date: string;
  dailyCalorieTarget: number;
  caloriesConsumed: number;
  macroTargets: Macros;
  dietType: DietType;
  regionalCuisine: RegionalCuisine;
  disclaimer: string;
  meals: DietPlanMeal[];
};

/** GET /plans/diet?date= — the active plan's template for that date, plus that date's logged progress. */
export function getDietPlan(date?: string) {
  return apiRequest<DietPlanForDate>(`/plans/diet${date ? `?date=${date}` : ''}`);
}

export type DietMealDetail = {
  id: string;
  planId: string;
  type: DietPlanMeal['type'];
  name: string;
  calories: number;
  macros: Macros;
  baseServings: number;
  ingredients: string[];
  steps: string[];
  date: string;
  eaten: boolean;
  servings: number;
};

/** GET /plans/diet/meals/:mealId?date= — date defaults to today; overlays that date's logged eaten/servings. */
export function getMealDetail(mealId: string, date?: string) {
  return apiRequest<DietMealDetail>(`/plans/diet/meals/${mealId}${date ? `?date=${date}` : ''}`);
}

export type LogMealInput = { servings?: number; eaten?: boolean; date?: string };
export type LogMealResult = { mealId: string; date: string; eaten: boolean; servings: number };

/** PATCH /plans/diet/meals/:mealId/log — provide servings and/or eaten. */
export function logMeal(mealId: string, input: LogMealInput) {
  return apiRequest<LogMealResult>(`/plans/diet/meals/${mealId}/log`, { method: 'PATCH', body: input });
}
