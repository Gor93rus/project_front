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