import * as Location from 'expo-location';
import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Screen } from '@/components/Screen';
import { Button, Text } from '@/components/ui';
import { setLocationConsent as patchLocationConsent } from '@/lib/api/endpoints/auth';
import { useSessionStore } from '@/store/useSessionStore';
import { Radius, Spacing, useTheme } from '@/theme';

/**
 * Soft-ask primer before the OS prompt (Figma Build Report, Onboarding & Auth
 * module) — asking cold gets reflexively declined; explaining why first
 * measurably improves opt-in rates.
 */
export default function AuthLocationPermissionScreen() {
  const { colors } = useTheme();
  const setLocationConsent = useSessionStore((s) => s.setLocationConsent);
  const [requesting, setRequesting] = useState(false);

  const finish = async (granted: boolean) => {
    setLocationConsent(granted);
    router.replace('/');
    try {
      // Recorded best-effort after navigating — a failed PATCH here shouldn't
      // block the user; local state is what the routing gate reads.
      await patchLocationConsent(granted);
    } catch {
      // swallow — non-critical
    }
  };

  const handleAllow = async () => {
    setRequesting(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      finish(status === 'granted');
    } catch {
      finish(false);
    } finally {
      setRequesting(false);
    }
  };

  return (
    <Screen style={styles.screen}>
      <View style={styles.body}>
        <View style={[styles.mark, { backgroundColor: colors.infoTint }]}>
          <View style={[styles.markInner, { backgroundColor: colors.info }]} />
        </View>
        <Text variant="h1">Find trainers near you</Text>
        <Text variant="body" color="textSecondary" style={styles.copy}>
          Vyaam uses your location to show at-home trainers who actually cover your area and gyms
          you can get to. We never share it with a trainer until you accept their bid.
        </Text>
      </View>

      <View style={styles.footer}>
        <Button label="Allow location" size="large" fullWidth loading={requesting} onPress={handleAllow} />
        <Button label="Not now" variant="ghost" onPress={() => finish(false)} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    justifyContent: 'space-between',
    paddingVertical: Spacing.s4,
  },
  body: {
    flex: 1,
    justifyContent: 'center',
    gap: Spacing.s4,
  },
  mark: {
    width: 96,
    height: 96,
    borderRadius: Radius.card,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.s4,
  },
  markInner: {
    width: 40,
    height: 40,
    borderRadius: Radius.full,
  },
  copy: {
    maxWidth: 340,
  },
  footer: {
    gap: Spacing.s2,
    marginBottom: Spacing.s4,
  },
});
