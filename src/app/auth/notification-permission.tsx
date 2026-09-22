import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';
import { useState } from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';

import { Screen } from '@/components/Screen';
import { BellIcon, Button, Text } from '@/components/ui';
import { setNotificationConsent as patchNotificationConsent } from '@/lib/api/endpoints/auth';
import { registerDevice } from '@/lib/api/endpoints/devices';
import { useSessionStore } from '@/store/useSessionStore';
import { Radius, Spacing, useTheme } from '@/theme';

/** Figma node 42:46 (Auth/Notification Permission) — soft-ask primer before the OS prompt. */
export default function AuthNotificationPermissionScreen() {
  const { colors } = useTheme();
  const setNotificationConsent = useSessionStore((s) => s.setNotificationConsent);
  const [requesting, setRequesting] = useState(false);

  const finish = async (granted: boolean) => {
    setNotificationConsent(granted);
    router.replace('/');
    try {
      // Best-effort after navigating — local state is what the routing gate reads.
      await patchNotificationConsent(granted);
      if (granted && (Platform.OS === 'ios' || Platform.OS === 'android')) {
        const { data: pushToken } = await Notifications.getDevicePushTokenAsync();
        await registerDevice(pushToken, Platform.OS);
      }
    } catch {
      // swallow — non-critical
    }
  };

  const handleAllow = async () => {
    setRequesting(true);
    try {
      const { status } = await Notifications.requestPermissionsAsync();
      await finish(status === 'granted');
    } catch {
      await finish(false);
    } finally {
      setRequesting(false);
    }
  };

  return (
    <Screen padded={false}>
      <View style={styles.content}>
        <View style={styles.topRow}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Skip"
            hitSlop={8}
            onPress={() => finish(false)}
            style={styles.skip}>
            <Text variant="caption" color="textMuted">
              Skip
            </Text>
          </Pressable>
        </View>

        <View style={styles.body}>
          <View style={[styles.iconCircle, { backgroundColor: colors.accentTint }]}>
            <BellIcon size={48} color={colors.accentDeep} />
          </View>
          <Text variant="h2" style={styles.heading}>
            Never miss a bid
          </Text>
          <Text variant="bodySecondary" color="textSecondary" style={styles.description}>
            Get notified the moment a trainer responds or a session is coming up.
          </Text>
        </View>

        <Button
          label="Enable notifications"
          size="large"
          fullWidth
          loading={requesting}
          onPress={handleAllow}
          style={styles.button}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: Spacing.s6,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: Spacing.s3,
  },
  skip: {
    borderRadius: Radius.full,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
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
  heading: {
    textAlign: 'center',
    maxWidth: 214,
  },
  description: {
    textAlign: 'center',
    maxWidth: 297,
    marginTop: Spacing.s3,
  },
  button: {
    marginBottom: Spacing.s8,
  },
});
