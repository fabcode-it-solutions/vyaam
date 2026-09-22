import { router, useLocalSearchParams } from 'expo-router';
import { useCallback } from 'react';
import { Alert, StyleSheet, View } from 'react-native';

import { Screen } from '@/components/Screen';
import { BackButton, Button, CalendarIcon, Text } from '@/components/ui';
import { Radius, Spacing, useTheme } from '@/theme';

/**
 * Requests/Request Expired — shown when a posted request closed with no bid
 * accepted within the 7-day window, opened from My Requests. Request title
 * below is illustrative, keyed off the `title` route param; needs the real
 * request record rather than a static fallback, and "Repost this request"
 * needs the real repost endpoint rather than a coming-soon alert.
 */

const DEFAULT_TITLE = 'Upper body strength coaching';

function comingSoon(feature: string) {
  Alert.alert('Coming soon', `${feature} isn’t available yet.`);
}

export default function RequestExpiredScreen() {
  const { colors } = useTheme();
  const { title } = useLocalSearchParams<{ id?: string; title?: string }>();
  const requestTitle = title || DEFAULT_TITLE;

  const handleRepost = useCallback(() => comingSoon('Reposting this request'), []);
  const handleBrowseTrainers = useCallback(() => router.push('/discover/trainer-list'), []);

  return (
    <Screen>
      <View style={styles.header}>
        <BackButton onPress={() => router.back()} />
      </View>

      <View style={styles.body}>
        <View style={[styles.iconOuter, { backgroundColor: colors.border }]}>
          <CalendarIcon expired size={28} color={colors.textMuted} />
        </View>
        <Text variant="h2" style={styles.title}>
          This request expired
        </Text>
        <Text variant="bodySecondary" color="textSecondary" style={styles.subtitle}>
          No bid was accepted within 7 days, so “{requestTitle}” has closed.
        </Text>
      </View>

      <Button label="Repost this request" size="large" fullWidth onPress={handleRepost} />
      <Button
        label="Browse trainers instead"
        variant="secondary"
        size="large"
        fullWidth
        onPress={handleBrowseTrainers}
        style={styles.secondButton}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: Spacing.s2,
  },
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.s6,
  },
  iconOuter: {
    width: 72,
    height: 72,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    marginTop: Spacing.s5,
    textAlign: 'center',
  },
  subtitle: {
    marginTop: Spacing.s2,
    textAlign: 'center',
  },
  secondButton: {
    marginTop: Spacing.s3,
    marginBottom: Spacing.s2,
  },
});
