import { sessionFetch } from '../auth/browserSession';

export type DayRecord = {
  date: string;
  personalCompleted: boolean;
  groupCompleted: boolean;
};

export type MonthlyRecords = {
  currentStreak: number;
  longestStreak: number;
  days: DayRecord[];
};

export type RecordItem = {
  certificationId: number;
  missionType: 'PERSONAL' | 'GROUP';
  missionTitle: string;
  imageUrl: string | null;
  content: string;
};

export type MyGroup = {
  groupId: number | null;
  groupName: string | null;
  typeName: string;
  memberCount: number;
  members: { nickname: string; isMe: boolean }[];
};

async function getJson<T>(path: `/api/${string}`, signal?: AbortSignal): Promise<T> {
  const response = await sessionFetch(path, { signal });
  if (!response.ok) {
    if (response.status === 401) throw new Error('카카오 로그인 후 다시 시도해 주세요.');
    const error = await response.json().catch(() => null);
    throw new Error(error?.message || '정보를 불러오지 못했어요.');
  }
  return response.json();
}

export const getMonthlyRecords = (month: string, signal?: AbortSignal) =>
  getJson<MonthlyRecords>(`/api/me/records?month=${encodeURIComponent(month)}`, signal);

export const getDayRecords = (date: string, signal?: AbortSignal) =>
  getJson<RecordItem[]>(`/api/me/records/${encodeURIComponent(date)}`, signal);

export const getMyGroup = (signal?: AbortSignal) =>
  getJson<MyGroup>('/api/groups/me', signal);

export const getCurrentGroupMission = (signal?: AbortSignal) =>
  getJson<{ completedThisWeek: boolean }>('/api/groups/me/missions/current', signal);
