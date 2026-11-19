import type { MissionKind, Visibility } from '@/data/feedStore';

import { sessionFetch } from '../auth/browserSession';

export type TodayMission = {
  missionId: number;
  missionTitle: string;
  canCertify: boolean;
  completed?: boolean;
  completedThisWeek?: boolean;
};

export type PickedImage = { uri: string; mimeType?: string; fileName?: string };

const missionPaths = {
  personal: '/api/missions/personal/today',
  group: '/api/groups/me/missions/current',
} as const;

const visibilityValues: Record<Visibility, 'PRIVATE' | 'GROUP' | 'PUBLIC'> = {
  me: 'PRIVATE',
  group: 'GROUP',
  all: 'PUBLIC',
};

async function readError(response: Response, fallback: string) {
  if (response.status === 401) return '카카오 로그인 후 다시 시도해 주세요.';
  const error = await response.json().catch(() => null);
  return error?.message || fallback;
}

export async function getCertifiableMission(kind: MissionKind, signal?: AbortSignal) {
  const response = await sessionFetch(missionPaths[kind], { signal });
  if (!response.ok) throw new Error(await readError(response, '오늘의 미션을 불러오지 못했어요.'));
  return (await response.json()) as TodayMission;
}

async function toFilePart(image: PickedImage) {
  const name = image.fileName ?? 'photo.jpg';
  const type = image.mimeType ?? 'image/jpeg';
  if (typeof document !== 'undefined') {
    const blob = await (await fetch(image.uri)).blob();
    return { file: blob, name };
  }
  return { file: { uri: image.uri, name, type } as unknown as Blob, name };
}

export async function submitCertification(input: {
  kind: MissionKind;
  missionId: number;
  content: string;
  visibility: Visibility;
  image: PickedImage;
}) {
  const { file, name } = await toFilePart(input.image);
  const form = new FormData();
  form.append('image', file, name);
  form.append('content', input.content);
  form.append('missionType', input.kind === 'group' ? 'GROUP' : 'PERSONAL');
  form.append('missionId', String(input.missionId));
  form.append('visibility', visibilityValues[input.visibility]);

  const response = await sessionFetch('/api/certifications', { method: 'POST', body: form });
  if (!response.ok) throw new Error(await readError(response, '기록을 올리지 못했어요.'));
}
