import { makeAutoObservable } from 'mobx';

class FeedStore {
  // Optimistic like state: postId -> { isLiked, likesCount }
  likeOverrides: Map<string, { isLiked: boolean; likesCount: number }> = new Map();

  constructor() {
    makeAutoObservable(this);
  }

  setLike(postId: string, isLiked: boolean, likesCount: number) {
    this.likeOverrides.set(postId, { isLiked, likesCount });
  }

  getLike(postId: string, defaultLiked: boolean, defaultCount: number) {
    const override = this.likeOverrides.get(postId);
    return override ?? { isLiked: defaultLiked, likesCount: defaultCount };
  }

  optimisticToggle(postId: string, currentLiked: boolean, currentCount: number) {
    this.likeOverrides.set(postId, {
      isLiked: !currentLiked,
      likesCount: currentLiked ? currentCount - 1 : currentCount + 1,
    });
  }
}

export const feedStore = new FeedStore();
