# BlueBook 3D Avant-Garde Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform BlueBook's feed from a flat CSS grid to a Three.js/R3F 3D floating card matrix with hover-lift, flip, and bloom effects. Mobile degrades to CSS 3D.

**Architecture:** Full-screen `<Canvas>` renders card meshes in 3D space. HTML content overlaid via `drei` `<Html>`. Mouse parallax controls camera. Hover detected by `onPointerOver/Out`. Mobile (<768px) uses CSS 3D Transform fallback. Sidebar/TopBar remain as DOM overlay.

**Tech Stack:** Next.js 16 + TypeScript + Tailwind CSS 4 + Three.js + @react-three/fiber + @react-three/drei + @react-three/postprocessing + Framer Motion

---

## File Structure

### New Files
| File | Responsibility |
|---|---|
| `src/components/3d/bluebook-scene.tsx` | R3F Canvas wrapper with scene, lighting, post-processing |
| `src/components/3d/card-mesh.tsx` | Single 3D card mesh with Html overlay, hover, flip animation |
| `src/components/3d/card-layout.tsx` | Staggered 3D position calculator + mesh group renderer |
| `src/components/3d/camera-rig.tsx` | PerspectiveCamera + mouse parallax + scroll control |
| `src/components/3d/scene-background.tsx` | Dark gradient background sphere |
| `src/components/3d/bloom-effects.tsx` | Post-processing EffectComposer + Bloom |
| `src/components/feed/css3d-grid.tsx` | Mobile CSS 3D Transform fallback grid |
| `src/components/feed/css3d-card.tsx` | Mobile CSS 3D Transform fallback card |

### Modified Files
| File | Change |
|---|---|
| `package.json` | Add three, r3f, drei, postprocessing deps |
| `src/hooks/use-responsive.ts` | Add `useIs3DCapable` for GPU detection |
| `src/app/page.tsx` | Replace IndustrialGrid with 3D scene / CSS3D fallback |
| `src/app/discover/page.tsx` | Add 3D discover scene |
| `src/app/[section]/section-content.tsx` | Add 3D section scene |
| `src/app/globals.css` | Add 3D CSS variables for fallback |

---

## Task 1: Install 3D Dependencies

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install Three.js and R3F packages**

```bash
cd D:/ClaudeProject/bluebook && npm install three @react-three/fiber @react-three/drei @react-three/postprocessing @types/three --save
```

- [ ] **Step 2: Verify installation**

Run: `node -e "require('three'); require('@react-three/fiber'); require('@react-three/drei'); console.log('OK')"`
Expected: OK

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "feat: add three.js, r3f, drei, and postprocessing dependencies"
```

---

## Task 2: CSS 3D Design Tokens + useIs3DCapable Hook

**Files:**
- Modify: `src/app/globals.css` — add 3D CSS variables
- Modify: `src/hooks/use-responsive.ts` — add `useIs3DCapable`

- [ ] **Step 1: Add CSS 3D variables to globals.css**

In `src/app/globals.css`, after the `--bb-shadow-elevated` line, add:

```css
  /* 3D CSS fallback tokens */
  --bb-3d-perspective: 1200px;
  --bb-3d-hover-lift: 20px;
  --bb-3d-flip-duration: 500ms;
  --bb-3d-hover-rotate: 5deg;
```

- [ ] **Step 2: Add useIs3DCapable to use-responsive.ts**

Replace the entire content of `src/hooks/use-responsive.ts`:

```ts
"use client";

import { useState, useEffect } from "react";

export type Breakpoint = "mobile" | "tablet" | "desktop";

export function useResponsive(): Breakpoint {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>("desktop");

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w >= 1024) setBreakpoint("desktop");
      else if (w >= 768) setBreakpoint("tablet");
      else setBreakpoint("mobile");
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return breakpoint;
}

