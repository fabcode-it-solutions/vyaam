import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Screen } from '@/components/Screen';
import { BackButton, Button, Text } from '@/components/ui';
import { IntakeProgressBar } from '@/components/intake/IntakeProgressBar';
import { OptionRow } from '@/components/intake/OptionRow';
import type { DietGoal } from '@/lib/api/endpoints/dietPlan';
import { useIntakeStore } from '@/store/useIntakeStore';
import { Spacing } from '@/theme';

const GOALS: { value: DietGoal; label: string }[] = [
  { value: 'lose_fat', label: 'Lose fat' },
  { value: 'build_muscle', label: 'Build muscle' },
  { value: 'gain_weight', label: 'Gain weight' },
  { value: 'maintain', label: 'Maintain' },
  { value: 'improve_endurance', label: 'Improve endurance' },
  { value: 'general_health', label: 'General health' },
];

// 1 of 6 data-entry steps before Generating (goal, body metrics, safety
// checklist, diet type, restrictions, then generating itself).
const STEP_PROGRESS = 1 / 6;

/**
 * Intake/Goal — Figma node 58:66
 * (https://www.figma.com/design/XGneuIxWiSwOptsUsmA4Mh/Vyaam?node-id=58-66).
 */
export default function IntakeGoalScreen() {
  const draftGoal = useIntakeStore((s) => s.diet.goal);
  const setDietAnswers = useIntakeStore((s) => s.setDietAnswers);
  const [selected, setSelected] = useState<DietGoal | null>(draftGoal ?? null);

  const handleContinue = () => {
    if (!selected) return;
    setDietAnswers({ goal: selected });
    router.push('/intake/body-metrics');
  };

  return (
    <Screen>
      <BackButton onPress={() => router.back()} style={styles.backButton} />

      <IntakeProgressBar progress={STEP_PROGRESS} />

      <View style={styles.header}>
        <Text variant="h2">What’s your main goal?</Text>
        <Text variant="bodySecondary" color="textSecondary">
          You can change this anytime from your profile.
        </Text>
      </View>

      <View style={styles.options}>
        {GOALS.map((goal) => (
          <OptionRow
            key={goal.value}
            label={goal.label}
            selected={selected === goal.value}
            onPress={() => setSelected(goal.value)}
          />
        ))}
      </View>

      <Button
        label="Continue"
        size="large"
        fullWidth
        disabled={!selected}
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
  options: {
    gap: Spacing.s2,
  },
  footer: {
    marginTop: 'auto',
    marginBottom: Spacing.s4,
  },
});
