import { memo, useCallback } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { ChevronIcon, CheckIcon, SparkleIcon, Text } from '@/components/ui';
import { Radius, Spacing, useTheme } from '@/theme';

export type SharedPlanAttachment = {
  title: string;
  subtitle: string;
};

export type ChatMessage = {
  id: string;
  time: string;
  fromMe: boolean;
  /** Plain-text message body. Omit when `plan` is set instead. */
  text?: string;
  /** Renders a shared-plan card in place of a text bubble, e.g. "Upper Body Plan v2". */
  plan?: SharedPlanAttachment;
};

export type MessageBubbleProps = {
  message: ChatMessage;
  onPressPlan?: (message: ChatMessage) => void;
};

/**
 * One chat message — a plain text bubble (mine: brand-ink fill, right;
 * theirs: surface, left), or a shared-plan card when `message.plan` is set.
 * Either way it's followed by a timestamp, plus a read tick for mine.
 */
export const MessageBubble = memo(function MessageBubble({ message, onPressPlan }: MessageBubbleProps) {
  const { colors } = useTheme();
  const handlePressPlan = useCallback(() => onPressPlan?.(message), [onPressPlan, message]);

  return (
    <View style={[styles.wrap, message.fromMe ? styles.wrapRight : styles.wrapLeft]}>
      {message.plan ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`View shared plan: ${message.plan.title}`}
          onPress={handlePressPlan}
          style={[styles.planCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.planHeader}>
            <View style={[styles.planIcon, { backgroundColor: colors.accentTint }]}>
              <SparkleIcon size={20} color={colors.accentDeep} />
            </View>
            <View style={styles.planText}>
              <Text variant="h5" numberOfLines={1}>
                {message.plan.title}
              </Text>
              <Text variant="caption" color="textSecondary" numberOfLines={1}>
                {message.plan.subtitle}
              </Text>
            </View>
          </View>
          <View style={styles.planFooter}>
            <Text variant="caption" color="accentDeep">
              View plan
            </Text>
            <ChevronIcon size={12} color={colors.accentDeep} />
          </View>
        </Pressable>
      ) : (
        <View
          style={[
            styles.bubble,
            message.fromMe
              ? { backgroundColor: colors.brand, borderBottomRightRadius: 4 }
              : { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderBottomLeftRadius: 4 },
          ]}>
          <Text variant="bodySecondary" color={message.fromMe ? 'onBrand' : 'textPrimary'}>
            {message.text}
          </Text>
        </View>
      )}
      <View style={[styles.meta, message.fromMe ? styles.wrapRight : styles.wrapLeft]}>
        <Text variant="caption" color="textMuted">
          {message.time}
        </Text>
        {message.fromMe && <CheckIcon size={10} color={colors.info} />}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  wrap: {
    maxWidth: '78%',
  },
  wrapLeft: {
    alignSelf: 'flex-start',
  },
  wrapRight: {
    alignSelf: 'flex-end',
  },
  bubble: {
    borderRadius: Radius.media,
    paddingHorizontal: Spacing.s4,
    paddingVertical: Spacing.s3,
  },
  planCard: {
    width: 260,
    borderWidth: 1,
    borderRadius: Radius.card,
    padding: Spacing.s4,
    gap: Spacing.s3,
  },
  planHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.s3,
  },
  planIcon: {
    width: 40,
    height: 40,
    borderRadius: Radius.media,
    alignItems: 'center',
    justifyContent: 'center',
  },
  planText: {
    flex: 1,
    gap: 2,
  },
  planFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
});
