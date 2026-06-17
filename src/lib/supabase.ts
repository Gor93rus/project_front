import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL as string;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(url, key, {
  auth: { persistSession: false },
});

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
