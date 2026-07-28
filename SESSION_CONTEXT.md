# Контекст сессии — 25.07.2026

## Проект
Weekend Millions — Telegram Mini App на TON Blockchain

## Репозитории
- **Фронтенд:** `C:\Users\gor93\Desktop\project-bolt-sb1-w6vka57w\lottery-frontend2`
- **Бэкенд:** `C:\Users\gor93\Desktop\lottery-backend-main`
- **Git remote:** `https://github.com/Gor93rus/project_front.git` (ветка `main`)

## Коммиты в main (от старых к новым)
```
7242525 — Merge PR #18
d158180 — fix-homepage-bugs-and-features
e08053a — fix: remove card images, unify bevels, gamification connect flow
0ed6c0d — docs: update roadmap to reflect homepage changes 21-24.07.2026
```

## Дизайн-система (Dark Vault)
- Navy-база, ролевая палитра: primary `#0A7CFF`, secondary `#7C3AED`, gold `#FADB14`, emerald `#52C41A`, coral `#FF4D4F`
- Шрифты: Space Grotesk (основной) + JetBrains Mono (числа)
- Анимации: Framer Motion → entrance/layout, CSS keyframes → looping
- Единый источник токенов: `src/styles/design-tokens.css`
- Методология: Huashu Design Framework

## Что сделано на главной странице
| Компонент | Изменения |
|-----------|-----------|
| GlobalJackpotHero | Джекпот + счётчик из `api.getLotteryList()`. Skeleton-shimmer. Fallback 67,500 TON. Тикер «Recent wins» починен (фикс обреза) |
| FeaturesBanner | Слайдер по 2 карточки, авто-смена 5с. Desktop BentoGrid сохранён |
| LotteryCarousel | 3 состояния: Upcoming/Selling/Live. Картинки удалены — только фон с градиентами. Фаски унифицированы со ScratchCarousel |
| ScratchCarousel | Fade-маски расширены (80%→90%), бейджи не обрезаются |
| GamificationBanner | Pulse-glow на замке. Без кошелька — `connect()`, с кошельком — `/profile` |
| Header/NavBar | Всегда непрозрачный фон с блюром. **Исправлено 25.07:** scroll-логика вынесена в общий хук `useScrolled(threshold)`, дублирование устранено, пороги унифицированы |
| Изображения | Файлы в `public/images/`. Пути в коде `/images/card-*.png` — консистентны, Vite+Vercel собирают корректно |

## Актуальный техдолг
- [x] ~~`useTonWallet.ts` + `api.ts` — конфликт `export const api` / `export namespace api`~~ ✅ **Исправлено 25.07:** `walletAuth` перенесён в `api.ts` как обычный метод, `declare module` + `as any` удалены
- [x] ~~`useTonWallet.ts` — `api.walletAuth` отсутствует в типе `api`~~ ✅ **Исправлено 25.07:** типизирован через `WalletAuthResponse`
- [x] ~~Дублирование scroll-логики Header/NavBar~~ ✅ **Исправлено 25.07:** создан `src/hooks/useScrolled.ts`
- [x] ~~Скриншоты/артефакты в `public/`~~ ✅ **Почищено 25.07:** 26 PNG + `.bolt/` + `index_backup.html` + `working.png` удалены
- [ ] `api.getScratchGames()` — хук `useScratchGames()` написан, но не подключён к UI
- [ ] 4 TS-ошибки TS6133 (неиспользуемые переменные) вне скоупа: DailyRushPage, LotteryPage, PremiumButton, useLotteryDrawData
- [ ] Bundle 1.07 MB — предупреждение Vite о чанке > 600 KB (рекомендуется code-splitting)
- [ ] `tsc --noEmit` не в CI — vite build зелёный даже при красном тайпчеке

## Ревью Runable (24.07.2026)
- Проведено read-only ревью на коммите `0ed6c0d`
- Подтверждено: конфликт `api` (8 реальных TS-ошибок, не 4), Header/NavBar scrolled-логика жива, скриншоты в `public/`, `Rules.md` отсутствует, бандл 1.07 MB
- Расхождение: путь к карточкам лотерей — ревью нашёл в `src/assets/cards/`, документ утверждает `public/cards/` (нужна проверка)
- Рекомендации ревьюера выполнены: конфликт `api` исправлен, scroll вынесен в хук, `public/` очищен

## Критичные правила (Rules.md)
- Правила живут в `C:\Users\gor93\Documents\Cline\Rules\rules.md`
- НИКОГДА не пушить без вопроса «Изменения готовы, запушить в origin?»
- Не принимать решения за пользователя
- При работе с фронтендом активировать: impeccable, vercel, huashu-design

## Не в скоупе (не трогать без явного запроса)
DailyRushPage, LotteryPage, ProfilePage, HeroCarousel, PremiumButton, useLotteryDrawData