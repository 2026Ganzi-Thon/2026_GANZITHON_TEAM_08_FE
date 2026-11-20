import { useEffect, useState } from 'react';

import { getGroupInfo, getGroupMission, type GroupInfo, type GroupMission } from './groupApi';

type Result = {
  info?: GroupInfo;
  mission?: GroupMission;
  infoError?: string;
  missionError?: string;
};

const messageOf = (reason: unknown) => (reason instanceof Error ? reason.message : '불러오지 못했어요.');

export function useGroup() {
  const [result, setResult] = useState<Result>();

  useEffect(() => {
    const request = new AbortController();
    void Promise.allSettled([getGroupInfo(request.signal), getGroupMission(request.signal)]).then(([info, mission]) => {
      if (request.signal.aborted) return;
      setResult({
        info: info.status === 'fulfilled' ? info.value : undefined,
        infoError: info.status === 'rejected' ? messageOf(info.reason) : undefined,
        mission: mission.status === 'fulfilled' ? mission.value : undefined,
        missionError: mission.status === 'rejected' ? messageOf(mission.reason) : undefined,
      });
    });
    return () => request.abort();
  }, []);

  return { loading: !result, ...result };
}
