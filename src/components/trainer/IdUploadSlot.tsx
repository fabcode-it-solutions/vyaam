import { Image } from 'expo-image';
import { memo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { CameraIcon, CheckIcon, Text } from '@/components/ui';
import { Radius, Spacing, useTheme } from '@/theme';

export type IdUploadSlotProps = {
  label: string;
  captured: boolean;
  /** Local capture URI to preview — omit to fall back to a plain check mark. */
  imageUri?: string;
  onPress: () => void;
};

/**
 * One side of a two-sided document capture (Trainer/Verification "Upload
 * your ID") — dashed empty state with a camera prompt, a photo preview with a
 * verified badge once captured (tapping again retakes it).
 */
export const IdUploadSlot = memo(function IdUploadSlot({ label, captured, imageUri, onPress }: IdUploadSlotProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.wrapper}>
      <Text variant="caption" color="textMuted">
        {label}
      </Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={captured ? `${label}, retake photo` : `${label}, take a photo`}
        onPress={onPress}
        style={[
          styles.box,
          captured
            ? { backgroundColor: colors.surface, borderColor: colors.border }
            : { backgroundColor: colors.border, borderColor: colors.textMuted, borderStyle: 'dashed' },
        ]}>
        {imageUri ? (
          <>
            <Image source={{ uri: imageUri }} style={StyleSheet.absoluteFill} contentFit="cover" />
            <View style={[styles.checkBadge, { backgroundColor: colors.verifiedTint }]}>
              <CheckIcon size={14} color={colors.verified} />
            </View>
          </>
        ) : captured ? (
          <View style={[styles.checkCircle, { backgroundColor: colors.verifiedTint }]}>
            <CheckIcon size={20} color={colors.verified} />
          </View>
        ) : (
          <View style={styles.empty}>
            <CameraIcon size={28} color={colors.textMuted} />
            <Text variant="caption" color="textMuted">
              Tap to take a photo
            </Text>
          </View>
        )}
      </Pressable>
    </View>
  );
});

const styles = StyleSheet.create({
  wrapper: {
    gap: Spacing.s2,
  },
  box: {
    height: 168,
    borderRadius: Radius.card,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  checkCircle: {
    width: 48,
    height: 48,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkBadge: {
    position: 'absolute',
    top: Spacing.s2,
    right: Spacing.s2,
    width: 28,
    height: 28,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  empty: {
    alignItems: 'center',
    gap: Spacing.s2,
  },
});
