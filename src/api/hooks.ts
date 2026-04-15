import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { addComment, fetchComments, fetchPostsPage, toggleLike, FeedTier } from './posts';
import { feedStore } from '../stores/FeedStore';

export const useFeed = (tier?: FeedTier) =>
  useInfiniteQuery({
    queryKey: ['feed', tier],
    queryFn: ({ pageParam }) => fetchPostsPage(pageParam as string | undefined, tier),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (last) => (last.hasMore ? last.nextCursor ?? undefined : undefined),
    retry: 2,
  });

export const useLike = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: toggleLike,
    onMutate: (postId) => {
      // optimistic update via MobX
      const pages = qc.getQueryData<{ pages: Awaited<ReturnType<typeof fetchPostsPage>>[] }>(['feed']);
      const post = pages?.pages.flatMap((p) => p.posts).find((p) => p.id === postId);
      if (post) {
        const { isLiked, likesCount } = feedStore.getLike(postId, post.isLiked, post.likesCount);
        feedStore.optimisticToggle(postId, isLiked, likesCount);
      }
    },
    onSuccess: (data, postId) => {
      feedStore.setLike(postId, data.isLiked, data.likesCount);
    },
    onError: (_err, postId) => {
      // revert: remove override so it falls back to server data
      feedStore.likeOverrides.delete(postId);
    },
  });
};

export const useComments = (postId: string, enabled: boolean) =>
  useInfiniteQuery({
    queryKey: ['comments', postId],
    queryFn: ({ pageParam }) => fetchComments(postId, pageParam as string | undefined),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (last) => (last.hasMore ? last.nextCursor ?? undefined : undefined),
    enabled,
  });

export const useAddComment = (postId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (text: string) => addComment(postId, text),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['comments', postId] });
      qc.invalidateQueries({ queryKey: ['feed'] });
    },
  });
};
