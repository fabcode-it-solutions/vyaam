import { router } from 'expo-router';
import { useCallback, useMemo, useState, type ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button, IconButton, Pill, RangeSlider, StarIcon, Text, XIcon } from '@/components/ui';
import { Radius, Spacing, useTheme } from '@/theme';

/**
 * Discover — filter sheet. Reset / apply below only affect this screen's own
 * state; wiring the chosen filters back into the trainer-list results (and
 * the "N trainers" count reacting to them) needs the real trainer-search
 * endpoint, not a static count.
 */

type Mode = 'atHome' | 'atGym' | 'online';
type Gender = 'any' | 'female' | 'male';
type RatingKey = 'any' | '4.0' | '4.5' | '4.8';

const MODE_OPTIONS: { key: Mode; label: string }[] = [
  { key: 'atHome', label: 'At home' },
  { key: 'atGym', label: 'At a gym' },
  { key: 'online', label: 'Online' },
];

const GENDER_OPTIONS: { key: Gender; label: string }[] = [
  { key: 'any', label: 'Any' },
  { key: 'female', label: 'Female' },
  { key: 'male', label: 'Male' },
];

const LANGUAGE_OPTIONS = [
  { key: 'english', label: 'English' },
  { key: 'hindi', label: 'Hindi' },
  { key: 'punjabi', label: 'Punjabi' },
  { key: 'bengali', label: 'Bengali' },
];

const RATING_OPTIONS: { key: RatingKey; label: string; threshold: number | null }[] = [
  { key: 'any', label: 'Any', threshold: null },
  { key: '4.0', label: '4.0+', threshold: 4.0 },
  { key: '4.5', label: '4.5+', threshold: 4.5 },
  { key: '4.8', label: '4.8+', threshold: 4.8 },
];

const PRICE_MIN = 200;
const PRICE_MAX = 2000;
const PRICE_STEP = 50;

const DEFAULT_MODE: Mode = 'atHome';
const DEFAULT_GENDER: Gender = 'any';
const DEFAULT_LANGUAGES = ['english', 'hindi'];
const DEFAULT_RATING: RatingKey = '4.5';
const DEFAULT_PRICE: [number, number] = [300, 1200];

const MATCHING_TRAINERS = 12;

function formatPrice(n: number) {
  return `₹${n.toLocaleString('en-IN')}`;
}

export default function DiscoverFilterSheetScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const [mode, setMode] = useState<Mode | null>(DEFAULT_MODE);
  const [gender, setGender] = useState<Gender>(DEFAULT_GENDER);
  const [languages, setLanguages] = useState<string[]>(DEFAULT_LANGUAGES);
  const [minRating, setMinRating] = useState<RatingKey>(DEFAULT_RATING);
  const [priceRange, setPriceRange] = useState<[number, number]>(DEFAULT_PRICE);

  const handleClose = useCallback(() => router.back(), []);
  const handleApply = useCallback(() => router.back(), []);
  const handleResetAll = useCallback(() => {
    setMode(null);
    setGender(DEFAULT_GENDER);
    setLanguages([]);
    setMinRating('any');
    setPriceRange([PRICE_MIN, PRICE_MAX]);
  }, []);

  const toggleMode = useCallback((key: Mode) => {
    setMode((current) => (current === key ? null : key));
  }, []);

  const toggleLanguage = useCallback((key: string) => {
    setLanguages((current) => (current.includes(key) ? current.filter((l) => l !== key) : [...current, key]));
  }, []);

  const priceLabel = useMemo(
    () => `Price range · ${formatPrice(priceRange[0])} – ${formatPrice(priceRange[1])} /session`,
    [priceRange],
  );

  return (
    <View style={styles.overlay}>
      <Pressable style={StyleSheet.absoluteFill} accessibilityLabel="Close filters" onPress={handleClose} />

      <View
        style={[
          styles.sheet,
          { backgroundColor: colors.background, borderRadius: Radius.card, paddingBottom: insets.bottom + Spacing.s4 },
        ]}>
        <View style={[styles.handle, { backgroundColor: colors.border }]} />

        <View style={styles.header}>
          <Text variant="h2">Filters</Text>
          <IconButton icon={<XIcon size={16} color={colors.textPrimary} />} accessibilityLabel="Close filters" onPress={handleClose} />
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Section title="Mode">
            <ChipRow>
              {MODE_OPTIONS.map((option) => (
                <Pill key={option.key} label={option.label} selected={mode === option.key} onPress={() => toggleMode(option.key)} />
              ))}
            </ChipRow>
          </Section>

          <Section title="Trainer gender">
            <ChipRow>
              {GENDER_OPTIONS.map((option) => (
                <Pill key={option.key} label={option.label} selected={gender === option.key} onPress={() => setGender(option.key)} />
              ))}
            </ChipRow>
          </Section>

          <Section title="Language">
            <ChipRow wrap>
              {LANGUAGE_OPTIONS.map((option) => (
                <Pill
                  key={option.key}
                  label={option.label}
                  selected={languages.includes(option.key)}
                  onPress={() => toggleLanguage(option.key)}
                />
              ))}
            </ChipRow>
          </Section>

          <Section title="Minimum rating">
            <ChipRow>
              {RATING_OPTIONS.map((option) => (
                <Pill
                  key={option.key}
                  label={option.label}
                  selected={minRating === option.key}
                  leading={option.threshold != null ? <StarIcon color={minRating === option.key ? colors.onBrand : colors.accentDeep} /> : undefined}
                  onPress={() => setMinRating(option.key)}
                />
              ))}
            </ChipRow>
          </Section>

          <Section title={priceLabel}>
            <View style={styles.sliderWrap}>
              <RangeSlider min={PRICE_MIN} max={PRICE_MAX} step={PRICE_STEP} value={priceRange} onChange={setPriceRange} />
            </View>
          </Section>
        </ScrollView>

        <View style={styles.footer}>
          <Button label="Reset all" variant="ghost" onPress={handleResetAll} />
          <View style={styles.applyButton}>
            <Button label={`Show ${MATCHING_TRAINERS} trainers`} variant="primary" size="large" fullWidth onPress={handleApply} />
          </View>
        </View>
      </View>
    </View>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View style={styles.section}>
      <Text variant="h5" numberOfLines={1} style={styles.sectionTitle}>
        {title}
      </Text>
      {children}
    </View>
  );
}

function ChipRow({ children, wrap = false }: { children: ReactNode; wrap?: boolean }) {
  return <View style={[styles.chipRow, wrap && styles.chipRowWrap]}>{children}</View>;
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(10, 20, 18, 0.55)',
    justifyContent: 'flex-end',
  },
  sheet: {
    maxHeight: '88%',
    paddingTop: Spacing.s2,
  },
  handle: {
    alignSelf: 'center',
    width: 36,
    height: 4,
    borderRadius: Radius.full,
    marginTop: Spacing.s2,
    marginBottom: Spacing.s2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.s6,
    paddingBottom: Spacing.s4,
  },
  content: {
    paddingHorizontal: Spacing.s6,
    paddingBottom: Spacing.s5,
    gap: Spacing.s6,
  },
  section: {
    gap: Spacing.s3,
  },
  sectionTitle: {
    marginBottom: 0,
  },
  chipRow: {
    flexDirection: 'row',
    gap: Spacing.s2,
  },
  chipRowWrap: {
    flexWrap: 'wrap',
  },
  sliderWrap: {
    paddingHorizontal: Spacing.s1,
    paddingTop: Spacing.s2,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.s3,
    paddingHorizontal: Spacing.s6,
    paddingTop: Spacing.s4,
  },
  applyButton: {
    flex: 1,
  },
});
