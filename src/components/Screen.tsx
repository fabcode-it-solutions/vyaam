import { memo, type PropsWithChildren } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';

import { Spacing, useTheme } from '@/theme';

export type ScreenProps = PropsWithChildren<{
  style?: StyleProp<ViewStyle>;
  edges?: Edge[];
  /** Set false for screens that manage their own horizontal padding (e.g. edge-to-edge media). */
  padded?: boolean;
}>;

/** Sand background + 24px screen-edge padding + safe area, applied consistently across every screen. */
export const Screen = memo(function Screen({
  children,
  style,
  edges = ['top', 'bottom'],
  padded = true,
}: ScreenProps) {
  const { colors } = useTheme();
  return (
    <SafeAreaView
      edges={edges}
      style={[styles.base, { backgroundColor: colors.background }]}>
      <View style={[styles.content, padded && styles.padded, style]}>{children}</View>
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  base: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  padded: {
    paddingHorizontal: Spacing.s4,
  },
});
