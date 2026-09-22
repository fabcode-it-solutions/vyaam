import { router } from 'expo-router';
import { useCallback } from 'react';
import { FlatList, StyleSheet, View, type ListRenderItemInfo } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  DiscoverTrainer,
  MapBackdrop,
  MapTrainerCard,
  type MapExactPin,
} from '@/components/discover';
import { IconButton, Input, ListIcon, Pill, SearchIcon, SlidersIcon, Text } from '@/components/ui';
import { Radius, Spacing, useTheme } from '@/theme';

/**
 * Discover — map search. Pin placement, the results-in-area count, and the
 * bottom-sheet trainers below are illustrative; needs the real trainer-search
 * endpoint (with lat/lng bounds) and an actual map SDK — no map library is
 * installed yet (see MapBackdrop's doc comment), so the map itself is a
 * static mock reproducing the Figma frame's abstract layout.
 */

const TRAINERS_IN_AREA = 14;

const AREA_TRAINERS: DiscoverTrainer[] = [
  {
    id: 'trainer-1',
    name: 'Anjali Kaushik',
    verified: true,
    category: 'Yoga',
    mode: 'At home',
    distanceKm: 2.3,
    rating: 4.8,
    reviewCount: 63,
    pricePerSession: 600,
  },
  {
    id: 'trainer-4',
    name: 'Karan Mehta',
    verified: true,
    category: 'Gym trainer',
    mode: 'At a gym',
    distanceKm: 0.8,
    rating: 4.6,
    reviewCount: 29,
    pricePerSession: 500,
  },
  {
    id: 'trainer-2',
    name: 'Rohit Sharma',
    verified: true,
    category: 'Strength coach',
    mode: 'At home, Gym',
    distanceKm: 3.1,
    rating: 4.9,
    reviewCount: 108,
    pricePerSession: 800,
  },
];

const EXACT_PINS: MapExactPin[] = [
  { id: 'pin-1', top: '26%', left: '68%' },
  { id: 'pin-2', top: '58%', left: '18%' },
];

export default function DiscoverMapSearchScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const handleOpenFilters = useCallback(() => router.push('/discover/filter-sheet'), []);
  const handleTrainerPress = useCallback(
    (trainer: DiscoverTrainer) => router.push({ pathname: '/trainer/profile', params: { id: trainer.id } }),
    [],
  );

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<DiscoverTrainer>) => <MapTrainerCard trainer={item} onPress={handleTrainerPress} />,
    [handleTrainerPress],
  );
  const keyExtractor = useCallback((item: DiscoverTrainer) => item.id, []);

  return (
    <View style={[styles.screen, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      <View style={styles.searchRow}>
        <View style={styles.searchInput}>
          <Input
            hideLabel
            label="Search this area"
            placeholder="Search this area..."
            leadingIcon={<SearchIcon size={20} color={colors.textMuted} />}
            returnKeyType="search"
          />
        </View>
        <IconButton
          icon={<ListIcon size={20} color={colors.textPrimary} />}
          accessibilityLabel="Open filters"
          variant="surface"
          onPress={handleOpenFilters}
        />
      </View>

      <View style={styles.filtersRow}>
        <Pill label="Filters" leading={<SlidersIcon size={16} color={colors.textPrimary} />} onPress={handleOpenFilters} />
      </View>

      <View style={styles.legendRow}>
        <View style={[styles.legend, { backgroundColor: colors.surface, borderColor: colors.border, borderRadius: Radius.full }]}>
          <View style={styles.legendItem}>
            <View style={[styles.legendRing, { borderColor: colors.brand }]} />
            <Text variant="caption" color="textSecondary">
              At-home area
            </Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: colors.brand }]} />
            <Text variant="caption" color="textSecondary">
              Gym (exact)
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.mapArea}>
        <MapBackdrop
          exactPins={EXACT_PINS}
          areaCenter={{ top: '46%', left: '42%' }}
          cluster={{ top: '38%', left: '78%', count: 9 }}
        />

        <View
          style={[
            styles.sheet,
            { backgroundColor: colors.surface, borderRadius: Radius.card, paddingBottom: insets.bottom + Spacing.s4 },
          ]}>
          <View style={[styles.sheetHandle, { backgroundColor: colors.border }]} />
          <Text variant="h5" style={styles.sheetTitle}>
            {TRAINERS_IN_AREA} trainers in this area
          </Text>
          <FlatList
            data={AREA_TRAINERS}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            horizontal
            showsHorizontalScrollIndicator={false}
            ItemSeparatorComponent={CardSeparator}
            contentContainerStyle={styles.sheetListContent}
          />
        </View>
      </View>
    </View>
  );
}

function CardSeparator() {
  return <View style={{ width: Spacing.s3 }} />;
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.s3,
    paddingHorizontal: Spacing.s4,
    paddingTop: Spacing.s3,
    paddingBottom: Spacing.s3,
  },
  searchInput: {
    flex: 1,
  },
  filtersRow: {
    alignItems: 'flex-start',
    paddingHorizontal: Spacing.s4,
    paddingBottom: Spacing.s3,
  },
  legendRow: {
    alignItems: 'center',
    paddingBottom: Spacing.s3,
  },
  legend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.s4,
    borderWidth: 1,
    paddingHorizontal: Spacing.s4,
    paddingVertical: Spacing.s2,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.s2,
  },
  legendRing: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1.5,
    borderStyle: 'dashed',
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  mapArea: {
    flex: 1,
    position: 'relative',
  },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingTop: Spacing.s3,
  },
  sheetHandle: {
    alignSelf: 'center',
    width: 36,
    height: 4,
    borderRadius: Radius.full,
    marginBottom: Spacing.s3,
  },
  sheetTitle: {
    paddingHorizontal: Spacing.s6,
    marginBottom: Spacing.s3,
  },
  sheetListContent: {
    paddingHorizontal: Spacing.s6,
    paddingBottom: Spacing.s2,
  },
});