export function useIs3DCapable(): boolean {
  const [capable, setCapable] = useState(true);

  useEffect(() => {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
    const isMobile = window.innerWidth < 768;
    // Disable 3D on mobile or if WebGL is not available
    setCapable(!isMobile && !!gl);
    canvas.remove();
  }, []);

  return capable;
}
```

- [ ] **Step 3: Verify build**

Run: `npx next build 2>&1 | tail -5`
Expected: Build succeeds

- [ ] **Step 4: Commit**

```bash
git add src/app/globals.css src/hooks/use-responsive.ts
git commit -m "feat: add 3D CSS tokens and useIs3DCapable hook"
```

---

## Task 3: Scene Background + Camera Rig + Bloom Effects

**Files:**
- Create: `src/components/3d/scene-background.tsx`
- Create: `src/components/3d/camera-rig.tsx`
- Create: `src/components/3d/bloom-effects.tsx`

- [ ] **Step 1: Create scene-background.tsx**

```tsx
"use client";

import * as THREE from "three";
import { Mesh } from "three";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

export function SceneBackground() {
  const meshRef = useRef<Mesh>(null);

  // Slow rotation for ambient movement
  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.02;
    }
  });

  return (
    <mesh ref={meshRef} scale={[-50, 50, 50]}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshBasicMaterial
        color="#13151F"
        side={THREE.BackSide}
      />
    </mesh>
  );
}
```

Note: needs `import * as THREE from "three"` at the top of the file.

- [ ] **Step 2: Create camera-rig.tsx**

```tsx
"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";

export function CameraRig({ scrollY = 0 }: { scrollY?: number }) {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const { size } = useThree();

  // Track mouse position
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current.x = (e.clientX / size.width) * 2 - 1;
      mousePos.current.y = -(e.clientY / size.height) * 2 + 1;
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [size]);

  // Parallax: camera shifts based on mouse + scroll
  useFrame(() => {
    if (cameraRef.current) {
      // Mouse parallax (±0.3 offset)
      cameraRef.current.position.x += (mousePos.current.x * 0.3 - cameraRef.current.position.x) * 0.05;
      cameraRef.current.position.y += (mousePos.current.y * 0.2 - cameraRef.current.position.y + 12 - scrollY * 0.01) * 0.05;
      cameraRef.current.lookAt(0, 12 - scrollY * 0.01, 0);
    }
  });

  return (
    <PerspectiveCamera
      ref={cameraRef}
      makeDefault
      fov={60}
      position={[0, 12, 12]}
    />
  );
}
```

Wait — the useEffect import is missing. Let me fix that. The final version:

```tsx
"use client";

import { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";

export function CameraRig({ scrollY = 0 }: { scrollY?: number }) {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const { size } = useThree();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current.x = (e.clientX / size.width) * 2 - 1;
      mousePos.current.y = -(e.clientY / size.height) * 2 + 1;
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [size]);

  useFrame(() => {
    if (cameraRef.current) {
      cameraRef.current.position.x += (mousePos.current.x * 0.3 - cameraRef.current.position.x) * 0.05;
      const targetY = 12 - scrollY * 0.01 + mousePos.current.y * 0.2;
      cameraRef.current.position.y += (targetY - cameraRef.current.position.y) * 0.05;
      cameraRef.current.lookAt(0, 12 - scrollY * 0.01, 0);
    }
  });

  return (
    <PerspectiveCamera
      ref={cameraRef}
      makeDefault
      fov={60}
      position={[0, 12, 12]}
    />
  );
}
```

- [ ] **Step 3: Create bloom-effects.tsx**

```tsx
"use client";

import { EffectComposer, Bloom } from "@react-three/postprocessing";

export function BloomEffects() {
  return (
    <EffectComposer>
      <Bloom
        luminanceThreshold={0.2}
        luminanceSmoothing={0.9}
        intensity={0.6}
      />
    </EffectComposer>
  );
}
```

- [ ] **Step 4: Verify build**

Run: `npx next build 2>&1 | tail -5`
Expected: Build succeeds

- [ ] **Step 5: Commit**

```bash
git add src/components/3d/
git commit -m "feat: add 3D scene background, camera rig, and bloom effects"
```

---

## Task 4: 3D Card Mesh

**Files:**
- Create: `src/components/3d/card-mesh.tsx`

This is the core component — a 3D plane mesh with HTML overlay, hover animation, and click-flip behavior.

- [ ] **Step 1: Create card-mesh.tsx**

```tsx
"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import Link from "next/link";
import { Flame } from "lucide-react";
import type { Post } from "@/types/post";
import { SECTIONS } from "@/lib/constants";
import { useI18n } from "@/i18n/provider";
import { GradientAvatar } from "@/components/shared/gradient-avatar";
import { TagBadge } from "@/components/shared/tag-badge";

