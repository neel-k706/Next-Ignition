import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { BarChart3, MapPin } from 'lucide-react-native';
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS, BORDER_RADIUS } from '@/constants/theme';
import { FundingOpportunity } from '@/types/funding';

interface OpportunityTableProps {
  opportunities: FundingOpportunity[];
  onPress: (opportunity: FundingOpportunity) => void;
}

export function OpportunityTable({ opportunities, onPress }: OpportunityTableProps) {
  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    }
    return `$${(amount / 1000).toFixed(0)}K`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
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

  const getStageLabel = (stage: string) => {
    return stage
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <View style={[styles.cell, styles.companyCell]}>
            <Text style={styles.headerText}>Company</Text>
          </View>
          <View style={[styles.cell, styles.standardCell]}>
            <Text style={styles.headerText}>Stage</Text>
          </View>
          <View style={[styles.cell, styles.standardCell]}>
            <Text style={styles.headerText}>Industry</Text>
          </View>
          <View style={[styles.cell, styles.standardCell]}>
            <Text style={styles.headerText}>Target</Text>
          </View>
          <View style={[styles.cell, styles.standardCell]}>
            <Text style={styles.headerText}>Raised</Text>
          </View>
          <View style={[styles.cell, styles.standardCell]}>
            <Text style={styles.headerText}>Progress</Text>
          </View>
          <View style={[styles.cell, styles.standardCell]}>
            <Text style={styles.headerText}>Valuation</Text>
          </View>
          <View style={[styles.cell, styles.standardCell]}>
            <Text style={styles.headerText}>Growth</Text>
          </View>
          <View style={[styles.cell, styles.statusCell]}>
            <Text style={styles.headerText}>Status</Text>
          </View>
        </View>

        {opportunities.map((opportunity) => {
          const progressPercentage = (opportunity.raised_amount / opportunity.target_amount) * 100;

          return (
            <TouchableOpacity
              key={opportunity.id}
              style={styles.row}
              onPress={() => onPress(opportunity)}
              activeOpacity={0.7}>
              <View style={[styles.cell, styles.companyCell]}>
                <Text style={styles.companyName} numberOfLines={1}>
                  {opportunity.company_name}
                </Text>
                <Text style={styles.tagline} numberOfLines={1}>
                  {opportunity.tagline}
                </Text>
                <View style={styles.locationRow}>
                  <MapPin size={12} color={COLORS.textSecondary} />
                  <Text style={styles.locationText}>{opportunity.location}</Text>
                </View>
              </View>

              <View style={[styles.cell, styles.standardCell]}>
                <View style={styles.stageBadge}>
                  <Text style={styles.stageBadgeText}>{getStageLabel(opportunity.stage)}</Text>
                </View>
              </View>

              <View style={[styles.cell, styles.standardCell]}>
                <Text style={styles.industryText}>{opportunity.industry.toUpperCase()}</Text>
              </View>

              <View style={[styles.cell, styles.standardCell]}>
                <Text style={styles.amountText}>{formatCurrency(opportunity.target_amount)}</Text>
              </View>

              <View style={[styles.cell, styles.standardCell]}>
                <Text style={[styles.amountText, { color: COLORS.primary }]}>
                  {formatCurrency(opportunity.raised_amount)}
                </Text>
              </View>

              <View style={[styles.cell, styles.standardCell]}>
                <View style={styles.progressContainer}>
                  <View style={styles.progressBar}>
                    <View
                      style={[
                        styles.progressFill,
                        { width: `${Math.min(progressPercentage, 100)}%` },
                      ]}
                    />
                  </View>
                  <Text style={styles.progressText}>{progressPercentage.toFixed(0)}%</Text>
                </View>
              </View>

              <View style={[styles.cell, styles.standardCell]}>
                <Text style={styles.valuationText}>{formatCurrency(opportunity.valuation)}</Text>
              </View>

              <View style={[styles.cell, styles.standardCell]}>
                <View style={styles.growthBadge}>
                  <BarChart3 size={12} color={COLORS.success} strokeWidth={2} />
                  <Text style={styles.growthText}>+{opportunity.growth_rate}%</Text>
                </View>
              </View>

              <View style={[styles.cell, styles.statusCell]}>
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: `${getStatusColor(opportunity.status)}20` },
                  ]}>
                  <View
                    style={[styles.statusDot, { backgroundColor: getStatusColor(opportunity.status) }]}
                  />
                  <Text style={[styles.statusText, { color: getStatusColor(opportunity.status) }]}>
                    {opportunity.status.charAt(0).toUpperCase() + opportunity.status.slice(1)}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    minWidth: 1200,
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: COLORS.inputBackground,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.border,
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.background,
  },
  cell: {
    padding: SPACING.md,
    justifyContent: 'center',
  },
  companyCell: {
    width: 280,
  },
  standardCell: {
    width: 140,
  },
  statusCell: {
    width: 120,
  },
  headerText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.text,
  },
  companyName: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.text,
    marginBottom: SPACING.xs / 2,
  },
  tagline: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs / 2,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs / 2,
  },
  locationText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
  },
  stageBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs / 2,
    backgroundColor: `${COLORS.primary}15`,
    borderRadius: BORDER_RADIUS.sm,
    alignSelf: 'flex-start',
  },
  stageBadgeText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.primary,
  },
  industryText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.medium,
    color: COLORS.text,
  },
  amountText: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.text,
  },
  progressContainer: {
    width: '100%',
  },
  progressBar: {
    height: 6,
    backgroundColor: COLORS.border,
    borderRadius: BORDER_RADIUS.full,
    overflow: 'hidden',
    marginBottom: SPACING.xs / 2,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
  },
  progressText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  valuationText: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.medium,
    color: COLORS.text,
  },
  growthBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs / 2,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs / 2,
    backgroundColor: `${COLORS.success}15`,
    borderRadius: BORDER_RADIUS.sm,
    alignSelf: 'flex-start',
  },
  growthText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.success,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs / 2,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs / 2,
    borderRadius: BORDER_RADIUS.sm,
    alignSelf: 'flex-start',
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
});
