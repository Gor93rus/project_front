# Dark Vault — Дизайн-система Premium Web3 Casino

> Electric Blue + Deep Purple · Vivid Glassmorphism · 3D Cards · Neon Glow  
> Единый источник правды: `src/styles/design-tokens.css`  
> Последнее обновление: 2026-06-19

---

## 🎨 Цветовая палитра

| Токен | HEX | Роль |
|-------|-----|------|
| `--primary` | `#0A7CFF` | Electric Blue — CTA, акценты, TON |
| `--primary-soft` | `#3B9AFF` | Ховеры, второстепенный blue |
| `--primary-bright` | `#69B1FF` | Яркие акценты, glow-текст |
| `--primary-glow` | `rgba(10,124,255,0.45)` | Neon свечение |
| `--secondary` | `#7C3AED` | Deep Purple — hover, фон карточек |
| `--secondary-soft` | `#9F67FF` | Второстепенный purple |
| `--secondary-glow` | `rgba(124,58,237,0.35)` | Purple свечение |
| `--gold` | `#FADB14` | Джекпот, выигрыши |
| `--gold-soft` | `#FFEC3D` | Второстепенный gold |
| `--gold-glow` | `rgba(250,219,20,0.50)` | Золотое свечение |
| `--emerald` | `#52C41A` | Успех, Quick Pick |
| `--emerald-glow` | `rgba(82,196,26,0.40)` | Emerald свечение |
| `--coral` | `#FF4D4F` | Urgent, LIVE, ошибки |
| `--coral-glow` | `rgba(255,77,79,0.45)` | Красное свечение |

### Фон
| Токен | HEX |
|-------|-----|
| `--bg-0` (page) | `#06071A` |
| `--bg-1` (card) | `#0B1028` |
| `--bg-2` (raised) | `#111B3A` |
| `--bg-3` (deep) | `#1A2D55` |

### Текст
| Токен | HEX | Роль |
|-------|-----|------|
| `--ink-0` | `#F0F4FF` | Основной |
| `--ink-1` | `#C4D0E8` | Яркий |
| `--ink-2` | `#7B95B8` | Вторичный |
| `--ink-3` | `#3D5878` | Третичный |

### Opacity-варианты (для границ/фонов)
- `--primary-18`, `--primary-35`
- `--secondary-18`
- `--coral-18`, `--coral-35`

---

## 🔤 Типографика

| Класс Tailwind | Размер | line-height | Назначение |
|---------------|--------|-------------|------------|
| `text-3xs` | 7px | 1.3 | Частотные бейджи, микро-лейблы |
| `text-2xs` | 8px | 1.3 | Таймеры, small caps, NavBar |
| `text-xs` | 10px | 1.4 | TON rate, бейджи |
| `text-sm` | 12px | 1.4 | Описания, кнопки |
| `text-base` | 14px | 1.5 | Основной текст, заголовки секций |
| `text-lg` | 16px | 1.5 | Подзаголовки |
| `text-xl` | 18px | 1.4 | Hero-заголовки |
| `text-2xl` | 22px | 1.3 | Countdown цифры |
| `text-3xl` | 28px | 1.2 | Крупные числа |
| `text-4xl` | 36px | 1.1 | Джекпот |

### Шрифты
- **Space Grotesk** (`--font-display`) — основной: заголовки, кнопки, body
- **JetBrains Mono** (`--font-mono`) — только числа: цены, таймеры, TON

### Правило
Использовать Tailwind-классы (`text-2xs`, `text-base`) вместо арбитрарных `text-[8px]`.

---

## 🎬 Анимации

| Тип | Инструмент | Примеры |
|-----|-----------|--------|
| **Entrance / Layout** | Framer Motion | `animate={{ opacity: 1, y: 0 }}`, `AnimatePresence` |
| **Looping (бесконечные)** | CSS keyframes | pulse, shimmer, glow, float, ticker |
| **В компонентах** | Tailwind-классы | `animate-pulse-glow`, `animate-float-y`, `animate-ticker` |

### Правило
Framer Motion — для mount/unmount и layout-анимаций. CSS keyframes — только для бесконечных looping-эффектов. Не смешивать.

---

## 🧩 Компонентные классы

### Glass-3D (`.glass-3d` в `lottery-cards.css`)
Выпуклый стеклянный 3D-эффект:
- `border-top`: светлый (1.5px)
- `border-bottom`: тёмный (2px)
- `box-shadow`: inset + внешнее свечение primary + secondary

### NumberCell (`.num-cell` / `.num-cell.selected`)
- Неактивные: тёмно-синий градиент, микро-pulse на border-top
- Активные: Luminous Gradient (синий+фиолетовый+бирюзовый), 3D glass эффект

### PremiumButton
- Градиент: `var(--primary)` → `var(--secondary)`
- Shimmer-анимация (Framer Motion `backgroundPosition`)

---

## 📁 Структура CSS

```
index.css
  ├── @import design-tokens.css   ← ЕДИНЫЙ источник токенов
  ├── @import lottery-cards.css   ← компонентные классы
  ├── @fontsource/*               ← шрифты
  └── tailwind                    ← утилиты + компонентные стили
```

---

## 🚫 Запрещено

- `rgba(244,63,94,0.18)` → `var(--coral-18)` / `bg-coral-dim`
- `style={{ borderRadius: 14 }}` → `rounded-xl` / `rounded-2xl`
- `text-[8px]` → `text-2xs`
- `color: '#fff'` → `text-ink-0`
- `backdrop-filter: blur(...)` — убран из всех компонентов