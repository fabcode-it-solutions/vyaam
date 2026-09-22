import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, StyleSheet, View, type ListRenderItemInfo } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { MessageBubble, type ChatMessage } from '@/components/chat';
import { BackButton, IconButton, Input, PaperclipIcon, SendIcon, Text } from '@/components/ui';
import { Radius, Spacing, useTheme } from '@/theme';

/**
 * Chat/Shared Plan — a conversation moment where the trainer shares an
 * updated workout plan inline as a rich card, opened from the conversations
 * list like any other thread. Messages below are illustrative, keyed off
 * the `id` route param; needs the real message-history endpoint (Style B
 * cursor pagination) rather than a static list, and sending only appends
 * locally — there's no send-message endpoint wired up yet.
 */

const TRAINER_NAME = 'Anjali Kaushik';

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'm1',
    fromMe: false,
    time: '10:14 AM',
    text: 'Made a few tweaks to your workout plan based on what you said about your knee — take a look!',
  },
  {
    id: 'm2',
    fromMe: false,
    time: '10:14 AM',
    plan: { title: 'Upper Body Plan v2', subtitle: 'Updated · Knee-safe substitutions' },
  },
  { id: 'm3', fromMe: true, time: '10:16 AM', text: 'This looks great, thank you!' },
];

export default function ChatSharedPlanScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { name } = useLocalSearchParams<{ id?: string; name?: string }>();
  const trainerName = name || TRAINER_NAME;

  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [draft, setDraft] = useState('');

  const handleSend = useCallback(() => {
    const text = draft.trim();
    if (!text) return;
    setMessages((prev) => [...prev, { id: `local-${prev.length}`, fromMe: true, time: 'Just now', text }]);
    setDraft('');
  }, [draft]);

  const handlePressPlan = useCallback(() => router.push('/plans/workout'), []);

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<ChatMessage>) => <MessageBubble message={item} onPressPlan={handlePressPlan} />,
    [handlePressPlan],
  );
  const keyExtractor = useCallback((item: ChatMessage) => item.id, []);

  return (
    <View style={[styles.screen, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      <View style={styles.header}>
        <BackButton onPress={() => router.back()} />
        <View style={[styles.avatar, { backgroundColor: colors.border }]} />
        <Text variant="h5" numberOfLines={1} style={styles.headerName}>
          {trainerName}
        </Text>
      </View>

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
              placeholder={`Message ${trainerName.split(' ')[0]}...`}
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
  headerName: {
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
