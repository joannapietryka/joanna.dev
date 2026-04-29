"use client";

import { useEffect, useRef, useState } from "react";
import { AboutMe } from "../about-me/AboutMe";
import { AITools } from "../ai-tools/AITools";
import { Contact } from "../contact/Contact";
import { Projects } from "../projects/Projects";
import { Services } from "../services/Services";
import styles from "./StudioGlass.module.css";

/* ── global GSAP types (CDN) ─────────────────────────────────────────────── */
declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    gsap: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ScrollTrigger: any;
  }
}

/* ── helpers ─────────────────────────────────────────────────────────────── */
function clamp01(v: number) {
  return Math.max(0, Math.min(1, v));
}

function loadScript(src: string): Promise<void> {
  return new Promise((res, rej) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      res();
      return;
    }
    const s = document.createElement("script");
    s.src = src;
    s.onload = () => res();
    s.onerror = rej;
    document.head.appendChild(s);
  });
}

/* ── TitleWord – per-char spans for GSAP ────────────────────────────────── */
function TitleWord({
  word,
  className,
  wordIndex,
}: {
  word: string;
  className?: string;
  wordIndex: string;
}) {
  return (
    <span
      className={`${styles.titleWord}${className ? ` ${className}` : ""}`}
      data-word={wordIndex}
    >
      {word.split("").map((ch, i) => (
        <span key={i} data-char="" className={styles.titleChar}>
          {ch}
        </span>
      ))}
    </span>
  );
}

