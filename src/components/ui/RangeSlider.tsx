import { memo, useCallback, useMemo, useRef, useState } from 'react';
import { PanResponder, StyleSheet, View, type LayoutChangeEvent } from 'react-native';

import { useTheme } from '@/theme';

export type RangeSliderProps = {
  min: number;
  max: number;
  step?: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
};

const THUMB_SIZE = 22;
const TRACK_HEIGHT = 4;

function clamp(n: number, lo: number, hi: number) {
  return Math.min(hi, Math.max(lo, n));
}

/** Dual-thumb price/value range slider — Discover filters, "Price range" row. */
export const RangeSlider = memo(function RangeSlider({ min, max, step = 1, value, onChange }: RangeSliderProps) {
  const { colors } = useTheme();
  const [trackWidth, setTrackWidth] = useState(0);

  const latest = useRef({ trackWidth, min, max, step, value, onChange });
  latest.current = { trackWidth, min, max, step, value, onChange };

  const handleLayout = useCallback((e: LayoutChangeEvent) => setTrackWidth(e.nativeEvent.layout.width), []);

  const posFor = useCallback((v: number, width: number) => (width <= 0 ? 0 : ((v - min) / (max - min)) * width), [min, max]);
  const valueFor = useCallback(
    (px: number, width: number) => {
      const ratio = clamp(width <= 0 ? 0 : px / width, 0, 1);
      const raw = min + ratio * (max - min);
      return clamp(Math.round(raw / step) * step, min, max);
    },
    [min, max, step],
  );

  const makeResponder = useCallback(
    (thumb: 'low' | 'high') => {
      let startPx = 0;
      return PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: () => {
          const { value: v, trackWidth: w } = latest.current;
          startPx = posFor(thumb === 'low' ? v[0] : v[1], w);
        },
        onPanResponderMove: (_evt, gesture) => {
          const { trackWidth: w, value: v, onChange: emit, step: s, min: lo, max: hi } = latest.current;
          if (w <= 0) return;
          const nextPx = clamp(startPx + gesture.dx, 0, w);
          const nextVal = valueFor(nextPx, w);
          if (thumb === 'low') {
            const nextLow = clamp(nextVal, lo, v[1] - s);
            if (nextLow !== v[0]) emit([nextLow, v[1]]);
          } else {
            const nextHigh = clamp(nextVal, v[0] + s, hi);
            if (nextHigh !== v[1]) emit([v[0], nextHigh]);
          }
        },
      });
    },
    [posFor, valueFor],
  );

  const lowResponder = useMemo(() => makeResponder('low'), [makeResponder]);
  const highResponder = useMemo(() => makeResponder('high'), [makeResponder]);

  const lowPx = posFor(value[0], trackWidth);
  const highPx = posFor(value[1], trackWidth);

  return (
    <View style={styles.wrap} onLayout={handleLayout}>
      <View style={[styles.track, { backgroundColor: colors.border }]} />
      <View style={[styles.fill, { backgroundColor: colors.brand, left: lowPx, width: Math.max(0, highPx - lowPx) }]} />
      <View
        {...lowResponder.panHandlers}
        accessibilityRole="adjustable"
        accessibilityLabel="Minimum price"
        style={[styles.thumb, { left: lowPx - THUMB_SIZE / 2, borderColor: colors.brand, backgroundColor: colors.surface }]}
      />
      <View
        {...highResponder.panHandlers}
        accessibilityRole="adjustable"
        accessibilityLabel="Maximum price"
        style={[styles.thumb, { left: highPx - THUMB_SIZE / 2, borderColor: colors.brand, backgroundColor: colors.surface }]}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  wrap: {
    height: THUMB_SIZE,
    justifyContent: 'center',
  },
  track: {
    height: TRACK_HEIGHT,
    borderRadius: TRACK_HEIGHT / 2,
  },
  fill: {
    position: 'absolute',
    height: TRACK_HEIGHT,
    borderRadius: TRACK_HEIGHT / 2,
  },
  thumb: {
    position: 'absolute',
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    borderWidth: 2,
  },
});
