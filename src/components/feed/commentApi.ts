import type { Comment } from '@/data/feedStore';

import { sessionFetch } from '../auth/browserSession';

type ApiComment = {
  commentId: number;
  nickname: string;
  content: string;
  mine: boolean;
  createdAt: string;
};

type CommentList = { comments: ApiComment[]; commentCount: number };

const toComment = (item: ApiComment): Comment => ({
  id: String(item.commentId),
  author: item.nickname,
  text: item.content,
});

async function readError(response: Response, fallback: string) {
  if (response.status === 401) return '카카오 로그인 후 다시 시도해 주세요.';
  const error = await response.json().catch(() => null);
  return error?.message || fallback;
}

export async function getComments(certificationId: string, signal?: AbortSignal) {
  const response = await sessionFetch(`/api/certifications/${encodeURIComponent(certificationId)}/comments`, { signal });
  if (!response.ok) throw new Error(await readError(response, '댓글을 불러오지 못했어요.'));
  const body: CommentList = await response.json();
  return body.comments.map(toComment);
}

export async function createComment(certificationId: string, content: string) {
  const response = await sessionFetch(`/api/certifications/${encodeURIComponent(certificationId)}/comments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content }),
  });
  if (!response.ok) throw new Error(await readError(response, '댓글을 등록하지 못했어요.'));
  return toComment(await response.json());
}
