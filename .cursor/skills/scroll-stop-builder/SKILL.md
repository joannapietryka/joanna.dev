---
name: scroll-stop-builder
description: Takes a video file and builds a production-quality, scroll-driven animation website where the video plays forward/backward as the user scrolls (Apple-style scroll animation). Uses FFmpeg frame extraction, canvas rendering, and modern scroll-driven techniques. Includes starscape background, loader, scroll progress bar, scroll-to-pill navbar, annotation cards with snap-stop scroll, specs with count-up animations, and full mobile responsiveness. Trigger when the user says "scroll-stop build", "scroll animation website", "scroll-driven video", "build the scroll-stop site", "Apple-style scroll animation", "video on scroll", or provides a video file and asks to make it scroll-controlled.
---

# Scroll-Stop Builder Skill

You take a video file and build a **beautiful, performant website** where **video playback is controlled by scroll position** (forward/backward), using **pre-extracted frames rendered into a canvas** for frame-perfect control.

## Non-negotiables

- **Interview first** (Step 0). Don’t touch code or extract frames until completed.
- **No placeholders** (no lorem ipsum). All copy/values come from the interview or a user-provided URL.
- **Local server required** for frame loading (no `file://`).
- **Hard requirement**: the video’s **first frame must be on white**. If not, stop and ask for a re-export or a separate white-background hero image.

## Step 0: The interview (MANDATORY)

Ask these naturally (not as a numbered interrogation):

- **Brand/product name**
- **Logo file** (SVG/PNG preferred)
- **Accent color** (hex or propose options)
- **Background color** (dark recommended)
- **Vibe** (premium tech / luxury / playful / minimal / bold)

Content sourcing:

- **Option A (URL)**: If based on an existing site, ask for the URL and fetch it, then extract real copy/features/specs/testimonials.
- **Option B (paste)**: Ask the user to paste product copy, features, specs, testimonials.

Optional sections (include only if user opts in):

- **Testimonials**
- **Confetti moment** (e.g. CTA click)
- **Card Scanner** (Three.js particle showcase)

## Prerequisites

- **FFmpeg installed** (`brew install ffmpeg` on macOS).
- Video file provided (MP4/MOV/WebM).
- Ideal length: **3–10 seconds**.

## Design system (derive from interview)

Defaults (adjust if brand demands otherwise):

- **Fonts**: Space Grotesk (headings), Archivo (body), JetBrains Mono (mono)
- **Cards**: glassmorphism (`backdrop-filter: blur(20px)`, subtle border, `border-radius: 20px`)
- **Effects**: subtle grid overlay, blurred accent orbs, animated starscape
- **Navbar**: transforms into centered glass pill on scroll
- **Scrollbar**: gradient thumb using accent color + hover glow

## Technique: frame sequence + canvas (default approach)

Use FFmpeg to extract frames, preload them, then draw to a canvas based on scroll progress.

Avoid `<video>` + `currentTime` for scroll-scrubbing: it seeks poorly and stutters under frequent updates.

## Build process

### Step 1: Analyze the video

Use:

```bash
ffprobe -v quiet -print_format json -show_streams -show_format "{VIDEO_PATH}"
```

Capture: duration, fps, resolution. Choose a target frame count **60–150** (tune FPS accordingly).

### Step 2: Extract frames

Use JPEG frames for size/perf:

```bash
mkdir -p "{OUTPUT_DIR}/frames"
ffmpeg -i "{VIDEO_PATH}" -vf "fps={TARGET_FPS},scale=1920:-2" -q:v 2 "{OUTPUT_DIR}/frames/frame_%04d.jpg"
```

### Step 3: Build the site

Deliverable: a working site that can be served locally. Default architecture:

- **Preferred**: Next.js page + static frames in `public/frames/` (good DX + routing).
- **Fallback**: a single `index.html` + `styles.css` + `main.js` in an output folder (fastest to ship).

