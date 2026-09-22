import { memo } from 'react';
import { StyleSheet, View } from 'react-native';

import { Radius, Spacing, useTheme } from '@/theme';

export type IntakeProgressBarProps = {
  /** 0–1 fraction of the intake flow completed. */
  progress: number;
};

/** Step indicator shown under the back button on every Intake/* screen. */
export const IntakeProgressBar = memo(function IntakeProgressBar({ progress }: IntakeProgressBarProps) {
  const { colors } = useTheme();
  return (
    <View style={[styles.track, { backgroundColor: colors.border }]}>
      <View style={[styles.fill, { backgroundColor: colors.accentDeep, width: `${progress * 100}%` }]} />
    </View>
  );
});

const styles = StyleSheet.create({
  track: {
    height: 4,
    borderRadius: Radius.sm / 6,
    marginBottom: Spacing.s6,
  },
  fill: {
    height: 4,
    borderRadius: Radius.sm / 6,
  },
});
