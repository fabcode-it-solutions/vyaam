import { router } from 'expo-router';
import { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Screen } from '@/components/Screen';
import { IconOptionCard } from '@/components/intake/IconOptionCard';
import { IntakeProgressBar } from '@/components/intake/IntakeProgressBar';
import { BackButton, Button, GymIcon, HomeIcon, Input, Text, VideoCameraIcon } from '@/components/ui';
import { Spacing, useTheme } from '@/theme';

/**
 * Create Request — Step 1 of 4 (title + training mode). Steps 2–4 aren't
 * designed/built yet, so Continue is a placeholder until they exist.
 */

type TrainingMode = 'atHome' | 'gym' | 'online';

const MODES: {
  value: TrainingMode;
  label: string;
  description: string;
  Icon: typeof HomeIcon;
}[] = [
  { value: 'atHome', label: 'At home', description: 'Trainer comes to you', Icon: HomeIcon },
  { value: 'gym', label: 'At a gym', description: 'Meet at a gym or studio', Icon: GymIcon },
  { value: 'online', label: 'Online', description: 'Live video sessions', Icon: VideoCameraIcon },
];

const STEP_PROGRESS = 0.25;

export default function CreateRequestStep1Screen() {
  const { colors } = useTheme();
  const [title, setTitle] = useState('');
  const [mode, setMode] = useState<TrainingMode>('atHome');

  const handleContinue = useCallback(() => router.push('/requests/create-step-2'), []);

  return (
    <Screen>
      <View style={styles.topRow}>
        <BackButton onPress={() => router.back()} />
        <Text variant="caption" color="textMuted">
          Step 1 of 4
        </Text>
      </View>

      <IntakeProgressBar progress={STEP_PROGRESS} />

      <View style={styles.header}>
        <Text variant="h2">What do you need help with?</Text>
        <Text variant="bodySecondary" color="textSecondary">
          A short title trainers will see on your request.
        </Text>
      </View>

      <View style={styles.input}>
        <Input
          hideLabel
          label="Request title"
          value={title}
          onChangeText={setTitle}
          placeholder="e.g. Upper body strength coaching"
        />
      </View>

      <Text variant="caption" color="textMuted" style={styles.modeLabel}>
        Training mode
      </Text>

      <View style={styles.options}>
        {MODES.map(({ value, label, description, Icon }) => {
          const isSelected = mode === value;
          return (
            <IconOptionCard
              key={value}
              label={label}
              description={description}
              selected={isSelected}
              onPress={() => setMode(value)}
              icon={<Icon color={isSelected ? colors.accentDeep : colors.textPrimary} />}
            />
          );
        })}
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
    marginBottom: Spacing.s5,
  },
  input: {
    marginBottom: Spacing.s6,
  },
  modeLabel: {
    marginBottom: Spacing.s3,
  },
  options: {
    gap: Spacing.s3,
  },
  footer: {
    marginTop: 'auto',
    marginBottom: Spacing.s4,
  },
});
