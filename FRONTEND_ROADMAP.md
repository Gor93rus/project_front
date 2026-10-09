# 🎰 Lottery Frontend — Visual & UX Roadmap

> Telegram Mini App · TON Blockchain · 10 тиражных + 5 скретч-лотерей  
> Фокус: визуал, эмоции игрока, гэмблинг UX  
> Последнее обновление: 09.10.2026 (общие канты, блики и внешнее свечение приняты и запушены).
> Текущий скоуп: мобильная главная `/`. Старые завершённые этапы ниже — история, не описание текущего UI.

## Актуальный порядок работы

1. **Выравнивание нижнего ряда — принято 07.10.2026.** Обе колонки 50/50, ось совпадает со Scratch/Mystic.
2. **Завершено 09.10:** общая грамматика бордеров, поверхностей и свечения принята и запушена (`2cb440b`).
   Сохранять ролевые цвета и радиусы 18/22/28; не делать все карточки одинаковыми.
   Уточнение 09.10: информационный баннер НЕ приглушать. Превью принято с поправкой:
   вернуть заметное внешнее свечение уровня «До» и применить ко всем карточкам главной.
3. **Следующий шаг:** уточнить конкретные проблемы внутреннего содержимого `GlobalJackpotHero` и согласовать превью.

Не менять `DailyRushPage`, `ProfilePage`, `LotteryPage`, `DesktopHome.tsx`, `/lotteries`, `/scratch-cards`.
Каждая итерация обновляет этот дневник и `SESSION_CONTEXT.md`: реальная дата, результат,
проверки, ограничения и следующий шаг. Устаревшие открытые статусы удаляются; история сохраняется отдельно.

## Дневник изменений — октябрь 2026

Даты предыдущих реализаций ниже сверены с датами коммитов (`git log`), не с датой обновления документа.

### 03.10.2026 — иерархия hero и reduced-motion (`eef928a`, `01fc25c`)
- Бренд уменьшен, число джекпота увеличено; подпись и Play переведены на amber `#FFB800`.
- Число получило `role="img"` и aria-label; reduced-motion останавливает god-rays, тикер,
  sheen заголовка и пульс LiveDrawStrip.
- **Миграция золота неполная:** внешний border/glow ещё использует legacy `--gold-18/--gold-dim` (`#FADB14`).

### 04.10.2026 — шапка (`2deee60`)
- Убран дубль названия бренда, левый слот сохранён под будущий логотип.
- Это уже согласованное изменение общего Header, действует и на других страницах.

### 05.10.2026 — carbon shell и floating dock (`52872a1`, `5fe84f6`)
- Только на `/`: canvas `--v2-bg-page: #08090E`, нейтральная aurora вместо цветного тумана.
- Плавающий док по выбранному референсу: navy-градиент, нейтральная рамка, без дополнительного неона;
  отступы 12px, радиус 32px, max-width 480px, визуальные значения в `--v2-dock-*`.
- Другие маршруты сохраняют legacy shell и плоский док; `NavBar` получил `floating?: boolean`.
- На главной `--dock-h: 77px`, `--dock-offset: 12px`, `--dock-clearance: 16px`;
  main/стек/футер учитывают док и safe-area.
- Проверены 360/402/430/1280px, эмуляция safe-area 62/34px, переходы Cart/Home и вызов haptic через стаб.
  Не считать это физическим тестированием Telegram/iPhone.

### 07.10.2026 — read-only аудит системы карточек
- Причина смещения нижнего ряда: `1.08fr / 0.92fr` против равных колонок верхнего ряда.
- `RewardsPanel`: добавление `99/33/70` к `var(--...)` даёт невалидные цвета;
  computed styles подтвердили отсутствие бордера, radial background и drop-shadow.
- Материалы сейчас различаются: hero legacy navy/gold; баннер bevel/ring; категории glass + accent overlay;
  геймификация отдельный acid gold. Inline-стили сами по себе не запрещены:
  динамические значения допустимы, повторяющиеся статические материалы требуют общей грамматики.
- Аудит не менял код. Исправление цветов RewardsPanel отнесено к следующему шагу системы бордеров.

### 07.10.2026 — нижний ряд 50/50 (принято пользователем)
- Одна визуальная правка в `src/index.css`: `repeat(2, minmax(0, 1fr))` вместо 1.08/0.92.
- На 360/402/430px обе колонки совпадают с верхним рядом; центр зазора 180/201/215px.
- Проверены все три слайда RewardsPanel: обрезаний/горизонтального overflow нет;
  на 360px Invite и Rewards занимают две строки. Материалы и внутреннее выравнивание не менялись.
- Скриншоты до/после показаны; `git diff --check`, app typecheck и build прошли.
- Пользователь разрешил коммит и push этой итерации вместе с актуализацией документации.

### 09.10.2026 — превью общей грамматики материалов (принято с поправкой на glow)
- Пользователь согласился с тонким кантом, верхним бликом, согласованной тенью, сохранением glass
  и ролевых цветов, но явно исключил приглушение информационного баннера.
