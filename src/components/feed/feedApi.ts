import type { Post, Visibility } from '@/data/feedStore';

import { sessionFetch } from '../auth/browserSession';

export type ApiVisibility = 'PRIVATE' | 'GROUP' | 'PUBLIC';

export type FeedItem = {
  certificationId: number;
  nickname: string;
  missionTitle: string;
  imageUrl: string;
  content: string;
  visibility: ApiVisibility;
  cheerCount: number;
  cheered: boolean;
  commentCount: number;
  mine: boolean;
  createdAt: string;
};

export type FeedPage = {
  items: FeedItem[];
  nextCursor: number | null;
  hasNext: boolean;
};

const PAGE_SIZE = 20;

async function getJson<T>(path: `/api/${string}`, signal?: AbortSignal): Promise<T> {
  const response = await sessionFetch(path, { signal });
  if (!response.ok) {
    if (response.status === 401) throw new Error('카카오 로그인 후 다시 시도해 주세요.');
    const error = await response.json().catch(() => null);
    throw new Error(error?.message || '피드를 불러오지 못했어요.');
  }
  return response.json();
}

function feedPath(base: '/api/feed' | '/api/groups/me/feed', cursor?: number | null) {
  const query = cursor == null ? `size=${PAGE_SIZE}` : `cursor=${cursor}&size=${PAGE_SIZE}`;
  return `${base}?${query}` as const;
}

export type CertificationDetail = Omit<FeedItem, 'certificationId'>;

export const getCertification = (certificationId: string, signal?: AbortSignal) =>
  getJson<CertificationDetail>(`/api/certifications/${encodeURIComponent(certificationId)}`, signal);

export const getFeed = (cursor?: number | null, signal?: AbortSignal) =>
  getJson<FeedPage>(feedPath('/api/feed', cursor), signal);

export const getGroupFeed = (cursor?: number | null, signal?: AbortSignal) =>
  getJson<FeedPage>(feedPath('/api/groups/me/feed', cursor), signal);

const visibilityMap: Record<ApiVisibility, Visibility> = {
  PRIVATE: 'me',
  GROUP: 'group',
  PUBLIC: 'all',
};

export function toPost(item: FeedItem, scope: 'all' | 'group'): Post {
  return {
    id: String(item.certificationId),
    author: item.nickname,
    kind: scope === 'group' ? 'group' : 'personal',
    missionTitle: item.missionTitle,
    mine: item.mine,
    text: item.content,
    imageUri: item.imageUrl,
    likes: item.cheerCount,
    liked: item.cheered,
    comments: [],
    commentCount: item.commentCount,
    createdAt: new Date(item.createdAt).getTime(),
    visibility: visibilityMap[item.visibility],
  };
}

export function detailToPost(id: string, detail: CertificationDetail): Post {
  return toPost({ ...detail, certificationId: Number(id) }, 'all');
}

export async function cheerCertification(certificationId: string) {
  const response = await sessionFetch(`/api/certifications/${encodeURIComponent(certificationId)}/cheers`, {
    method: 'POST',
  });
  if (!response.ok) {
    if (response.status === 401) throw new Error('카카오 로그인 후 다시 시도해 주세요.');
    const error = await response.json().catch(() => null);
    throw new Error(error?.message || '응원하지 못했어요.');
  }
  const body: { cheerCount: number } = await response.json();
  return body.cheerCount;
}

export async function updateCertificationContent(certificationId: string, content: string) {
  const response = await sessionFetch(`/api/certifications/${encodeURIComponent(certificationId)}/content`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content }),
  });
  if (!response.ok) {
    if (response.status === 401) throw new Error('카카오 로그인 후 다시 시도해 주세요.');
    const error = await response.json().catch(() => null);
    throw new Error(error?.message || '글을 수정하지 못했어요.');
  }
}

export async function deleteCertification(certificationId: string) {
  const response = await sessionFetch(`/api/certifications/${encodeURIComponent(certificationId)}`, { method: 'DELETE' });
  if (!response.ok) {
    if (response.status === 401) throw new Error('카카오 로그인 후 다시 시도해 주세요.');
    const error = await response.json().catch(() => null);
    throw new Error(error?.message || '글을 삭제하지 못했어요.');
  }
}
