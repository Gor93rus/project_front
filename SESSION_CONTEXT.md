# Контекст сессии — 29.09.2026

## Проект
Weekend Millions — фронтенд лотерей на TON. Продукт живёт как **внешний сайт, который
открывается через Telegram-бота** (не классический Mini App). Это важно для тактильного
отклика и Telegram-моста — см. «Открытые хвосты».

## Репозиторий и ветка
- **remote:** `Gor93rus/project_front`
- **текущая рабочая ветка:** `v0/gor93rus-3494-8455a7c0` (+14 коммитов к `origin/main`)
- **npm** — канонический пакетный менеджер (`package-lock.json`); локи bun/yarn/pnpm в `.gitignore`
- **проверка типов:** `npx tsc -p tsconfig.app.json --noEmit`.
  ⚠️ Без `-p` корневой `tsconfig.json` solution-style (`"files": []`) — он ничего не проверяет
  и всегда молча возвращает код 0, даже при реальных ошибках типов.
- В `tsconfig.app.json` включены `noUnusedLocals` / `noUnusedParameters` — мёртвые переменные валят тайпчек

## Дизайн-система
- **Канон:** `DESIGN_SYSTEM.md` v2.0 (Carbon OLED / Drop Economy, шкала редкости) — заменил «Dark Vault»
- **Единый источник токенов:** `src/styles/design-tokens.css` (namespace `--v2-*`) + `tailwind.config.js`
- Legacy-палитра (`--primary`, `--secondary`, `--gold`, `--bg-0…3`, `--coral`) ещё жива в немигрированных
  компонентах (например, кнопка Connect). Перед правкой смотреть, какие токены компонент использует
  реально, а не полагаться на память
- **Методология:** Huashu Design Framework

---

## Что сделано — Этап 3: миграция мобильной главной на v2.0 (до 29.09.2026)

| Компонент | Что сделано |
|-----------|-------------|
| Шрифт | Подключён **Switzer** вместо Space Grotesk в `--font-display` |
| `GlobalJackpotHero` | God-rays сведены к одному золотому акценту; радиус → `--v2-radius-2xl`; счётчик → `--v2-text-4xl`/900, flat Legendary Gold |
| `FeaturesBanner` / `lottery-cards.css` | Радиус `.feature-card-img` → `--v2-radius-lg` |
| `CategoryEntryCard` | Полный рерайт по Image Bible v2.0: rarity border/shadow, radial spotlight, `--v2-radius-xl`, `text-lg`/`text-3xs`. Rarity: Draw=Epic, Scratch=Rare, Mystic=Mythic |
| `GamificationCompact` | `--gold*` → `--v2-rarity-legendary*`, `rounded-2xl` → `--v2-radius-lg`, типографика 13/10/9/8px → `--v2-text-sm/xs/2xs/3xs` |
| `RewardsPanel` | `rounded-2xl` → `--v2-radius-lg`; акценты Invite→`--v2-primary-from`, Streak→`--v2-rarity-legendary`, Rewards→`--v2-cyber-purple` |
| Раскладка `MobileHome` | Draw Lotteries во всю ширину, Scratch/Mystic в 2 колонки ниже; pill-чип (текст+стрелка) убран со всех трёх карточек |
| Фон страницы | Dot-grid микротекстура |

**Служебное:** удалён мёртвый импорт `LiveWinsPanel` и unused-переменные (найдено правильным прогоном
`tsc -p tsconfig.app.json`); в `DESIGN_SYSTEM.md` зафиксирована команда проверки типов.

---

## Что сделано — 29.09.2026: геометрия и интерактив мобильной главной

### 1. Геометрия 16px-ритма и футер за фолдом (коммит `55718ec`)

Корневая причина была не в отступах, а во `flex: X 1 0` + `min-height`: при `basis: 0` и включённом
shrink строка сжималась ниже собственного контента (вторичная строка: бокс 104px против контента
124–126px), и карточки с `overflow: hidden` вылезали на футер. Второй источник — `.mobile-home--compact
{ min-height: 100vh − … }` считал футер частью высоты и вытаскивал его в видимую зону.

- футер вынесен из расчётной области в новый враппер `.mh-stack`;
- `min-height: calc(100dvh − var(--header-h) − var(--safe-area-top) − 8px − var(--dock-h) − var(--safe-area-bottom) + 16px)`;
- строки: `flex: 1.3 0 auto` (Draw) / `1.15 0 auto` (primary) / `1 0 auto` (secondary) — **только grow, никогда shrink**;
- гэпы унифицированы: 16px между карточками, 24px перед футером, горизонтальные гэпы 16px; hero inset 12px → 16px;
- `grid-auto-rows: 1fr`; у gamification снят `max-height: 104px`; убран лишний div 12px;
- `main` paddingBottom 72px → `calc(var(--dock-h) + var(--safe-area-bottom))`;
- новые токены: `--dock-h: 75px`, `--header-h: 53px`.

