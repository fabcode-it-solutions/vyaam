import { router, Stack } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { Screen } from '@/components/Screen';
import { TwoTabBar, type TwoTab } from '@/components/home';
import { SectionLabel, SettingsSectionCard, type SettingsRowConfig } from '@/components/settings';
import {
  Avatar,
  BackButton,
  BellIcon,
  CardIcon,
  ConfirmModal,
  FlagIcon,
  GlobeIcon,
  HelpIcon,
  InfoIcon,
  LogOutIcon,
  PencilIcon,
  PieChartIcon,
  ReceiptIcon,
  SettingsIcon,
  ShieldIcon,
  SwapIcon,
  Text,
  UserIcon,
} from '@/components/ui';
import { logout as logoutRequest } from '@/lib/api/endpoints/auth';
import { getHomeRouteForRole } from '@/lib/navigation/roleHome';
import { useSessionStore } from '@/store/useSessionStore';
import { Radius, Spacing, useTheme } from '@/theme';

/**
 * My Profile — Figma "Profile/My Profile" screen. Name/role come from the
 * real session (useSessionStore); the "· Hisar, Haryana" location suffix is
 * illustrative — there's no location field on the session yet. Log out is
 * wired to the real flow already proven on the placeholder Home screen
 * (best-effort /auth/logout, then clear local session regardless — the
 * refresh token just expires server-side if the call fails).
 */

function comingSoon(feature: string) {
  Alert.alert('Coming soon', `${feature} isn’t available yet.`);
}