// Section color map (hex values for Three.js materials — can't use CSS vars)
const SECTION_HEX: Record<string, string> = {
  awareness: "#7B68EE",
  social: "#5B9BD5",
  gaming: "#9B59B6",
  fitness: "#4A5D4E",
  finance: "#B8963E",
};

interface CardMeshProps {
  post: Post;
  position: [number, number, number];
  size: "standard" | "large";
}

export function CardMesh({ post, position, size }: CardMeshProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);
  const [hovered, setHovered] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const { t } = useI18n();

  const section = SECTIONS[post.sectionId];
  const sectionHex = SECTION_HEX[post.sectionId] || "#E8782A";

  // Card dimensions based on size
  const cardWidth = size === "large" ? 2.8 : 2.2;
  const cardHeight = size === "large" ? 3.8 : 2.6;

  // Animation targets
  const targetZ = hovered ? position[2] + 0.5 : position[2];
  const targetRotY = hovered ? 0.17 : 0; // ~10 degrees
  const flipRotY = flipped ? Math.PI : 0;
  const emissiveIntensity = hovered ? 0.4 : 0.05;

  useFrame(() => {
    if (meshRef.current) {
      // Smooth z lift
      meshRef.current.position.z += (targetZ - meshRef.current.position.z) * 0.1;
      // Smooth hover rotate
      const currentHoverRot = meshRef.current.rotation.y % Math.PI;
      // Flip rotation (hover rotation is additive on top of flip)
      const totalTargetRotY = flipRotY + targetRotY;
      meshRef.current.rotation.y += (totalTargetRotY - meshRef.current.rotation.y) * 0.08;
    }
    if (materialRef.current) {
      // Smooth emissive
      materialRef.current.emissiveIntensity += (emissiveIntensity - materialRef.current.emissiveIntensity) * 0.1;
    }
  });

  const handleClick = (e: THREE.Event) => {
    e.stopPropagation();
    if (flipped) {
      // Second click: navigate to detail
      // We can't use router inside R3F, so we use a DOM link in the Html overlay
    } else {
      setFlipped(true);
    }
  };

  return (
    <mesh
      ref={meshRef}
      position={[position[0], position[1], position[2]]}
      onClick={handleClick}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
      onPointerOut={() => setHovered(false)}
    >
      <planeGeometry args={[cardWidth, cardHeight]} />
      <meshStandardMaterial
        ref={materialRef}
        color="#1A1D2E"
        emissive={sectionHex}
        emissiveIntensity={0.05}
        roughness={0.7}
        metalness={0.3}
      />

      {/* Front face HTML overlay */}
      {!flipped && (
        <Html
          transform
          occlude
          distanceFactor={8}
          position={[0, 0, 0.01]}
          rotation={[0, 0, 0]}
          style={{
            width: `${cardWidth * 80}px`,
            height: `${cardHeight * 80}px`,
            pointerEvents: "auto",
          }}
        >
          <div className="w-full h-full rounded-lg bg-bb-surface-1/95 border border-bb-border overflow-hidden shadow-bb-card flex flex-col">
            {/* Gradient cover */}
            <div
              className="flex-1 min-h-[40%]"
              style={{ background: post.coverGradient }}
            />

            {/* Content */}
            <div className="p-3 space-y-2">
              <div className="flex items-start gap-1.5">
                {post.isHot && <Flame className="h-3.5 w-3.5 text-bb-amber flex-shrink-0 mt-0.5" />}
                <h3 className={`font-semibold text-bb-text-1 line-clamp-2 leading-tight ${size === "large" ? "text-base" : "text-sm"}`}>
                  {post.title}
                </h3>
              </div>

              {size === "large" && (
                <p className="text-xs text-bb-text-2 line-clamp-2">{post.summary}</p>
              )}

              <TagBadge label={t(section.nameKey)} color={section.color} />

              <div className="flex items-center gap-1.5">
                <GradientAvatar color={post.author.avatarColor} initial={post.author.avatarInitial} size="sm" />
                <span className="text-xs text-bb-text-3 truncate max-w-[80px]">
                  {post.author.name}
                </span>
              </div>
            </div>
          </div>
        </Html>
      )}

      {/* Back face HTML overlay — summary preview */}
      {flipped && (
        <Html
          transform
          distanceFactor={8}
          position={[0, 0, -0.01]}
          rotation={[0, Math.PI, 0]}
          style={{
            width: `${cardWidth * 80}px`,
            height: `${cardHeight * 80}px`,
            pointerEvents: "auto",
          }}
        >
          <div className="w-full h-full rounded-lg bg-bb-surface-1/95 border border-bb-border overflow-hidden shadow-bb-card p-4 flex flex-col items-center justify-center gap-3">
            <TagBadge label={t(section.nameKey)} color={section.color} />
            <h3 className="text-lg font-bold text-bb-text-1 text-center line-clamp-3">
              {post.title}
            </h3>
            <p className="text-sm text-bb-text-2 text-center line-clamp-4">
              {post.summary}
            </p>
            <div className="flex items-center gap-1.5">
              <GradientAvatar color={post.author.avatarColor} initial={post.author.avatarInitial} size="sm" />
              <span className="text-xs text-bb-text-3">{post.author.name}</span>
            </div>
            <Link
              href={`/post/${post.id}`}
              className="rounded-button bg-bb-amber px-4 py-2 text-sm font-bold text-bb-surface-0 shadow-bb-button hover:bg-bb-amber/90 transition-colors"
            >
              查看详情
            </Link>
            <button
              onClick={() => setFlipped(false)}
              className="text-xs text-bb-text-3 hover:text-bb-amber transition-colors"
            >
              返回
            </button>
          </div>
        </Html>
      )}
    </mesh>
  );
}
```

- [ ] **Step 2: Verify build**

Run: `npx next build 2>&1 | tail -5`
Expected: Build succeeds

- [ ] **Step 3: Commit**

```bash
git add src/components/3d/card-mesh.tsx
git commit -m "feat: add 3D card mesh with Html overlay, hover, and flip"
```

---

## Task 5: Card Layout Algorithm + Bluebook Scene

**Files:**
- Create: `src/components/3d/card-layout.tsx` — staggered 3D position calculator
- Create: `src/components/3d/bluebook-scene.tsx` — main scene wrapper

- [ ] **Step 1: Create card-layout.tsx**

```tsx
"use client";

