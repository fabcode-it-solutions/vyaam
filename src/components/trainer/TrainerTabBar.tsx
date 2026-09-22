import { memo, useCallback } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HomeIcon, ReceiptIcon, TargetIcon, Text, UserIcon, UsersIcon } from '@/components/ui';
import { Spacing, useTheme } from '@/theme';

export type TrainerTab = 'home' | 'leads' | 'clients' | 'earnings' | 'me';

export type TrainerTabBarProps = {
  active: TrainerTab;
  onNavigate: (tab: TrainerTab) => void;
};

const TABS: { key: TrainerTab; label: string }[] = [
  { key: 'home', label: 'Home' },
  { key: 'leads', label: 'Leads' },
  { key: 'clients', label: 'Clients' },
  { key: 'earnings', label: 'Earnings' },
  { key: 'me', label: 'Me' },
];

/**
 * Bottom nav for Trainer Home — a flat 5-tab bar, distinct from
 * HomeTabBar's customer set (different tabs, no raised centre action). Per
 * CLAUDE.md this really belongs in a role-aware tab navigator that swaps in
 * on /me/switch-role rather than being drawn per-screen, but that
 * restructuring is out of scope here — same "kept local for now" state
 * HomeTabBar is in. Icons for Leads/Clients/Earnings are a best-effort
 * guess, not yet confirmed against Figma Dev Mode.
 */
export const TrainerTabBar = memo(function TrainerTabBar({ active, onNavigate }: TrainerTabBarProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const renderIcon = useCallback((tab: TrainerTab, color: string) => {
    switch (tab) {
      case 'home':
        return <HomeIcon size={22} color={color} />;
      case 'leads':
        return <TargetIcon size={22} color={color} />;
      case 'clients':
        return <UsersIcon size={22} color={color} />;
      case 'earnings':
        return <ReceiptIcon size={22} color={color} />;
      case 'me':
        return <UserIcon size={22} color={color} />;
    }
  }, []);

  return (
    <View
      style={[
        styles.bar,
        {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          paddingBottom: insets.bottom + Spacing.s2,
        },
      ]}>
      {TABS.map((tab) => {
        const isActive = tab.key === active;
        const color = isActive ? colors.brand : colors.textMuted;
        return (
          <Pressable
            key={tab.key}
            accessibilityRole="button"
            accessibilityLabel={tab.label}
            accessibilityState={{ selected: isActive }}
            onPress={() => onNavigate(tab.key)}
            style={styles.tab}>
            {renderIcon(tab.key, color)}
            <Text variant="caption" style={{ color }}>
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
});

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    paddingTop: Spacing.s2,
    paddingHorizontal: Spacing.s4,
  },
  tab: {
    alignItems: 'center',
    gap: 2,
    minWidth: 56,
  },
});
