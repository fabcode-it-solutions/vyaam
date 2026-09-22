import { memo, useCallback } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { DiscoverIcon, HomeIcon, PlusIconcenter, SearchIcon, SparkleIcon, Text, UserIcon, UsersIcon } from '@/components/ui';
import { Radius, Spacing, useTheme } from '@/theme';

export type HomeTab = 'home' | 'discover' | 'community' | 'me';

export type HomeTabBarProps = {
  active: HomeTab;
  onNavigate: (tab: HomeTab) => void;
  onQuickAction: () => void;
};

const TABS: { key: HomeTab; label: string }[] = [
  { key: 'home', label: 'Home' },
  { key: 'discover', label: 'Discover' },
  { key: 'community', label: 'Community' },
  { key: 'me', label: 'Me' },
];

/**
 * Bottom nav shown on Customer/Home. Persistent chrome that in a real
 * navigator would live in a role-aware tab layout (per CLAUDE.md) rather
 * than being drawn per-screen — kept local to this screen for now since
 * Discover/Community/Me aren't built yet. Icons for Discover/Community/Me
 * and the raised centre action are a best-effort guess, not yet confirmed
 * against Figma Dev Mode.
 */
export const HomeTabBar = memo(function HomeTabBar({ active, onNavigate, onQuickAction }: HomeTabBarProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const renderIcon = useCallback(
    (tab: HomeTab, color: string) => {
      switch (tab) {
        case 'home':
          return <HomeIcon size={22} color={color} />;
        case 'discover':
          return <DiscoverIcon size={22} color={color} />;
        case 'community':
          return <UsersIcon size={22} color={color} />;
        case 'me':
          return <UserIcon size={22} color={color} />;
      }
    },
    [],
  );

  const [beforeCenter, afterCenter] = [TABS.slice(0, 2), TABS.slice(2)];

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
      {beforeCenter.map((tab) => renderTab(tab))}

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Quick actions"
        onPress={onQuickAction}
        style={[styles.quickAction, { backgroundColor: '#0F3D34', borderRadius: Radius.full }]}>
        <PlusIconcenter size={24} color={colors.onBrand} />
      </Pressable>

      {afterCenter.map((tab) => renderTab(tab))}
    </View>
  );

  function renderTab(tab: { key: HomeTab; label: string }) {
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
  }
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
  quickAction: {
    width: 52,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -20,
  },
});
