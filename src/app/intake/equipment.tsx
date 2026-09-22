import { router } from 'expo-router';
import { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Screen } from '@/components/Screen';
import { BackButton, Button, Pill, Text } from '@/components/ui';
import { IntakeProgressBar } from '@/components/intake/IntakeProgressBar';
import type { Equipment } from '@/lib/api/endpoints/workoutPlan';
import { useIntakeStore } from '@/store/useIntakeStore';
import { Spacing } from '@/theme';

const EQUIPMENT_OPTIONS: { value: Equipment; label: string }[] = [
  { value: 'none_bodyweight', label: 'No equipment (bodyweight)' },
  { value: 'yoga_mat', label: 'Yoga mat' },
  { value: 'dumbbells', label: 'Dumbbells' },
  { value: 'resistance_bands', label: 'Resistance bands' },
  { value: 'pull_up_bar', label: 'Pull-up bar' },
  { value: 'kettlebell', label: 'Kettlebell' },
  { value: 'bench', label: 'Bench' },
  { value: 'treadmill', label: 'Treadmill' },
  { value: 'full_home_gym', label: 'Full home gym' },
];

// 2 of 5 — see Intake/Training Location for the step count this is measured
// against. Shown only when "At home" was selected there.
const STEP_PROGRESS = 2 / 5;

/**
 * Intake/Equipment — Figma node 110:336
 * (https://www.figma.com/design/XGneuIxWiSwOptsUsmA4Mh/Vyaam?node-id=110-336).
 */
export default function IntakeEquipmentScreen() {
  const draftEquipment = useIntakeStore((s) => s.workout.equipment);
  const setWorkoutAnswers = useIntakeStore((s) => s.setWorkoutAnswers);
  const [selected, setSelected] = useState<Set<Equipment>>(new Set(draftEquipment ?? []));

  const toggle = useCallback((option: Equipment) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(option)) {
        next.delete(option);
      } else {
        next.add(option);
      }
      return next;
    });
  }, []);

  const handleContinue = () => {
    setWorkoutAnswers({ equipment: Array.from(selected) });
    router.push('/intake/pain');
  };

  return (
    <Screen>
      <BackButton onPress={() => router.back()} style={styles.backButton} />

      <IntakeProgressBar progress={STEP_PROGRESS} />

      <View style={styles.header}>
        <Text variant="h2">What equipment do you have?</Text>
        <Text variant="bodySecondary" color="textSecondary">
          Select everything available at home — more is better.
        </Text>
      </View>

      <View style={styles.options}>
        {EQUIPMENT_OPTIONS.map((option) => (
          <Pill
            key={option.value}
            label={option.label}
            selected={selected.has(option.value)}
            onPress={() => toggle(option.value)}
          />
        ))}
      </View>

      <Button
        label="Continue"
        size="large"
        fullWidth
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
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.s2,
  },
  footer: {
    marginTop: 'auto',
    marginBottom: Spacing.s4,
  },
});
