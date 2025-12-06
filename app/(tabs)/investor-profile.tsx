import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
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
  Building2,
  Link,
  Globe,
  Plus,
  X,
  Briefcase,
  TrendingUp,
} from 'lucide-react-native';
import { MOCK_PROFILE } from '@/hooks/useMockData';
import { useAuth } from '@/contexts/AuthContext';

const INVESTMENT_FOCUS_OPTIONS = [
  'Seed Stage',
  'Series A',
  'Series B',
  'Growth Stage',
  'B2B SaaS',
  'FinTech',
  'HealthTech',
  'E-commerce',
  'AI/ML',
  'Enterprise Software',
];

const PORTFOLIO_COMPANIES = [
  { id: '1', name: 'TechStart Inc', stage: 'Series A', invested: '$500K' },
  { id: '2', name: 'HealthTech Solutions', stage: 'Seed', invested: '$250K' },
  { id: '3', name: 'FinTech Innovations', stage: 'Series B', invested: '$1M' },
];

export default function InvestorProfileScreen() {
  const { profile } = useAuth();
  const [fundName, setFundName] = useState('Venture Capital Partners');
  const [companyInfo, setCompanyInfo] = useState('Leading early-stage VC fund');
  const [investmentFocus, setInvestmentFocus] = useState<string[]>(['Seed Stage', 'B2B SaaS']);
  const [portfolio, setPortfolio] = useState('50+ portfolio companies, $50M+ AUM');
  const [linkedinUrl, setLinkedinUrl] = useState(profile?.linkedin_url || '');
  const [twitterUrl, setTwitterUrl] = useState(profile?.twitter_url || '');
  const [websiteUrl, setWebsiteUrl] = useState(profile?.website_url || '');
  const [portfolioCompanies, setPortfolioCompanies] = useState(PORTFOLIO_COMPANIES);
  const [newCompanyName, setNewCompanyName] = useState('');
  const [newCompanyStage, setNewCompanyStage] = useState('');
  const [newCompanyInvested, setNewCompanyInvested] = useState('');
  const [saving, setSaving] = useState(false);

  const toggleFocus = (focus: string) => {
    setInvestmentFocus((prev) =>
      prev.includes(focus) ? prev.filter((f) => f !== focus) : [...prev, focus]
    );
  };

  const addPortfolioCompany = () => {
    if (!newCompanyName || !newCompanyStage || !newCompanyInvested) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    setPortfolioCompanies([
      ...portfolioCompanies,
      {
        id: Date.now().toString(),
        name: newCompanyName,
        stage: newCompanyStage,
        invested: newCompanyInvested,
      },
    ]);
    setNewCompanyName('');
    setNewCompanyStage('');
    setNewCompanyInvested('');
  };

  const removePortfolioCompany = (id: string) => {
    setPortfolioCompanies(portfolioCompanies.filter((c) => c.id !== id));
  };

  const handleSave = async () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      Alert.alert('Success', 'Investor profile updated successfully!');
    }, 1000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <LinearGradient colors={GRADIENTS.primary} style={styles.heroCard}>
          <View style={styles.heroHeader}>
            <View style={styles.heroIcon}>
              <Building2 size={28} color={COLORS.background} strokeWidth={2} />
            </View>
            <View style={styles.heroText}>
              <Text style={styles.heroTitle}>Investor Profile</Text>
              <Text style={styles.heroSubtitle}>Manage your fund and portfolio information</Text>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Fund & Company Information</Text>
          <Input
            label="Fund/Company Name"
            value={fundName}
            onChangeText={setFundName}
            placeholder="e.g., Venture Capital Partners"
          />
          <Input
            label="Company Description"
            value={companyInfo}
            onChangeText={setCompanyInfo}
            placeholder="Describe your fund or company..."
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Investment Focus</Text>
          <Text style={styles.sectionSubtitle}>Select your areas of investment interest</Text>
          <View style={styles.focusGrid}>
            {INVESTMENT_FOCUS_OPTIONS.map((focus) => {
              const isSelected = investmentFocus.includes(focus);
              return (
                <TouchableOpacity
                  key={focus}
                  style={[styles.focusTag, isSelected && styles.focusTagSelected]}
                  onPress={() => toggleFocus(focus)}
                  activeOpacity={0.7}>
                  {isSelected ? (
                    <TrendingUp size={16} color={COLORS.primary} strokeWidth={2} />
                  ) : (
                    <View style={styles.focusTagDot} />
                  )}
                  <Text
                    style={[
                      styles.focusTagText,
                      isSelected && styles.focusTagTextSelected,
                    ]}>
                    {focus}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Portfolio Summary</Text>
          <Input
            label="Portfolio Description"
            value={portfolio}
            onChangeText={setPortfolio}
            placeholder="e.g., 50+ portfolio companies, $50M+ AUM"
            multiline
            numberOfLines={2}
          />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Portfolio Companies</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => {
                // Show add form
                Alert.alert('Add Company', 'Fill in the form below to add a portfolio company');
              }}
              activeOpacity={0.7}>
              <Plus size={18} color={COLORS.primary} strokeWidth={2} />
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.portfolioList}>
            {portfolioCompanies.map((company) => (
              <View key={company.id} style={styles.portfolioCard}>
                <View style={styles.portfolioInfo}>
                  <Text style={styles.portfolioName}>{company.name}</Text>
                  <View style={styles.portfolioDetails}>
                    <Text style={styles.portfolioStage}>{company.stage}</Text>
                    <Text style={styles.portfolioInvested}>{company.invested}</Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => removePortfolioCompany(company.id)}
                  activeOpacity={0.7}>
                  <X size={18} color={COLORS.error} strokeWidth={2} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
          <View style={styles.addCompanyForm}>
            <Input
              label="Company Name"
              value={newCompanyName}
              onChangeText={setNewCompanyName}
              placeholder="Enter company name"
            />
            <Input
              label="Stage"
              value={newCompanyStage}
              onChangeText={setNewCompanyStage}
              placeholder="e.g., Series A"
            />
            <Input
              label="Amount Invested"
              value={newCompanyInvested}
              onChangeText={setNewCompanyInvested}
              placeholder="e.g., $500K"
            />
            <Button
              title="Add Company"
              onPress={addPortfolioCompany}
              variant="outline"
              style={styles.addCompanyButton}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Social Links & Website</Text>
          <View style={styles.socialLinks}>
            <View style={styles.socialLinkItem}>
              <Link size={18} color={COLORS.primary} strokeWidth={2} />
              <TextInput
                style={styles.socialLinkInput}
                value={linkedinUrl}
                onChangeText={setLinkedinUrl}
                placeholder="LinkedIn URL"
                placeholderTextColor={COLORS.textSecondary}
              />
            </View>
            <View style={styles.socialLinkItem}>
              <Globe size={18} color={COLORS.primary} strokeWidth={2} />
              <TextInput
                style={styles.socialLinkInput}
                value={twitterUrl}
                onChangeText={setTwitterUrl}
                placeholder="Twitter URL"
                placeholderTextColor={COLORS.textSecondary}
              />
            </View>
            <View style={styles.socialLinkItem}>
              <Globe size={18} color={COLORS.primary} strokeWidth={2} />
              <TextInput
                style={styles.socialLinkInput}
                value={websiteUrl}
                onChangeText={setWebsiteUrl}
                placeholder="Website URL"
                placeholderTextColor={COLORS.textSecondary}
              />
            </View>
          </View>
        </View>

        <Button
          title="Save Changes"
          onPress={handleSave}
          loading={saving}
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    ...TYPOGRAPHY.title,
    fontFamily: FONT_FAMILY.displayMedium,
    color: COLORS.text,
  },
  sectionSubtitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
  },
  focusGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  focusTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs / 2,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  focusTagSelected: {
    backgroundColor: COLORS.primaryLight,
    borderColor: COLORS.primary,
  },
  focusTagDot: {
    width: 8,
    height: 8,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.border,
  },
  focusTagText: {
    ...TYPOGRAPHY.body,
    color: COLORS.text,
    fontFamily: FONT_FAMILY.bodyMedium,
  },
  focusTagTextSelected: {
    color: COLORS.primary,
    fontFamily: FONT_FAMILY.bodyBold,
  },
  portfolioList: {
    gap: SPACING.sm,
  },
  portfolioCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.md,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  portfolioInfo: {
    flex: 1,
  },
  portfolioName: {
    ...TYPOGRAPHY.bodyStrong,
    fontFamily: FONT_FAMILY.bodyBold,
    color: COLORS.text,
    marginBottom: SPACING.xs / 2,
  },
  portfolioDetails: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  portfolioStage: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
  },
  portfolioInvested: {
    ...TYPOGRAPHY.caption,
    color: COLORS.primary,
    fontFamily: FONT_FAMILY.bodyBold,
  },
  removeButton: {
    padding: SPACING.xs,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.primaryLight,
    borderRadius: BORDER_RADIUS.md,
  },
  addButtonText: {
    ...TYPOGRAPHY.bodyStrong,
    color: COLORS.primary,
    fontFamily: FONT_FAMILY.bodyBold,
  },
  addCompanyForm: {
    padding: SPACING.md,
    backgroundColor: COLORS.surfaceMuted,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: SPACING.sm,
  },
  addCompanyButton: {
    marginTop: SPACING.sm,
  },
  socialLinks: {
    gap: SPACING.sm,
  },
  socialLinkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    padding: SPACING.md,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  socialLinkInput: {
    flex: 1,
    ...TYPOGRAPHY.body,
    color: COLORS.text,
  },
  saveButton: {
    marginTop: SPACING.md,
  },
});

