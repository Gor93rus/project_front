# Weekend Millions — дизайн-система v2.0 (Carbon OLED / Drop Economy)

> Референс направления: **The Market** (Telegram Mini App)
> Единый источник правды в коде: `src/styles/design-tokens.css` (namespace `--v2-*`) + `tailwind.config.js`
> Каноничная документация (внешние файлы, не в репо): `Weekend_Millions_Design_Bible_v2.0.0.md`, `DESIGN_SYSTEM_NEW.md`
> Последнее обновление: 2026-09-19
> Этот файл заменяет старую версию "Dark Vault" (Space Grotesk, role-based `--primary`/`--gold`/`--coral`).
> Старая модель токенов (`--primary`, `--bg-0…3`, `--gold`, `--coral` и т.д.) **пока жива в коде** —
> компоненты мигрируют на `--v2-*` постепенно (см. раздел «Статус миграции»). Не путать: при правках
> смотреть, какие токены реально использует конкретный компонент прямо сейчас, а не полагаться на память.

---

## 🎨 Цветовая модель — Drop Economy (шкала редкости)

Ключевая смена парадигмы v2.0: вместо role-based палитры ("primary = CTA", "gold = деньги")
используется **шкала редкости** (rarity tier), как в лутбоксах/играх. Каждому элементу назначается
одна редкость → один доминантный цвет + радиальный спотлайт. Не смешивать цвета на одной карточке.

| Rarity | Токен | Цвет | HEX | Где применяется по доке |
|--------|-------|------|-----|--------------------------|
| **Common** | `--v2-rarity-common` | Steel Silver / Slate | `#8E9BAE` | Базовые элементы, бесплатные тикеты |
| **Rare** | `--v2-rarity-rare` | Electric Cyan | `#00E5FF` | Instant Payouts, Scratch Cards, Smart Contract |
| **Epic** | `--v2-rarity-epic` | Cyber Purple / Violet | `#A855F7` | Draw Lotteries, Provably Fair, VIP-ачивки |
| **Legendary** | `--v2-rarity-legendary` | Liquid Gold / Amber | `#FFB800` | Massive Prizes, Global Jackpot, золотые кейсы |
| **Mythic** | `--v2-rarity-mythic` | Ruby Red / Crimson | `#FF2D55` | Mystic Lootbox, лимитированные дропы |

Каждый rarity-токен имеет `-glow` вариант (rgba, для box-shadow/spotlight):
`--v2-rarity-{tier}-glow`.

Готовые CSS-утилиты (в `design-tokens.css`, применять когда компонент рендерит целиком через классы,
а не inline-стили): `.card-common`, `.card-rare`, `.card-epic`, `.card-legendary`, `.card-mythic` —
border + radial-gradient фон + box-shadow под нужную редкость.

### ⚠️ Rarity-маппинг — не догма, решается по месту
Доковский маппинг (таблица выше и §2.1 Design Bible) — ориентир, а не жёсткое правило 1:1 для каждого
компонента. Прецеденты в этом проекте:
- **`FeaturesBanner`** (6 фичей-карточек) — цвета оставлены **как были** (coral/primary/emerald/gold/cyan/purple
  по ролевым legacy-токенам), несмотря на то, что дока предписывает конкретный rarity на каждую карточку.
  Решение осознанное: текущая раскладка уже соответствует принципу «один акцент на карточку».
- **`CategoryEntryCard`** (Draw Lotteries / Scratch Cards / Mystic Lootbox) — здесь маппинг доки **применён
  точно**: Epic / Rare / Mythic соответственно.

Вывод: перед тем как назначать rarity новому компоненту — **спросить пользователя**, брать ли доковский
маппинг 1:1 или это очередной случай сознательного отклонения.

### Legacy role-based палитра (пока используется в немигрированных компонентах)
| Роль | Токен | HEX |
|------|-------|-----|
| Структура/фон | `--bg-0…3` | `#06071A` / `#0B1028` / `#111B3A` / `#1A2D55` |
| Primary action | `--primary` | `#0A7CFF` |
| Brand secondary | `--secondary` | `#7C3AED` |
| Деньги/CTA покупки | `--gold` | `#FADB14` |
| Success | `--emerald` | `#52C41A` |
| Live/urgent/error | `--coral` | `#FF4D4F` |
| Категориальный | `--cyan-*` | `#0EA5E9` семейство |

