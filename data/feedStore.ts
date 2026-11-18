import { useSyncExternalStore } from 'react';

import type { MindCode } from './mindTypes';

export type MissionKind = 'group' | 'personal';
export type Visibility = 'group' | 'all' | 'me';

export type Comment = { id: string; author: string; text: string };

export type Post = {
  id: string;
  author: string;
  stage: string;
  mindCode: MindCode;
  kind: MissionKind;
  text: string;
  imageUri?: string;
  likes: number;
  liked: boolean;
  comments: Comment[];
  createdAt: number;
  visibility: Visibility;
};

const hour = 60 * 60 * 1000;
const now = Date.now();

let posts: Post[] = [
  {
    id: 'p1', author: '주댕치', stage: '대학생', mindCode: 'AAAA', kind: 'personal',
    text: '어질러져 있던 책상을 드디어 정리했어요!\n깨끗해진 책상을 보니 마음가짐이 달라지는 것 같네요',
    likes: 10, liked: true, createdAt: now - 2 * hour, visibility: 'all',
    comments: [
      { id: 'c1', author: '야옹', text: '주댕치님의 책상을 보니 저도 치우고 싶은 마음이 생기네요!!' },
      { id: 'c2', author: '유자차', text: '우와 수고하셨어요' },
      { id: 'c3', author: '멍멍', text: '취준 화이팅!' },
    ],
  },
  {
    id: 'p2', author: '유자차', stage: '취준생', mindCode: 'ABBA', kind: 'personal',
    text: '오래 앉아있어서 몸이 찌뿌둥할 때\n다들 기지개 한 번씩 펴보세요!!\n척추 수술 2000만원...',
    likes: 3, liked: false, createdAt: now - 2 * hour, visibility: 'all',
    comments: [{ id: 'c4', author: '야옹', text: '바로 스트레칭 하러 갑니다' }],
  },
  {
    id: 'p3', author: '뜨개러', stage: '사회초년생', mindCode: 'BBBB', kind: 'group',
    text: '친한 친구와 오랜만에 만나 각자 취미 시간을 가졌습니다.\n역시 친해서 그런지 각자 할 일을 해도 편하더라고요.',
    likes: 6, liked: false, createdAt: now - 2 * hour, visibility: 'all',
    comments: [{ id: 'c5', author: '주댕치', text: '이런 시간 너무 좋네요' }],
  },
  {
    id: 'g1', author: '야옹', stage: '대학생', mindCode: 'ABBA', kind: 'group',
    text: '집 앞 산책로에서 산책을 했습니다!\n강가에서 오리들을 마주쳤는데 너무 귀여웠어요~\n쌀쌀해진 날씨 다들 조심하세요!!',
    likes: 2, liked: true, createdAt: now - 3 * hour, visibility: 'group',
    comments: [
      { id: 'c6', author: '멍멍', text: '오리 사진 귀엽다' },
      { id: 'c7', author: '아무개', text: '날씨 정말 쌀쌀해졌어요' },
      { id: 'c8', author: '김땡땡', text: '저도 산책 가야겠어요' },
    ],
  },
  {
    id: 'g2', author: '멍멍', stage: '대학생', mindCode: 'ABBA', kind: 'group',
    text: '아파트 단지 주변을 걷는데 노을이 너무 예뻐서 기록합니다!\n다들 하늘 한 번씩 보면 좋을 것 같네요',
    likes: 1, liked: true, createdAt: now - 4 * hour, visibility: 'group',
    comments: [{ id: 'c9', author: '야옹', text: '노을 색이 정말 예쁘네요' }],
  },
  {
    id: 'g3', author: '아무개', stage: '대학생', mindCode: 'ABBA', kind: 'group',
    text: '혼자 노래를 들으며 집을 가다가 고양이를 마주쳤습니다!\n자주 마주쳤으면 좋겠어요ㅜㅜ',
    likes: 1, liked: true, createdAt: now - 5 * hour, visibility: 'group',
    comments: [{ id: 'c10', author: '김땡땡', text: '고양이 너무 귀여워요' }],
  },
];

const listeners = new Set<() => void>();
const emit = () => listeners.forEach((listener) => listener());
const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};
const getSnapshot = () => posts;

const update = (id: string, change: (post: Post) => Post) => {
  posts = posts.map((post) => (post.id === id ? change(post) : post));
  emit();
};

export const usePosts = () => useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

export const usePost = (id: string | undefined) => usePosts().find((post) => post.id === id);

export const toggleLike = (id: string) =>
  update(id, (post) => ({ ...post, liked: !post.liked, likes: post.likes + (post.liked ? -1 : 1) }));

export const addComment = (id: string, text: string) =>
  update(id, (post) => ({
    ...post,
    comments: [...post.comments, { id: `c${Date.now()}`, author: currentUser.name, text }],
  }));

export const addPost = (input: { kind: MissionKind; text: string; imageUri?: string; visibility: Visibility }) => {
  const post: Post = {
    id: `p${Date.now()}`,
    author: currentUser.name,
    stage: currentUser.stage,
    mindCode: currentUser.mindCode,
    kind: input.kind,
    text: input.text,
    imageUri: input.imageUri,
    likes: 0,
    liked: false,
    comments: [],
    createdAt: Date.now(),
    visibility: input.visibility,
  };
  posts = [post, ...posts];
  emit();
};

export const currentUser = { name: '야옹', stage: '대학생', mindCode: 'ABBA' as MindCode };

export const groupInfo = {
  name: 'Team대학생',
  stage: '대학생',
  mindCode: 'ABBA' as MindCode,
  members: ['야옹', '멍멍', '아무개', '김땡땡'],
  capacity: 4,
  weekRange: '11/2 ~ 11/8',
  missionTitle: '한 주의 휴식 풍경',
  missionDescription: '이번 주 혼자 쉬며 좋았던 장면 하나를 찾아\n그룹에 남겨주세요!',
  done: 3,
  total: 4,
};

export const timeAgo = (createdAt: number) => {
  const hours = Math.max(1, Math.round((Date.now() - createdAt) / (60 * 60 * 1000)));
  return hours >= 24 ? `${Math.floor(hours / 24)}일 전` : `${hours}시간 전`;
};
