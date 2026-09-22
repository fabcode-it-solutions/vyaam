import { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Rect } from 'react-native-svg';

import { Card, Text } from '@/components/ui';
import type { ProgressDay } from '@/lib/api/endpoints/progress';
import { Radius, Spacing, useTheme } from '@/theme';

export type WeeklyProgressChartProps = {
  loading: boolean;
  days: ProgressDay[];
  dietStreakDays: number;
  workoutStreakDays: number;
};

const CHART_HEIGHT = 88;
const BAR_WIDTH = 8;
const BAR_GAP = 4;
const COLUMN_WIDTH = BAR_WIDTH * 2 + BAR_GAP;
const REST_DAY_MARKER_HEIGHT = 6;
const WEEKDAY_INITIALS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function weekdayInitial(dateString: string): string {
  return WEEKDAY_INITIALS[new Date(`${dateString}T00:00:00Z`).getUTCDay()];
}

function streakLabel(count: number): string {
  return `${count} ${count === 1 ? 'day' : 'days'}`;
}

/**
 * Customer/Home weekly adherence chart — trailing days from
 * GET /plans/progress/summary, one pair of bars per day (diet adherence %,
 * workout completion %). Hand-rolled with react-native-svg rather than a
 * charting library: no new native dependency, and the flat/no-shadow brand
 * styling is easier to hit by drawing the bars directly.
 */
export const WeeklyProgressChart = memo(function WeeklyProgressChart({
  loading,
  days,
  dietStreakDays,
  workoutStreakDays,
}: WeeklyProgressChartProps) {
  const { colors } = useTheme();

  if (loading || days.length === 0) {
    return (
      <Card style={styles.card}>
        <Text variant="h4">This week</Text>
        <Text variant="caption" color="textSecondary">
          {loading
            ? 'Loading your weekly progress…'
            : 'Log a few meals and workouts to see your weekly progress here.'}
        </Text>
      </Card>
    );
  }

  return (
    <Card style={styles.card}>
      <View style={styles.headerRow}>
        <Text variant="h4">This week</Text>
        <View style={styles.legend}>
          <LegendDot color={colors.verified} label="Diet" />
          <LegendDot color={colors.info} label="Workout" />
          <LegendDot color={colors.border} label="Rest" />
        </View>
      </View>

      <View style={styles.columns}>
        {days.map((day) => {
          const dietHeight = day.dietAdherencePct !== null ? (day.dietAdherencePct / 100) * CHART_HEIGHT : 0;
          // A rest day is reported as 100% ("on track") so it doesn't break
          // the streak, but that's not the same as actually completing a
          // workout — draw it as a short neutral tick, not a full bar, so it
          // reads as "nothing scheduled" rather than "fully done".
          const workoutHeight = day.isRestDay
            ? REST_DAY_MARKER_HEIGHT
            : day.workoutCompletedPct !== null
              ? (day.workoutCompletedPct / 100) * CHART_HEIGHT
              : 0;
          const workoutFill = day.isRestDay
            ? colors.border
            : day.workoutCompletedPct !== null
              ? colors.info
              : colors.border;

          return (
            <View key={day.date} style={styles.column}>
              <Svg width={COLUMN_WIDTH} height={CHART_HEIGHT}>
                <Rect
                  x={0}
                  y={CHART_HEIGHT - dietHeight}
                  width={BAR_WIDTH}
                  height={Math.max(dietHeight, 2)}
                  rx={2}
                  fill={day.dietAdherencePct !== null ? colors.verified : colors.border}
                />
                <Rect
                  x={BAR_WIDTH + BAR_GAP}
                  y={CHART_HEIGHT - workoutHeight}
                  width={BAR_WIDTH}
                  height={Math.max(workoutHeight, 2)}
                  rx={2}
                  fill={workoutFill}
                />
              </Svg>
              <Text variant="caption" color="textMuted" style={styles.dayLabel}>
                {weekdayInitial(day.date)[0]}
              </Text>
            </View>
          );
        })}
      </View>

      <View style={styles.streakRow}>
        <Text variant="caption" color="textSecondary">
          Diet streak · {streakLabel(dietStreakDays)}
        </Text>
        <Text variant="caption" color="textSecondary">
          Workout streak · {streakLabel(workoutStreakDays)}
        </Text>
      </View>
    </Card>
  );
});

const LegendDot = memo(function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <View style={styles.legendItem}>
      <View style={[styles.legendDot, { backgroundColor: color }]} />
      <Text variant="caption" color="textMuted">
        {label}
      </Text>
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    gap: Spacing.s3,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  legend: {
    flexDirection: 'row',
    gap: Spacing.s3,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.s1,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: Radius.full,
  },
  columns: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  column: {
    alignItems: 'center',
    gap: Spacing.s1,
  },
  dayLabel: {
    textAlign: 'center',
  },
  streakRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
