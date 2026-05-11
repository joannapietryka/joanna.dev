"use client";

import {useTranslations} from 'next-intl';
import {useEffect, useMemo, useRef, useState} from "react";
import { AboutMe } from "../about-me/AboutMe";
import { AITools } from "../ai-tools/AITools";
import { Contact } from "../contact/Contact";
import { Projects } from "../projects/Projects";
import { Services } from "../services/Services";
import { SiteNav } from "../site-nav/SiteNav";
import styles from "./StudioGlass.module.css";

/* ── global types (optional CDN / in-app webview safety) ─────────────────── */
declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    gsap: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ScrollTrigger: any;
    /** Lenis UMD build (cdn.jsdelivr.net/npm/lenis/…/lenis.min.js) */
    Lenis: new (options?: Record<string, unknown>) => {
      destroy: () => void;
      on: (event: string, callback: () => void) => void;
      raf: (time: number) => void;
      scrollTo: (target: number | HTMLElement, options?: Record<string, unknown>) => void;
    };
  }
}

/* ── helpers ─────────────────────────────────────────────────────────────── */
function clamp01(v: number) {
  return Math.max(0, Math.min(1, v));
}

function loadStylesheet(href: string, attr = "data-lenis"): Promise<void> {
  return new Promise((res, rej) => {
    if (document.querySelector(`link[${attr}][href="${href}"]`)) {
      res();
      return;
    }
    const l = document.createElement("link");
    l.rel = "stylesheet";
    l.href = href;
    l.setAttribute(attr, "1");
    l.onload = () => res();
    l.onerror = () => rej(new Error(`Failed to load stylesheet ${href}`));
    document.head.appendChild(l);
  });
}

const LENIS_JS =
  "https://cdn.jsdelivr.net/npm/lenis@1.3.23/dist/lenis.min.js";
const LENIS_CSS =
  "https://cdn.jsdelivr.net/npm/lenis@1.3.23/dist/lenis.css";

