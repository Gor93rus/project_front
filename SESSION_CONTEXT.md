# Контекст сессии — 17.10.2026

## Проект и рабочая среда

### Последняя итерация17.10 — выбранный материал мобильного hero внедрён
- После выбора «Усиленное — сохраняем» пользователь явно разрешил реализацию, коммит и push.
  Повторное итоговое сравнение и desktop-тестирование отменены пользователем.
  Прежний запрет на UI-код и следующий шаг «итоговое сравнение» больше не актуальны.
- Изменены только GlobalJackpotHero.tsx и mobile-home-materials.css: локальный navy
  #172B46→#0C1629(48%)→#050B17, верхний блик32%/22%, подпись11px/.12em/15px,
  диагонали1px/56px/7%, отражение16%/плечи5%, gold hairline16%/inset shadow.
  Текстура — ::before верхнего контента, следует его высоте без JS и не перекрывает текст.
  Все новые CSS-правила ограничены .mobile-home и шириной до767px; глобальные токены прежние.
- Внешняя рамка/glow, лучи, анимации, сумма/TON, Next Draw, тикер и другие блоки не менялись.
- Проверки реализации: git diff --check, npx tsc -p tsconfig.app.json --noEmit,
  npm run build прошли. Остались предупреждения Browserslist и большого чанка.
- Mobile smoke402×874: hero370×238.203px, подпись11px/15px, Next Draw72px,
  текстура128.203px заканчивается на границе верхнего контента, overflow нет.
  Первая проверка границы попала в входную анимацию Next Draw(y8); повтор после её
  завершения прошёл. Анимации в исходниках не менялись. Desktop не проверялся.
  Проверочные screenshot/json: /home/user/hero_implemented_mobile.* вне repo;
  новых сравнений не делали. Backend локально недоступен, проверен fallback, не live-данные.
- Дизайнерская самопроверка: материал согласован с текущим продуктом, сумма остаётся
  доминантой, Next Draw/Play понятны с первого экрана; улучшена поверхность и читаемость
  подписи, а не перестроена иерархия. Направление принято пользователем на превью.
- Документы обновлены вместе с реализацией. Хеш и результат push смотреть через git;
  не хранить самоссылочный хеш внутри коммита. Следующий визуальный шаг отдельно согласовать.

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
4. **Текущий шаг13.10:** пользователь оставил текущий стык Global Jackpot с Next Draw.
   A/B стыка не внедрять. Глубокий navy A выбран как база следующих браузерных превью.
   Пользователь прямо запретил изменения UI-кода; рабочая заливка остаётся прежней.
   14.10 усиленный внутренний верхний блик принят при прежней золотой рамке, только для превью.
   Подпись Global Jackpot11px/.12em принята для превью; диагональная текстура показана, ждёт оценки.
   Behance HTTP400; изучены пять присланных скриншотов The Market, не память/старый spec.
5. **После Beam.ai пользователь11.10 выбрал продолжать визуальный план.** Технические находки
   только зафиксировать; Telegram/auth/RLS/performance/рефакторинг не начинать без отдельного запроса.

### 14.10.2026 — диагональная текстура (превью, ждёт оценки)
- По детальному запросу пользователя: редкие диагонали repeating-gradient, полупрозрачное
  диагональное отражение, внутренний gold hairline и inset shadow, слегка усиленные.
- Overlay верхнего hero:125deg линии1px через56px alpha7%, отражение max white8.5%,
  inset gold1px/16%, inset нижняя тень50%. Pointer-events:none, z-index1 ниже текста.
  База navy A + выбранный блик + подпись11px; внешний border/glow, лучи, полоса/тикер прежние.
-402×874: hero/число/подпись/полоса/shadow совпали, overflow нет. Снимки одной страницы,
  пауза анимаций/таймеров только в браузере; не performance изменение.
- /home/user/hero_texture_preview.py/json, hero_texture_compare_402.png, _detail.png,
  hero_texture_before/after_402_full.png вне repo. UI-код не менялся; build/typecheck не запускались.
  Ждать оценки перед продолжением; линии могут быть лишним декором. Без внедрения/коммита/push.

### 14.10.2026 — подпись Global Jackpot (выбрана, без внедрения)
- Пользователь выбрал пробу подписи, затем работу над текстурой. Текстуру сейчас не менять.
  База превью — navy A + усиленный верхний блик. Только браузерная инъекция.
- Font10→11px, tracking .22→.12em; computed line-height15px оставлен, чтобы не сдвигать блок.
  Цвет rgba(255,184,0,.55), вес500 и шрифт/название/маржины прежние.
-402×874: hero/число/полоса совпали; подпись114.81→110.89px по ширине, высота15px;
  page overflow нет. Before/after одной страницы, эффекты paused и таймеры удержаны для снимков.
- /home/user/hero_label_preview.py/json, hero_label_compare_402.png, _detail.png,
  hero_label_before/after_402_full.png вне repo. UI-код не изменён, build/typecheck не запускались.
  Пользователь выбрал новую подпись11px для дальнейших превью.
  База: navy A + усиленный верхний блик + подпись11px/.12em с line-height15px.
  Далее согласовать характер текстуры; UI-код по-прежнему не менять, без коммита/push.

