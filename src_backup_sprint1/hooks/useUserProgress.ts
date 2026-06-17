import { useEffect, useState } from 'react';
import { supabase, type UserProgress } from '../lib/supabase';

export function useUserProgress(userKey = 'demo') {
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_key', userKey)
        .maybeSingle();
      if (!cancelled) {
        setProgress(data);
        setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [userKey]);

  return { progress, loading };
}