import type { Post } from "@/types/post";
import { CardMesh } from "./card-mesh";

// Staggered 3D position calculator
function calculatePositions(count: number, columns: number): [number, number, number, "standard" | "large"][] {
  const positions: [number, number, number, "standard" | "large"][] = [];
  const rowHeight = 3.2;
  const colWidth = 3.0;
  const zPattern = [0, -1.5, -3, -1.5]; // Z-depth cycle
  // Size pattern: large every 5th card
  const sizePattern = (i: number) => {
    const pos = i % 9;
    return [2, 4, 8].includes(pos) ? "large" : "standard";
  };

  // Stagger X offsets per row (alternating)
  const staggerOffsets = [0, -0.8, 0.5, -0.3];

  for (let i = 0; i < count; i++) {
    const row = Math.floor(i / columns);
    const col = i % columns;
    const staggerX = staggerOffsets[row % staggerOffsets.length];

    const x = (col - (columns - 1) / 2) * colWidth + staggerX;
    const y = -row * rowHeight + 6; // Start near top, scroll down
    const z = zPattern[i % zPattern.length];
    const size = sizePattern(i);

    positions.push([x, y, z, size]);
  }

  return positions;
}

interface CardLayoutProps {
  posts: Post[];
  columns?: number;
}

export function CardLayout({ posts, columns = 3 }: CardLayoutProps) {
  const positions = calculatePositions(posts.length, columns);

  return (
    <group>
      {posts.map((post, i) => {
        const [x, y, z, size] = positions[i];
        return (
          <CardMesh
            key={post.id}
            post={post}
            position={[x, y, z]}
            size={size}
          />
        );
      })}
    </group>
  );
}
```

- [ ] **Step 2: Create bluebook-scene.tsx**

```tsx
"use client";

