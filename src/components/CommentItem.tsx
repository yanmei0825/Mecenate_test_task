import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Comment } from '../api/posts';
import { colors, spacing, typography, radii } from '../tokens';

export const CommentItem: React.FC<{ comment: Comment }> = ({ comment }) => (
  <View style={styles.container}>
    <Image source={{ uri: comment.author.avatarUrl }} style={styles.avatar} />
    <View style={styles.body}>
      <Text style={styles.name}>{comment.author.displayName}</Text>
      <Text style={styles.text}>{comment.text}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.lg },
  avatar: { width: 32, height: 32, borderRadius: radii.full },
  body: { flex: 1 },
  name: {
    fontSize: typography.fontSizeSm,
    fontWeight: typography.fontWeightBold,
    color: colors.textPrimary,
  },
  text: {
    fontSize: typography.fontSizeSm,
    color: colors.textSecondary,
    lineHeight: typography.lineHeightSm,
    marginTop: 2,
  },
});
