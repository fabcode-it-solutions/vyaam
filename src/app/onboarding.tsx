import { Image, type ImageSource } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useState } from 'react';
import { Pressable, StyleSheet, Text as RNText, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ArrowIcon } from '@/components/ui';
import { useSessionStore } from '@/store/useSessionStore';
import { lightPalette, Radius, Spacing, Typography } from '@/theme';

/**
 * Onboarding — Figma node 27:8 ("Onboarding/1" through "Onboarding/3",
 * https://www.figma.com/design/XGneuIxWiSwOptsUsmA4Mh/Vyaam?node-id=27-8).
 *
 * Full-bleed photo intro, independent of the light/dark theme — same fixed-
 * brand exception LogoMark documents for the splash screen. Colours below
 * are pulled straight from that frame's literal values (`lightPalette` plus
 * a few one-off overlay alphas), not the semantic `theme.colors` used
 * everywhere else, because this scrim/text combo must hold regardless of
 * which theme the user has picked.
 *
 * Note: the frame's progress indicator has 4 segments but Figma only has 3
 * "Onboarding/N" slides built (this file's SLIDES) — the last segment is
 * never filled. Implemented as designed; worth confirming with Design
 * whether a 4th slide (e.g. covering the location/notification consent
 * already tracked in useSessionStore) is still coming.
 */

const SEGMENT_COUNT = 4;

type TitleRun = { text: string; tone: 'sand' | 'accent' };

type Slide = {
  key: string;
  image: ImageSource;
  imageAlt: string;
  titleRuns: TitleRun[];
  subtitle: string;
  /** Gradient scrim starts this far down the screen and always runs to the bottom edge. */
  scrimTop: `${number}%`;
};

const SLIDES: Slide[] = [
  {
    key: 'trainer-terms',
    image: require('@/assets/images/onboarding-1.png'),
    imageAlt: 'Photo — trainer at client’s home',
    titleRuns: [
      { text: 'Your trainer, ', tone: 'sand' },
      { text: 'Y', tone: 'sand' },
      { text: 'our terms', tone: 'accent' },
    ],
    subtitle: 'At home, at the gym, or online — you choose.',
    scrimTop: '0%',
  },
  {
    key: 'find-trainers',
    image: require('@/assets/images/onboarding-2.png'),
    imageAlt: 'Photo — trainer profile browsing',
    titleRuns: [
      { text: 'Find trainers', tone: 'accent' },
      { text: ' who come to you', tone: 'sand' },
    ],
    subtitle: 'Post what you need. Verified trainers near you send their offer.',
    scrimTop: '30.6%',
  },
  {
    key: 'plans-around-you',
    image: require('@/assets/images/onboarding-3.png'),
    imageAlt: 'Photo — client following workout plan',
    titleRuns: [
      { text: 'Plans built ', tone: 'sand' },
      { text: 'around you', tone: 'accent' },
    ],
    subtitle: 'AI-generated workout and diet plans, adjusted for your goals and any injuries.',
    scrimTop: '62.7%',
  },
];

const SCRIM_TRANSPARENT = 'rgba(10, 38, 33, 0)';
const SCRIM_OPAQUE = 'rgba(10, 38, 33, 0.95)';
const SEGMENT_UNFILLED = 'rgba(255, 255, 255, 0.25)';
const SKIP_PILL_BG = 'rgba(255, 255, 255, 0.14)';
const SUBTITLE_COLOR = 'rgba(255, 255, 255, 0.65)';