Проверено: 402×874 — верх футера 816 при доке 799 (было 760 / 39px видимой полосы); 430×932 — 873 при 857
(было 88px видимой полосы); 360×640 — 806 при 565. Пиксельный диф с замороженными анимациями (футер есть /
`display:none`) в зоне карточек y=300…798 — **0 AE**, полоса дока максимум 3/255.

Осознанный компромисс: на реальном iPhone с safe-area (62/34) контент 743px против свободных 642px —
нижняя строка может уйти под док примерно на 100px; страница в этом случае скроллится, а не сплющивается.

### 2. Хелпер haptic был мёртвым кодом — починен (коммит `fa931c3`)

`src/lib/haptic.ts` вызывал `require('@twa-dev/sdk')` внутри `try { … } catch {}`. В браузере
`typeof require === "undefined"` → `ReferenceError` → молчаливый no-op. То есть хелпер не работал
**никогда**, ни в dev, ни в прод-бандле, а «галочки haptic ✓» на NavBar / PremiumButton / ProfilePage
были фиктивными. Доказано кликами, а не чтением: роут менялся, вызовов `HapticFeedback` — 0.

Переписано на прямое обращение к `window.Telegram.WebApp.HapticFeedback`. Сигнатуры не менялись:
`hapticImpact(style='light')`, `hapticNotification(type='success')`, `hapticSelection()`. Вне Telegram —
безопасный no-op.

### 3. Интерактив — отклик у всех кликабельных карточек

- `CategoryEntryCard`, `GamificationCompact`, `RewardsPanel` — haptic + `whileHover={{y:-3}}` + `whileTap={{scale:0.97}}`
  (`GamificationCompact` и `RewardsPanel` для этого переведены с `<button>` на `<motion.button>`);
- `GlobalJackpotHero` (hero-полоса) и `Header` (`WalletButton`) — **только haptic, без движения**;
- `RewardsUnlockBanner` — haptic на обеих кнопках;
- `FeaturesBanner` — карточки объявлены неинтерактивными: убраны `whileTap`, hover и haptic, добавлен
  класс `.feature-card-img--static` (CSS-`:hover` теперь `.feature-card-img:hover:not(.feature-card-img--static)`,
  `cursor: default`). Hover у desktop-варианта (`DesktopCard` из `DesktopHome`) сохранён.

Проверено: rest-состояния всех элементов идентичны до/после (позиции `getBoundingClientRect()` совпадают),
диф зоны карточек — **0 AE**; haptic — ровно один `impact:light` на клик, 6/6 сценариев.

### 4. Решения итерации (зафиксировано)

- Хэдер и GlobalJackpotHero **не двигаются вообще** — им достаётся только haptic;
- FeaturesBanner — карточки-подписи, роутов за ними нет и не планируется, поэтому никакой интерактивности;
- футер оставлен в разметке, но обязан уходить за фолд;
- отступы гибридно: гэпы фиксированы, высоты карточек адаптивные;
- порядок работы: геометрия → интерактив, каждый шаг отдельно со скриншотами и явным одобрением.

---

## Отложено ранее (не начинать без отдельного разрешения)

- `--bg-0` → `--v2-bg-page` для фона страницы — не начато, страница ещё на legacy-токене
- `<RarityCard/>` как переиспользуемый примитив (Этап 4) — не начато, ждёт второго потребителя
- 3D-артефакты / текстуры карточек (Этап 6) — ждут ассетов от пользователя
- Оплата тикета в TON — отложено до продакшена, в dev не работает
- Loot-box иконография — пользователь работает над этим сам, отдельно
- Этап 5: `DailyRushPage`, `ProfilePage`, `LotteryPage`, `DesktopHome.tsx`, `/lotteries`, `/scratch-cards`

## Открытые хвосты (на 29.09.2026)

1. **Telegram-мост в `src/main.tsx` мёртв** — тот же паттерн `require('@twa-dev/sdk').default` внутри
   try/catch. Не работают: `ready()`, `expand()`, `disableVerticalSwipes()`, `setHeaderColor()` /
   `setBackgroundColor()`, `enableClosingConfirmation()`, `themeParams` → CSS-переменные, `themeChanged`,
   `viewportChanged`. В `src/App.tsx` (~строка 173) на том же паттерне висит `useTelegramBackButton()`
   (Telegram `BackButton`). Всего 5 мест. Сознательно не тронуто в этой итерации.
