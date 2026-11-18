export const browserAuthEnabled = process.env.EXPO_PUBLIC_WEB_AUTH === 'true';

export const kakaoLoginUrl = 'https://mindot.kro.kr/api/auth/kakao';

function postAuth(action: 'refresh' | 'logout') {
  const token = document.cookie.split(/;\s*/).find((cookie) => cookie.startsWith('XSRF-TOKEN='));
  return fetch(`/api/auth/${action}`, {
    method: 'POST',
    credentials: 'same-origin',
    headers: token ? { 'X-XSRF-TOKEN': decodeURIComponent(token.slice('XSRF-TOKEN='.length)) } : {},
  });
}

let refreshing: Promise<Response> | undefined;

export async function getMyType() {
  const request = () => fetch('/api/me/type', { credentials: 'same-origin' });
  const response = await request();
  if (response.status !== 401) return response;

  refreshing ??= postAuth('refresh').finally(() => { refreshing = undefined; });
  return (await refreshing).ok ? request() : response;
}

export async function logout() {
  const session = await getMyType();
  if (session.status === 401) return;
  if (!session.ok && session.status !== 409) throw new Error('로그인 상태를 확인하지 못했어요.');
  const response = await postAuth('logout');
  if (!response.ok) throw new Error('로그아웃하지 못했어요. 다시 시도해 주세요.');
}
