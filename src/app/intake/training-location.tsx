import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Screen } from '@/components/Screen';
import { BackButton, Button, GymIcon, HomeIcon, OutdoorsIcon, Text, VideoCameraIcon } from '@/components/ui';
import { IconOptionCard } from '@/components/intake/IconOptionCard';
import { IntakeProgressBar } from '@/components/intake/IntakeProgressBar';
import type { TrainingLocation } from '@/lib/api/endpoints/workoutPlan';
import { useIntakeStore } from '@/store/useIntakeStore';
import { Spacing, useTheme } from '@/theme';

const LOCATIONS: {
  value: TrainingLocation;
  label: string;
  description: string;
  Icon: typeof HomeIcon;
}[] = [
  { value: 'at_home', label: 'At home', description: 'Bodyweight or your own equipment', Icon: HomeIcon },
  { value: 'at_gym', label: 'At a gym', description: 'Full equipment access', Icon: GymIcon },
  { value: 'outdoors', label: 'Outdoors', description: 'Park, track, or open space', Icon: OutdoorsIcon },
  {
    value: 'online_with_trainer',
    label: 'Online with a trainer',
    description: 'Live video sessions',
    Icon: VideoCameraIcon,
  },
];

// 1 of 5 data-entry steps before Generating (location, [equipment], pain,
// experience level, then generating itself — equipment only shows for "At
// home", see the known open item below).
const STEP_PROGRESS = 1 / 5;

/**
 * Intake/Training Location — Figma node 109:351
 * (https://www.figma.com/design/XGneuIxWiSwOptsUsmA4Mh/Vyaam?node-id=109-351).
 *
 * Known open item (CLAUDE.md): the equipment intake screen only appears
 * when "At home" is selected here — gated explicitly below rather than
 * showing it unconditionally the way the static Figma frames imply.
 */
export default function IntakeTrainingLocationScreen() {
  const { colors } = useTheme();
  const draftLocation = useIntakeStore((s) => s.workout.trainingLocation);
  const setWorkoutAnswers = useIntakeStore((s) => s.setWorkoutAnswers);
  const [selected, setSelected] = useState<TrainingLocation | null>(draftLocation ?? null);

  const handleContinue = () => {
    if (!selected) return;
    setWorkoutAnswers({ trainingLocation: selected });
    if (selected === 'at_home') {
      router.push('/intake/equipment');
    } else {
      router.push('/intake/pain');
    }
  };

  return (
    <Screen>
      <BackButton onPress={() => router.back()} style={styles.backButton} />

      <IntakeProgressBar progress={STEP_PROGRESS} />

      <View style={styles.header}>
        <Text variant="h2">Where do you train?</Text>
        <Text variant="bodySecondary" color="textSecondary">
          This shapes what equipment your plan assumes.
        </Text>
      </View>

      <View style={styles.options}>
        {LOCATIONS.map(({ value, label, description, Icon }) => {
          const isSelected = selected === value;
          return (
            <IconOptionCard
              key={value}
              label={label}
              description={description}
              selected={isSelected}
              onPress={() => setSelected(value)}
              icon={<Icon color={isSelected ? colors.accentDeep : colors.textPrimary} />}
            />
          );
        })}
      </View>

      <Button label="Continue" size="large" fullWidth disabled={!selected} onPress={handleContinue} style={styles.footer} />
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
    gap: Spacing.s3,
  },
  footer: {
    marginTop: 'auto',
    marginBottom: Spacing.s4,
  },
});
