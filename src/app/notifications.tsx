import { router } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View, type ListRenderItemInfo } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BackButton } from '@/components/ui/BackButton';
import { BellIcon } from '@/components/ui/BellIcon';
import { ChatBubbleIcon } from '@/components/ui/ChatBubbleIcon';
import { FlameIcon } from '@/components/ui/FlameIcon';
import { HeartIcon } from '@/components/ui/HeartIcon';
import { PercentIcon } from '@/components/ui/PercentIcon';
import { SparkleIcon } from '@/components/ui/SparkleIcon';
import { Text } from '@/components/ui/Text';
import { UsersIcon } from '@/components/ui/UsersIcon';
import { VideoCameraIcon } from '@/components/ui/VideoCameraIcon';
import { Radius, Spacing, useTheme } from '@/theme';

type NotificationIcon = 'trainers' | 'message' | 'plan' | 'session' | 'like' | 'discount' | 'streak';

type Notification = {
  id: string;
  icon: NotificationIcon;
  title: string;
  message: string;
  time: string;
  dateGroup: 'today' | 'yesterday' | 'earlier';
  read: boolean;
};

type ListItem =
  | { kind: 'header'; label: string; group: Notification['dateGroup'] }
  | { kind: 'notif'; data: Notification };

const NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    icon: 'trainers',
    title: '3 trainers responded to your request',
    message: 'Upper body strength session',
    time: '2 min ago',
    dateGroup: 'today',
    read: false,
  },
  {
    id: '2',
    icon: 'message',
    title: 'Anjali Kaushik sent you a message',
    message: 'Looking forward to our session tomorrow!',
    time: '15 min ago',
    dateGroup: 'today',
    read: false,
  },
  {
    id: '3',
    icon: 'plan',
    title: 'Your diet plan is ready',
    message: '1,850 kcal/day plan generated',
    time: '3 hours ago',
    dateGroup: 'today',
    read: true,
  },
  {
    id: '4',
    icon: 'session',
    title: 'Session with Rohit Sharma tomorrow at 6 AM',
    message: 'Don’t forget to bring water',
    time: '1 day ago',
    dateGroup: 'yesterday',
    read: true,
  },
  {
    id: '5',
    icon: 'like',
    title: 'Meera liked your progress post',
    message: 'Day 21 of 30 challenge',
    time: '1 day ago',
    dateGroup: 'yesterday',
    read: true,
  },
  {
    id: '6',
    icon: 'discount',
    title: 'New trainers near you are offering discounts',
    message: 'Check offers in Hisar',
    time: '1 day ago',
    dateGroup: 'yesterday',
    read: true,
  },
  {
    id: '7',
    icon: 'streak',
    title: 'You hit a 7-day streak!',
    message: 'Keep it going',
    time: '4 days ago',
    dateGroup: 'earlier',
    read: true,
  },
];

const DATE_GROUPS: { key: Notification['dateGroup']; label: string }[] = [
  { key: 'today', label: 'Today' },
  { key: 'yesterday', label: 'Yesterday' },
  { key: 'earlier', label: 'Earlier' },
];

const NOTIFICATION_ICONS: Record<NotificationIcon, typeof UsersIcon> = {
  trainers: UsersIcon,
  message: ChatBubbleIcon,
  plan: SparkleIcon,
  session: VideoCameraIcon,
  like: HeartIcon,
  discount: PercentIcon,
  streak: FlameIcon,
};

export default function NotificationsScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const [notifications, setNotifications] = useState(NOTIFICATIONS);

  const unreadCount = useMemo(() => notifications.filter((n) => !n.read).length, [notifications]);
  const isEmpty = notifications.length === 0;

  const listItems = useMemo<ListItem[]>(() => {
    const items: ListItem[] = [];
    for (const { key, label } of DATE_GROUPS) {
      const group = notifications.filter((n) => n.dateGroup === key);
      if (group.length === 0) continue;
      items.push({ kind: 'header', label, group: key });
      for (const n of group) items.push({ kind: 'notif', data: n });
    }
    return items;
  }, [notifications]);

  const handleMarkAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<ListItem>) => {
      if (item.kind === 'header') {
        return (
          <View style={styles.sectionHeader}>
            <Text variant="h6" color="textMuted">
              {item.label}
            </Text>
            {item.group === 'today' && unreadCount > 0 && (
              <TouchableOpacity onPress={handleMarkAllRead} hitSlop={8} activeOpacity={0.7}>
                <Text variant="caption" color="textSecondary" style={styles.markAllRead}>
                  Mark all read
                </Text>
              </TouchableOpacity>
            )}
          </View>
        );
      }
      return <NotificationCard notification={item.data} />;
    },
    [handleMarkAllRead, unreadCount],
  );

  const keyExtractor = useCallback(
    (item: ListItem) => (item.kind === 'header' ? `hdr-${item.label}` : item.data.id),
    [],
  );

  return (
    <View style={[styles.screen, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      <View style={styles.header}>
        <BackButton onPress={() => router.back()} />
        <Text variant="h2">Notifications</Text>
      </View>

      <FlatList
        data={listItems}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={isEmpty ? styles.emptyContent : styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<NoNotifications />}
      />
    </View>
  );
}

function NotificationCard({ notification: n }: { notification: Notification }) {
  const { colors } = useTheme();
  const Icon = NOTIFICATION_ICONS[n.icon];

  return (
    <TouchableOpacity activeOpacity={0.75} style={[styles.card, { backgroundColor: colors.surface }]}>
      <View style={styles.iconWrap}>
        <View style={[styles.iconCircle, { backgroundColor: colors.accentTint }]}>
          <Icon size={20} color={colors.accentDeep} />
        </View>
        {!n.read && (
          <View style={[styles.unreadDot, { backgroundColor: colors.accent, borderColor: colors.surface }]} />
        )}
      </View>
      <View style={styles.cardBody}>
        <Text variant="h5">{n.title}</Text>
        <Text variant="bodySecondary" color="textSecondary" numberOfLines={2}>
          {n.message} · {n.time}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

function NoNotifications() {
  const { colors } = useTheme();

  return (
    <View style={styles.empty}>
      <View style={[styles.emptyIconOuter, { backgroundColor: colors.surface }]}>
        <BellIcon size={28} color={colors.textMuted} crossedOut />
      </View>
      <Text variant="h4" style={styles.emptyTitle}>
        You&rsquo;re all caught up
      </Text>
      <Text variant="bodySecondary" color="textSecondary" style={styles.emptySubtitle}>
        New activity — bids, messages, and session reminders — will show up here.
      </Text>
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
    gap: Spacing.s3,
    paddingHorizontal: Spacing.s4,
    paddingTop: Spacing.s3,
    paddingBottom: Spacing.s4,
  },
  listContent: {
    paddingHorizontal: Spacing.s4,
    paddingBottom: Spacing.s6,
    gap: Spacing.s2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.s3,
    marginBottom: Spacing.s1,
  },
  markAllRead: {
    textDecorationLine: 'underline',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.s3,
    borderRadius: Radius.card,
    padding: Spacing.s4,
  },
  iconWrap: {
    position: 'relative',
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unreadDot: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 10,
    height: 10,
    borderRadius: Radius.full,
    borderWidth: 1.5,
  },
  cardBody: {
    flex: 1,
    gap: Spacing.s1,
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
  emptyTitle: {
    marginTop: Spacing.s5,
    textAlign: 'center',
  },
  emptySubtitle: {
    marginTop: Spacing.s2,
    textAlign: 'center',
  },
});
