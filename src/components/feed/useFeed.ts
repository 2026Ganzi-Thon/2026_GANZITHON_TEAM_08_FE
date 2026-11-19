import { useCallback, useEffect, useRef, useState } from 'react';

import type { Post } from '@/data/feedStore';

import { cheerCertification, getFeed, getGroupFeed, toPost, type FeedPage } from './feedApi';

export type FeedScope = 'all' | 'group';

const changeListeners = new Set<() => void>();

export const notifyFeedChanged = () => changeListeners.forEach((listener) => listener());

type Result = {
  key: string;
  posts: Post[];
  nextCursor: number | null;
  hasNext: boolean;
  error?: string;
};

const fetchPage = (scope: FeedScope, cursor: number | null, signal?: AbortSignal): Promise<FeedPage> =>
  (scope === 'group' ? getGroupFeed : getFeed)(cursor, signal);

export function useFeed(scope: FeedScope) {
  const [reload, setReload] = useState(0);
  const [result, setResult] = useState<Result>();
  const [moreError, setMoreError] = useState<string>();
  const loadingMore = useRef(false);
  const key = `${scope}:${reload}`;

  useEffect(() => {
    const listener = () => setReload((value) => value + 1);
    changeListeners.add(listener);
    return () => {
      changeListeners.delete(listener);
    };
  }, []);

  useEffect(() => {
    const request = new AbortController();
    void fetchPage(scope, null, request.signal)
      .then((page) => {
        if (request.signal.aborted) return;
        setMoreError(undefined);
        setResult({
          key,
          posts: page.items.map((item) => toPost(item, scope)),
          nextCursor: page.nextCursor,
          hasNext: page.hasNext,
        });
      })
      .catch((error: Error) => {
        if (!request.signal.aborted) setResult({ key, posts: [], nextCursor: null, hasNext: false, error: error.message });
      });
    return () => request.abort();
  }, [scope, key]);

  const current = result?.key === key ? result : undefined;

  const loadMore = useCallback(async () => {
    if (!current?.hasNext || current.nextCursor == null || loadingMore.current) return;
    loadingMore.current = true;
    try {
      const page = await fetchPage(scope, current.nextCursor);
      setResult({
        ...current,
        posts: [...current.posts, ...page.items.map((item) => toPost(item, scope))],
        nextCursor: page.nextCursor,
        hasNext: page.hasNext,
      });
    } catch (error) {
      setMoreError(error instanceof Error ? error.message : '피드를 불러오지 못했어요.');
    } finally {
      loadingMore.current = false;
    }
  }, [current, scope]);

  const cheer = useCallback(
    async (post: Post) => {
      if (!current || post.liked || post.mine) return;
      try {
        const likes = await cheerCertification(post.id);
        setResult({
          ...current,
          posts: current.posts.map((item) => (item.id === post.id ? { ...item, liked: true, likes } : item)),
        });
      } catch (error) {
        setMoreError(error instanceof Error ? error.message : '응원하지 못했어요.');
      }
    },
    [current],
  );

  return {
    posts: current?.posts ?? [],
    loading: !current,
    error: current?.error ?? moreError,
    hasNext: current?.hasNext ?? false,
    cheer,
    loadMore,
    refresh: () => setReload((value) => value + 1),
  };
}