export default function MyProfileScreen() {
  const { colors } = useTheme();
  const { user, phone, refreshToken, logout } = useSessionStore();
  const [loggingOut, setLoggingOut] = useState(false);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);

  const isTrainer = user?.activeRole === 'trainer';
  const roleLabel = isTrainer ? 'Trainer' : 'Customer';
  const name = user?.fullName ?? 'Your account';

  // Profile is reached from Home via `push` (see Home's handleNavigateTab),
  // so Home is normally still sitting right underneath in the stack —
  // `back()` returns to that exact screen instead of stacking a fresh one
  // on top. Falls back to `replace` only if Profile was somehow opened
  // without Home beneath it (e.g. a direct deep link).
  const goToHome = useCallback(() => {
    if (router.canGoBack()) router.back();
    else router.replace(getHomeRouteForRole(user?.activeRole));
  }, [user?.activeRole]);

  const handleNavigateTab = useCallback(
    (tab: TwoTab) => {
      if (tab === 'me') return;
      goToHome();
    },
    [goToHome],
  );

  const handleLogoutPress = useCallback(() => {
    setLogoutModalVisible(true);
  }, []);

  const handleLogoutCancel = useCallback(() => {
    if (loggingOut) return;
    setLogoutModalVisible(false);
  }, [loggingOut]);

  const handleLogoutConfirm = useCallback(async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      if (refreshToken) await logoutRequest(refreshToken);
    } catch {
      // proceed with local logout regardless — the refresh token will just expire server-side
    } finally {
      setLogoutModalVisible(false);
      logout();
      router.replace('/');
    }
  }, [loggingOut, refreshToken, logout]);

  const handleDeleteAccount = useCallback(() => {
    router.push('/profile/deleteaccount');
  }, []);

  const accountRows: SettingsRowConfig[] = useMemo(
    () => [
      {
        key: 'edit-profile',
        icon: UserIcon,
        label: 'Edit profile',
        onPress: () => router.push('/profile/editprofile'),
      },
      {
        key: 'calculators',
        icon: PieChartIcon,
        label: 'Calculators',
        onPress: () => router.push('/calculators/hub'),
      },
      {
        key: 'account-settings',
        icon: SettingsIcon,
        label: 'Account settings',
        onPress: () => router.push('/profile/account-settings'),
      },
      {
        key: 'language',
        icon: GlobeIcon,
        label: 'Language',
        trailingText: 'English',
        onPress: () => router.push('/profile/languagesettings'),
      },
      {
        key: 'notifications',
        icon: BellIcon,
        label: 'Notifications',
        onPress: () => router.push('/profile/notification-settings'),
      },
      {
        key: 'privacy',
        icon: ShieldIcon,
        label: 'Privacy',
        onPress: () => router.push('/profile/privacy-settings'),
      },
    ],
    [],
  );

  const billingRows: SettingsRowConfig[] = useMemo(
    () => [
      {
        key: 'payment-methods',
        icon: CardIcon,
        label: 'Payment methods',
        onPress: () => router.push('/profile/paymentmethods'),
      },
      {
        key: 'subscription',
        icon: ReceiptIcon,
        label: 'Subscription & billing',
        onPress: () => router.push('/profile/subscription'),
      },
    ],
    [],
  );

  const supportRows: SettingsRowConfig[] = useMemo(
    () => [
      {
        key: 'help',
        icon: HelpIcon,
        label: 'Help & support',
        onPress: () => router.push('/profile/help-support'),
      },
      {
        key: 'report',
        icon: FlagIcon,
        label: 'Report an issue',
        onPress: () => router.push('/profile/reportissue'),
      },
      {
        key: 'about',
        icon: InfoIcon,
        label: 'About & legal',
        onPress: () => router.push('/profile/about-legal'),
      },
    ],
    [],
  );

  // Trainer module temporarily disabled (customer-only launch, product
  // direction 2026-09-03) — commented out, not deleted, so this row can come
  // back once the trainer module is turned back on.
  // const switchRow: SettingsRowConfig = useMemo(
  //   () => ({
  //     key: 'switch-role',
  //     icon: SwapIcon,
  //     label: isTrainer ? 'Switch to customer mode' : 'Switch to trainer mode',
  //     onPress: () => router.push('/profile/switchrole'),
  //   }),
  //   [isTrainer],
  // );

  const logoutRow: SettingsRowConfig = useMemo(
    () => ({
      key: 'logout',
      icon: LogOutIcon,
      label: loggingOut ? 'Logging out…' : 'Log out',
      danger: true,
      showChevron: false,
      onPress: handleLogoutPress,
    }),
    [loggingOut, handleLogoutPress],
  );

  return (
    <Screen padded={false} edges={['top']}>
      {/* No slide-in animation — Home/Me should read as tabs, not pages. */}
      <Stack.Screen options={{ animation: 'none' }} />
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}>
        <BackButton onPress={goToHome} style={styles.backButton} />

        <View style={styles.profileHeader}>
          <View style={styles.avatarWrap}>
            <Avatar size="hero" initials={name} seed={user?.id ?? phone ?? 'me'} />
            {/* <Pressable
              accessibilityRole="button"
              accessibilityLabel="Change profile photo"
              onPress={() => comingSoon('Changing your profile photo')}
              style={[styles.editBadge, { backgroundColor: colors.accent, borderColor: colors.background }]}>
              <PencilIcon size={12} color={colors.onAccent} />
            </Pressable> */}
          </View>
          <Text variant="h3" style={styles.name}>
            {name}
          </Text>
          <Text variant="caption" color="textMuted">
            {roleLabel} 
            {/* · Hisar, Haryana */}
          </Text>
        </View>

        <SectionLabel label="Account" />
        <SettingsSectionCard rows={accountRows} />

        <SectionLabel label="Billing" />
        <SettingsSectionCard rows={billingRows} />

        <SectionLabel label="Support" />
        <SettingsSectionCard rows={supportRows} />

        {/* Trainer module temporarily disabled — see switchRow comment above. */}
        {/* <View style={styles.standaloneCard}>
          <SettingsSectionCard rows={[switchRow]} />
        </View> */}

        <View style={styles.standaloneCard}>
          <SettingsSectionCard rows={[logoutRow]} />
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Delete account"
          onPress={handleDeleteAccount}
          style={styles.deleteAccount}>
          <Text variant="caption" color="textMuted">
            Delete account
          </Text>
        </Pressable>
      </ScrollView>

      <TwoTabBar active="me" onNavigate={handleNavigateTab} />

      <ConfirmModal
        visible={logoutModalVisible}
        title="Log out?"
        message="Are you sure you want to logout"
        confirmLabel="Confirm"
        cancelLabel="Cancel"
        loading={loggingOut}
        onConfirm={handleLogoutConfirm}
        onCancel={handleLogoutCancel}
      />
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
  backButton: {
    marginTop: Spacing.s3,
  },
  profileHeader: {
    alignItems: 'center',
    marginTop: Spacing.s3,
    marginBottom: Spacing.s6,
    gap: Spacing.s1,
  },
  avatarWrap: {
    position: 'relative',
    marginBottom: Spacing.s3,
  },
  editBadge: {
    position: 'absolute',
    right: -2,
    bottom: -2,
    width: 28,
    height: 28,
    borderRadius: Radius.full,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    marginTop: Spacing.s1,
  },
  standaloneCard: {
    marginTop: Spacing.s6,
  },
  deleteAccount: {
    alignSelf: 'center',
    marginTop: Spacing.s6,
    padding: Spacing.s2,
  },
});
