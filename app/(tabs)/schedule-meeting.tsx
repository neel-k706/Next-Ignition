import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { Picker } from '@/components/Picker';
import {
  BORDER_RADIUS,
  COLORS,
  FONT_FAMILY,
  FONT_SIZES,
  GRADIENTS,
  SHADOWS,
  SPACING,
  TYPOGRAPHY,
} from '@/constants/theme';
import {
  Calendar,
  Clock,
  Users,
  Video,
  MapPin,
  MessageSquare,
  CheckCircle,
} from 'lucide-react-native';

const DURATION_OPTIONS = ['30 minutes', '1 hour', '1.5 hours', '2 hours'];
const MEETING_TYPES = ['Video Call', 'Phone Call', 'In-Person', 'Hybrid'];

export default function ScheduleMeetingScreen() {
  const params = useLocalSearchParams();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [duration, setDuration] = useState(DURATION_OPTIONS[1]);
  const [meetingType, setMeetingType] = useState(MEETING_TYPES[0]);
  const [location, setLocation] = useState('');
  const [participants, setParticipants] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSchedule = async () => {
    if (!title || !date || !time) {
      Alert.alert('Required Fields', 'Please fill in title, date, and time');
      return;
    }

    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      Alert.alert('Success', 'Meeting scheduled successfully!', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    }, 1500);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <LinearGradient colors={GRADIENTS.primary} style={styles.heroCard}>
          <View style={styles.heroHeader}>
            <View style={styles.heroIcon}>
              <Calendar size={28} color={COLORS.background} strokeWidth={2} />
            </View>
            <View style={styles.heroText}>
              <Text style={styles.heroTitle}>Schedule Meeting</Text>
              <Text style={styles.heroSubtitle}>
                Set up a meeting with your connections
              </Text>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Meeting Details</Text>
          <Input
            label="Meeting Title"
            value={title}
            onChangeText={setTitle}
            placeholder="e.g., Funding Discussion, Product Review"
            icon={<Calendar size={20} color={COLORS.textSecondary} strokeWidth={2} />}
          />
          <Input
            label="Description"
            value={description}
            onChangeText={setDescription}
            placeholder="Brief description of the meeting agenda..."
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Date & Time</Text>
          <Input
            label="Date"
            value={date}
            onChangeText={setDate}
            placeholder="YYYY-MM-DD or tap to select"
            icon={<Calendar size={20} color={COLORS.textSecondary} strokeWidth={2} />}
          />
          <Input
            label="Time"
            value={time}
            onChangeText={setTime}
            placeholder="2:00 PM or tap to select"
            icon={<Clock size={20} color={COLORS.textSecondary} strokeWidth={2} />}
          />
          <View style={styles.pickerContainer}>
            <Text style={styles.pickerLabel}>Duration</Text>
            <Picker
              value={duration}
              onValueChange={setDuration}
              items={DURATION_OPTIONS}
              placeholder="Select duration"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Meeting Type</Text>
          <View style={styles.meetingTypes}>
            {MEETING_TYPES.map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.meetingTypeCard,
                  meetingType === type && styles.meetingTypeCardActive,
                ]}
                onPress={() => setMeetingType(type)}
                activeOpacity={0.7}>
                {type === 'Video Call' && (
                  <Video size={20} color={meetingType === type ? COLORS.primary : COLORS.textSecondary} strokeWidth={2} />
                )}
                {type === 'Phone Call' && (
                  <MessageSquare size={20} color={meetingType === type ? COLORS.primary : COLORS.textSecondary} strokeWidth={2} />
                )}
                {type === 'In-Person' && (
                  <MapPin size={20} color={meetingType === type ? COLORS.primary : COLORS.textSecondary} strokeWidth={2} />
                )}
                {type === 'Hybrid' && (
                  <Users size={20} color={meetingType === type ? COLORS.primary : COLORS.textSecondary} strokeWidth={2} />
                )}
                <Text
                  style={[
                    styles.meetingTypeText,
                    meetingType === type && styles.meetingTypeTextActive,
                  ]}>
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {meetingType === 'In-Person' && (
            <Input
              label="Location"
              value={location}
              onChangeText={setLocation}
              placeholder="Enter meeting location"
              icon={<MapPin size={20} color={COLORS.textSecondary} strokeWidth={2} />}
            />
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Participants</Text>
          <Input
            label="Participants (optional)"
            value={participants}
            onChangeText={setParticipants}
            placeholder="Add participant emails (comma-separated)"
            icon={<Users size={20} color={COLORS.textSecondary} strokeWidth={2} />}
          />
        </View>

        <View style={styles.infoCard}>
          <CheckCircle size={20} color={COLORS.success} strokeWidth={2} />
          <Text style={styles.infoText}>
            Meeting invitations will be sent to all participants. Calendar invites will be
            generated automatically.
          </Text>
        </View>

        <Button
          title="Schedule Meeting"
          onPress={handleSchedule}
          loading={saving}
          disabled={saving || !title || !date || !time}
          style={styles.scheduleButton}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: SPACING.lg,
    gap: SPACING.xl,
  },
  heroCard: {
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    ...SHADOWS.md,
  },
  heroHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  heroIcon: {
    width: 64,
    height: 64,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroText: {
    flex: 1,
  },
  heroTitle: {
    fontFamily: FONT_FAMILY.displayBold,
    fontSize: FONT_SIZES.xxl,
    color: COLORS.background,
    marginBottom: SPACING.xs / 2,
  },
  heroSubtitle: {
    ...TYPOGRAPHY.body,
    color: 'rgba(255,255,255,0.85)',
  },
  section: {
    gap: SPACING.md,
  },
  sectionTitle: {
    ...TYPOGRAPHY.title,
    fontFamily: FONT_FAMILY.displayMedium,
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  pickerContainer: {
    gap: SPACING.sm,
  },
  pickerLabel: {
    ...TYPOGRAPHY.bodyStrong,
    fontFamily: FONT_FAMILY.bodyBold,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  meetingTypes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  meetingTypeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.surfaceMuted,
    borderWidth: 1,
    borderColor: COLORS.border,
    minWidth: 120,
  },
  meetingTypeCardActive: {
    backgroundColor: COLORS.primaryLight,
    borderColor: COLORS.primary,
  },
  meetingTypeText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    fontFamily: FONT_FAMILY.bodyMedium,
  },
  meetingTypeTextActive: {
    color: COLORS.primary,
    fontFamily: FONT_FAMILY.bodyBold,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.sm,
    padding: SPACING.md,
    backgroundColor: COLORS.success + '15',
    borderRadius: BORDER_RADIUS.md,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.success,
  },
  infoText: {
    ...TYPOGRAPHY.body,
    color: COLORS.text,
    flex: 1,
    lineHeight: 20,
  },
  scheduleButton: {
    marginTop: SPACING.sm,
  },
});

