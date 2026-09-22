import { memo } from 'react';
import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui';
import { Spacing, useTheme } from '@/theme';

export type RequestFieldRowProps = {
  label: string;
  value: string;
  isFirst?: boolean;
};

/** One label/value line in Trainer/Request Detail's fields table. */
export const RequestFieldRow = memo(function RequestFieldRow({ label, value, isFirst }: RequestFieldRowProps) {
  const { colors } = useTheme();
  return (
    <View style={[styles.row, !isFirst && { borderTopWidth: 1, borderTopColor: colors.border }]}>
      <Text variant="caption" color="textMuted" style={styles.label}>
        {label}
      </Text>
      <Text variant="h5" numberOfLines={2} style={styles.value}>
        {value}
      </Text>
    </View>
  );
});

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: Spacing.s4,
    paddingVertical: Spacing.s3,
  },
  label: {
    paddingTop: 2,
  },
  value: {
    flex: 1,
    textAlign: 'right',
  },
});
