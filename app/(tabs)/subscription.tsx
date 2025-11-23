import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { router } from 'expo-router';
import { Button } from '@/components/Button';
import {
  BORDER_RADIUS,
  COLORS,
  FONT_FAMILY,
  FONT_SIZES,
  SHADOWS,
  SPACING,
  TYPOGRAPHY,
} from '@/constants/theme';
import {
  Check,
  X,
  Building2,
  Crown,
  ShieldCheck,
  Zap,
} from 'lucide-react-native';

type PlanTier = 'free' | 'pro' | 'elite';

interface PlanFeature {
  name: string;
  free: boolean | string;
  pro: boolean | string;
  elite: boolean | string;
}

const PLANS = {
  free: {
    name: 'Free',
    price: '0',
    period: 'forever',
    description: 'Perfect for getting started',
    icon: Building2,
    color: COLORS.textSecondary,
  },
  pro: {
    name: 'Pro',
    price: '49',
    period: 'month',
    description: 'For growing startups',
    icon: Zap,
    color: COLORS.primary,
    popular: true,
  },
  elite: {
    name: 'Elite',
    price: '149',
    period: 'month',
    description: 'For established ventures',
    icon: Crown,
    color: COLORS.accent,
  },
};

const FEATURES: PlanFeature[] = [
  { name: 'Network connections', free: 10, pro: 100, elite: 'Unlimited' },
  { name: 'Funding opportunities', free: true, pro: true, elite: true },
  { name: 'Direct messaging', free: 50, pro: 500, elite: 'Unlimited' },
  { name: 'Expert sessions', free: false, pro: 2, elite: 'Unlimited' },
  { name: 'Webinar access', free: false, pro: true, elite: true },
  { name: 'Priority support', free: false, pro: true, elite: true },
  { name: 'Advanced analytics', free: false, pro: true, elite: true },
  { name: 'Custom integrations', free: false, pro: false, elite: true },
  { name: 'Dedicated account manager', free: false, pro: false, elite: true },
  { name: 'White-label options', free: false, pro: false, elite: true },
];