### V2 фоновая иерархия (Carbon OLED)
| Токен | HEX | Назначение |
|-------|-----|------------|
| `--v2-bg-page` | `#08090E` | Холст страницы (почти чёрный OLED, темнее старого `--bg-0`) |
| `--v2-bg-surface-0` | `#0D0F17` | Первый слой поверх страницы |
| `--v2-bg-card` | `#121522` | Карточки |
| `--v2-bg-card-raised` | `#181C2E` | Приподнятые/hover карточки |
| `--v2-bg-input` | `#101320` | Поля ввода |

**Статус:** страница пока рендерится на старом `--bg-0` — переход `MobileHome`/`App.tsx` на
`--v2-bg-page` — Этап 3, шаг 4 (не сделан).

### V2 Action & Brand
| Токен | HEX | Назначение |
|-------|-----|------------|
| `--v2-primary-from` → `--v2-primary-to` | `#00E5FF` → `#0A7CFF` | Primary как двухцветный градиент cyan→blue |
| `--v2-gold` | `#FFB800` | = `--v2-rarity-legendary` |
| `--v2-ruby` | `#FF2D55` | = `--v2-rarity-mythic` |
| `--v2-emerald` | `#00E676` | Success (новый оттенок, ярче старого `--emerald`) |
| `--v2-cyber-purple` | `#8B5CF6` | = близко к `--v2-rarity-epic`, но не идентичен (`#A855F7`) — не путать |

---

## 📐 Радиусы (шкала The Market)

| Токен | Значение | Назначение |
|-------|----------|------------|
| `--v2-radius-xs` | 6px | Микро-бейджи, частотные теги |
| `--v2-radius-sm` | 10px | Чипы фильтров, вторичные кнопки |
| `--v2-radius-md` | 14px | Поля ввода, кнопки действий |
| `--v2-radius-lg` | 18px | Стандартные игровые карточки (feature-карточки) |
| `--v2-radius-xl` | 22px | Крупные карточки режимов (Draw/Scratch/Lootbox) |
| `--v2-radius-2xl` | 28px | Главный Hero-баннер джекпота, модалки |
| `--v2-radius-dock` | 32px | Плавающий Dock Bar |

Старая шкала (`--r-sm/md/lg/xl/pill`) остаётся в коде для немигрированных мест и для pill-формы
(`--r-pill: 999px`), у которой пока нет v2-эквивалента.

---

## 🔤 Типографика

### V2 шкала (px, из The Market spec)
| Токен | Значение |
|-------|----------|
| `--v2-text-3xs` | 7px |
| `--v2-text-2xs` | 9px |
| `--v2-text-xs` | 11px |
| `--v2-text-sm` | 13px |
| `--v2-text-base` | 15px |
| `--v2-text-lg` | 17px |
| `--v2-text-xl` | 20px |
| `--v2-text-2xl` | 24px |
| `--v2-text-3xl` | 30px |
| `--v2-text-4xl` | 38px |

Применяется **точечно, по компоненту**, а не разом — чтобы не сломать вёрстку. Старые Tailwind-классы
(`text-3xs…text-4xl`, значения см. `tailwind.config.js`) остаются активны там, где компонент не мигрирован.

### Шрифты
- **Switzer** (`--font-display`, variable font wght 100–900) — основной: заголовки, кнопки, body.
  Заменил Space Grotesk (Этап 2, отклонён General Sans — max weight 700, нужен был 900).
- **JetBrains Mono** (`--font-mono`) — только числа: цены, таймеры, TON, CTA-пилюли.

---

## 🧩 Компонентный паттерн: Rarity Card

Каноничный паттерн v2.0 для карточек категорий/режимов/наград (см. `CategoryEntryCard.tsx` как эталон):

1. **Контейнер**: `rounded-[var(--v2-radius-xl)]`, тёмный фон (`#0F121E`/`--v2-bg-card`), `border` и `box-shadow`
   в цвете назначенной редкости с альфой (`border-rarity-{tier}/30`, `shadow-[...rgba(...,0.2)]`).
2. **Radial spotlight** — абсолютно позиционированное пятно (`blur-2xl`, `radial-gradient(circle, {accent}30% → transparent 70%)`)
   в углу карточки, где в будущем сидит 3D-ассет.