/** Smooth-step easing (ease-in-out) for Lenis programmatic scroll — MY_GSAP: sine-like feel */
function easeInOutQuad(t: number): number {
  return t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;
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
  const t = useTranslations('Home');
  const [simpleVideo, setSimpleVideo] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const pendingSeekRef = useRef(false);
  const smoothedRef = useRef(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // iOS Chrome can choke on heavy hydration + canvas + seeking.
    // Prefer a simple inline video on coarse pointers / reduced-motion devices.
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    setSimpleVideo(reduceMotion || coarse);
  }, []);

  useEffect(() => {
    if (simpleVideo) {
      setReady(true);
      return;
    }
    const video = document.createElement("video");
    video.src = src;
    video.muted = true;
    video.playsInline = true;
    video.preload = "auto";
    videoRef.current = video;

    let cancelled = false;
    let settled = false;
    const settle = () => {
      if (cancelled || settled) return;
      settled = true;
      setReady(true);
    };

    /* loadedmetadata alone can hang if decode/network stalls */
    video.addEventListener("loadedmetadata", settle);
    video.addEventListener("loadeddata", settle);
    video.addEventListener("canplay", settle);
    video.addEventListener("error", settle);

    try {
      video.load();
    } catch {
      settle();
    }

    const timeoutId = window.setTimeout(settle, 10_000);

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
      video.removeEventListener("loadedmetadata", settle);
      video.removeEventListener("loadeddata", settle);
      video.removeEventListener("canplay", settle);
      video.removeEventListener("error", settle);
      videoRef.current = null;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [src]);

  useEffect(() => {
    if (simpleVideo) return;
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
    if (simpleVideo) return;
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

  if (simpleVideo) {
    return (
      <div className={styles.scrubRoot}>
        <video
          src={src}
          className={styles.photoVideo}
          muted
          playsInline
          autoPlay
          loop
          preload="metadata"
        />
      </div>
    );
  }

  return (
    <div className={styles.scrubRoot}>
      <canvas ref={canvasRef} className={styles.scrubCanvas} />
      {!ready && (
        <div className={styles.scrubLoader} aria-label={t('scrub.ariaLoadingVideo')}>
          <div className={styles.scrubLoaderBar} />
          <div className={styles.scrubLoaderText}>{t('scrub.loading')}</div>
        </div>
      )}
    </div>
  );
}

/* ── Persists across SPA navigation so the entrance never replays ────────── */
let heroEntrancePlayed = false;

/* ── Subtitle stagger driven by hero scroll; max progress never decreases ─ */
let heroSubtitleRevealProgress = 0;

/* ── Main component ──────────────────────────────────────────────────────── */
export function StudioGlass() {
  const t = useTranslations('Home');
  const rootRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const lenisRef = useRef<InstanceType<Window["Lenis"]> | null>(null);
  const heroCardRef = useRef<HTMLElement>(null);
  const heroScrollSpaceRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const scrollHintRef = useRef<HTMLDivElement>(null);
  const scrubProgressRef = useRef(0);
  const heroLoaderRef = useRef<HTMLDivElement>(null);
  // Never default to "blank page behind a loader" (mobile can stall JS).
  const [heroBooting, setHeroBooting] = useState(false);
  const shouldAnimate = useMemo(() => {
    if (typeof window === "undefined") return true;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    return !(reduceMotion || coarse);
  }, []);

  /* scroll to a section id within the custom scroll container */
  const scrollToSection = (id: string) => {
    const scroller = scrollRef.current;
    const target = document.getElementById(id);
    if (!scroller || !target) return;
    const top = target.offsetTop;
    const lenis = lenisRef.current;
    if (lenis) {
      lenis.scrollTo(top, { duration: 1.2, easing: easeInOutQuad });
    } else {
      scroller.scrollTo({ top, behavior: "smooth" });
    }
  };

  /* handle hash on mount — e.g. navigated here from /work with /#services */
  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (!hash) return;
    const attempt = (tries = 0) => {
      const scroller = scrollRef.current;
      const target = document.getElementById(hash);
      if (scroller && target) {
        const lenis = lenisRef.current;
        if (lenis) {
          lenis.scrollTo(target.offsetTop, { duration: 1.2, easing: easeInOutQuad });
        } else {
          scroller.scrollTo({ top: target.offsetTop, behavior: "smooth" });
        }
      } else if (tries < 10) {
        setTimeout(() => attempt(tries + 1), 150);
      }
    };
    setTimeout(() => attempt(), 500);
  }, []);

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

  /* Hide “Scroll to explore” when the hero card is outside the scroll viewport (restore-scroll / deep links). */
  useEffect(() => {
    const root = scrollRef.current;
    const hero = heroCardRef.current;
    const hint = scrollHintRef.current;
    if (!root || !hero || !hint) return;

    const heroInScrollViewport = () => {
      const rr = root.getBoundingClientRect();
      const hr = hero.getBoundingClientRect();
      return hr.bottom > rr.top + 2 && hr.top < rr.bottom - 2;
    };

    const sync = () => {
      hint.classList.toggle(styles.scrollHintHidden, !heroInScrollViewport());
    };

    sync();
    root.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync);
    return () => {
      root.removeEventListener("scroll", sync);
      window.removeEventListener("resize", sync);
    };
  }, []);

  /* ── GSAP: entrance + scroll-driven video scrub ───────────────────────── */
  useEffect(() => {
    const el = scrollRef.current;
    const card = heroCardRef.current;
    const space = heroScrollSpaceRef.current;
    const title = titleRef.current;
    const hint = scrollHintRef.current;
    const subtitle = subtitleRef.current;
    const loader = heroLoaderRef.current;
    if (!el || !card || !space || !title || !hint) return;

    let cancelled = false;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let gsapCtx: any = null;
    let lenisTicker: ((time: number) => void) | null = null;
    let gsapApi: { ticker: { add: (fn: (t: number) => void) => void; remove: (fn: (t: number) => void) => void; lagSmoothing: (v: number) => void }; set: (...args: any[]) => void } | null = null;
    let fallbackTimer: number | null = null;

    const revealStaticHero = () => {
      // If GSAP/CDN fails (common in in-app iOS webviews), the hero defaults to:
      // - heroCard clip-path: 0%
      // - title chars opacity: 0
      // which looks like a blank page. Snap to a visible, non-animated state.
      try {
        const snapCx = window.innerWidth <= 640 ? 50 : 18;
        card.style.clipPath = `circle(135% at ${snapCx}% 50%)`;
        const chars = Array.from(title.querySelectorAll<HTMLElement>("[data-char]"));
        chars.forEach((c) => {
          c.style.opacity = "1";
          c.style.transform = "none";
        });
        const subWords = subtitle
          ? Array.from(subtitle.querySelectorAll<HTMLElement>("[data-subtitle-word]"))
          : [];
        subWords.forEach((w) => {
          w.style.opacity = "1";
          w.style.transform = "none";
        });
        hint.style.opacity = "1";
        hint.style.transform = "none";
        el.style.overflowY = "auto";
        el.style.paddingRight = "";
        setHeroBooting(false);
      } catch {
        // no-op; worst case we keep current styles
      }
    };

    const init = async () => {
      // Show the loader overlay only when we're actually attempting to animate.
      setHeroBooting(shouldAnimate);
      if (!shouldAnimate) {
        heroEntrancePlayed = true;
        revealStaticHero();
        return;
      }
      // Start the “show something ASAP” watchdog immediately (before any awaits).
      // iOS Chrome can delay loading split chunks; we don’t want a blank hero.
      fallbackTimer = window.setTimeout(() => {
        if (cancelled) return;
        heroEntrancePlayed = true;
        revealStaticHero();
      }, 700);

      /*
       * iOS (and in-app webviews) can be slow or flaky with 3rd-party CDNs.
       * Prefer bundling GSAP via npm (dynamic import = split chunk, same origin).
       */
      const [gsapMod, stMod] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled) return;
      const gsap = (gsapMod as unknown as { gsap?: any; default?: any }).gsap
        ?? (gsapMod as unknown as { default?: any }).default
        ?? gsapMod;
      const ScrollTrigger = (stMod as unknown as { ScrollTrigger?: any; default?: any }).ScrollTrigger
        ?? (stMod as unknown as { default?: any }).default
        ?? stMod;

      // Other sections rely on globals (AboutMe, Projects, etc.).
      window.gsap = gsap;
      window.ScrollTrigger = ScrollTrigger;

      gsapApi = gsap;
      gsap.registerPlugin(ScrollTrigger);

      const content = el.querySelector("main");
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (
        !cancelled &&
        !reduceMotion &&
        typeof window.Lenis === "function" &&
        content instanceof HTMLElement
      ) {
        try {
          await loadStylesheet(LENIS_CSS);
        } catch {
          /* Lenis optional stylesheet — scroll still smooth without it */
        }
        await loadScript(LENIS_JS);
        if (!cancelled && typeof window.Lenis === "function") {
          const lenis = new window.Lenis({
            wrapper: el,
            content,
            duration: 1.2,
            easing: easeInOutQuad,
            orientation: "vertical",
            gestureOrientation: "vertical",
            smoothWheel: true,
          });

          if (cancelled) {
            lenis.destroy();
          } else {
            lenisRef.current = lenis;
            lenis.on("scroll", ScrollTrigger.update);
            lenisTicker = (time: number) => {
              lenis.raf(time * 1000);
            };
            gsap.ticker.add(lenisTicker);
            gsap.ticker.lagSmoothing(0);
          }
        }
      }

      if (cancelled) return;

      gsapCtx = gsap.context(() => {
        if (fallbackTimer) window.clearTimeout(fallbackTimer);
        if (loader) gsap.set(loader, { opacity: 1, scale: 1, y: 0, display: "grid" });
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

        /* ── subtitle word spans ──────────────────────────────────────── */
        const subtitleSpans = subtitle
          ? (Array.from(subtitle.querySelectorAll("[data-subtitle-word]")) as HTMLElement[])
          : [];

        /* ── Phase A: entrance (fires once, never replays after navigation) ── */
        if (!heroEntrancePlayed) {
          heroEntrancePlayed = true;

          /* lock scroll while the loader is landing.
           * Measure scrollbar width BEFORE hiding so we can compensate
           * with padding-right → prevents layout shift when the scrollbar
           * disappears (content-area expands) and reappears on complete.
           * On macOS overlay-scrollbar systems sbWidth = 0 → no-op. */
          const sbWidth = el.offsetWidth - el.clientWidth;
          el.style.overflowY = "hidden";
          if (sbWidth > 0) el.style.paddingRight = `${sbWidth}px`;

          // Keep the entire card hidden until the reveal starts (loader only).
          gsap.set(card, { opacity: 0 });

          // Hide hero content while loader is visible.
          const hideEls = Array.from(
            card.querySelectorAll<HTMLElement>(
              `.${styles.heroContent}, .${styles.photoContainer}, .${styles.actionBtn}, .${styles.metaLabel}, .${styles.circleText}`
            )
          );
          gsap.set(hideEls, { opacity: 0, y: 10 });

          /*
           * Fluid reveal (brings back the “bubble expands to show content” feel)
           * but without the old circle/glow visuals — loader fades out first.
           */
          const isMobile = window.innerWidth <= 640;
          const circle = { cx: isMobile ? 50 : 18, cy: 100, r: 4 };
          const applyClip = () => {
            card.style.clipPath = `circle(${circle.r.toFixed(2)}% at ${circle.cx.toFixed(2)}% ${circle.cy.toFixed(2)}%)`;
          };
          applyClip();

          /* set initial char states */
          /* w0 "Ideas to"  – slides in from the left */
          gsap.set(w0, { x: -28, rotation: -12, opacity: 0, transformOrigin: "50% 100%" });
          /* w1 "products." – 3-D flip down */
          gsap.set(w1, { y: -34, rotationX: 80, opacity: 0, transformPerspective: 900, transformOrigin: "50% 0% -18px" });
          /* w2 "Fast." – scale-pop from centre */
          gsap.set(w2, { scale: 0.3, y: 18, opacity: 0, transformOrigin: "50% 50%" });
          gsap.set(hint, { opacity: 0, y: 14 });

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
              if (loader) loader.style.display = "none";
              setHeroBooting(false);
            },
          });

          /* Loader bounce-in (replaces the old bubble/circle entrance) */
          if (loader) {
            gsap.set(loader, { display: "grid", opacity: 1, scale: 0.9, y: 40 });
            entranceTl.to(
              loader,
              {
                y: 0,
                scale: 1,
                duration: 1.1,
                ease: "elastic.out(1.2, 0.5)",
              },
              0
            );
            entranceTl.to(
              loader,
              {
                opacity: 0,
                duration: 0.35,
                ease: "power2.out",
              },
              1.0
            );
          }

          /* Hide loader first, then reveal the card + do the fluid reveal */
          entranceTl.set(card, { opacity: 1 }, 1.02);
          entranceTl.to(
            circle,
            {
              cy: 50,
              r: 5,
              duration: 1.1,
              ease: "elastic.out(1.2, 0.5)",
              onUpdate: applyClip,
            },
            1.05
          );

          entranceTl.to(
            circle,
            {
              r: 135,
              duration: 1.15,
              ease: "power2.inOut",
              onUpdate: applyClip,
            },
            1.8
          );

          /* Reveal hero content during the fluid fill */
          entranceTl.to(
            hideEls,
            {
              opacity: 1,
              y: 0,
              duration: 0.45,
              ease: "power2.out",
              stagger: 0.02,
            },
            1.95
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
            2.05
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
            2.4
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
            2.75
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
            3.15
          );
        } else {
          /* entrance already played (navigation back) – snap to final state */
          if (loader) loader.style.display = "none";
          setHeroBooting(false);
          if (w0.length) gsap.set(w0, { x: 0, rotation: 0, opacity: 1 });
          if (w1.length) gsap.set(w1, { y: 0, rotationX: 0, opacity: 1 });
          if (w2.length) gsap.set(w2, { scale: 1, y: 0, opacity: 1 });
          gsap.set(hint, { opacity: 1, y: 0 });
        }

        // Mobile gets the same single reveal as desktop (no extra scroll-in animation).

        /* ── Phase B: fade scroll hint on first scroll ───────────────── */
        const onFirstScroll = () => {
          gsap.to(hint, { opacity: 0, y: 6, duration: 0.4, ease: "power2.in" });
          el.removeEventListener("scroll", onFirstScroll);
        };
        el.addEventListener("scroll", onFirstScroll, { passive: true, once: true });

        /* ── Phase C: video scrub + subtitle (same scroll, subtitle locks forward)

          Video tracks scrub bidirectionally. Subtitle uses Pattern 2 (stagger)
          mapped onto scroll progress [subStart, subEnd], slowed 2× vs original:
          stagger 0.10, duration 0.24 (was 0.05 / 0.12). Scroll progress window
          length doubles accordingly (~0.32 → ~0.64). heroSubtitleRevealProgress
          only increases so words never hide when scrolling back up.

          ──────────────────────────────────────────────────────────────────────── */

        const subStart = 0.05;
        const subEnd = 0.69;

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

        const subtitleTl =
          subtitleSpans.length > 0
            ? gsap.timeline({ paused: true }).fromTo(
                subtitleSpans,
                { y: 20, opacity: 0 },
                {
                  y: 0,
                  opacity: 1,
                  stagger: 0.1,
                  duration: 0.24,
                  ease: "power2.out",
                  immediateRender: false,
                }
              )
            : null;

        if (subtitleSpans.length && subtitleTl) {
          gsap.set(subtitleSpans, { y: 20, opacity: 0 });
          subtitleTl.progress(heroSubtitleRevealProgress);
          if (heroSubtitleRevealProgress >= 1) {
            gsap.set(subtitleSpans, {
              clearProps: "transform",
              opacity: 1,
            });
          }
        }

        ScrollTrigger.create({
          animation: videoTl,
          trigger: space,
          scroller: el,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.9,
          onUpdate(self: { progress: number }) {
            if (!subtitleSpans.length || !subtitleTl) return;
            let subP = (self.progress - subStart) / (subEnd - subStart);
            subP = Math.max(0, Math.min(1, subP));
            heroSubtitleRevealProgress = Math.max(heroSubtitleRevealProgress, subP);
            subtitleTl.progress(heroSubtitleRevealProgress);
            if (heroSubtitleRevealProgress >= 1) {
              gsap.set(subtitleSpans, { clearProps: "transform" });
            }
          },
        });

        ScrollTrigger.refresh();
      });
    };

    init().catch((err) => {
      console.error(err);
      if (!cancelled) revealStaticHero();
    });

    return () => {
      cancelled = true;
      if (fallbackTimer) window.clearTimeout(fallbackTimer);
      if (lenisTicker) {
        gsapApi?.ticker.remove(lenisTicker);
      }
      lenisRef.current?.destroy();
      lenisRef.current = null;
      gsapCtx?.revert();
      /* heroEntrancePlayed is intentionally NOT reset here — it is module-level
         so it survives SPA navigation and prevents the entrance from replaying. */
    };
  }, []);

  return (
    <div ref={rootRef} className={`${styles.root} ${heroBooting ? styles.heroBooting : ""}`}>
      <div className={styles.ambientCanvas} aria-hidden="true">
        <div className={`${styles.orb} ${styles.orb1}`} />
        <div className={`${styles.orb} ${styles.orb2}`} />
        <div className={`${styles.orb} ${styles.orb3}`} />
        <div className={`${styles.orb} ${styles.orb4}`} />
      </div>

      <div className={styles.gridOverlay} aria-hidden="true" />

      <SiteNav onScrollTo={scrollToSection} />

      {/* scroll-to-explore indicator — outside scrollRoot so it doesn't scroll */}
      <div ref={scrollHintRef} className={styles.scrollHint} aria-hidden="true">
        <span className={styles.scrollHintText}>{t('scrollHint')}</span>
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
              {/* immediate loader (only visible during boot) */}
              <div ref={heroLoaderRef} className={styles.heroLoader} aria-hidden="true">
                <div className={styles.hypnotic} />
              </div>

              <section ref={heroCardRef} className={styles.heroCard}>
                <div className={`${styles.metaLabel} ${styles.posTopLeft}`}>
                  {t('meta.statusCreating')}
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
                         {t('circleText')}
                      </textPath>
                    </text>
                  </svg>
                </div>

                <div className={styles.heroContent}>
                  <h1 ref={titleRef} className={styles.heroTitle}>
                    <TitleWord word={t('title.w0')} wordIndex="0" />
                    <TitleWord
                      word={t('title.w1')}
                      wordIndex="1"
                      className={styles.titleOverlap}
                    />
                    <TitleWord
                      word={t('title.w2')}
                      wordIndex="2"
                      className={styles.titleAccent}
                    />
                  </h1>
                  <p ref={subtitleRef} className={styles.heroSubtitle}>
                    {[t('subtitle.websites'), "\u00a0•\u00a0", t('subtitle.apps'), "\u00a0•\u00a0", t('subtitle.automations')].map((word, i) => (
                      <span key={i} data-subtitle-word="" className={styles.subtitleWord}>{word}</span>
                    ))}
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

                <button
                  type="button"
                  className={styles.actionBtn}
                  onClick={() => scrollToSection("contact")}
                >
                  {t('cta')}
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