/* ── Canvas video scrubber – ref-driven, zero React re-renders ───────────── */
function ScrollScrubCanvas({
  src,
  progressRef,
}: {
  src: string;
  progressRef: React.RefObject<number>;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const pendingSeekRef = useRef(false);
  const smoothedRef = useRef(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const video = document.createElement("video");
    video.src = src;
    video.muted = true;
    video.playsInline = true;
    video.preload = "auto";
    videoRef.current = video;
    const onMeta = () => setReady(true);
    video.addEventListener("loadedmetadata", onMeta);
    return () => {
      video.removeEventListener("loadedmetadata", onMeta);
      videoRef.current = null;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [src]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const resize = () => {
      const r = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.floor(r.width * dpr);
      canvas.height = Math.floor(r.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  useEffect(() => {
    if (!ready) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const draw = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      const vw = video.videoWidth || 1;
      const vh = video.videoHeight || 1;
      const s = Math.max(w / vw, h / vh);
      ctx.clearRect(0, 0, w, h);
      ctx.drawImage(video, (w - vw * s) / 2, (h - vh * s) / 2, vw * s, vh * s);
    };

    const loop = () => {
      const target = progressRef.current ?? 0;
      smoothedRef.current += (target - smoothedRef.current) * 0.14;

      const dur = Number.isFinite(video.duration) ? video.duration : 0;
      if (dur && !pendingSeekRef.current) {
        const t = clamp01(smoothedRef.current) * Math.max(0, dur - 0.001);
        if (Math.abs(video.currentTime - t) > 1 / 90) {
          pendingSeekRef.current = true;
          const onSeeked = () => {
            pendingSeekRef.current = false;
            draw();
          };
          video.addEventListener("seeked", onSeeked, { once: true });
          try {
            video.currentTime = t;
          } catch {
            video.removeEventListener("seeked", onSeeked);
            pendingSeekRef.current = false;
          }
        } else {
          draw();
        }
      }
      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [ready, progressRef, src]);

  return (
    <div className={styles.scrubRoot}>
      <canvas ref={canvasRef} className={styles.scrubCanvas} />
      {!ready && (
        <div className={styles.scrubLoader} aria-label="Loading video">
          <div className={styles.scrubLoaderBar} />
          <div className={styles.scrubLoaderText}>Loading</div>
        </div>
      )}
    </div>
  );
}

/* ── Main component ──────────────────────────────────────────────────────── */
export function StudioGlass() {
  const rootRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const heroCardRef = useRef<HTMLElement>(null);
  const heroScrollSpaceRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const scrollHintRef = useRef<HTMLDivElement>(null);
  const scrubProgressRef = useRef(0);
  /* guard: entrance plays once per mount, never on scroll-up/down */
  const entrancePlayedRef = useRef(false);
  const glowRingRef = useRef<HTMLDivElement>(null);

  /* scroll to a section id within the custom scroll container */
  const scrollToSection = (id: string) => {
    const scroller = scrollRef.current;
    const target = document.getElementById(id);
    if (scroller && target) {
      scroller.scrollTo({ top: target.offsetTop, behavior: "smooth" });
    }
  };

  /* passive scroll → CSS var for orb parallax */
  useEffect(() => {
    const el = scrollRef.current;
    const root = rootRef.current;
    if (!el || !root) return;
    const update = () => {
      const max = el.scrollHeight - el.clientHeight;
      root.style.setProperty(
        "--scroll-progress",
        max > 0 ? String(el.scrollTop / max) : "0"
      );
    };
    el.addEventListener("scroll", update, { passive: true });
    return () => el.removeEventListener("scroll", update);
  }, []);

  /* ── GSAP: entrance + scroll-driven video scrub ───────────────────────── */
  useEffect(() => {
    const el = scrollRef.current;
    const card = heroCardRef.current;
    const space = heroScrollSpaceRef.current;
    const title = titleRef.current;
    const hint = scrollHintRef.current;
    if (!el || !card || !space || !title || !hint) return;

    let cancelled = false;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let gsapCtx: any = null;

    const init = async () => {
      await loadScript(
        "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"
      );
      await loadScript(
        "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"
      );
      if (cancelled) return;

      const { gsap, ScrollTrigger } = window;
      gsap.registerPlugin(ScrollTrigger);

      gsapCtx = gsap.context(() => {
        /* ── collect per-word char elements ──────────────────────────── */
        const wordEls = Array.from(
          title.querySelectorAll("[data-word]")
        ) as HTMLElement[];
        const w0 = Array.from(
          wordEls[0]?.querySelectorAll("[data-char]") ?? []
        ) as HTMLElement[];
        const w1 = Array.from(
          wordEls[1]?.querySelectorAll("[data-char]") ?? []
        ) as HTMLElement[];
        const w2 = Array.from(
          wordEls[2]?.querySelectorAll("[data-char]") ?? []
        ) as HTMLElement[];



        /* ── Phase A: entrance (fires once, never on scroll-up) ──────── */
        if (!entrancePlayedRef.current) {
          /* Mark AFTER the cancelled guard so only the active effect owns it */
          entrancePlayedRef.current = true;

          /* lock scroll while the bubble is landing.
           * Measure scrollbar width BEFORE hiding so we can compensate
           * with padding-right → prevents layout shift when the scrollbar
           * disappears (content-area expands) and reappears on complete.
           * On macOS overlay-scrollbar systems sbWidth = 0 → no-op. */
          const sbWidth = el.offsetWidth - el.clientWidth;
          el.style.overflowY = "hidden";
          if (sbWidth > 0) el.style.paddingRight = `${sbWidth}px`;

          /* set initial char states (CSS opacity:0 already prevents FOUC) */
          /* w0 "Ideas to"  – slides in from the left */
          gsap.set(w0, { x: -28, rotation: -12, opacity: 0, transformOrigin: "50% 100%" });
          /* w1 "products." – 3-D flip down */
          gsap.set(w1, { y: -34, rotationX: 80, opacity: 0, transformPerspective: 900, transformOrigin: "50% 0% -18px" });
          /* w2 "Fast." – scale-pop from centre */
          gsap.set(w2, { scale: 0.3, y: 18, opacity: 0, transformOrigin: "50% 50%" });
          gsap.set(hint, { opacity: 0, y: 14 });

          /*
           * On mobile (≤640 px) the card stacks vertically so the bubble
           * should emerge from the bottom-centre rather than bottom-left.
           */
          const isMobile = window.innerWidth <= 640;
          /*
           * Proxy drives the clip-path so we can animate radius and
           * Y-centre independently with different easings:
           *   cx – horizontal centre (18% desktop / 50% mobile)
           *   cy – vertical centre (starts at 100% = card bottom edge, rises to 50%)
           *   r  – radius (starts as a visible bubble, bounces, then fills the card)
           */
          const circle = { cx: isMobile ? 50 : 18, cy: 100, r: 4 };

          /*
           * glowRing is a sibling of heroCard (not inside it), so it is NOT
           * clipped by heroCard's clip-path.  We size + position it in pixel
           * space to trace the exact clip-path circle boundary, giving the
           * bubble bright white edges without breaking backdrop-filter.
           */
          const glowEl = glowRingRef.current;

          const applyClip = () => {
            card.style.clipPath = `circle(${circle.r.toFixed(2)}% at ${circle.cx.toFixed(2)}% ${circle.cy.toFixed(2)}%)`;

            if (glowEl) {
              const cw = card.offsetWidth  || 1;
              const ch = card.offsetHeight || 1;
              /* clip-path % radius is relative to sqrt(w²+h²)/√2 */
              const refDim = Math.sqrt(cw * cw + ch * ch) / Math.SQRT2;
              const rPx   = (circle.r  / 100) * refDim;
              const cxPx  = (circle.cx / 100) * cw;
              const cyPx  = (circle.cy / 100) * ch;
              /* fade out as the circle grows beyond the "bubble" phase */
              const opacity = circle.r < 12
                ? 1
                : Math.max(0, 1 - (circle.r - 12) / 20);

              glowEl.style.width   = `${rPx * 2}px`;
              glowEl.style.height  = `${rPx * 2}px`;
              glowEl.style.transform = `translate(${(cxPx - rPx).toFixed(1)}px, ${(cyPx - rPx).toFixed(1)}px)`;
              glowEl.style.opacity = String(opacity);
            }
          };
          applyClip();

          const entranceTl = gsap.timeline({
            onComplete: () => {
              /* unlock scroll */
              el.style.overflowY = "auto";
              if (sbWidth > 0) el.style.paddingRight = "";

              /* Remove GSAP identity-matrix inline transforms from every
               * animated character.  Without clearProps the browser keeps
               * transform: matrix(1,0,0,1,0,0) as an inline style, which
               * creates a separate compositing layer and can render 0.5 px
               * offset from the natural (no-transform) position — the
               * barely-visible leftward jump the user reported.
               * We keep opacity (GSAP inline = 1) so chars stay visible;
               * CSS .titleChar sets opacity:0 which would win otherwise. */
              gsap.set([...w0, ...w1, ...w2], {
                clearProps: "transform,transformOrigin",
              });
              /* hint: clear transform only (opacity handled by CSS/GSAP) */
              gsap.set(hint, { clearProps: "transform" });

              /* glowRing: GSAP leaves width≈3000px / height≈3000px /
               * transform:translate(-1248px,…) as direct inline styles
               * (set via el.style.x = …, not via GSAP props, so
               * clearProps won't touch them).  Strip them manually so
               * the element collapses back to its CSS-defined state. */
              if (glowEl) {
                glowEl.style.width     = "";
                glowEl.style.height    = "";
                glowEl.style.transform = "";
                glowEl.style.opacity   = "0"; // keep it invisible
              }
            },
          });

          /* ── 0–1.3s : bubble rises from bottom with liquid bounce
           *   Both cy and r use elastic.out so the circle visibly oscillates
           *   in size as it rises — a clear "bouncing bubble" read.
           *   elastic.out(1.4, 0.38) gives 3–4 oscillations with good decay.
           *   Source: MY_GSAP_ANIMATIONS.md §"Animation Timing & Easing Reference"
           */
          entranceTl.to(
            circle,
            {
              cy: 50,   // centre rises to mid-card
              r: 5,     // stays small; glow ring provides the visibility
              duration: 1.1,
              ease: "elastic.out(1.2, 0.5)",
              onUpdate: applyClip,
            },
            0
          );

          /* ── 1.1–2.3s : circle expands to fill the card (power2.inOut)
           *   Starts just before the bounce fully settles so the transition
           *   feels continuous. Pattern 3 scale-in style via clip-path.
           */
          entranceTl.to(
            circle,
            {
              r: 135,
              duration: 1.2,
              ease: "power2.inOut",
              onUpdate: applyClip,
            },
            0.9
          );

          /* ── h1 line 1 "Ideas to" – slide chars from left + de-rotate
           *   Pattern 2 (staggered text reveal): power3.out, stagger 0.05
           */
          entranceTl.to(
            w0,
            {
              x: 0,
              rotation: 0,
              opacity: 1,
              stagger: 0.05,
              duration: 0.45,
              ease: "power3.out",
            },
            1.05
          );

          /* ── h1 line 2 "products." – 3-D flip down into place
           *   Pattern 10 (morphing char animation): power2.out + rotationX
           */
          entranceTl.to(
            w1,
            {
              y: 0,
              rotationX: 0,
              opacity: 1,
              stagger: 0.04,
              duration: 0.42,
              ease: "power2.out",
            },
            1.45
          );

          /* ── h1 line 3 "Fast." – scale-pop (Pattern 3: back.out) */
          entranceTl.to(
            w2,
            {
              scale: 1,
              y: 0,
              opacity: 1,
              stagger: 0.055,
              duration: 0.42,
              ease: "back.out(2.5)",
            },
            1.8
          );

          /* ── scroll hint fades in after chars land
           *   Pattern 8 infinite loop is handled by CSS animation on the icon
           */
          entranceTl.to(
            hint,
            {
              opacity: 1,
              y: 0,
              duration: 0.55,
              ease: "power2.out",
            },
            2.3
          );
        } else {
          /* entrance already played – snap to final revealed state */
          const snapCx = window.innerWidth <= 640 ? 50 : 18;
          card.style.clipPath = `circle(135% at ${snapCx}% 50%)`;
          if (w0.length) gsap.set(w0, { x: 0, rotation: 0, opacity: 1 });
          if (w1.length) gsap.set(w1, { y: 0, rotationX: 0, opacity: 1 });
          if (w2.length) gsap.set(w2, { scale: 1, y: 0, opacity: 1 });
          gsap.set(hint, { opacity: 1, y: 0 });
        }

        /* ── Phase B: fade scroll hint on first scroll ───────────────── */
        const onFirstScroll = () => {
          gsap.to(hint, { opacity: 0, y: 6, duration: 0.4, ease: "power2.in" });
          el.removeEventListener("scroll", onFirstScroll);
        };
        el.addEventListener("scroll", onFirstScroll, { passive: true, once: true });

        /* ── Phase C: video scrub – whole heroScrollSpace, bidirectional
         *   Entire 300 vh range drives video progress.
         *   Card + h1 are already in final state and never reverse.
         *   Based on Pattern 4 (pinned scroll) with scrub: 0.9
         */
        const videoProxy = { value: 0 };
        const videoTl = gsap.timeline({ defaults: { ease: "none" } });

        videoTl.to(videoProxy, {
          value: 1,
          duration: 1,
          ease: "none",
          onUpdate() {
            scrubProgressRef.current = videoProxy.value;
          },
        });

        ScrollTrigger.create({
          animation: videoTl,
          trigger: space,
          scroller: el,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.9,
        });

        ScrollTrigger.refresh();
      });
    };

    init().catch(console.error);

    return () => {
      cancelled = true;
      /* Reset so the entrance replays correctly on remount (fixes StrictMode
         double-invoke: first run may set the ref to true before cleanup fires) */
      entrancePlayedRef.current = false;
      gsapCtx?.revert();
    };
  }, []);

  return (
    <div ref={rootRef} className={styles.root}>
      <div className={styles.ambientCanvas} aria-hidden="true">
        <div className={`${styles.orb} ${styles.orb1}`} />
        <div className={`${styles.orb} ${styles.orb2}`} />
        <div className={`${styles.orb} ${styles.orb3}`} />
        <div className={`${styles.orb} ${styles.orb4}`} />
      </div>

      <div className={styles.gridOverlay} aria-hidden="true" />

      <header className={styles.header}>
        <div className={styles.logo}>joanna.dev</div>
        <nav className={styles.navLinks} aria-label="Primary">
          <button type="button" onClick={() => scrollToSection("services")}>Services</button>
          <button type="button" onClick={() => scrollToSection("about")}>About me</button>
          <button type="button" onClick={() => scrollToSection("contact")}>Contact</button>
        </nav>
        {/* mobile only – desktop: display:none */}
        <button className={styles.menuToggle} type="button" aria-label="Open menu">
          <span />
        </button>
      </header>

      {/* scroll-to-explore indicator — outside scrollRoot so it doesn't scroll */}
      <div ref={scrollHintRef} className={styles.scrollHint} aria-hidden="true">
        <span className={styles.scrollHintText}>Scroll to explore</span>
        <svg
          className={styles.scrollHintIcon}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="12" y1="5" x2="12" y2="19" />
          <polyline points="19 12 12 19 5 12" />
        </svg>
      </div>

      <div id="scroll-root" className={styles.scrollRoot} ref={scrollRef}>
        <main className={styles.main}>
          <div ref={heroScrollSpaceRef} className={styles.heroScrollSpace}>
            <div className={styles.glassAssembly}>
              {/* glow ring: sibling of heroCard so it is never clipped */}
              <div ref={glowRingRef} className={styles.glowRing} aria-hidden="true" />

              <section ref={heroCardRef} className={styles.heroCard}>
                <div className={`${styles.metaLabel} ${styles.posTopLeft}`}>
                  Status: Creating
                </div>
                <div className={`${styles.metaLabel} ${styles.posBottomLeft}`}>
                  SYS.VER: 4.0.1 // LQD-GLS
                </div>
                <div className={styles.systemCode}>
                  AXIS_X: 420.5 // AXIS_Y: 890.1
                </div>

                <div className={styles.circleText} aria-hidden="true">
                  <svg viewBox="0 0 100 100">
                    <path
                      d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
                      id="circle"
                      fill="none"
                    />
                    <text fontSize="8" fontFamily="var(--font-jetbrains-mono)">
                      <textPath href="#circle">
                         DESIGN • FRONTEND DEVELOPMENT • ARCHITECTURE • 
                      </textPath>
                    </text>
                  </svg>
                </div>

                <div className={styles.heroContent}>
                  <h1 ref={titleRef} className={styles.heroTitle}>
                    <TitleWord word="Ideas&nbsp;to" wordIndex="0" />
                    <TitleWord
                      word="products"
                      wordIndex="1"
                      className={styles.titleOverlap}
                    />
                    <TitleWord
                      word="Fast."
                      wordIndex="2"
                      className={styles.titleAccent}
                    />
                  </h1>
                  <p className={styles.heroSubtitle}>
                    Websites&nbsp;•&nbsp;Apps&nbsp;•&nbsp;Automations
                  </p>
                </div>

                <div className={styles.photoContainer}>
                  <div className={styles.fluidMask}>
                    <ScrollScrubCanvas
                      src="/assets/videos/hero-video.mp4"
                      progressRef={scrubProgressRef}
                    />
                  </div>
                </div>

                <button type="button" className={styles.actionBtn}>
                  Initiate Sequence
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    aria-hidden="true"
                  >
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </button>
              </section>
            </div>
          </div>

          <Services />
          <AITools />
          <Projects />
          <AboutMe />
          <Contact />
        </main>
      </div>
    </div>
  );
}
