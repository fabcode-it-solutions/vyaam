import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, StyleSheet, View, type ListRenderItemInfo } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { MessageBubble, type ChatMessage } from '@/components/chat';
import { BackButton, IconButton, Input, LockIcon, PaperclipIcon, SendIcon, Text } from '@/components/ui';
import { Radius, Spacing, useTheme } from '@/theme';

/**
 * Chat/Thread — one conversation's message history, opened from the
 * conversations list. Messages below are illustrative, keyed off the `id`
 * route param; needs the real message-history endpoint (Style B cursor
 * pagination, per the API spec) rather than a static list, and sending
 * only appends locally — there's no send-message endpoint wired up yet.
 * The "hidden until you accept a bid" banner is illustrative copy; the
 * actual contact-masking redaction rules are an open item per CLAUDE.md,
 * so no message text is auto-redacted here.
 */

type ThreadInfo = {
  name: string;
  statusLabel: string;
  showContactBanner: boolean;
};

const THREADS: Record<string, ThreadInfo> = {
  'conv-1': { name: 'Anjali Kaushik', statusLabel: 'Bid pending — not yet accepted', showContactBanner: true },
  'conv-2': { name: 'Rohit Sharma', statusLabel: 'Active engagement', showContactBanner: false },
  'conv-3': { name: 'Karan Mehta', statusLabel: 'Bid pending — not yet accepted', showContactBanner: true },
  'conv-4': { name: 'Priya Menon', statusLabel: 'Session completed', showContactBanner: false },
};

const MESSAGES: Record<string, ChatMessage[]> = {
  'conv-1': [
    {
      id: 'm1',
      fromMe: false,
      time: '9:02 AM',
      text: 'Hi! Thanks for reaching out. I saw your request for upper body strength coaching.',
    },
    { id: 'm2', fromMe: true, time: '9:05 AM', text: 'Hi Anjali, yes! Would love to know more about your approach.' },
    {
      id: 'm3',
      fromMe: false,
      time: '9:07 AM',
      text: 'Of course — I usually start with a movement assessment, then build a plan around any pain points.',
    },
    { id: 'm4', fromMe: true, time: '9:12 AM', text: 'Sounds good, see you Saturday at 6!' },
  ],
  'conv-2': [
    { id: 'm1', fromMe: false, time: 'Yesterday', text: 'Can we move Thursday to 7:30?' },
    { id: 'm2', fromMe: true, time: 'Yesterday', text: 'Works for me — see you then.' },
  ],
  'conv-3': [{ id: 'm1', fromMe: false, time: 'Yesterday', text: 'Sent a bid on your request.' }],
  'conv-4': [{ id: 'm1', fromMe: false, time: '2 days ago', text: 'Thanks for the session today!' }],
};

export default function ChatThreadScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { id, name } = useLocalSearchParams<{ id?: string; name?: string }>();

  const thread = (id && THREADS[id]) || { name: name || 'Trainer', statusLabel: '', showContactBanner: false };
  const initialMessages = (id && MESSAGES[id]) || [];
  const [messages, setMessages] = useState(initialMessages);
  const [draft, setDraft] = useState('');

  const handleSend = useCallback(() => {
    const text = draft.trim();
    if (!text) return;
    setMessages((prev) => [
      ...prev,
      { id: `local-${prev.length}`, fromMe: true, time: 'Just now', text },
    ]);
    setDraft('');
  }, [draft]);

  const renderItem = useCallback(({ item }: ListRenderItemInfo<ChatMessage>) => <MessageBubble message={item} />, []);
  const keyExtractor = useCallback((item: ChatMessage) => item.id, []);

  return (
    <View style={[styles.screen, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      <View style={styles.header}>
        <BackButton onPress={() => router.back()} />
        <View style={[styles.avatar, { backgroundColor: colors.border }]} />
        <View style={styles.headerInfo}>
          <Text variant="h5" numberOfLines={1}>
            {thread.name}
          </Text>
          {thread.statusLabel ? (
            <Text variant="caption" color="textMuted" numberOfLines={1}>
              {thread.statusLabel}
            </Text>
          ) : null}
        </View>
      </View>

      {thread.showContactBanner && (
        <View style={[styles.banner, { backgroundColor: colors.accentTint }]}>
          <LockIcon size={16} color={colors.accentDeep} />
          <Text variant="caption" color="accentDeep" style={styles.bannerText}>
            Phone numbers and outside contact links are hidden until you accept a bid.
          </Text>
        </View>
      )}

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={insets.top}>
        <FlatList
          data={messages}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />

        <View style={[styles.composer, { paddingBottom: insets.bottom + Spacing.s3 }]}>
          <View style={styles.composerInput}>
            <Input
              hideLabel
              label="Message"
              value={draft}
              onChangeText={setDraft}
              placeholder={`Message ${thread.name.split(' ')[0]}...`}
              leadingIcon={<PaperclipIcon size={18} color={colors.textMuted} />}
              returnKeyType="send"
              onSubmitEditing={handleSend}
            />
          </View>
          <IconButton
            icon={<SendIcon size={18} color={colors.onBrand} />}
            accessibilityLabel="Send message"
            variant="solid"
            onPress={handleSend}
          />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.s3,
    paddingHorizontal: Spacing.s4,
    paddingTop: Spacing.s3,
    paddingBottom: Spacing.s3,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: Radius.full,
  },
  headerInfo: {
    flex: 1,
    gap: 2,
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.s2,
    marginHorizontal: Spacing.s4,
    marginBottom: Spacing.s3,
    padding: Spacing.s4,
    borderRadius: Radius.card,
  },
  bannerText: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: Spacing.s4,
    paddingBottom: Spacing.s4,
    gap: Spacing.s4,
  },
  composer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.s2,
    paddingHorizontal: Spacing.s4,
    paddingTop: Spacing.s2,
  },
  composerInput: {
    flex: 1,
  },
});
