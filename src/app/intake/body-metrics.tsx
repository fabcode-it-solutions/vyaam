import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Screen } from '@/components/Screen';
import { BackButton, Button, Input, Text } from '@/components/ui';
import { IntakeProgressBar } from '@/components/intake/IntakeProgressBar';
import { useIntakeStore } from '@/store/useIntakeStore';
import { Spacing } from '@/theme';

const DOB_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

// 2 of 6 — see Intake/Goal for the step count this is measured against.
const STEP_PROGRESS = 2 / 6;

function parsePositiveNumber(value: string): number | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const parsed = Number(trimmed);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

/**
 * Intake/Body Metrics — not yet in the Figma frames (build report lists it
 * as step 3 of the 8-screen diet intake: "intro, goal, body metrics, safety
 * checklist, diet type, restrictions, generating, plan ready"), but
 * heightCm/weightKg are required by POST /plans/intake/diet with no other
 * screen to collect them from, so this fills that gap with the same visual
 * language as the surrounding steps.
 */
export default function IntakeBodyMetricsScreen() {
  const draft = useIntakeStore((s) => s.diet);
  const setDietAnswers = useIntakeStore((s) => s.setDietAnswers);

  const [heightCm, setHeightCm] = useState(draft.heightCm ? String(draft.heightCm) : '');
  const [weightKg, setWeightKg] = useState(draft.weightKg ? String(draft.weightKg) : '');
  const [dob, setDob] = useState(draft.dob ?? '');
  const [touched, setTouched] = useState(false);

  const height = useMemo(() => parsePositiveNumber(heightCm), [heightCm]);
  const weight = useMemo(() => parsePositiveNumber(weightKg), [weightKg]);
  const dobTrimmed = dob.trim();

  const heightError =
    touched && (!height || height > 260) ? 'Enter a height between 1 and 260 cm' : undefined;
  const weightError =
    touched && (!weight || weight > 300) ? 'Enter a weight between 1 and 300 kg' : undefined;
  const dobError =
    touched && dobTrimmed.length > 0 && !DOB_PATTERN.test(dobTrimmed) ? 'Use the format YYYY-MM-DD' : undefined;

  const canContinue =
    !!height && height <= 260 && !!weight && weight <= 300 && (dobTrimmed.length === 0 || DOB_PATTERN.test(dobTrimmed));

  const handleContinue = () => {
    setTouched(true);
    if (!canContinue || !height || !weight) return;
    setDietAnswers({ heightCm: height, weightKg: weight, dob: dobTrimmed || undefined });
    router.push('/intake/safety-checklist');
  };

  return (
    <Screen>
      <BackButton onPress={() => router.back()} style={styles.backButton} />

      <IntakeProgressBar progress={STEP_PROGRESS} />

      <View style={styles.header}>
        <Text variant="h2">A little about your body</Text>
        <Text variant="bodySecondary" color="textSecondary">
          This is how we calculate your calorie and macro targets.
        </Text>
      </View>

      <View style={styles.form}>
        <Input
          label="Height"
          placeholder="170"
          keyboardType="numeric"
          trailingUnit="cm"
          value={heightCm}
          onChangeText={setHeightCm}
          error={heightError}
        />
        <Input
          label="Weight"
          placeholder="68"
          keyboardType="numeric"
          trailingUnit="kg"
          value={weightKg}
          onChangeText={setWeightKg}
          error={weightError}
        />
        <Input
          label="Date of birth (optional)"
          placeholder="YYYY-MM-DD"
          keyboardType="numbers-and-punctuation"
          value={dob}
          onChangeText={setDob}
          error={dobError}
        />
      </View>

      <Button
        label="Continue"
        size="large"
        fullWidth
        disabled={touched && !canContinue}
        onPress={handleContinue}
        style={styles.footer}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  backButton: {
    marginTop: Spacing.s2,
    marginBottom: Spacing.s6,
  },
  header: {
    gap: Spacing.s3,
    marginBottom: Spacing.s6,
  },
  form: {
    gap: Spacing.s5,
  },
  footer: {
    marginTop: 'auto',
    marginBottom: Spacing.s4,
  },
});
