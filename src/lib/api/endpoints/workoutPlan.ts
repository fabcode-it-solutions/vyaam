import { apiRequest } from '../client';
import type { PlanGenerationJobResult } from './dietPlan';

/**
 * Matches vyaam-backend src/validators/workoutPlan.validators.ts and
 * src/models/WorkoutIntake.ts exactly.
 */
export type TrainingLocation = 'at_home' | 'at_gym' | 'outdoors' | 'online_with_trainer';

export type Equipment =
  | 'none_bodyweight'
  | 'yoga_mat'
  | 'dumbbells'
  | 'resistance_bands'
  | 'pull_up_bar'
  | 'kettlebell'
  | 'bench'
  | 'treadmill'
  | 'full_home_gym';

export type BodyPart =
  | 'neck'
  | 'shoulder'
  | 'elbow'
  | 'wrist'
  | 'chest'
  | 'upper_back'
  | 'lower_back'
  | 'hip'
  | 'knee'
  | 'ankle'
  | 'other';

export type PainTiming = 'at_rest' | 'during_movement' | 'after_activity';
export type DiagnosedStatus = 'not_diagnosed' | 'diagnosed' | 'seeing_a_physio';

export type PainPoint = {
  bodyPart: BodyPart;
  timing: PainTiming;
  severity: number;
  diagnosedStatus: DiagnosedStatus;
};

export type ExperienceLevel =
  | 'never_trained'
  | 'under_6_months'
  | 'six_months_to_2_years'
  | 'two_years_or_more'
  | 'competitive_athlete';

export type WorkoutIntakeInput = {
  trainingLocation: TrainingLocation;
  equipment?: Equipment[];
  painPoints?: PainPoint[];
  experienceLevel: ExperienceLevel;
  daysPerWeek?: number;
  sessionMinutes?: number;
};

/** POST /plans/intake/workout — 202, queues generation and returns the job to poll. */
export function submitWorkoutIntake(input: WorkoutIntakeInput) {
  return apiRequest<{ jobId: string }>('/plans/intake/workout', { method: 'POST', body: input });
}

export type WorkoutExerciseSummary = {
  id: string;
  name: string;
  muscleGroups: string[];
  sets: number;
  reps: number;
  weightKg?: number;
  videoUrl?: string;
  completed: boolean;
};

export type WorkoutDay = {
  planId: string;
  date: string;
  dayOfWeek: number;
  isRestDay: boolean;
  title?: string;
  focusArea?: string;
  durationMinutes?: number;
  exercises: WorkoutExerciseSummary[];
};

export type WorkoutWeekDay = {
  date: string;
  dayOfWeek: number;
  isRestDay: boolean;
  title?: string;
  focusArea?: string;
  durationMinutes?: number;
  exerciseCount: number;
};

export type WorkoutWeek = {
  planId: string;
  weekOf: string;
  days: WorkoutWeekDay[];
};

/** GET /plans/workout?date= for a single day, or ?weekOf= for the week's day summaries. */
export function getWorkoutDay(date?: string) {
  return apiRequest<WorkoutDay>(`/plans/workout${date ? `?date=${date}` : ''}`);
}

export function getWorkoutWeek(weekOf: string) {
  return apiRequest<WorkoutWeek>(`/plans/workout?weekOf=${weekOf}`);
}

export type WorkoutExerciseDetail = {
  id: string;
  planId: string;
  name: string;
  muscleGroups: string[];
  sets: number;
  reps: number;
  weightKg?: number;
  instructions: string[];
  safetyTip?: string;
  videoUrl?: string;
  date?: string;
  completed: boolean;
};

/** GET /plans/workout/exercises/:exerciseId?date= — date defaults to today; overlays that date's logged completion. */
export function getExerciseDetail(exerciseId: string, date?: string) {
  return apiRequest<WorkoutExerciseDetail>(`/plans/workout/exercises/${exerciseId}${date ? `?date=${date}` : ''}`);
}

export type SubstituteReason = 'pain' | 'no_equipment' | 'dislike';

/** POST /plans/workout/exercises/:exerciseId/substitute */
export function substituteExercise(exerciseId: string, reason: SubstituteReason) {
  return apiRequest<WorkoutExerciseDetail>(`/plans/workout/exercises/${exerciseId}/substitute`, {
    method: 'POST',
    body: { reason },
  });
}

export type LogExerciseInput = { completed: boolean; date?: string };
export type LogExerciseResult = { exerciseId: string; date: string; completed: boolean };

/** PATCH /plans/workout/exercises/:exerciseId/log */
export function logExercise(exerciseId: string, input: LogExerciseInput) {
  return apiRequest<LogExerciseResult>(`/plans/workout/exercises/${exerciseId}/log`, {
    method: 'PATCH',
    body: input,
  });
}

export type { PlanGenerationJobResult };
