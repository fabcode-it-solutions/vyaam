import { memo, useCallback, useMemo, useRef, useState } from 'react';
import { PanResponder, StyleSheet, View, type LayoutChangeEvent } from 'react-native';

import { useTheme } from '@/theme';

export type SliderProps = {
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (value: number) => void;
  accessibilityLabel: string;
};

const THUMB_SIZE = 24;
const TRACK_HEIGHT = 4;

function clamp(n: number, lo: number, hi: number) {
  return Math.min(hi, Math.max(lo, n));
}

/** Single-thumb value slider — e.g. Trainer/Profile setup's service-area radius. */
export const Slider = memo(function Slider({ min, max, step = 1, value, onChange, accessibilityLabel }: SliderProps) {
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

  const responder = useMemo(() => {
    let startPx = 0;
    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        const { value: v, trackWidth: w } = latest.current;
        startPx = posFor(v, w);
      },
      onPanResponderMove: (_evt, gesture) => {
        const { trackWidth: w, onChange: emit, value: v } = latest.current;
        if (w <= 0) return;
        const nextPx = clamp(startPx + gesture.dx, 0, w);
        const nextValue = valueFor(nextPx, w);
        if (nextValue !== v) emit(nextValue);
      },
    });
  }, [posFor, valueFor]);

  const thumbPx = posFor(value, trackWidth);

  return (
    <View style={styles.wrap} onLayout={handleLayout}>
      <View style={[styles.track, { backgroundColor: colors.border }]} />
      <View style={[styles.fill, { backgroundColor: colors.brand, width: Math.max(0, thumbPx) }]} />
      <View
        {...responder.panHandlers}
        accessibilityRole="adjustable"
        accessibilityLabel={accessibilityLabel}
        style={[styles.thumb, { left: thumbPx - THUMB_SIZE / 2, borderColor: colors.brand, backgroundColor: colors.surface }]}
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
