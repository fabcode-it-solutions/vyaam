export type PainTiming = 'at_rest' | 'during_movement' | 'after_activity';
export type PainDiagnosis = 'not_diagnosed' | 'diagnosed' | 'seeing_physio';

export type PainArea = {
  id: string;
  label: string;
  timing: PainTiming;
  severity: number;
  diagnosis: PainDiagnosis;
};

export const TIMING_LABEL: Record<PainTiming, string> = {
  at_rest: 'At rest',
  during_movement: 'During movement',
  after_activity: 'After activity',
};

export const DIAGNOSIS_LABEL: Record<PainDiagnosis, string> = {
  not_diagnosed: 'Not diagnosed',
  diagnosed: 'Diagnosed',
  seeing_physio: 'Seeing a physio',
};
