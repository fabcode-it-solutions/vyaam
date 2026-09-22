import { memo, useCallback } from 'react';
import { StyleSheet, View } from 'react-native';

import { Badge, Button, CheckIcon, StarIcon, Text } from '@/components/ui';
import { Radius, Spacing, tabularNums, useTheme } from '@/theme';

export type ConnectedTrainer = {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  photoUri?: string | null;
  /** Already shared this plan with them. */
  shared: boolean;
};

export type TrainerShareRowProps = {
  trainer: ConnectedTrainer;
  onShare: (trainer: ConnectedTrainer) => void;
  /** This row's share request is in flight — shows a spinner and blocks other rows from being pressed. */
  sharing?: boolean;
  /** A different row's share request is in flight. */
  disabled?: boolean;
};

/**
 * One connected trainer on Share With Trainer (Figma node 75:37). Photo slot
 * is a plain rounded thumbnail, not `Avatar` — the Brand Guide keeps Avatar
 * strictly circular, and this frame is a distinct rounded-square treatment.
 */
export const TrainerShareRow = memo(function TrainerShareRow({
  trainer,
  onShare,
  sharing = false,
  disabled = false,
}: TrainerShareRowProps) {
  const { colors } = useTheme();
  const handleShare = useCallback(() => onShare(trainer), [onShare, trainer]);

  return (
    <View style={[styles.row, { backgroundColor: colors.surface, borderRadius: Radius.media }]}>
      <View style={[styles.thumbnail, { backgroundColor: colors.border }]} />

      <View style={styles.body}>
        <Text variant="h5" numberOfLines={1}>
          {trainer.name}
        </Text>
        <View style={styles.ratingRow}>
          <StarIcon color={colors.accentDeep} />
          <Text variant="caption" color="textSecondary" style={tabularNums}>
            {trainer.specialty} · {trainer.rating.toFixed(1)}
          </Text>
        </View>
      </View>

      {trainer.shared ? (
        <Badge label="Shared" variant="verified" leading={<CheckIcon size={11} color={colors.verified} />} />
      ) : (
        <Button
          label="Share"
          variant="secondary"
          size="small"
          loading={sharing}
          disabled={disabled}
          onPress={handleShare}
        />
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  row: {
    height: 76,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.s3,
    gap: Spacing.s3,
  },
  thumbnail: {
    width: 52,
    height: 52,
    borderRadius: Radius.sm,
  },
  body: {
    flex: 1,
    gap: 2,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
});
