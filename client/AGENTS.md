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

## API Proxy
`next.config.ts` rewrites `/api/:path*` → `http://localhost:3000/api/:path*`.
All fetch calls use `/api/...` — never hardcode the Express port.

## "use client" Rules
- Pages (`app/**/page.tsx`) are **Server Components** — no `"use client"`
- Only leaf components that need hooks/browser APIs get `"use client"`
- Interactive sections live in `sections/` — they are the client boundary
- `components/common/` components are server-safe unless they contain hooks

## Provider Setup
`ThemeProvider` (next-themes) wraps `ChakraProvider` — **not inside it**.
This order is required to avoid hydration mismatches between next-themes script injection and Chakra/Emotion style injection.

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
│   ├── layout.tsx              ← Joan font, AuthProvider + Provider wrappers
│   ├── globals.css             ← .joan-font class, Tailwind import
│   ├── page.tsx                ← Component showcase (dev reference)
│   ├── (auth)/
│   │   ├── layout.tsx          ← Centered card layout (server component)
│   │   ├── login/page.tsx      ← Server component
│   │   ├── register/page.tsx   ← Server component
│   │   └── 2fa/page.tsx        ← Server component
│   └── search/
│       └── page.tsx            ← Server component
├── sections/                   ← "use client" interactive sections, one per page feature
│   ├── LoginSection.tsx
│   ├── RegisterSection.tsx
│   ├── TwoFactorSection.tsx    ← Digit-by-digit OTP input with paste support
│   └── SearchSection.tsx
├── context/
│   └── AuthContext.tsx         ← "use client", User state + useAuth hook, fetches /me on mount
├── lib/
│   └── api/
│       ├── auth.ts             ← register, login, logout, getMe, verifyTwoFactor
│       └── books.ts            ← searchBooks (re-exports BookSearchResult from shared)
├── types/
│   └── index.ts                ← Re-exports User + BookSearchResult from @books-tracker/shared
├── components/
│   ├── Provider.tsx            ← ThemeProvider wraps ChakraProvider (order matters!)
│   └── common/
│       ├── index.ts            ← Re-exports all components
│       ├── Button.tsx          ← Custom button (purple/yellow, solid/outline)
│       ├── Input.tsx           ← Password input with animated eye toggle
│       ├── SearchBar.tsx       ← Search input with type selector (title/author/isbn)
│       ├── Card.tsx
│       ├── Badge.tsx
│       ├── Navbar.tsx          ← Server component, uses ThemeToggle as client leaf
│       ├── ThemeToggle.tsx     ← "use client", uses useTheme from next-themes
│       ├── PageWrapper.tsx
│       ├── Spinner.tsx
│       └── EmptyState.tsx
└── public/
    └── fonts/
        └── Joan-Regular.ttf
```

## Auth Flow
- Login → if `twoFactorRequired: true` → redirect to `/2fa` → verify → home
- Google OAuth → link to `/api/auth/google` (backend handles redirect)
- `AuthContext` fetches `GET /api/auth/me` on mount to restore session

## SearchBar
`Input.tsx` is password-only (Lock icon, Eye toggle). For non-password text inputs, build inline styled inputs matching the design tokens, as done in `SearchBar.tsx` and the auth sections.