The site sections (top to bottom):

1. Starscape (fixed canvas background)
2. Loader (logo + progress bar)
3. Scroll progress bar (fixed top)
4. Navbar (scroll-to-pill transform)
5. Hero (title/subtitle/CTAs, grid + orbs)
6. Scroll animation (sticky canvas + annotation cards + snap-stop)
7. Specs (count-up stats on reveal)
8. Features (glass cards grid)
9. CTA
10. Testimonials (optional)
11. Card Scanner (optional, Three.js)
12. Footer

For the full section implementation checklist, read `references/sections-guide.md`.

### Step 4: Key implementation patterns

Retina canvas sizing:

```js
canvas.width = Math.floor(window.innerWidth * window.devicePixelRatio);
canvas.height = Math.floor(window.innerHeight * window.devicePixelRatio);
canvas.style.width = window.innerWidth + "px";
canvas.style.height = window.innerHeight + "px";
```

Rendering rules:

- **Desktop**: cover-fit (edge-to-edge)
- **Mobile**: slightly zoomed contain-fit (keep object centered/visible)

Scroll-to-frame mapping:

- Use a single scroll progress value in \([0,1]\)
- Compute frame index = `Math.round(progress * (frameCount - 1))`
- **Deduplicate draws** (only draw when index changes)
- **Never draw directly** inside the scroll handler; schedule with `requestAnimationFrame`

Annotation cards with snap-stop:

- Cards appear at defined progress “zones”
- When entering a zone, **snap** to its anchor scroll position and **hold** scroll for ~400–700ms
- Keep it subtle; reduce hold time if it feels jarring

Navbar scroll-to-pill:

- Start full-width (transparent)
- After threshold, become centered pill (max-width ~820px) with glass background

Count-up stats:

- Trigger via `IntersectionObserver`
- Ease out (expo), stagger 200ms, accent glow pulse while counting

Starscape:

- Fixed canvas behind everything
- ~180 stars drifting + twinkling with per-star phase/speed

### Step 5: Customize content

Populate with real content from Step 0:

- Hero title/subtitle
- Annotation card titles/descriptions/stats
- Specs numbers/labels
- Features
- CTA copy
- Testimonials (if opted in)

### Step 6: Serve & test

Serve locally:

```bash
cd "{OUTPUT_DIR}" && python3 -m http.server 8080
```

Verify:

- Loader reaches 100% before reveal
- Scroll feels “buttery” (no jitter / missed frames)
- Snap-stops feel intentional (not disruptive)
- Mobile layout: cards compact, navbar simplified, sticky canvas correct

## Mobile responsiveness requirements

- **Annotation cards**: compact single-line (number + title); hide paragraphs/stats; pin near bottom
- **Scroll animation height**: ~350vh desktop, 300vh tablet, 250vh phone (tune)
- **Navbar**: hide links on mobile; keep logo + pill
- **Features**: single column
- **Specs**: 2×2 grid
- **Testimonials**: touch-scroll with snapping (if present)

## Best practices

- Use `{ passive: true }` for scroll listeners
- Do not enable `scroll-behavior: smooth`
- Preload frames before enabling scroll playback
- Keep per-frame JPEGs small (target <100KB each)
- Only use Three.js if Card Scanner is opted-in

## Error recovery

- **Frames don’t load**: ensure local server; verify paths; don’t use `file://`
- **Choppy**: reduce frame count; ensure JPEG not PNG; confirm image sizes
- **Blurry canvas**: confirm `devicePixelRatio` scaling is applied
- **Too fast/slow**: adjust scroll container height (200vh fast, 500vh slow, 800vh cinematic)
- **Mobile overlap**: compact cards + bottom positioning with safe-area padding
- **Snap too jarring**: lower hold duration or widen snap zone
- **Stars too bright/dim**: adjust starscape opacity
- **First frame not white**: request re-export or separate hero image

