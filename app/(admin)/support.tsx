import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
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
  HelpCircle,
  Bug,
  AlertCircle,
  Lightbulb,
  CheckCircle,
  Clock,
  UserRound,
  MessageSquare,
  Filter,
  Search,
  Send,
} from 'lucide-react-native';
import { Button } from '@/components/Button';
import { useResponsive } from '@/hooks/useResponsive';
import { AnimatedCard } from '@/components/admin/AnimatedCard';

type TicketType = 'bug' | 'auth' | 'feature' | 'other';
type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed';

interface Ticket {
  id: string;
  type: TicketType;
  status: TicketStatus;
  title: string;
  description: string;
  user: string;
  userEmail: string;
  createdAt: string;
  assignedTo?: string;
  priority: 'low' | 'medium' | 'high';
}

const TICKETS: Ticket[] = [
  {
    id: '1',
    type: 'bug',
    status: 'open',
    title: 'Login page not loading on mobile',
    description: 'Users report that the login page fails to load on iOS devices',
    user: 'John Smith',
    userEmail: 'john@example.com',
    createdAt: '2024-01-20T10:00:00Z',
    priority: 'high',
  },
  {
    id: '2',
    type: 'auth',
    status: 'in_progress',
    title: 'Password reset email not received',
    description: 'Multiple users unable to receive password reset emails',
    user: 'Sarah Johnson',
    userEmail: 'sarah@example.com',
    createdAt: '2024-01-19T14:30:00Z',
    assignedTo: 'Admin Team',
    priority: 'high',
  },
  {
    id: '3',
    type: 'feature',
    status: 'open',
    title: 'Request: Add dark mode support',
    description: 'Users requesting dark mode theme option',
    user: 'Michael Chen',
    userEmail: 'michael@example.com',
    createdAt: '2024-01-18T09:15:00Z',
    priority: 'low',
  },
];

const getTypeIcon = (type: TicketType) => {
  switch (type) {
    case 'bug':
      return Bug;
    case 'auth':
      return AlertCircle;
    case 'feature':
      return Lightbulb;
    default:
      return HelpCircle;
  }
};

const getTypeColor = (type: TicketType) => {
  switch (type) {
    case 'bug':
      return COLORS.error;
    case 'auth':
      return COLORS.warning;
    case 'feature':
      return COLORS.primary;
    default:
      return COLORS.textSecondary;
  }
};

const getStatusColor = (status: TicketStatus) => {
  switch (status) {
    case 'open':
      return COLORS.warning;
    case 'in_progress':
      return COLORS.primary;
    case 'resolved':
      return COLORS.success;
    case 'closed':
      return COLORS.textSecondary;
    default:
      return COLORS.textSecondary;
  }
};

