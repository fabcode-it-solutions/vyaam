import * as SplashScreen from 'expo-splash-screen';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { Easing, Keyframe } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { lightTheme } from '@/theme';

import { LogoMark } from './ui/LogoMark';
import { Text } from './ui/Text';

const DURATION = 600;
/** Distance from the screen's bottom edge to the version caption — Figma node 24:14 (852px frame, caption bottom at y=816). */
const VERSION_BOTTOM_OFFSET = 36;

/**
 * JS-thread splash (Figma node 24:8, "Splash") shown right after the native
 * cold-start splash hides, so the brand mark carries through without a
 * colour/frame flash — then fades + scales out once fonts and session state
 * are ready (see `_layout.tsx`).
 *
 * Always renders the fixed brand palette (ink/sand/saffron), never the
 * active theme — a splash is brand identity, not a themeable surface.
 */
export function AnimatedSplashOverlay() {
  const [animate, setAnimate] = useState(false);
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  const splashKeyframe = new Keyframe({
    0: {
      transform: [{ scale: 1 }],
      opacity: 1,
    },
    20: {
      opacity: 1,
    },
    70: {
      opacity: 0,
      easing: Easing.elastic(0.7),
    },
    100: {
      opacity: 0,
      transform: [{ scale: 1 }],
      easing: Easing.elastic(0.7),
    },
  });

  const { colors } = lightTheme;

  const brand = (
    <>
      <View style={styles.lockup}>
        <LogoMark size={64} primaryColor={colors.onBrand} accentColor={colors.accent} />
        <Text variant="h2" style={[styles.wordmark, { color: colors.onBrand }]}>
          Vyaam
        </Text>
      </View>
      <Text variant="caption" style={[styles.version, { color: colors.onBrand }]}>
        v0.1
      </Text>
    </>
  );

  return animate ? (
    <Animated.View
      entering={splashKeyframe.duration(DURATION).withCallback((finished) => {
        'worklet';
        if (finished) {
          scheduleOnRN(setVisible, false);
        }
      })}
      style={[styles.splashOverlay, { backgroundColor: colors.brand }]}>
      {brand}
    </Animated.View>
  ) : (
    <View
      onLayout={() => {
        SplashScreen.hideAsync().finally(() => {
          setAnimate(true);
        });
      }}
      style={[styles.splashOverlay, { backgroundColor: colors.brand }]}>
      {brand}
    </View>
  );
}

const styles = StyleSheet.create({
  splashOverlay: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  lockup: {
    alignItems: 'center',
  },
  wordmark: {
    // Brand lockup treatment (Figma node 24:13) diverges from the h2 token
    // only in letter-spacing sign and case — not a reusable Typography variant.
    letterSpacing: 0.7,
    textTransform: 'uppercase',
  },
  version: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: VERSION_BOTTOM_OFFSET,
    textAlign: 'center',
    opacity: 0.6,
  },
});