import { Suspense, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Preload } from "@react-three/drei";
import { CardLayout } from "./card-layout";
import { CameraRig } from "./camera-rig";
import { SceneBackground } from "./scene-background";
import { BloomEffects } from "./bloom-effects";
import type { Post } from "@/types/post";

interface BluebookSceneProps {
  posts: Post[];
  columns?: number;
}

export function BluebookScene({ posts, columns = 3 }: BluebookSceneProps) {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="w-full h-[calc(100vh-56px)] fixed top-14 left-0 lg:left-60">
      <Canvas
        dpr={[1, 2]}
        camera={{ fov: 60, position: [0, 12, 12] }}
        style={{ background: "#13151F" }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.4} />
          <pointLight position={[0, 12, 12]} intensity={0.8} />
          <SceneBackground />
          <CameraRig scrollY={scrollY} />
          <CardLayout posts={posts} columns={columns} />
          <BloomEffects />
          <Preload all />
        </Suspense>
      </Canvas>
    </div>
  );
}
```

- [ ] **Step 3: Verify build**

Run: `npx next build 2>&1 | tail -5`
Expected: Build succeeds

- [ ] **Step 4: Commit**

```bash
git add src/components/3d/card-layout.tsx src/components/3d/bluebook-scene.tsx
git commit -m "feat: add 3D card layout algorithm and bluebook scene wrapper"
```

---

## Task 6: CSS 3D Fallback (Mobile)

**Files:**
- Create: `src/components/feed/css3d-card.tsx`
- Create: `src/components/feed/css3d-grid.tsx`

- [ ] **Step 1: Create css3d-card.tsx**

```tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { Flame } from "lucide-react";
import type { Post } from "@/types/post";
import { SECTIONS } from "@/lib/constants";
import { useI18n } from "@/i18n/provider";
import { GradientAvatar } from "@/components/shared/gradient-avatar";
import { TagBadge } from "@/components/shared/tag-badge";

interface CSS3DCardProps {
  post: Post;
  size?: "standard" | "large";
}

export function CSS3DCard({ post, size = "standard" }: CSS3DCardProps) {
  const { t } = useI18n();
  const section = SECTIONS[post.sectionId];
  const [hovered, setHovered] = useState(false);
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className="perspective-container"
      style={{ perspective: "var(--bb-3d-perspective)" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); if (flipped) setFlipped(false); }}
    >
      <div
        className="card-inner"
        style={{
          transition: `transform var(--bb-3d-flip-duration) cubic-bezier(0.4, 0, 0.2, 1)`,
          transformStyle: "preserve-3d",
          transform: flipped
            ? "rotateY(180deg)"
            : hovered
              ? `translateZ(var(--bb-3d-hover-lift)) rotateY(var(--bb-3d-hover-rotate))`
              : "translateZ(0) rotateY(0)",
        }}
        onClick={() => setFlipped(!flipped)}
      >
        {/* Front face */}
        <div
          className="card-face card-face-front"
          style={{ backfaceVisibility: "hidden" }}
        >
          <div className={`rounded-card bg-bb-surface-1 border border-bb-border overflow-hidden shadow-bb-card ${hovered ? "shadow-bb-elevated" : ""}`}>
            <div
              className={size === "large" ? "h-40" : "h-28"}
              style={{ background: post.coverGradient }}
            />
            <div className="p-3 space-y-2">
              <div className="flex items-start gap-1.5">
                {post.isHot && <Flame className="h-3.5 w-3.5 text-bb-amber flex-shrink-0 mt-0.5" />}
                <h3 className={`font-semibold text-bb-text-1 line-clamp-2 leading-tight ${size === "large" ? "text-base" : "text-sm"}`}>
                  {post.title}
                </h3>
              </div>
              {size === "large" && (
                <p className="text-xs text-bb-text-2 line-clamp-2">{post.summary}</p>
              )}
              <TagBadge label={t(section.nameKey)} color={section.color} />
              <div className="flex items-center gap-1.5">
                <GradientAvatar color={post.author.avatarColor} initial={post.author.avatarInitial} size="sm" />
                <span className="text-xs text-bb-text-3 truncate max-w-[80px]">{post.author.name}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Back face */}
        <div
          className="card-face card-face-back"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            position: "absolute",
            inset: 0,
          }}
        >
          <div className="rounded-card bg-bb-surface-1 border border-bb-border overflow-hidden shadow-bb-card h-full p-4 flex flex-col items-center justify-center gap-2">
            <TagBadge label={t(section.nameKey)} color={section.color} />
            <h3 className="text-base font-bold text-bb-text-1 text-center line-clamp-3">{post.title}</h3>
            <p className="text-xs text-bb-text-2 text-center line-clamp-3">{post.summary}</p>
            <Link
              href={`/post/${post.id}`}
              className="rounded-button bg-bb-amber px-4 py-2 text-sm font-bold text-bb-surface-0 shadow-bb-button"
            >
              查看详情
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create css3d-grid.tsx**