export default function OnboardingScreen() {
  const insets = useSafeAreaInsets();
  const completeOnboarding = useSessionStore((s) => s.completeOnboarding);
  const [index, setIndex] = useState(0);
  const slide = SLIDES[index];
  const isFirst = index === 0;
  const isLast = index === SLIDES.length - 1;

  const finish = useCallback(() => {
    completeOnboarding();
    router.replace('/');
  }, [completeOnboarding]);

  const goNext = useCallback(() => {
    if (isLast) {
      finish();
    } else {
      setIndex((i) => i + 1);
    }
  }, [isLast, finish]);

  const goBack = useCallback(() => {
    setIndex((i) => Math.max(0, i - 1));
  }, []);

  return (
    <View style={styles.root}>
      <StatusBar style="light" />

      <Image
        source={slide.image}
        accessibilityLabel={slide.imageAlt}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
      />
      <LinearGradient
        colors={[SCRIM_TRANSPARENT, SCRIM_OPAQUE]}
        style={[styles.scrim, { top: slide.scrimTop }]}
      />

      <View style={[styles.topRow, { paddingTop: insets.top + Spacing.s4 }]}>
        <View style={styles.segments}>
          {Array.from({ length: SEGMENT_COUNT }, (_, i) => (
            <View
              key={i}
              style={[
                styles.segment,
                { backgroundColor: i <= index ? lightPalette.white : SEGMENT_UNFILLED },
              ]}
            />
          ))}
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Skip onboarding"
          onPress={finish}
          style={styles.skipPill}>
          <RNText style={styles.skipLabel}>Skip</RNText>
        </Pressable>
      </View>

      <View style={[styles.bottom, { paddingBottom: insets.bottom + Spacing.s6 }]}>
        <RNText style={styles.title}>
          {slide.titleRuns.map((run, i) => (
            <RNText
              key={i}
              style={{ color: run.tone === 'accent' ? lightPalette.saffron : lightPalette.sand }}>
              {run.text}
            </RNText>
          ))}
        </RNText>
        <RNText style={styles.subtitle}>{slide.subtitle}</RNText>

        {isLast ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Get started"
            onPress={finish}
            style={styles.primaryButton}>
            <RNText style={styles.primaryButtonLabel}>Get started</RNText>
          </Pressable>
        ) : (
          <View style={styles.navRow}>
            <NavButton
              visible={!isFirst}
              direction="left"
              accessibilityLabel="Previous"
              onPress={goBack}
            />
            <View style={styles.navSpacer} />
            <NavButton direction="right" accessibilityLabel="Next" onPress={goNext} />
          </View>
        )}
      </View>
    </View>
  );
}

function NavButton({
  visible = true,
  direction,
  accessibilityLabel,
  onPress,
}: {
  visible?: boolean;
  direction: 'left' | 'right';
  accessibilityLabel: string;
  onPress: () => void;
}) {
  if (!visible) {
    return <View style={styles.navButtonSpacer} />;
  }
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      style={styles.navButton}>
      <ArrowIcon direction={direction} color={lightPalette.inkDeep} />
    </Pressable>
  );
}

const NAV_BUTTON_SIZE = 52;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: lightPalette.ink,
  },
  scrim: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.s6,
  },
  segments: {
    flex: 1,
    flexDirection: 'row',
    gap: Spacing.s2,
    marginRight: Spacing.s4,
  },
  segment: {
    flex: 1,
    height: 4,
    borderRadius: 2,
  },
  skipPill: {
    backgroundColor: SKIP_PILL_BG,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.s3,
    paddingVertical: 7,
  },
  skipLabel: {
    ...Typography.caption,
    color: lightPalette.white,
  },
  bottom: {
    marginTop: 'auto',
    paddingHorizontal: Spacing.s6,
    gap: Spacing.s3,
  },
  title: {
    ...Typography.h1,
  },
  subtitle: {
    ...Typography.bodySecondary,
    color: SUBTITLE_COLOR,
    marginBottom: Spacing.s8,
  },
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  navSpacer: {
    flex: 1,
  },
  navButton: {
    width: NAV_BUTTON_SIZE,
    height: NAV_BUTTON_SIZE,
    borderRadius: Radius.full,
    backgroundColor: lightPalette.sand,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navButtonSpacer: {
    width: NAV_BUTTON_SIZE,
    height: NAV_BUTTON_SIZE,
  },
  primaryButton: {
    backgroundColor: lightPalette.inkDeep,
    borderRadius: Radius.full,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonLabel: {
    fontFamily: Typography.h4.fontFamily,
    fontSize: 14,
    lineHeight: 18,
    color: lightPalette.white,
  },
});