3. **3D hero-ассет** (`<motion.img>`, floating loop `y: [0,-4,0]`) — **пока не внедрён нигде в проекте**.
   Ждёт готовых ассетов от пользователя (Mystic Lootbox — "самая сырая вещь", в работе отдельно).
   Текстура/материал карточки (не только цвет, но и поверхность) — тоже отложено, обсуждать отдельно
   при следующем заходе на карточки.
4. **Текст**: заголовок `font-bold text-white`, CTA — компактная пилюля снизу-слева, моно-шрифт,
   uppercase, аутлайн-стрелка в цвете редкости.

---

## 🎬 Анимации

| Тип | Инструмент | Примеры |
|-----|-----------|---------|
| Entrance / Layout | Framer Motion | `animate={{ opacity: 1, y: 0 }}`, `AnimatePresence` |
| Looping (бесконечные) | CSS keyframes | pulse, shimmer, glow, float, ticker |
| В компонентах | Tailwind-классы | `animate-pulse-glow`, `animate-float-y`, `animate-ticker` |

Framer Motion — mount/unmount и layout. CSS keyframes — только бесконечный looping. Не смешивать.

---

## 📁 Структура CSS

```
index.css
  ├── @import design-tokens.css   ← ЕДИНЫЙ источник токенов (legacy + --v2-*)
  ├── @import lottery-cards.css   ← компонентные классы (.feature-card-img и др.)
  ├── @fontsource/*, Switzer      ← шрифты
  └── tailwind                    ← утилиты + tailwind.config.js (rarity.*, v2-radius-*, v2-text-*)
```

---

## ✅ Статус миграции на v2.0 (мобильная главная, Этап 3)

| Компонент | Статус | Что мигрировано |
|-----------|--------|------------------|
| Токены (`design-tokens.css`, `tailwind.config.js`) | ✅ Этап 1 | `--v2-*` палитра/радиусы/типографика объявлены |
| Шрифт Switzer | ✅ Этап 2 | Заменил Space Grotesk в `--font-display` |
| `GlobalJackpotHero.tsx` | ✅ | God-rays → один золотой акцент; радиус → `--v2-radius-2xl`; счётчик → `--v2-text-4xl`/900/flat Legendary Gold |
| `FeaturesBanner` / `lottery-cards.css` | ✅ | `.feature-card-img` радиус → `--v2-radius-lg`. Цвета/типографика заголовка — сознательно НЕ тронуты |
| `CategoryEntryCard.tsx` | ✅ | Полный рерайт по Image Bible v2.0: rarity border/shadow, radial spotlight, `--v2-radius-xl`, `text-lg`/`text-3xs`. Rarity: Draw Lotteries=Epic, Scratch Cards=Rare, Mystic Lootbox=Mythic. 3D hero-ассет и текстура карточки — отложены |
| `GamificationCompact.tsx` | ⏳ Не начато | — |
| `App.tsx` / `MobileHome` (общий фон страницы, отступы) | ⏳ Не начато | Страница ещё на старом `--bg-0`, не на `--v2-bg-page` |
| `<RarityCard/>` как переиспользуемый компонент (код из Design Bible) | ⏳ Отдельный этап (4) | Не начато, не обсуждено детально |
| 3D-артефакты / текстуры карточек | ⏳ Отложено (Этап 6) | Ждёт ассетов от пользователя |
| Loot-box иконография (концепция, не токены) | 🚫 Не трогать | Пользователь сам работает над этим отдельно |
| `DailyRushPage`, `ProfilePage`, `LotteryPage`, `DesktopHome.tsx`, `/lotteries`, `/scratch-cards` | 🚫 Не трогать (Этап 5) | Не начинать без явного разрешения |

---

## 🚫 Правила проекта (не связаны с токенами, но обязательны)

- Один шаг = одна конкретная визуальная проблема → скриншот до/после → показать пользователю →
  коммит только после одобрения → **push — отдельное явное разрешение на каждый конкретный коммит**.
- Технические улучшения (рефактор, производительность) ≠ визуальные улучшения — не смешивать в одном шаге.
- `npx tsc --noEmit` + `npm run build` перед каждым коммитом.
- npm — канонический пакетный менеджер; версии фиксируются в `package-lock.json`; локи bun/yarn/pnpm
  в `.gitignore`, не коммитить.
- English only в UI-тексте; комментарии и коммиты — по-русски.
