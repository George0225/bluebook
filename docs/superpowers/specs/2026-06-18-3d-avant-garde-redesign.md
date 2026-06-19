# BlueBook 3D Avant-Garde Redesign Spec

**Date**: 2026-06-18
**Status**: Approved

## Goal

Transform BlueBook from a flat industrial-grid layout to an avant-garde 3D floating matrix with Three.js/R3F WebGL rendering. Cards float in 3D space with staggered depths, hover-lift animations, and flip interactions. Mobile degrades gracefully to CSS 3D.

## Architecture

### 3D Scene (Home/Discover/Section pages)

- **Canvas**: Full-screen `<Canvas>` from `@react-three/fiber`
- **Camera**: `PerspectiveCamera` fov=60, position z=12, mouse parallax offset
- **Lighting**: Ambient 0.4 + PointLight at camera 0.8 + emissive per section color
- **Post-processing**: `EffectComposer` + `Bloom` (hover glow)
- **Background**: Dark gradient sphere matching bb-surface-0 palette

### Card Mesh System

- Each card is a `<Plane>` mesh with `MeshStandardMaterial`
- HTML content overlaid via `drei` `<Html>` component (orthogonal, sprite-like)
- Material: dark surface base + section color as `emissive` (weak normally, strong on hover)
- Three depth layers: foreground (z=0), midground (z=-1.5), background (z=-3)
- Large cards placed at foreground z positions

### Staggered Layout Algorithm

- Cards positioned by 3D coordinates (x, y, z) instead of CSS Grid
- 3-4 cards per row, rows offset by y=-2.5
- Z-depth alternates per card (pattern: 0, -1.5, -3, -1.5, 0...)
- X positions: row-based with ±offset for stagger effect
- Scroll controls camera y-position (scroll = vertical traversal through 3D space)

### Interaction

- **Hover**: `onPointerOver/Out` → z+0.5 lift, rotateY 10°, emissive intensity boost, Bloom glow
- **Click**: `rotateY` 180° flip animation (500ms spring), back face shows summary preview via `<Html>`
- **Second click / detail link**: Router navigation to post detail page
- **Mouse parallax**: Camera position shifts ±0.3 based on mouse coordinates

### Mobile Fallback

- `<768px`: No Canvas, CSS 3D Transform cards with `perspective` container
  - Cards use `transform: rotateX/Y/Z translateZ` for 3D feel
  - Hover: `translateZ(20px) rotateY(5deg)` + scale
  - Flip: `rotateY(180deg)` CSS transition
  - Layout: CSS Grid with varied sizes (similar stagger via grid-template-rows)
- `768-1023px`: Canvas rendered, reduced card count (2 columns foreground only), no bloom
- `≥1024px`: Full 3D scene with all effects

### Page Assignments

| Page | 3D Level | Description |
|------|----------|-------------|
| Home (feed) | Full R3F | 3D floating card matrix |
| Discover | Full R3F | Section spheres orbit + hot posts floating |
| Section | Full R3F | Section-themed 3D card matrix |
| Post detail | DOM + CSS 3D | CSS 3D transitions, no Canvas |
| Messages | DOM + CSS 3D | CSS 3D transitions, no Canvas |
| Create | DOM + CSS 3D | CSS 3D transitions, no Canvas |
| Profile | DOM + CSS 3D | CSS 3D transitions, no Canvas |
| Search | DOM + CSS 3D | CSS 3D transitions, no Canvas |
| Auth | DOM | Pure DOM, no 3D |

### New Dependencies

- `three` — WebGL rendering core
- `@react-three/fiber` — React renderer for Three.js
- `@react-three/drei` — Helpers (Html, Bloom, PerspectiveCamera, etc.)
- `@react-three/postprocessing` — EffectComposer + Bloom

### Design Token Updates

- Add `--bb-3d-perspective: 1200px` for CSS fallback
- Add `--bb-3d-hover-lift: 20px` for CSS fallback
- Add `--bb-3d-flip-duration: 500ms` for CSS fallback
- Keep all existing surface/text/section colors — they map to 3D materials

### Key Components

**New Files:**
- `src/components/3d/bluebook-scene.tsx` — Main R3F Canvas scene wrapper
- `src/components/3d/card-mesh.tsx` — 3D card mesh with Html overlay + flip animation
- `src/components/3d/scene-background.tsx` — Dark gradient background sphere
- `src/components/3d/camera-rig.tsx` — PerspectiveCamera + mouse parallax + scroll control
- `src/components/3d/card-layout.tsx` — Staggered 3D position calculator + mesh group
- `src/components/3d/bloom-effects.tsx` — Post-processing setup
- `src/components/feed/css3d-grid.tsx` — Mobile/tablet CSS 3D fallback grid
- `src/components/feed/css3d-card.tsx` — Mobile/tablet CSS 3D fallback card

**Modified Files:**
- `src/app/page.tsx` — Replace IndustrialGrid with 3D scene or CSS3D fallback
- `src/app/discover/page.tsx` — Add 3D discover scene
- `src/app/[section]/page.tsx` — Add 3D section scene
- `src/hooks/use-responsive.ts` — Add `isLowPerformance` detection
- `package.json` — Add three/r3f/drei/postprocessing dependencies

**Preserved Files:**
- Sidebar, TopBar, ResponsiveShell — DOM overlay, no changes
- All data/stores/i18n — No changes
- Post detail, messages, create, profile, search pages — CSS 3D transitions added only
