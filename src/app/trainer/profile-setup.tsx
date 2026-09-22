import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { Screen } from '@/components/Screen';
import { MapBackdrop } from '@/components/discover';
import { Avatar, BackButton, Button, CameraIcon, Input, Pill, Slider, Text } from '@/components/ui';
import { Radius, Spacing, useTheme } from '@/theme';

/**
 * Trainer/Profile setup — specialities, pricing, availability, and service
 * area for a trainer's public listing. No trainer-profile endpoint exists
 * yet (only the generic name/bio/gender fields on /me), so every field here
 * is local state and "Save and continue" just flags that persistence isn't
 * wired up. The map is the same static building/road mock MapBackdrop uses
 * on Discover — no map SDK is installed, so the radius ring is illustrative
 * and doesn't scale with the slider's km value.
 */

const SPECIALITY_OPTIONS = ['Beginner yoga', 'Back pain recovery', 'Prenatal-safe', 'Breathwork'];

const DAYS: { key: string; label: string }[] = [
  { key: 'mon', label: 'Mon' },
  { key: 'tue', label: 'Tue' },
  { key: 'wed', label: 'Wed' },
  { key: 'thu', label: 'Thu' },
  { key: 'fri', label: 'Fri' },
  { key: 'sat', label: 'Sat' },
  { key: 'sun', label: 'Sun' },
];

const DEFAULT_AVAILABLE_DAYS = ['mon', 'wed', 'fri', 'sat'];

function initialsFor(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  return parts.length === 1 ? parts[0].slice(0, 2) : parts[0][0] + parts[1][0];
}

export default function TrainerProfileSetupScreen() {
  const { colors } = useTheme();

  const [displayName, setDisplayName] = useState('Anjali Kaushik');
  const [bio, setBio] = useState(
    "I've been teaching yoga for 6 years, focused on beginners recovering from desk-job back pain.",
  );
  const [specialities, setSpecialities] = useState<string[]>(SPECIALITY_OPTIONS);
  const [pricePerSession, setPricePerSession] = useState('600');
  const [availableDays, setAvailableDays] = useState<string[]>(DEFAULT_AVAILABLE_DAYS);
  const [radiusKm, setRadiusKm] = useState(5);

  const toggleSpeciality = (option: string) => {
    setSpecialities((prev) => (prev.includes(option) ? prev.filter((o) => o !== option) : [...prev, option]));
  };

  const toggleDay = (key: string) => {
    setAvailableDays((prev) => (prev.includes(key) ? prev.filter((d) => d !== key) : [...prev, key]));
  };

  const handleChangePhoto = () => {
    Alert.alert('Coming soon', 'Changing your profile photo isn’t wired up yet.');
  };

  const handleSave = () => {
    Alert.alert('Coming soon', 'Saving your trainer profile isn’t wired up yet.');
  };

  return (
    <Screen padded={false}>
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <BackButton onPress={() => router.back()} />
          <Text variant="h2">Set up your profile</Text>
        </View>

        <View style={styles.avatarWrap}>
          <Avatar size="hero" initials={initialsFor(displayName)} seed="trainer-profile-setup" />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Change profile photo"
            onPress={handleChangePhoto}
            style={[styles.editBadge, { backgroundColor: colors.brand, borderColor: colors.background }]}>
            <CameraIcon size={13} color={colors.onBrand} />
          </Pressable>
        </View>

        <View style={styles.field}>
          <Input label="Display name" value={displayName} onChangeText={setDisplayName} placeholder="Your name" />
        </View>

        <View style={styles.field}>
          <Input
            label="Bio"
            value={bio}
            onChangeText={setBio}
            placeholder="Tell clients about your experience"
            multiline
          />
        </View>

        <View style={styles.field}>
          <Text variant="caption" color="textSecondary" style={styles.fieldLabel}>
            Specialities
          </Text>
          <View style={styles.pillRow}>
            {SPECIALITY_OPTIONS.map((option) => (
              <Pill
                key={option}
                label={option}
                selected={specialities.includes(option)}
                onPress={() => toggleSpeciality(option)}
              />
            ))}
          </View>
        </View>

        <View style={styles.field}>
          <Input
            label="Price per session (₹)"
            value={pricePerSession}
            onChangeText={setPricePerSession}
            placeholder="600"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.field}>
          <Text variant="caption" color="textSecondary" style={styles.fieldLabel}>
            Availability
          </Text>
          <View style={styles.pillRow}>
            {DAYS.map((day) => {
              const selected = availableDays.includes(day.key);
              return (
                <Pressable
                  key={day.key}
                  accessibilityRole="button"
                  accessibilityLabel={day.label}
                  accessibilityState={{ selected }}
                  onPress={() => toggleDay(day.key)}
                  style={[
                    styles.dayPill,
                    { backgroundColor: selected ? colors.accentTint : colors.surface, borderColor: colors.border },
                  ]}>
                  <Text variant="h5" color={selected ? 'accentDeep' : 'textSecondary'}>
                    {day.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.field}>
          <Text variant="caption" color="textSecondary" style={styles.fieldLabel}>
            Service area · {radiusKm} km radius
          </Text>
          <View style={[styles.mapBox, { borderColor: colors.border }]}>
            <MapBackdrop exactPins={[]} areaCenter={{ top: '50%', left: '50%' }} />
          </View>
          <View style={styles.slider}>
            <Slider
              min={1}
              max={20}
              value={radiusKm}
              onChange={setRadiusKm}
              accessibilityLabel="Service area radius in kilometres"
            />
          </View>
        </View>

        <Button label="Save and continue" size="large" fullWidth onPress={handleSave} style={styles.saveButton} />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: Spacing.s4,
    paddingBottom: Spacing.s8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.s3,
    paddingTop: Spacing.s3,
    paddingBottom: Spacing.s6,
  },
  avatarWrap: {
    position: 'relative',
    alignSelf: 'center',
    marginBottom: Spacing.s6,
  },
  editBadge: {
    position: 'absolute',
    right: -2,
    bottom: -2,
    width: 28,
    height: 28,
    borderRadius: Radius.full,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  field: {
    marginBottom: Spacing.s5,
  },
  fieldLabel: {
    marginBottom: Spacing.s2,
  },
  pillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.s2,
  },
  dayPill: {
    width: 38,
    height: 38,
    borderRadius: Radius.full,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapBox: {
    height: 160,
    borderRadius: Radius.card,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: Spacing.s4,
  },
  slider: {
    marginHorizontal: Spacing.s1,
  },
  saveButton: {
    marginTop: Spacing.s3,
  },
});
