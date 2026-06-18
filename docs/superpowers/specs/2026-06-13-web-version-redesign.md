# BlueBook Web Version Redesign — Design Spec

## Overview

Rebuild BlueBook from a mobile-only 512px layout to a full desktop web experience with responsive adaptation for tablet and mobile. The data layer (types, stores, mock data, i18n) is preserved; all layout, navigation, and page components are rewritten.

## Design Direction

**Industrial Masculine** — hard shadows, angular geometry, dark-mode-first, amber orange accents. Distinct from 小红书's soft/feminine aesthetic in every visual choice.

## Architecture: Sidebar + Centered Content

### Desktop (≥1024px / lg)

- **Left sidebar**: 240px fixed, contains logo, 5 nav items, 5 section shortcuts, user info
- **Top bar**: 56px, contains global search input, locale toggle, notification bell, user avatar
- **Content area**: `max-w-2xl` (672px) centered, `ml-[240px]` to offset sidebar
- Layout: `DesktopShell` component wraps sidebar + main area

### Tablet (768-1023px / md)

- **No persistent sidebar** — sidebar becomes a Sheet/drawer triggered by hamburger in top bar
- **Top bar**: hamburger menu + search + actions
- **Content area**: `max-w-xl` (576px) centered
- Layout: `TabletShell` component

### Mobile (<768px / sm)

- **Bottom tab bar**: 5 tabs (Home, Discover, Create, Messages, Profile) — same as current but improved
- **Top bar**: hamburger for sections drawer + search link + actions
- **Content area**: full width
- Layout: `MobileShell` component (rewritten, no longer 512px locked)

### Breakpoint Summary

| Breakpoint | Layout | Navigation | Content Width | Grid Columns |
|---|---|---|---|---|
| ≥1024px (lg) | Sidebar + TopBar | Left sidebar (240px) | max-w-2xl (672px) | 3 columns |
| 768-1023px (md) | TopBar + Drawer | Hamburger → Sheet | max-w-xl (576px) | 2-3 columns |
| <768px (sm) | TopBar + BottomTab | Bottom tabs | Full width | 2 columns |

## Component Reuse Map

### Keep (unchanged)
- `src/types/*` — all type definitions
- `src/data/*` — all mock data
- `src/stores/*` — all Zustand stores
- `src/i18n/*` — i18n provider and messages
- `src/lib/*` — utils, constants, animations
- `src/components/ui/*` — shadcn/ui components

### Rewrite
- `src/components/layout/*` — all layout components (sidebar, shell, top bar, tabs)
- `src/app/*` — all page files
- `src/components/feed/*` — waterfall grid (CSS Grid instead of columns)
- `src/components/shared/*` — gradient cover/avatar (minor adjustments)

### New Components
- `src/components/layout/sidebar.tsx` — desktop sidebar navigation
- `src/components/layout/sidebar-sheet.tsx` — tablet/mobile drawer version
- `src/components/layout/desktop-shell.tsx` — desktop layout wrapper
- `src/components/layout/tablet-shell.tsx` — tablet layout wrapper
- `src/components/layout/top-bar.tsx` — desktop/tablet top bar with search
- `src/components/feed/industrial-grid.tsx` — CSS Grid masonry with modulated heights
- `src/components/feed/feed-card-large.tsx` — large card variant (1:1.8 aspect)
- `src/hooks/use-responsive.ts` — breakpoint detection hook
- `src/components/layout/responsive-shell.tsx` — responsive shell that switches between layouts

## Key Design Decisions

### 1. Industrial Grid (Feed)

Replaces the random-height CSS columns waterfall with a **modulated stepped grid** using CSS Grid:

- Two card sizes: **Standard** (1:1.2 aspect) and **Large** (1:1.8 aspect)
- Ratio: 2 standard : 1 large, repeating pattern: columns cycle through [standard, standard, large], each row offset by one column position, creating a diagonal stepped rhythm
- Large card spans 2 grid rows, creating visual rhythm
- CSS Grid with `grid-auto-rows` and `grid-row: span 2` for large cards
- Desktop: 3 columns, Tablet: 2-3 columns, Mobile: 2 columns

