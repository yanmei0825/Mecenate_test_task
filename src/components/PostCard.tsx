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
  const bodyText = post.body || post.preview || '';
  const isLong = bodyText.length > 120;
  const displayBody = expanded || !isLong ? bodyText : bodyText.slice(0, 120);

  return (
    <View style={styles.card}>

      {/* Author row above image — paid posts only */}
      {/* Author row — shown above image for paid posts */}
      {isPaid && (
        <View style={styles.authorRowStandalone}>
          <Image source={{ uri: post.author.avatarUrl }} style={styles.avatarLarge} />
          <Text style={styles.authorNameLarge}>{post.author.displayName}</Text>
        </View>
      )}

      {/* ── Cover image ── */}
      <View>
        <Image source={{ uri: post.coverUrl }} style={styles.image} resizeMode="cover"
          blurRadius={isPaid ? 20 : 0}
        />

        {/* Author badge — only on free posts, floating over image */}
        {!isPaid && (
          <View style={styles.authorOverlay}>
            <Image source={{ uri: post.author.avatarUrl }} style={styles.avatar} />
            <Text style={styles.authorName} numberOfLines={1}>{post.author.displayName}</Text>
            {post.author.isVerified && (
              <View style={styles.verifiedBadge}>
                <Text style={styles.verifiedText}>✓</Text>
              </View>
            )}
          </View>
        )}

        {/* Paid lock overlay */}
        {isPaid && (
          <View style={styles.lockOverlay}>
            <View style={styles.lockBadge}>
              <View style={styles.lockCircle}>
                <Text style={styles.lockIcon}>$</Text>
              </View>
            </View>
            <Text style={styles.lockText}>
              {'Контент скрыт пользователем.\nДоступ откроется после доната'}
            </Text>
            <Button label="Отправить донат" onPress={() => {}} style={styles.donatBtn} />
          </View>
        )}
      </View>

      {/* Author row — shown above image for paid posts */}
      {isPaid && (
        <View style={styles.authorRowStandalone}>
          <Image source={{ uri: post.author.avatarUrl }} style={styles.avatarLarge} />
          <Text style={styles.authorNameLarge}>{post.author.displayName}</Text>
        </View>
      )}

      {/* ── Body ── */}
      <View style={styles.body}>
        <Text style={styles.title}>{post.title}</Text>
        {!isPaid && bodyText.length > 0 && (
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

      {/* ── Actions ── */}
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
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    borderRadius: radii.lg,
    overflow: 'hidden',
    ...shadows.card,
  },

  // Cover
  image: {
    width: '100%',
    height: 360,
  },

  // Author badge floating over bottom of image (free posts)
  authorOverlay: {
    position: 'absolute',
    bottom: spacing.xs,
    left: spacing.xs,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: radii.full,
    paddingVertical: 3,
    paddingHorizontal: spacing.sm,
    gap: spacing.xs,
    maxWidth: '65%',
  },
  avatar: {
    width: 20,
    height: 20,
    borderRadius: radii.full,
  },
  authorName: {
    fontSize: 11,
    fontWeight: typography.fontWeightBold,
    color: colors.textPrimary,
    flexShrink: 1,
  },
  verifiedBadge: {
    width: 12,
    height: 12,
    borderRadius: radii.full,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifiedText: {
    fontSize: 7,
    color: colors.white,
    fontWeight: typography.fontWeightBold,
  },

  // Author row above image for paid posts
  authorRowStandalone: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
    backgroundColor: colors.white,
  },
  avatarLarge: {
    width: 28,
    height: 28,
    borderRadius: radii.full,
  },
  authorNameLarge: {
    fontSize: 13,
    fontWeight: typography.fontWeightBold,
    color: colors.textPrimary,
  },

  // Lock overlay
  lockOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(20,10,40,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    gap: spacing.sm,
  },
  lockBadge: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  lockCircle: {
    width: 30,
    height: 30,
    borderRadius: radii.full,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockIcon: {
    fontSize: 15,
    color: colors.primary,
    fontWeight: typography.fontWeightBold,
  },
  lockText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: typography.fontWeightRegular,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: spacing.xs,
  },
  donatBtn: {
    width: '70%',
    minHeight: 40,
  },

  // Body
  body: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xs,
    paddingBottom: spacing.xs,
  },
  title: {
    fontSize: 13,
    fontWeight: typography.fontWeightBold,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  bodyText: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 16,
  },
  readMore: {
    color: colors.primary,
    fontWeight: typography.fontWeightMedium,
    fontSize: 12,
  },

  // Actions
  actionsRow: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
    paddingTop: 2,
  },
});
