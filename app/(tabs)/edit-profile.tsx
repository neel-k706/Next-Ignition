import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { MOCK_PROFILE } from '@/hooks/useMockData';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { RoleSpecificFields } from '@/components/RoleSpecificFields';
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS } from '@/constants/theme';
import { ArrowLeft } from 'lucide-react-native';

export default function EditProfileScreen() {
  const profile = MOCK_PROFILE;
  const [loading, setLoading] = useState(false);
  const [fullName, setFullName] = useState('');
  const [location, setLocation] = useState('');
  const [bio, setBio] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [twitterUrl, setTwitterUrl] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');

  const [founderValues, setFounderValues] = useState({
    ventureName: '',
    ventureDescription: '',
    ventureIndustry: '',
    ventureStage: '',
  });

  const [investorValues, setInvestorValues] = useState({
    investmentFocus: '',
    investmentRange: '',
    portfolioSize: '',
  });

  const [expertValues, setExpertValues] = useState({
    yearsExperience: '',
    hourlyRate: '',
    expertiseAreas: '',
  });

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
      setLocation(profile.location || '');
      setBio(profile.bio || '');
      setLinkedinUrl(profile.linkedin_url || '');
      setTwitterUrl(profile.twitter_url || '');
      setWebsiteUrl(profile.website_url || '');

      setFounderValues({
        ventureName: profile.venture_name || '',
        ventureDescription: profile.venture_description || '',
        ventureIndustry: profile.venture_industry || '',
        ventureStage: profile.venture_stage || '',
      });

      setInvestorValues({
        investmentFocus: profile.investment_focus || '',
        investmentRange: profile.investment_range || '',
        portfolioSize: profile.portfolio_size || '',
      });

      setExpertValues({
        yearsExperience: profile.years_experience?.toString() || '',
        hourlyRate: profile.hourly_rate?.toString() || '',
        expertiseAreas: profile.expertise_areas?.join(', ') || '',
      });
    }
  }, [profile]);

  const handleSave = async () => {
    if (!fullName.trim()) {
      Alert.alert('Validation Error', 'Full name is required');
      return;
    }

    if (!location.trim()) {
      Alert.alert('Validation Error', 'Location is required');
      return;
    }

    if (!bio.trim()) {
      Alert.alert('Validation Error', 'Bio is required');
      return;
    }

    setLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      console.log('Profile saved:', {
        fullName,
        location,
        bio,
        linkedinUrl,
        twitterUrl,
        websiteUrl,
        founderValues,
        investorValues,
        expertValues,
      });

      Alert.alert(
        'Success',
        'Profile updated successfully!',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile. Please try again.');
      console.error('Save error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.title}>Edit Profile</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          <Input
            label="Full Name"
            value={fullName}
            onChangeText={setFullName}
            placeholder="Your full name"
          />

          <Input
            label="Location"
            value={location}
            onChangeText={setLocation}
            placeholder="City, Country"
          />

          <Input
            label="Bio"
            value={bio}
            onChangeText={setBio}
            placeholder="Tell us about yourself"
            multiline
            numberOfLines={4}
            style={styles.textArea}
          />

          <Text style={styles.sectionTitle}>Social Links</Text>

          <Input
            label="LinkedIn"
            value={linkedinUrl}
            onChangeText={setLinkedinUrl}
            placeholder="https://linkedin.com/in/yourprofile"
            autoCapitalize="none"
          />

          <Input
            label="Twitter"
            value={twitterUrl}
            onChangeText={setTwitterUrl}
            placeholder="https://twitter.com/yourhandle"
            autoCapitalize="none"
          />

          <Input
            label="Website"
            value={websiteUrl}
            onChangeText={setWebsiteUrl}
            placeholder="https://yourwebsite.com"
            autoCapitalize="none"
          />

          <RoleSpecificFields
            role={profile?.role}
            founderValues={founderValues}
            investorValues={investorValues}
            expertValues={expertValues}
            onFounderChange={(field, value) =>
              setFounderValues((prev) => ({ ...prev, [field]: value }))
            }
            onInvestorChange={(field, value) =>
              setInvestorValues((prev) => ({ ...prev, [field]: value }))
            }
            onExpertChange={(field, value) =>
              setExpertValues((prev) => ({ ...prev, [field]: value }))
            }
          />

          <Button
            title="Save Changes"
            onPress={handleSave}
            loading={loading}
            style={styles.saveButton}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  title: {
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.text,
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.text,
    marginTop: SPACING.lg,
    marginBottom: SPACING.md,
  },
  saveButton: {
    marginTop: SPACING.xl,
  },
});
