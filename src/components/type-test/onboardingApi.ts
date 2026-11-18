import type { MindCode } from '@/data/mindTypes';

import { getMyType, sessionFetch } from '../auth/browserSession';

type Choice = 'A' | 'B';
type Answer = { questionId: number; choice: Choice };
type Submission = { lifeStage: string; answers: Answer[] };
type Result = { typeCode: string; typeName: string; carePreference: Choice };
export type CurrentType = Result & { lifeStageLabel: string; typeDescription: string };

export type Questionnaire = {
  lifeStages: { code: string; label: string }[];
  questions: { questionId: number; content: string; optionA: string; optionB: string }[];
};

const illustrationsByType: Record<string, Record<Choice, MindCode>> = {
  TYPE_01: { A: 'AAAA', B: 'AABA' },
  TYPE_02: { A: 'ABAA', B: 'ABBA' },
  TYPE_03: { A: 'BAAA', B: 'BABA' },
  TYPE_04: { A: 'BBAA', B: 'BBBA' },
  TYPE_05: { A: 'AAAB', B: 'AABB' },
  TYPE_06: { A: 'ABAB', B: 'ABBB' },
  TYPE_07: { A: 'BAAB', B: 'BABB' },
  TYPE_08: { A: 'BBAB', B: 'BBBB' },
};

export function getResultCode(result: Result) {
  return illustrationsByType[result.typeCode]?.[result.carePreference];
}

export class OnboardingRequestError extends Error {
  constructor(message: string, readonly status: number) {
    super(message);
  }
}

async function readJson<T>(response: Response): Promise<T> {
  const body = await response.json().catch(() => null);
  if (!response.ok || body === null) {
    const message = response.status === 401 ? '카카오 로그인 후 다시 시도해 주세요.' : body?.message;
    throw new OnboardingRequestError(message || '온보딩 요청을 처리하지 못했어요. 다시 시도해 주세요.', response.status);
  }
  return body as T;
}

export const getQuestionnaire = async () =>
  readJson<Questionnaire>(await sessionFetch('/api/onboarding/questions'));

export const getRetestAnswers = async () =>
  readJson<Submission>(await sessionFetch('/api/me/type/retest'));

export const getCurrentType = async () => readJson<CurrentType>(await getMyType());

export async function submitQuestionnaire(submission: Submission, retest: boolean) {
  return readJson<Result>(await sessionFetch(retest ? '/api/me/type' : '/api/onboarding', {
    method: retest ? 'PUT' : 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(submission),
  }));
}
