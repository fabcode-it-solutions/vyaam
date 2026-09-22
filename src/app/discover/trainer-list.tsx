import { router } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { FlatList, ScrollView, StyleSheet, View, type ListRenderItemInfo } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { DiscoverTrainer, FilterChip, TrainerListCard, TRAINER_LIST_CARD_HEIGHT } from '@/components/discover';
import { BackButton, IconButton, Input, MapIcon, Pill, SearchIcon, SlidersIcon, Text } from '@/components/ui';
import { Spacing, useTheme } from '@/theme';

/**
 * Discover — trainer list. Results, count, and applied filters below are
 * illustrative; needs the real trainer-search endpoint (Style A pagination:
 * page/limit request, `{ data, pagination: { hasMore } }` response) rather
 * than a static list.
 */

const CITY = 'Hisar';
const TOTAL_NEARBY = 18;

const TRAINERS: DiscoverTrainer[] = [
  {
    id: 'trainer-1',
    name: 'Anjali Kaushik',
    verified: true,
    category: 'Yoga',
    mode: 'At home, Online',
    distanceKm: 2.3,
    rating: 4.8,
    reviewCount: 63,
    pricePerSession: 600,
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
  {
    id: 'trainer-3',
    name: 'Priya Menon',
    verified: true,
    category: 'Pilates',
    mode: 'At home',
    distanceKm: 1.6,
    rating: 4.7,
    reviewCount: 41,
    pricePerSession: 550,
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
    id: 'trainer-5',
    name: 'Fatima Sheikh',
    verified: true,
    category: 'Yoga',
    mode: 'Online',
    distanceKm: 1.2,
    rating: 4.9,
    reviewCount: 87,
    pricePerSession: 400,
  },
];

type ActiveFilter = { key: string; label: string };

const INITIAL_FILTERS: ActiveFilter[] = [
  { key: 'location', label: 'At home' },
  { key: 'rating', label: '4.5+' },
];

export default function DiscoverTrainerListScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<ActiveFilter[]>(INITIAL_FILTERS);

  const removeFilter = useCallback((key: string) => {
    setActiveFilters((current) => current.filter((filter) => filter.key !== key));
  }, []);

  const trainers = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return TRAINERS;
    return TRAINERS.filter(
      (trainer) => trainer.name.toLowerCase().includes(q) || trainer.category.toLowerCase().includes(q),
    );
  }, [query]);

  const handleTrainerPress = useCallback(
    (trainer: DiscoverTrainer) => router.push({ pathname: '/trainer/profile', params: { id: trainer.id } }),
    [],
  );
  const handleOpenFilters = useCallback(() => router.push('/discover/filter-sheet'), []);
  const handleOpenMap = useCallback(() => router.push('/discover/map-search'), []);

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<DiscoverTrainer>) => <TrainerListCard trainer={item} onPress={handleTrainerPress} />,
    [handleTrainerPress],
  );
  const keyExtractor = useCallback((item: DiscoverTrainer) => item.id, []);
  const getItemLayout = useCallback(
    (_data: ArrayLike<DiscoverTrainer> | null | undefined, index: number) => ({
      length: TRAINER_LIST_CARD_HEIGHT,
      offset: (TRAINER_LIST_CARD_HEIGHT + Spacing.s3) * index,
      index,
    }),
    [],
  );

  return (
    <View style={[styles.screen, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      <View style={styles.header}>
        <BackButton onPress={() => router.back()} />
        <Text variant="h3" style={styles.title}>
          Discover
        </Text>
        <IconButton
          icon={<MapIcon size={20} color={colors.textPrimary} />}
          accessibilityLabel="View results on map"
          variant="surface"
          onPress={handleOpenMap}
        />
      </View>

      <View style={styles.searchRow}>
        <Input
          hideLabel
          label="Search"
          value={query}
          onChangeText={setQuery}
          placeholder="Search trainers, yoga, gym..."
          leadingIcon={<SearchIcon size={20} color={colors.textMuted} />}
          returnKeyType="search"
        />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtersRow}
        style={styles.filtersScroll}>
        <Pill label="Filters" leading={<SlidersIcon size={16} color={colors.textPrimary} />} onPress={handleOpenFilters} />
        {activeFilters.map((filter) => (
          <FilterChip key={filter.key} label={filter.label} onRemove={() => removeFilter(filter.key)} />
        ))}
      </ScrollView>

      <Text variant="bodySecondary" color="textSecondary" style={styles.countText}>
        {TOTAL_NEARBY} trainers near {CITY}
      </Text>

      <FlatList
        data={trainers}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        getItemLayout={getItemLayout}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.s4,
    paddingTop: Spacing.s3,
    paddingBottom: Spacing.s4,
  },
  title: {
    flex: 1,
    textAlign: 'center',
  },
  searchRow: {
    paddingHorizontal: Spacing.s4,
    paddingBottom: Spacing.s3,
  },
  filtersScroll: {
    flexGrow: 0,
  },
  filtersRow: {
    gap: Spacing.s2,
    paddingHorizontal: Spacing.s4,
    paddingBottom: Spacing.s3,
  },
  countText: {
    paddingHorizontal: Spacing.s4,
    paddingBottom: Spacing.s3,
  },
  listContent: {
    paddingHorizontal: Spacing.s4,
    paddingBottom: Spacing.s6,
    gap: Spacing.s3,
  },
});
