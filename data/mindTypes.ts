export type MindCode =
  | 'AAAA' | 'AAAB' | 'AABA' | 'AABB'
  | 'ABAA' | 'ABAB' | 'ABBA' | 'ABBB'
  | 'BAAA' | 'BAAB' | 'BABA' | 'BABB'
  | 'BBAA' | 'BBAB' | 'BBBA' | 'BBBB';

export type MindType = { name: string; description: string };

const burden = '해야할 일과 기대가 부담스러울 때,';
const tired = '해야할 일과 기대에 지칠 때,';
const relation = '관계에서 마음이 불편해질 때,';

const groups: Record<string, MindType> = {
  burdenSort: { name: '부담정돈형', description: `${burden}\n혼자 글로 생각을 풀어내는 방식이 편해요.` },
  relationReflect: { name: '관계성찰형', description: `${relation}\n혼자 생각을 살펴보는 방식이 편해요.` },
  paceRecover: { name: '페이스회복형', description: `${tired}\n혼자 몸을 움직이거나 감각을 사용하는 활동이 끌려요.` },
  emotionVent: { name: '감정환기형', description: `${relation}\n혼자 움직이거나 감각을 사용하는 활동이 끌려요.` },
  burdenShare: { name: '부담나눔형', description: `${burden}\n편한 사람과 이야기하며 마음을 표현하는 방식이 편해요.` },
  heartTalk: { name: '마음소통형', description: `${relation}\n편한 사람과 대화하며 마음을 표현하는 방식이 편해요.` },
  companionCharge: { name: '동행충전형', description: `${tired}\n편한 사람과 활동을 함께하는 방식이 끌려요.` },
  sideBySide: { name: '나란히연결형', description: `${relation}\n편한 사람과 활동을 함께하는 방식이 끌려요.` },
};

export const mindTypes: Record<MindCode, MindType> = {
  AAAA: groups.burdenSort, AABA: groups.burdenSort,
  AAAB: groups.relationReflect, AABB: groups.relationReflect,
  ABAA: groups.paceRecover, ABBA: groups.paceRecover,
  ABAB: groups.emotionVent, ABBB: groups.emotionVent,
  BAAA: groups.burdenShare, BABA: groups.burdenShare,
  BAAB: groups.heartTalk, BABB: groups.heartTalk,
  BBAA: groups.companionCharge, BBBA: groups.companionCharge,
  BBAB: groups.sideBySide, BBBB: groups.sideBySide,
};

export const isMindCode = (value: string): value is MindCode => value in mindTypes;
