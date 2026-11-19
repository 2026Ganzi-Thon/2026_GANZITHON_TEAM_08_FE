import { sessionFetch } from '../auth/browserSession';

export type HomeMission = {
  missionTitle: string;
  missionDescription: string;
  missionDate: string;
  startsAt: string;
  endsAt: string;
  canCertify: boolean;
  completed: boolean;
};

type PersonalResponse = Omit<HomeMission, 'completed'> & { completed: boolean };
type GroupResponse = Omit<HomeMission, 'completed'> & { completedCurrentMission: boolean };

async function getJson<T>(path: `/api/${string}`, fallback: string, signal?: AbortSignal): Promise<T> {
  const response = await sessionFetch(path, { signal });
  if (!response.ok) {
    if (response.status === 401) throw new Error('카카오 로그인 후 다시 시도해 주세요.');
    const error = await response.json().catch(() => null);
    throw new Error(error?.message || fallback);
  }
  return response.json();
}

export async function getPersonalMission(signal?: AbortSignal): Promise<HomeMission> {
  return getJson<PersonalResponse>('/api/missions/personal/today', '오늘의 개인 미션을 불러오지 못했어요.', signal);
}

export async function getGroupMission(signal?: AbortSignal): Promise<HomeMission> {
  const data = await getJson<GroupResponse>('/api/groups/me/missions/current', '이번 주 그룹 미션을 불러오지 못했어요.', signal);
  return { ...data, completed: data.completedCurrentMission };
}

const toMonthDay = (date: string) => {
  const [, month, day] = date.slice(0, 10).split('-').map(Number);
  return `${month}/${day}`;
};

export const formatMissionDate = (mission: HomeMission) => toMonthDay(mission.missionDate);

export function formatMissionRange(mission: HomeMission) {
  const [year, month, day] = mission.endsAt.slice(0, 10).split('-').map(Number);
  const lastDay = new Date(Date.UTC(year, month - 1, day - 1));
  return `${toMonthDay(mission.startsAt)} ~ ${lastDay.getUTCMonth() + 1}/${lastDay.getUTCDate()}`;
}
