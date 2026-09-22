import { memo, type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { Radius, Spacing, useTheme, type Theme } from '@/theme';

import { Text } from './Text';

export type BadgeVariant =
  | 'verified'
  | 'idChecked'
  | 'pendingReview'
  | 'suspended'
  | 'onlineOnly'
  | 'draft'
  /** Not in the Figma component set yet (flagged gap in CLAUDE.md) — OFFER / NEW BATCH / FREE SESSION style tags. */
  | 'promo'
  /** Solid ink pill, e.g. "4 new bids". */
  | 'notification'
  /** Solid circular danger badge for unread counts. */
  | 'count';

export type BadgeProps = {
  label: string;
  variant?: BadgeVariant;
  /** e.g. a checkmark on a "Shared" status badge. */
  leading?: ReactNode;
};

function tintStyle(theme: Theme, variant: BadgeVariant) {
  const { colors } = theme;
  switch (variant) {
    case 'verified':
    case 'idChecked':
      return { backgroundColor: colors.verifiedTint, color: colors.verified };
    case 'pendingReview':
      return { backgroundColor: colors.warningTint, color: colors.onWarningTint };
    case 'suspended':
      return { backgroundColor: colors.dangerTint, color: colors.danger };
    case 'onlineOnly':
      return { backgroundColor: colors.infoTint, color: colors.onInfoTint };
    case 'draft':
      return { backgroundColor: colors.border, color: colors.textSecondary };
    case 'promo':
      return { backgroundColor: colors.accentTint, color: colors.accentDeep };
    case 'notification':
      return { backgroundColor: colors.brand, color: colors.onBrand };
    case 'count':
      return { backgroundColor: colors.danger, color: colors.onDanger };
  }
}

/**
 * Tint background + deep text — never a solid fill, except the two explicit
 * solid states (`notification`, `count`) called out in CLAUDE.md. Per the
 * Brand Guide: max four badges per card, verification badges always lead and
 * never share a row with attribute badges, and colour is never the only
 * carrier of meaning — pair with a label, which this component enforces by
 * requiring one.
 */
export const Badge = memo(function Badge({ label, variant = 'draft', leading }: BadgeProps) {
  const theme = useTheme();
  const { backgroundColor, color } = tintStyle(theme, variant);
  const isCount = variant === 'count';

  return (
    <View
      style={[
        styles.base,
        { backgroundColor, borderRadius: Radius.full },
        isCount && styles.count,
      ]}>
      {leading}
      <Text
        variant={isCount ? 'caption' : 'caption'}
        numberOfLines={1}
        style={[{ color }, isCount && styles.countLabel]}
        accessibilityRole="text">
        {label}
      </Text>
    </View>
  );
});

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.s1,
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.s3,
    paddingVertical: 4,
  },
  count: {
    minWidth: 20,
    height: 20,
    paddingHorizontal: Spacing.s1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countLabel: {
    textAlign: 'center',
  },
});
