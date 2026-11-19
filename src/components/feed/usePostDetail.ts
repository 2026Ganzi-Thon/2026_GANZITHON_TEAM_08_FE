import { useCallback, useEffect, useState } from 'react';

import type { Comment, Post } from '@/data/feedStore';

import { createComment, getComments } from './commentApi';
import { cheerCertification, detailToPost, getCertification } from './feedApi';

type Result = { id: string; post?: Post; error?: string };
type CommentResult = { id: string; items: Comment[]; error?: string };

export function usePostDetail(id: string | undefined, enabled: boolean) {
  const [result, setResult] = useState<Result>();
  const [commentResult, setCommentResult] = useState<CommentResult>();
  const [actionError, setActionError] = useState<string>();

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
    void getComments(id, request.signal)
      .then((items) => {
        if (!request.signal.aborted) setCommentResult({ id, items });
      })
      .catch((error: Error) => {
        if (!request.signal.aborted) setCommentResult({ id, items: [], error: error.message });
      });
    return () => request.abort();
  }, [id, enabled]);

  const current = enabled && result?.id === id ? result : undefined;
  const comments = enabled && commentResult?.id === id ? commentResult : undefined;

  const cheer = useCallback(async () => {
    const post = current?.post;
    if (!post || post.liked || post.mine) return;
    try {
      const likes = await cheerCertification(post.id);
      setResult({ id: post.id, post: { ...post, liked: true, likes } });
    } catch (error) {
      setActionError(error instanceof Error ? error.message : '응원하지 못했어요.');
    }
  }, [current]);

  const addComment = useCallback(
    async (text: string) => {
      const post = current?.post;
      if (!post) return false;
      try {
        const created = await createComment(post.id, text);
        setActionError(undefined);
        setCommentResult({ id: post.id, items: [...(comments?.items ?? []), created] });
        setResult({ id: post.id, post: { ...post, commentCount: (post.commentCount ?? 0) + 1 } });
        return true;
      } catch (error) {
        setActionError(error instanceof Error ? error.message : '댓글을 등록하지 못했어요.');
        return false;
      }
    },
    [current, comments],
  );

  return {
    post: current?.post,
    comments: comments?.items ?? [],
    loading: enabled && !!id && !current,
    error: current?.error ?? actionError ?? comments?.error,
    cheer,
    addComment,
  };
}
