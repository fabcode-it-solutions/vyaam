import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Screen } from '@/components/Screen';
import { BackButton, Button, Text } from '@/components/ui';
import { IntakeProgressBar } from '@/components/intake/IntakeProgressBar';
import { OptionRow } from '@/components/intake/OptionRow';
import type { DietType } from '@/lib/api/endpoints/dietPlan';
import { useIntakeStore } from '@/store/useIntakeStore';
import { Spacing } from '@/theme';

const DIET_TYPES: { value: DietType; label: string }[] = [
  { value: 'vegetarian', label: 'Vegetarian' },
  { value: 'non_vegetarian', label: 'Non-vegetarian' },
  { value: 'vegetarian_with_eggs', label: 'Vegetarian + eggs' },
  { value: 'vegan', label: 'Vegan' },
  { value: 'jain', label: 'Jain' },
  { value: 'other', label: 'Other' },
];

// 4 of 6 — see Intake/Goal for the step count this is measured against.
const STEP_PROGRESS = 4 / 6;

/**
 * Intake/Diet Type — Figma node 65:95
 * (https://www.figma.com/design/XGneuIxWiSwOptsUsmA4Mh/Vyaam?node-id=65-95).
 */
export default function IntakeDietTypeScreen() {
  const draftDietType = useIntakeStore((s) => s.diet.dietType);
  const setDietAnswers = useIntakeStore((s) => s.setDietAnswers);
  const [selected, setSelected] = useState<DietType | null>(draftDietType ?? null);

  const handleContinue = () => {
    if (!selected) return;
    setDietAnswers({ dietType: selected });
    router.push('/intake/food-restrictions');
  };

  return (
    <Screen>
      <BackButton onPress={() => router.back()} style={styles.backButton} />

      <IntakeProgressBar progress={STEP_PROGRESS} />

      <View style={styles.header}>
        <Text variant="h2">What do you eat?</Text>
        <Text variant="bodySecondary" color="textSecondary">
          This shapes every meal in your plan.
        </Text>
      </View>

      <View style={styles.options}>
        {DIET_TYPES.map((dietType) => (
          <OptionRow
            key={dietType.value}
            label={dietType.label}
            selected={selected === dietType.value}
            onPress={() => setSelected(dietType.value)}
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
