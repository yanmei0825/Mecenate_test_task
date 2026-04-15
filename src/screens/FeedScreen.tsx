import React, { useState } from 'react';
import {
  View, FlatList, StyleSheet, RefreshControl,
  Text, ActivityIndicator, StatusBar, Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { observer } from 'mobx-react-lite';
import { useFeed } from '../api/hooks';
import { Post } from '../api/posts';
import { PostCard } from '../components/PostCard';
import { CommentSheet } from '../components/CommentSheet';
import { TabBar } from '../components/TabBar';
import { Button } from '../components/Button';
import { colors, spacing, typography, radii } from '../tokens';

const TABS = [
  { key: 'all', label: 'Все' },
  { key: 'free', label: 'Бесплатное' },
  { key: 'paid', label: 'Платное' },
];

type TabKey = 'all' | 'free' | 'paid';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const errorIllustration = require('../../assets/error-illustration.png');

const FeedScreen: React.FC = observer(() => {
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [activeTab, setActiveTab] = useState<TabKey>('all');

  const tier = activeTab === 'all' ? undefined : activeTab as 'free' | 'paid';

  const {
    data, isLoading, isError, refetch,
    isFetching, fetchNextPage, hasNextPage, isFetchingNextPage,
  } = useFeed(tier);

  const posts = data?.pages.flatMap((p) => p.posts) ?? [];

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
        <View style={styles.centered}>
          <Image source={errorIllustration} style={styles.illustration} resizeMode="contain" />
          <Text style={styles.stateTitle}>Не удалось загрузить публикации</Text>
          <Button label="Повторить" onPress={() => refetch()} style={styles.stateBtn} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
      <TabBar tabs={TABS} activeKey={activeTab} onChange={(k) => setActiveTab(k as TabKey)} />
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
            <Image source={errorIllustration} style={styles.illustration} resizeMode="contain" />
            <Text style={styles.stateTitle}>По какому запросу ничего не найдено</Text>
            <Button label="На главную" onPress={() => setActiveTab('all')} style={styles.stateBtn} />
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
  list: { paddingTop: spacing.sm, paddingBottom: spacing.xxxl },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    minHeight: 400,
  },
  illustration: {
    width: 160,
    height: 160,
    marginBottom: spacing.lg,
  },
  stateTitle: {
    fontSize: typography.fontSizeMd,
    fontWeight: typography.fontWeightBold,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  stateBtn: {
    width: '100%',
    borderRadius: radii.full,
  },
});
