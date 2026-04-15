import React, { useState } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { observer } from 'mobx-react-lite';
import { Post } from '../api/posts';
import { feedStore } from '../stores/FeedStore';
import { useLike } from '../api/hooks';
import { ItemActions } from './ItemActions';
import { Button } from './Button';
import { colors, spacing, typography, radii, shadows } from '../tokens';

interface PostCardProps {
  post: Post;
  onCommentPress: (post: Post) => void;
}

export const PostCard: React.FC<PostCardProps> = observer(({ post, onCommentPress }) => {
  const [expanded, setExpanded] = useState(false);
  const likeMutation = useLike();

  const { isLiked, likesCount } = feedStore.getLike(post.id, post.isLiked, post.likesCount);

  const isPaid = post.tier === 'paid';
  const bodyText = post.body || post.preview;
  const isLong = bodyText.length > 120;
  const displayBody = expanded || !isLong ? bodyText : bodyText.slice(0, 120);

  return (
    <View style={styles.card}>
      {/* Author */}
      <View style={styles.authorRow}>
        <Image source={{ uri: post.author.avatarUrl }} style={styles.avatar} />
        <View style={styles.authorInfo}>
          <Text style={styles.authorName}>{post.author.displayName}</Text>
          {post.author.isVerified && <Text style={styles.verified}>✓</Text>}
        </View>
      </View>

      {/* Cover image */}
      <View>
        <Image source={{ uri: post.coverUrl }} style={styles.image} resizeMode="cover" />
        {isPaid && (
          <View style={styles.lockOverlay}>
            <View style={styles.lockBadge}>
              <Text style={styles.lockIcon}>🔒</Text>
            </View>
            <Text style={styles.lockTitle}>Контент скрыт пользователем.</Text>
            <Text style={styles.lockSubtitle}>Доступ откроется после доната</Text>
            <Button label="Отправить донат" onPress={() => {}} style={styles.donatBtn} />
          </View>
        )}
      </View>

      {/* Body */}
      <View style={styles.body}>
        <Text style={styles.title}>{post.title}</Text>
        {!isPaid && (
          <Text style={styles.bodyText}>
            {displayBody}
            {isLong && !expanded && (
              <Text style={styles.readMore} onPress={() => setExpanded(true)}>
                {'  '}Сказать еще
              </Text>
            )}
          </Text>
        )}
      </View>

      {/* Actions */}
      <View style={styles.actionsRow}>
        <ItemActions
          likes={likesCount}
          comments={post.commentsCount}
          liked={isLiked}
          onLike={() => likeMutation.mutate(post.id)}
          onComment={() => onCommentPress(post)}
        />
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    borderRadius: radii.lg,
    overflow: 'hidden',
    ...shadows.card,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    gap: spacing.sm,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: radii.full,
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  authorName: {
    fontSize: typography.fontSizeSm,
    fontWeight: typography.fontWeightBold,
    color: colors.textPrimary,
  },
  verified: {
    fontSize: 11,
    color: colors.primary,
    fontWeight: typography.fontWeightBold,
  },
  image: {
    width: '100%',
    height: 200,
  },
  lockOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(20,10,40,0.75)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  lockBadge: {
    width: 44,
    height: 44,
    borderRadius: radii.full,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  lockIcon: { fontSize: 20 },
  lockTitle: {
    color: colors.white,
    fontSize: typography.fontSizeSm,
    fontWeight: typography.fontWeightBold,
    textAlign: 'center',
  },
  lockSubtitle: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: typography.fontSizeXs,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  donatBtn: { paddingHorizontal: spacing.xl, minHeight: 36 },
  body: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xs,
  },
  title: {
    fontSize: typography.fontSizeMd,
    fontWeight: typography.fontWeightBold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  bodyText: {
    fontSize: typography.fontSizeSm,
    color: colors.textSecondary,
    lineHeight: typography.lineHeightSm,
  },
  readMore: {
    color: colors.primary,
    fontWeight: typography.fontWeightMedium,
  },
  actionsRow: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    paddingTop: spacing.xs,
  },
});
