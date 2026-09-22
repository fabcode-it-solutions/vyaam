import { memo } from 'react';
import { StyleSheet } from 'react-native';

import { Card } from '@/components/ui';

import { SettingsRow, type SettingsRowConfig } from './SettingsRow';

export type SettingsSectionCardProps = {
  rows: SettingsRowConfig[];
};

/** A rounded card containing one or more SettingsRows, with hairline dividers between them. */
export const SettingsSectionCard = memo(function SettingsSectionCard({ rows }: SettingsSectionCardProps) {
  return (
    <Card padded={false} style={styles.card}>
      {rows.map(({ key, ...row }, index) => (
        <SettingsRow key={key} {...row} isFirst={index === 0} />
      ))}
    </Card>
  );
});

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
  },
});
