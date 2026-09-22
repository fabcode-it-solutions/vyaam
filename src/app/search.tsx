import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, View, type ListRenderItemInfo } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CategoryChips, type CategoryChip } from '@/components/home';
import { BackButton, Button, Card, ChevronIcon, Input, SearchIcon, StarIcon, Text, XIcon } from '@/components/ui';
import { Radius, Spacing, tabularNums, useTheme } from '@/theme';

/**
 * Search results — trainers + help articles, filtered by the "All / Trainers
 * / Articles" segment and the query text. Results below are illustrative;
 * needs the real search endpoint from the API spec, not client-side
 * filtering over a static list.
 */

type TrainerResult = {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  distanceKm: number;
  photoUri?: string | null;
};

type ArticleResult = {
  id: string;
  title: string;
};

type ResultFilter = 'all' | 'trainers' | 'articles';

const FILTERS: CategoryChip[] = [
  { key: 'all', label: 'All' },
  { key: 'trainers', label: 'Trainers' },
  { key: 'articles', label: 'Articles' },
];

const TRAINERS: TrainerResult[] = [
  { id: 'trainer-1', name: 'Anjali Kaushik', specialty: 'Yoga & Mobility Coach', rating: 4.8, distanceKm: 2.3 },
  { id: 'trainer-2', name: 'Fatima Sheikh', specialty: 'Yoga · Online', rating: 4.9, distanceKm: 1.2 },
];

const ARTICLES: ArticleResult[] = [
  { id: 'article-1', title: 'Yoga session etiquette and what to expect' },
  { id: 'article-2', title: 'How do trainer bids work for yoga classes?' },
];

type ListItem =
  | { kind: 'sectionHeader'; label: string }
  | { kind: 'trainer'; data: TrainerResult }
  | { kind: 'articles'; data: ArticleResult[] };

function matchesQuery(query: string, ...fields: string[]) {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return fields.some((field) => field.toLowerCase().includes(q));
}

function comingSoon(feature: string) {
  Alert.alert('Coming soon', `${feature} isn’t available yet.`);
}

