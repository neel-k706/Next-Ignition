import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Image,
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
  TrendingUp,
  Users,
  Calendar,
  Award,
  Bookmark,
  Share2,
  Heart,
  MessageCircle,
  MoreVertical,
} from 'lucide-react-native';

const FEED_POSTS = [
  {
    id: '1',
    type: 'funding',
    user: 'John Smith',
    company: 'TechStart Inc',
    content: 'Just closed a $2M seed round! Excited to scale our platform.',
    timestamp: '2 hours ago',
    likes: 45,
    comments: 12,
    icon: TrendingUp,
    color: COLORS.success,
  },
  {
    id: '2',
    type: 'event',
    user: 'Sarah Johnson',
    company: 'NextIgnition',
    content: 'New webinar: "Scaling Your SaaS Startup" - Join us this Friday!',
    timestamp: '5 hours ago',
    likes: 32,
    comments: 8,
    icon: Calendar,
    color: COLORS.primary,
  },
  {
    id: '3',
    type: 'onboarding',
    user: 'Michael Chen',
    company: 'HealthTech Solutions',
    content: 'Just joined NextIgnition! Looking forward to connecting with fellow founders.',
    timestamp: '1 day ago',
    likes: 28,
    comments: 5,
    icon: Users,
    color: COLORS.accent,
  },
  {
    id: '4',
    type: 'achievement',
    user: 'Emily Davis',
    company: 'Innovate Labs',
    content: 'Reached 1000 users milestone! Thank you to everyone who believed in us.',
    timestamp: '2 days ago',
    likes: 67,
    comments: 15,
    icon: Award,
    color: COLORS.warning,
  },
];

export default function FeedScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [savedPosts, setSavedPosts] = useState<string[]>([]);
  const [likedPosts, setLikedPosts] = useState<string[]>([]);

  const onRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const toggleSave = (postId: string) => {
    setSavedPosts((prev) =>
      prev.includes(postId) ? prev.filter((id) => id !== postId) : [...prev, postId]
    );
  };

  const toggleLike = (postId: string) => {
    setLikedPosts((prev) =>
      prev.includes(postId) ? prev.filter((id) => id !== postId) : [...prev, postId]
    );
  };

  const getPostIcon = (post: typeof FEED_POSTS[0]) => {
    const IconComponent = post.icon;
    return (
      <View style={[styles.postIcon, { backgroundColor: `${post.color}15` }]}>
        <IconComponent size={20} color={post.color} strokeWidth={2} />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />
        }>
        <LinearGradient colors={GRADIENTS.primary} style={styles.heroCard}>
          <View style={styles.heroHeader}>
            <View style={styles.heroIcon}>
              <TrendingUp size={28} color={COLORS.background} strokeWidth={2} />
            </View>
            <View style={styles.heroText}>
              <Text style={styles.heroTitle}>Activity Feed</Text>
              <Text style={styles.heroSubtitle}>
                Stay updated with the latest from your network
              </Text>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.postsList}>
          {FEED_POSTS.map((post) => (
            <View key={post.id} style={styles.postCard}>
              <View style={styles.postHeader}>
                <View style={styles.postUserInfo}>
                  {getPostIcon(post)}
                  <View style={styles.postUserDetails}>
                    <Text style={styles.postUserName}>{post.user}</Text>
                    <Text style={styles.postCompany}>{post.company}</Text>
                  </View>
                </View>
                <TouchableOpacity style={styles.moreButton}>
                  <MoreVertical size={18} color={COLORS.textSecondary} strokeWidth={2} />
                </TouchableOpacity>
              </View>

              <Text style={styles.postContent}>{post.content}</Text>

              <View style={styles.postFooter}>
                <Text style={styles.postTimestamp}>{post.timestamp}</Text>
                <View style={styles.postActions}>
                  <TouchableOpacity
                    style={styles.postAction}
                    onPress={() => toggleLike(post.id)}
                    activeOpacity={0.7}>
                    <Heart
                      size={18}
                      color={likedPosts.includes(post.id) ? COLORS.error : COLORS.textSecondary}
                      fill={likedPosts.includes(post.id) ? COLORS.error : 'none'}
                      strokeWidth={2}
                    />
                    <Text
                      style={[
                        styles.postActionText,
                        likedPosts.includes(post.id) && styles.postActionTextActive,
                      ]}>
                      {post.likes + (likedPosts.includes(post.id) ? 1 : 0)}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.postAction} activeOpacity={0.7}>
                    <MessageCircle size={18} color={COLORS.textSecondary} strokeWidth={2} />
                    <Text style={styles.postActionText}>{post.comments}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.postAction} activeOpacity={0.7}>
                    <Share2 size={18} color={COLORS.textSecondary} strokeWidth={2} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.postAction}
                    onPress={() => toggleSave(post.id)}
                    activeOpacity={0.7}>
                    <Bookmark
                      size={18}
                      color={savedPosts.includes(post.id) ? COLORS.primary : COLORS.textSecondary}
                      fill={savedPosts.includes(post.id) ? COLORS.primary : 'none'}
                      strokeWidth={2}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
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
    gap: SPACING.md,
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
  postsList: {
    gap: SPACING.md,
  },
  postCard: {
    padding: SPACING.lg,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
    gap: SPACING.md,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  postUserInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    flex: 1,
  },
  postIcon: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  postUserDetails: {
    flex: 1,
  },
  postUserName: {
    ...TYPOGRAPHY.bodyStrong,
    fontFamily: FONT_FAMILY.bodyBold,
    color: COLORS.text,
    marginBottom: SPACING.xs / 2,
  },
  postCompany: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
  },
  moreButton: {
    padding: SPACING.xs,
  },
  postContent: {
    ...TYPOGRAPHY.body,
    color: COLORS.text,
    lineHeight: 22,
  },
  postFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  postTimestamp: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
  },
  postActions: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  postAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs / 2,
  },
  postActionText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    fontFamily: FONT_FAMILY.bodyMedium,
  },
  postActionTextActive: {
    color: COLORS.error,
  },
});

