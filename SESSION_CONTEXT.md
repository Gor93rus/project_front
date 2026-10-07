# Контекст сессии — 07.10.2026

## Проект и рабочая среда

Weekend Millions — фронтенд TON-лотерей, открываемый через Telegram-бота.
Наличие `window.Telegram.WebApp` на реальном клиенте не подтверждено; не обещать физический haptic.

- Репозиторий: `Gor93rus/project_front`, ветка `v0/gor93rus-3494-8455a7c0`.
- Sandbox: `/home/user/pf_review`; Vite preview `http://localhost:5183/`.
- **npm** канонический, `package-lock.json`; не менять пакетный менеджер.
- Typecheck: `npx tsc -p tsconfig.app.json --noEmit`. Bare tsc с solution-style root ничего не проверяет.
- Перед коммитом: `git diff --check`, app typecheck, `npm run build`.
- UI английский, комментарии и коммиты русские.
- Playwright: свежий `chromium.launch(channel='chrome', args=['--no-sandbox','--disable-gpu'])`.
  Старый CDP Chrome зависал; не полагаться на него.

## Обязательный процесс с каждой итерацией

Одна визуальная проблема → одинаковый viewport до/после → письменная дизайнерская самопроверка
→ показать пользователю → дождаться одобрения → коммит. Push только по явному разрешению.
Если пользователь уже прямо попросил коммит и push, повторно не спрашивать.

**Новое требование пользователя от 07.10:** обновлять `FRONTEND_ROADMAP.md` и этот файл
с каждой итерацией: корректная дата, выполненное, проверки, ограничения, предстоящая работа.
Устаревшие текущие статусы удалять, завершённую историю сохранять в дневнике.
Не отмечать непроверенное как выполненное. Даты восстановленной истории сверять с `git log`.

Скоуп — **мобильная главная `/`**. Не редизайнить `DailyRushPage`, `ProfilePage`, `LotteryPage`,
`DesktopHome.tsx`, `/lotteries`, `/scratch-cards`. Общий Header уже менялся по отдельному одобрению.
Не смешивать визуал с механическим рефакторингом/performance.
Основные viewports 402×874, 430×932; дополнительно 360×640. Safe-area 62/34 — эмуляция, не реальный iPhone.

## Текущее состояние UI

- Токены: `src/styles/design-tokens.css`, v2 Carbon OLED / Drop Economy + legacy.
- Switzer (`--font-display`) и JetBrains Mono; v2-шкала отличается от legacy Tailwind-шкалы.
- `DESIGN_SYSTEM.md` местами устарел: код, октябрьский дневник и текущие измерения важнее старых статусов.
- Hero → информационный FeaturesBanner → Draw на всю ширину → Scratch/Mystic 50/50
  → Level & rewards / RewardsPanel **теперь тоже 50/50** → футер за первым экраном.
- Draw=Epic, Scratch=Rare, Mystic=Mythic; все три сейчас используют `glass`.
- Ролевые радиусы: feature/gamification/rewards 18px, category 22px, hero 28px. Это не баг само по себе.
- Стек `.mh-stack` исключает футер из расчёта высоты; строки только grow, без shrink ниже контента.
- Haptic helper исправлен в сентябре на прямой `window.Telegram.WebApp.HapticFeedback`;
  категории/геймификация/rewards имеют hover/tap, Header/hero — только haptic без движения.
  FeaturesBanner неинтерактивен. Проверялась цепочка через стаб, не физический отклик.

## Выполнено после предыдущего контекста

Подробная ранняя история — в `FRONTEND_ROADMAP.md`; этот файл описывает состояние для следующего агента.

### 03.10.2026 — hero (`eef928a`, `01fc25c`)
- Бренд уменьшен, число увеличено; amber `#FFB800` в числе/подписи/Play.
- Число `role="img"` + aria-label; reduced-motion для god-rays/ticker/title sheen и пульса LiveDrawStrip.
- **Важно:** название коммита «единое золото» не означает завершённую миграцию:
  внешний border/glow ещё на legacy `--gold-18/--gold-dim` (`#FADB14`).

### 04.10.2026 — Header (`2deee60`)
- Дубль названия убран, пустой `aria-hidden` слот оставлен под логотип; общий Header затронут согласованно.

### 05.10.2026 — shell и dock (`52872a1`, `5fe84f6`)
- `.app-shell--carbon` только на `/`, canvas `#08090E`, нейтральная aurora/декор.
- Floating dock только на `/`, выбранный пользователем navy-градиент и нейтральная рамка, без нового неона.
  Радиус 32px, отступы 12px, max-width 480px, `floating?: boolean`, стиль через `--v2-dock-*`.
- В carbon shell: `--dock-h:77px`, `--dock-offset:12px`, `--dock-clearance:16px`;
  main/стек/футер учитывают док, offset и safe-area.
- Другие маршруты сохраняют legacy shell/плоский док.
- Проверены 360/402/430/1280px, эмуляция safe-area 62/34, Cart/Home, haptic через стаб.
  Нижняя граница футера при полном скролле очищает док примерно на 16px.