export default function SearchScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ q?: string }>();
  const [query, setQuery] = useState(params.q ?? '');
  const [filter, setFilter] = useState<ResultFilter>('all');

  const trainerResults = useMemo(
    () =>
      filter === 'articles'
        ? []
        : TRAINERS.filter((t) => matchesQuery(query, t.name, t.specialty)),
    [filter, query],
  );

  const articleResults = useMemo(
    () => (filter === 'trainers' ? [] : ARTICLES.filter((a) => matchesQuery(query, a.title))),
    [filter, query],
  );

  const listItems = useMemo<ListItem[]>(() => {
    const items: ListItem[] = [];
    if (trainerResults.length > 0) {
      items.push({ kind: 'sectionHeader', label: 'Trainers' });
      for (const trainer of trainerResults) items.push({ kind: 'trainer', data: trainer });
    }
    if (articleResults.length > 0) {
      items.push({ kind: 'sectionHeader', label: 'Help articles' });
      items.push({ kind: 'articles', data: articleResults });
    }
    return items;
  }, [trainerResults, articleResults]);

  const handleTrainerPress = useCallback((trainer: TrainerResult) => comingSoon(trainer.name), []);
  const handleArticlePress = useCallback((article: ArticleResult) => comingSoon(article.title), []);
  const handleBrowseTrainers = useCallback(() => comingSoon('Discover'), []);

  const trimmedQuery = query.trim();
  const isEmpty = listItems.length === 0;

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<ListItem>) => {
      if (item.kind === 'sectionHeader') {
        return <SectionHeader label={item.label} />;
      }
      if (item.kind === 'trainer') {
        return <TrainerResultCard trainer={item.data} onPress={handleTrainerPress} />;
      }
      return <ArticlesCard articles={item.data} onPress={handleArticlePress} />;
    },
    [handleTrainerPress, handleArticlePress],
  );

  const keyExtractor = useCallback((item: ListItem, index: number) => {
    if (item.kind === 'sectionHeader') return `hdr-${item.label}`;
    if (item.kind === 'trainer') return item.data.id;
    return `articles-${index}`;
  }, []);

  return (
    <View style={[styles.screen, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      <View style={styles.header}>
        <BackButton onPress={() => router.back()} />
        <Input
          hideLabel
          label="Search"
          value={query}
          onChangeText={setQuery}
          placeholder="Search trainers, help articles..."
          leadingIcon={<SearchIcon size={20} color={colors.textMuted} />}
          autoFocus
          returnKeyType="search"
        />
      </View>

      <View style={styles.filtersRow}>
        <CategoryChips options={FILTERS} selectedKey={filter} onSelect={(key) => setFilter(key as ResultFilter)} />
      </View>

      <FlatList
        data={listItems}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={isEmpty ? styles.emptyContent : styles.listContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={<NoResults query={trimmedQuery} onBrowseTrainers={handleBrowseTrainers} />}
      />
    </View>
  );
}

function SectionHeader({ label }: { label: string }) {
  return (
    <View style={styles.sectionHeader}>
      <Text variant="h6" color="textMuted">
        {label}
      </Text>
    </View>
  );
}

function TrainerResultCard({
  trainer,
  onPress,
}: {
  trainer: TrainerResult;
  onPress: (trainer: TrainerResult) => void;
}) {
  const { colors } = useTheme();
  const handlePress = useCallback(() => onPress(trainer), [onPress, trainer]);

  return (
    <Pressable accessibilityRole="button" accessibilityLabel={trainer.name} onPress={handlePress}>
      <Card style={styles.trainerCard}>
        <View style={[styles.thumb, { backgroundColor: colors.border }]} />
        <View style={styles.trainerBody}>
          <Text variant="h5" numberOfLines={1}>
            {trainer.name}
          </Text>
          <Text variant="bodySecondary" color="textSecondary" numberOfLines={1}>
            {trainer.specialty}
          </Text>
          <View style={styles.ratingRow}>
            <StarIcon color={colors.accentDeep} />
            <Text variant="caption" color="textSecondary" style={tabularNums}>
              {trainer.rating.toFixed(1)} · {trainer.distanceKm} km
            </Text>
          </View>
        </View>
        <ChevronIcon size={16} color={colors.textMuted} />
      </Card>
    </Pressable>
  );
}

function NoResults({ query, onBrowseTrainers }: { query: string; onBrowseTrainers: () => void }) {
  const { colors } = useTheme();

  return (
    <View style={styles.empty}>
      <View style={[styles.emptyIconOuter, { backgroundColor: colors.border }]}>
        <SearchIcon size={28} color={colors.textMuted} />
        <View style={[styles.emptyIconBadge, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <XIcon size={12} color={colors.textMuted} />
        </View>
      </View>
      <Text variant="h4" style={styles.emptyTitle}>
        {query ? `No results for "${query}"` : 'No results found'}
      </Text>
      <Text variant="bodySecondary" color="textSecondary" style={styles.emptySubtitle}>
        Try a different search term, or browse trainers near you instead.
      </Text>
      <Button label="Browse trainers" variant="secondary" onPress={onBrowseTrainers} style={styles.emptyButton} />
    </View>
  );
}

function ArticlesCard({
  articles,
  onPress,
}: {
  articles: ArticleResult[];
  onPress: (article: ArticleResult) => void;
}) {
  const { colors } = useTheme();

  return (
    <Card padded={false} style={styles.articlesCard}>
      {articles.map((article, index) => (
        <Pressable
          key={article.id}
          accessibilityRole="button"
          accessibilityLabel={article.title}
          onPress={() => onPress(article)}
          style={[styles.articleRow, index > 0 && { borderTopWidth: 1, borderTopColor: colors.border }]}>
          <Text variant="h5" style={styles.articleTitle} numberOfLines={2}>
            {article.title}
          </Text>
          <ChevronIcon size={16} color={colors.textMuted} />
        </Pressable>
      ))}
    </Card>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.s3,
    paddingHorizontal: Spacing.s4,
    paddingTop: Spacing.s3,
    paddingBottom: Spacing.s4,
  },
  filtersRow: {
    paddingHorizontal: Spacing.s4,
    paddingBottom: Spacing.s3,
  },
  listContent: {
    paddingHorizontal: Spacing.s4,
    paddingBottom: Spacing.s6,
    gap: Spacing.s3,
  },
  sectionHeader: {
    marginTop: Spacing.s2,
    marginBottom: -Spacing.s1,
  },
  trainerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.s3,
  },
  thumb: {
    width: 48,
    height: 48,
    borderRadius: Radius.media,
  },
  trainerBody: {
    flex: 1,
    gap: 2,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 2,
  },
  articlesCard: {
    overflow: 'hidden',
  },
  articleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.s3,
    paddingHorizontal: Spacing.s4,
    paddingVertical: Spacing.s4,
  },
  articleTitle: {
    flex: 1,
  },
  emptyContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing.s4,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.s6,
  },
  emptyIconOuter: {
    width: 72,
    height: 72,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyIconBadge: {
    position: 'absolute',
    right: -2,
    bottom: -2,
    width: 24,
    height: 24,
    borderRadius: Radius.full,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    marginTop: Spacing.s5,
    textAlign: 'center',
  },
  emptySubtitle: {
    marginTop: Spacing.s2,
    textAlign: 'center',
  },
  emptyButton: {
    marginTop: Spacing.s6,
  },
});
