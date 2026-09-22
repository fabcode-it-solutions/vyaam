import { router } from 'expo-router';
import { useState, type ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Screen } from '@/components/Screen';
import { ArrowIcon, Button, CheckIcon, DumbbellIcon, SearchIcon, Text } from '@/components/ui';
import { switchRole } from '@/lib/api/endpoints/me';
import { useSessionStore } from '@/store/useSessionStore';
import { Radius, Spacing, useTheme, type Theme } from '@/theme';

/**
 * Auth/Role Select — Figma node 39:21
 * (https://www.figma.com/design/XGneuIxWiSwOptsUsmA4Mh/Vyaam?node-id=39-21).
 */

type SelectableRole = 'customer' | 'trainer';

type RoleOption = {
  role: SelectableRole;
  title: string;
  body: string;
  icon: ReactNode;
  iconBg: keyof Theme['colors'];
};

const OPTIONS: RoleOption[] = [
  {
    role: 'customer',
    title: 'Find a trainer',
    body: 'Book verified gym and yoga trainers near you',
    icon: <SearchIcon />,
    iconBg: 'accentTint',
  },
  {
    role: 'trainer',
    title: 'I’m a trainer',
    body: 'Get discovered and grow your client base',
    icon: <DumbbellIcon />,
    iconBg: 'border',
  },
];

export default function AuthRoleSelectScreen() {
  const theme = useTheme();
  const { colors } = theme;
  const user = useSessionStore((s) => s.user);
  const setUser = useSessionStore((s) => s.setUser);
  const setRoleSelected = useSessionStore((s) => s.setRoleSelected);
  const setTrainerVerificationStatus = useSessionStore((s) => s.setTrainerVerificationStatus);
  const [selected, setSelected] = useState<SelectableRole | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const handleContinue = async () => {
    if (!selected || !user) return;
    setLoading(true);
    setError(undefined);
    try {
      // /auth/role always 409s on a fresh account (see endpoints/auth.ts) —
      // /me/switch-role is the endpoint that actually works, and correctly
      // starts trainer verification instead of switching immediately: it
      // returns activeRole: 'customer' (and trainerVerificationStatus:
      // 'pending') until an admin approves the account. Trust that response
      // rather than the user's raw selection — the routing gate at
      // src/app/index.tsx reads trainerVerificationStatus to route a
      // pending/rejected trainer into the verification flow instead of
      // either customer home or (falsely) trainer home.
      const result = await switchRole(selected);
      setUser({ ...user, activeRole: result.activeRole });
      setTrainerVerificationStatus(result.trainerVerificationStatus ?? null);
      setRoleSelected();
      router.replace('/');
    } catch {
      setError('Could not save that. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Back"
        onPress={() => router.back()}
        style={[styles.backButton, { backgroundColor: 'rgba(0, 0, 0, 0.06)' }]}>
        <ArrowIcon direction="left" size={18} color={colors.textPrimary} />
      </Pressable>

      <View style={styles.header}>
        <Text variant="h2">What brings you here?</Text>
        <Text variant="bodySecondary" color="textSecondary">
          You can always switch later from your profile.
        </Text>
      </View>

      <View style={styles.options}>
        {OPTIONS.map((option) => {
          const isSelected = selected === option.role;
          return (
            <Pressable
              key={option.role}
              accessibilityRole="radio"
              accessibilityState={{ checked: isSelected }}
              onPress={() => setSelected(option.role)}
              style={[
                styles.card,
                {
                  backgroundColor: colors.surface,
                  borderColor: isSelected ? colors.brand : colors.border,
                  borderWidth: isSelected ? 2 : 1,
                },
              ]}>
              <View style={[styles.iconCircle, { backgroundColor: colors[option.iconBg] }]}>
                {option.icon}
              </View>
              <View style={styles.cardText}>
                <Text variant="h4">{option.title}</Text>
                <Text variant="caption" color="textSecondary">
                  {option.body}
                </Text>
              </View>
              {isSelected && (
                <View style={[styles.badge, { backgroundColor: colors.brand }]}>
                  <CheckIcon size={13} color={colors.onBrand} />
                </View>
              )}
            </Pressable>
          );
        })}
      </View>

      <Text variant="caption" color="textMuted" style={styles.helper}>
        Do both? You can add a trainer profile anytime from settings.
      </Text>

      {error && (
        <Text variant="caption" color="danger" style={styles.error}>
          {error}
        </Text>
      )}

      <Button
        label="Continue"
        size="large"
        fullWidth
        loading={loading}
        disabled={!selected}
        onPress={handleContinue}
        style={styles.footer}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  backButton: {
    width: 44,
    height: 44,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.s2,
    marginBottom: Spacing.s8,
  },
  header: {
    gap: Spacing.s4,
    marginBottom: Spacing.s5,
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
  badge: {
    position: 'absolute',
    top: 14,
    right: 14,
    width: 24,
    height: 24,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  helper: {
    textAlign: 'center',
    marginTop: Spacing.s5,
  },
  error: {
    textAlign: 'center',
    marginTop: Spacing.s3,
  },
  footer: {
    marginTop: Spacing.s6,
  },
});
