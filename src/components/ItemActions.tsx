import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing, typography, radii } from '../tokens';

interface ItemActionsProps {
  likes: number;
  comments: number;
  liked: boolean;
  onLike: () => void;
  onComment: () => void;
}

export const ItemActions: React.FC<ItemActionsProps> = ({
  likes, comments, liked, onLike, onComment,
}) => (
  <View style={styles.row}>
    {/* Like */}
    <TouchableOpacity style={styles.action} onPress={onLike} activeOpacity={0.7}>
      <View style={[styles.chip, liked && styles.chipLiked]}>
        <Text style={[styles.heart, liked && styles.heartActive]}>♥</Text>
        <Text style={[styles.count, liked && styles.countActive]}>{likes}</Text>
      </View>
    </TouchableOpacity>

    {/* Comment */}
    <TouchableOpacity style={styles.action} onPress={onComment} activeOpacity={0.7}>
      <View style={styles.chip}>
        <Text style={styles.chatIcon}>💬</Text>
        <Text style={styles.count}>{comments}</Text>
      </View>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  action: {},
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.surface,
    borderRadius: radii.full,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm + 2,
  },
  chipLiked: {
    backgroundColor: '#FDECEA',
  },
  heart: {
    fontSize: 14,
    color: colors.textMuted,
  },
  heartActive: {
    color: colors.likeActive,
  },
  chatIcon: {
    fontSize: 13,
  },
  count: {
    fontSize: typography.fontSizeSm,
    color: colors.textSecondary,
    fontWeight: typography.fontWeightMedium,
  },
  countActive: {
    color: colors.likeActive,
  },
});