export default function SupportScreen() {
  const [tickets, setTickets] = useState(TICKETS);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<TicketStatus | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<TicketType | 'all'>('all');
  const [refreshing, setRefreshing] = useState(false);
  const { isMobile } = useResponsive();

  const filteredTickets = useMemo(() => {
    return tickets.filter((ticket) => {
      const matchesSearch =
        ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.user.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
      const matchesType = typeFilter === 'all' || ticket.type === typeFilter;
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [tickets, searchQuery, statusFilter, typeFilter]);

  const onRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleStatusChange = (id: string, newStatus: TicketStatus) => {
    setTickets(tickets.map((t) => (t.id === id ? { ...t, status: newStatus } : t)));
  };

  const formatTimeAgo = (isoString: string) => {
    const date = new Date(isoString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return 'just now';
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />
        }>
        <LinearGradient colors={GRADIENTS.accent} style={styles.heroCard}>
          <View style={styles.heroHeader}>
            <View style={styles.heroIcon}>
              <HelpCircle size={28} color={COLORS.background} strokeWidth={2} />
            </View>
            <View style={styles.heroText}>
              <Text style={styles.heroTitle}>Support & Issue Handling</Text>
              <Text style={styles.heroSubtitle}>
                Manage support tickets and user issues
              </Text>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.controls}>
          <View style={styles.searchContainer}>
            <Search size={20} color={COLORS.textSecondary} strokeWidth={2} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search tickets..."
              placeholderTextColor={COLORS.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          <View style={styles.filtersRow}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.statusFilters}>
              {['all', 'open', 'in_progress', 'resolved', 'closed'].map((status) => (
                <TouchableOpacity
                  key={status}
                  style={[
                    styles.filterChip,
                    statusFilter === status && styles.filterChipActive,
                  ]}
                  onPress={() => setStatusFilter(status as TicketStatus | 'all')}
                  activeOpacity={0.7}>
                  <Text
                    style={[
                      styles.filterChipText,
                      statusFilter === status && styles.filterChipTextActive,
                    ]}>
                    {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.filtersRow}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.typeFilters}>
              {['all', 'bug', 'auth', 'feature', 'other'].map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.filterChip,
                    typeFilter === type && styles.filterChipActive,
                  ]}
                  onPress={() => setTypeFilter(type as TicketType | 'all')}
                  activeOpacity={0.7}>
                  <Text
                    style={[
                      styles.filterChipText,
                      typeFilter === type && styles.filterChipTextActive,
                    ]}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {filteredTickets.length} Ticket{filteredTickets.length !== 1 ? 's' : ''}
          </Text>
          <View style={styles.ticketsList}>
            {filteredTickets.map((ticket, index) => {
              const TypeIcon = getTypeIcon(ticket.type);
              return (
                <AnimatedCard key={ticket.id} delay={index * 50}>
                  <View style={styles.ticketCard}>
                    <View style={styles.ticketHeader}>
                      <View style={[styles.ticketTypeIcon, { backgroundColor: `${getTypeColor(ticket.type)}15` }]}>
                        <TypeIcon size={20} color={getTypeColor(ticket.type)} strokeWidth={2} />
                      </View>
                      <View style={styles.ticketInfo}>
                        <Text style={styles.ticketTitle}>{ticket.title}</Text>
                        <View style={styles.ticketMeta}>
                          <UserRound size={14} color={COLORS.textSecondary} strokeWidth={2} />
                          <Text style={styles.ticketMetaText}>{ticket.user}</Text>
                          <View style={styles.metaDivider} />
                          <Clock size={14} color={COLORS.textSecondary} strokeWidth={2} />
                          <Text style={styles.ticketMetaText}>{formatTimeAgo(ticket.createdAt)}</Text>
                        </View>
                      </View>
                      <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(ticket.status)}20` }]}>
                        <Text style={[styles.statusText, { color: getStatusColor(ticket.status) }]}>
                          {ticket.status.replace('_', ' ').toUpperCase()}
                        </Text>
                      </View>
                    </View>

                    <Text style={styles.ticketDescription}>{ticket.description}</Text>

                    <View style={styles.ticketFooter}>
                      <View style={styles.ticketDetails}>
                        <View style={[styles.priorityBadge, ticket.priority === 'high' && styles.priorityHigh]}>
                          <Text style={styles.priorityText}>{ticket.priority.toUpperCase()}</Text>
                        </View>
                        {ticket.assignedTo && (
                          <Text style={styles.assignedText}>Assigned to: {ticket.assignedTo}</Text>
                        )}
                      </View>
                      <View style={styles.ticketActions}>
                        {ticket.status === 'open' && (
                          <Button
                            title="Assign"
                            onPress={() => handleStatusChange(ticket.id, 'in_progress')}
                            variant="outline"
                            style={styles.actionButton}
                          />
                        )}
                        {ticket.status === 'in_progress' && (
                          <>
                            <Button
                              title="Resolve"
                              onPress={() => handleStatusChange(ticket.id, 'resolved')}
                              variant="primary"
                              style={styles.actionButton}
                            />
                            <TouchableOpacity
                              style={styles.messageButton}
                              onPress={() => alert('Open conversation')}
                              activeOpacity={0.7}>
                              <MessageSquare size={18} color={COLORS.primary} strokeWidth={2} />
                            </TouchableOpacity>
                          </>
                        )}
                        {ticket.status === 'resolved' && (
                          <View style={styles.resolvedBadge}>
                            <CheckCircle size={16} color={COLORS.success} strokeWidth={2} />
                            <Text style={styles.resolvedText}>Resolved</Text>
                          </View>
                        )}
                      </View>
                    </View>
                  </View>
                </AnimatedCard>
              );
            })}
          </View>
        </View>
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
  controls: {
    gap: SPACING.md,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.inputBackground,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    height: 48,
    gap: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchInput: {
    flex: 1,
    ...TYPOGRAPHY.body,
    color: COLORS.text,
  },
  filtersRow: {
    marginBottom: SPACING.sm,
  },
  statusFilters: {
    flexGrow: 0,
  },
  typeFilters: {
    flexGrow: 0,
  },
  filterChip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.surfaceMuted,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: SPACING.sm,
  },
  filterChipActive: {
    backgroundColor: COLORS.primaryLight,
    borderColor: COLORS.primary,
  },
  filterChipText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    fontFamily: FONT_FAMILY.bodyMedium,
  },
  filterChipTextActive: {
    color: COLORS.primary,
    fontFamily: FONT_FAMILY.bodyBold,
  },
  section: {
    gap: SPACING.md,
  },
  sectionTitle: {
    ...TYPOGRAPHY.title,
    fontFamily: FONT_FAMILY.displayMedium,
    color: COLORS.text,
  },
  ticketsList: {
    gap: SPACING.md,
  },
  ticketCard: {
    padding: SPACING.lg,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
    gap: SPACING.md,
  },
  ticketHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.md,
  },
  ticketTypeIcon: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ticketInfo: {
    flex: 1,
  },
  ticketTitle: {
    ...TYPOGRAPHY.title,
    fontFamily: FONT_FAMILY.displayMedium,
    color: COLORS.text,
    marginBottom: SPACING.xs / 2,
  },
  ticketMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs / 2,
    flexWrap: 'wrap',
  },
  ticketMetaText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
  },
  metaDivider: {
    width: 1,
    height: 12,
    backgroundColor: COLORS.border,
    marginHorizontal: SPACING.xs,
  },
  statusBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs / 2,
    borderRadius: BORDER_RADIUS.full,
  },
  statusText: {
    ...TYPOGRAPHY.label,
    fontSize: FONT_SIZES.xs,
    fontFamily: FONT_FAMILY.bodyBold,
  },
  ticketDescription: {
    ...TYPOGRAPHY.body,
    color: COLORS.text,
    lineHeight: 22,
  },
  ticketFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  ticketDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    flex: 1,
  },
  priorityBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs / 2,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.warning + '20',
  },
  priorityHigh: {
    backgroundColor: COLORS.error + '20',
  },
  priorityText: {
    ...TYPOGRAPHY.label,
    fontSize: FONT_SIZES.xs,
    color: COLORS.warning,
    fontFamily: FONT_FAMILY.bodyBold,
  },
  assignedText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
  },
  ticketActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  actionButton: {
    minWidth: 100,
  },
  messageButton: {
    padding: SPACING.sm,
    backgroundColor: COLORS.primaryLight,
    borderRadius: BORDER_RADIUS.md,
  },
  resolvedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs / 2,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs / 2,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.success + '20',
  },
  resolvedText: {
    ...TYPOGRAPHY.label,
    fontSize: FONT_SIZES.xs,
    color: COLORS.success,
    fontFamily: FONT_FAMILY.bodyBold,
  },
});

