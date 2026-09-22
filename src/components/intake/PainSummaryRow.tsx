import { memo, useCallback } from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { Badge, Text, XIcon } from '@/components/ui';
import { Radius, Spacing, useTheme } from '@/theme';

import { TIMING_LABEL, type PainArea } from './PainArea';

export type PainSummaryRowProps = {
  area: PainArea;
  onPress: (id: string) => void;
  onRemove: (id: string) => void;
};

/** Collapsed row for a selected pain area not currently being edited (Figma node 113:399). */
export const PainSummaryRow = memo(function PainSummaryRow({ area, onPress, onRemove }: PainSummaryRowProps) {
  const { colors } = useTheme();
  const handlePress = useCallback(() => onPress(area.id), [onPress, area.id]);
  const handleRemove = useCallback(() => onRemove(area.id), [onRemove, area.id]);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Edit ${area.label}`}
      onPress={handlePress}
      style={[styles.row, { backgroundColor: colors.surface, borderRadius: Radius.media }]}>
      <Text variant="h5" numberOfLines={1} style={styles.label}>
        {area.label}
      </Text>
      <Badge variant="pendingReview" label={`${TIMING_LABEL[area.timing]} · ${area.severity}/10`} />
      <Pressable accessibilityRole="button" accessibilityLabel={`Remove ${area.label}`} hitSlop={8} onPress={handleRemove}>
        <XIcon color={colors.textMuted} />
      </Pressable>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  row: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.s4,
    gap: Spacing.s3,
  },
  label: {
    flex: 1,
  },
});
