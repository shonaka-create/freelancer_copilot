const STORAGE_KEY = 'af_plan_status';
const TRIAL_DAYS = 7;

export type PlanState =
  | { plan: 'free' }
  | { plan: 'trial'; startedAt: string; expiresAt: string; daysLeft: number }
  | { plan: 'trial_expired'; expiredAt: string }
  | { plan: 'pro'; subscribedAt: string };

type RawData = {
  plan: string;
  startedAt?: string;
  expiresAt?: string;
  subscribedAt?: string;
};

function computeState(raw: RawData): PlanState {
  if (raw.plan === 'pro') return { plan: 'pro', subscribedAt: raw.subscribedAt! };
  if ((raw.plan === 'trial' || raw.plan === 'trial_expired') && raw.expiresAt) {
    const now = Date.now();
    const exp = new Date(raw.expiresAt).getTime();
    if (now < exp) {
      const daysLeft = Math.ceil((exp - now) / 86400000);
      return { plan: 'trial', startedAt: raw.startedAt!, expiresAt: raw.expiresAt, daysLeft };
    }
    return { plan: 'trial_expired', expiredAt: raw.expiresAt };
  }
  return { plan: 'free' };
}

export function loadPlanState(): PlanState {
  if (typeof window === 'undefined') return { plan: 'free' };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? computeState(JSON.parse(raw) as RawData) : { plan: 'free' };
  } catch {
    return { plan: 'free' };
  }
}

export function startTrial(): PlanState {
  const startedAt = new Date().toISOString();
  const expiresAt = new Date(Date.now() + TRIAL_DAYS * 86400000).toISOString();
  const data = { plan: 'trial', startedAt, expiresAt };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  window.dispatchEvent(new Event('af-plan-changed'));
  return computeState(data);
}

export function upgradeToPro(): PlanState {
  const subscribedAt = new Date().toISOString();
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ plan: 'pro', subscribedAt }));
  window.dispatchEvent(new Event('af-plan-changed'));
  return { plan: 'pro', subscribedAt };
}

/** trial または pro ならPRO機能にアクセスできる */
export function hasProAccess(state: PlanState): boolean {
  return state.plan === 'trial' || state.plan === 'pro';
}
