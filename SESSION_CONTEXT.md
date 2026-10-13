# Контекст сессии — 12.10.2026

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
3. **План уточнён11.10:** читаемость полосы (ed192fd запушен) → отдельный джекпот в полосе → большие числа и TON → тикер.
   Global Jackpot не переименовывать. Джекпот полосы принят и запушен `68cdfd4`.
   Большой счётчик675,000/1,250,000/12,500,000 проверен12.10, авто-fit не потребовался:
   все значения уже помещались без clipping/скачков высоты. TON amber и тикер приняты.
   Пользователь явно запросил документирование, коммит и push текущих четырёх файлов.
4. После этих шагов пользователь хочет визуальные предложения по The Market из design system.
   Изучить референс заново; если Behance недоступен, запросить скриншоты, не выдавать память за изучение.
5. **После Beam.ai пользователь11.10 выбрал продолжать визуальный план.** Технические находки
   только зафиксировать; Telegram/auth/RLS/performance/рефакторинг не начинать без отдельного запроса.

### 12.10.2026 — тикер: контраст и иерархия (принято, разрешены коммит и push)
- После согласования плана изменены только mobile-only цвета: имя ink0, лотерея ink1,
  фон и border лотереи transparent. Порядок/11px/гэпы8px/padding14px/сумма/аватар сохранены.
  Добавлены классы WinnerRow и nowrap mobile. Desktop визуально прежний.
- Черновик12px/гэпы6px отклонён: длина дорожки и фактическая скорость менялись при46s.
  Финальный вариант сохраняет все8 ширин, высоты и прежний duration.
-360/402/430/1280: height36/38, hero/размеры записей unchanged; page overflow нет.
  Длинная строка Alexander Petrov/12,500,000 TON/Daily Mega Flash:400.22×34.5px;
  без переноса, но на узком экране видна последовательно через маску, не целиком одновременно.
- Снимки с остановкой дорожки браузерной инъекцией в одинаковой позиции;
  animation/fade18px не менялись. Таймер до/после различается, не полный pixel-identical тест.
- Живой UI — база точечного изменения, не исследование The Market.
  Эффекты rays/ticker/sheen/pulse/blur/glow не оптимизировались.
- Diff-check/app typecheck/build прошли; /home/user/ticker_before/after.json,
  ticker_check.py, ticker_compare_360/402/430.png и full screenshots вне repo.
- Пользователь принял показанное сравнение: «ок принимается, документируем, коммит и пуш».
  Фиксируются GlobalJackpotHero.tsx, mobile-home-materials.css и оба документа,
  включая ранее записанные находки Beam.ai; технические исправления не внедрялись.
- Финальные diff-check, app typecheck и build прошли; родитель — `68cdfd4`.
  Хеш нового коммита и результат push проверять через git, без самоссылочного хеша в документе.
  Следующий этап — отдельные предложения Global Jackpot по The Market после нового изучения
  референса; при недоступном Behance запросить скриншоты. Сейчас этот этап не начат.

### 12.10.2026 — проверка больших сумм и TON amber (принято, включено в текущую фиксацию)
- Before/after на360×640,402×874,430×932,1280×900 для67,500/675,000/1,250,000/12,500,000.
  Все суммы изначально помещались: clamp42/11.5vw/64 и шрифт не меняли, auto-fit не добавляли.
- Два inline значения TON в GlobalJackpotHero меняются по compact: color Legendary amber,
  glow Legendary; desktop legacy сохранён. Число/бренд/полоса72px/тикер/лучи/glow карточки неизменны.
-16 пар: геометрия числа/TON/строки/hero идентична before/after, за границы hero не выходят,
  горизонтального overflow нет; высота hero одинакова для всех сумм на каждой ширине.
- Значения теста подменяются в браузере через перехват Vite-модуля; рабочая константа67,500 сохранена.
  Не live/backend проверка; API полосы503 даёт «—». Таймеры на снимках разнятся по моменту съёмки.
- Живой UI служил согласованной базой точечного изменения, не изучение The Market.
  Эффекты rays/ticker/sheen/pulse/blur/glow не удаляли и не оптимизировали.
- Diff-check/app typecheck/build прошли. /home/user/global_amount_check.py,
  global_amount_before/after.json, global_amount_compare_360/402/430.png, full screenshots вне repo.
- Сохранены незакоммиченные обновления документов по Beam из предыдущего шага.
  TON-реализация принята пользователем; после принятия тикера 12.10 получено разрешение
  на коммит и push UI-правок вместе с документацией. Итоговую фиксацию см. выше.

### 11.10.2026 — джекпот в полосе и согласованный источник данных
- Пользователь одобрил добавление Jackpot · X TON и точечную правку useLotteryDrawData.ts.
  Global Jackpot сохраняем; backend draws/current.ts НЕ меняем.
- Проверены публичные backend main src/api/draws/current.ts и src/utils/jackpot.ts:
  lottery.jackpot — отображаемая сумма baseJackpot + currentJackpot; не totalPrizePool/legacy accumulatedJackpot.
- StripItem/RawStripItem теперь несут jackpot; fallback null → «Jackpot · — TON».
  Новая строка только compact; CSS mobile-home72px вместо56px. Desktop56px сохранён.
- Хук страницы выбирает запись по lottery.slug, а не draws[0], и берёт ту же сумму.
  При отсутствии записи/невалидном значении null сохраняет прежний config fallback страницы;
  страница по-прежнему загружает API при входе, не является синхронным snapshot полосы.
- Mock API на360/402/430/1280: Daily Rush675,000; Thunder1,250,000;
  Mega Flash12,500,000; Weekend10,000. Маршруты и суммы после Play совпали.
  Для длинных названий/сумм clipping/overflow нет;503 даёт «—» в полосе.
