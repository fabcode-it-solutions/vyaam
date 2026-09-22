import { Image } from 'expo-image';
import { memo, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { useTheme, type Theme } from '@/theme';

import { Text } from './Text';

export type AvatarSize = 'hero' | 'profile' | 'list' | 'inline';

const SIZE: Record<AvatarSize, number> = { hero: 84, profile: 56, list: 38, inline: 28 };

export type AvatarProps = {
  size?: AvatarSize;
  uri?: string | null;
  /** Full name (or a ready-made 1-2 letter code) shown as initials when there is no photo, e.g. "Rijul Minhas" or "AK". */
  initials: string;
  /** Any stable per-user value (user id, phone) — hashed to pick a deterministic tint. */
  seed: string;
};

/** First letter of the first and last word, e.g. "Rijul Minhas" -> "RM". Single-word names fall back to their first two letters. */
function initialsFrom(value: string) {
  const parts = value.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  const raw = parts.length === 1 ? parts[0].slice(0, 2) : parts[0][0] + parts[parts.length - 1][0];
  return raw.toUpperCase();
}

function tintFor(theme: Theme, seed: string) {
  const { colors } = theme;
  const tints = [
    { backgroundColor: colors.accentTint, color: colors.accentDeep },
    { backgroundColor: colors.verifiedTint, color: colors.verified },
    { backgroundColor: colors.infoTint, color: colors.info },
    { backgroundColor: colors.warningTint, color: colors.onWarningTint },
  ];
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return tints[hash % tints.length];
}

/**
 * Always circular (Brand Guide section 08 Imagery, Avatars). Photo when
 * available, otherwise initials on a tint cycled deterministically from the
 * user id across four tints, so the same person always renders the same
 * colour.
 */
export const Avatar = memo(function Avatar({ size = 'list', uri, initials, seed }: AvatarProps) {
  const theme = useTheme();
  const dimension = SIZE[size];
  const tint = useMemo(() => tintFor(theme, seed), [theme, seed]);

  if (uri) {
    return (
      <Image
        source={{ uri }}
        style={[styles.base, { width: dimension, height: dimension, borderRadius: dimension / 2 }]}
        accessibilityIgnoresInvertColors
      />
    );
  }

  return (
    <View
      style={[
        styles.base,
        styles.fallback,
        {
          width: dimension,
          height: dimension,
          borderRadius: dimension / 2,
          backgroundColor: tint.backgroundColor,
        },
      ]}>
      <Text
        variant={size === 'hero' ? 'h2' : size === 'profile' ? 'h3' : size === 'list' ? 'h5' : 'caption'}
        style={{ color: tint.color }}>
        {initialsFrom(initials)}
      </Text>
    </View>
  );
});

const styles = StyleSheet.create({
  base: {
    overflow: 'hidden',
  },
  fallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