### 07.10.2026 — read-only аудит и выравнивание
- Аудит выявил secondary `1.08fr/0.92fr`: ось была смещена вправо на 12–15px относительно primary.
- Изменена **одна строка** `src/index.css`: secondary → `repeat(2,minmax(0,1fr))`.
- На 360/402/430px primary/secondary совпадают, центр зазора 180/201/215px;
  внешние отступы 16px и gap16 сохранены. Внутреннее выравнивание текста не менялось.
- Все три слайда RewardsPanel проверены на всех ширинах: нет clipping/горизонтального overflow;
  Invite/Rewards на 360px в две строки. До/после показаны, результат **принят пользователем**.
- `git diff --check`, app typecheck, build прошли. Пользователь прямо разрешил **коммит и push**
  выравнивания вместе с актуализацией этих двух документов.
- Родитель этой итерации `5fe84f6`; хеш нового коммита смотреть через `git log -1`
  (документация входит в тот же коммит, не хранить самоссылочный хеш).

## Предстоящая работа — согласованный порядок

1. Выравнивание нижнего ряда завершено и принято. После коммита/push не расширять этот шаг.
2. **Следующий визуальный шаг: общая грамматика border/surface/glow.** Сначала изучить текущий код
   и выбранные ранее референсы, показать превью и дождаться отдельного одобрения.
   Система не означает одинаковые карточки: роль определяет цвет, hero выразительнее,
   информационный баннер тише; согласовать толщину/блик/силу glow и материал.
3. Затем, после одобрения системы, внутреннее содержимое `GlobalJackpotHero`.

### Находки аудита, которые нужно учесть на следующем шаге

- **Реальный баг RewardsPanel:** `${slide.accent}99/33/70` при accent=`var(--...)`
  даёт невалидный цвет. Computed: border `0px none`, radial background `none`, filter `none`.
  `CSS.supports` с unresolved var давал true — проверять computed styles, не только синтаксис.
  Исправить отдельно в шаге системы бордеров, не выдавать за выполненное сейчас.
- Hero border/glow на legacy gold, поверхность legacy navy; явные число/подпись/Play уже amber.
- FeaturesBanner: opaque navy + asymmetric bevel/ring/glow, hardcoded role RGBA в `ITEMS`.
  Instant Payouts остаётся coral; не менять роли на rarity автоматически.
- Category: translucent glass + white/8 base и accent overlay; rarity `glowAcid` не равен канону напрямую.
- Gamification: отдельный `ACID_GOLD=rgba(255,214,0,0.6)` и legacy gold детали.
- Запрета всех inline-стилей в проверенных дизайн-документах нет. Динамический progress/цвет/CSS-vars
  допустимы; повторяющиеся статические материалы стоит вынести в общие CSS-токены/классы.
  Один механический перенос в CSS не доказывает визуального/performance улучшения.

## Отложено / не начинать без отдельного запроса

- TON `$0.00 +0.0%` при ошибке данных — пользователь явно выбрал оставить.
- Общий `<RarityCard/>` примитив — вынос отложен, не извлекать автоматически в визуальном шаге.
- Telegram-мост: legacy `require('@twa-dev/sdk')` в пяти местах; отсутствует `telegram-web-app.js`
  в index.html; haptic на физическом клиенте не проверен.
- 3D-ассеты/lootbox-иконография — пользователь занимается отдельно.
- Оплата TON, scratch live-data и анимация стирания, другие страницы — вне текущего скоупа.
- Live backend недоступен в sandbox: fallback jackpot 67,500; 7+ цифр с живыми данными не проверены.
- `will-change` у static features — отдельный performance PR, не визуальная задача.
- Bundle warning остаётся: index примерно 956.58KB raw / 289.16KB gzip; typecheck не включён в CI.

## Файлы и артефакты

Код: `src/index.css`, `App.tsx`, `styles/design-tokens.css`, `styles/lottery-cards.css`,
`GlobalJackpotHero`, `FeaturesBanner`, `CategoryEntryCard`, `GamificationCompact`, `RewardsPanel`,
`Header`, `NavBar`.

Вне repo, не коммитить:
- `/home/user/plan.md` — сохранять по просьбе пользователя, актуальный этап добавлен внизу.
- `/home/user/alignment_check.py`, `alignment_before.json`, `alignment_after.json`;
  `alignment_compare_402.png`, `alignment_compare_430.png`, исходные first-fold/full-page и слайды360.
- `/home/user/system_audit.py`, `system_audit.json`, `system_axis_audit.png` — read-only аудит.
- `/home/user/floating_dock_verify.py`, `floating_dock_verification.json` — предыдущая проверка дока.
- Референсы: `Attachments/image_NN64Co.png` (ось, старый UI),
  `Attachments/Текстовый_документ_(2)_oh04sj.txt` (точный выбранный floating NavBar).

Не считать скриншоты старого состояния актуальными: перед новой правкой читать файлы и проверять git/DOM.