**vs 小红书 differences:**
- Modulated heights (not random) → visual rhythm, not chaos
- Gradient + geometric texture covers (not photos) → industrial aesthetic
- Hard shadows with 2px offset (not soft/none) → volume and depth
- 8px border radius (not 12-16px) → angular, not soft
- Hover lift + shadow increase → tactile industrial interaction

### 2. Sidebar Navigation

Persistent 240px sidebar on desktop with:

- **Logo area**: Brand mark + "小蓝书 / BlueBook"
- **Primary nav**: 5 items (Home, Discover, Create, Messages, Profile)
  - Active state: amber text + 3px left border bar
  - Create button: amber background + hard shadow (industrial button)
  - Messages: amber unread count badge
- **Sections**: 5 section shortcuts with themed color hover indicators
- **User area**: Fixed bottom, avatar + name + influence score, click for dropdown menu (settings/logout/dark mode)

### 3. Top Bar (Desktop)

56px height, contains:

- Global search input (inline, not a separate page)
- Locale toggle button
- Notification bell with unread count
- User avatar (quick menu trigger)

### 4. Page Layouts

**Home**: Feed tabs (Recommended/Following) → Category tabs → Industrial grid
**Post Detail**: Full-width cover → Content → Interaction bar → Dual-tab comments → Inline comment input
**Discover**: 3-column section cards → Hot posts ranked list
**Profile**: Banner + avatar overlay → Stats row (4 cards) → Achievement badges → 5-column post grid
**Create**: Format selector → Drag-drop upload → Full-width editor → Section/tag pickers
**Search**: Inline results with filters → Trending tags section
**Messages**: Tab-based notifications + DM conversations

### 5. Responsive Behavior

The `ResponsiveShell` component detects viewport width and renders:
- `DesktopShell` at ≥1024px
- `TabletShell` at 768-1023px
- `MobileShell` at <768px

Uses client-side `useMediaQuery` hook (not CSS container queries) since the three shells have completely different component trees. Navigation state (active section, tab) is shared via Zustand stores across all layouts.

## File Structure (New/Changed)

```
src/
├── app/
│   ├── layout.tsx              ← Update: add ResponsiveShell wrapper
│   ├── page.tsx                ← Rewrite: desktop-aware home page
│   ├── discover/page.tsx       ← Rewrite: 3-col section cards
│   ├── create/page.tsx         ← Rewrite: wider editor, drag-drop
│   ├── messages/page.tsx       ← Rewrite: desktop message layout
│   ├── profile/page.tsx        ← Rewrite: banner + stats + 5-col grid
│   ├── search/page.tsx         ← Rewrite: inline search results
│   ├── post/[id]/page.tsx      ← Rewrite: wider detail layout
│   ├── [section]/page.tsx      ← Rewrite: section page with hero
│   ├── auth/login/page.tsx     ← Minor: widen form on desktop
│   ├── auth/register/page.tsx  ← Minor: widen form on desktop
│   └── not-found.tsx           ← Keep
├── components/
│   ├── layout/
│   │   ├── sidebar.tsx         ← NEW: desktop sidebar
│   │   ├── sidebar-sheet.tsx   ← NEW: tablet/mobile drawer
│   │   ├── desktop-shell.tsx   ← NEW: sidebar + topbar + content
│   │   ├── tablet-shell.tsx    ← NEW: topbar + drawer + content
│   │   ├── mobile-shell.tsx    ← REWRITE: no max-w-lg lock
│   │   ├── responsive-shell.tsx← NEW: breakpoint switcher
│   │   ├── top-bar.tsx         ← REWRITE: inline search
│   │   ├── bottom-tab-bar.tsx  ← KEEP: mobile only
│   │   └── category-tabs.tsx   ← KEEP: minor style adjustments
│   ├── feed/
│   │   ├── industrial-grid.tsx ← NEW: CSS Grid masonry
│   │   ├── feed-card.tsx       ← REWRITE: two size variants
│   │   ├── feed-card-large.tsx ← NEW: large card (1:1.8)
│   │   └── feed-tabs.tsx       ← KEEP
│   └── ... (other components mostly kept)
├── hooks/
│   └── use-responsive.ts       ← NEW: breakpoint detection
└── ... (data, stores, types, i18n, lib — all kept)
```

## Out of Scope

- Light mode (dark mode only for now)
- Real backend integration
- Video playback
- Real-time features (WebSocket, live updates)
- PWA/service worker
- SEO optimization beyond basic meta tags
