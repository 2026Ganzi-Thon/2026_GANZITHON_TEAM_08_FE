import { useCallback, useEffect, useState } from 'react';

import type { Post } from '@/data/feedStore';

import { cheerCertification, detailToPost, getCertification } from './feedApi';

type Result = { id: string; post?: Post; error?: string };

export function usePostDetail(id: string | undefined, enabled: boolean) {
  const [result, setResult] = useState<Result>();
  const [cheerError, setCheerError] = useState<string>();

  useEffect(() => {
    if (!id || !enabled) return;
    const request = new AbortController();
    void getCertification(id, request.signal)
      .then((detail) => {
        if (!request.signal.aborted) setResult({ id, post: detailToPost(id, detail) });
      })
      .catch((error: Error) => {
        if (!request.signal.aborted) setResult({ id, error: error.message });
      });
    return () => request.abort();
  }, [id, enabled]);

  const current = enabled && result?.id === id ? result : undefined;

  const cheer = useCallback(async () => {
    const post = current?.post;
    if (!post || post.liked || post.mine) return;
    try {
      const likes = await cheerCertification(post.id);
      setResult({ id: post.id, post: { ...post, liked: true, likes } });
    } catch (error) {
      setCheerError(error instanceof Error ? error.message : '응원하지 못했어요.');
    }
  }, [current]);

  return {
    post: current?.post,
    loading: enabled && !!id && !current,
    error: current?.error ?? cheerError,
    cheer,
  };
}
