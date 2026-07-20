import { useTonConnectUI, useTonAddress, useTonWallet as useTonWalletRaw } from '@tonconnect/ui-react';
import { useCallback, useEffect, useRef } from 'react';
import { setAuthToken } from '../lib/api';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

/** Статический хелпер — не мутирует api-синглтон, вызывается напрямую. */
async function walletAuth(walletAddress: string) {
  const res = await fetch(`${API_BASE}/auth/wallet`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ walletAddress }),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Network error' }));
    throw new Error(error.message || `HTTP ${res.status}`);
  }

  return res.json();
}

/**
 * Hook for TON wallet connection and authentication.
 * Handles the full flow: connect wallet → call backend → store JWT.
 */
export function useTonWallet() {
  const [tonConnectUI] = useTonConnectUI();
  const rawWallet = useTonWalletRaw();
  const walletAddress = useTonAddress();

  const connected = !!rawWallet && !!walletAddress;

  // Re-entry guard: предотвращает повторные вызовы auth при каждом монтировании
  // компонента с уже подключённым кошельком.
  const lastAuthedAddress = useRef<string | null>(null);

  useEffect(() => {
    if (!walletAddress) return;
    // Уже аутентифицировались с этим адресом — не дёргаем бэкенд повторно
    if (lastAuthedAddress.current === walletAddress) return;

    let cancelled = false;
    (async () => {
      try {
        const result = await walletAuth(walletAddress);
        if (cancelled) return;
        if ('token' in result) {
          setAuthToken(result.token);
          lastAuthedAddress.current = walletAddress;
          console.log('Wallet authenticated:', {
            userId: result.user.id,
            wallet: walletAddress.slice(0, 6) + '...',
          });
        }
      } catch (error) {
        if (!cancelled) {
          console.error('Wallet auth failed:', error);
          // Don't block UI — user can still browse
        }
      }
    })();
    return () => { cancelled = true; };
  }, [walletAddress]);

  const connect = useCallback(() => {
    tonConnectUI.openModal();
  }, [tonConnectUI]);

  const disconnect = useCallback(() => {
    tonConnectUI.disconnect();
    setAuthToken(null);
    lastAuthedAddress.current = null;
  }, [tonConnectUI]);

  return {
    connected,
    walletAddress: walletAddress || null,
    connect,
    disconnect,
  };
}