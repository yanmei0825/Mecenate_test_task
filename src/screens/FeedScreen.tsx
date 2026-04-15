import React, { useState } from 'react';
import {
  View, FlatList, StyleSheet, RefreshControl,
  Text, ActivityIndicator, SafeAreaView, StatusBar,
} from 'react-native';
import { observer } from 'mobx-react-lite';
import { useFeed } from '../api/hooks';
import { Post } from '../api/posts';
import { PostCard } from '../components/PostCard';
import { CommentSheet } from '../components/CommentSheet';
import { Button } from '../components/Button';
import { colors, spacing, typography } from '../tokens';

const FeedScreen: React.FC = observer(() => {
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  const {
    data,
    isLoading,
    isError,
    refetch,
    isFetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useFeed();

  const posts = data?.pages.flatMap((p) => p.posts) ?? [];

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <Text style={styles.illustration}>🐙</Text>
          <Text style={styles.stateTitle}>Не удалось загрузить публикации</Text>
          <Button label="Повторить" onPress={() => refetch()} style={styles.stateBtn} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />

      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PostCard post={item} onCommentPress={setSelectedPost} />
        )}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={isFetching && !isLoading && !isFetchingNextPage}
            onRefresh={refetch}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
        onEndReached={() => hasNextPage && !isFetchingNextPage && fetchNextPage()}
        onEndReachedThreshold={0.4}
        ListFooterComponent={
          isFetchingNextPage
            ? <ActivityIndicator color={colors.primary} style={{ marginVertical: spacing.xl }} />
            : null
        }
        ListEmptyComponent={
          <View style={styles.centered}>
            <Text style={styles.illustration}>📭</Text>
            <Text style={styles.stateTitle}>Публикаций пока нет</Text>
          </View>
        }
      />

      <CommentSheet post={selectedPost} onClose={() => setSelectedPost(null)} />
    </SafeAreaView>
  );
});

export { FeedScreen };

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  list: { paddingTop: spacing.md, paddingBottom: spacing.xxxl },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xxxl,
    minHeight: 400,
  },
  illustration: { fontSize: 72, marginBottom: spacing.xl },
  stateTitle: {
    fontSize: typography.fontSizeMd,
    fontWeight: typography.fontWeightBold,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  stateBtn: { minWidth: 200 },
});