```tsx
"use client";

import type { Post } from "@/types/post";
import { CSS3DCard } from "./css3d-card";

interface CSS3DGridProps {
  posts: Post[];
  columns?: 2 | 3;
}

export function CSS3DGrid({ posts, columns = 2 }: CSS3DGridProps) {
  // Same size pattern as 3D version
  const getSize = (i: number) => {
    const pos = i % 9;
    return [2, 4, 8].includes(pos) ? "large" : "standard";
  };

  return (
    <div
      className="grid gap-3 px-4 py-4"
      style={{
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
        gridAutoRows: "minmax(120px, auto)",
      }}
    >
      {posts.map((post, i) => (
        <div key={post.id} className={getSize(i) === "large" ? "row-span-2" : ""}>
          <CSS3DCard post={post} size={getSize(i)} />
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 3: Verify build**

Run: `npx next build 2>&1 | tail -5`
Expected: Build succeeds

- [ ] **Step 4: Commit**

```bash
git add src/components/feed/css3d-card.tsx src/components/feed/css3d-grid.tsx
git commit -m "feat: add CSS 3D Transform fallback cards and grid for mobile"
```

---

## Task 7: Rewrite Home Page with 3D Scene

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Rewrite home page**

```tsx
"use client";

import { useMemo } from "react";
import { ResponsiveShell } from "@/components/layout/responsive-shell";
import { CategoryTabs } from "@/components/layout/category-tabs";
import { FeedTabs } from "@/components/feed/feed-tabs";
import { BluebookScene } from "@/components/3d/bluebook-scene";
import { CSS3DGrid } from "@/components/feed/css3d-grid";
import { useFeedStore } from "@/stores/feed-store";
import { useResponsive, useIs3DCapable } from "@/hooks/use-responsive";
import { mockPosts } from "@/data/mock-posts";
import type { SectionId } from "@/types/post";

