import { router } from 'expo-router';
import { useCallback, useState, type ComponentType } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { Screen } from '@/components/Screen';
import { Badge, BackButton, Button, DumbbellIcon, Text, UsersIcon } from '@/components/ui';
import { switchRole } from '@/lib/api/endpoints/me';
import { useSessionStore, type ActiveRole } from '@/store/useSessionStore';
import { Radius, Spacing, useTheme } from '@/theme';

/**
 * Switch role — Figma "Profile/Switch role" screen. Wired to the same
 * POST /me/switch-role used by Auth/Role Select — that endpoint starts
 * trainer verification on a first switch to 'trainer' rather than switching
 * immediately, so activeRole may not change right away even on success.
 */

type SwitchableRole = 'customer' | 'trainer';

type RoleOption = {
  role: SwitchableRole;
  title: string;
  body: string;
  icon: ComponentType<{ size?: number; color?: string }>;
};

const OPTIONS: RoleOption[] = [
  { role: 'customer', title: 'Customer', body: 'Find and book trainers', icon: UsersIcon },
  { role: 'trainer', title: 'Trainer', body: 'Get discovered, manage clients', icon: DumbbellIcon },
];

export default function SwitchRoleScreen() {
  const { colors } = useTheme();
  const { user, setUser } = useSessionStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const activeRole: ActiveRole = user?.activeRole ?? 'customer';
  const targetRole: SwitchableRole = activeRole === 'trainer' ? 'customer' : 'trainer';

  const handleSwitch = useCallback(async () => {
    if (!user || loading) return;
    setLoading(true);
    setError(undefined);
    try {
      const result = await switchRole(targetRole);
      setUser({ ...user, activeRole: result.activeRole });
      router.back();
    } catch {
      setError('Could not switch modes. Try again.');
    } finally {
      setLoading(false);
    }
  }, [user, loading, targetRole, setUser]);

  return (
    <Screen padded={false}>
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <BackButton onPress={() => router.back()} />
          <Text variant="h2">Switch role</Text>
        </View>

        <Text variant="bodySecondary" color="textSecondary" style={styles.intro}>
          Your {activeRole} profile, logs, and plans stay saved — you can switch back anytime.
        </Text>

        <View style={styles.options}>
          {OPTIONS.map((option) => {
            const isCurrent = option.role === activeRole;
            const Icon = option.icon;
            return (
              <Pressable
                key={option.role}
                accessibilityRole="button"
                accessibilityLabel={isCurrent ? `${option.title}, current mode` : `Switch to ${option.title} mode`}
                onPress={isCurrent ? undefined : handleSwitch}
                disabled={isCurrent || loading}
                style={[
                  styles.card,
                  {
                    backgroundColor: colors.surface,
                    borderColor: isCurrent ? colors.brand : colors.border,
                    borderWidth: isCurrent ? 2 : 1,
                  },
                ]}>
                <View style={[styles.iconCircle, { backgroundColor: colors.border }]}>
                  <Icon size={22} color={colors.textPrimary} />
                </View>
                <View style={styles.cardText}>
                  <Text variant="h4">{option.title}</Text>
                  <Text variant="caption" color="textSecondary">
                    {option.body}
                  </Text>
                </View>
                {isCurrent && <Badge label="Current" variant="verified" />}
              </Pressable>
            );
          })}
        </View>

        {error && (
          <Text variant="caption" color="danger" style={styles.error}>
            {error}
          </Text>
        )}

        <Button
          label={`Switch to ${targetRole} mode`}
          size="large"
          fullWidth
          loading={loading}
          onPress={handleSwitch}
          style={styles.switchButton}
        />
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
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardText: {
    flex: 1,
    gap: 4,
  },
  error: {
    textAlign: 'center',
    marginTop: Spacing.s5,
  },
  switchButton: {
    marginTop: Spacing.s6,
  },
});
