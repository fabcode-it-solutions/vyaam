import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Screen } from '@/components/Screen';
import { BackButton, Button, Pill, Text } from '@/components/ui';
import { IntakeProgressBar } from '@/components/intake/IntakeProgressBar';
import { ApiError } from '@/lib/api/errors';
import { submitDietIntake, type Allergy, type DietIntakeInput, type DigestiveIssue } from '@/lib/api/endpoints/dietPlan';
import { useIntakeStore } from '@/store/useIntakeStore';
import { Spacing } from '@/theme';

const ALLERGY_OPTIONS: { value: Allergy; label: string }[] = [
  { value: 'dairy', label: 'Dairy' },
  { value: 'gluten_wheat', label: 'Gluten/Wheat' },
  { value: 'peanuts', label: 'Peanuts' },
  { value: 'tree_nuts', label: 'Tree nuts' },
  { value: 'soy', label: 'Soy' },
  { value: 'eggs', label: 'Eggs' },
  { value: 'fish', label: 'Fish' },
  { value: 'shellfish', label: 'Shellfish' },
  { value: 'sesame', label: 'Sesame' },
  { value: 'mustard', label: 'Mustard' },
];

const DIGESTIVE_OPTIONS: { value: DigestiveIssue; label: string }[] = [
  { value: 'bloating', label: 'Bloating' },
  { value: 'constipation', label: 'Constipation' },
  { value: 'acidity_reflux', label: 'Acidity/Reflux' },
  { value: 'gas', label: 'Gas' },
  { value: 'ibs', label: 'IBS' },
  { value: 'loose_motions', label: 'Loose motions' },
  { value: 'indigestion', label: 'Indigestion' },
  { value: 'lactose_intolerance', label: 'Lactose intolerance' },
  { value: 'gluten_sensitivity', label: 'Gluten sensitivity' },
];

// 5 of 6 — see Intake/Goal for the step count this is measured against.
const STEP_PROGRESS = 5 / 6;

function toggle<T>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
}

/**
 * Intake/Food Restrictions — Figma node 66:96
 * (https://www.figma.com/design/XGneuIxWiSwOptsUsmA4Mh/Vyaam?node-id=66-96).
 * Final data-entry step of the diet intake — submits the accumulated draft
 * from every prior screen to POST /plans/intake/diet.
 */
export default function IntakeFoodRestrictionsScreen() {
  const draft = useIntakeStore((s) => s.diet);
  const setDietAnswers = useIntakeStore((s) => s.setDietAnswers);
  const setDietJobId = useIntakeStore((s) => s.setDietJobId);

  const [allergies, setAllergies] = useState<Allergy[]>(draft.allergies ?? []);
  const [digestiveIssues, setDigestiveIssues] = useState<DigestiveIssue[]>(draft.digestiveIssues ?? []);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleContinue = async () => {
    if (!draft.goal || !draft.heightCm || !draft.weightKg || !draft.dietType) {
      // Missing an earlier required step — send the user back to fill it in
      // rather than letting a 400 surface from the server.
      router.replace('/intake/goal');
      return;
    }

    setError(null);
    setSubmitting(true);
    try {
      const input: DietIntakeInput = {
        goal: draft.goal,
        heightCm: draft.heightCm,
        weightKg: draft.weightKg,
        dob: draft.dob,
        safetyFlags: draft.safetyFlags ?? [],
        surgeryDetails: draft.surgeryDetails,
        dietType: draft.dietType,
        allergies,
        digestiveIssues,
      };
      setDietAnswers({ allergies, digestiveIssues });
      const { jobId } = await submitDietIntake(input);
      setDietJobId(jobId);
      router.push('/intake/generating');
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : 'Could not start plan generation. Check your connection and try again.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Screen>
      <BackButton onPress={() => router.back()} style={styles.backButton} />

      <IntakeProgressBar progress={STEP_PROGRESS} />

      <View style={styles.header}>
        <Text variant="h2">Any food restrictions?</Text>
        <Text variant="bodySecondary" color="textSecondary">
          Select all that apply — you can skip if none.
        </Text>
      </View>

      <View style={styles.section}>
        <Text variant="h4" style={styles.sectionTitle}>
          Allergies & intolerances
        </Text>
        <View style={styles.chips}>
          <Pill label="None" selected={allergies.length === 0} onPress={() => setAllergies([])} />
          {ALLERGY_OPTIONS.map((option) => (
            <Pill
              key={option.value}
              label={option.label}
              selected={allergies.includes(option.value)}
              onPress={() => setAllergies((prev) => toggle(prev, option.value))}
            />
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text variant="h4" style={styles.sectionTitle}>
          Digestive issues
        </Text>
        <View style={styles.chips}>
          <Pill label="None" selected={digestiveIssues.length === 0} onPress={() => setDigestiveIssues([])} />
          {DIGESTIVE_OPTIONS.map((option) => (
            <Pill
              key={option.value}
              label={option.label}
              selected={digestiveIssues.includes(option.value)}
              onPress={() => setDigestiveIssues((prev) => toggle(prev, option.value))}
            />
          ))}
        </View>
      </View>

      {error && (
        <Text variant="caption" color="danger" style={styles.error}>
          {error}
        </Text>
      )}

      <Button
        label="Continue"
        size="large"
        fullWidth
        loading={submitting}
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
  section: {
    marginBottom: Spacing.s6,
  },
  sectionTitle: {
    marginBottom: Spacing.s4,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.s2,
  },
  error: {
    marginBottom: Spacing.s2,
  },
  footer: {
    marginTop: Spacing.s2,
    marginBottom: Spacing.s4,
  },
});
