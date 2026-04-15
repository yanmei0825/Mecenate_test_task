import { apiClient } from './client';

// ── Types ──────────────────────────────────────────────────────────────────

export interface Author {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  bio: string;
  subscribersCount: number;
  isVerified: boolean;
}

export interface Post {
  id: string;
  author: Author;
  title: string;
  body: string;
  preview: string;
  coverUrl: string;
  likesCount: number;
  commentsCount: number;
  isLiked: boolean;
  tier: 'free' | 'paid';
  createdAt: string;
}

export interface Comment {
  id: string;
  postId: string;
  author: Author;
  text: string;
  createdAt: string;
}

export interface PostsPage {
  posts: Post[];
  nextCursor: string | null;
  hasMore: boolean;
}

export interface CommentsPage {
  comments: Comment[];
  nextCursor: string | null;
  hasMore: boolean;
}

// ── API calls ──────────────────────────────────────────────────────────────

export const fetchPostsPage = async (cursor?: string): Promise<PostsPage> => {
  const params: Record<string, unknown> = { limit: 10 };
  if (cursor) params.cursor = cursor;

  const res = await apiClient.get('/posts', { params });
  return res.data.data as PostsPage;
};

export const toggleLike = async (postId: string): Promise<{ isLiked: boolean; likesCount: number }> => {
  const res = await apiClient.post(`/posts/${postId}/like`);
  return res.data.data;
};

export const fetchComments = async (postId: string, cursor?: string): Promise<CommentsPage> => {
  const params: Record<string, unknown> = { limit: 20 };
  if (cursor) params.cursor = cursor;

  const res = await apiClient.get(`/posts/${postId}/comments`, { params });
  return res.data.data as CommentsPage;
};

export const addComment = async (postId: string, text: string): Promise<Comment> => {
  const res = await apiClient.post(`/posts/${postId}/comments`, { text });
  return res.data.data.comment as Comment;
};
