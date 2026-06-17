/**
 * Telegram Haptic Feedback utility
 * Используется для тактильного отклика при нажатиях
 */
export function hapticImpact(style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft' = 'light') {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const WebApp = require('@twa-dev/sdk').default;
    WebApp.HapticFeedback?.impactOccurred?.(style);
  } catch {
    // no-op outside Telegram
  }
}

export function hapticNotification(type: 'error' | 'success' | 'warning' = 'success') {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const WebApp = require('@twa-dev/sdk').default;
    WebApp.HapticFeedback?.notificationOccurred?.(type);
  } catch {
    // no-op outside Telegram
  }
}

export function hapticSelection() {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const WebApp = require('@twa-dev/sdk').default;
    WebApp.HapticFeedback?.selectionChanged?.();
  } catch {
    // no-op outside Telegram
  }
}
