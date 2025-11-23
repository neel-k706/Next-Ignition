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
import { router, useLocalSearchParams } from 'expo-router';
import { Button } from '@/components/Button';
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
  CreditCard,
  ShieldCheck,
  Check,
  Building2,
  Zap,
  Crown,
} from 'lucide-react-native';

type PaymentMethod = 'card' | 'upi' | 'netbanking';

const PAYMENT_METHODS = [
  { id: 'card' as PaymentMethod, name: 'Credit/Debit Card', icon: CreditCard },
  { id: 'upi' as PaymentMethod, name: 'UPI', icon: Building2 },
  { id: 'netbanking' as PaymentMethod, name: 'Net Banking', icon: Building2 },
];

const PLAN_INFO = {
  pro: { name: 'Pro', icon: Zap, color: COLORS.primary },
  elite: { name: 'Elite', icon: Crown, color: COLORS.accent },
};

export default function PaymentScreen() {
  const params = useLocalSearchParams();
  const plan = (params.plan as 'pro' | 'elite') || 'pro';
  const cycle = (params.cycle as 'monthly' | 'annual') || 'monthly';

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [loading, setLoading] = useState(false);

  const planInfo = PLAN_INFO[plan];
  const IconComponent = planInfo.icon;
  const monthlyPrice = plan === 'pro' ? 49 : 149;
  const price = cycle === 'annual' ? Math.floor(monthlyPrice * 12 * 0.85) : monthlyPrice;
  const period = cycle === 'annual' ? 'year' : 'month';

  const handlePayment = async () => {
    if (paymentMethod === 'card') {
      if (!cardNumber || !cardName || !expiry || !cvv) {
        Alert.alert('Error', 'Please fill in all card details');
        return;
      }
    }

    setLoading(true);
    // Simulate payment processing
    setTimeout(() => {
      setLoading(false);
      Alert.alert('Success', 'Payment processed successfully!', [
        {
          text: 'OK',
          onPress: () => router.replace('/(tabs)/profile'),
        },
      ]);
    }, 2000);
  };

  const formatCardNumber = (text: string) => {
    const cleaned = text.replace(/\s/g, '');
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
    return formatted.slice(0, 19);
  };

  const formatExpiry = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
    }
    return cleaned;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.7}>
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Payment</Text>
        </View>

        <LinearGradient colors={GRADIENTS.primary} style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <View style={[styles.planIcon, { backgroundColor: `${planInfo.color}20` }]}>
              <IconComponent size={24} color={planInfo.color} strokeWidth={2} />
            </View>
            <View style={styles.summaryInfo}>
              <Text style={styles.summaryPlan}>{planInfo.name} Plan</Text>
              <Text style={styles.summaryPeriod}>
                {cycle === 'annual' ? 'Annual billing' : 'Monthly billing'}
              </Text>
            </View>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Total Amount</Text>
            <View style={styles.priceContainer}>
              <Text style={styles.currency}>$</Text>
              <Text style={styles.price}>{price}</Text>
              <Text style={styles.period}>/{period}</Text>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          <View style={styles.paymentMethods}>
            {PAYMENT_METHODS.map((method) => {
              const MethodIcon = method.icon;
              const isSelected = paymentMethod === method.id;
              return (
                <TouchableOpacity
                  key={method.id}
                  style={[
                    styles.paymentMethodCard,
                    isSelected && styles.paymentMethodSelected,
                  ]}
                  onPress={() => setPaymentMethod(method.id)}
                  activeOpacity={0.7}>
                  <View
                    style={[
                      styles.paymentMethodIcon,
                      isSelected && { backgroundColor: `${COLORS.primary}15` },
                    ]}>
                    <MethodIcon
                      size={20}
                      color={isSelected ? COLORS.primary : COLORS.textSecondary}
                      strokeWidth={2}
                    />
                  </View>
                  <Text
                    style={[
                      styles.paymentMethodText,
                      isSelected && styles.paymentMethodTextActive,
                    ]}>
                    {method.name}
                  </Text>
                  {isSelected && (
                    <View style={styles.selectedCheck}>
                      <Check size={16} color={COLORS.primary} strokeWidth={3} />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {paymentMethod === 'card' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Card Details</Text>
            <View style={styles.cardInputContainer}>
              <Text style={styles.inputLabel}>Card Number</Text>
              <View style={styles.cardInputWrapper}>
                <CreditCard size={20} color={COLORS.textSecondary} strokeWidth={2} />
                <TextInput
                  style={styles.cardInput}
                  placeholder="1234 5678 9012 3456"
                  placeholderTextColor={COLORS.textSecondary}
                  value={cardNumber}
                  onChangeText={(text) => setCardNumber(formatCardNumber(text))}
                  keyboardType="numeric"
                  maxLength={19}
                />
              </View>
            </View>

            <View style={styles.cardInputContainer}>
              <Text style={styles.inputLabel}>Cardholder Name</Text>
              <TextInput
                style={styles.textInput}
                placeholder="John Doe"
                placeholderTextColor={COLORS.textSecondary}
                value={cardName}
                onChangeText={setCardName}
                autoCapitalize="words"
              />
            </View>

            <View style={styles.cardRow}>
              <View style={[styles.cardInputContainer, { flex: 1 }]}>
                <Text style={styles.inputLabel}>Expiry Date</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="MM/YY"
                  placeholderTextColor={COLORS.textSecondary}
                  value={expiry}
                  onChangeText={(text) => setExpiry(formatExpiry(text))}
                  keyboardType="numeric"
                  maxLength={5}
                />
              </View>
              <View style={[styles.cardInputContainer, { flex: 1 }]}>
                <Text style={styles.inputLabel}>CVV</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="123"
                  placeholderTextColor={COLORS.textSecondary}
                  value={cvv}
                  onChangeText={(text) => setCvv(text.replace(/\D/g, '').slice(0, 3))}
                  keyboardType="numeric"
                  maxLength={3}
                  secureTextEntry
                />
              </View>
            </View>
          </View>
        )}

        {(paymentMethod === 'upi' || paymentMethod === 'netbanking') && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {paymentMethod === 'upi' ? 'UPI ID' : 'Select Bank'}
            </Text>
            <TextInput
              style={styles.textInput}
              placeholder={
                paymentMethod === 'upi' ? 'yourname@upi' : 'Select your bank'
              }
              placeholderTextColor={COLORS.textSecondary}
            />
          </View>
        )}

        <View style={styles.securitySection}>
          <ShieldCheck size={20} color={COLORS.primary} strokeWidth={2} />
          <View style={styles.securityTextContainer}>
            <Text style={styles.securityTitle}>Secure Payment</Text>
            <Text style={styles.securityText}>
              Your payment is processed securely via Razorpay and Stripe. We never store your card
              details.
            </Text>
          </View>
        </View>

        <View style={styles.termsSection}>
          <Text style={styles.termsText}>
            By proceeding, you agree to our Terms of Service and Privacy Policy. Your subscription
            will auto-renew unless cancelled.
          </Text>
        </View>

        <Button
          title={`Pay $${price}/${period}`}
          onPress={handlePayment}
          loading={loading}
          style={styles.payButton}
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
    paddingBottom: SPACING.xxl,
    gap: SPACING.xl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  backButton: {
    padding: SPACING.xs,
  },
  backText: {
    ...TYPOGRAPHY.bodyStrong,
    color: COLORS.primary,
  },
  headerTitle: {
    ...TYPOGRAPHY.heading,
    fontFamily: FONT_FAMILY.displayMedium,
    color: COLORS.text,
  },
  summaryCard: {
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    ...SHADOWS.md,
    gap: SPACING.lg,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  planIcon: {
    width: 56,
    height: 56,
    borderRadius: BORDER_RADIUS.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  summaryInfo: {
    flex: 1,
  },
  summaryPlan: {
    fontFamily: FONT_FAMILY.displayMedium,
    fontSize: FONT_SIZES.xl,
    color: COLORS.background,
    marginBottom: SPACING.xs / 2,
  },
  summaryPeriod: {
    ...TYPOGRAPHY.body,
    color: 'rgba(255,255,255,0.85)',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.2)',
  },
  priceLabel: {
    ...TYPOGRAPHY.body,
    color: 'rgba(255,255,255,0.85)',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 2,
  },
  currency: {
    fontFamily: FONT_FAMILY.displayMedium,
    fontSize: FONT_SIZES.lg,
    color: COLORS.background,
  },
  price: {
    fontFamily: FONT_FAMILY.displayBold,
    fontSize: 36,
    color: COLORS.background,
    lineHeight: 44,
  },
  period: {
    ...TYPOGRAPHY.body,
    color: 'rgba(255,255,255,0.85)',
    marginLeft: 2,
  },
  section: {
    gap: SPACING.md,
  },
  sectionTitle: {
    ...TYPOGRAPHY.title,
    fontFamily: FONT_FAMILY.displayMedium,
    color: COLORS.text,
  },
  paymentMethods: {
    gap: SPACING.md,
  },
  paymentMethodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 2,
    borderColor: COLORS.border,
    gap: SPACING.md,
  },
  paymentMethodSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight,
  },
  paymentMethodIcon: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.sm,
    backgroundColor: COLORS.inputBackground,
    justifyContent: 'center',
    alignItems: 'center',
  },
  paymentMethodText: {
    ...TYPOGRAPHY.body,
    flex: 1,
    color: COLORS.text,
  },
  paymentMethodTextActive: {
    fontFamily: FONT_FAMILY.bodyBold,
    color: COLORS.primary,
  },
  selectedCheck: {
    width: 24,
    height: 24,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardInputContainer: {
    gap: SPACING.xs,
  },
  inputLabel: {
    ...TYPOGRAPHY.caption,
    fontFamily: FONT_FAMILY.bodyMedium,
    color: COLORS.text,
  },
  cardInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    height: 52,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: SPACING.sm,
  },
  cardInput: {
    flex: 1,
    fontFamily: FONT_FAMILY.body,
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
  },
  textInput: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    height: 52,
    borderWidth: 1,
    borderColor: COLORS.border,
    fontFamily: FONT_FAMILY.body,
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
  },
  cardRow: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  securitySection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.md,
    padding: SPACING.lg,
    backgroundColor: COLORS.surfaceMuted,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  securityTextContainer: {
    flex: 1,
    gap: SPACING.xs / 2,
  },
  securityTitle: {
    ...TYPOGRAPHY.bodyStrong,
    fontFamily: FONT_FAMILY.bodyBold,
    color: COLORS.text,
  },
  securityText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
  },
  termsSection: {
    padding: SPACING.md,
    backgroundColor: COLORS.surfaceMuted,
    borderRadius: BORDER_RADIUS.md,
  },
  termsText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
  payButton: {
    marginTop: SPACING.md,
  },
});


