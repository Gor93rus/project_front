# 🎰 Lottery Frontend — Visual & UX Roadmap

> Telegram Mini App · TON Blockchain · 10 тиражных + 5 скретч-лотерей  
> Фокус: визуал, эмоции игрока, гэмблинг UX  
> Последнее обновление: 15.06.2026 (конец 2-й итерации DailyRushPage)

---

## 📌 Методология

- **Huashu Design** — Junior Designer Pass, Position Four Questions, анти-AI-slope
- **M-Design System** — единый источник цветовых токенов (Level/Color/Tone)
- **Bolt.new прототип** — эталон визуального качества (CSS-классы перенесены, кнопки и selected сохранены)
- **Luminous Gradient** — фирменная мультицветная схема (синий+фиолетовый+бирюзовый, Stake/BC.Game стиль)

### Position Four Questions (Huashu)
1. **Who is the user?** Игрок Telegram Mini App, 18-45 лет, крипто-энтузиаст
2. **What is the context?** Мобильный телефон, вертикальная ориентация, 390×~750px полезной области
3. **What is the emotional arc?** Предвкушение → выбор чисел → подтверждение → ожидание розыгрыша → выигрыш/проигрыш. Пик эмоции: джекпот и confetti
4. **What is the visual narrative?** Ночное небо (Aurora) → огонь/сияние (Hot picks) → золото (Jackpot) → стеклянный 3D (glass-кнопки/selected)

---

## 📂 Ключевые файлы

