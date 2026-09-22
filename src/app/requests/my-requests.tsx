import { router } from 'expo-router';
import { useCallback } from 'react';
import { Alert, FlatList, StyleSheet, View, type ListRenderItemInfo } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { REQUEST_CARD_HEIGHT, RequestCard, type MyRequest } from '@/components/requests';
import { BackButton, IconButton, PlusIcon, Text } from '@/components/ui';
import { Spacing, useTheme } from '@/theme';

/**
 * My Requests — a customer's session-request history. Requests below are
 * illustrative; needs the real requests endpoint (Style A pagination)
 * rather than a static list.
 */

const REQUESTS: MyRequest[] = [
  {
    id: 'request-1',
    status: 'openForBids',
    mode: 'At home',
    title: 'Upper body strength coaching',
    detail: '5 bids received · Posted 2 days ago',
  },
  {
    id: 'request-2',
    status: 'accepted',
    mode: 'At home',
    title: 'Beginner yoga, back pain focus',
    detail: 'Anjali Kaushik · Next session Sat 6 AM',
  },
  {
    id: 'request-3',
    status: 'completed',
    mode: 'Outdoors',
    title: '10K running preparation',
    detail: 'Rohit Sharma · 8 sessions completed',
  },
  {
    id: 'request-4',
    status: 'expired',
    mode: 'At a gym',
    title: 'Weekend gym partner',
    detail: 'No bids accepted · Closed 5 days ago',
  },
];

function comingSoon(feature: string) {
  Alert.alert('Coming soon', `${feature} isn’t available yet.`);
}

export default function MyRequestsScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const handleNewRequest = useCallback(() => router.push('/requests/create-step-1'), []);
  const handleRequestPress = useCallback((request: MyRequest) => {
    if (request.status === 'openForBids') {
      router.push({ pathname: '/requests/request-detail', params: { id: request.id } });
      return;
    }
    if (request.status === 'expired') {
      router.push({ pathname: '/requests/request-expired', params: { id: request.id, title: request.title } });
      return;
    }
    if (request.status === 'accepted') {
      router.push({ pathname: '/requests/active-engagement', params: { id: request.id, title: request.title } });
      return;
    }
    comingSoon(request.title);
  }, []);

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<MyRequest>) => <RequestCard request={item} onPress={handleRequestPress} />,
    [handleRequestPress],
  );
  const keyExtractor = useCallback((item: MyRequest) => item.id, []);
  const getItemLayout = useCallback(
    (_data: ArrayLike<MyRequest> | null | undefined, index: number) => ({
      length: REQUEST_CARD_HEIGHT,
      offset: (REQUEST_CARD_HEIGHT + Spacing.s3) * index,
      index,
    }),
    [],
  );

  return (
    <View style={[styles.screen, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      <View style={styles.header}>
        <BackButton onPress={() => router.back()} />
        <Text variant="h2" style={styles.title}>
          My requests
        </Text>
        <IconButton
          icon={<PlusIcon size={18} color={colors.onBrand} />}
          accessibilityLabel="Post a new request"
          variant="solid"
          onPress={handleNewRequest}
        />
      </View>

      <FlatList
        data={REQUESTS}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        getItemLayout={getItemLayout}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
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
  listContent: {
    paddingHorizontal: Spacing.s4,
    paddingBottom: Spacing.s6,
    gap: Spacing.s3,
  },
});