### 14.10.2026 — внутренний верхний блик (выбран, без внедрения)
- Пользователь выбрал прежнюю золотую рамку + усиленный внутренний верхний блик.
  Оба снимка на выбранном navy A браузерной инъекцией; рабочие UI-исходники не трогать.
- --home-card-rim: inset0/1px white32% вместо14% + inset0/7px/12px/-10px white22%.
  Золотой border, внешний glow/elevation, лучи/бренд/содержимое/Next Draw прежние.
-402×874: размеры hero/фон/border/glow/elevation/Next Draw background одинаковы,
  page overflow нет. Анимации paused и таймеры удержаны только для снимков.
- Артефакты /home/user/hero_rim_compare_402.png, _detail.png,
  hero_rim_before/after_402_full.png, hero_rim_preview.py/json вне repo.
  Проверка превью прошла; build/typecheck не запускались. Проба тонкая, не доказанное UX улучшение.
  Пользователь выбрал сохранить усиленный блик и идти дальше по блоку.
  Следующие превью на navy A + усиленном блике; UI-код/коммит/push не разрешены.
  Материал выбран; следующую задачу согласовать отдельно. Документы обновлены.

### 13.10.2026 — фон hero: navy A выбран, без внедрения
- Только браузерная заливка hero:155deg #172B46→#0C1629(48%)→#050B17.
  Сверху navy светлее текущего, снизу темнее. Это предложенные цвета, не CSS измерения The Market.
- Пользователь запросил B для сравнения:155deg #20232B→#11141B(48%)→#080A10.
  Текущий/A/B пересняты с одной страницы; проверки размеров/рамки/shadow/Next Draw прошли для обоих.
  Новые файлы /home/user/hero_background_ABC_402.png, _detail.png, hero_navy_B_402_full.png.
-402×874: геометрия hero/числа/полосы, computed рамки/shadow и фон Next Draw совпали;
  page overflow нет. Лучи/центральный radial/бренд/сумма/TON/тикер/другие блоки сохранены.
- Before/after с одной страницы, CSS-анимации paused и таймеры удержаны только для съёмки.
  Эффекты не оптимизировались. Разница тонкая, улучшение UX не доказано.
- /home/user/hero_navy_preview.py/json, hero_navy_compare_402.png, hero_navy_compare_detail.png,
  hero_navy_before/A_402.png и _full.png вне repo. UI-файлы не изменены;
  build/typecheck не запускались. Пользователь выбрал A и попросил запомнить решение,
  но НЕ менять UI-код, а продолжить работу по hero. B не выбран.
  Дальнейшие превью строить на navy A браузерной инъекцией; рабочую заливку не трогать.
  Следующая предлагаемая задача — кант/верхний блик при прежнем внешнем glow и лучах;
  направление ещё требуется согласовать. Документы обновлены, коммита/push нет.

### 13.10.2026 — превью связи hero с Next Draw (текущий стык сохранён)
- Пользователь выбрал связь с полосой первой задачей, поверхность второй; два минимальных варианта.
  Не менять бренд, названия, суммы, размеры шрифтов, внешний glow, лучи/анимации и другие блоки.
- Изучены Attachments/image_WSzwOB.png, image_w4j_lF.png, image_eySXF9.png,
  image_OzPKdH.png, image_gUDCio.png. В The Market действие ниже главного объекта:
  тёмная площадка с локальным золотом, тонкие блики на тёмных карточках.
  Шрифт/точные радиусы по перспективным растр-снимкам не доказаны; 3D/насыщенность не копировать.
- A: Next Draw #0C1629→#080F1E, белый разделитель5% — плавный стык.
  B: та же база + amber radial8% возле Play и разделитель16% — тёплая площадка действия.
  Только CSS-инъекции браузера, без изменений UI-исходников. На402 rect hero/полосы/числа
  идентичны и нет page overflow. Полоса72px, внешняя рамка/glow hero прежние.
- Before/A/B сняты с одной страницы; ticker/rays/sheen paused только в браузере,
  таймеры/слайды удержаны. API fallback «— TON», не live backend проверка.
  Эффекты rays70s/ticker46s/sheen6s/pulse/drop-shadow/blur/grain сохранены; не performance шаг.
- Артефакты вне repo: /home/user/market_compare_402.png, market_before/A/B_402.png,
  market_before/A/B_402_full.png, market_preview.py, market_preview.json.
  Проверка превью прошла; build/typecheck не требовались для неизменённых UI-файлов.
  Пользователь выбрал оставить текущий стык и перейти к обсуждению поверхности hero.
  A/B не внедрены. Документы обновлены; нового разрешения на коммит и push нет.
- Предыдущая фиксация проверена: `97c2aec` запушен, после push дерево было чистым,
  local HEAD и origin/v0/gor93rus-3494-8455a7c0 совпали.

### 12.10.2026 — тикер: контраст и иерархия (принят и запушен 97c2aec)
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