- Превью выполнено только DOM/CSS-инъекцией в браузере, без изменений UI-исходников:
  кант 1px, верх/стороны/низ с относительной alpha 58/42/28%, белый inset-блик 14%,
  общая чёрная elevation-тень и цветной glow. Hero использует amber внешнего канта.
- Фоны и spotlight категорий сохранены; фон, bevel и насыщенность FeaturesBanner не приглушались.
- RewardsPanel в превью получил рабочий inset-кант и валидные color-mix для radial/filter;
  исходный баг в TSX пока НЕ исправлен. Inset выбран, чтобы не менять ширину контента при нулевом border.
- Одинаковая геометрия до/после подтверждена на 360/402/430px, горизонтального overflow нет;
  проверены все три слайда RewardsPanel. Пары first-fold и full-page сохранены вне repo.
- Behance The Market при открытии вернул HTTP 400; использованы ранее предоставленная спецификация
  v2 и текущий живой UI, а не выдуманные значения недоступной страницы.
- Зафиксированы существующие эффекты: god-rays/ticker/title-sheen и pulse LiveDrawStrip;
  blur24/saturate140 карточек, blur spotlight, overlay grain, blur dock. Не удалялись и не оптимизировались.
- Артефакты `/home/user/material_compare_402.png`, `material_compare_430.png`,
  `material_preview.py`, `material_preview.json`; это предложение направления, не внедрение.
- Следующий шаг: решение пользователя → перенос выбранной грамматики в scoped CSS/токены
  мобильной главной → проверки → отдельное одобрение реализации. Коммита/push этой итерации нет.

### 09.10.2026 — внедрение кантов и внешнего glow
- Пользователь принял направление, но отметил слишком слабое свечение превью; попросил заметный
  внешний glow как «До» на всех блоках, без показа новых сравнений.
- Добавлен scoped `src/styles/mobile-home-materials.css`: общие кант58/42/28%, white inset14%,
  elevation, внешний glow `0 0 26px` / accent20% без отрицательного spread; hero28px/22%.
- Применено к hero, всем шести слайдам FeaturesBanner, Draw/Scratch/Mystic, Level и Rewards.
  Баннер сохраняет фон/bevel/насыщенность; внутренние spotlight категорий сохранены.
- Второй overlay-border категорий отключён только внутри мобильной главной. Радиусы/тексты/сетка/док не менялись.
- Hero и Level внешнее золото — amber. Цвета acid категорий и legacy роли FeaturesBanner сохранены намеренно.
- Rewards: исправлены невалидные `${var}99/33/70`; inset-кант сохраняет геометрию,
  radial и icon-filter используют валидный color-mix и меняются вместе со слайдом.
- Проверки360/402/430: канты/shadow валидны, все три Rewards и шесть Features слайдов проверены;
  горизонтального overflow нет. Desktop1280 сохраняет legacy hero border/glow.
- App typecheck, build и diff-check прошли. Проверочные снимки сохранены вне repo, сравнения не показаны.
- Состояние: пользователь принял реализацию и явно попросил коммит/push; `2cb440b` запушен
  в `origin/v0/gor93rus-3494-8455a7c0` 09.10.2026. Перед коммитом повторно прошли typecheck/build/diff-check.
- Следующий этап — содержимое hero, после конкретизации задачи. Реальный мобильный WebView/color-mix физически не тестировался.

---

## 📌 Методология — Huashu Design Framework

> Исторический фреймворк этапа Dark Vault. Палитра, шрифты и эффекты ниже описывают тот этап,
> не являются требованием вернуть vivid neon на текущую главную. Для текущей итерации приоритетны
> согласованный референс, v2-токены и правило «одна проблема → до/после → одобрение».

---

### 1. Position Four Questions
_Фундаментальные вопросы перед началом любой дизайн-задачи._

| # | Вопрос | Текущий ответ |
|---|--------|---------------|
| **Who is the user?** | Игрок Telegram Mini App, 18-45 лет, крипто-энтузиаст |
| **What is the context?** | Мобильный телефон, вертикальная ориентация, 390×~750px полезной области |
| **What is the emotional arc?** | Предвкушение → выбор чисел → подтверждение → ожидание розыгрыша → выигрыш/проигрыш. Пик эмоции: джекпот + confetti |
| **What is the visual narrative?** | Глубокий тёмный фон → electric blue неоны → vivid glassmorphism → 3D-карточки → neon glow на кнопках |

---

### 2. Anti-AI Slop Baseline
_Правила, предотвращающие «AI-slope» — безликий, сгенерированный дизайн без характера._

- ❌ Избегать web-design tropes: стандартные Hero-секции, generic gradient buttons, скучные white cards
- ❌ Не использовать дефолтные цвета/material-палитры без контекста проекта
- ✅ Каждый визуальный элемент должен иметь **причину** в контексте гэмблинг-эмоций
- ✅ Типографика — bold, punchy, с характером (никаких Roboto/Inter по умолчанию)
- ✅ Цвета — saturated, vivid, с neon-glow акцентами (не пастельные, не muddy)

