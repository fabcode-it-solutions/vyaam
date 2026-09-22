import { memo, useCallback } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Card, ChevronIcon, Text } from '@/components/ui';
import { Spacing, useTheme } from '@/theme';

export type TrainerLeadListing = {
  id: string;
  title: string;
  mode: string;
  distanceKm: number;
  priceRange: string;
  postedLabel: string;
  bidsLabel: string;
};

export type TrainerLeadCardProps = {
  lead: TrainerLeadListing;
  onPress: (lead: TrainerLeadListing) => void;
};

/** One row on Trainer/Leads — richer than TrainerLeadRow's Home-preview version (mode tag, posted time, bid status). */
export const TrainerLeadCard = memo(function TrainerLeadCard({ lead, onPress }: TrainerLeadCardProps) {
  const { colors } = useTheme();
  const handlePress = useCallback(() => onPress(lead), [onPress, lead]);

  return (
    <Pressable accessibilityRole="button" accessibilityLabel={lead.title} onPress={handlePress}>
      <Card style={styles.card}>
        <View style={styles.titleRow}>
          <Text variant="h5" numberOfLines={2} style={styles.title}>
            {lead.title}
          </Text>
          <Text variant="caption" color="textMuted" numberOfLines={1}>
            {lead.mode}
          </Text>
        </View>
        <Text variant="caption" color="textSecondary">
          {lead.distanceKm}km · {lead.priceRange} · {lead.postedLabel}
        </Text>
        <View style={styles.footerRow}>
          <Text variant="caption" color="textSecondary">
            {lead.bidsLabel}
          </Text>
          <ChevronIcon size={16} color={colors.textMuted} />
        </View>
      </Card>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  card: {
    gap: Spacing.s1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: Spacing.s3,
  },
  title: {
    flex: 1,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 2,
  },
});