2. **Haptic не проверен в живом Telegram-клиенте.** Доказана только цепочка вызова (стаб +
   6/6 `impact:light`). В `index.html` **нет скрипта `telegram-web-app.js`**, а продукт открывается как
   внешний сайт через бота — значит `window.Telegram.WebApp` может не инжектиться вообще, и haptic в
   продакшене останется no-op. Требует проверки в реальном клиенте.
3. **`will-change: transform` на `.feature-card-img`,** который больше не двигается — материал для
   отдельного GPU/performance-PR (по правилу «технические улучшения ≠ визуальные» в этот шаг не входит).
4. **Инвертированная иерархия яркости** — средний RGB строки Scratch/Mystic (49,48,74) выше hero (40,47,59):
   самый громкий блок на экране не hero.
5. Кнопка Connect использует legacy `--primary` вместо v2-градиента cyan→blue.
6. Док-бар: по доке — плавающий (`--v2-radius-dock: 32px`), фактически — плоская полоса во всю ширину.

## Актуальный техдолг (проверено 29.09.2026)

- [x] ~~`useTonWallet.ts` + `api.ts` — конфликт `export const api` / `export namespace api`~~ ✅ Исправлено 25.07: в `api.ts` остался только `export const api`
- [x] ~~`useTonWallet.ts` — отсутствует `api.walletAuth` в типе `api`~~ ✅ Исправлено 25.07: `walletAuth` есть в `api.ts`, типизирован через `WalletAuthResponse`
- [x] ~~Дублирование scroll-логики Header/NavBar~~ ✅ Исправлено 25.07: создан `src/hooks/useScrolled.ts`
- [x] ~~Скриншоты/артефакты в `public/`~~ ✅ Почищено 25.07
- [x] ~~TS6133 (неиспользуемые переменные)~~ ✅ `tsc -p tsconfig.app.json --noEmit` даёт 0 при включённых `noUnusedLocals`/`noUnusedParameters`
- [ ] `useScratchGames()` написан (`src/hooks/useLotteries.ts`), но к UI не подключён — `src/data/lotteries.ts` держит заглушку с TODO
- [ ] Bundle: `dist/assets/index-*.js` — 956 KB raw / gzip 289 KB, Vite ругается на чанк > 600 KB (нужен code-splitting)
- [ ] `tsc` не в CI — `vite build` зелёный даже при красном тайпчеке

## Вне скоупа (не трогать без явного запроса)
`DailyRushPage`, `LotteryPage`, `ProfilePage`, `HeroCarousel`, `PremiumButton`, `useLotteryDrawData`,
`DesktopHome`, роуты `/lotteries` и `/scratch-cards`

## Критичные правила
- **НИКОГДА не пушить без вопроса** «Изменения готовы, запушить в origin?» — push это отдельное
  явное разрешение на каждый конкретный коммит
- Не принимать решения за пользователя; на размытый бриф («улучши») — спрашивать, не угадывать
- Один шаг = одна конкретная визуальная проблема → скриншот до/после → показать пользователю →
  коммит только после одобрения
- Технические улучшения ≠ визуальные; GPU/performance — отдельным PR
- Перед коммитом: `npx tsc -p tsconfig.app.json --noEmit` + `npm run build`
- English only в UI-тексте; комментарии и коммиты — по-русски

---

## Архив — состояние на 25.07.2026

Исходные локальные пути пользователя: фронтенд `C:\Users\gor93\Desktop\project-bolt-sb1-w6vka57w\lottery-frontend2`,
бэкенд `C:\Users\gor93\Desktop\lottery-backend-main`. Дизайн-система тогда называлась «Dark Vault»
(Space Grotesk + JetBrains Mono, ролевые токены `--primary`/`--gold`/`--coral`) — сейчас заменена на v2.0.

Коммиты в `main` того периода:
```
7242525 — Merge PR #18
d158180 — fix-homepage-bugs-and-features
e08053a — fix: remove card images, unify bevels, gamification connect flow
0ed6c0d — docs: update roadmap to reflect homepage changes 21-24.07.2026
```

Сделано на главной тогда: `GlobalJackpotHero` подвязан к `api.getLotteryList()` (skeleton-shimmer,
fallback 67 500 TON, починен обрез тикера «Recent wins»); `FeaturesBanner` стал слайдером по 2 карточки
с авто-сменой 5с; `LotteryCarousel`/`ScratchCarousel` — 3 состояния, картинки удалены в пользу градиентов,
фаски унифицированы, fade-маски расширены; `GamificationBanner` — pulse-glow на замке и `connect()` без кошелька;
Header/NavBar — непрозрачный фон с блюром и общий хук `useScrolled`.
