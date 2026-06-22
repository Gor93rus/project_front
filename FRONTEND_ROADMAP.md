# 🎰 Lottery Frontend — Visual & UX Roadmap

> Telegram Mini App · TON Blockchain · 10 тиражных + 5 скретч-лотерей  
> Фокус: визуал, эмоции игрока, гэмблинг UX  
> Последнее обновление: 19.06.2026

---

## 📌 Методология — Huashu Design Framework

> **Huashu Design** — обязательный фреймворк для всех дизайн-решений.  
> Все пять инструкций применяются при создании новых страниц (V9, V10 и далее).

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
| **5. Accessibility** | Достаточный ли контраст текста? Работает ли с клавиатуры? |

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

- **Dark Vault Design System** — единый источник токенов (`design-tokens.css`), electric blue + deep purple
- **Premium Web3 Casino** — vivid glassmorphism, 3D cards, neon glow, bold punchy типографика
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
- [x] Confetti убран со страницы выбора чисел (A)
- [x] Luminous Gradient схемы в glass-panel, hero-card (B)
- [x] Градиент num-cell — монохромный (не пёстрый) (#1)
- [x] Яркость поднята (убраны избыточные тени, blur уменьшен) (#2)
- [x] HeroCard инлайн-градиент заменён на CSS-��ласс (#3)
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
- [x] **Матовость добита:** `backdrop-filter` убран с `.tier-card` и `.modal-overlay` (оверлей компенсирован непрозрачностью 0.94). Остатков `backdrop-filter` в проекте больше нет
- [x] **Мёртвые зависимости удалены:** Three.js, Chakra UI, Emotion, Radix
- [ ] **Сырые `rgba()`:** ЧАСТИЧНО. `lottery-cards.css` и инлайн-стили (`LotteryPage`) всё ещё содержат сырые `rgba()` для 3D-светотени — намеренно (token-сведение этих стоп-цветов — отдельная задача)
- [ ] **Второй blue `#0EA5E9`:** ещё не сведён к `--primary` (используется в tier-cyan, htp-btn, ticket-badge). Тоновый сдвиг — требует визуальной проверки (фаза 2)
- [ ] **`text-[Npx]` / `borderRadius: N` / `color:'#fff'`:** НЕ заменены — массово присутствуют в `App.tsx`, `LotteryPage.tsx`, `ProfilePage.tsx`
- [x] **`DESIGN_SYSTEM.md`** переписан под ролевую модель

---

## ✅ Выполнено — TON Connect (16.06.2026)

- [x] Интеграция `@tonconnect/ui-react` — провайдер в `App.tsx`
- [x] `TonConnectButton` в Header
- [x] Хук `useTonWallet.ts` — connected, walletAddress, connect, disconnect
- [x] Авто-авторизация через `POST /api/auth/wallet` + сохранение JWT
- [ ] Оплата билетов через TON — отложена до продакшена (не работает в dev)

---

## 🎯 В плане — Priority 3: Остальные лотереи

> **Примечание:** Каждая лотерея будет иметь уникальный визуальный стиль, отталкиваясь от лучших практик DailyRushPage, но не копируя её.

### V9: Weekend Special — Bingo UI
- [ ] Вместо NumberGrid 9×10 сделать Bingo-карточку (15 из 90)
- [ ] Альтернативный UI: автовыбор 15 чисел + Quick Pick
- [ ] Адаптировать Dark Vault палитру под Weekend Special

### V10: Scratch-игры визуал
- [ ] Адаптировать ScratchCarousel под Dark Vault + Luminous Gradient
- [ ] Проработать анимацию «стирания» скретч-слоя

---

## ❌ Исключено из MVP

### V7: Dark Theme Telegram ❌
**Решение:** не внедрять. Dark Vault — уникальный визуал.

### M-Design System ❌
**Решение:** удалена. Заменена на Dark Vault (electric blue + deep purple). Файл `DESIGN_SYSTEM.md` переписан.

---

## 🎨 Dark Vault — Color Map

| Токен | HEX | Роль |
|-------|-----|------|
| `--primary` | `#0A7CFF` | Primary action, активные состояния, выбор, TON |
| `--secondary` | `#7C3AED` | Brand — аватар, бренд-акценты |
| `--gold` | `#FADB14` | Деньги/выигрыш/CTA — джекпот, выбранное число, кнопка покупки, призы |
| `--emerald` | `#52C41A` | Success — победа, Quick Pick |
| `--coral` | `#FF4D4F` | Live/urgent/ошибки — единственный красный |
| `--bg-0` | `#06071A` | Фон страницы |
| `--bg-1` | `#0B1028` | Фон карточек |
| `--ink-0` | `#F0F4FF` | Текст основной |
| `--ink-2` | `#7B95B8` | Текст вторичный |
| `--ink-3` | `#3D5878` | Текст третичный |

---

## 🛠️ Технический долг

| # | Проблема | Статус |
|---|----------|--------|
| 1-9 | Все 9 пунктов предыдущего техдолга | ✅ Закрыты |
| 4 | Старые активные цвета (selected, ticket-ball) | ✅ Заменены на Luminous Gradient |
| 5 | Progress-bar + Selected counter — старые цвета | ✅ Заменены |
| 6 | Previous Draws (`prev-ball`) — старые цвета | ✅ Заменены |
| 7 | Add Numbers тусклая + scale заходит на соседей | ✅ `pulse-glow` без scale |
| 8-12 | My Stats, Ticker, фонд, glass-3D, джекпот | ✅ Выполнены |
| — | Мёртвый роутинг `/daily-rush-4x20` | ✅ Удалён |
| — | Сломанные `--amber-brand` / `--amber-soft` (ProfilePage, HeroSection) | ✅ Исправлены 20.06 |
| — | Два красных (`#FF4D4F` vs `#F43F5E`) | ✅ Сведены к `--coral` 20.06 |
| — | Stray orange `#F97316` (hot-glow и т.д.) | ✅ Сведён к `--coral` 20.06 |
| — | Второй blue `#0EA5E9` vs `--primary` | ⬜ Не сведён (фаза 2) |
| — | `text-[Npx]` арбитрарные размеры | ⬜ НЕ заменены (App/LotteryPage/ProfilePage) |
| — | `rgba()` хардкоды | ⬜ Частично (3D-светотень намеренно сырая) |
| — | `backdrop-filter` матовость | ✅ Убрана полностью (tier-card, modal-overlay) 20.06 |
| — | Эталон объёма поверхностей (.glass-panel → токены) | ✅ Закреплён 20.06 (фаза A) |

---

## 📝 Примечания

- **Токены:** единый источник правды — `src/styles/design-tokens.css`
- **Правило анимаций:** Framer Motion для mount/unmount, CSS keyframes для looping
- **Типографика:** Tailwind-классы `text-2xs` (8px) … `text-4xl` (36px)
- **Цвета:** opacity-варианты токенов (`--primary-18`, `--coral-35`) вместо `rgba()`
- **Перед каждым изменением** — проверять на мобильном viewport 390×844 через Playwright
- **Коммиты** — атомарные, одна задача = один коммит
- **Без согласования — никаких действий**
