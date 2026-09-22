import { memo, useCallback } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Card, Text } from '@/components/ui';
import { Radius, Spacing, useTheme } from '@/theme';

export type Conversation = {
  id: string;
  name: string;
  lastMessage: string;
  timeLabel: string;
  unread: boolean;
};

export type ConversationCardProps = {
  conversation: Conversation;
  onPress: (conversation: Conversation) => void;
};

/** One row on the chat conversations list — avatar, name/time, and a last-message preview with an unread dot. */
export const ConversationCard = memo(function ConversationCard({ conversation, onPress }: ConversationCardProps) {
  const { colors } = useTheme();
  const handlePress = useCallback(() => onPress(conversation), [onPress, conversation]);

  return (
    <Pressable accessibilityRole="button" accessibilityLabel={`Conversation with ${conversation.name}`} onPress={handlePress}>
      <Card style={styles.card}>
        <View style={[styles.avatar, { backgroundColor: colors.border }]} />
        <View style={styles.body}>
          <View style={styles.topRow}>
            <Text variant="h5" numberOfLines={1} style={styles.name}>
              {conversation.name}
            </Text>
            <Text variant="caption" color="textMuted">
              {conversation.timeLabel}
            </Text>
          </View>
          <View style={styles.bottomRow}>
            <Text variant="bodySecondary" color="textSecondary" numberOfLines={1} style={styles.preview}>
              {conversation.lastMessage}
            </Text>
            {conversation.unread && <View style={[styles.unreadDot, { backgroundColor: colors.accentDeep }]} />}
          </View>
        </View>
      </Card>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.s3,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: Radius.full,
  },
  body: {
    flex: 1,
    gap: 4,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.s2,
  },
  name: {
    flex: 1,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.s2,
  },
  preview: {
    flex: 1,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
