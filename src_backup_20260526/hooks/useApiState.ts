import { useState, useCallback, useRef } from 'react';

/**
 * Generic states for any async operation.
 * T = data type, E = error type (defaults to string)
 */
export interface ApiState<T, E = string> {
  /** Response data (null until success) */
  data: T | null;
  /** true while request is in flight */
  loading: boolean;
  /** Error message (null unless error) */
  error: E | null;
  /** true if the last request succeeded */
  success: boolean;
  /** true if the last request failed */
  failed: boolean;
}

type Status = 'idle' | 'loading' | 'success' | 'error';

/**
 * useApiState — хук для управления состояниями асинхронных операций.
 *
 * @example
 * const { data, loading, error, execute } = useApiState<Lottery[]>();
 * await execute(() => api.getLotteries());
 */
export function useApiState<T, E = string>() {
  const [status, setStatus] = useState<Status>('idle');
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<E | null>(null);
  const mountedRef = useRef(true);

  const reset = useCallback(() => {
    setStatus('idle');
    setData(null);
    setError(null);
  }, []);

  const execute = useCallback(async (fn: () => Promise<T>): Promise<T | null> => {
    setStatus('loading');
    setError(null);
    try {
      const result = await fn();
      if (mountedRef.current) {
        setData(result);
        setStatus('success');
      }
      return result;
    } catch (err: unknown) {
      if (mountedRef.current) {
        const msg = (err instanceof Error ? err.message : String(err)) as unknown as E;
        setError(msg);
        setStatus('error');
      }
      return null;
    }
  }, []);

  return {
    data,
    loading: status === 'loading',
    error,
    success: status === 'success',
    failed: status === 'error',
    idle: status === 'idle',
    status,
    execute,
    reset,
  } as const;
}
