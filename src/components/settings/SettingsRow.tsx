import { memo, type ComponentType, type ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ChevronIcon, Text } from '@/components/ui';
import { Radius, Spacing, useTheme } from '@/theme';

export type SettingsRowConfig = {
  key: string;
  icon: ComponentType<{ size?: number; color?: string }>;
  label: string;
  /** Short value shown before the chevron, e.g. "Everyone", "priya@example.com". */
  trailingText?: string;
  /** Custom trailing element, e.g. a Switch or a Badge — takes the place of/alongside trailingText. */
  trailing?: ReactNode;
  danger?: boolean;
  onPress?: () => void;
  /** Defaults to true when onPress is set, false otherwise. Set explicitly to override (e.g. a danger row with no chevron). */
  showChevron?: boolean;
};

export type SettingsRowProps = SettingsRowConfig & {
  isFirst?: boolean;
};

/**
 * One row inside a settings card — icon circle, label, optional trailing
 * value/control, optional chevron. Reused across My Profile, Account
 * settings, Notification settings, Privacy settings and About & legal so
 * each screen doesn't rebuild the same row/card pattern.
 */
export const SettingsRow = memo(function SettingsRow({
  icon: Icon,
  label,
  trailingText,
  trailing,
  danger,
  onPress,
  showChevron,
  isFirst,
}: SettingsRowProps) {
  const { colors } = useTheme();
  const iconColor = danger ? colors.danger : colors.textPrimary;
  const displayChevron = showChevron ?? Boolean(onPress);
  const rowStyle = [styles.row, !isFirst && { borderTopWidth: 1, borderTopColor: colors.border }];

  const content = (
    <>
      <View style={[styles.rowIcon, { backgroundColor: colors.border }]}>
        <Icon size={18} color={iconColor} />
      </View>
      <Text
        variant="h5"
        color={danger ? 'danger' : 'textPrimary'}
        numberOfLines={1}
        style={styles.rowLabel}>
        {label}
      </Text>
      {trailingText && (
        <Text variant="bodySecondary" color="textMuted" numberOfLines={1} style={styles.trailingText}>
          {trailingText}
        </Text>
      )}
      {trailing}
      {displayChevron && <ChevronIcon size={16} color={colors.textMuted} />}
    </>
  );

  if (!onPress) {
    return <View style={rowStyle}>{content}</View>;
  }

  return (
    <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={onPress} style={rowStyle}>
      {content}
    </Pressable>
  );
});

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.s3,
    paddingHorizontal: Spacing.s4,
    paddingVertical: Spacing.s4,
  },
  rowIcon: {
    width: 36,
    height: 36,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowLabel: {
    flex: 1,
  },
  trailingText: {
    flexShrink: 1,
    maxWidth: 140,
    textAlign: 'right',
  },
});
