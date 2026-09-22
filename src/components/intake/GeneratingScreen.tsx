import { memo, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { Screen } from '@/components/Screen';
import { SparkleIcon, Text } from '@/components/ui';
import { Radius, Spacing, useTheme } from '@/theme';

export type GeneratingScreenProps = {
  heading: string;
  description: string;
  /**
   * Whether the underlying job/fetch has finished. While false the track
   * trickles forward on its own (there's no real step-by-step progress to
   * report while a job is queued/processing) so the screen doesn't look
   * stalled during a multi-second wait; once true it eases straight to 100%.
   */
  isComplete: boolean;
};

// Fake-progress trickle (same idea as GitHub/YouTube upload bars): never
// reaches the cap on its own, so it always has somewhere to go until the
// real "ready" signal arrives and snaps it the rest of the way to 100%.
const TRICKLE_CAP = 0.92;
const TRICKLE_STEP = 0.15;
const TRICKLE_INTERVAL_MS = 450;

const SPARKLE_PULSE_MS = 700;
const SPARKLE_SPIN_MS = 6000;

/**
 * Shared shell for the "building your plan" intake screens (Figma "Intake/
 * Generating" node 67:118 and "Intake/Workout Generating" node 114:376) —
 * tinted sparkle icon, centered heading/description, progress track. Both
 * plan-generation flows use the exact same layout, only copy/progress differ.
 */
export const GeneratingScreen = memo(function GeneratingScreen({
  heading,
  description,
  isComplete,
}: GeneratingScreenProps) {
  const { colors } = useTheme();
  const fillProgress = useSharedValue(isComplete ? 1 : 0.12);
  const sparkleScale = useSharedValue(1);
  const sparkleRotate = useSharedValue(0);

  useEffect(() => {
    if (isComplete) {
      fillProgress.value = withTiming(1, { duration: 400, easing: Easing.out(Easing.cubic) });
      return;
    }

    const interval = setInterval(() => {
      const remaining = TRICKLE_CAP - fillProgress.value;
      fillProgress.value = withTiming(fillProgress.value + remaining * TRICKLE_STEP, {
        duration: TRICKLE_INTERVAL_MS,
        easing: Easing.out(Easing.quad),
      });
    }, TRICKLE_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [isComplete, fillProgress]);

  useEffect(() => {
    sparkleScale.value = withRepeat(
      withSequence(
        withTiming(1.15, { duration: SPARKLE_PULSE_MS, easing: Easing.inOut(Easing.sin) }),
        withTiming(1, { duration: SPARKLE_PULSE_MS, easing: Easing.inOut(Easing.sin) }),
      ),
      -1,
    );
    sparkleRotate.value = withRepeat(withTiming(360, { duration: SPARKLE_SPIN_MS, easing: Easing.linear }), -1);
  }, [sparkleScale, sparkleRotate]);

  const fillStyle = useAnimatedStyle(() => ({ width: `${fillProgress.value * 100}%` }));
  const sparkleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: sparkleScale.value }, { rotate: `${sparkleRotate.value}deg` }],
  }));

  return (
    <Screen>
      <View style={styles.body}>
        <View style={[styles.iconCircle, { backgroundColor: colors.accentTint }]}>
          <Animated.View style={sparkleStyle}>
            <SparkleIcon size={44} color={colors.accentDeep} />
          </Animated.View>
        </View>

        <View style={styles.copy}>
          <Text variant="h2" style={styles.heading}>
            {heading}
          </Text>
          <Text variant="bodySecondary" color="textSecondary" style={styles.description}>
            {description}
          </Text>
        </View>

        <View style={[styles.track, { backgroundColor: colors.border }]}>
          <Animated.View style={[styles.fill, fillStyle, { backgroundColor: colors.accentDeep }]} />
        </View>
      </View>
    </Screen>
  );
});

const styles = StyleSheet.create({
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircle: {
    width: 112,
    height: 112,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.s8,
  },
  copy: {
    alignItems: 'center',
    gap: Spacing.s2,
    marginBottom: Spacing.s6,
  },
  heading: {
    textAlign: 'center',
  },
  description: {
    textAlign: 'center',
  },
  track: {
    height: 4,
    width: 200,
    borderRadius: Radius.sm / 6,
    overflow: 'hidden',
  },
  fill: {
    height: 4,
    borderRadius: Radius.sm / 6,
  },
});
