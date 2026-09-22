import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { Screen } from '@/components/Screen';
import { BackButton, CheckIcon, Text } from '@/components/ui';
import { getMe, setLanguage } from '@/lib/api/endpoints/me';
import { Radius, Spacing, useTheme } from '@/theme';

/**
 * Language settings — Figma "Profile/Language" screen. Wired to
 * GET /me + PATCH /me/language. Hindi copy isn't shipped yet (Noto Sans
 * Devanagari isn't wired up — see Known open items in CLAUDE.md/typography.ts),
 * so it's shown but not selectable yet even though the backend accepts it.
 */

type LanguageOption = {
  key: 'en' | 'hi';
  title: string;
  subtitle: string;
};

const OPTIONS: LanguageOption[] = [
  { key: 'en', title: 'English', subtitle: 'English' },
  { key: 'hi', title: 'Hindi', subtitle: 'हिन्दी' },
];

export default function LanguageSettingsScreen() {
  const { colors } = useTheme();
  const [selected, setSelected] = useState<LanguageOption['key']>('en');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const me = await getMe();
        if (!cancelled) setSelected(me.language);
      } catch {
        // keep the default rendered above
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSelect = async (option: LanguageOption) => {
    if (option.key === selected) return;
    if (option.key === 'hi') {
      Alert.alert('Coming soon', 'Hindi isn’t available yet.');
      return;
    }
    const previous = selected;
    setSelected(option.key);
    try {
      await setLanguage(option.key);
    } catch {
      setSelected(previous);
      Alert.alert('Something went wrong', 'Could not update your language. Try again.');
    }
  };

  return (
    <Screen padded={false}>
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <BackButton onPress={() => router.back()} />
          <Text variant="h2">Language</Text>
        </View>

        <Text variant="bodySecondary" color="textSecondary" style={styles.intro}>
          Choose the language for menus, buttons, and messages.
        </Text>

        <View style={styles.options}>
          {OPTIONS.map((option) => {
            const isSelected = selected === option.key;
            return (
              <Pressable
                key={option.key}
                accessibilityRole="radio"
                accessibilityState={{ checked: isSelected }}
                onPress={() => handleSelect(option)}
                style={[
                  styles.card,
                  {
                    backgroundColor: colors.surface,
                    borderColor: isSelected ? colors.brand : colors.border,
                    borderWidth: isSelected ? 2 : 1,
                  },
                ]}>
                <View style={styles.cardText}>
                  <Text variant="h4">{option.title}</Text>
                  <Text variant="caption" color="textSecondary">
                    {option.subtitle}
                  </Text>
                </View>
                {isSelected ? (
                  <View style={[styles.radio, { backgroundColor: colors.brand }]}>
                    <CheckIcon size={13} color={colors.onBrand} />
                  </View>
                ) : (
                  <View style={[styles.radio, styles.radioOutline, { borderColor: colors.border }]} />
                )}
              </Pressable>
            );
          })}
        </View>

        <Text variant="caption" color="textMuted" style={styles.footnote}>
          Hindi text uses Noto Sans Devanagari. Some layouts may adjust to fit longer translated text.
        </Text>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: Spacing.s6,
    paddingBottom: Spacing.s8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.s3,
    paddingTop: Spacing.s3,
    paddingBottom: Spacing.s5,
  },
  intro: {
    marginBottom: Spacing.s6,
  },
  options: {
    gap: Spacing.s4,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Radius.card,
    padding: Spacing.s5,
    gap: Spacing.s4,
  },
  cardText: {
    flex: 1,
    gap: 4,
  },
  radio: {
    width: 24,
    height: 24,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOutline: {
    borderWidth: 1.5,
  },
  footnote: {
    marginTop: Spacing.s6,
  },
});
