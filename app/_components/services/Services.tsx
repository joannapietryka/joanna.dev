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
  /** Preserves entity markup so matchMedia can reset h2 before each GSAP split */
  const headingMarkupRef = useRef<string>("");

  useEffect(() => {
    let retryTimer: ReturnType<typeof setTimeout>;
    let revertAll: (() => void) | null = null;
    let cancelled = false;

    const tryInit = () => {
      if (cancelled) return;
      const gsap: Gsap = (window as Gsap).gsap;
      const ST: Gsap   = (window as Gsap).ScrollTrigger;
      if (!gsap || !ST) { retryTimer = setTimeout(tryInit, 80); return; }

      const section = sectionRef.current;
      const heading = headingRef.current;
      const cta     = ctaRef.current;
      const [c0, c1, c2] = cardRefs.current;
      if (!section || !heading || !c0 || !c1 || !c2) return;

      const scroller = document.getElementById("scroll-root") ?? undefined;

      const wireHeadingWords = () => {
        const h2 = h2Ref.current;
        if (!h2) return;
        if (!headingMarkupRef.current) headingMarkupRef.current = h2.innerHTML;
        h2.innerHTML = headingMarkupRef.current;
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
      };

      const wireSnippetTyping = () => {
        const snippetEl  = codeSnippetRef.current;
        const codeLines  = codeLineRefs.current.filter(Boolean);
        const cursorEl   = cursorRef.current;

        if (!snippetEl || !codeLines.length) return;

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
          const chars   = (line as HTMLElement).textContent?.length ?? 20;
          const dur     = Math.max(0.35, chars * 0.022);
          typingTl.to(line, {
            clipPath: "inset(0 0% 0 0)",
            duration: dur,
            ease: "none",
          }, i * 0.55);
        });

        if (cursorEl) {
          typingTl.set(cursorEl, { opacity: 1 }, ">");
        }
      };

      if (typeof gsap.matchMedia === "function") {
        const mq = gsap.matchMedia();

        mq.add("(max-width: 768px)", () => {
          const mobileEls: HTMLElement[] = [c0, c1, c2];
          if (cta) mobileEls.push(cta);
          gsap.set(mobileEls, { clearProps: true });

          const ctx = gsap.context(() => {
            wireHeadingWords();
          }, section);

          ST.refresh();
          return () => ctx.revert();
        });

        mq.add("(min-width: 769px)", () => {
          const ctx = gsap.context(() => {
            gsap.set([c0, c1, c2], { x: 0, y: 90, opacity: 0, scale: 1, rotation: 0 });
            gsap.set(c0, { zIndex: 1 });
            gsap.set(c1, { zIndex: 2 });
            gsap.set(c2, { zIndex: 3 });
            if (cta) gsap.set(cta, { opacity: 0 });

            wireHeadingWords();

            const tl = gsap.timeline({
              scrollTrigger: {
                trigger: section,
                scroller,
                start: "top 80%",
                once: true,
              },
            });

            tl.to(c0, { y: 0, opacity: 1, duration: 0.85, ease: "power3.out" }, 0);
            tl.to(c1, { y: 0, opacity: 1, duration: 0.85, ease: "power3.out" }, 1);
            tl.to(c0, { y: -20, scale: 0.91, rotation: -4, duration: 0.85, ease: "power2.inOut" }, 1);
            tl.to(c2, { y: 0, opacity: 1, duration: 0.85, ease: "power3.out" }, 2);
            tl.to(c1, { y: -20, scale: 0.91, rotation: 3, duration: 0.85, ease: "power2.inOut" }, 2);
            tl.to(c0, { y: -38, scale: 0.83, rotation: -7, duration: 0.85, ease: "power2.inOut" }, 2);
            tl.to(c0, { x: -364, y: 32, scale: 1, rotation: 0, duration: 1, ease: "power2.inOut" }, 3);
            tl.to(c1, { x: 0, y: -16, scale: 1, rotation: 0, duration: 1, ease: "power2.inOut" }, 3);
            tl.to(c2, { x: 364, y: 32, scale: 1, rotation: 0, duration: 1, ease: "power2.inOut" }, 3);
            if (cta) {
              tl.to(cta, { opacity: 1, duration: 0.4, ease: "power2.out" }, 3.75);
            }

            wireSnippetTyping();
          }, section);

          ST.refresh();
          return () => ctx.revert();
        });

        revertAll = () => mq.revert();
      } else {
        /* Fallback — single desktop timeline */
        const ctx = gsap.context(() => {
          gsap.set([c0, c1, c2], { x: 0, y: 90, opacity: 0, scale: 1, rotation: 0 });
          gsap.set(c0, { zIndex: 1 });
          gsap.set(c1, { zIndex: 2 });
          gsap.set(c2, { zIndex: 3 });
          if (cta) gsap.set(cta, { opacity: 0 });
          wireHeadingWords();
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: section,
              scroller,
              start: "top 80%",
              once: true,
            },
          });
          tl.to(c0, { y: 0, opacity: 1, duration: 0.85, ease: "power3.out" }, 0);
          tl.to(c1, { y: 0, opacity: 1, duration: 0.85, ease: "power3.out" }, 1);
          tl.to(c0, { y: -20, scale: 0.91, rotation: -4, duration: 0.85, ease: "power2.inOut" }, 1);
          tl.to(c2, { y: 0, opacity: 1, duration: 0.85, ease: "power3.out" }, 2);
          tl.to(c1, { y: -20, scale: 0.91, rotation: 3, duration: 0.85, ease: "power2.inOut" }, 2);
          tl.to(c0, { y: -38, scale: 0.83, rotation: -7, duration: 0.85, ease: "power2.inOut" }, 2);
          if (typeof window !== "undefined" && window.innerWidth > 640) {
            tl.to(c0, { x: -364, y: 32, scale: 1, rotation: 0, duration: 1, ease: "power2.inOut" }, 3);
            tl.to(c1, { x: 0, y: -16, scale: 1, rotation: 0, duration: 1, ease: "power2.inOut" }, 3);
            tl.to(c2, { x: 364, y: 32, scale: 1, rotation: 0, duration: 1, ease: "power2.inOut" }, 3);
          }
          if (cta) {
            tl.to(cta, { opacity: 1, duration: 0.4, ease: "power2.out" }, 3.75);
          }
          wireSnippetTyping();
          ST.refresh();
        }, section);
        revertAll = () => ctx.revert();
      }

      ST.refresh();
    };

    tryInit();

    return () => {
      cancelled = true;
      clearTimeout(retryTimer);
      revertAll?.();
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
              {/* full-card link to the matching services tab */}
              <Link
                href={`/services?tab=${card.id}`}
                className={styles.cardLink}
                aria-label={`View ${card.title} services`}
              />

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
