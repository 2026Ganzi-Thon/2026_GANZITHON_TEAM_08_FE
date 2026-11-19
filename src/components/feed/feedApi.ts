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

export const getFeed = (cursor?: number | null, signal?: AbortSignal) =>
  getJson<FeedPage>(feedPath('/api/feed', cursor), signal);

export const getGroupFeed = (cursor?: number | null, signal?: AbortSignal) =>
  getJson<FeedPage>(feedPath('/api/groups/me/feed', cursor), signal);

export function toTimestamp(createdAt: string) {
  return new Date(createdAt).getTime();
}