export default function HomePage() {
  const { activeTab, activeSection, setTab, setSection } = useFeedStore();
  const breakpoint = useResponsive();
  const is3DCapable = useIs3DCapable();

  const filteredPosts = useMemo(() => {
    let posts = mockPosts;
    if (activeSection !== "all") {
      posts = posts.filter((p) => p.sectionId === activeSection);
    }
    if (activeTab === "following") {
      posts = posts.filter((p) => ["u1", "u2", "u4", "u5"].includes(p.author.id));
    }
    return posts;
  }, [activeTab, activeSection]);

  const gridColumns = breakpoint === "mobile" ? 2 : 3;

  return (
    <ResponsiveShell>
      {/* Tabs always in DOM layer */}
      <div className="max-w-2xl mx-auto relative z-10">
        <FeedTabs activeTab={activeTab} onTabChange={setTab} />
        <CategoryTabs
          activeSection={activeSection as SectionId | "all"}
          onSectionChange={setSection}
        />
      </div>

      {/* 3D scene or CSS fallback */}
      {filteredPosts.length > 0 && is3DCapable ? (
        <BluebookScene posts={filteredPosts} columns={gridColumns} />
      ) : filteredPosts.length > 0 ? (
        <CSS3DGrid posts={filteredPosts} columns={gridColumns} />
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-bb-text-3">
          <p className="text-sm">暂无内容</p>
        </div>
      )}
    </ResponsiveShell>
  );
}
```

- [ ] **Step 2: Verify build**

Run: `npx next build 2>&1 | tail -5`
Expected: Build succeeds

- [ ] **Step 3: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: rewrite home page with 3D scene and CSS fallback"
```

---

## Task 8: Rewrite Discover Page with 3D Scene

**Files:**
- Modify: `src/app/discover/page.tsx`

The discover page uses the same 3D card matrix for hot posts, with section cards as DOM overlay above the scene.

- [ ] **Step 1: Rewrite discover page**

```tsx
"use client";

import Link from "next/link";
import { Flame, Shield, Search, Gamepad2, Dumbbell, TrendingUp } from "lucide-react";
import { ResponsiveShell } from "@/components/layout/responsive-shell";
import { BluebookScene } from "@/components/3d/bluebook-scene";
import { CSS3DGrid } from "@/components/feed/css3d-grid";
import { GradientAvatar } from "@/components/shared/gradient-avatar";
import { useI18n } from "@/i18n/provider";
import { useResponsive, useIs3DCapable } from "@/hooks/use-responsive";
import { SECTIONS } from "@/lib/constants";
import { getHotPosts } from "@/data/mock-posts";

const sectionIcons = { Shield, Search, Gamepad2, Dumbbell, TrendingUp } as const;

export default function DiscoverPage() {
  const { t } = useI18n();
  const breakpoint = useResponsive();
  const is3DCapable = useIs3DCapable();
  const hotPosts = getHotPosts();

  return (
    <ResponsiveShell title={t("nav.discover")}>
      {/* Section cards as DOM overlay */}
      <div className="max-w-2xl mx-auto px-4 py-4 relative z-10">
        <h2 className="text-base font-bold text-bb-text-1 mb-3">{t("nav.discover")}</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {Object.values(SECTIONS).map((section) => {
            const Icon = sectionIcons[section.icon as keyof typeof sectionIcons];
            return (
              <Link
                key={section.id}
                href={section.route}
                className="group relative overflow-hidden rounded-card border border-bb-border bg-bb-surface-1 p-4 shadow-bb-card hover:shadow-bb-elevated hover:-translate-y-0.5 transition-all duration-200"
              >
                <div
                  className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity"
                  style={{ background: section.color }}
                />
                <div className="relative space-y-3">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-lg"
                    style={{ backgroundColor: `${section.color}25` }}
                  >
                    <div style={{ color: section.color }}>
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-bb-text-1">{t(section.nameKey)}</h3>
                    <p className="text-xs text-bb-text-3 mt-1">{t(section.descKey)}</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Hot posts in 3D or CSS fallback */}
      <div className="relative z-10 px-4 mt-6">
        <h2 className="text-base font-bold text-bb-text-1 mb-4">{t("feed.hotPosts")}</h2>
      </div>

      {hotPosts.length > 0 && is3DCapable ? (
        <BluebookScene posts={hotPosts} columns={breakpoint === "mobile" ? 2 : 3} />
      ) : hotPosts.length > 0 ? (
        <CSS3DGrid posts={hotPosts} columns={breakpoint === "mobile" ? 2 : 3} />
      ) : (
        <div className="flex items-center justify-center py-20 text-sm text-bb-text-3">
          {t("common.noResults")}
        </div>
      )}
    </ResponsiveShell>
  );
}
```

- [ ] **Step 2: Verify build**

Run: `npx next build 2>&1 | tail -5`
Expected: Build succeeds

