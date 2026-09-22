import { router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, StyleSheet, View } from 'react-native';

import { Screen } from '@/components/Screen';
import { Avatar, BackButton, BanIcon, Button, Text } from '@/components/ui';
import { listBlockedUsers, unblockUser, type BlockedUser } from '@/lib/api/endpoints/me';
import { Radius, Spacing, useTheme } from '@/theme';

/**
 * Blocked users — Figma "Profile/Privacy/Blocked users" screen. Backed by
 * the real GET /me/blocked-users (Style A pagination) and DELETE
 * /me/blocked-users/:userId. Not linked from Figma statics before this pass
 * since no screen existed in the app yet for it.
 */

const PAGE_LIMIT = 20;

export default function BlockedUsersScreen() {
  const { colors } = useTheme();
  const [entries, setEntries] = useState<BlockedUser[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [unblockingId, setUnblockingId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const result = await listBlockedUsers(1, PAGE_LIMIT);
        if (cancelled) return;
        setEntries(result.data);
        setPage(1);
        setHasMore(result.pagination.hasMore);
      } catch {
        if (!cancelled) Alert.alert('Something went wrong', 'Could not load your blocked users. Try again.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    try {
      const nextPage = page + 1;
      const result = await listBlockedUsers(nextPage, PAGE_LIMIT);
      setEntries((prev) => [...prev, ...result.data]);
      setPage(nextPage);
      setHasMore(result.pagination.hasMore);
    } catch {
      // silently keep what's already loaded — the user can pull to retry via back/forward
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, hasMore, page]);

  const handleUnblock = useCallback((entry: BlockedUser) => {
    Alert.alert('Unblock this person?', entry.fullName ? `Unblock ${entry.fullName}?` : undefined, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Unblock',
        style: 'destructive',
        onPress: async () => {
          setUnblockingId(entry.userId);
          try {
            await unblockUser(entry.userId);
            setEntries((prev) => prev.filter((e) => e.userId !== entry.userId));
          } catch {
            Alert.alert('Something went wrong', 'Could not unblock this person. Try again.');
          } finally {
            setUnblockingId(null);
          }
        },
      },
    ]);
  }, []);

  return (
    <Screen padded={false}>
      <View style={styles.header}>
        <BackButton onPress={() => router.back()} />
        <Text variant="h2">Blocked users</Text>
      </View>

      {loading ? (
        <ActivityIndicator color={colors.textMuted} style={styles.loading} />
      ) : (
        <FlatList
          data={entries}
          keyExtractor={(item) => item.userId}
          contentContainerStyle={styles.listContent}
          onEndReachedThreshold={0.4}
          onEndReached={loadMore}
          ListEmptyComponent={
            <View style={styles.emptyCard}>
              <View style={[styles.emptyIcon, { backgroundColor: colors.border }]}>
                <BanIcon size={20} color={colors.textMuted} />
              </View>
              <Text variant="caption" color="textMuted" style={styles.emptyText}>
                You haven’t blocked anyone.
              </Text>
            </View>
          }
          ListFooterComponent={loadingMore ? <ActivityIndicator color={colors.textMuted} /> : null}
          renderItem={({ item }) => (
            <View style={[styles.row, { borderBottomColor: colors.border }]}>
              <Avatar size="list" uri={item.avatarUrl} initials={item.fullName ?? '?'} seed={item.userId} />
              <Text variant="h5" numberOfLines={1} style={styles.rowLabel}>
                {item.fullName ?? 'Unknown user'}
              </Text>
              <Button
                label="Unblock"
                variant="ghost"
                size="small"
                loading={unblockingId === item.userId}
                onPress={() => handleUnblock(item)}
              />
            </View>
          )}
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.s3,
    paddingHorizontal: Spacing.s6,
    paddingTop: Spacing.s3,
    paddingBottom: Spacing.s5,
  },
  loading: {
    marginTop: Spacing.s8,
  },
  listContent: {
    paddingHorizontal: Spacing.s6,
    paddingBottom: Spacing.s8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.s3,
    paddingVertical: Spacing.s4,
    borderBottomWidth: 1,
  },
  rowLabel: {
    flex: 1,
  },
  emptyCard: {
    alignItems: 'center',
    gap: Spacing.s3,
    paddingVertical: Spacing.s8,
  },
  emptyIcon: {
    width: 44,
    height: 44,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    textAlign: 'center',
  },
});
