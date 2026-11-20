import { sessionFetch } from '../auth/browserSession';

export type GroupInfo = {
  groupId: number | null;
  groupName: string | null;
  lifeStage: string;
  typeCode: string;
  typeName: string;
  memberCount: number;
  capacity: number;
  members: { userId: number; nickname: string; isMe: boolean }[];
};

export type GroupMission = {
  missionTitle: string;
  missionDescription: string;
  startsAt: string;
  endsAt: string;
  memberCount: number;
  completedMemberCount: number;
};

export const lifeStageLabels: Record<string, string> = {
  COLLEGE_STUDENT: '대학생',
  JOB_SEEKER: '취업 준비생',
  EARLY_CAREER: '사회초년생',
};

async function getJson<T>(path: `/api/${string}`, fallback: string, signal?: AbortSignal): Promise<T> {
  const response = await sessionFetch(path, { signal });
  if (!response.ok) {
    if (response.status === 401) throw new Error('카카오 로그인 후 다시 시도해 주세요.');
    const error = await response.json().catch(() => null);
    throw new Error(error?.message || fallback);
  }
  return response.json();
}

export const getGroupInfo = (signal?: AbortSignal) =>
  getJson<GroupInfo>('/api/groups/me', '그룹 정보를 불러오지 못했어요.', signal);

export const getGroupMission = (signal?: AbortSignal) =>
  getJson<GroupMission>('/api/groups/me/missions/current', '이번 주 미션을 불러오지 못했어요.', signal);

const monthDay = (year: number, month: number, day: number) => `${month}/${day}`;

export function formatWeekRange(startsAt: string, endsAt: string) {
  const [startYear, startMonth, startDay] = startsAt.slice(0, 10).split('-').map(Number);
  const [endYear, endMonth, endDay] = endsAt.slice(0, 10).split('-').map(Number);
  const lastDay = new Date(Date.UTC(endYear, endMonth - 1, endDay - 1));
  return `${monthDay(startYear, startMonth, startDay)} ~ ${monthDay(
    lastDay.getUTCFullYear(),
    lastDay.getUTCMonth() + 1,
    lastDay.getUTCDate(),
  )}`;
}