---

### 3. Brand Asset Protocol
_Правила работы с брендовыми активами — токены, шрифты, иконки._

- **Единый источник правды:** `src/styles/design-tokens.css` (Dark Vault)
- **Шрифты:** Space Grotesk (основной) + JetBrains Mono (только числа)
- **Иконки:** lucide-react — единая библиотека, не смешивать с emoji/SVG
- **Цвета:** только через CSS-переменные или Tailwind-токены. Никаких сырых HEX/rgba()
- **Glow-эффекты:** `--primary-glow`, `--secondary-glow`, `--gold-glow`, `--coral-glow`
- **Opacity-варианты:** `--primary-18`, `--coral-35` и т.д. — не хардкодить rgba()
- **Glass-3D:** через `.glass-3d` класс (border-top светлый, border-bottom тёмный, box-shadow)
- **Правило анимаций:** Framer Motion — для entrance/layout, CSS keyframes — только looping

---

### 4. 5-Dimensional Critique
_Чек-лист для самопроверки перед завершением задачи._

| Измерение | Вопрос |
|-----------|--------|
| **1. Clarity** | Понятно ли игроку что делать? Видит ли он CTA с первого взгляда? |
| **2. Emotion** | Вызывает ли дизайн азарт? Где пик эмоции на этой странице? |
| **3. Consistency** | Соответствует ли элемент Dark Vault токенам? Использует ли общие компоненты? |
| **4. Performance** | Нет ли тяжёлых анимаций на 60fps mobile? Оптимизированы ли re-render'ы? |
| **5. Accessibility** | Достаточный ли контраст текст��? Работает ли с клавиатуры? |

---

### 5. The Lifecycle Workflow
_Порядок работы над каждой задачей._

1. **Position Four Questions** — определить пользователя, контекст, эмоцию, нарратив
2. **Explore variants** — 2-3 разных подхода к решению
3. **Anti-AI Slop check** — убрать generic паттерны
4. **Brand Asset check** — привести к токенам, убрать rgba() и text-[Npx]
5. **5-Dimensional Critique** — самопроверка по всем 5 измерениям
6. **Playwright 390×844** — визуальная проверка на мобильном viewport
7. **Commit** — атомарный коммит, одна задача = один коммит

---

### Базовая техническая методология

- **Историческая база Dark Vault** — electric blue + deep purple; актуальный canon v2 описан выше
- **Текущая главная** — carbon canvas, ролевые акценты и согласованный navy dock; материалы карточек ещё требуют согласования
- **Tailwind-классы** вместо арбитрарных `text-[Npx]`

---

## 📂 Ключевые файлы

| Файл | Назначение |
|------|-----------|
| `src/styles/design-tokens.css` | Единый источник дизайн-токенов (Dark Vault) |
| `src/styles/lottery-cards.css` | 50+ компонентных классов (glass-panel, hero-card, num-cell, кнопки, карточки) |
| `src/index.css` | Мастер-стиль: импорты + Tailwind + компонентные стили |
| `src/components/DailyRushPage.tsx` | Универсальная страница N×M лотерей (эталон) |
| `src/data/lottery-configs.ts` | Конфиги 10 лотерей (цвета, aurora, темы) |
| `src/hooks/useLotteryDrawData.ts` | API-гибрид (live data → mock fallback) |
| `src/lib/api.ts` | API-клиент для бэкенда (10+ методов) |
| `src/hooks/useTonWallet.ts` | TON Connect — авторизация через кошелёк |
| `tailwind.config.js` | Расширен: типографика 3xs-4xl, цвета, glow-тени, анимации |
| `DESIGN_SYSTEM.md` | Полная спецификация Dark Vault (палитра, типографика, правила) |

---

## ✅ Выполнено — Priority 1: DailyRushPage

### Итерация 1: Фундамент (V1-V6)
- [x] V1: M-Design Color Migration
- [x] V2: Layout & Safe Area (NavBar скрыт на лотерейных страницах, Cart FAB от safe-area)
- [x] V3: Typography & Fonts (@fontsource, --font-mono)
- [x] V4: Framer Motion Animations (stagger, AnimatePresence)
- [x] V5: Emotional UX (haptic, urgent-таймер 60с, confetti)
- [x] V6: CSS-токены в lottery-cards.css
- [x] Luminous Gradient (3 этапа: токены, Aurora, компоненты)
- [x] Очистка: Smart Combos удалён, hot-ring заменён на тепловую карту
- [x] Адаптация под 390px (Jackpot 48px, padding 8px, gap 8px, Header/кнопки компактнее)

