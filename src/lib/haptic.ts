/**
 * Telegram Haptic Feedback — полный канон (Design Bible v2 §7.1)
 * selection: переключение табов, выбор номера билета
 * impactLight: клик по карточке, открытие модалки, главная кнопка Play/Купить
 * impactMedium: среднее нажатие
 * success: выпадение Rare/Epic/Legendary, покупка билета
 * error: нехватка средств, ошибка транзакции
 */

type HapticStyle = 'light' | 'medium' | 'heavy' | 'rigid' | 'soft';
type NotificationType = 'error' | 'success' | 'warning';

function getWebApp(): { HapticFeedback?: { impactOccurred: (s: HapticStyle) => void; notificationOccurred: (t: NotificationType) => void; selectionChanged: () => void } } | null {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const WebApp = require('@twa-dev/sdk').default;
    return WebApp;
  } catch {
    return null;
  }
}

export function hapticImpact(style: HapticStyle = 'light') {
  getWebApp()?.HapticFeedback?.impactOccurred?.(style);
}

export function hapticImpactLight() {
  getWebApp()?.HapticFeedback?.impactOccurred?.('light');
}

export function hapticImpactMedium() {
  getWebApp()?.HapticFeedback?.impactOccurred?.('medium');
}

export function hapticNotification(type: NotificationType = 'success') {
  getWebApp()?.HapticFeedback?.notificationOccurred?.(type);
}

export function hapticSuccess() {
  getWebApp()?.HapticFeedback?.notificationOccurred?.('success');
}

export function hapticError() {
  getWebApp()?.HapticFeedback?.notificationOccurred?.('error');
}

export function hapticSelection() {
  getWebApp()?.HapticFeedback?.selectionChanged?.();
}

export const triggerHaptic = {
  selection: hapticSelection,
  impactLight: hapticImpactLight,
  impactMedium: hapticImpactMedium,
  success: hapticSuccess,
  error: hapticError,
};
