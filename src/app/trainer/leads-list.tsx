import { router } from 'expo-router';
import { useCallback } from 'react';
import { FlatList, Pressable, StyleSheet, View, type ListRenderItemInfo } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { TrainerLeadCard, type TrainerLeadListing } from '@/components/trainer';
import { BackButton, ListIcon, MapIcon, Pill, Text } from '@/components/ui';
import { Radius, Spacing, useTheme } from '@/theme';

/**
 * Trainer/Leads — full leads list opened from Trainer Home's leads banner
 * or the Leads tab. Leads and the saved-search state below are
 * illustrative; needs the real leads endpoint (with lat/lng + saved-filter
 * support) rather than a static list. The map toggle opens leads-map, which
 * reuses MapBackdrop's static mock since no map SDK is installed yet.
 */
const LEADS: TrainerLeadListing[] = [
  {
    id: 'lead-1',
    title: 'Upper body strength coaching',
    mode: 'At home',
    distanceKm: 2.3,
    priceRange: '₹400–800',
    postedLabel: '2 days ago',
    bidsLabel: '5 bids so far',
  },
  {
    id: 'lead-2',
    title: 'Beginner yoga, back pain focus',
    mode: 'At home',
    distanceKm: 1.8,
    priceRange: '₹500–700',
    postedLabel: '5 hours ago',
    bidsLabel: 'No bids yet',
  },
  {
    id: 'lead-3',
    title: 'Weekend gym partner',
    mode: 'At a gym',
    distanceKm: 3.1,
    priceRange: '₹300–600',
    postedLabel: 'Today',
    bidsLabel: '2 bids so far',
  },
  {
    id: 'lead-4',
    title: '10K running preparation',
    mode: 'Outdoors',
    distanceKm: 4.0,
    priceRange: '₹600–900',
    postedLabel: '1 day ago',
    bidsLabel: '3 bids so far',
  },
];

export default function TrainerLeadsListScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const handleOpenMap = useCallback(() => router.push('/trainer/leads-map'), []);
  const handleSavedSearch = useCallback(() => router.push('/trainer/saved-search-settings'), []);
  const handleLeadPress = useCallback(
    (lead: TrainerLeadListing) => router.push({ pathname: '/trainer/request-detail', params: { id: lead.id } }),
    [],
  );

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<TrainerLeadListing>) => <TrainerLeadCard lead={item} onPress={handleLeadPress} />,
    [handleLeadPress],
  );
  const keyExtractor = useCallback((item: TrainerLeadListing) => item.id, []);

  const ListHeader = (
    <View style={styles.listHeader}>
      <Pill label="Saved search" selected leading={<ListIcon size={16} color={colors.onBrand} />} onPress={handleSavedSearch} />
      <Text variant="bodySecondary" color="textSecondary">
        {LEADS.length} leads within 5 km
      </Text>
    </View>
  );

  return (
    <View style={[styles.screen, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      <View style={styles.header}>
        <BackButton onPress={() => router.back()} />
        <Text variant="h2" style={styles.headerTitle}>
          Leads
        </Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="View leads on a map"
          onPress={handleOpenMap}
          style={[styles.mapButton, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <MapIcon size={18} color={colors.textPrimary} />
        </Pressable>
      </View>

      <FlatList
        data={LEADS}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListHeaderComponent={ListHeader}
        ItemSeparatorComponent={ItemSeparator}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

function ItemSeparator() {
  return <View style={{ height: Spacing.s3 }} />;
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
  headerTitle: {
    flex: 1,
  },
  mapButton: {
    width: 40,
    height: 40,
    borderRadius: Radius.sm,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: {
    paddingHorizontal: Spacing.s4,
    paddingBottom: Spacing.s6,
  },
  listHeader: {
    gap: Spacing.s3,
    paddingBottom: Spacing.s4,
  },
});
