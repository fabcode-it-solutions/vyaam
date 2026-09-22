import { memo, useCallback } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Card, ChevronIcon, Text } from '@/components/ui';
import { Radius, Spacing, useTheme } from '@/theme';

export type TrainerClient = {
  id: string;
  name: string;
  subtitle: string;
  /** e.g. "Next: Mon 6 AM" — a second detail line shown below subtitle. */
  nextLabel?: string;
  /** false for a completed/past client — no chevron, row is display-only. */
  active?: boolean;
};

export type TrainerClientRowProps = {
  client: TrainerClient;
  onPress: (client: TrainerClient) => void;
};

/** One row on Trainer/Clients — active clients are pressable with a chevron, past ones are display-only. */
export const TrainerClientRow = memo(function TrainerClientRow({ client, onPress }: TrainerClientRowProps) {
  const { colors } = useTheme();
  const isActive = client.active ?? true;
  const handlePress = useCallback(() => onPress(client), [onPress, client]);

  const content = (
    <Card style={styles.card}>
      <View style={[styles.avatar, { backgroundColor: colors.border }]} />
      <View style={styles.body}>
        <Text variant="h5" numberOfLines={1}>
          {client.name}
        </Text>
        <Text variant="caption" color="textMuted">
          {client.subtitle}
        </Text>
        {client.nextLabel && (
          <Text variant="caption" color="textMuted">
            {client.nextLabel}
          </Text>
        )}
      </View>
      {isActive && <ChevronIcon size={16} color={colors.textMuted} />}
    </Card>
  );

  if (!isActive) {
    return content;
  }

  return (
    <Pressable accessibilityRole="button" accessibilityLabel={client.name} onPress={handlePress}>
      {content}
    </Pressable>
  );
});

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.s3,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: Radius.full,
  },
  body: {
    flex: 1,
    gap: 2,
  },
});
