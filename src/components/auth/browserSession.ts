export const browserAuthEnabled = process.env.EXPO_PUBLIC_WEB_AUTH === 'true';

export const kakaoLoginUrl = 'https://mindot.kro.kr/api/auth/kakao';

function csrfHeaders() {
  const token = document.cookie.split(/;\s*/).find((cookie) => cookie.startsWith('XSRF-TOKEN='));
  return token ? { 'X-XSRF-TOKEN': decodeURIComponent(token.slice('XSRF-TOKEN='.length)) } : undefined;
}

function postAuth(action: 'refresh' | 'logout') {
  return fetch(`/api/auth/${action}`, {
    method: 'POST',
    credentials: 'same-origin',
    headers: csrfHeaders(),
  });
}

let refreshing: Promise<Response> | undefined;

export async function sessionFetch(path: `/api/${string}`, options?: RequestInit) {
  const request = () => {
    const headers = new Headers(options?.headers);
    if (options?.method && options.method !== 'GET') {
      const csrf = csrfHeaders();
      if (csrf) headers.set('X-XSRF-TOKEN', csrf['X-XSRF-TOKEN']);
    }
    return fetch(path, { ...options, headers, credentials: 'same-origin' });
  };
  const response = await request();
  if (response.status !== 401) return response;

  refreshing ??= postAuth('refresh').finally(() => { refreshing = undefined; });
  return (await refreshing).ok ? request() : response;
}

export const getMyType = () => sessionFetch('/api/me/type');

export async function logout() {
  const session = await getMyType();
  if (session.status === 401) return;
  if (!session.ok && session.status !== 409) throw new Error('로그인 상태를 확인하지 못했어요.');
  const response = await postAuth('logout');
  if (!response.ok) throw new Error('로그아웃하지 못했어요. 다시 시도해 주세요.');
}
