import { memo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { BellIcon, ChevronIcon, IconButton, LocationPinIcon, Text } from '@/components/ui';
import { Radius, Spacing, useTheme } from '@/theme';

export type HomeHeaderProps = {
  locationLabel: string;
  hasUnreadNotifications?: boolean;
  onLocationPress?: () => void;
  onNotificationsPress: () => void;
};

/** Location selector + notifications bell — Customer/Home top row. */
export const HomeHeader = memo(function HomeHeader({
  locationLabel,
  hasUnreadNotifications = false,
  onLocationPress,
  onNotificationsPress,
}: HomeHeaderProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.row}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Location: ${locationLabel}`}
        disabled={!onLocationPress}
        onPress={onLocationPress}
        hitSlop={8}
        style={styles.location}>
        <LocationPinIcon size={16} color={colors.textSecondary} />
        <Text variant="h5" numberOfLines={1} style={styles.locationLabel}>
          {locationLabel}
        </Text>
        <View style={styles.chevronDown}>
          <ChevronIcon size={14} color={colors.textSecondary} />
        </View>
      </Pressable>

      <View>
        <IconButton
          accessibilityLabel="Notifications"
          icon={<BellIcon size={22} color={colors.textPrimary} />}
          variant="surface"
          onPress={onNotificationsPress}
        />
        {hasUnreadNotifications && (
          <View style={[styles.dot, { backgroundColor: colors.danger, borderRadius: Radius.full }]} />
        )}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  location: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.s2,
    marginRight: Spacing.s3,
  },
  locationLabel: {
    flexShrink: 1,
  },
  chevronDown: {
    transform: [{ rotate: '90deg' }],
  },
  dot: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 10,
    height: 10,
    borderWidth: 1.5,
    borderColor: '#FAF7F0',
  },
});
