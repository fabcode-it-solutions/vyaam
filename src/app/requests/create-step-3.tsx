import { router } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Screen } from '@/components/Screen';
import { IntakeProgressBar } from '@/components/intake/IntakeProgressBar';
import { BackButton, Button, Pill, RangeSlider, Text } from '@/components/ui';
import { Spacing } from '@/theme';

/** Create Request — Step 3 of 4 (optional trainer/budget preferences). */

type Gender = 'any' | 'female' | 'male';

const GENDER_OPTIONS: { key: Gender; label: string }[] = [
  { key: 'any', label: 'No preference' },
  { key: 'female', label: 'Female' },
  { key: 'male', label: 'Male' },
];

const LANGUAGE_OPTIONS = [
  { key: 'english', label: 'English' },
  { key: 'hindi', label: 'Hindi' },
  { key: 'punjabi', label: 'Punjabi' },
  { key: 'bengali', label: 'Bengali' },
];

const BUDGET_MIN = 200;
const BUDGET_MAX = 2000;
const BUDGET_STEP = 50;

const STEP_PROGRESS = 0.75;

function formatRupees(n: number) {
  return `₹${n.toLocaleString('en-IN')}`;
}

export default function CreateRequestStep3Screen() {
  const [gender, setGender] = useState<Gender>('any');
  const [languages, setLanguages] = useState<string[]>(['english', 'hindi']);
  const [budget, setBudget] = useState<[number, number]>([400, 800]);

  const toggleLanguage = useCallback((key: string) => {
    setLanguages((current) => (current.includes(key) ? current.filter((l) => l !== key) : [...current, key]));
  }, []);

  const budgetLabel = useMemo(
    () => `Budget · ${formatRupees(budget[0])} – ${formatRupees(budget[1])} / session`,
    [budget],
  );

  const handleContinue = useCallback(() => router.push('/requests/create-step-4'), []);

  return (
    <Screen>
      <View style={styles.topRow}>
        <BackButton onPress={() => router.back()} />
        <Text variant="caption" color="textMuted">
          Step 3 of 4
        </Text>
      </View>

      <IntakeProgressBar progress={STEP_PROGRESS} />

      <View style={styles.header}>
        <Text variant="h2">Any preferences?</Text>
        <Text variant="bodySecondary" color="textSecondary">
          Optional — helps us match you with the right trainer.
        </Text>
      </View>

      <View style={styles.section}>
        <Text variant="caption" color="textSecondary" style={styles.label}>
          Trainer gender
        </Text>
        <View style={styles.pillWrap}>
          {GENDER_OPTIONS.map((option) => (
            <Pill key={option.key} label={option.label} selected={gender === option.key} onPress={() => setGender(option.key)} />
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text variant="caption" color="textSecondary" style={styles.label}>
          Language
        </Text>
        <View style={styles.pillWrap}>
          {LANGUAGE_OPTIONS.map((option) => (
            <Pill
              key={option.key}
              label={option.label}
              selected={languages.includes(option.key)}
              onPress={() => toggleLanguage(option.key)}
            />
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text variant="caption" color="textSecondary" style={styles.label}>
          {budgetLabel}
        </Text>
        <View style={styles.sliderWrap}>
          <RangeSlider min={BUDGET_MIN} max={BUDGET_MAX} step={BUDGET_STEP} value={budget} onChange={setBudget} />
        </View>
      </View>

      <Button label="Continue" size="large" fullWidth onPress={handleContinue} style={styles.footer} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.s2,
    marginBottom: Spacing.s4,
  },
  header: {
    gap: Spacing.s3,
    marginBottom: Spacing.s6,
  },
  section: {
    marginBottom: Spacing.s6,
  },
  label: {
    marginBottom: Spacing.s3,
  },
  pillWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.s2,
  },
  sliderWrap: {
    paddingHorizontal: Spacing.s1,
    paddingTop: Spacing.s2,
  },
  footer: {
    marginTop: 'auto',
    marginBottom: Spacing.s4,
  },
});
