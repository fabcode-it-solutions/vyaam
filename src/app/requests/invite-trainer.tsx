import { router, useLocalSearchParams } from 'expo-router';
import { useCallback } from 'react';
import { FlatList, StyleSheet, View, type ListRenderItemInfo } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { InviteRequestCard, type InviteRequestOption } from '@/components/requests';
import { BackButton, Text } from '@/components/ui';
import { Spacing, useTheme } from '@/theme';

/**
 * Requests/Invite Trainer — pick which of the customer's open requests to
 * invite a trainer to, opened from Trainer Profile's "Invite to my request".
 * Open requests below are illustrative; needs the real requests endpoint
 * (filtered to `openForBids`). "Invite to this request" needs the real
 * invite-trainer endpoint — it currently just moves straight to Active
 * Engagement rather than actually sending an invite.
 */

const OPEN_REQUESTS: InviteRequestOption[] = [
  {
    id: 'request-1',
    title: 'Upper body strength coaching',
    mode: 'At home',
    detail: '5 bids so far · Posted 2 days ago',
  },
  {
    id: 'request-2',
    title: 'Weekend gym partner',
    mode: 'At a gym',
    detail: '2 bids so far · Posted today',
  },
];

export default function InviteTrainerScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { name } = useLocalSearchParams<{ id?: string; name?: string }>();
  const firstName = name?.split(' ')[0] ?? 'trainer';

  const handleInvite = useCallback(
    (request: InviteRequestOption) =>
      router.replace({ pathname: '/requests/active-engagement', params: { id: request.id, title: request.title } }),
    [],
  );

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<InviteRequestOption>) => <InviteRequestCard request={item} onInvite={handleInvite} />,
    [handleInvite],
  );
  const keyExtractor = useCallback((item: InviteRequestOption) => item.id, []);

  return (
    <View style={[styles.screen, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      <View style={styles.header}>
        <BackButton onPress={() => router.back()} />
        <Text variant="h2">Invite {firstName}</Text>
      </View>

      <Text variant="bodySecondary" color="textSecondary" style={styles.subtitle}>
        Choose which open request to invite {firstName} to.
      </Text>

      <FlatList
        data={OPEN_REQUESTS}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ItemSeparatorComponent={CardSeparator}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

function CardSeparator() {
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
  subtitle: {
    paddingHorizontal: Spacing.s4,
    marginBottom: Spacing.s5,
  },
  listContent: {
    paddingHorizontal: Spacing.s4,
    paddingBottom: Spacing.s6,
  },
});
