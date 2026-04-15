import React, { useState } from 'react';
import {
  View, Text, Modal, FlatList, TouchableOpacity,
  StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator,
} from 'react-native';
import { useComments, useAddComment } from '../api/hooks';
import { Post } from '../api/posts';
import { CommentItem } from './CommentItem';
import { InputText } from './InputText';
import { Button } from './Button';
import { colors, spacing, typography, radii } from '../tokens';

interface CommentSheetProps {
  post: Post | null;
  onClose: () => void;
}

export const CommentSheet: React.FC<CommentSheetProps> = ({ post, onClose }) => {
  const [text, setText] = useState('');

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useComments(
    post?.id ?? '',
    !!post,
  );

  const addMutation = useAddComment(post?.id ?? '');

  const comments = data?.pages.flatMap((p) => p.comments) ?? [];

  const handleSend = () => {
    if (!text.trim()) return;
    addMutation.mutate(text.trim(), { onSuccess: () => setText('') });
  };

  return (
    <Modal visible={!!post} animationType="slide" transparent onRequestClose={onClose}>
      <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.sheet}
      >
        <View style={styles.handle} />
        <Text style={styles.title}>Комментарии</Text>

        {isLoading ? (
          <ActivityIndicator color={colors.primary} style={{ marginTop: spacing.xl }} />
        ) : (
          <FlatList
            data={comments}
            keyExtractor={(c) => c.id}
            contentContainerStyle={styles.list}
            renderItem={({ item }) => <CommentItem comment={item} />}
            onEndReached={() => hasNextPage && fetchNextPage()}
            onEndReachedThreshold={0.3}
            ListFooterComponent={
              isFetchingNextPage ? <ActivityIndicator color={colors.primary} /> : null
            }
          />
        )}

        <View style={styles.inputRow}>
          <InputText
            value={text}
            onChangeText={setText}
            placeholder="Написать комментарий..."
            style={styles.input}
          />
          <Button
            label="Отправить"
            onPress={handleSend}
            loading={addMutation.isPending}
            variant={text.trim() ? 'primary' : 'disabled'}
          />
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: colors.overlay },
  sheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: radii.xl,
    borderTopRightRadius: radii.xl,
    maxHeight: '70%',
    minHeight: 300,
  },
  handle: {
    width: 40, height: 4,
    backgroundColor: colors.border,
    borderRadius: radii.full,
    alignSelf: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
  },
  title: {
    fontSize: typography.fontSizeLg,
    fontWeight: typography.fontWeightBold,
    color: colors.textPrimary,
    textAlign: 'center',
    paddingBottom: spacing.sm,
  },
  list: { padding: spacing.lg },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: spacing.sm,
  },
  input: { flex: 1 },
});
