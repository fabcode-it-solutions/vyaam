import { router } from 'expo-router';
import { useCallback } from 'react';
import { FlatList, StyleSheet, View, type ListRenderItemInfo } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { MapBackdrop, type MapExactPin } from '@/components/discover';
import { TrainerLeadRow, type TrainerLead } from '@/components/trainer';
import { ArrowIcon, IconButton, ListIcon, Text } from '@/components/ui';
import { Radius, Spacing, useTheme } from '@/theme';

/**
 * Trainer/Leads — map view, opened from the map toggle on leads-list. Pin
 * placement and the leads below are illustrative; needs the real leads
 * endpoint (with lat/lng) and an actual map SDK — no map library is
 * installed yet, so this reuses MapBackdrop's static building/road mock
 * (same as Discover's map-search) rather than a real tiled map.
 */
const LEADS: TrainerLead[] = [
  { id: 'lead-1', title: 'Upper body strength coaching', mode: 'At home', distanceKm: 2.3, priceRange: '₹400–800', extra: '5 bids so far' },
  { id: 'lead-3', title: 'Weekend gym partner', mode: 'At a gym', distanceKm: 3.1, priceRange: '₹300–600', extra: '2 bids so far' },
];

const PINS: MapExactPin[] = [
  { id: 'pin-1', top: '14%', left: '24%' },
  { id: 'pin-2', top: '14%', left: '68%' },
  { id: 'pin-3', top: '46%', left: '18%' },
  { id: 'pin-4', top: '48%', left: '62%' },
];

export default function TrainerLeadsMapScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const handleBack = useCallback(() => router.back(), []);
  const handleShowList = useCallback(() => router.replace('/trainer/leads-list'), []);
  const handleLeadPress = useCallback(
    (lead: TrainerLead) => router.push({ pathname: '/trainer/request-detail', params: { id: lead.id } }),
    [],
  );

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<TrainerLead>) => <TrainerLeadRow lead={item} onPress={handleLeadPress} />,
    [handleLeadPress],
  );
  const keyExtractor = useCallback((item: TrainerLead) => item.id, []);

  const pinsWithColor = PINS.map((pin) => ({ ...pin, color: colors.accent }));

  return (
    <View style={styles.screen}>
      <View style={styles.mapArea}>
        <MapBackdrop exactPins={pinsWithColor} areaCenter={{ top: '30%', left: '48%' }} />

        <View style={[styles.topRow, { paddingTop: insets.top + Spacing.s3 }]}>
          <IconButton
            accessibilityLabel="Go back"
            icon={<ArrowIcon direction="left" size={18} color={colors.textPrimary} />}
            variant="surface"
            onPress={handleBack}
          />
          <IconButton
            accessibilityLabel="Show leads as a list"
            icon={<ListIcon size={20} color={colors.textPrimary} />}
            variant="surface"
            onPress={handleShowList}
          />
        </View>

        <View
          style={[
            styles.sheet,
            { backgroundColor: colors.surface, borderRadius: Radius.card, paddingBottom: insets.bottom + Spacing.s4 },
          ]}>
          <View style={[styles.sheetHandle, { backgroundColor: colors.border }]} />
          <Text variant="bodySecondary" color="textSecondary" style={styles.sheetTitle}>
            {LEADS.length} leads in this area
          </Text>
          <FlatList
            data={LEADS}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            ItemSeparatorComponent={ItemSeparator}
            contentContainerStyle={styles.sheetListContent}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </View>
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
  mapArea: {
    flex: 1,
    position: 'relative',
  },
  topRow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.s4,
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
    paddingHorizontal: Spacing.s4,
    marginBottom: Spacing.s3,
  },
  sheetListContent: {
    paddingHorizontal: Spacing.s4,
  },
});
