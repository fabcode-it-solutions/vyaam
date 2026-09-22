import { memo, useCallback } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Card, ChevronIcon, Text } from '@/components/ui';
import { Spacing, useTheme } from '@/theme';

export type TrainerLead = {
  id: string;
  title: string;
  mode: string;
  distanceKm: number;
  priceRange: string;
  /** e.g. "5 bids so far" — appended to the meta line when present (Trainer/Leads map sheet). */
  extra?: string;
};

export type TrainerLeadRowProps = {
  lead: TrainerLead;
  onPress: (lead: TrainerLead) => void;
};

/** One row in Trainer Home's "Recent leads" list. */
export const TrainerLeadRow = memo(function TrainerLeadRow({ lead, onPress }: TrainerLeadRowProps) {
  const { colors } = useTheme();
  const handlePress = useCallback(() => onPress(lead), [onPress, lead]);

  return (
    <Pressable accessibilityRole="button" accessibilityLabel={lead.title} onPress={handlePress}>
      <Card style={styles.card}>
        <View style={styles.body}>
          <Text variant="h5" numberOfLines={1}>
            {lead.title}
          </Text>
          <Text variant="caption" color="textSecondary" numberOfLines={1}>
            {lead.mode} · {lead.distanceKm}km · {lead.priceRange}
            {lead.extra ? ` · ${lead.extra}` : ''}
          </Text>
        </View>
        <ChevronIcon size={16} color={colors.textMuted} />
      </Card>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.s3,
  },
  body: {
    flex: 1,
    gap: Spacing.s1,
  },
});
