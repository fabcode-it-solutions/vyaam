import { create } from 'zustand';

import type { DietIntakeInput } from '@/lib/api/endpoints/dietPlan';
import type { WorkoutIntakeInput } from '@/lib/api/endpoints/workoutPlan';

/**
 * Cross-screen draft state for the diet and workout intake wizards
 * (CLAUDE.md: "in-progress AI-plan-generation job status" belongs in
 * Zustand, not per-screen local state or Context). Each step screen writes
 * its answers here; the last step submits the accumulated draft and stores
 * the resulting job id for the Generating screen to poll.
 *
 * Intentionally not persisted — an abandoned mid-flow draft shouldn't
 * resurrect on next app launch.
 */

type DietIntakeDraft = Partial<DietIntakeInput>;
type WorkoutIntakeDraft = Partial<WorkoutIntakeInput>;

type IntakeState = {
  diet: DietIntakeDraft;
  dietJobId: string | null;
  workout: WorkoutIntakeDraft;
  workoutJobId: string | null;

  setDietAnswers: (patch: DietIntakeDraft) => void;
  setDietJobId: (jobId: string | null) => void;
  resetDiet: () => void;

  setWorkoutAnswers: (patch: WorkoutIntakeDraft) => void;
  setWorkoutJobId: (jobId: string | null) => void;
  resetWorkout: () => void;
};

export const useIntakeStore = create<IntakeState>((set) => ({
  diet: {},
  dietJobId: null,
  workout: {},
  workoutJobId: null,

  setDietAnswers: (patch) => set((state) => ({ diet: { ...state.diet, ...patch } })),
  setDietJobId: (jobId) => set({ dietJobId: jobId }),
  resetDiet: () => set({ diet: {}, dietJobId: null }),

  setWorkoutAnswers: (patch) => set((state) => ({ workout: { ...state.workout, ...patch } })),
  setWorkoutJobId: (jobId) => set({ workoutJobId: jobId }),
  resetWorkout: () => set({ workout: {}, workoutJobId: null }),
}));
