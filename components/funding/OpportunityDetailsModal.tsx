import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import {
  X,
  Building2,
  MapPin,
  Users,
  Calendar,
  BarChart3,
  FileText,
  ExternalLink,
  DollarSign,
  Target,
  Award,
  Download,
} from 'lucide-react-native';
import { Button } from '@/components/Button';
import { COLORS, SPACING, FONT_SIZES, FONT_WEIGHTS, BORDER_RADIUS } from '@/constants/theme';
import { FundingOpportunity } from '@/types/funding';

interface OpportunityDetailsModalProps {
  visible: boolean;
  opportunity: FundingOpportunity | null;
  onClose: () => void;
}

export function OpportunityDetailsModal({
  visible,
  opportunity,
  onClose,
}: OpportunityDetailsModalProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'details' | 'documents'>('overview');

  if (!opportunity) return null;

  const progressPercentage = (opportunity.raised_amount / opportunity.target_amount) * 100;
  const daysLeft = Math.ceil(
    (new Date(opportunity.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStageLabel = () => {
    return opportunity.stage
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{opportunity.company_name}</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'overview' && styles.tabActive]}
            onPress={() => setActiveTab('overview')}>
            <Text style={[styles.tabText, activeTab === 'overview' && styles.tabTextActive]}>
              Overview
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'details' && styles.tabActive]}
            onPress={() => setActiveTab('details')}>
            <Text style={[styles.tabText, activeTab === 'details' && styles.tabTextActive]}>
              Details
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'documents' && styles.tabActive]}
            onPress={() => setActiveTab('documents')}>
            <Text style={[styles.tabText, activeTab === 'documents' && styles.tabTextActive]}>
              Documents
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {activeTab === 'overview' && (
            <View style={styles.tabContent}>
              {opportunity.images && opportunity.images.length > 0 && (
                <Image source={{ uri: opportunity.images[0] }} style={styles.heroImage} />
              )}

              <View style={styles.section}>
                <Text style={styles.tagline}>{opportunity.tagline}</Text>
                <View style={styles.metaBadges}>
                  <View style={styles.metaBadge}>
                    <Text style={styles.metaBadgeText}>{getStageLabel()}</Text>
                  </View>
                  <View style={styles.metaBadge}>
                    <Text style={styles.metaBadgeText}>
                      {opportunity.industry.toUpperCase()}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.fundingCard}>
                <View style={styles.fundingRow}>
                  <View style={styles.fundingItem}>
                    <Text style={styles.fundingLabel}>Target</Text>
                    <Text style={styles.fundingValue}>
                      {formatCurrency(opportunity.target_amount)}
                    </Text>
                  </View>
                  <View style={styles.fundingItem}>
                    <Text style={styles.fundingLabel}>Raised</Text>
                    <Text style={[styles.fundingValue, { color: COLORS.primary }]}>
                      {formatCurrency(opportunity.raised_amount)}
                    </Text>
                  </View>
                </View>
                <View style={styles.progressBar}>
                  <View
                    style={[styles.progressFill, { width: `${Math.min(progressPercentage, 100)}%` }]}
                  />
                </View>
                <Text style={styles.progressText}>{progressPercentage.toFixed(1)}% funded</Text>
                {opportunity.status === 'active' && (
                  <Text style={styles.deadlineText}>
                    {daysLeft} days remaining to invest
                  </Text>
                )}
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>About</Text>
                <Text style={styles.description}>{opportunity.description}</Text>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Key Highlights</Text>
                <View style={styles.highlightsList}>
                  {opportunity.highlights.map((highlight, index) => (
                    <View key={index} style={styles.highlightItem}>
                      <Award size={16} color={COLORS.primary} />
                      <Text style={styles.highlightText}>{highlight}</Text>
                    </View>
                  ))}
                </View>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Team</Text>
                <View style={styles.foundersList}>
                  {opportunity.founders.map((founder) => (
                    <View key={founder.id} style={styles.founderCard}>
                      <View style={styles.founderAvatar}>
                        <Users size={24} color={COLORS.primary} />
                      </View>
                      <View style={styles.founderInfo}>
                        <Text style={styles.founderName}>{founder.name}</Text>
                        <Text style={styles.founderRole}>{founder.role}</Text>
                      </View>
                      {founder.linkedin && (
                        <TouchableOpacity style={styles.linkedinButton}>
                          <ExternalLink size={16} color={COLORS.primary} />
                        </TouchableOpacity>
                      )}
                    </View>
                  ))}
                </View>
              </View>
            </View>
          )}

          {activeTab === 'details' && (
            <View style={styles.tabContent}>
              <View style={styles.detailsGrid}>
                <DetailItem
                  icon={<DollarSign size={20} color={COLORS.primary} />}
                  label="Valuation"
                  value={formatCurrency(opportunity.valuation)}
                />
                <DetailItem
                  icon={<Target size={20} color={COLORS.primary} />}
                  label="Equity Offered"
                  value={`${opportunity.equity_offered}%`}
                />
                <DetailItem
                  icon={<BarChart3 size={20} color={COLORS.primary} strokeWidth={2} />}
                  label="Revenue"
                  value={formatCurrency(opportunity.revenue)}
                />
                <DetailItem
                  icon={<BarChart3 size={20} color={COLORS.primary} strokeWidth={2} />}
                  label="Growth Rate"
                  value={`${opportunity.growth_rate}% YoY`}
                />
                <DetailItem
                  icon={<Building2 size={20} color={COLORS.primary} />}
                  label="Founded"
                  value={opportunity.founded_year.toString()}
                />
                <DetailItem
                  icon={<Users size={20} color={COLORS.primary} />}
                  label="Team Size"
                  value={opportunity.team_size.toString()}
                />
                <DetailItem
                  icon={<MapPin size={20} color={COLORS.primary} />}
                  label="Location"
                  value={opportunity.location}
                />
                <DetailItem
                  icon={<Calendar size={20} color={COLORS.primary} />}
                  label="Deadline"
                  value={new Date(opportunity.deadline).toLocaleDateString()}
                />
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Investment Range</Text>
                <View style={styles.investmentRange}>
                  <View style={styles.rangeItem}>
                    <Text style={styles.rangeLabel}>Minimum</Text>
                    <Text style={styles.rangeValue}>
                      {formatCurrency(opportunity.min_investment)}
                    </Text>
                  </View>
                  <View style={styles.rangeSeparator} />
                  <View style={styles.rangeItem}>
                    <Text style={styles.rangeLabel}>Maximum</Text>
                    <Text style={styles.rangeValue}>
                      {formatCurrency(opportunity.max_investment)}
                    </Text>
                  </View>
                </View>
              </View>

              {opportunity.metrics && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Key Metrics</Text>
                  <View style={styles.metricsGrid}>
                    {opportunity.metrics.mrr && (
                      <MetricCard label="MRR" value={formatCurrency(opportunity.metrics.mrr)} />
                    )}
                    {opportunity.metrics.arr && (
                      <MetricCard label="ARR" value={formatCurrency(opportunity.metrics.arr)} />
                    )}
                    {opportunity.metrics.users && (
                      <MetricCard
                        label="Users"
                        value={opportunity.metrics.users.toLocaleString()}
                      />
                    )}
                    {opportunity.metrics.customers && (
                      <MetricCard
                        label="Customers"
                        value={opportunity.metrics.customers.toLocaleString()}
                      />
                    )}
                  </View>
                </View>
              )}
            </View>
          )}

          {activeTab === 'documents' && (
            <View style={styles.tabContent}>
              {opportunity.pitch_deck && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Pitch Deck</Text>
                  <TouchableOpacity style={styles.documentCard}>
                    <View style={styles.documentIcon}>
                      <FileText size={24} color={COLORS.primary} />
                    </View>
                    <View style={styles.documentInfo}>
                      <Text style={styles.documentName}>{opportunity.pitch_deck.filename}</Text>
                      <Text style={styles.documentMeta}>
                        {opportunity.pitch_deck.pages} pages • PDF
                      </Text>
                    </View>
                    <Download size={20} color={COLORS.primary} />
                  </TouchableOpacity>
                </View>
              )}

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Additional Documents</Text>
                {opportunity.documents.map((doc) => (
                  <TouchableOpacity key={doc.id} style={styles.documentCard}>
                    <View style={styles.documentIcon}>
                      <FileText size={24} color={COLORS.primary} />
                    </View>
                    <View style={styles.documentInfo}>
                      <Text style={styles.documentName}>{doc.name}</Text>
                      <Text style={styles.documentMeta}>{doc.type.toUpperCase()}</Text>
                    </View>
                    <Download size={20} color={COLORS.primary} />
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </ScrollView>

        {opportunity.status === 'active' && (
          <View style={styles.footer}>
            <Button title="Express Interest" onPress={() => {}} style={styles.actionButton} />
          </View>
        )}
      </View>
    </Modal>
  );
}

function DetailItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <View style={styles.detailItem}>
      <View style={styles.detailIcon}>{icon}</View>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.metricCard}>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={styles.metricValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  closeButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.text,
  },
  placeholder: {
    width: 40,
  },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  tab: {
    flex: 1,
    paddingVertical: SPACING.md,
    alignItems: 'center',
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: COLORS.primary,
  },
  tabText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.medium,
    color: COLORS.textSecondary,
  },
  tabTextActive: {
    color: COLORS.primary,
    fontWeight: FONT_WEIGHTS.bold,
  },
  content: {
    flex: 1,
  },
  tabContent: {
    padding: SPACING.lg,
  },
  heroImage: {
    width: '100%',
    height: 200,
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: COLORS.inputBackground,
    marginBottom: SPACING.lg,
  },
  section: {
    marginBottom: SPACING.xl,
  },
  tagline: {
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  metaBadges: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  metaBadge: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    backgroundColor: `${COLORS.primary}15`,
    borderRadius: BORDER_RADIUS.sm,
  },
  metaBadgeText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.primary,
  },
  fundingCard: {
    backgroundColor: COLORS.inputBackground,
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.xl,
  },
  fundingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  fundingItem: {
    flex: 1,
  },
  fundingLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs / 2,
  },
  fundingValue: {
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.text,
  },
  progressBar: {
    height: 8,
    backgroundColor: COLORS.border,
    borderRadius: BORDER_RADIUS.full,
    overflow: 'hidden',
    marginBottom: SPACING.sm,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
  },
  progressText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.medium,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING.xs,
  },
  deadlineText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  description: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    lineHeight: 24,
  },
  highlightsList: {
    gap: SPACING.md,
  },
  highlightItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.sm,
  },
  highlightText: {
    flex: 1,
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    lineHeight: 22,
  },
  foundersList: {
    gap: SPACING.md,
  },
  founderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    backgroundColor: COLORS.inputBackground,
    borderRadius: BORDER_RADIUS.md,
  },
  founderAvatar: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: `${COLORS.primary}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  founderInfo: {
    flex: 1,
  },
  founderName: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.text,
    marginBottom: SPACING.xs / 2,
  },
  founderRole: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  linkedinButton: {
    width: 36,
    height: 36,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: `${COLORS.primary}15`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
    marginBottom: SPACING.xl,
  },
  detailItem: {
    width: '48%',
    backgroundColor: COLORS.inputBackground,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
  },
  detailIcon: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: `${COLORS.primary}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  detailLabel: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs / 2,
  },
  detailValue: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.text,
  },
  investmentRange: {
    flexDirection: 'row',
    backgroundColor: COLORS.inputBackground,
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
  },
  rangeItem: {
    flex: 1,
    alignItems: 'center',
  },
  rangeSeparator: {
    width: 1,
    backgroundColor: COLORS.border,
    marginHorizontal: SPACING.md,
  },
  rangeLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  rangeValue: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.text,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
  },
  metricCard: {
    width: '48%',
    backgroundColor: COLORS.inputBackground,
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  metricValue: {
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.primary,
  },
  documentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    backgroundColor: COLORS.inputBackground,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.sm,
  },
  documentIcon: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: `${COLORS.primary}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  documentInfo: {
    flex: 1,
  },
  documentName: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.medium,
    color: COLORS.text,
    marginBottom: SPACING.xs / 2,
  },
  documentMeta: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
  },
  footer: {
    padding: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  actionButton: {
    width: '100%',
  },
});
