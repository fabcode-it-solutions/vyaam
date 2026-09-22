import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { FlatList, StyleSheet, View, type ListRenderItemInfo } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ConversationCard, type Conversation } from '@/components/chat';
import { BackButton, Input, SearchIcon, Text } from '@/components/ui';
import { Spacing, useTheme } from '@/theme';

/**
 * Chat/Conversations List — every message thread across trainers and
 * customers. Conversations below are illustrative; needs the real
 * conversations endpoint (Style A pagination) rather than a static list.
 */

const CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-1',
    name: 'Anjali Kaushik',
    lastMessage: 'Sounds good, see you Saturday at 6!',
    timeLabel: '2 min',
    unread: true,
  },
  {
    id: 'conv-2',
    name: 'Rohit Sharma',
    lastMessage: 'You: Can we move Thursday to 7:30?',
    timeLabel: '1 hr',
    unread: false,
  },
  {
    id: 'conv-3',
    name: 'Karan Mehta',
    lastMessage: 'Sent a bid on your request',
    timeLabel: 'Yesterday',
    unread: true,
  },
  {
    id: 'conv-4',
    name: 'Priya Menon',
    lastMessage: 'Thanks for the session today!',
    timeLabel: '2 days',
    unread: false,
  },
];

export default function ConversationsListScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { name } = useLocalSearchParams<{ name?: string }>();
  const [query, setQuery] = useState(name ?? '');

  const conversations = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return CONVERSATIONS;
    return CONVERSATIONS.filter(
      (c) => c.name.toLowerCase().includes(q) || c.lastMessage.toLowerCase().includes(q),
    );
  }, [query]);

  const handleConversationPress = useCallback(
    (conversation: Conversation) =>
      router.push({ pathname: '/chat/thread', params: { id: conversation.id, name: conversation.name } }),
    [],
  );

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<Conversation>) => <ConversationCard conversation={item} onPress={handleConversationPress} />,
    [handleConversationPress],
  );
  const keyExtractor = useCallback((item: Conversation) => item.id, []);

  return (
    <View style={[styles.screen, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      <View style={styles.header}>
        <BackButton onPress={() => router.back()} />
        <Text variant="h2">Messages</Text>
      </View>

      <View style={styles.searchWrap}>
        <Input
          hideLabel
          label="Search conversations"
          value={query}
          onChangeText={setQuery}
          placeholder="Search conversations..."
          leadingIcon={<SearchIcon size={20} color={colors.textMuted} />}
          returnKeyType="search"
        />
      </View>

      <FlatList
        data={conversations}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
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
    gap: Spacing.s3,
    paddingHorizontal: Spacing.s4,
    paddingTop: Spacing.s3,
    paddingBottom: Spacing.s4,
  },
  searchWrap: {
    paddingHorizontal: Spacing.s4,
    marginBottom: Spacing.s4,
  },
  listContent: {
    paddingHorizontal: Spacing.s4,
    paddingBottom: Spacing.s6,
    gap: Spacing.s3,
  },
});