| Файл | Назначение |
|------|-----------|
| `src/index.css` | M-Design токены + Luminous Gradient схема + базовые стили |
| `src/styles/lottery-cards.css` | 50+ компонентных классов (glass-panel, hero-card, num-cell, кнопки, карточки) |
| `src/components/DailyRushPage.tsx` | Универсальная страница N×M лотерей (эталон) |
| `src/data/lottery-configs.ts` | Конфиги 10 лотерей (цвета, aurora, темы) |
| `src/hooks/useLotteryDrawData.ts` | API-гибрид (live data → mock fallback) |
| `DESIGN_SYSTEM.md` | Полная спецификация M-Design (27+ цветов) |
| `FINANCIAL_MODEL.md` | Фин. модель распределения средств (изучена для прозрачности) |

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
- [x] Мультицветный градиент (синий `#1A3A8A` + фиолетовый `#6D28D9` + бирюзовый `#0E7490`) в glass-panel, hero-card (B)
- [x] Градиент num-cell — монохромный (не пёстрый) (#1)
- [x] Яркость поднята (убраны избыточные тени, blur уменьшен) (#2)
- [x] HeroCard инлайн-градиент заменён на CSS-класс (#3)
- [x] Полупрозрачные кнопки (fire/emerald/ghost/htp) — без чёрных градиентов (C)
- [x] Активные состояния: `num-cell.selected` + `ticket-ball` — Luminous Gradient (#4)
- [x] Progress-bar + Selected counter — Luminous Gradient (#5)
- [x] `prev-ball` (Previous Draws) — Luminous Gradient (#6)
- [x] Сжатие под первый экран: Jackpot 38px, Ticker убран из Hero, Countdown 32×42, HeroCard padding 14/12/12, кнопки py-2 (D)
- [x] Прозрачность распределения средств: 50% Prize / 15% Jackpot / 5% Reserve / 30% Platform (E) — требует доработки (#10)

### Оставшиеся правки для следующей сессии:

| # | Задача | Приоритет |
|---|--------|-----------|
| 7 | Add Numbers: убрать `anim-pulse-glow` (scale 1.12 заходит на соседей), усилить прозрачность active | 🔴 |
| 8 | Убрать My Stats (перенести в отдельную страницу профиля позже) | 🟡 |
| 9 | Вернуть Ticker в Hero (победители последнего тиража, если нет — полезная информация) | 🟡 |
| 10 | Фонд: убрать Platform (30%), оставить 3 статьи (50/15/5%) | 🟡 |
| 11 | Glass-3D эффект на все блоки (как `num-cell.selected` — выпуклый, стеклянный) | 🟢 |
| 12 | Джекпот: пересмотреть шрифт, эффект, компактное размещение | 🟡 |

---

## ✅ Выполнено — Функциональность

- [x] P0 #1: Параметризация DailyRushPage (10 конфигов + `computePrizeTiers` + `computeHTPRules`)
- [x] P0 #2: API-интеграция (гибрид: `useLotteryDrawData` → live data с mock fallback)
- [x] 10 маршрутов лотерей в App.tsx
- [x] Кнопка Назад работает (`window.history.back()`)
- [x] `freqMap` стабильна (через `useMemo`, без `Math.random()`)
- [x] Тепловая карта: cold(`blue`) → warm(`orange`) → hot(`red`) — статика, без анимации

---

## 🎯 В плане — Priority 3: Остальные лотереи

> **Примечание:** V8 (распространение на другие лотереи) отложена. Каждая лотерея будет иметь уникальный визуальный стиль, отталкиваясь от лучших практик DailyRushPage, но не копируя её.

### V9: Weekend Special — Bingo UI
- [ ] Вместо NumberGrid 9×10 сделать Bingo-карточку (15 из 90)
- [ ] Альтернативный UI: автовыбор 15 чисел + Quick Pick
- [ ] Адаптировать Luminous Gradient под Weekend Special

### V10: Scratch-игры визуал
- [ ] Адаптировать ScratchCarousel под M-Design + Luminous Gradient
- [ ] Проработать анимацию «стирания» скретч-слоя

### TON Connect
- [ ] Интеграция `@tonconnect/ui-react`
- [ ] Оплата билетов через TON
- [ ] Связка с `api.buyTicket()`

---

## ❌ Исключено из MVP

### V7: Dark Theme Telegram ❌
**Решение:** не внедрять. Luminous Gradient — уникальный визуал, подмена на пользовательскую тему сломает нарратив.

---

## 🎨 Luminous Gradient — Color Map (M-Design)

| Токен | HEX | Роль |
|-------|-----|------|
| `--md-bg-page` | `#040D21` | Фон страницы |
| `--md-bg-card` | `#0E2560` | Фон карточек |
| `--md-bg-raised` | `#163580` | Фон приподнятых элементов |
| `--md-blue-400` | `#69B1FF` | Акцент / подсветка |
| `--md-blue-600` | `#1677FF` | Hover-состояния |
| `--md-orange-500` | `#FFA940` | Fire / Hot / Add Numbers |
| `--md-yellow-600` | `#FADB14` | Джекпот / Золото |
| `--md-green-500` | `#73D13D` | Quick Pick / Успех |
| `--md-red-500` | `#FF4D4F` | Urgent / Ошибка |
| `--md-ink-0` | `#FFFFFF` | Текст основной |
| `--md-ink-1` | `#D6E4FF` | Текст яркий |
| `--md-ink-2` | `#89AADD` | Текст вторичный |
| `--md-ink-3` | `#5A78AA` | Текст третичный |

**Градиент Luminous Gradient:** `#1A3A8A → #6D28D9 → #0E7490`

---

## 🛠️ Технический долг

| # | Проблема | Статус |
|---|----------|--------|
| 1-9 | Все 9 пунктов предыдущего техдолга | ✅ Закрыты |
| 4 | Старые активные цвета (selected, ticket-ball) | ✅ Заменены на Luminous Gradient |
| 5 | Progress-bar + Selected counter — старые цвета | ✅ Заменены |
| 6 | Previous Draws (`prev-ball`) — старые цвета | ✅ Заменены |
| 7 | Add Numbers тусклая + scale заходит на соседей | ⏳ След. сессия |
| 8-12 | My Stats, Ticker, фонд, glass-3D, джекпот | ⏳ След. сессия |

---

## 📝 Примечания

- **Кнопки и selected-состояния** — теперь используют Luminous Gradient (не хардкод). Glass-3D эффект `num-cell.selected` — эталон для всех блоков (#11).
- **Каждая новая лотерея** — уникальный визуальный стиль, общие только механика (NumberGrid/TicketRow/PrizeTiers) и Luminous Gradient база.
- **Перед каждым изменением** — проверять на мобильном viewport 390×844 через Playwright.
- **Коммиты** — атомарные, одна задача = один коммит.
- **Правило MCP:** если сервер недоступен — пауза, уведомление пользователю.
- **Без согласования — никаких действий.**