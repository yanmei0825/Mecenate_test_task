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
  likes,
  comments,
  liked,
  onLike,
  onComment,
}) => {
  return (
    <View style={styles.row}>
      <TouchableOpacity style={styles.action} onPress={onLike} activeOpacity={0.7}>
        <View style={[styles.iconWrap, liked && styles.iconWrapActive]}>
          <Text style={[styles.icon, liked && styles.iconActive]}>♥</Text>
        </View>
        <Text style={styles.count}>{likes}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.action} onPress={onComment} activeOpacity={0.7}>
        <View style={styles.iconWrap}>
          <Text style={styles.icon}>💬</Text>
        </View>
        <Text style={styles.count}>{comments}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  iconWrap: {
    width: 28,
    height: 28,
    borderRadius: radii.full,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapActive: {
    backgroundColor: '#FDECEA',
  },
  icon: {
    fontSize: 13,
    color: colors.textMuted,
  },
  iconActive: {
    color: colors.likeActive,
  },
  count: {
    fontSize: typography.fontSizeSm,
    color: colors.textSecondary,
    minWidth: 16,
  },
});
