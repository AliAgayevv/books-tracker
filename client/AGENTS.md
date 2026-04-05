<!-- BEGIN:nextjs-agent-rules -->
 
# Next.js: ALWAYS read docs before coding
 
Before any Next.js work, find and read the relevant doc in `node_modules/next/dist/docs/`. Your training data is outdated — the docs are the source of truth.
 
<!-- END:nextjs-agent-rules -->

---

# Frontend Design System — Context

## Stack
- Next.js 16 (App Router)
- Chakra UI v3 (`@chakra-ui/react`)
- Tailwind CSS v4
- `lucide-react` for all icons
- `next-themes` for dark/light mode

---

## Typography

- Font: **Joan** (`Joan-Regular.ttf`) — lives at `public/fonts/Joan-Regular.ttf`
- Loaded via `next/font/local` in `app/layout.tsx`, exposed as CSS variable `--font-joan`
- **Not applied globally** — only use it via the `.joan-font` class (defined in `globals.css`)
- Intended for the landing page only
- Chakra theme fonts (`heading`, `body`) are set to `system-ui, sans-serif` in `components/Provider.tsx`

```css
/* globals.css */
.joan-font {
  font-family: var(--font-joan), serif;
  font-weight: 700;
}
```

---

## Design Tokens

| Token | Value |
|---|---|
| Primary purple | `#8D43FF` |
| Primary yellow | `#E6FF02` |
| Input background | `#F9F9F9` |
| Input border radius | `12px` |
| Error color | `#DC2626` |
| Success color | `#16A34A` |
| Hover border (input) | `#7C3AED` |

---

## Components — `components/common/`

### `Button.tsx`
Custom component — **does not use Chakra's Button**.

| Prop | Type | Default | Notes |
|---|---|---|---|
| `colorScheme` | `"purple" \| "yellow"` | `"purple"` | |
| `variant` | `"solid" \| "outline"` | `"solid"` | |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | |
| `leftIcon` | `ReactNode` | — | |
| `rightIcon` | `ReactNode` | — | |
| `isLoading` | `boolean` | — | Shows animated spinner |
| `loadingText` | `string` | — | |
| `disabled` | `boolean` | — | Faded, no hover |
| `fullWidth` | `boolean` | — | |

- Solid purple: `#8D43FF` bg, white text. Hover → `#7A35EB`
- Solid yellow: `#E6FF02` bg, `#111111` text. Hover → `#D0E800`
- Outline: transparent bg, colored border/text. Hover → subtle tint
- Spinner uses `cubic-bezier` ease-in → ease-out animation (starts slow, speeds up)

### `Input.tsx` (exported as both `Input` and `InputField`)
Password input component — always has **Lock icon** (left) and **Eye/EyeOff toggle** (right).

| Prop | Type | Default | Notes |
|---|---|---|---|
| `placeholder` | `string` | `"Placeholder"` | |
| `supportText` | `string` | — | Shows below with Info icon |
| `state` | `"default" \| "hover" \| "error" \| "success"` | `"default"` | |
| `value` | `string` | — | Controlled |
| `onChange` | `ChangeEventHandler` | — | |
| `name` / `id` | `string` | — | |
| `disabled` | `boolean` | — | |

- Hover state is also triggered automatically on mouse enter (when `state="default"`)
- Eye toggle has a **close/open blink animation**: icon squishes to scaleY(0), swaps, then opens back
- `state="error"`: red border `#DC2626`, light red bg `#FFF5F5`, red support text
- `state="success"`: green border `#16A34A`, light green bg `#F0FFF4`, green support text

---

## File Structure (relevant)

```
client/
├── app/
│   ├── layout.tsx        ← Joan font loaded here via next/font/local
│   ├── globals.css       ← .joan-font class, Tailwind import
│   └── page.tsx          ← Component showcase (dev reference)
├── components/
│   ├── Provider.tsx      ← ChakraProvider + ThemeProvider, system-ui fonts
│   └── common/
│       ├── index.ts      ← Re-exports all components
│       ├── Button.tsx    ← Custom button (purple/yellow, solid/outline)
│       ├── Input.tsx     ← Password input with animated eye toggle
│       ├── Card.tsx
│       ├── Badge.tsx
│       ├── Navbar.tsx
│       ├── PageWrapper.tsx
│       ├── Spinner.tsx
│       └── EmptyState.tsx
└── public/
    └── fonts/
        └── Joan-Regular.ttf
```