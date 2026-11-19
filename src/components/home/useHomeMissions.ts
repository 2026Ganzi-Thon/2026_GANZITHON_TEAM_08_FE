import { useEffect, useState } from 'react';

import { getGroupMission, getPersonalMission, type HomeMission } from './homeApi';

type Result = {
  personal?: HomeMission;
  group?: HomeMission;
  personalError?: string;
  groupError?: string;
};

const messageOf = (reason: unknown) => (reason instanceof Error ? reason.message : '미션을 불러오지 못했어요.');

export function useHomeMissions() {
  const [result, setResult] = useState<Result>();

  useEffect(() => {
    const request = new AbortController();
    void Promise.allSettled([getPersonalMission(request.signal), getGroupMission(request.signal)]).then(([personal, group]) => {
      if (request.signal.aborted) return;
      setResult({
        personal: personal.status === 'fulfilled' ? personal.value : undefined,
        personalError: personal.status === 'rejected' ? messageOf(personal.reason) : undefined,
        group: group.status === 'fulfilled' ? group.value : undefined,
        groupError: group.status === 'rejected' ? messageOf(group.reason) : undefined,
      });
    });
    return () => request.abort();
  }, []);

  return { loading: !result, ...result };
}