- [ ] **Step 3: Commit**

```bash
git add src/app/discover/page.tsx
git commit -m "feat: rewrite discover page with 3D hot posts scene"
```

---

## Task 9: Rewrite Section Page with 3D Scene

**Files:**
- Modify: `src/app/[section]/section-content.tsx`

- [ ] **Step 1: Rewrite section-content.tsx**

```tsx
"use client";

import { Shield, Search, Gamepad2, Dumbbell, TrendingUp } from "lucide-react";
import { ResponsiveShell } from "@/components/layout/responsive-shell";
import { BluebookScene } from "@/components/3d/bluebook-scene";
import { CSS3DGrid } from "@/components/feed/css3d-grid";
import { useI18n } from "@/i18n/provider";
import { useResponsive, useIs3DCapable } from "@/hooks/use-responsive";
import { getPostsBySection } from "@/data/mock-posts";
import { SECTIONS } from "@/lib/constants";
import type { SectionId } from "@/types/post";

const iconMap = { Shield, Search, Gamepad2, Dumbbell, TrendingUp } as const;

export function SectionContent({ sectionId }: { sectionId: string }) {
  const { t } = useI18n();
  const breakpoint = useResponsive();
  const is3DCapable = useIs3DCapable();

  const section = SECTIONS[sectionId as SectionId];
  const posts = getPostsBySection(sectionId as SectionId);
  const Icon = iconMap[section.icon as keyof typeof iconMap];

  return (
    <ResponsiveShell showBack title={t(section.nameKey)}>
      {/* Hero banner as DOM overlay */}
      <div
        className="max-w-2xl mx-auto relative z-10 px-4 py-6 overflow-hidden"
        style={{ background: `linear-gradient(180deg, ${section.color}20, transparent)` }}
      >
        <div className="flex items-center gap-4">
          <div
            className="flex h-16 w-16 items-center justify-center rounded-xl"
            style={{ backgroundColor: `${section.color}30` }}
          >
            <div style={{ color: section.color }}>
              <Icon className="h-8 w-8" strokeWidth={2} />
            </div>
          </div>
          <div>
            <h1 className="text-xl font-bold text-bb-text-1">{t(section.nameKey)}</h1>
            <p className="text-sm text-bb-text-3 mt-0.5">{t(section.descKey)}</p>
          </div>
        </div>
      </div>

      {/* Posts in 3D or CSS fallback */}
      {posts.length > 0 && is3DCapable ? (
        <BluebookScene posts={posts} columns={breakpoint === "mobile" ? 2 : 3} />
      ) : posts.length > 0 ? (
        <CSS3DGrid posts={posts} columns={breakpoint === "mobile" ? 2 : 3} />
      ) : (
        <div className="flex items-center justify-center py-20 text-sm text-bb-text-3">
          暂无内容
        </div>
      )}
    </ResponsiveShell>
  );
}
```

- [ ] **Step 2: Verify build**

Run: `npx next build 2>&1 | tail -5`
Expected: Build succeeds

- [ ] **Step 3: Commit**

```bash
git add src/app/[section]/section-content.tsx
git commit -m "feat: rewrite section page with 3D card matrix"
```

---

## Task 10: Final Build Verification

- [ ] **Step 1: Run production build**

Run: `npx next build`
Expected: Build succeeds with no TypeScript errors

- [ ] **Step 2: Start dev server and visually verify**

Run: `npx next dev --port 3000`

Verify:
- **Desktop (≥1024px)**: 3D Canvas scene renders, cards float in staggered positions, hover lifts cards, click flips cards, mouse parallax shifts camera, bloom glow on hover
- **Mobile (<768px)**: CSS 3D Transform fallback renders, cards have perspective tilt, hover lifts with translateZ, click flips with rotateY
- **All pages**: Sidebar, TopBar, responsive shell still work correctly

- [ ] **Step 3: Static export verification**

Run: `npx next build`
Verify `out/` directory is generated with all pages

- [ ] **Step 4: Commit any fixes**

```bash
git add -A
git commit -m "fix: final 3D redesign adjustments from verification"
```
