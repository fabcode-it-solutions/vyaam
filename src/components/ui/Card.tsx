import { memo } from 'react';
import { StyleSheet, View, type StyleProp, type ViewProps, type ViewStyle } from 'react-native';

import { Radius, Spacing, useTheme } from '@/theme';

export type CardProps = ViewProps & {
  style?: StyleProp<ViewStyle>;
  /** Set false for cards that manage their own padding (e.g. edge-to-edge post media). */
  padded?: boolean;
};

/**
 * The base white rounded container almost every screen's content sits in
 * (Brand Guide section 09 / 10 Tokens: `r-card` 20px, hairline `#E3DFD4`
 * border, no shadow — the brand is intentionally flat).
 */
export const Card = memo(function Card({ style, padded = true, children, ...rest }: CardProps) {
  const { colors } = useTheme();
  return (
    <View
      style={[
        styles.base,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          borderRadius: Radius.card,
        },
        padded && styles.padded,
        style,
      ]}
      {...rest}>
      {children}
    </View>
  );
});

const styles = StyleSheet.create({
  base: {
    borderWidth: 1,
  },
  padded: {
    padding: Spacing.s5,
  },
});
