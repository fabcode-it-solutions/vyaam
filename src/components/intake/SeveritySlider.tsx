import { memo, useCallback, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { useTheme } from '@/theme';

export type SeveritySliderProps = {
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
};

/** Draggable + tappable severity track (Figma node 113:389) — 0–10 by default. */
export const SeveritySlider = memo(function SeveritySlider({
  value,
  min = 0,
  max = 10,
  onChange,
}: SeveritySliderProps) {
  const { colors } = useTheme();
  const [trackWidth, setTrackWidth] = useState(0);
  const progress = useSharedValue((value - min) / (max - min));

  useEffect(() => {
    progress.value = withTiming((value - min) / (max - min), { duration: 120 });
  }, [value, min, max, progress]);

  const commit = useCallback(
    (p: number) => {
      const next = Math.round(min + p * (max - min));
      if (next !== value) onChange(next);
    },
    [min, max, value, onChange],
  );

  const clampToTrack = useCallback(
    (x: number) => {
      if (trackWidth <= 0) return progress.value;
      return Math.min(1, Math.max(0, x / trackWidth));
    },
    [trackWidth, progress],
  );

  const pan = Gesture.Pan().onChange((e) => {
    if (trackWidth <= 0) return;
    const next = Math.min(1, Math.max(0, progress.value + e.changeX / trackWidth));
    progress.value = next;
    runOnJS(commit)(next);
  });

  const tap = Gesture.Tap().onEnd((e) => {
    const next = clampToTrack(e.x);
    progress.value = next;
    runOnJS(commit)(next);
  });

  const fillStyle = useAnimatedStyle(() => ({ width: `${progress.value * 100}%` }));
  const thumbStyle = useAnimatedStyle(() => ({ left: `${progress.value * 100}%` }));

  return (
    <GestureDetector gesture={Gesture.Race(pan, tap)}>
      <View
        onLayout={(e) => setTrackWidth(e.nativeEvent.layout.width)}
        style={[styles.track, { backgroundColor: colors.border }]}>
        <Animated.View style={[styles.fill, fillStyle, { backgroundColor: colors.brand }]} />
        <Animated.View
          style={[styles.thumb, thumbStyle, { backgroundColor: colors.surface, borderColor: colors.brand }]}
        />
      </View>
    </GestureDetector>
  );
});

const styles = StyleSheet.create({
  track: {
    height: 6,
    borderRadius: 3,
    justifyContent: 'center',
  },
  fill: {
    height: 6,
    borderRadius: 3,
  },
  thumb: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    marginLeft: -10,
  },
});