- App typecheck/build/diff-check прошли; live deployment/физический WebView не проверены.
  Исторические эффекты god-rays/ticker/title sheen/pulse/blur/glow сохранены без оптимизации.
- Артефакты /home/user/jackpot_strip_compare_360/402/430.png, jackpot_strip_after_1/2/3.json,
  jackpot_strip_check.py, jackpot_strip_build.log. Суммы в снимках — тестовые ответы, не live.
- Пользователь явно запросил коммит/push текущей реализации; расположение строк отложено
  до отдельной итерации. Повторные diff-check, app typecheck и build прошли перед фиксацией.
  `68cdfd4` запушен в origin/v0/gor93rus-3494-8455a7c0; HEAD и remote-tracking совпали.
- Обзор Beam.ai получен и сверён; следующая работа остаётся визуальной, а не технической.

### 11.10.2026 — Beam.ai: подтверждения и границы выводов
- Источник /home/user/Attachments/beam.ai_rewew_VrLs5O.txt содержит две рецензии.
  Сверка по текущему коду68cdfd4; не аудит live deployment/Telegram/применённых RLS.
- Подтверждены require/catch в main.tsx и BackButton в App.tsx; telegram-web-app.js не подключён.
  Haptic отдельно исправлен на window.Telegram.WebApp; физическая работа не проверена.
- useTelegram не вызывается; useGamification не реагирует на смену модульного authToken автоматически.
  useTonWallet записывает токен; общей реактивной auth-системы/персистентности/401-flow нет.
- ProfilePage использует MOCK_PROFILE через useProfile. API fallback localhost:3001,
  TON manifest фиксирован на weekendmillions.app; проверять конфигурацию/ресурсы отдельно.
- Дубли двух маршрутов и ручной pushState/PopStateEvent подтверждены; CI/unit/e2e в repo нет.
- Supabase migration SELECT USING(true) допускает все строки для anon/authenticated, если применена.
  Применение/наличие реальных данных не проверено. useUserProgress игнорирует error и не используется;
  stub при отсутствии env отдаёт null без ошибки.
- useApiState mountedRef без cleanup, но потребителей нет; не P0. Cleanup-only рекомендация Beam
  неполна для StrictMode: повторный setup должен восстанавливать mountedRef=true.
- Manrope без найденных явных применений, отсутствующий public/vite.svg и OG bolt.new подтверждены;
  запрет зума требует отдельного решения, не менять автоматически.
- Space Grotesk НЕ мёртвый: используется на других страницах/каруселях. v2-токены применены;
  устаревший комментарий не означает мёртвую систему. 7/9px уже используются в Gamification/Rewards,
  это будущая отдельная задача читаемости, не закрытый legacy-минимум11px для всего продукта.
- PNG в src/assets/cards существуют и упоминаются строковыми путями в data/lotteries.ts;
  они не входят в бандл автоматически только из-за расположения. URL/потребители проверить отдельно.
- Не удалять legacy/v2, RGBA, !important или шрифты механически; не утверждать поломку TON Connect
  лишь из-за другого домена. Технический план позже: Telegram → auth/profile → deployment/RLS → CI/тесты.
- Эта итерация меняет только ROADMAP и SESSION_CONTEXT, дата11.10.2026 сверена с sandbox.
  Визуал/функциональность тогда не менялись. Разрешение на фиксацию этих документов получено
  12.10 после принятия TON и тикера; технические находки остаются отложенными.

### 10.10.2026 — первый шаг hero content (ed192fd запушен)
- Next Draw над названием (вместо конкуренции за ширину одной строки); closes in11px и ink2 вместо ink3.
- Название14px получает всю колонку; полоса56px, Play/сумма/бренд/лучи/канты/glow не менялись.
- Scoped CSS в mobile-home-materials.css + классы/aria-label в LiveDrawStrip; desktop-layout сохранён.
-360/402/430: длинные названия Daily Mega Flash/Weekend Special/Daily Thunder без overflow;
 1280 проверен; typecheck/build/diff-check прошли. Снимки `/home/user/hero_strip_compare_402.png`,
 `hero_strip_compare_430.png`; полные before/after — alignment_before/after_*.
- Пользователь принял шаг и явно запросил коммит/push четырёх текущих файлов.
  10.10 перед фиксацией повторно прошли diff-check, app typecheck и build;
  предупреждения о размере чанка и Browserslist остались. Родитель — `6996bb8`;
  итоговый хеш и статус push проверять через git (без самоссылочного хеша в документе).
- Следующий шаг уточнён11.10: отдельный джекпот в полосе, без переименования Global Jackpot.
- Будущая идея: заменить светящуюся точку логотипом/ассетом ближайшей лотереи,
  текст чуть сместить вправо к Play. Сейчас не реализовано; дождаться ассетов и отдельного визуального шага.

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

- **RewardsPanel исправлен и запушен09.10 (`2cb440b`):** inset-кант, valid color-mix radial/filter.
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
- Telegram-мост: подтверждены require/catch в main.tsx и App.tsx; старый подсчёт «5 мест» не использовать;
  отсутствует `telegram-web-app.js`
  в index.html; haptic на физическом клиенте не проверен.
- 3D-ассеты/lootbox-иконография — пользователь занимается отдельно.
- Логотип ближайшей лотереи вместо точки в hero-strip — будущий отдельный шаг, ассеты ещё не предоставлены.
- Оплата TON, scratch live-data и анимация стирания, другие страницы — вне текущего скоупа.
- Live backend недоступен в sandbox: fallback jackpot 67,500; 7+ цифр с живыми данными не проверены.
- `will-change` у static features — отдельный performance PR, не визуальная задача.
- Bundle warning после шага джекпота: index примерно958.31KB raw /289.63KB gzip; typecheck не включён в CI.

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