import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  FlatList,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Search, Filter, Grid3x3, List, RefreshCw, BarChart3 } from 'lucide-react-native';
import { useFundingOpportunities } from '@/hooks/useFunding';
import { OpportunityCard } from '@/components/funding/OpportunityCard';
import { OpportunityTable } from '@/components/funding/OpportunityTable';
import { FilterModal } from '@/components/funding/FilterModal';
import { OpportunityDetailsModal } from '@/components/funding/OpportunityDetailsModal';
import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, SHADOWS, FONT_FAMILY, TYPOGRAPHY, GRADIENTS } from '@/constants/theme';
import { FundingOpportunity } from '@/types/funding';

type ViewMode = 'grid' | 'table';

export default function FundingScreen() {
  const {
    opportunities,
    allOpportunities,
    loading,
    filters,
    updateFilters,
    resetFilters,
  } = useFundingOpportunities();

  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState<FundingOpportunity | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    updateFilters({ search: text });
  };

  const activeFilterCount =
    filters.industries.length +
    filters.stages.length +
    filters.statuses.length;

  const totalRaised = allOpportunities.reduce(
    (sum, opp) => sum + opp.raised_amount,
    0
  );

  const activeDeals = allOpportunities.filter((opp) => opp.status === 'active').length;

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    }
    return `$${(amount / 1000).toFixed(0)}K`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <LinearGradient colors={GRADIENTS.primary} style={styles.heroCard}>
          <View style={styles.heroHeader}>
            <View style={styles.heroIcon}>
              <BarChart3 size={24} color={COLORS.background} strokeWidth={2} />
            </View>
            <View style={styles.heroText}>
              <Text style={styles.heroTitle}>Funding Portal</Text>
              <Text style={styles.heroSubtitle}>Discover investment opportunities</Text>
            </View>
            <TouchableOpacity style={styles.refreshButton} onPress={() => {}}>
              <RefreshCw size={18} color={COLORS.background} strokeWidth={2} />
            </TouchableOpacity>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{allOpportunities.length}</Text>
              <Text style={styles.statLabel}>Total Deals</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{activeDeals}</Text>
              <Text style={styles.statLabel}>Active</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{formatCurrency(totalRaised)}</Text>
              <Text style={styles.statLabel}>Total Raised</Text>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.controls}>
          <View style={styles.searchContainer}>
            <Search size={20} color={COLORS.textSecondary} strokeWidth={2} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search companies, industries..."
              placeholderTextColor={COLORS.textSecondary}
              value={searchQuery}
              onChangeText={handleSearch}
            />
          </View>

          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.filterButton}
              onPress={() => setFilterModalVisible(true)}
              activeOpacity={0.7}>
              <Filter size={18} color={COLORS.primary} strokeWidth={2} />
              {activeFilterCount > 0 && (
                <View style={styles.filterBadge}>
                  <Text style={styles.filterBadgeText}>{activeFilterCount}</Text>
                </View>
              )}
            </TouchableOpacity>

            <View style={styles.viewToggle}>
              <TouchableOpacity
                style={[styles.viewButton, viewMode === 'grid' && styles.viewButtonActive]}
                onPress={() => setViewMode('grid')}
                activeOpacity={0.7}>
                <Grid3x3
                  size={18}
                  color={viewMode === 'grid' ? COLORS.background : COLORS.textSecondary}
                  strokeWidth={2}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.viewButton, viewMode === 'table' && styles.viewButtonActive]}
                onPress={() => setViewMode('table')}
                activeOpacity={0.7}>
                <List
                  size={18}
                  color={viewMode === 'table' ? COLORS.background : COLORS.textSecondary}
                  strokeWidth={2}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {activeFilterCount > 0 && (
          <View style={styles.activeFilters}>
            <Text style={styles.activeFiltersText}>
              {activeFilterCount} filter{activeFilterCount > 1 ? 's' : ''} applied
            </Text>
            <TouchableOpacity onPress={resetFilters}>
              <Text style={styles.clearFiltersText}>Clear All</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading opportunities...</Text>
        </View>
      ) : opportunities.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>No opportunities found</Text>
          <Text style={styles.emptyText}>
            Try adjusting your filters or search criteria
          </Text>
          {activeFilterCount > 0 && (
            <TouchableOpacity style={styles.resetButton} onPress={resetFilters}>
              <Text style={styles.resetButtonText}>Reset Filters</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : viewMode === 'grid' ? (
        <FlatList
          data={opportunities}
          renderItem={({ item }) => (
            <OpportunityCard
              opportunity={item}
              onPress={() => setSelectedOpportunity(item)}
            />
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.gridContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.tableContainer}>
          <OpportunityTable
            opportunities={opportunities}
            onPress={(opportunity) => setSelectedOpportunity(opportunity)}
          />
        </View>
      )}

      <FilterModal
        visible={filterModalVisible}
        filters={filters}
        onApply={updateFilters}
        onReset={resetFilters}
        onClose={() => setFilterModalVisible(false)}
      />

      <OpportunityDetailsModal
        visible={selectedOpportunity !== null}
        opportunity={selectedOpportunity}
        onClose={() => setSelectedOpportunity(null)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 0,
  },
  scrollContent: {
    padding: SPACING.lg,
    gap: SPACING.lg,
  },
  heroCard: {
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    ...SHADOWS.md,
    gap: SPACING.lg,
  },
  heroHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  heroIcon: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.md,
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
  refreshButton: {
    width: 44,
    height: 44,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.12)',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  statValue: {
    fontFamily: FONT_FAMILY.displayMedium,
    fontSize: FONT_SIZES.xl,
    color: COLORS.background,
    marginBottom: SPACING.xs / 2,
  },
  statLabel: {
    ...TYPOGRAPHY.caption,
    color: 'rgba(255,255,255,0.75)',
  },
  controls: {
    gap: SPACING.md,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    height: 52,
    gap: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.xs,
  },
  searchInput: {
    flex: 1,
    fontFamily: FONT_FAMILY.body,
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  filterButton: {
    width: 52,
    height: 52,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  filterBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    minWidth: 20,
    height: 20,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.error,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
    borderWidth: 2,
    borderColor: COLORS.background,
  },
  filterBadgeText: {
    fontSize: 10,
    fontFamily: FONT_FAMILY.bodyBold,
    color: COLORS.background,
  },
  viewToggle: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: 2,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.xs,
  },
  viewButton: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: BORDER_RADIUS.sm,
  },
  viewButtonActive: {
    backgroundColor: COLORS.primary,
  },
  activeFilters: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.md,
    backgroundColor: COLORS.primaryLight,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  activeFiltersText: {
    ...TYPOGRAPHY.body,
    fontFamily: FONT_FAMILY.bodyMedium,
    color: COLORS.text,
  },
  clearFiltersText: {
    ...TYPOGRAPHY.bodyStrong,
    color: COLORS.primary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  loadingText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    marginTop: SPACING.md,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  emptyTitle: {
    ...TYPOGRAPHY.title,
    fontFamily: FONT_FAMILY.displayMedium,
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  emptyText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  resetButton: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.md,
    ...SHADOWS.sm,
  },
  resetButtonText: {
    fontFamily: FONT_FAMILY.bodyBold,
    fontSize: FONT_SIZES.md,
    color: COLORS.background,
  },
  gridContent: {
    padding: SPACING.lg,
  },
  tableContainer: {
    flex: 1,
    padding: SPACING.lg,
  },
});
