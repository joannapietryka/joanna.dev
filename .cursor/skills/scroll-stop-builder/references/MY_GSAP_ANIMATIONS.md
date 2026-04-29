# My GSAP Animation Patterns

**Purpose**: Custom GSAP animation playbook for Cursor.ai. Reference this when building scroll, hero, and interactive animations for stunning frontend experiences.

**Key principle**: Use ScrollTrigger for scroll-based animations, timelines for choreography, and keep animations snappy (400–800ms) unless intentionally slow-burn.

---

## Core Setup

Always start with this CDN import structure:

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js"></script>
<script>
  gsap.registerPlugin(ScrollTrigger);
</script>
```

**Key settings for my style:**
- No bounce easing unless specified (use `power1.out`, `power2.out`)
- Stagger delays for element groups: 0.1–0.15s between items
- ScrollTrigger defaults: `trigger`, `start: "top 80%"`, `scrub: false` (snappy) or `scrub: 1` (linked)
- Always use `fill: "both"` on animations to prevent flashing

---

## Pattern 1: Parallax Hero with Image + Text

**When to use**: Landing pages, hero sections with image + headline.

**Effect**: Image moves slower than viewport scroll (depth), text stays fixed or fades in.

```javascript
// Hero section parallax
gsap.to(".hero-image", {
  yPercent: 30,
  scrollTrigger: {
    trigger: ".hero",
    start: "top top",
    end: "bottom top",
    scrub: 1,
    markers: false // set true to debug
  }
});

// Optional: Fade in headline
gsap.from(".hero-headline", {
  opacity: 0,
  y: 20,
  duration: 0.8,
  scrollTrigger: {
    trigger: ".hero",
    start: "top 80%",
  }
});
```

**Customization:**
- `yPercent: 30` → tweak to 20–50 for slower/faster parallax
- `scrub: 1` → smooth linked scroll. Remove for snappy animation
- Add `xPercent` for horizontal drift

---

## Pattern 2: Staggered Text Reveal (Hero H1)

**When to use**: Eye-catching headlines, "reveal" effect as user scrolls into view.

**Effect**: Words or letters slide up one by one with stagger.

```javascript
// Wrap each word in a <span> (or use splitText plugin)
// Example HTML:
// <h1 class="hero-headline">
//   <span>Build</span> <span>stunning</span> <span>animations</span>
// </h1>

const words = document.querySelectorAll(".hero-headline span");

gsap.from(words, {
  opacity: 0,
  y: 40,
  duration: 0.7,
  stagger: 0.12,
  ease: "power2.out",
  scrollTrigger: {
    trigger: ".hero-headline",
    start: "top 75%",
  }
});
```

**Pro tips:**
- `stagger: 0.12` → 120ms between each word
- `y: 40` → slide distance (larger = more dramatic)
- For letters instead of words: use `gsap.utils.toArray(".hero-headline > span > span")`

---

## Pattern 3: Scale + Fade on Scroll Entry

**When to use**: Feature cards, product showcase sections.

**Effect**: Elements scale up from 0.8 → 1.0 and fade in as they enter viewport.

```javascript
gsap.from(".feature-card", {
  opacity: 0,
  scale: 0.85,
  y: 30,
  duration: 0.6,
  stagger: 0.1,
  ease: "back.out(1.2)",
  scrollTrigger: {
    trigger: ".features-section",
    start: "top 75%",
  }
});
```

**Customization:**
- `ease: "back.out(1.2)"` → bouncy feel. Use `power2.out` for clean
- `scale: 0.85` → how small it starts (0.7 = more dramatic)
- `stagger: 0.1` → delay between each card

---

## Pattern 4: Pinned Section (Scroll Through Multiple Frames)

**When to use**: Storytelling, process flows, feature walkthroughs.

**Effect**: Section stays fixed while you scroll, revealing content sequentially.

```javascript
// Pin the container, animate child sections
gsap.to(".pinned-content", {
  scrollTrigger: {
    trigger: ".pinned-section",
    start: "top top",
    end: "bottom center",
    scrub: 1,
    pin: true,
    markers: false
  },
  duration: 1
});

