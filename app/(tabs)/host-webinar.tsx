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
import { router } from 'expo-router';
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
  Video,
  Calendar,
  Clock,
  DollarSign,
  Users,
  FileText,
} from 'lucide-react-native';

const WEBINAR_TYPES = [
  { label: 'Select type', value: '' },
  { label: 'Free', value: 'free' },
  { label: 'Paid', value: 'paid' },
];

export default function HostWebinarScreen() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [duration, setDuration] = useState('60');
  const [price, setPrice] = useState('');
  const [maxAttendees, setMaxAttendees] = useState('100');
  const [creating, setCreating] = useState(false);

  const handleCreate = async () => {
    if (!title || !description || !type || !date || !time) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setCreating(true);
    setTimeout(() => {
      setCreating(false);
      Alert.alert('Success', 'Webinar created successfully!', [
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
              <Video size={28} color={COLORS.background} strokeWidth={2} />
            </View>
            <View style={styles.heroText}>
              <Text style={styles.heroTitle}>Host Webinar</Text>
              <Text style={styles.heroSubtitle}>
                Create a webinar to share your expertise
              </Text>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Webinar Details</Text>
          <Input
            label="Title"
            value={title}
            onChangeText={setTitle}
            placeholder="e.g., Scaling Your SaaS Startup"
          />
          <Input
            label="Description"
            value={description}
            onChangeText={setDescription}
            placeholder="Describe what attendees will learn..."
            multiline
            numberOfLines={4}
          />
          <Picker
            label="Webinar Type"
            selectedValue={type}
            onValueChange={setType}
            items={WEBINAR_TYPES}
          />
          {type === 'paid' && (
            <Input
              label="Price"
              value={price}
              onChangeText={setPrice}
              placeholder="$49"
              keyboardType="numeric"
              icon={<DollarSign size={20} color={COLORS.textSecondary} />}
            />
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Schedule</Text>
          <Input
            label="Date"
            value={date}
            onChangeText={setDate}
            placeholder="YYYY-MM-DD"
            icon={<Calendar size={20} color={COLORS.textSecondary} />}
          />
          <Input
            label="Time"
            value={time}
            onChangeText={setTime}
            placeholder="2:00 PM"
            icon={<Clock size={20} color={COLORS.textSecondary} />}
          />
          <Input
            label="Duration (minutes)"
            value={duration}
            onChangeText={setDuration}
            placeholder="60"
            keyboardType="numeric"
            icon={<Clock size={20} color={COLORS.textSecondary} />}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          <Input
            label="Max Attendees"
            value={maxAttendees}
            onChangeText={setMaxAttendees}
            placeholder="100"
            keyboardType="numeric"
            icon={<Users size={20} color={COLORS.textSecondary} />}
          />
        </View>

        <View style={styles.infoCard}>
          <FileText size={20} color={COLORS.primary} strokeWidth={2} />
          <Text style={styles.infoText}>
            Your webinar will be reviewed before being published. Free webinars are approved
            within 24 hours, paid webinars may take up to 48 hours.
          </Text>
        </View>

        <Button
          title="Create Webinar"
          onPress={handleCreate}
          loading={creating}
          disabled={creating}
          style={styles.createButton}
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
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.sm,
    padding: SPACING.md,
    backgroundColor: COLORS.primaryLight,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  infoText: {
    ...TYPOGRAPHY.body,
    color: COLORS.text,
    flex: 1,
    lineHeight: 20,
  },
  createButton: {
    marginTop: SPACING.md,
  },
});

