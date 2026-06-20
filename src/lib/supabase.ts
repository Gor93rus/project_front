import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const isSupabaseConfigured = Boolean(url && key);

/**
 * Lightweight stub used when Supabase env vars are absent (e.g. preview without
 * the integration connected). It mirrors the chainable query shape the app uses
 * (`.from().select().eq().maybeSingle()`) and resolves to empty data instead of
 * throwing at module load — which would otherwise white-screen the whole app.
 */
function createStubClient(): SupabaseClient {
  const result = Promise.resolve({ data: null, error: null });
  const chain: Record<string, unknown> = {
    select: () => chain,
    insert: () => chain,
    update: () => chain,
    upsert: () => chain,
    delete: () => chain,
    eq: () => chain,
    order: () => chain,
    limit: () => chain,
    single: () => result,
    maybeSingle: () => result,
    then: (...args: Parameters<Promise<unknown>['then']>) => result.then(...args),
  };
  const stub = {
    from: () => chain,
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      signOut: () => Promise.resolve({ error: null }),
    },
  };
  if (import.meta.env.DEV) {
    console.warn(
      '[v0] Supabase env vars missing (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY). ' +
        'Using a stub client — backend reads return empty data. Connect the integration for full functionality.',
    );
  }
  return stub as unknown as SupabaseClient;
}

export const supabase: SupabaseClient = isSupabaseConfigured
  ? createClient(url as string, key as string, { auth: { persistSession: false } })
  : createStubClient();

export interface UserProgress {
  user_key: string;
  level: number;
  level_name: string;
  xp: number;
  xp_for_next: number;
  next_level_name: string;
  streak_days: number;
  bonus_count: number;
  badges_count: number;
}
