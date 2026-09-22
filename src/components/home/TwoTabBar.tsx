import { memo, useCallback } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HomeIcon, Text, UserIcon } from '@/components/ui';
import { Spacing, useTheme } from '@/theme';

export type TwoTab = 'home' | 'me';

export type TwoTabBarProps = {
  active: TwoTab;
  onNavigate: (tab: TwoTab) => void;
};

/**
 * Reduced bottom nav for the customer-only launch (product direction
 * 2026-09-03) — Home and Me split the bar 50/50, replacing HomeTabBar's four
 * tabs + raised quick action while Discover/Community aren't live. Shared
 * between Customer/Home and My Profile so both show the same persistent
 * chrome with the correct tab highlighted.
 */
export const TwoTabBar = memo(function TwoTabBar({ active, onNavigate }: TwoTabBarProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const handleHome = useCallback(() => onNavigate('home'), [onNavigate]);
  const handleMe = useCallback(() => onNavigate('me'), [onNavigate]);

  const homeColor = active === 'home' ? colors.brand : colors.textMuted;
  const meColor = active === 'me' ? colors.brand : colors.textMuted;

  return (
    <View
      style={[
        styles.bar,
        { backgroundColor: colors.surface, borderTopColor: colors.border, paddingBottom: insets.bottom + Spacing.s2 },
      ]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Home"
        accessibilityState={{ selected: active === 'home' }}
        onPress={handleHome}
        style={styles.tab}>
        <HomeIcon size={22} color={homeColor} />
        <Text variant="caption" style={{ color: homeColor }}>
          Home
        </Text>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Me"
        accessibilityState={{ selected: active === 'me' }}
        onPress={handleMe}
        style={styles.tab}>
        <UserIcon size={22} color={meColor} />
        <Text variant="caption" style={{ color: meColor }}>
          Me
        </Text>
      </Pressable>
    </View>
  );
});

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    paddingTop: Spacing.s2,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
    paddingVertical: Spacing.s1,
  },
});
