import { memo } from 'react';
import { StyleSheet, View } from 'react-native';

import { MapPinIcon, Text } from '@/components/ui';
import { Radius, useTheme } from '@/theme';

export type MapExactPin = {
  id: string;
  /** Percentage-based position within the map area — there's no map SDK wired up yet, see MapBackdrop's doc comment. */
  top: `${number}%`;
  left: `${number}%`;
  /** Defaults to `colors.brand` — override e.g. for a saffron "lead" pin distinct from a trainer pin. */
  color?: string;
};

export type MapAreaCluster = {
  top: `${number}%`;
  left: `${number}%`;
  count: number;
};

export type MapBackdropProps = {
  exactPins: MapExactPin[];
  areaCenter: { top: `${number}%`; left: `${number}%` };
  cluster?: MapAreaCluster;
};

/**
 * Static decorative map mock — no map SDK is installed yet (no
 * `react-native-maps` or equivalent in package.json). This reproduces the
 * Figma frame's abstract building/road pattern so the Discover map screen
 * has something to render; swapping in a real tiled map is a follow-up that
 * needs a library choice flagged to the user first.
 */
export const MapBackdrop = memo(function MapBackdrop({ exactPins, areaCenter, cluster }: MapBackdropProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.base, { backgroundColor: colors.border }]}>
      <View style={[styles.building, { top: '6%', left: '10%', width: '30%', height: '16%', backgroundColor: colors.background }]} />
      <View style={[styles.building, { top: '6%', left: '58%', width: '22%', height: '10%', backgroundColor: colors.background }]} />
      <View style={[styles.building, { top: '30%', left: '62%', width: '26%', height: '14%', backgroundColor: colors.background }]} />
      <View style={[styles.building, { top: '55%', left: '8%', width: '24%', height: '14%', backgroundColor: colors.background }]} />
      <View style={[styles.building, { top: '58%', left: '55%', width: '20%', height: '12%', backgroundColor: colors.background }]} />
      <View style={[styles.building, { top: '76%', left: '18%', width: '22%', height: '12%', backgroundColor: colors.background }]} />

      <View style={[styles.roadV, { left: '46%', backgroundColor: colors.surface }]} />
      <View style={[styles.roadH, { top: '42%', backgroundColor: colors.surface }]} />

      <View
        pointerEvents="none"
        style={[
          styles.areaRing,
          {
            top: areaCenter.top,
            left: areaCenter.left,
            borderColor: colors.brand,
            backgroundColor: `${colors.brand}22`,
          },
        ]}
      />
      <View style={[styles.areaDot, { top: areaCenter.top, left: areaCenter.left, backgroundColor: colors.brand }]} />

      {exactPins.map((pin) => (
        <View key={pin.id} style={[styles.pin, { top: pin.top, left: pin.left }]}>
          <MapPinIcon size={30} color={pin.color ?? colors.brand} dotColor={colors.background} />
        </View>
      ))}

      {cluster && (
        <View
          style={[
            styles.cluster,
            { top: cluster.top, left: cluster.left, backgroundColor: colors.brand, borderRadius: Radius.full },
          ]}>
          <Text variant="h6" color="onBrand" style={styles.clusterLabel}>
            {cluster.count}
          </Text>
        </View>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  base: {
    flex: 1,
    overflow: 'hidden',
  },
  building: {
    position: 'absolute',
    borderRadius: 6,
  },
  roadV: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 10,
  },
  roadH: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 10,
  },
  areaRing: {
    position: 'absolute',
    width: 120,
    height: 120,
    marginTop: -60,
    marginLeft: -60,
    borderRadius: 60,
    borderWidth: 1,
  },
  areaDot: {
    position: 'absolute',
    width: 10,
    height: 10,
    marginTop: -5,
    marginLeft: -5,
    borderRadius: 5,
  },
  pin: {
    position: 'absolute',
    marginTop: -30,
    marginLeft: -15,
  },
  cluster: {
    position: 'absolute',
    minWidth: 28,
    height: 28,
    marginTop: -14,
    marginLeft: -14,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  clusterLabel: {
    textTransform: 'none',
    letterSpacing: 0,
  },
});
