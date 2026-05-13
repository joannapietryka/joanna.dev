"use client";

import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';
import { useEffect, useRef, useState } from "react";
import styles from "./Projects.module.css";

/* ── helpers ─────────────────────────────────────────────────────────────── */
function clamp01(v: number) {
  return Math.max(0, Math.min(1, v));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Gsap = any;

/* ── Projects component ──────────────────────────────────────────────────── */
export function Projects() {
  const t = useTranslations('Projects');

  const annotations = [
    {
      index: '01',
      title: t('annotations.brief.title'),
      desc: t('annotations.brief.desc'),
      stat: t('annotations.brief.stat'),
      side: 'left' as const,
      show: 0.0,
      hide: 0.32
    },
    {
      index: '02',
      title: t('annotations.design.title'),
      desc: t('annotations.design.desc'),
      stat: t('annotations.design.stat'),
      side: 'right' as const,
      show: 0.37,
      hide: 0.67
    },
    {
      index: '03',
      title: t('annotations.shipped.title'),
      desc: t('annotations.shipped.desc'),
      stat: t('annotations.shipped.stat'),
      side: 'left' as const,
      show: 0.72,
      hide: 1.0
    }
  ] as const;

  const sectionRef     = useRef<HTMLElement>(null);
  const scrollSpaceRef = useRef<HTMLDivElement>(null);
  const canvasRef      = useRef<HTMLCanvasElement>(null);
  const videoRef       = useRef<HTMLVideoElement | null>(null);
  const rafRef         = useRef<number | null>(null);
  const pendingSeekRef = useRef(false);
  const progressRef    = useRef(0);
  const smoothedRef    = useRef(0);
  const cardRefs       = useRef<(HTMLDivElement | null)[]>([null, null, null]);
  const lastVisibleRef = useRef<boolean[]>([false, false, false]);
  const headingRef     = useRef<HTMLDivElement>(null);
  const [videoReady, setVideoReady] = useState(false);

  /* ── Video element ────────────────────────────────────────────────────── */
  useEffect(() => {
    const video = document.createElement("video");
    video.src = "/assets/videos/laptop-vid.mp4";
    video.muted = true;
    video.playsInline = true;
    video.preload = "auto";
    videoRef.current = video;

    let cancelled = false;
    let settled = false;
    const settle = () => {
      if (cancelled || settled) return;
      settled = true;
      setVideoReady(true);
    };

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
  }, []);

  /* ── Canvas DPR resize ────────────────────────────────────────────────── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width  = Math.floor(r.width  * dpr);
      canvas.height = Math.floor(r.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  /* ── rAF video draw loop ──────────────────────────────────────────────── */
  useEffect(() => {
    if (!videoReady) return;
    const video  = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const draw = () => {
      const w  = canvas.clientWidth;
      const h  = canvas.clientHeight;
      const vw = video.videoWidth  || 1;
      const vh = video.videoHeight || 1;
      /* cover-fit: scale to fill the canvas while preserving aspect ratio */
      const s  = Math.max(w / vw, h / vh);
      ctx.clearRect(0, 0, w, h);
      ctx.drawImage(video, (w - vw * s) / 2, (h - vh * s) / 2, vw * s, vh * s);
    };

    const loop = () => {
      const target = progressRef.current ?? 0;
      /* exponential smoothing (matches hero scrub behaviour) */
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
  }, [videoReady]);

  /* ── GSAP: heading reveal + scrub proxy + annotation cards ───────────── */
  useEffect(() => {
    let retryTimer: ReturnType<typeof setTimeout>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let gsapCtx: any = null;
    let cancelled    = false;

    const tryInit = () => {
      if (cancelled) return;
      const gsap: Gsap = (window as Gsap).gsap;
      const ST:   Gsap = (window as Gsap).ScrollTrigger;
      if (!gsap || !ST) {
        retryTimer = setTimeout(tryInit, 80);
        return;
      }

      const section     = sectionRef.current;
      const scrollSpace = scrollSpaceRef.current;
      const heading     = headingRef.current;
      if (!section || !scrollSpace) {
        retryTimer = setTimeout(tryInit, 80);
        return;
      }

      const scroller = document.getElementById("scroll-root") ?? undefined;
      const isMobile = window.matchMedia?.("(max-width: 768px)")?.matches ?? false;

      gsapCtx = gsap.context(() => {
        const revealInView = (el: HTMLElement | null, delay = 0) => {
          if (!el) return;
          const startPct = isMobile ? "top 90%" : "top 85%";
          gsap.set(el, { y: 22, opacity: 0 });
          gsap.to(el, {
            y: 0,
            opacity: 1,
            duration: 0.6,
            ease: "power2.out",
            delay,
            scrollTrigger: {
              trigger: el,
              scroller,
              start: startPct,
              once: true,
              invalidateOnRefresh: true,
              onEnter: () => {},
          },
          });
        };

        /* ── heading word-split stagger (hero-style) ─────────────────── */
        if (heading) {
          if (isMobile) {
            const tags = heading.querySelectorAll<HTMLElement>(`.${styles.tag}`);
            tags.forEach((tag, i) => revealInView(tag, i * 0.06));
          }

          const h2 = heading.querySelector("h2") ?? heading;
          const words = (h2.textContent || "").trim().split(/\s+/);
          h2.innerHTML = words
            .map((w) => `<span style="display:inline-block">${w}</span>`)
            .join(" ");
          const wordEls = Array.from(h2.querySelectorAll<HTMLElement>("span"));
          gsap.set(wordEls, { y: 60, opacity: 0, rotation: -6 });
          gsap.to(wordEls, {
            y: 0,
            opacity: 1,
            rotation: 0,
            stagger: 0.1,
            duration: 0.65,
            ease: "power3.out",
            scrollTrigger: {
              trigger: heading,
              scroller,
              start: isMobile ? "top 90%" : "top 85%",
              once: true,
              invalidateOnRefresh: true,
              onEnter: () => {},
          },
          });
        }

        // Mobile reveal for the CTA button inside the sticky canvas group (requested: Projects_viewBtn).
        if (isMobile) {
          const viewBtn = section.querySelector<HTMLElement>(`.${styles.viewBtn}`);
          revealInView(viewBtn, 0.06);
        }

        /* ── annotation cards – desktop only (mobile renders below the scrub) */
        if (!isMobile) {
          cardRefs.current.forEach((el) => {
            if (!el) return;
            el.style.opacity   = "0";
            el.style.transform = "translateY(16px)";
          });
        }

        /* ── scrub proxy → video progress + card visibility ─────────── */
        const proxy = { value: 0 };
        const tl    = gsap.timeline({ defaults: { ease: "none" } });

        tl.to(proxy, {
          value: 1,
          duration: 1,
          ease: "none",
          onUpdate() {
            progressRef.current = proxy.value;
            if (!isMobile) {
              /* update annotation card visibility */
              const p = proxy.value;
              annotations.forEach((ann, i) => {
                const el      = cardRefs.current[i];
                if (!el) return;
                const visible = p >= ann.show && p < ann.hide;
                /* deduplicate: only write inline styles when state changes */
                if (visible === lastVisibleRef.current[i]) return;
                lastVisibleRef.current[i] = visible;
                el.style.opacity   = visible ? "1" : "0";
                el.style.transform = visible ? "translateY(0)" : "translateY(16px)";
              });
            }
          },
        });

        ST.create({
          animation: tl,
          trigger: scrollSpace,
          scroller,
          /*
           * start: "top top" — scrub begins exactly when the sticky canvas
           * locks to the top of the viewport (same on both breakpoints).
           * Mobile end: "bottom 60%" — finish while the panel is still well
           * in view, before it slides behind the navigation bar.
           */
          start: "top top",
          end:   isMobile ? "bottom 60%" : "bottom bottom",
          scrub: 1,
          invalidateOnRefresh: true,
        });

        ST.refresh();
      }, section);
    };

    tryInit();

    return () => {
      cancelled = true;
      clearTimeout(retryTimer);
      gsapCtx?.revert();
    };
  }, []);

  return (
    <section ref={sectionRef} className={styles.projects}>

      {/* ── Section heading (scrolls normally, then disappears) ─────────── */}
      <div ref={headingRef} className={styles.headerArea}>
        <div className={styles.tags}>
          <span className={styles.tag}>{t('tags.craft')}</span>
          <span className={styles.tag}>{t('tags.medium')}</span>
        </div>
        <h2 className={styles.heading}>{t('heading')}</h2>
      </div>
      {/* ── Scroll travel wrapper ───────────────────────────────────────── */}
      <div ref={scrollSpaceRef} className={styles.scrollSpace}>
        <div className={styles.sticky}>

          {/* ── Laptop video canvas + CTA ────────────────────────────── */}
          <div className={styles.canvasGroup}>
            <div className={styles.canvasWrap}>
              <canvas ref={canvasRef} className={styles.canvas} />
              {!videoReady && (
                <div className={styles.loadingOverlay}>
                  <div className={styles.loadingBar} />
                  <span className={styles.loadingText}>{t('loading')}</span>
                </div>
              )}
            </div>
            <Link href="/work" className={styles.viewBtn}>
              {t('viewPortfolio')}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
          </div>

          {/* ── Annotation cards ────────────────────────────────────── */}
          <div className={styles.cardsInSticky}>
            {annotations.map((ann, i) => (
              <div
                key={ann.index}
                ref={(el) => { cardRefs.current[i] = el; }}
                className={`${styles.annotationCard} ${ann.side === "right" ? styles.cardRight : styles.cardLeft}`}
              >
                <div className={styles.cardIndex}>{ann.index}</div>
                <h3 className={styles.cardTitle}>{ann.title}</h3>
                <p className={styles.cardDesc}>{ann.desc}</p>
                <div className={styles.cardStat}>{ann.stat}</div>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* Mobile: cards appear after the scroll-scrub video section */}
      <div className={styles.cardsAfter}>
        {annotations.map((ann) => (
          <div
            key={`after-${ann.index}`}
            className={styles.annotationCard}
          >
            <div className={styles.cardIndex}>{ann.index}</div>
            <h3 className={styles.cardTitle}>{ann.title}</h3>
            <p className={styles.cardDesc}>{ann.desc}</p>
            <div className={styles.cardStat}>{ann.stat}</div>
          </div>
        ))}
      </div>

    </section>
  );
}
