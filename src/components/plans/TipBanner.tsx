import { memo, type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui';
import { Radius, Spacing, useTheme } from '@/theme';

export type TipBannerProps = {
  icon: ReactNode;
  children: string;
};

/** Safety-tip banner, e.g. below "How to do it" on Exercise Detail (Figma node 154:519). */
export const TipBanner = memo(function TipBanner({ icon, children }: TipBannerProps) {
  const { colors } = useTheme();
  return (
    <View style={[styles.banner, { backgroundColor: colors.warningTint, borderRadius: Radius.card }]}>
      <View style={styles.icon}>{icon}</View>
      <Text variant="caption" color="onWarningTint" style={styles.text}>
        {children}
      </Text>
    </View>
  );
});

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    padding: Spacing.s4,
    gap: Spacing.s2,
  },
  icon: {
    marginTop: 1,
  },
  text: {
    flex: 1,
  },
});
