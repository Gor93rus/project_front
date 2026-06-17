import { useTonConnectUI, useTonAddress, useTonWallet as useTonWalletRaw } from '@tonconnect/ui-react';
import { useCallback, useEffect } from 'react';
import { setAuthToken, api } from '../lib/api';

/**
 * Hook for TON wallet connection and authentication.
 * Handles the full flow: connect wallet → call backend → store JWT.
 */
export function useTonWallet() {
  const [tonConnectUI] = useTonConnectUI();
  const rawWallet = useTonWalletRaw();
  const walletAddress = useTonAddress();

  const connected = !!rawWallet && !!walletAddress;

  // When wallet connects, authenticate with backend
  useEffect(() => {
    if (walletAddress) {
      authenticateWithBackend(walletAddress);
    }
  }, [walletAddress]);

  const authenticateWithBackend = async (address: string) => {
    try {
      const result = await api.walletAuth(address);
      if ('token' in result) {
        setAuthToken(result.token);
        console.log('Wallet authenticated:', {
          userId: result.user.id,
          wallet: address.slice(0, 6) + '...',
        });
      }
    } catch (error) {
      console.error('Wallet auth failed:', error);
      // Don't block UI — user can still browse
    }
  };

  const connect = useCallback(() => {
    tonConnectUI.openModal();
  }, [tonConnectUI]);

  const disconnect = useCallback(() => {
    tonConnectUI.disconnect();
    setAuthToken(null);
  }, [tonConnectUI]);

  return {
    connected,
    walletAddress: walletAddress || null,
    connect,
    disconnect,
  };
}

// Add walletAuth method to api object
declare module '../lib/api' {
  export namespace api {
    function walletAuth(walletAddress: string): Promise<{
      success: boolean;
      isNewUser?: boolean;
      token: string;
      user: {
        id: string;
        tonWallet: string;
        balance: number;
        level: number;
        referralCode: string;
      };
    }>;
  }
}

// Patch api at module level
import { api as apiObj } from '../lib/api';
import type { AuthResponse } from '../lib/api';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

(apiObj as any).walletAuth = async (walletAddress: string) => {
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
};