'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import {
  loadPlanState,
  startTrial as doStartTrial,
  upgradeToPro as doUpgrade,
  hasProAccess,
  PlanState,
} from './planStatus';

export type { PlanState };
export { hasProAccess };

/** このメールアドレスは課金不要で常に PRO */
const PRO_WHITELIST = [
  'nakaebisu.shotaro1543@gmaii.com',
];

const WHITELISTED_STATE: PlanState = { plan: 'pro', subscribedAt: '2026-01-01T00:00:00.000Z' };

async function resolveState(): Promise<{ state: PlanState; whitelisted: boolean }> {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user?.email && PRO_WHITELIST.includes(user.email)) {
      return { state: WHITELISTED_STATE, whitelisted: true };
    }
  } catch {
    // Supabase 取得失敗時は localStorage にフォールバック
  }
  return { state: loadPlanState(), whitelisted: false };
}

export function usePlanStatus() {
  const [state,       setState]       = useState<PlanState>({ plan: 'free' });
  const [hydrated,    setHydrated]    = useState(false);
  const [whitelisted, setWhitelisted] = useState(false);

  useEffect(() => {
    resolveState().then(({ state, whitelisted }) => {
      setState(state);
      setWhitelisted(whitelisted);
      setHydrated(true);
    });

    // ホワイトリスト外のユーザーが plan を変更したとき同期
    const sync = () => {
      resolveState().then(({ state, whitelisted }) => {
        setState(state);
        setWhitelisted(whitelisted);
      });
    };
    window.addEventListener('af-plan-changed', sync);
    return () => window.removeEventListener('af-plan-changed', sync);
  }, []);

  return {
    state,
    hydrated,
    whitelisted,
    isPro: hasProAccess(state),
    // ホワイトリストユーザーは操作しても常に PRO が維持される
    startTrial: () => { if (!whitelisted) setState(doStartTrial()); },
    upgrade:    () => { if (!whitelisted) setState(doUpgrade()); },
  };
}
