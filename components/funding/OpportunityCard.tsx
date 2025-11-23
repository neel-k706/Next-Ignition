import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Building2, BarChart3, UsersRound, Clock, MapPin } from 'lucide-react-native';
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS, BORDER_RADIUS, SHADOWS } from '@/constants/theme';
import { FundingOpportunity } from '@/types/funding';

interface OpportunityCardProps {
  opportunity: FundingOpportunity;
  onPress: () => void;
}

export function OpportunityCard({ opportunity, onPress }: OpportunityCardProps) {
  const progressPercentage = (opportunity.raised_amount / opportunity.target_amount) * 100;
  const daysLeft = Math.ceil(
    (new Date(opportunity.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );

  const getStatusColor = () => {
    switch (opportunity.status) {
      case 'active':
        return COLORS.success;
      case 'funded':
        return COLORS.primary;
      case 'closed':
        return COLORS.textSecondary;
      default:
        return COLORS.textSecondary;
    }
  };

  const getStageLabel = () => {
    return opportunity.stage
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    }
    return `$${(amount / 1000).toFixed(0)}K`;
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      {opportunity.images && opportunity.images.length > 0 && (
        <Image source={{ uri: opportunity.images[0] }} style={styles.image} />
      )}

      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.companyName} numberOfLines={1}>
              {opportunity.company_name}
            </Text>
            <View style={styles.badges}>
              <View style={styles.stageBadge}>
                <Text style={styles.stageBadgeText}>{getStageLabel()}</Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor()}20` }]}>
                <View style={[styles.statusDot, { backgroundColor: getStatusColor() }]} />
                <Text style={[styles.statusText, { color: getStatusColor() }]}>
                  {opportunity.status.charAt(0).toUpperCase() + opportunity.status.slice(1)}
                </Text>
              </View>
            </View>
          </View>
          {opportunity.status === 'active' && (
            <View style={styles.deadlineBadge}>
              <Clock size={12} color={daysLeft <= 7 ? COLORS.error : COLORS.textSecondary} />
              <Text
                style={[
                  styles.deadlineText,
                  { color: daysLeft <= 7 ? COLORS.error : COLORS.textSecondary },
                ]}>
                {daysLeft}d left
              </Text>
            </View>
          )}
        </View>

        <Text style={styles.tagline} numberOfLines={2}>
          {opportunity.tagline}
        </Text>

        <View style={styles.stats}>
          <View style={styles.statItem}>
            <Building2 size={14} color={COLORS.textSecondary} />
            <Text style={styles.statText}>{opportunity.industry.toUpperCase()}</Text>
          </View>
          <View style={styles.statItem}>
            <MapPin size={14} color={COLORS.textSecondary} />
            <Text style={styles.statText}>{opportunity.location}</Text>
          </View>
          <View style={styles.statItem}>
            <UsersRound size={14} color={COLORS.textSecondary} strokeWidth={2} />
            <Text style={styles.statText}>{opportunity.team_size} team</Text>
          </View>
        </View>

        <View style={styles.fundingInfo}>
          <View style={styles.fundingHeader}>
            <View>
              <Text style={styles.fundingLabel}>Target</Text>
              <Text style={styles.fundingAmount}>{formatCurrency(opportunity.target_amount)}</Text>
            </View>
            <View style={styles.fundingRight}>
              <Text style={styles.fundingLabel}>Raised</Text>
              <Text style={[styles.fundingAmount, { color: COLORS.primary }]}>
                {formatCurrency(opportunity.raised_amount)}
              </Text>
            </View>
          </View>

          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${Math.min(progressPercentage, 100)}%` }]} />
          </View>
          <Text style={styles.progressText}>{progressPercentage.toFixed(0)}% funded</Text>
        </View>

        <View style={styles.footer}>
          <View style={styles.valuationInfo}>
            <BarChart3 size={14} color={COLORS.primary} strokeWidth={2} />
            <Text style={styles.valuationText}>
              Valuation: {formatCurrency(opportunity.valuation)}
            </Text>
          </View>
          <View style={styles.growthBadge}>
            <Text style={styles.growthText}>+{opportunity.growth_rate}% YoY</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.md,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  image: {
    width: '100%',
    height: 180,
    backgroundColor: COLORS.inputBackground,
  },
  content: {
    padding: SPACING.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.sm,
  },
  headerLeft: {
    flex: 1,
  },
  companyName: {
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  badges: {
    flexDirection: 'row',
    gap: SPACING.xs,
    flexWrap: 'wrap',
  },
  stageBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs / 2,
    backgroundColor: `${COLORS.primary}10`,
    borderRadius: 4,
  },
  stageBadgeText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.primary,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs / 2,
    borderRadius: 4,
    gap: SPACING.xs / 2,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: BORDER_RADIUS.full,
  },
  statusText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: FONT_WEIGHTS.bold,
  },
  deadlineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs / 2,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs / 2,
    backgroundColor: COLORS.inputBackground,
    borderRadius: 4,
  },
  deadlineText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: FONT_WEIGHTS.bold,
  },
  tagline: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    lineHeight: 20,
    marginBottom: SPACING.md,
  },
  stats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
    marginBottom: SPACING.md,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs / 2,
  },
  statText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
    fontWeight: FONT_WEIGHTS.medium,
  },
  fundingInfo: {
    backgroundColor: `${COLORS.primary}05`,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.sm,
    marginBottom: SPACING.md,
    borderWidth: 0.5,
    borderColor: `${COLORS.primary}10`,
  },
  fundingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  fundingRight: {
    alignItems: 'flex-end',
  },
  fundingLabel: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs / 2,
  },
  fundingAmount: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.text,
  },
  progressBar: {
    height: 5,
    backgroundColor: COLORS.border,
    borderRadius: BORDER_RADIUS.full,
    overflow: 'hidden',
    marginBottom: SPACING.xs,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.full,
  },
  progressText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  valuationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs / 2,
  },
  valuationText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.medium,
    color: COLORS.text,
  },
  growthBadge: {
    backgroundColor: `${COLORS.success}12`,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs / 2,
    borderRadius: 4,
  },
  growthText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.success,
  },
});
