import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Screen } from '@/components/Screen';
import { Avatar, Badge, Button, Card, Text } from '@/components/ui';
import { logout as logoutRequest } from '@/lib/api/endpoints/auth';
import { useSessionStore } from '@/store/useSessionStore';
import { Spacing } from '@/theme';

/**
 * Placeholder landing screen — proves the onboarding/auth flow completes end
 * to end. Real Customer/Home and Trainer/Home (role-aware tab navigators,
 * per CLAUDE.md) are Phase 1 marketplace-feed / Phase 3 work and land in a
 * later pass, not this one.
 */
export default function HomeScreen() {
  const { user, phone, refreshToken, logout } = useSessionStore();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      if (refreshToken) await logoutRequest(refreshToken);
    } catch {
      // proceed with local logout regardless — the refresh token will just expire server-side
    } finally {
      logout();
      router.replace('/');
    }
  };

  const isTrainer = user?.activeRole === 'trainer';

  return (
    <Screen>
      <View style={styles.header}>
        <Text variant="h1">Welcome{user ? `, ${user.fullName.split(' ')[0]}` : ''}</Text>
        <Text variant="body" color="textSecondary">
          Onboarding and auth are wired up — the real {isTrainer ? 'Trainer' : 'Customer'} Home feed
          comes next.
        </Text>
      </View>

      <Card style={styles.card}>
        <View style={styles.cardRow}>
          <Avatar size="list" initials={user?.fullName ?? '?'} seed={phone ?? 'user'} />
          <View style={styles.cardInfo}>
            <Text variant="h4">{user?.fullName ?? 'Unnamed'}</Text>
            <Text variant="bodySecondary" color="textSecondary">
              {phone}
            </Text>
          </View>
          <Badge label={isTrainer ? 'Trainer' : 'Customer'} variant="onlineOnly" />
        </View>
      </Card>

      <Button
        label="Log out"
        variant="secondary"
        loading={loggingOut}
        onPress={handleLogout}
        style={styles.logout}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    marginTop: Spacing.s8,
    marginBottom: Spacing.s6,
    gap: Spacing.s2,
  },
  card: {
    marginBottom: Spacing.s6,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.s3,
  },
  cardInfo: {
    flex: 1,
    gap: 2,
  },
  logout: {
    alignSelf: 'flex-start',
  },
});
