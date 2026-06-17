import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// ──────────────────────────────────────────────
// Telegram WebApp — полная инициализация
// ──────────────────────────────────────────────
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const WebApp = require('@twa-dev/sdk').default;

  // 1. Разворачиваем на весь экран
  WebApp.expand();

  // 2. Отключаем вертикальные свайпы (чтобы не вылетать из приложения)
  WebApp.disableVerticalSwipes();

  // 3. Устанавливаем цвет хедера под дизайн приложения
  WebApp.setHeaderColor('#050818');

  // 4. Устанавливаем цвет фона
  WebApp.setBackgroundColor('#050818');

  // 5. Включаем подтверждение закрытия
  WebApp.enableClosingConfirmation();

  // 6. Применяем тему Telegram к CSS-переменным
  const theme = WebApp.themeParams;
  if (theme) {
    const root = document.documentElement;
    if (theme.bg_color) root.style.setProperty('--tg-bg-color', theme.bg_color);
    if (theme.text_color) root.style.setProperty('--tg-text-color', theme.text_color);
    if (theme.hint_color) root.style.setProperty('--tg-hint-color', theme.hint_color);
    if (theme.link_color) root.style.setProperty('--tg-link-color', theme.link_color);
    if (theme.button_color) root.style.setProperty('--tg-button-color', theme.button_color);
    if (theme.button_text_color) root.style.setProperty('--tg-button-text-color', theme.button_text_color);
    if (theme.secondary_bg_color) root.style.setProperty('--tg-secondary-bg-color', theme.secondary_bg_color);
    if (theme.header_bg_color) root.style.setProperty('--tg-header-bg-color', theme.header_bg_color);
    if (theme.bottom_bar_bg_color) root.style.setProperty('--tg-bottom-bar-bg-color', theme.bottom_bar_bg_color);
    if (theme.accent_text_color) root.style.setProperty('--tg-accent-text-color', theme.accent_text_color);
    if (theme.section_bg_color) root.style.setProperty('--tg-section-bg-color', theme.section_bg_color);
    if (theme.section_header_text_color) root.style.setProperty('--tg-section-header-text-color', theme.section_header_text_color);
    if (theme.subtitle_text_color) root.style.setProperty('--tg-subtitle-text-color', theme.subtitle_text_color);
    if (theme.destructive_text_color) root.style.setProperty('--tg-destructive-text-color', theme.destructive_text_color);
  }

  // 7. Обработка изменения темы
  WebApp.onEvent('themeChanged', () => {
    const newTheme = WebApp.themeParams;
    if (newTheme) {
      const root = document.documentElement;
      if (newTheme.bg_color) root.style.setProperty('--tg-bg-color', newTheme.bg_color);
      if (newTheme.text_color) root.style.setProperty('--tg-text-color', newTheme.text_color);
      if (newTheme.button_color) root.style.setProperty('--tg-button-color', newTheme.button_color);
      if (newTheme.button_text_color) root.style.setProperty('--tg-button-text-color', newTheme.button_text_color);
    }
  });

  // 8. Обработка изменения размеров окна
  WebApp.onEvent('viewportChanged', () => {
    WebApp.expand();
  });

  // 9. Сообщаем Telegram, что приложение готово
  WebApp.ready();
} catch {
  // Running outside Telegram — graceful no-op
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
