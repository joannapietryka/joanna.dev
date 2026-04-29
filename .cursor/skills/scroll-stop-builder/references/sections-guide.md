## Sections guide (implementation checklist)

Use this as the “what to build” checklist after the Step 0 interview. Keep the site lightweight, crisp, and mobile-safe. All copy/values come from the interview or a provided URL.

### 1) Starscape (fixed background canvas)

- **DOM**: a `<canvas>` placed early in the document, `position: fixed; inset: 0; z-index: -1;`
- **Rendering**:
  - Create ~180 stars with randomized:
    - position (x,y), radius, baseOpacity
    - driftSpeed, twinkleSpeed, twinklePhase
  - Animate with `requestAnimationFrame`
  - Apply subtle global alpha (e.g. `0.5–0.7`) so content remains readable
- **Resize**: handle `resize` with DPR scaling; regenerate star positions proportionally

### 2) Loader (frame preloader + progress UI)

- **Requirement**: preload all frames before allowing the scroll animation section to engage.
- **UI**:
  - brand logo + brand name
  - “Loading” label
  - accent progress bar + percentage
- **Behavior**:
  - Load images in parallel with a concurrency cap if necessary (e.g. 8–16)
  - Update progress smoothly (don’t thrash layout)
  - Fade out loader when complete (opacity + pointer-events)

### 3) Scroll progress bar (top)

- `position: fixed; top: 0; left: 0; height: 3px;`
- Use accent gradient; width driven by global scroll progress

### 4) Navbar (scroll-to-pill transform)

- **State A (top)**: full-width, spacious padding, transparent background
- **State B (scrolled)**: centered pill (max-width ~820px), glass background, tighter padding
- **Implementation**:
  - toggle class on scroll threshold (e.g. 24–40px)
  - transition: transform/width/padding/background/border-color
- **Mobile**:
  - hide non-essential links; keep logo + a single CTA

### 5) Hero (first screen)

- Title, subtitle, primary + secondary CTA (from interview)
- Visuals:
  - subtle grid overlay
  - 2–3 blurred accent orbs with slow drift (CSS animation)
- Include a scroll hint (“Scroll to explore”)

### 6) Scroll animation section (sticky canvas + annotations + snap-stop)

**Layout**

- A wrapper with tall scroll height (desktop ~350vh; tablet 300vh; phone 250vh).
- A sticky container `position: sticky; top: 0; height: 100vh;` containing:
  - the **frame canvas** (foreground)
  - overlay UI (annotation cards, optional vignette)

**Frame rendering**

- Preload `frames/frame_0001.jpg...`
- Maintain:
  - `frameCount`
  - `currentFrameIndex` (dedup draws)
  - `pendingIndex` and `rafId` for rAF scheduling
- Map scroll progress in the section to `frameIndex`:
  - `index = round(progress * (frameCount - 1))`
- Fit strategy:
  - desktop: cover-fit (fill)
  - mobile: zoomed contain-fit (center the object)

**Annotation cards**

- Each card has:
  - index/step label
  - title
  - (desktop) short description + optional stat
- Show/hide based on progress ranges:
  - `data-show="0.18" data-hide="0.30"` (example)
- **Mobile compact mode**:
  - one-line: “01 — Feature title”
  - pinned near bottom with safe-area padding

**Snap-stop behavior**

- Define snap “anchors” at key progress points (one per card, usually).
- When progress enters a snap zone:
  - programmatically scroll to the anchor
  - temporarily lock scrolling (body overflow hidden or input suppression) for **~400–700ms**
  - then release
- Make it forgiving:
  - don’t re-snap if the user is clearly trying to move past
  - reduce hold time if it feels jarring

### 7) Specs section (count-up stats)

- 4 stats (label + number) from interview
- Use `IntersectionObserver` to trigger once
- Count-up:
  - easeOutExpo (or similar)
  - stagger starts by 200ms
  - subtle accent glow pulse while counting
- Mobile: 2×2 grid

### 8) Features section (glass cards grid)

- 6–12 features (from interview/URL)
- Glass cards with icon, title, 1–2 lines description
- Desktop: 2–3 columns; mobile: 1 column

### 9) CTA section

- Strong CTA headline + subcopy (from interview)
- Primary button (accent) + optional secondary
- Optional confetti burst on click (only if opted in)

### 10) Testimonials (optional)

- Horizontal drag-to-scroll cards
- Mouse + touch support
- Snap to card edges
- Keep copy real (from interview/URL)

### 11) Card Scanner (optional, Three.js)

- Only include when explicitly requested
- Keep it minimal: one hero object + particle field
- Provide a “reduce motion” fallback

### 12) Footer

- Brand name/logo
- 2–5 links (from interview)
- Small print

## Performance and UX guardrails

- Draw frames with `requestAnimationFrame`, never directly in the scroll handler
- Use passive scroll listeners
- Avoid layout thrash: update transforms/opacity, not top/left
- Prefer `will-change` sparingly (canvas, navbar)
- Respect `prefers-reduced-motion`:
  - disable snap-stop
  - reduce starscape motion
  - disable count-up and show final numbers

