"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import styles from "./Services.module.css";

/* ── card data ─────────────────────────────────────────────────────────── */
const CARDS = [
  {
    id: "websites",
    index: "01",
    title: "Websites",
    tag: "Web",
    body: "Fast, custom-built sites designed to turn visitors into clients. Clean design, strong messaging, and performance that drives results.",
    lensGradient: "radial-gradient(circle at 30% 30%, #4D6CFF, #9D50FF)",
  },
  {
    id: "apps",
    index: "02",
    title: "Apps",
    tag: "App",
    body: "From idea to product — intuitive, scalable apps built for real users. Clean UX, solid performance, ready to grow.",
    featured: true,
    lensGradient: "radial-gradient(circle at 30% 30%, #FF6B8B, #9D50FF)",
  },
  {
    id: "automations",
    index: "03",
    title: "Automations",
    tag: "Auto",
    body: "Custom workflows that connect your tools and eliminate repetitive tasks — saving hours and reducing errors so you can focus on what matters.",
    lensGradient: "radial-gradient(circle at 30% 30%, #E8F0FF, #FF6B8B)",
  },
] as const;

/* ── helpers ───────────────────────────────────────────────────────────── */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Gsap = any;

export function Services() {
  const sectionRef      = useRef<HTMLElement>(null);
  const pinRef          = useRef<HTMLDivElement>(null);
  const headingRef      = useRef<HTMLDivElement>(null);
  const h2Ref           = useRef<HTMLHeadingElement>(null);
  const stackRef        = useRef<HTMLDivElement>(null);
  const ctaRef          = useRef<HTMLAnchorElement>(null);
  const codeSnippetRef  = useRef<HTMLDivElement>(null);
  const cursorRef       = useRef<HTMLSpanElement>(null);
  /* code lines to type [line1, line2, line3] */
  const codeLineRefs    = useRef<(HTMLParagraphElement | null)[]>([null, null, null]);
  /* card[0]=Websites  card[1]=Apps  card[2]=Automations */
  const cardRefs        = useRef<(HTMLDivElement | null)[]>([null, null, null]);

  useEffect(() => {
    let retryTimer: ReturnType<typeof setTimeout>;
    let gsapCtx: Gsap = null;
    let cancelled = false;

    const tryInit = () => {
      if (cancelled) return;
      const gsap: Gsap = (window as Gsap).gsap;
      const ST: Gsap   = (window as Gsap).ScrollTrigger;
      if (!gsap || !ST) { retryTimer = setTimeout(tryInit, 80); return; }

      const section = sectionRef.current;
      const pin     = pinRef.current;
      const heading = headingRef.current;
      const cta     = ctaRef.current;
      const [c0, c1, c2] = cardRefs.current;
      if (!section || !pin || !heading || !c0 || !c1 || !c2) return;

      const scroller = document.getElementById("scroll-root") ?? undefined;

      gsapCtx = gsap.context(() => {
        /* ── Card initial state ──────────────────────────────────────
         *
         *  All three cards start centred (x:0) and invisible,
         *  90px below their rest position so they "rise in".
         *
         *  Z-order is fixed so each new card lands on top:
         *    c0 (Websites)     → zIndex 1  (deepest in stack)
         *    c1 (Apps)         → zIndex 2
         *    c2 (Automations)  → zIndex 3  (front when stacked)
         *
         *  Heading is always visible — no GSAP animation on it.
         *  Animating the heading with a y-offset created the same
         *  "content moves" artefact the user reported.
         */
        gsap.set([c0, c1, c2], { x: 0, y: 90, opacity: 0, scale: 1, rotation: 0 });
        gsap.set(c0, { zIndex: 1 });
        gsap.set(c1, { zIndex: 2 });
        gsap.set(c2, { zIndex: 3 });

        /* CTA hidden; no y-offset — opacity-only prevents any perceived movement */
        if (cta) gsap.set(cta, { opacity: 0 });

        /* ── h2 heading – word-split stagger (hero-style) ─────────────── */
        const h2 = h2Ref.current;
        if (h2) {
          const words = (h2.textContent || "").trim().split(/\s+/);
          h2.innerHTML = words
            .map((w) => `<span style="display:inline-block">${w}</span>`)
            .join(" ");
          const wordEls = Array.from(h2.querySelectorAll<HTMLElement>("span"));
          gsap.set(wordEls, { y: 60, opacity: 0, rotation: -6 });
          gsap.to(wordEls, {
            y: 0, opacity: 1, rotation: 0,
            stagger: 0.1,
            duration: 0.65,
            ease: "power3.out",
            scrollTrigger: {
              trigger: h2,
              scroller,
              start: "top 85%",
              once: true,
            },
          });
        }

        /* ── One-shot card timeline ──────────────────────────────────
         *
         *  Fires once when the section enters the viewport (scroll down).
         *  No scrub — the animation plays in real time (≈4s total) and
         *  never reverses on up-scroll.
         *
         *  STACK PHASE  (0 → 3s)
         *  Phase 1 (0 → 0.85s): c0 rises into view
         *  Phase 2 (1 → 1.85s): c1 rises; c0 stacks behind
         *  Phase 3 (2 → 2.85s): c2 rises; c1+c0 stack deeper
         *
         *  FAN-OUT  (3 → 4s)
         *  All cards spread to their final 3-column positions.
         */
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            scroller,
            start: "top 80%",
            once: true,
          },
        });

        /* Phase 1 */
        tl.to(c0, { y: 0, opacity: 1, duration: 0.85, ease: "power3.out" }, 0);

        /* Phase 2 */
        tl.to(c1, { y: 0, opacity: 1, duration: 0.85, ease: "power3.out" }, 1);
        tl.to(c0, { y: -20, scale: 0.91, rotation: -4, duration: 0.85, ease: "power2.inOut" }, 1);

        /* Phase 3 */
        tl.to(c2, { y: 0, opacity: 1, duration: 0.85, ease: "power3.out" }, 2);
        tl.to(c1, { y: -20, scale: 0.91, rotation: 3, duration: 0.85, ease: "power2.inOut" }, 2);
        tl.to(c0, { y: -38, scale: 0.83, rotation: -7, duration: 0.85, ease: "power2.inOut" }, 2);

        /* Phase 4 – fan out (desktop only; mobile keeps the stack) */
        if (window.innerWidth > 640) {
          tl.to(c0, { x: -364, y: 32, scale: 1, rotation: 0, duration: 1, ease: "power2.inOut" }, 3);
          tl.to(c1, { x: 0, y: -16, scale: 1, rotation: 0, duration: 1, ease: "power2.inOut" }, 3);
          tl.to(c2, { x: 364, y: 32, scale: 1, rotation: 0, duration: 1, ease: "power2.inOut" }, 3);
        }

        /* CTA fades in as cards settle */
        if (cta) {
          tl.to(cta, { opacity: 1, duration: 0.4, ease: "power2.out" }, 3.75);
        }

        /* ── Code-snippet typing animation ──────────────────────────
         *
         *  Each line is clipped from the right (inset 100% → 0%).
         *  Left-to-right reveal mimics a typewriter.  Fires once when
         *  the snippet enters the viewport; independent of the scrub TL.
         */
        const snippetEl  = codeSnippetRef.current;
        const codeLines  = codeLineRefs.current.filter(Boolean);
        const cursorEl   = cursorRef.current;

        if (snippetEl && codeLines.length) {
          gsap.set(codeLines, { clipPath: "inset(0 100% 0 0)" });

          const typingTl = gsap.timeline({
            scrollTrigger: {
              trigger: snippetEl,
              scroller,
              start: "top 82%",
              once: true,
            },
          });

          codeLines.forEach((line, i) => {
            /* duration proportional to char count for consistent "speed" */
            const chars   = (line as HTMLElement).textContent?.length ?? 20;
            const dur     = Math.max(0.35, chars * 0.022);
            typingTl.to(line, {
              clipPath: "inset(0 0% 0 0)",
              duration: dur,
              ease: "none",
            }, i * 0.55);
          });

          /* cursor blinks once last line finishes */
          if (cursorEl) {
            typingTl.set(cursorEl, { opacity: 1 }, ">");
          }
        }

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
    /* outer section – ScrollTrigger pinSpacing adds height here automatically */
    <section ref={sectionRef} className={styles.services} id="services">

      {/* ── pinned viewport panel ──────────────────────────────────────── */}
      <div ref={pinRef} className={styles.pinWrap}>

        {/* heading area */}
        <div ref={headingRef} className={styles.headerArea}>
          <div className={styles.tags}>
            <span className={styles.tag}>Craft: Digital</span>
            <span className={styles.tag}>Scope: End-to-End</span>
          </div>

          <h2 ref={h2Ref} className={styles.heading}>Build&nbsp;for&nbsp;Results</h2>

          <p className={styles.status}>
          High-performance digital solutions, built for real results
          </p>
        </div>

        {/* card stack / spread */}
        <div ref={stackRef} className={styles.stackWrap}>
          {CARDS.map((card, i) => (
            <div
              key={card.id}
              ref={(el) => { cardRefs.current[i] = el; }}
              className={`${styles.card} ${"featured" in card ? styles.cardFeatured : ""}`}
            >
              {/* ghost background number */}
              <div className={styles.cardNum} aria-hidden="true">
                {card.index}
              </div>

              <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>{card.title}</h3>
                <div className={styles.tagPill}>
                  <div className={styles.lens}>
                    <div
                      className={styles.lensCore}
                      style={{ background: card.lensGradient }}
                    />
                    <div className={styles.lensNoise} aria-hidden="true" />
                  </div>
                  <span className={styles.tagName}>{card.tag}</span>
                </div>
              </div>

              <p className={styles.cardBody}>{card.body}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <Link ref={ctaRef} href="/services" className={styles.cta}>
          Explore Services
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            aria-hidden="true"
          >
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </Link>

        {/* ── Code-snippet status widget (lg screens only) ──────────── */}
        <div ref={codeSnippetRef} className={styles.codeSnippet} aria-hidden="true">
          <div className={styles.codeBox}>
            <div className={styles.trafficLights}>
              <span className={`${styles.dot} ${styles.dotRed}`} />
              <span className={`${styles.dot} ${styles.dotYellow}`} />
              <span className={`${styles.dot} ${styles.dotGreen}`} />
            </div>
            {/* line 0 */}
            <p ref={(el) => { codeLineRefs.current[0] = el; }} className={styles.codeLine}>
              <span className={styles.kwConst}>const</span>
              {" status = "}
              <span className={styles.kwStr}>&apos;READY_TO_START&apos;</span>;
            </p>
            {/* line 1 */}
            <p ref={(el) => { codeLineRefs.current[1] = el; }} className={styles.codeLine}>
              <span className={styles.kwConst}>const</span>
              {" getResponse = "}
              <span className={styles.kwPurp}>&apos;24H&apos;</span>;
            </p>
            {/* line 2 – comment with blinking cursor after it */}
            <p ref={(el) => { codeLineRefs.current[2] = el; }} className={`${styles.codeLine} ${styles.codeComment}`}>
              {"// CURRENTLY_ACCEPTING_NEW_PROJECTS"}
              <span ref={cursorRef} className={styles.cursor} />
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
