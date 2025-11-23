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
  Award,
  Calendar,
  Clock,
  MessageSquare,
  CheckCircle,
  UserRound,
} from 'lucide-react-native';

const DURATION_OPTIONS = ['30 minutes', '1 hour', '1.5 hours', '2 hours'];
const TOPIC_OPTIONS = [
  'Product Strategy',
  'Go-to-Market',
  'Fundraising',
  'Financial Planning',
  'Marketing & Growth',
  'Technical Architecture',
  'Operations',
  'Team Building',
  'Other',
];

const MOCK_EXPERTS = [
  { id: '1', name: 'Sarah Johnson', expertise: 'Product Strategy, Go-to-Market' },
  { id: '2', name: 'Michael Chen', expertise: 'Fundraising, Financial Planning' },
];

export default function RequestMentorshipScreen() {
  const params = useLocalSearchParams();
  const expertId = params.expertId as string;
  const [selectedExpert, setSelectedExpert] = useState(expertId || '');
  const [topic, setTopic] = useState('');
  const [customTopic, setCustomTopic] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('');
  const [duration, setDuration] = useState(DURATION_OPTIONS[1]);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const selectedExpertData = MOCK_EXPERTS.find((e) => e.id === selectedExpert);

  const handleSendRequest = async () => {
    if (!selectedExpert || !topic || !preferredDate || !preferredTime) {
      Alert.alert('Required Fields', 'Please fill in all required fields');
      return;
    }

    setSending(true);
    setTimeout(() => {
      setSending(false);
      Alert.alert('Request Sent', 'Your mentorship request has been sent!', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    }, 1500);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <LinearGradient colors={GRADIENTS.accent} style={styles.heroCard}>
          <View style={styles.heroHeader}>
            <View style={styles.heroIcon}>
              <Award size={28} color={COLORS.background} strokeWidth={2} />
            </View>
            <View style={styles.heroText}>
              <Text style={styles.heroTitle}>Request Mentorship</Text>
              <Text style={styles.heroSubtitle}>
                Connect with an expert for guidance
              </Text>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Expert</Text>
          <View style={styles.expertsList}>
            {MOCK_EXPERTS.map((expert) => (
              <TouchableOpacity
                key={expert.id}
                style={[
                  styles.expertCard,
                  selectedExpert === expert.id && styles.expertCardActive,
                ]}
                onPress={() => setSelectedExpert(expert.id)}
                activeOpacity={0.7}>
                <View style={styles.expertIcon}>
                  <UserRound size={20} color={selectedExpert === expert.id ? COLORS.primary : COLORS.textSecondary} strokeWidth={2} />
                </View>
                <View style={styles.expertInfo}>
                  <Text
                    style={[
                      styles.expertName,
                      selectedExpert === expert.id && styles.expertNameActive,
                    ]}>
                    {expert.name}
                  </Text>
                  <Text style={styles.expertExpertise}>{expert.expertise}</Text>
                </View>
                {selectedExpert === expert.id && (
                  <CheckCircle size={20} color={COLORS.primary} strokeWidth={2} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Session Details</Text>
          <View style={styles.pickerContainer}>
            <Text style={styles.pickerLabel}>Topic / Area of Help</Text>
            <Picker
              value={topic}
              onValueChange={setTopic}
              items={TOPIC_OPTIONS}
              placeholder="Select topic"
            />
          </View>
          {topic === 'Other' && (
            <Input
              label="Custom Topic"
              value={customTopic}
              onChangeText={setCustomTopic}
              placeholder="Describe what you need help with"
            />
          )}
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
          <Text style={styles.sectionTitle}>Preferred Schedule</Text>
          <Input
            label="Preferred Date"
            value={preferredDate}
            onChangeText={setPreferredDate}
            placeholder="YYYY-MM-DD or tap to select"
            icon={<Calendar size={20} color={COLORS.textSecondary} strokeWidth={2} />}
          />
          <Input
            label="Preferred Time"
            value={preferredTime}
            onChangeText={setPreferredTime}
            placeholder="2:00 PM or tap to select"
            icon={<Clock size={20} color={COLORS.textSecondary} strokeWidth={2} />}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Message (Optional)</Text>
          <Input
            label="Message to Expert"
            value={message}
            onChangeText={setMessage}
            placeholder="Brief description of what you'd like to discuss..."
            multiline
            numberOfLines={4}
            icon={<MessageSquare size={20} color={COLORS.textSecondary} strokeWidth={2} />}
          />
        </View>

        <View style={styles.infoCard}>
          <CheckCircle size={20} color={COLORS.primary} strokeWidth={2} />
          <Text style={styles.infoText}>
            The expert will review your request and respond within 24-48 hours. You&apos;ll
            receive a notification when they respond.
          </Text>
        </View>

        <Button
          title="Send Request"
          onPress={handleSendRequest}
          loading={sending}
          disabled={sending || !selectedExpert || !topic || !preferredDate || !preferredTime}
          style={styles.sendButton}
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
  expertsList: {
    gap: SPACING.md,
  },
  expertCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    padding: SPACING.md,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.xs,
  },
  expertCardActive: {
    backgroundColor: COLORS.primaryLight,
    borderColor: COLORS.primary,
  },
  expertIcon: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.surfaceMuted,
    justifyContent: 'center',
    alignItems: 'center',
  },
  expertInfo: {
    flex: 1,
  },
  expertName: {
    ...TYPOGRAPHY.bodyStrong,
    fontFamily: FONT_FAMILY.bodyBold,
    color: COLORS.text,
    marginBottom: SPACING.xs / 2,
  },
  expertNameActive: {
    color: COLORS.primary,
  },
  expertExpertise: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
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
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.sm,
    padding: SPACING.md,
    backgroundColor: COLORS.primaryLight + '30',
    borderRadius: BORDER_RADIUS.md,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primary,
  },
  infoText: {
    ...TYPOGRAPHY.body,
    color: COLORS.text,
    flex: 1,
    lineHeight: 20,
  },
  sendButton: {
    marginTop: SPACING.sm,
  },
});

