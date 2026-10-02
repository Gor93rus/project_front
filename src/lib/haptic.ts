/**
 * Telegram Haptic Feedback utility — тактильный отклик при нажатиях.
 *
 * История правки: раньше здесь стоял `require('@twa-dev/sdk')` внутри try/catch.
 * В браузере `require` не существует (Vite не полифилит CJS), поэтому каждый
 * вызов падал с ReferenceError и молча съедался `catch {}` — то есть хелпер не
 * работал никогда: ни в dev-сервере, ни в прод-бандле (проверено кликом по табу
 * NavBar: роут менялся, вызовов HapticFeedback — 0).
 *
 * Теперь обращаемся к `window.Telegram.WebApp` напрямую — это тот же объект,
 * который предоставляет Telegram WebApp API. Если объекта нет (обычный браузер,
 * сайт открыт вне Telegram) — вызовы остаются безопасным no-op.
 */

type ImpactStyle = 'light' | 'medium' | 'heavy' | 'rigid' | 'soft';
type NotificationType = 'error' | 'success' | 'warning';

interface TelegramHaptics {
  impactOccurred?: (style: ImpactStyle) => void;
  notificationOccurred?: (type: NotificationType) => void;
  selectionChanged?: () => void;
}

function getHaptics(): TelegramHaptics | undefined {
  try {
    const tg = (window as unknown as { Telegram?: { WebApp?: { HapticFeedback?: TelegramHaptics } } }).Telegram;
    return tg?.WebApp?.HapticFeedback;
  } catch {
    return undefined;
  }
}

export function hapticImpact(style: ImpactStyle = 'light') {
  try {
    getHaptics()?.impactOccurred?.(style);
  } catch {
    // no-op вне Telegram
  }
}

export function hapticNotification(type: NotificationType = 'success') {
  try {
    getHaptics()?.notificationOccurred?.(type);
  } catch {
    // no-op вне Telegram
  }
}

export function hapticSelection() {
  try {
    getHaptics()?.selectionChanged?.();
  } catch {
    // no-op вне Telegram
  }
}