export default function SubscriptionScreen() {
  const [selectedPlan, setSelectedPlan] = useState<PlanTier>('pro');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  const handleSelectPlan = (plan: PlanTier) => {
    setSelectedPlan(plan);
  };

  const handleUpgrade = () => {
    router.push({
      pathname: '/(tabs)/payment',
      params: { plan: selectedPlan, cycle: billingCycle },
    });
  };

  const getAnnualPrice = (monthlyPrice: string) => {
    if (monthlyPrice === '0') return '0';
    const price = parseInt(monthlyPrice);
    return Math.floor(price * 12 * 0.85).toString(); // 15% discount
  };

  const renderFeatureValue = (value: boolean | string | number) => {
    if (value === true) {
      return <Check size={18} color={COLORS.success} strokeWidth={2.5} />;
    }
    if (value === false) {
      return <X size={18} color={COLORS.textSecondary} strokeWidth={2} />;
    }
    return (
      <Text style={styles.featureValueText}>
        {typeof value === 'number' ? value.toLocaleString() : value}
      </Text>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Choose Your Plan</Text>
          <Text style={styles.headerSubtitle}>
            Select the plan that best fits your startup journey
          </Text>
        </View>

        <View style={styles.billingToggle}>
          <TouchableOpacity
            style={[styles.toggleOption, billingCycle === 'monthly' && styles.toggleActive]}
            onPress={() => setBillingCycle('monthly')}
            activeOpacity={0.7}>
            <Text
              style={[
                styles.toggleText,
                billingCycle === 'monthly' && styles.toggleTextActive,
              ]}>
              Monthly
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleOption, billingCycle === 'annual' && styles.toggleActive]}
            onPress={() => setBillingCycle('annual')}
            activeOpacity={0.7}>
            <Text
              style={[
                styles.toggleText,
                billingCycle === 'annual' && styles.toggleTextActive,
              ]}>
              Annual
              <Text style={styles.savingsBadge}> Save 15%</Text>
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.plansGrid}>
          {(['free', 'pro', 'elite'] as PlanTier[]).map((planKey) => {
            const plan = PLANS[planKey];
            const IconComponent = plan.icon;
            const isSelected = selectedPlan === planKey;
            const price =
              billingCycle === 'annual' && planKey !== 'free'
                ? getAnnualPrice(plan.price)
                : plan.price;

            return (
              <TouchableOpacity
                key={planKey}
                style={[
                  styles.planCard,
                  isSelected && styles.planCardSelected,
                  plan.popular && styles.planCardPopular,
                ]}
                onPress={() => handleSelectPlan(planKey)}
                activeOpacity={0.85}>
                {plan.popular && (
                  <View style={styles.popularBadge}>
                    <Text style={styles.popularBadgeText}>Most Popular</Text>
                  </View>
                )}
                <View style={[styles.planIcon, { backgroundColor: `${plan.color}15` }]}>
                  <IconComponent size={28} color={plan.color} strokeWidth={2} />
                </View>
                <Text style={styles.planName}>{plan.name}</Text>
                <View style={styles.priceContainer}>
                  <Text style={styles.currency}>$</Text>
                  <Text style={styles.price}>{price}</Text>
                  {planKey !== 'free' && (
                    <Text style={styles.period}>
                      /{billingCycle === 'annual' ? 'year' : plan.period}
                    </Text>
                  )}
                </View>
                <Text style={styles.planDescription}>{plan.description}</Text>
                {isSelected && (
                  <View style={styles.selectedIndicator}>
                    <Check size={16} color={COLORS.background} strokeWidth={3} />
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.comparisonCard}>
          <Text style={styles.comparisonTitle}>Feature Comparison</Text>
          <View style={styles.comparisonTable}>
            <View style={styles.tableHeader}>
              <View style={styles.tableHeaderCell}>
                <Text style={styles.tableHeaderText}>Feature</Text>
              </View>
              <View style={styles.tableHeaderCell}>
                <Text style={styles.tableHeaderText}>Free</Text>
              </View>
              <View style={styles.tableHeaderCell}>
                <Text style={styles.tableHeaderText}>Pro</Text>
              </View>
              <View style={styles.tableHeaderCell}>
                <Text style={styles.tableHeaderText}>Elite</Text>
              </View>
            </View>
            {FEATURES.map((feature, index) => (
              <View
                key={feature.name}
                style={[
                  styles.tableRow,
                  index === FEATURES.length - 1 && styles.tableRowLast,
                ]}>
                <View style={styles.tableCell}>
                  <Text style={styles.tableCellText}>{feature.name}</Text>
                </View>
                <View style={styles.tableCell}>
                  {renderFeatureValue(feature.free)}
                </View>
                <View style={styles.tableCell}>
                  {renderFeatureValue(feature.pro)}
                </View>
                <View style={styles.tableCell}>
                  {renderFeatureValue(feature.elite)}
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.currentPlanSection}>
          <Text style={styles.currentPlanTitle}>Current Plan</Text>
          <View style={styles.currentPlanCard}>
            <View style={styles.currentPlanHeader}>
              <View style={styles.currentPlanIcon}>
                <Building2 size={24} color={COLORS.primary} strokeWidth={2} />
              </View>
              <View style={styles.currentPlanInfo}>
                <Text style={styles.currentPlanName}>Free Plan</Text>
                <Text style={styles.currentPlanRenewal}>Renews: Never</Text>
              </View>
            </View>
            <View style={styles.currentPlanFeatures}>
              <Text style={styles.currentPlanFeaturesTitle}>Current Benefits:</Text>
              <View style={styles.featureList}>
                <View style={styles.featureItem}>
                  <Check size={16} color={COLORS.success} strokeWidth={2.5} />
                  <Text style={styles.featureItemText}>10 Network connections</Text>
                </View>
                <View style={styles.featureItem}>
                  <Check size={16} color={COLORS.success} strokeWidth={2.5} />
                  <Text style={styles.featureItemText}>50 Direct messages</Text>
                </View>
                <View style={styles.featureItem}>
                  <X size={16} color={COLORS.textSecondary} strokeWidth={2} />
                  <Text style={[styles.featureItemText, styles.featureItemDisabled]}>
                    Expert sessions
                  </Text>
                </View>
                <View style={styles.featureItem}>
                  <X size={16} color={COLORS.textSecondary} strokeWidth={2} />
                  <Text style={[styles.featureItemText, styles.featureItemDisabled]}>
                    Webinar recordings
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.paymentHistorySection}>
          <Text style={styles.sectionTitle}>Payment History</Text>
          <View style={styles.paymentHistoryCard}>
            <Text style={styles.noPaymentsText}>No payment history</Text>
            <Text style={styles.noPaymentsSubtext}>
              Upgrade to Pro or Elite to see your payment history here
            </Text>
          </View>
        </View>

        <View style={styles.securitySection}>
          <ShieldCheck size={20} color={COLORS.primary} strokeWidth={2} />
          <Text style={styles.securityText}>
            Secure payment processing via Razorpay and Stripe. Cancel anytime.
          </Text>
        </View>

        {selectedPlan !== 'free' && (
          <Button
            title={`Upgrade to ${PLANS[selectedPlan].name}`}
            onPress={handleUpgrade}
            style={styles.upgradeButton}
          />
        )}
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
    paddingBottom: SPACING.xxl,
    gap: SPACING.xl,
  },
  header: {
    alignItems: 'center',
    gap: SPACING.sm,
  },
  headerTitle: {
    ...TYPOGRAPHY.display,
    fontFamily: FONT_FAMILY.displayBold,
    color: COLORS.text,
    textAlign: 'center',
  },
  headerSubtitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  billingToggle: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.xs,
  },
  toggleOption: {
    flex: 1,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.sm,
    alignItems: 'center',
  },
  toggleActive: {
    backgroundColor: COLORS.primary,
  },
  toggleText: {
    ...TYPOGRAPHY.body,
    fontFamily: FONT_FAMILY.bodyMedium,
    color: COLORS.textSecondary,
  },
  toggleTextActive: {
    color: COLORS.background,
    fontFamily: FONT_FAMILY.bodyBold,
  },
  savingsBadge: {
    fontSize: FONT_SIZES.xs,
    fontFamily: FONT_FAMILY.bodyBold,
  },
  plansGrid: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  planCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 2,
    borderColor: COLORS.border,
    alignItems: 'center',
    position: 'relative',
    ...SHADOWS.sm,
    gap: SPACING.sm,
  },
  planCardSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight,
    ...SHADOWS.md,
  },
  planCardPopular: {
    borderColor: COLORS.accent,
  },
  popularBadge: {
    position: 'absolute',
    top: -12,
    backgroundColor: COLORS.accent,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs / 2,
    borderRadius: BORDER_RADIUS.full,
  },
  popularBadgeText: {
    ...TYPOGRAPHY.label,
    color: COLORS.background,
    fontFamily: FONT_FAMILY.bodyBold,
  },
  planIcon: {
    width: 64,
    height: 64,
    borderRadius: BORDER_RADIUS.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  planName: {
    fontFamily: FONT_FAMILY.displayMedium,
    fontSize: FONT_SIZES.xl,
    color: COLORS.text,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 2,
  },
  currency: {
    fontFamily: FONT_FAMILY.displayMedium,
    fontSize: FONT_SIZES.lg,
    color: COLORS.text,
  },
  price: {
    fontFamily: FONT_FAMILY.displayBold,
    fontSize: 40,
    color: COLORS.text,
    lineHeight: 48,
  },
  period: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    marginLeft: 2,
  },
  planDescription: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  selectedIndicator: {
    position: 'absolute',
    top: SPACING.md,
    right: SPACING.md,
    width: 28,
    height: 28,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  comparisonCard: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.md,
  },
  comparisonTitle: {
    ...TYPOGRAPHY.title,
    fontFamily: FONT_FAMILY.displayMedium,
    color: COLORS.text,
    marginBottom: SPACING.lg,
  },
  comparisonTable: {
    gap: 0,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderBottomColor: COLORS.border,
    paddingBottom: SPACING.md,
    marginBottom: SPACING.md,
  },
  tableHeaderCell: {
    flex: 1,
  },
  tableHeaderText: {
    ...TYPOGRAPHY.bodyStrong,
    fontFamily: FONT_FAMILY.bodyBold,
    color: COLORS.text,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  tableRowLast: {
    borderBottomWidth: 0,
  },
  tableCell: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tableCellText: {
    ...TYPOGRAPHY.body,
    color: COLORS.text,
  },
  featureValueText: {
    ...TYPOGRAPHY.body,
    fontFamily: FONT_FAMILY.bodyMedium,
    color: COLORS.text,
  },
  securitySection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    padding: SPACING.md,
    backgroundColor: COLORS.surfaceMuted,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  securityText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    flex: 1,
  },
  upgradeButton: {
    marginTop: SPACING.md,
  },
  currentPlanSection: {
    gap: SPACING.md,
  },
  currentPlanTitle: {
    ...TYPOGRAPHY.title,
    fontFamily: FONT_FAMILY.displayMedium,
    color: COLORS.text,
  },
  currentPlanCard: {
    padding: SPACING.lg,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
    gap: SPACING.md,
  },
  currentPlanHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  currentPlanIcon: {
    width: 56,
    height: 56,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  currentPlanInfo: {
    flex: 1,
  },
  currentPlanName: {
    ...TYPOGRAPHY.title,
    fontFamily: FONT_FAMILY.displayMedium,
    color: COLORS.text,
    marginBottom: SPACING.xs / 2,
  },
  currentPlanRenewal: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
  },
  currentPlanFeatures: {
    gap: SPACING.sm,
  },
  currentPlanFeaturesTitle: {
    ...TYPOGRAPHY.bodyStrong,
    fontFamily: FONT_FAMILY.bodyBold,
    color: COLORS.text,
  },
  featureList: {
    gap: SPACING.sm,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  featureItemText: {
    ...TYPOGRAPHY.body,
    color: COLORS.text,
  },
  featureItemDisabled: {
    color: COLORS.textSecondary,
    textDecorationLine: 'line-through',
  },
  paymentHistorySection: {
    gap: SPACING.md,
  },
  paymentHistoryCard: {
    padding: SPACING.xl,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
    alignItems: 'center',
    gap: SPACING.sm,
  },
  noPaymentsText: {
    ...TYPOGRAPHY.bodyStrong,
    fontFamily: FONT_FAMILY.bodyBold,
    color: COLORS.text,
  },
  noPaymentsSubtext: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});


