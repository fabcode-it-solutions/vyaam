import { memo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { BodySilhouetteIcon, Text } from '@/components/ui';
import { useTheme } from '@/theme';

export type BodyPoint = {
  id: string;
  label: string;
  /** Position as a fraction (0–1) of the silhouette's width/height. */
  x: number;
  y: number;
};

export const BODY_POINTS: BodyPoint[] = [
  { id: 'neck', label: 'Neck', x: 82 / 180, y: 55 / 360 },
  { id: 'shoulder', label: 'Shoulder', x: 124 / 180, y: 84 / 360 },
  { id: 'elbow', label: 'Elbow', x: 142 / 180, y: 130 / 360 },
  { id: 'wrist', label: 'Wrist', x: 150 / 180, y: 170 / 360 },
  { id: 'lower_back', label: 'Lower back', x: 79 / 180, y: 147 / 360 },
  { id: 'hip', label: 'Hip', x: 82 / 180, y: 180 / 360 },
  { id: 'knee', label: 'Knee', x: 95 / 180, y: 247 / 360 },
  { id: 'ankle', label: 'Ankle', x: 100 / 180, y: 344 / 360 },
  { id: 'foot', label: 'Foot', x: 100 / 180, y: 367 / 360 },
];

const MAP_WIDTH = 180;
const MAP_HEIGHT = 360;

export type PainBodyMapProps = {
  selectedIds: Set<string>;
  onTogglePoint: (point: BodyPoint) => void;
};

/** Tappable front-view body map for the pain/injury intake (Figma node 113:355). */
export const PainBodyMap = memo(function PainBodyMap({ selectedIds, onTogglePoint }: PainBodyMapProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.map}>
        <BodySilhouetteIcon width={MAP_WIDTH} height={MAP_HEIGHT} color={colors.border} />
        {BODY_POINTS.map((point) => {
          const selected = selectedIds.has(point.id);
          const size = selected ? 22 : 16;
          return (
            <Pressable
              key={point.id}
              accessibilityRole="button"
              accessibilityLabel={point.label}
              accessibilityState={{ selected }}
              hitSlop={10}
              onPress={() => onTogglePoint(point)}
              style={[
                styles.point,
                {
                  left: point.x * MAP_WIDTH - size / 2,
                  top: point.y * MAP_HEIGHT - size / 2,
                  width: size,
                  height: size,
                  borderRadius: size / 2,
                  backgroundColor: selected ? colors.accentDeep : colors.surface,
                  borderColor: selected ? colors.background : colors.textMuted,
                  borderWidth: selected ? 3 : 1.5,
                },
              ]}
            />
          );
        })}
      </View>
      <Text variant="caption" color="textSecondary" style={styles.hint}>
        Tap a point on the body, or select “None” below.
      </Text>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  map: {
    width: MAP_WIDTH,
    height: MAP_HEIGHT,
  },
  point: {
    position: 'absolute',
  },
  hint: {
    textAlign: 'center',
    marginTop: 12,
    maxWidth: 300,
  },
});
