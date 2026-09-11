# Art brief — Weekend Millions (DALL·E 3)

Готовые промпты для генерации. Всё на английском (English-only UI).
Порядок работы: сначала **одна** карточка (`weekend-special`) → я вставляю в вёрстку и показываю
на 390 px → твой ОК → остальные.

---

## 0. Три ограничения DALL·E 3, о которые легко убиться

1. **Нет прозрачности.** PNG выйдет со сплошным фоном. Поэтому в промптах фон запрошен
   сплошным `#14082A` — я сниму его командой `remove-background`, если понадобится вырез.
2. **Только три размера:** 1024×1024, 1792×1024, 1024×1792. Карточки в коде — 182×330 и
   182×390. Заказываем **1024×1024**, кроп и ресайз делаю я.
3. **Текст на картинках ненадёжен.** Поэтому во всех промптах стоит `no text, no letters, no
   numbers, no logos`. Названия, суммы и таймеры остаются в DOM — иначе их не обновить.

Если DALL·E выдаст надпись — перегенерируй, не пытайся замазать.

---

## 1. STYLE PREFIX — вставлять ДОСЛОВНО в начало каждого промпта

Это самое важное в брифе. Вся проблема проекта — отсутствие единого визуального языка. Если
каждая картинка будет в своём стиле, мы получим тот же слоп в новой палитре.

**Не перефразируй, не сокращай, не переставляй слова. Копируй как есть:**

```
Premium mobile game UI asset, luxury casino aesthetic. Dark plum-black background
(hex #14082A), single dramatic warm spotlight from upper right, deep shadows,
polished gold accents (hex #FADB14) with metallic specular highlights. Rich 3D
render, glossy materials, subtle rim light, cinematic night lighting, high
contrast, centered single object, generous empty margin around the object,
clean composition, no clutter. Solid flat #14082A background, no gradient
backdrop, no scenery, no environment. No text, no letters, no numbers, no logos,
no watermarks, no UI frames, no borders.
```

Дальше — только предметная часть, одним предложением. Ниже она уже дописана.

---

## 2. Карточки лотерей (10 шт., 1024×1024)

Каждый промпт = STYLE PREFIX + строка ниже. Имя файла указано — сохраняй ровно так, мне это
нужно для автоматической обработки.

| № | Файл | Предметная часть промпта |
|---|---|---|
| 1 | `lot-weekend-special.png` | `Subject: a golden lottery ticket with punched holes, floating at a slight angle, warm orange energy trail behind it.` |
| 2 | `lot-big-weekend.png` | `Subject: a tall stack of emerald-green casino chips with gold edges, one chip tumbling in mid-air above the stack.` |
| 3 | `lot-daily-rush.png` | `Subject: a blazing orange-red comet-like sphere with motion streaks, conveying speed and urgency.` |
| 4 | `lot-daily-thunder.png` | `Subject: a cyan lightning bolt frozen in glass, electric arcs crackling around it.` |
| 5 | `lot-daily-strike.png` | `Subject: a violet crystal orb cracked open with purple light bursting from inside.` |
| 6 | `lot-daily-mega-flash.png` | `Subject: a giant gold coin standing upright, radiating warm light, smaller coins scattered at its base.` |
| 7 | `lot-bounty-2x2.png` | `Subject: a locked treasure chest in magenta-to-purple metallic finish, gold clasp glowing.` |
| 8 | `lot-flash-start.png` | `Subject: a glossy azure-blue rocket nose cone pointing upward, thin blue exhaust glow beneath.` |
| 9 | `lot-flash-drive.png` | `Subject: a crimson-pink turbine wheel spinning, hot pink light bleeding through the blades.` |
| 10 | `lot-flash-pro.png` | `Subject: a teal-and-cyan polished gemstone cut in a hexagon, sharp facets catching light.` |

Цвета взяты из `src/data/lotteries.ts` (поле `gradient`) — чтобы иллюстрация не спорила с
акцентом карточки в коде.

---

## 3. Скретч-карты (5 шт., 1024×1024)

| № | Файл | Предметная часть промпта |
|---|---|---|
| 11 | `scr-three-aces.png` | `Subject: three playing card aces fanned out, rose-red suits, gold foil edges, slight curl.` |
| 12 | `scr-one-shot.png` | `Subject: a single cyan glass bullet-shaped capsule standing upright on a reflective surface.` |
| 13 | `scr-rapido-x.png` | `Subject: a yellow-gold stopwatch with cracked crystal, hands blurred from speed.` |
| 14 | `scr-minesweeper.png` | `Subject: an emerald-green metal sphere with hexagonal panels and a small glowing fuse on top.` |
| 15 | `scr-supernova.png` | `Subject: a violet exploding star core, dense bright center with purple plasma shell.` |

---

## 4. Фон-сцена (1 шт., **1024×1792** — вертикальная)

Заменит `AuroraBackground`. Здесь STYLE PREFIX **не используем** — это единственное исключение,
потому что тут как раз нужна среда:

```
Luxury casino night interior, extreme wide empty establishing shot, deep
plum-black and dark navy palette (#14082A to #06071A), distant warm gold
bokeh lights, heavy atmospheric haze, very dark and low contrast, soft vertical
light falloff, out-of-focus background plate designed to sit behind UI text.
Vertical composition, empty center, nothing in focus, no people, no furniture in
foreground, no text, no letters, no numbers, no logos.
```

Критично: **очень тёмная и малоконтрастная**. Поверх неё пойдут белый текст и золотые цифры —
если фон будет ярким или детальным, читаемость умрёт. Лучше пусть кажется «слишком тёмной».

Файл: `scene-bg.png`

---

## 5. Замена 1.5-мегабайтного SVG (1 шт., 1024×1024)

Сейчас в проекте `public/images/card-instant-payouts.svg` весит **1.5 МБ** — это трассированный
растр, единственный ассет во всём проекте. Меняем:

STYLE PREFIX + `Subject: a gold lightning bolt striking through a floating TON-style diamond crystal, blue and gold light interplay.`

Файл: `feat-instant-payouts.png`

---

## 6. Как отдавать мне файлы

- Просто приложи PNG как есть, ничего не обрезай и не сжимай — обработаю сам.
- Имена файлов — из таблиц выше.
- Можно партиями, не обязательно всё сразу.

**Моя часть после получения:** кроп под 182×330 / 182×390 → WebP через `magick` → бюджет
**≤120 КБ** на иллюстрацию, ≤200 КБ на фон-сцену → `loading="lazy"` вне первого экрана →
явные `width`/`height` против layout shift.

---

## 7. Если результат не нравится

Работающие уточнения к промпту (добавлять в конец, по одному за раз):

- Слишком светло / мутно → `darker background, deeper shadows, lower exposure`
- Объект упирается в края → `smaller object, more empty space around it, wider framing`
- Вылезла надпись → `absolutely no text anywhere in the image`
- Слишком «мультяшно» → `photorealistic 3D product render, physically based materials`
- Слишком много деталей → `single simple object, minimal detail, clean silhouette`