### Итерация 2: Полировка (15.06.2026)
- [x] Confetti убран со страницы выбора чи��ел (A)
- [x] Luminous Gradient схемы в glass-panel, hero-card (B)
- [x] Градиент num-cell — монохромный (не пёстрый) (#1)
- [x] Яркость поднята (убраны избыточные тени, blur уменьшен) (#2)
- [x] HeroCard инлайн-градиент заменён на CSS-���ласс (#3)
- [x] ��олупрозрачные кнопки (fire/emerald/ghost/htp) — без чёрных градиентов (C)
- [x] Активные состояния: `num-cell.selected` + `ticket-ball` — Luminous Gradient (#4)
- [x] Progress-bar + Selected counter — Luminous Gradient (#5)
- [x] `prev-ball` (Previous Draws) — Luminous Gradient (#6)
- [x] Сжатие под первый экран (D)
- [x] Прозрачность распределения средств: 50% / 15% / 5% (#10)

### Оставшиеся правки (#7-#12) — ✅ Выполнены 16.06.2026
- [x] **#7** — `anim-pulse-glow` заменён на `pulse-glow` (box-shadow без scale)
- [x] **#8** — My Stats удалён, перенесён в профиль
- [x] **#9** — Ticker возвращён между Hero и гридом
- [x] **#10** — Platform 30% убран, отображается 50/15/5
- [x] **#11** — Glass-3D эффект на всех блоках + tier-glass-3d для PrizeTiers
- [x] **#12** — Джекпот: glitch-эффект + одна строка "XXXX TON"

---

## ✅ Выполнено — Функциональность

- [x] P0 #1: Параметризация DailyRushPage (10 конфигов + `computePrizeTiers` + `computeHTPRules`)
- [x] P0 #2: API-интеграция (гибрид: `useLotteryDrawData` → live data с mock fallback)
- [x] 9 маршрутов лотерей в App.tsx (дубликат `/daily-rush-4x20` удалён)
- [x] Кнопка Назад работает (`window.history.back()`)
- [x] `freqMap` стабильна (через `useMemo`, без `Math.random()`)
- [x] Тепловая карта: cold(`blue`) → warm(`orange`) → hot(`red`) — статика, без анимации

---

## ⚠️ Дизайн-система — фактический статус (ревизия 20.06.2026)

> Предыдущая версия этого раздела содержала аспирационные галочки, не отражавшие
> код. Ниже — честный статус после ревизии.

- [x] **Палитра:** ролевая модель закреплена (navy база, primary=action, secondary=brand, gold=деньги/выигрыш/CTA, coral=live, per-game accents)
- [x] **Один красный:** дубликат rose `#F43F5E` / `rgba(244,63,94)` сведён к `--coral` во всех компонентах и `lottery-cards.css`
- [x] **Orange сведён:** stray `#F97316` (hot-glow, freq-badge, icon-fire, hot-ring) → `--coral`
- [x] **Сломанные `--amber-brand` / `--amber-soft`:** убраны из `ProfilePage` (аватар→brand, прогресс→gold, фильтр→primary); мёртвый `HeroSection.tsx` удалён
- [x] **Анимации:** Framer Motion → entrance, CSS → looping
- [x] **Эталон объёма поверхностей (фаза A):** формула `.glass-panel` (Daily Rush) принята за единый «объём» проекта — токены `--surface-gradient`, `--bevel-light-top/-side`, `--bevel-dark-side/-bottom`, `--elev-1..3`; `.glass-card` приведён к ней (Главная получила ту же глубину)
- [x] **20.06, исторически:** `backdrop-filter` убран с `.tier-card` и `.modal-overlay`. Позднее glass-карточки главной и док получили blur; утверждение «в проекте blur больше нет» неактуально.
- [x] **Мёртвые зависимости удалены:** Three.js, Chakra UI, Emotion, Radix
- [x] **05.07, исторически:** старый FeaturesBanner переведён на opacity-токены. Текущий слайдер снова содержит ролевые RGBA в `ITEMS`; общая грамматика материалов ещё не выполнена.
- [x] **Второй blue `#0EA5E9` (техдолг T2, 24.06):** разделён по ролям. **Legacy-дубль → primary** (T2a): `.htp-btn` и `.ticket-num-badge` переведены на рампу `--primary-100..900` (видимое cyan→blue, проверено). **Категориальный cyan узаконен** (T2b): токен `--cyan-100/400/600/800`, на него переведены `.tier-cyan`, `.icon-cyan/-blue`, `.glitch-b/-scan`, `.glass-panel--neon` (визуал не изменился). Канон в `design-tokens.css` обновлён: cyan = категориальный акцент, не дубль primary
- [x] **Типошкала: дно поднято (фаза C1-a):** `3xs` 7→11, `2xs` 8→12, `xs` 10→13, `sm` 12→14, `base` 14→15 — нечитаемых <11px размеров в шкале больше нет (монотонная, затронула обе страницы)
- [x] **`text-[Npx]` на Главной убраны (фаза C1-b):** все арбитрарные размеры в `HeroCarousel`, `App.tsx`, `GamificationBanner`, `ScratchCarousel`, `LotteryCarousel`, `PageFooter`, `ExchangeRate` сведены к токенам шкалы (≤11px → `text-3xs`)
- [x] **Типографика Daily Rush (фаза C2):** страница уже была на токенах шкалы (выиграла от C1-a); добито 2 инлайн-хардкода — «TON» `fontSize:11→text-3xs`, бейдж корзины `fontSize:9→text-3xs`. Цифра джекпота оставлена 30px как осознанный «деньги»-акцент. Радиусы `50%`/конфетти не трогаем (не типографика)
- [x] **`text-[Npx]` на ProfilePage убраны (техдолг T1, 24.06):** все 30 арбитрарных размеров → токены шкалы (≤11px → `text-3xs`). `LotteryPage` арбитраров не имел. Раскладка проверена на мобильном
- [ ] **`borderRadius: N` / `color:'#fff'`:** инлайн-хардкоды ещё в `LotteryPage.tsx`, `ProfilePage.tsx` (часть намеренная — круги/иконки; нужен аудит как в C2)
- [x] **`DESIGN_SYSTEM.md`** переписан под ролевую модель

---

## ✅ Выполнено — TON Connect (16.06.2026)

- [x] Интеграция `@tonconnect/ui-react` — провайдер в `App.tsx`
- [x] `TonConnectButton` в Header
- [x] Хук `useTonWallet.ts` — connected, walletAddress, connect, disconnect
- [x] Авто-авторизация через `POST /api/auth/wallet` + сохранение JWT
- [ ] Оплата билетов через TON — отложена до продакшена (не работает в dev)

---


## ✅ Выполнено — FeaturesBanner (05.07.2026) → Слайдер (24.07.2026)

> Исходный рефакторинг по Huashu Design. Позднее заменён на слайдер.

- [x] Исходный рефакторинг: аудит токенов, адаптивность, эмоциональный дизайн
- [x] **24.07:** заменён на слайдер по 2 карточки с авто-перелистыванием каждые 5 секунд. ScrollCarousel удалён из мобильной версии. Desktop BentoGrid сохранён.

**Изменённые файлы:** `FeaturesBanner.tsx`

---

## ✅ Выполнено — Главная страница (21-24.07.2026)

> Полный цикл доработок по Huashu Design Lifecycle.

- [x] **Баги (21.07):** тип `Lottery` восстановлен (`(typeof LOTTERIES)[number]`), добавлен `useEffect` в LotteryCarousel
- [x] **Тикер Recent wins (21.07):** увеличен внутренний паддинг + fade-маски с 28px на 32px
- [x] **ScrollCarousel (21.07):** fade-маски расширены (края с 80% до 90%)
- [x] **FeaturesBanner (24.07):** слайдер по 2 карточки с таймером 5с
- [x] **LotteryCarousel (24.07):** 3 состояния — Upcoming / Selling / Live с соответствующими StatusPill
- [x] **LotteryCarousel (24.07):** удалены картинки и чёрный прямоугольник — только фон с градиентами
- [x] **GamificationBanner (24.07):** pulse-glow на замке + текст CTA. Кнопка без кошелька вызывает `connect()` вместо перехода на `/profile`
- [x] **Изображения (24.07):** перенесены из `src/assets/cards/` в `public/cards/`. Пути исправлены на `/cards/*.png`
- [x] **GlobalJackpotHero (24.07):** джекпот + счётчик лотерей подвязаны к `api.getLotteryList()`. Добавлен skeleton-shimmer при загрузке. Fallback: 67,500 TON при ошибке API
- [x] **Фаски (24.07):** LotteryCard и ScratchCard визуально унифицированы
- [x] **ScratchCarousel:** бейджи больше не обрезаются fade-масками

**Изменённые файлы:** `lotteries.ts`, `LotteryCarousel.tsx`, `GlobalJackpotHero.tsx`, `FeaturesBanner.tsx`, `GamificationBanner.tsx`, `ScrollCarousel.tsx`, `index.css`, `public/cards/`

---

## ✅ Выполнено — Мобильная главная: дизайн-система v2.0 (19–29.09.2026)

> Ветка `v0/gor93rus-3494-8455a7c0`. История этапа до 29.09; более поздние изменения — в октябрьском дневнике выше.
> Канон токенов сменился: «Dark Vault» → **v2.0 (Carbon OLED / Drop Economy, шкала редкости)**.
> Полный статус миграции — в `DESIGN_SYSTEM.md`, детали сессии — в `SESSION_CONTEXT.md`.

### Этап 3 — миграция компонентов на токены `--v2-*`

- [x] Шрифт: подключён **Switzer** вместо Space Grotesk в `--font-display`
- [x] `GlobalJackpotHero`: god-rays сведены к одному золотому акценту, радиус → `--v2-radius-2xl`,
      счётчик → `--v2-text-4xl`/900 flat Legendary Gold
- [x] `FeaturesBanner` / `lottery-cards.css`: радиус `.feature-card-img` → `--v2-radius-lg`
- [x] `CategoryEntryCard`: полный рерайт по Image Bible v2.0 — rarity border/shadow, radial spotlight,
      `--v2-radius-xl`, `text-lg`/`text-3xs`. Rarity: Draw=Epic, Scratch=Rare, Mystic=Mythic
- [x] `GamificationCompact`: `--gold*` → `--v2-rarity-legendary*`, `rounded-2xl` → `--v2-radius-lg`,
      типографика 13/10/9/8px → `--v2-text-sm/xs/2xs/3xs`
- [x] `RewardsPanel`: `rounded-2xl` → `--v2-radius-lg`, акценты Invite/Streak/Rewards → v2-токены
- [x] Раскладка `MobileHome`: Draw Lotteries во всю ширину, Scratch/Mystic в 2 колонки ниже,
      pill-чип (текст+стрелка) убран со всех трёх карточек
- [x] Фон страницы: dot-grid микротекстура
- [x] Удалён мёртвый импорт `LiveWinsPanel` и unused-переменные (найдено правильным прогоном
      `tsc -p tsconfig.app.json`)

### Геометрия: 16px-ритм и футер за фолдом (29.09.2026, коммит `55718ec`)

- [x] Корневая причина найдена: `flex: X 1 0` + `min-height` — при `basis: 0` и включённом shrink строка
      сжималась ниже собственного контента (104px бокс против 124–126px контента), карточки с
      `overflow: hidden` вылезали на футер
- [x] Второй источник: `.mobile-home--compact { min-height: 100vh − … }` считал футер частью высоты
      и вытаскивал его в видимую зону
- [x] Футер вынесен в отдельный враппер `.mh-stack`, `min-height` пересчитан от `100dvh` минус хэдер,
      safe-area и док
- [x] Строки: `flex: 1.3 0 auto` (Draw) / `1.15 0 auto` / `1 0 auto` — только grow, никогда shrink
- [x] Гэпы унифицированы: 16px между карточками, 24px перед футером, горизонтальные 16px, hero inset 12px → 16px
- [x] `grid-auto-rows: 1fr`; снят `max-height: 104px` у геймификации; убран лишний div 12px
- [x] `main` paddingBottom 72px → `calc(var(--dock-h) + var(--safe-area-bottom))`
- [x] Новые токены `--dock-h: 75px`, `--header-h: 53px`
- [x] Проверено по пиксельному дифу (футер есть / `display:none`, анимации заморожены): зона карточек
      y=300…798 — **0 AE**. 402×874 — верх футера 816 при доке 799 (было 39px видимой полосы),
      430×932 — 873 при 857 (было 88px), 360×640 — 806 при 565
- [x] Зафиксирован компромисс: при эмуляции iPhone safe-area (62/34) контент 743px против свободных
      642px — нижняя строка может уйти под док ~100px, страница тогда скроллится, а не сплющивается

### Интерактив: haptic и отклик карточек (29.09.2026, коммит `fa931c3`)

- [x] **Найден мёртвый код:** `src/lib/haptic.ts` вызывал `require('@twa-dev/sdk')` внутри try/catch.
      В браузере `typeof require === "undefined"` → `ReferenceError` → молчаливый no-op. Хелпер не работал
      никогда, ни в dev, ни в прод-бандле, а прошлые «галочки haptic ✓» были фиктивными. Доказано кликами:
      роут менялся, вызовов `HapticFeedback` — 0
- [x] Переписано на прямое `window.Telegram.WebApp.HapticFeedback`; сигнатуры не менялись; вне Telegram — no-op
- [x] Отклик (`whileHover y −3` + `whileTap scale 0.97` + haptic): `CategoryEntryCard`,
      `GamificationCompact`, `RewardsPanel` (два последних переведены с `<button>` на `<motion.button>`)
- [x] Только haptic, без движения: hero-полоса `GlobalJackpotHero` и `WalletButton` в `Header` —
      хэдер и hero не должны двигаться вообще
- [x] `RewardsUnlockBanner`: haptic на обеих кнопках
- [x] `FeaturesBanner`: карточки объявлены неинтерактивными — убраны `whileTap`, hover и haptic,
      добавлен `.feature-card-img--static` (`cursor: default`), CSS-`:hover` сужен до
      `:hover:not(.feature-card-img--static)`. Hover desktop-варианта в `DesktopHome` сохранён
- [x] Проверено: rest-позиции всех элементов идентичны до/после, диф зоны карточек — **0 AE**,
      haptic — ровно один `impact:light` на клик (6/6 сценариев)

### Решения, зафиксированные на этой итерации

- Хэдер и GlobalJackpotHero не двигаются вообще — им достаётся только haptic
- FeaturesBanner — карточки-подписи: роутов за ними нет и не планируется, поэтому никакой интерактивности
- Футер оставлен в разметке, но обязан уходить за фолд
- Отступы гибридно: гэпы фиксированы, высоты карточек адаптивные
- Порядок работы: геометрия → интерактив, каждый шаг отдельно со скриншотами и явным одобрением

**Изменённые файлы (этап 3 + геометрия + интерактив):** `design-tokens.css`, `index.css`, `App.tsx`,
`GlobalJackpotHero.tsx`, `FeaturesBanner.tsx`, `CategoryEntryCard.tsx`, `GamificationCompact.tsx`,
`RewardsPanel.tsx`, `RewardsUnlockBanner.tsx`, `Header.tsx`, `lottery-cards.css`, `haptic.ts`, `tailwind.config.js`

---

## 🎯 В плане — Priority 3: Остальные лотереи

> **Примечание:** Каждая лотерея будет иметь уникальный визуальный стиль, отталкиваясь от лучших практик DailyRushPage, но не копируя её.

### V9: Weekend Special — Bingo UI
- [ ] Вместо NumberGrid 9×10 сделать Bingo-карточку (15 из 90)
- [ ] Альтернативный UI: автовыбор 15 чисел + Quick Pick
- [ ] Адаптировать Dark Vault палитру под Weekend Special

### V10: Scratch-игры визуал
- [x] ScratchCarousel визуально приведён к Dark Vault (фаски унифицированы с LotteryCarousel)
- [ ] Подключить `api.getScratchGames()` для живых данных
- [ ] Проработать анимацию «стирания» скретч-слоя

---

## ❌ Исключено из MVP

### V7: Dark Theme Telegram ❌
**Решение:** не внедрять. Dark Vault — уникальный визуал.

### M-Design System ❌
**Решение:** удалена. Заменена на Dark Vault (electric blue + deep purple). Файл `DESIGN_SYSTEM.md` переписан.

---

## 🎨 Dark Vault — Color Map

> ⚠️ Историческая палитра. Канон с 19.09.2026 — дизайн-система v2.0 (Carbon OLED / Drop Economy,
> шкала редкости, namespace `--v2-*`) в `DESIGN_SYSTEM.md`. Legacy-токены ниже ещё живы в
> немигрированных компонентах, но новые правки идут на `--v2-*`.

| Токен | HEX | Роль |
|-------|-----|------|
| `--primary` | `#0A7CFF` | Primary action, активные состояния, выбор, TON |
| `--secondary` | `#7C3AED` | Brand — аватар, бренд-акценты |
| `--gold` | `#FADB14` | Деньги/выигрыш/CTA — джекпот, выбранное число, кнопка покупки, призы |
| `--emerald` | `#52C41A` | Success — победа, Quick Pick |
| `--coral` | `#FF4D4F` | Live/urgent/ошибки — единстве��ный красный |
| `--bg-0` | `#06071A` | Фон страницы |
| `--bg-1` | `#0B1028` | Фон карточек |
| `--ink-0` | `#F0F4FF` | Текст основной |
| `--ink-2` | `#7B95B8` | Текст вторичный |
| `--ink-3` | `#3D5878` | Текст третичный |

---

## 🛠️ Технический долг (актуализация 07.10.2026)

### Закрыто за 21-24.07
- [x] Тип `Lottery` рассинхронизирован с `LOTTERIES` → исправлен
- [x] Изображения карточек ломались в production build → перенесены в `public/cards/`
- [x] `useEffect` отсутствовал в LotteryCarousel → добавлен
- [x] `NowProvider` импортировался но не использовался в LotteryCarousel → удалён
- [x] GlobalJackpotHero: джекпот хардкожен → подвязан к API
- [x] GamificationBanner: переход на `/profile` без кошелька → вызывает `connect()`

### Закрыто за 25.07 – 29.09

- [x] `useTonWallet.ts` + `api.ts` — конфликт `export const api` / `export namespace api` (TS2451) → 25.07 восстановлен
      только `export const api`, `walletAuth` живёт в `api.ts` как обычный метод, типизирован через `WalletAuthResponse`
- [x] Дублирование scroll-логики Header/NavBar → 25.07 вынесено в `src/hooks/useScrolled.ts`
- [x] 4 TS-ошибки (TS6133, неиспользуемые переменные) → 29.09 устранены; `tsc -p tsconfig.app.json --noEmit`
      даёт код 0 при включённых `noUnusedLocals`/`noUnusedParameters`
- [x] `haptic.ts` — мёртвый `require('@twa-dev/sdk')` внутри try/catch → 29.09 переписано на прямой доступ
      к `window.Telegram.WebApp.HapticFeedback` (было: роут менялся, вызовов `HapticFeedback` — 0)
- [x] Футер заезжал в видимую зону и карточки вылезали на него из-за `flex-shrink` ниже контента → 29.09 починено
      (коммит `55718ec`)

### Открыто (на 07.10.2026)

- [ ] **Telegram-мост в `src/main.tsx` мёртв** — тот же `require('@twa-dev/sdk').default` внутри try/catch:
      не работают `ready()`, `expand()`, `disableVerticalSwipes()`, `setHeaderColor()`/`setBackgroundColor()`,
      `enableClosingConfirmation()`, `themeParams` → CSS-переменные, `themeChanged`, `viewportChanged`.
      В `src/App.tsx` (~173) на том же паттерне висит `useTelegramBackButton()`. Всего 5 мест
- [ ] **Haptic не проверен в живом Telegram-клиенте.** Доказана только цепочка вызова (стаб + 6/6 `impact:light`).
      В `index.html` нет скрипта `telegram-web-app.js`, а продукт открывается как внешний сайт через бота —
      значит `window.Telegram.WebApp` может не инжектиться и haptic в продакшене останется no-op
- [ ] `useScratchGames()` написан (`src/hooks/useLotteries.ts`), но к UI не подключён — `src/data/lotteries.ts`
      держит заглушку с TODO
- [ ] `will-change: transform` остался на `.feature-card-img`, который больше не двигается — материал для
      отдельного GPU/performance-PR
- [ ] Грамматика border/surface/glow карточек не унифицирована; исправить невалидные цвета RewardsPanel
      и остаточное legacy-золото border/glow hero. Старые RGB-замеры до изменений hero не описывают текущий экран.
- [ ] Кнопка Connect использует legacy `--primary` вместо v2-градиента cyan→blue
- [ ] TON при ошибке данных показывает `$0.00 +0.0%` — пользователь явно отложил исправление.
- [ ] `DESIGN_SYSTEM.md` местами устарел (canvas, hero, glass); перед работой сверять с кодом и этим дневником.
- [ ] Bundle: `index-*.js` — 956 KB raw / gzip 289 KB, Vite ругается на чанк > 600 KB (нужен code-splitting)
- [ ] `tsc` не в CI — vite build зелёный даже при красном тайпчеке

### Старый техдолг

| # | Проблема | Статус |
|---|----------|--------|
| 1-9 | Все 9 пунктов пре��ы��у��его техдолга | ✅ Закрыты |
| 4 | Старые активные цвета (selected, ticket-ball) | ✅ Заменены на Luminous Gradient |
| 5 | Progress-bar + Selected counter — старые цвета | ✅ Заменены |
| 6 | Previous Draws (`prev-ball`) — старые цвета | ✅ Заменены |
| 7 | Add Numbers тусклая + scale заходит на соседей | ✅ `pulse-glow` без scale |
| 8-12 | My Stats, Ticker, фонд, glass-3D, джекпот | ✅ Выполнены |
| — | Мёртвый роутинг `/daily-rush-4x20` | ✅ Удалён |
| — | Сломанные `--amber-brand` / `--amber-soft` (ProfilePage, HeroSection) | ✅ Исправлены 20.06 |
| — | Два красных (`#FF4D4F` vs `#F43F5E`) | ✅ Сведены к `--coral` 20.06 |
| — | Stray orange `#F97316` (hot-glow и т.д.) | ✅ Сведён к `--coral` 20.06 |
| — | Второй blue `#0EA5E9` vs `--primary` | Закрыт в июне: action→primary, категориальный cyan узаконен |
| — | `text-[Npx]` арбитрарные размеры | Июньская миграция выполнена; новые v2-компоненты проверять отдельно |
| — | `rgba()` хардкоды | ⬜ Частично (3D-светотень намеренно сырая) |
| — | `backdrop-filter` матовость | Убран с tier-card/modal-overlay 20.06; на главной glass и док используют blur |
| — | Эталон объёма поверхностей (.glass-panel → токены) | ✅ Закреплён 20.06 (фаза A) |
| — | Per-game система акцента (рампа `--ga-*`) | ✅ D1+D2 готовы 24.06 — 8 ступеней `--ga-100..900` (дефолт=янтарь), 47 хардкодов янтаря в `lottery-cards.css` сведены к `var(--ga-*)`, визуальный паритет подтверждён. Подключение к `config.accentColor` (Путь 2) — отдельным заходом |
| — | Янтарь в `.hero-card` перекрыт `.glass-3d !important` | ⬜ Найдено 24.06 — янтарные канты hero-card «мёртвый код» (перекрыты glass-3d). Не критично |

---

## 📝 Примечания

- **Токены:** единый источник правды — `src/styles/design-tokens.css`
- **Правило анимаций:** Framer Motion для mount/unmount, CSS keyframes для looping
- **Типографика:** legacy Tailwind-шкала и `--v2-text-*` различаются; не утверждать, что во всём UI минимум 11px.
- **Цвета:** opacity-варианты токенов (`--primary-18`, `--coral-35`) вместо `rgba()`
- **Сравнение главной:** 402×874 и 430×932 до/после; дополнительно 360×640 и релевантная safe-area.
- **Коммиты** — атомарные, одна задача = один коммит
- **Проверка типов** — `npx tsc -p tsconfig.app.json --noEmit`. Без `-p` корневой `tsconfig.json`
  solution-style (`"files": []`), ничего не проверяет и всегда молча даёт код 0
- **npm** — канонический пакетный менеджер, версии в `package-lock.json`; локи bun/yarn/pnpm не коммитить
- **Визуальные шаги** — один шаг = одна проблема → скриншот до/после → показать пользователю;
  технические улучшения и GPU/performance — отдельным PR
- **Push — только по явному разрешению на конкретную итерацию.** Если пользователь уже попросил
  коммит и push, повторное подтверждение не требуется. Следующий визуальный шаг — после одобрения превью.
