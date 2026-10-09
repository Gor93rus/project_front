# Контекст сессии — 09.10.2026

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
2. **Завершено09.10: общая грамматика border/surface/glow.** Превью принято с поправкой
   вернуть внешнее свечение; реализация принята и запушена коммитом `2cb440b`. Роль определяет цвет,
   hero выразительнее. Пользователь явно сказал НЕ делать информационный баннер тише.
3. **Следующий шаг:** конкретизировать проблемы внутреннего содержимого `GlobalJackpotHero`, согласовать превью;
   не считать общий план разрешением на произвольный редизайн hero.

### 09.10.2026 — история превью (затем внедрено с усиленным glow)

- Один рекомендуемый вариант: тонкий кант, общий верхний inset-блик и elevation/glow.
  Ролевые цвета, радиусы, текущие glass/spotlight остаются; FeaturesBanner не приглушается.
- Браузерная DOM/CSS-инъекция из `/home/user/material_preview.py`, UI-исходники не менялись.
  Относительная alpha border top/side/bottom 58/42/28%, inset white14%; hero amber,
  категории сохраняют текущие acid-тона, геймификация amber.
- RewardsPanel: в превью валидный color-mix, inset-кант без изменения геометрии контента,
  radial background и icon filter. Это НЕ исправление исходного TSX — баг там остаётся до реализации.
- Снимки до/после на 402×874/430×932 и проверки360×640: rect карточек идентичны,
  overflow отсутствует; проверены три слайда RewardsPanel. Анимации/таймеры заморожены только для сравнения.
- Behance live reference вернул HTTP400. Изучены присланная v2-спецификация и текущий живой UI;
  не утверждать, что недоступная страница была визуально изучена.
- Эффекты сохранены без performance-правок: god-rays/ticker/title sheen/LiveDraw pulse,
  blur карточек/spotlight/dock, grain overlay. Оптимизация не часть этой итерации.
- Обновлены только ROADMAP и SESSION_CONTEXT; коммита/push нет.
- После одобрения превью: реализация через scoped CSS/токены только мобильной главной,
  измерения и screenshot снова, отдельное одобрение перед коммитом. Не трогать hero content сейчас.

### 09.10.2026 — реализация после поправки пользователя

- Пользователь принял канты, но попросил внешние свечения как «До» на всех блоках;
  сравнения не показывать. Проверочные снимки сохранены внутренне.
- `src/styles/mobile-home-materials.css` импортирован в index.css. Scope `.mobile-home` и max767px.
  Общие custom props вычисляются на каждой карточке (НЕ на предке, иначе dynamic accent не подставится).
- Border top/side/bottom58/42/28%, inset white14%, общая elevation;
  заметный external glow26px/20% без отрицательного spread, hero28px/22%.
- Классы `home-material`, `--hero`, `--level`, `--rewards`; Features через scoped static selector.
  Фоны, blur, spotlight, роли, радиусы и тексты сохранены; overlay-border категорий выключен scoped.
- Hero/Level amber; категории сохраняют acid RGB, Features сохраняет legacy role palette и не приглушён.
- Rewards source bug исправлен: color-mix radial/filter, inset-кант и внешний glow с dynamic accent.
  `border:0` здесь намеренно, это НЕ оставшийся баг: рамка нарисована inset-тенью без изменения content box.
- App typecheck/build/diff-check прошли.360/402/430: все3 Rewards/6 Features проверены,
  computed shadows/filter/radial валидны, horizontal overflow нет;1280 legacy hero сохранён.
- Проверки `/home/user/material_implementation_verification.json`, снимки `material_implemented_*.png`.
- Пользователь принял реализацию и прямо попросил коммит/push. `2cb440b` запушен09.10.2026
  в `origin/v0/gor93rus-3494-8455a7c0`; повторные typecheck/build/diff-check прошли.
  Физический WebView не проверен. Следующий этап — hero content, после согласования конкретной задачи.

### Находки аудита, которые нужно учесть на следующем шаге

- **RewardsPanel исправлен локально09.10:** inset-кант, valid color-mix radial/filter.
  Исходное `${var}99/33/70` удалено. Проверять computed styles, не только CSS.supports.
- Hero border/glow на мобильной главной amber, desktop legacy; поверхность legacy navy сохранена.
- FeaturesBanner: opaque navy + asymmetric bevel/ring/glow, hardcoded role RGBA в `ITEMS`.
  Instant Payouts остаётся coral; не менять роли на rarity автоматически.
- Category: translucent glass + white/8 base и accent overlay; rarity `glowAcid` не равен канону напрямую.
- Gamification: внешний материал на главной amber; ACID_GOLD оставлен fallback вне scope, legacy детали внутри не менялись.
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
- `/home/user/material_preview.py`, `material_preview.json`, `material_compare_402.png`,
  `material_compare_430.png`, `material_after_360_slide_0/1/2.png` — текущее невнедрённое превью.
- `/home/user/floating_dock_verify.py`, `floating_dock_verification.json` — предыдущая проверка дока.
- Референсы: `Attachments/image_NN64Co.png` (ось, старый UI),
  `Attachments/Текстовый_документ_(2)_oh04sj.txt` (точный выбранный floating NavBar).

Не считать скриншоты старого состояния актуальными: перед новой правкой читать файлы и проверять git/DOM.