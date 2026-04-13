'use client';

import { useState, useEffect } from 'react';
import {
  loadPlanState,
  startTrial as doStartTrial,
  upgradeToPro as doUpgrade,
  hasProAccess,
  PlanState,
} from './planStatus';

export type { PlanState };
export { hasProAccess };

export function usePlanStatus() {
  const [state,    setState]    = useState<PlanState>({ plan: 'free' });
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setState(loadPlanState());
    setHydrated(true);

    // localStorage を他のコンポーネントが書き換えたとき同期する
    const sync = () => setState(loadPlanState());
    window.addEventListener('af-plan-changed', sync);
    return () => window.removeEventListener('af-plan-changed', sync);
  }, []);

  return {
    state,
    hydrated,
    isPro: hasProAccess(state),
    startTrial: () => setState(doStartTrial()),
    upgrade:    () => setState(doUpgrade()),
  };
}