// Animate each frame inside
gsap.to(".frame-1", { opacity: 1, duration: 0.5, scrollTrigger: { trigger: ".frame-1", start: "top 80%" } });
gsap.to(".frame-2", { opacity: 1, duration: 0.5, scrollTrigger: { trigger: ".frame-2", start: "top 80%" } });
```

**Warning**: Pinning can feel janky if overused. Limit to 1–2 per page.

---

## Pattern 5: Number Counter (On Scroll)

**When to use**: Stats, metrics, achievements sections.

**Effect**: Numbers animate from 0 → target value as section enters view.

```javascript
// HTML: <div class="counter" data-target="250">0</div>

document.querySelectorAll(".counter").forEach(counter => {
  const target = +counter.getAttribute("data-target");
  
  gsap.to(counter, {
    innerText: target,
    duration: 1.5,
    snap: { innerText: 1 },
    ease: "power2.out",
    scrollTrigger: {
      trigger: counter,
      start: "top 80%",
      once: true // fire only once
    }
  });
});
```

**Key**: `snap: { innerText: 1 }` → rounds to integers

---

## Pattern 6: Horizontal Scroll (Drag or Fixed Width)

**When to use**: Portfolio galleries, carousel effects.

**Effect**: Scroll vertically, content moves horizontally smoothly.

```javascript
gsap.to(".horizontal-scroll-container", {
  x: -1000, // or use: -(containerWidth - windowWidth)
  duration: 5,
  scrollTrigger: {
    trigger: ".horizontal-section",
    start: "top top",
    end: "bottom center",
    scrub: 1,
    pin: true,
    markers: false
  }
});
```

**Tip**: Calculate distance dynamically:
```javascript
const container = document.querySelector(".horizontal-scroll-container");
const distance = -(container.scrollWidth - window.innerWidth);
gsap.to(container, {
  x: distance,
  scrollTrigger: { /* ... */ }
});
```

---

## Pattern 7: SVG Path Animation (DrawSVG style)

**When to use**: Icons, logos, animated illustrations.

**Effect**: SVG strokes animate as if being drawn.

```html
<svg viewBox="0 0 100 100">
  <path class="animated-path" d="M 10 50 Q 50 10, 90 50 T 170 50" 
        fill="none" stroke="black" stroke-width="2" stroke-linecap="round"/>
</svg>
```

```javascript
// Get path length
const path = document.querySelector(".animated-path");
const length = path.getTotalLength();

// Animate stroke-dashoffset from full to 0 (draws the path)
gsap.from(path, {
  strokeDasharray: length,
  strokeDashoffset: length,
  duration: 2,
  ease: "power2.inOut",
  scrollTrigger: {
    trigger: ".svg-section",
    start: "top 80%"
  }
});
```

---

## Pattern 8: Infinite Animation (Loop)

**When to use**: Loading states, background animations, continuous motion.

**Effect**: Animation repeats infinitely.

```javascript
gsap.to(".floating-element", {
  y: -20,
  duration: 2,
  repeat: -1, // -1 = infinite
  yoyo: true, // bounce back
  ease: "sine.inOut"
});
```

---

## Pattern 9: Mouse Move Tracking

**When to use**: Interactive hover effects, parallax follow.

**Effect**: Element follows mouse position with smooth interpolation.

```javascript
let mouseX = 0, mouseY = 0;

document.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  
  gsap.to(".mouse-follower", {
    x: mouseX - 25, // center the element
    y: mouseY - 25,
    duration: 0.3,
    overwrite: "auto" // prevent conflicts
  });
});
```

---

## Pattern 10: Morphing Text / Char Animation

**When to use**: Taglines, dynamic copy, reveal effects.

**Effect**: Text changes color, scale, or opacity per character.

```javascript
// Requires splitting text into chars (manual or with SplitText plugin)
// <p class="morph-text"><span>B</span><span>u</span><span>i</span><span>l</span><span>d</span></p>

