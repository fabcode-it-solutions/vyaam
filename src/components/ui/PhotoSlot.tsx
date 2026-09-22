import { Image } from 'expo-image';
import { memo } from 'react';
import { StyleSheet, View } from 'react-native';

import { useTheme } from '@/theme';

import { UserIcon } from './UserIcon';

export type PhotoSlotProps = {
  /** Remote URL string or local `require(...)` result. Renders a placeholder icon until one is set. */
  uri?: string | number | null;
  iconSize?: number;
};

export const PhotoSlot = memo(function PhotoSlot({ uri, iconSize = 22 }: PhotoSlotProps) {
  const { colors } = useTheme();

  if (uri != null) {
    const source = typeof uri === 'string' ? { uri } : uri;
    return <Image source={source} style={styles.image} contentFit="cover" accessibilityIgnoresInvertColors />;
  }

  return (
    <View style={[styles.image, styles.placeholder, { backgroundColor: colors.border }]}>
      <UserIcon size={iconSize} color={colors.textMuted} />
    </View>
  );
});

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
