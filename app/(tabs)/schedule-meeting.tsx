import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { Picker } from '@/components/Picker';
import { useMeetings } from '@/hooks/useMeetings';
import { showAlert } from '@/utils/platformAlert';
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

const DURATION_OPTIONS = [
  { label: '30 minutes', value: 30 },
  { label: '1 hour', value: 60 },
  { label: '1.5 hours', value: 90 },
  { label: '2 hours', value: 120 },
];

export default function ScheduleMeetingScreen() {
  const params = useLocalSearchParams();
  const { scheduleMeeting, loading } = useMeetings();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [participantEmail, setParticipantEmail] = useState((params.email as string) || '');
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [duration, setDuration] = useState(60);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (time: Date) => {
    return time.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(Platform.OS === 'ios');
    if (selectedTime) {
      setTime(selectedTime);
    }
  };

  const handleSchedule = async () => {
    // Validation
    if (!title.trim()) {
      showAlert('Required Field', 'Please enter a meeting title');
      return;
    }

    if (!participantEmail.trim()) {
      showAlert('Required Field', 'Please enter participant email address');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(participantEmail)) {
      showAlert('Invalid Email', 'Please enter a valid email address');
      return;
    }

    // Combine date and time
    const scheduledDateTime = new Date(date);
    scheduledDateTime.setHours(time.getHours());
    scheduledDateTime.setMinutes(time.getMinutes());
    scheduledDateTime.setSeconds(0);
    scheduledDateTime.setMilliseconds(0);

    // Check if meeting is in the past
    if (scheduledDateTime < new Date()) {
      showAlert('Invalid Date', 'Meeting time must be in the future');
      return;
    }

    try {
      const result = await scheduleMeeting({
        title: title.trim(),
        description: description.trim() || undefined,
        participantEmail: participantEmail.trim(),
        scheduledAt: scheduledDateTime.toISOString(),
        duration,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      });

      if (result.success) {
        const emailNote = result.emailSent 
          ? '📧 Email invitation sent' 
          : '⚠️ Email not sent - please share the link manually';
        
        showAlert(
          'Meeting Scheduled! 🎉',
          `Your meeting has been scheduled successfully!\n\n` +
          `📅 ${formatDate(scheduledDateTime)} at ${formatTime(scheduledDateTime)}\n` +
          `👥 With ${participantEmail}\n\n` +
          `${emailNote}\n\n` +
          `Meeting Link:\n${result.meetLink}`,
          [
            {
              text: 'Copy Link',
              onPress: async () => {
                await Clipboard.setStringAsync(result.meetLink);
                showAlert('Link Copied!', 'Meeting link has been copied to clipboard. Share it with the participant.');
              },
            },
            {
              text: 'OK',
              onPress: () => router.back(),
            },
          ]
        );
      } else {
        showAlert('Error', result.error || 'Failed to schedule meeting');
      }
    } catch (error: any) {
      console.error('Error scheduling meeting:', error);
      showAlert('Error', error.message || 'Failed to schedule meeting');
    }
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
                Video call link will be generated automatically
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
            label="Description (Optional)"
            value={description}
            onChangeText={setDescription}
            placeholder="Brief description of the meeting agenda..."
            multiline
            numberOfLines={4}
            icon={<MessageSquare size={20} color={COLORS.textSecondary} strokeWidth={2} />}
          />
          <Input
            label="Participant Email"
            value={participantEmail}
            onChangeText={setParticipantEmail}
            placeholder="participant@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            icon={<Users size={20} color={COLORS.textSecondary} strokeWidth={2} />}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Date & Time</Text>
          
          <TouchableOpacity
            style={styles.dateTimeButton}
            onPress={() => setShowDatePicker(true)}>
            <Calendar size={20} color={COLORS.primary} strokeWidth={2} />
            <Text style={styles.dateTimeText}>{formatDate(date)}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.dateTimeButton}
            onPress={() => setShowTimePicker(true)}>
            <Clock size={20} color={COLORS.primary} strokeWidth={2} />
            <Text style={styles.dateTimeText}>{formatTime(time)}</Text>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={handleDateChange}
              minimumDate={new Date()}
            />
          )}

          {showTimePicker && (
            <DateTimePicker
              value={time}
              mode="time"
              display="default"
              onChange={handleTimeChange}
            />
          )}

          <View style={styles.pickerContainer}>
            <Text style={styles.label}>Duration</Text>
            <Picker
              items={DURATION_OPTIONS.map(opt => ({ label: opt.label, value: opt.value.toString() }))}
              selectedValue={duration.toString()}
              onValueChange={(value) => setDuration(parseInt(value))}
              placeholder="Select duration"
            />
          </View>
        </View>

        <View style={styles.infoCard}>
          <Video size={20} color={COLORS.primary} strokeWidth={2} />
          <Text style={styles.infoText}>
            A secure video call link will be automatically generated and sent to both participants via email
          </Text>
        </View>

        <View style={styles.infoCard}>
          <CheckCircle size={20} color={COLORS.success} strokeWidth={2} />
          <Text style={styles.infoText}>
            Calendar invites will be sent automatically with meeting details
          </Text>
        </View>

        <Button
          title={loading ? 'Scheduling...' : 'Schedule Meeting'}
          onPress={handleSchedule}
          loading={loading}
          style={styles.saveButton}
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
  dateTimeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    padding: SPACING.md,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.md,
  },
  dateTimeText: {
    ...TYPOGRAPHY.body,
    color: COLORS.text,
    flex: 1,
  },
  pickerContainer: {
    marginTop: SPACING.sm,
  },
  label: {
    ...TYPOGRAPHY.bodySm,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  saveButton: {
    marginTop: SPACING.md,
  },
  scheduleButton: {
    marginTop: SPACING.sm,
  },
});