gsap.to(".morph-text span", {
  color: "#FF6B35",
  scale: 1.2,
  duration: 0.4,
  stagger: 0.05,
  ease: "back.out(1.5)",
  scrollTrigger: {
    trigger: ".morph-text",
    start: "top 80%",
    once: true
  }
});
```

---

## Animation Timing & Easing Reference

**Common eases for my style:**
- `power1.out`, `power2.out` → clean, snappy finishes
- `back.out(1.2)` → bouncy, playful
- `sine.inOut` → smooth, organic
- `expo.out` → dramatic deceleration
- `elastic.out()` → springy (use sparingly)

**Duration guidelines:**
- Hero reveal: 0.6–1.0s
- Scroll entrance: 0.5–0.8s
- Hover states: 0.3–0.5s
- Pinned sections: 1–3s (depends on content)

---

## ScrollTrigger Essentials

**Common trigger patterns:**

```javascript
// Fire once (cheaper performance)
scrollTrigger: {
  trigger: ".section",
  once: true,
  start: "top 75%"
}

// Scrub options
scrub: false,   // snappy, instant
scrub: 1,       // linked to scroll (smooth)
scrub: 0.5,     // delay between scroll & animation

// Start/end positions
start: "top 80%",      // when top of trigger hits 80% of viewport
start: "center center" // when center hits center
end: "bottom top"      // when bottom of trigger hits top of viewport
```

---

## Performance Tips

1. **Use `once: true`** on elements that animate only once (saves CPU)
2. **Avoid animating `left`, `top` on many elements** → use `transform` instead
3. **Lazy load ScrollTrigger** on mobile if possible
4. **Test on 60fps** with DevTools Performance tab
5. **Unregister unused triggers** if adding/removing elements dynamically

```javascript
// Clean up ScrollTrigger instances
ScrollTrigger.getAll().forEach(trigger => trigger.kill());
```

---

## Inspiration Sources

- **Made With GSAP**: https://madewithgsap.com/effects (50+ production patterns)
- **Nuraform**: https://www.nuraform.com/ (smooth form interactions, staggered reveals)
- **Abhishek Jha**: https://abhishekjha.me/ (portfolio with parallax + scroll choreography)

All these examples use ScrollTrigger + timeline-based sequencing. Study their hover states and entrance animations.

---

## Common Mistakes to Avoid

❌ **Bad**: Animating `position` properties (left, top)  
✓ **Good**: Use `transform: translateX()`, `x`, `y`

❌ **Bad**: Staggering 50 items with 0.5s delay (takes forever)  
✓ **Good**: Stagger 0.05–0.15s max

❌ **Bad**: Overlapping ScrollTrigger regions (confusion)  
✓ **Good**: Stagger trigger `start` positions (e.g. "top 80%", "top 70%", "top 60%")

❌ **Bad**: Not setting `fill: "both"` on initial state animations  
✓ **Good**: Always `fill: "both"` to prevent state flashing

❌ **Bad**: Using `scrub: 1` on every animation (laggy)  
✓ **Good**: Use `scrub: 1` sparingly; prefer `scrub: false` for snappy feel

---

## Next Steps in Cursor

When asking Cursor to build animations, prompt:

> *"Create a [Pattern Name] animation using my GSAP patterns skill. Make it match the [vibe] aesthetic. Use ScrollTrigger and keep stagger at 0.1–0.15s."*

Example:
> *"Create a staggered text reveal for my hero H1 ('From idea to shipped'). Use my GSAP patterns skill. Make it minimal/modern."*

Cursor will reference these patterns and generate code matching your style.

---

**Last updated**: April 2026  
**Tested on**: GSAP 3.12+ with ScrollTrigger plugin
