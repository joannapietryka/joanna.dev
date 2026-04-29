"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import styles from "./AboutMe.module.css";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Gsap = any;

export function AboutMe() {
  const sectionRef   = useRef<HTMLElement>(null);
  const photoColRef  = useRef<HTMLDivElement>(null);
  const eyebrowRef   = useRef<HTMLDivElement>(null);
  const titleRef     = useRef<HTMLHeadingElement>(null);
  const leadRef      = useRef<HTMLParagraphElement>(null);
  const cardGridRef  = useRef<HTMLDivElement>(null);
  const aiCardRef    = useRef<HTMLDivElement>(null);
  const lensRef      = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let retryTimer: ReturnType<typeof setTimeout>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let gsapCtx: any = null;
    let cancelled = false;

    const tryInit = () => {
      if (cancelled) return;
      const gsap: Gsap = (window as Gsap).gsap;
      const ST: Gsap   = (window as Gsap).ScrollTrigger;
      if (!gsap || !ST) { retryTimer = setTimeout(tryInit, 80); return; }

      const section  = sectionRef.current;
      if (!section) return;

      const scroller = document.getElementById("scroll-root") ?? undefined;

      gsapCtx = gsap.context(() => {
        const photo    = photoColRef.current;
        const eyebrow  = eyebrowRef.current;
        const title    = titleRef.current;
        const lead     = leadRef.current;
        const cardGrid = cardGridRef.current;
        const aiCard   = aiCardRef.current;
        const lens     = lensRef.current;
        const cards    = cardGrid ? Array.from(cardGrid.children) as HTMLElement[] : [];

        /* ── set initial hidden states ─────────────────────────────────── */
        if (photo)   gsap.set(photo,   { x: -70, opacity: 0 });
        if (eyebrow) gsap.set(eyebrow, { y: 20,  opacity: 0 });
        if (title)   gsap.set(title,   { y: 48,  opacity: 0 });
        if (lead)    gsap.set(lead,    { y: 24,  opacity: 0 });
        if (cards.length) gsap.set(cards, { y: 32, scale: 0.9, opacity: 0 });
        if (aiCard)  gsap.set(aiCard,  { y: 28,  opacity: 0 });

        /* ── timeline fires once when section enters viewport ──────────── */
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            scroller,
            start: "top 72%",
            once: true,
          },
        });

        /* Pattern 1 – photo slides in from left */
        if (photo) {
          tl.to(photo, {
            x: 0, opacity: 1, duration: 0.95, ease: "power3.out",
          }, 0);
        }

        /* Pattern 2 – eyebrow tag fades up */
        if (eyebrow) {
          tl.to(eyebrow, {
            y: 0, opacity: 1, duration: 0.5, ease: "power2.out",
          }, 0.15);
        }

        /* Pattern 2 – title slides up */
        if (title) {
          tl.to(title, {
            y: 0, opacity: 1, duration: 0.75, ease: "power3.out",
          }, 0.3);
        }

        /* lead paragraph fades up */
        if (lead) {
          tl.to(lead, {
            y: 0, opacity: 1, duration: 0.6, ease: "power2.out",
          }, 0.5);
        }

        /* Pattern 3 – cards scale + fade stagger */
        if (cards.length) {
          tl.to(cards, {
            y: 0, scale: 1, opacity: 1,
            duration: 0.6, stagger: 0.1, ease: "back.out(1.2)",
          }, 0.6);
        }

        /* AI card fades up */
        if (aiCard) {
          tl.to(aiCard, {
            y: 0, opacity: 1, duration: 0.6, ease: "power2.out",
          }, 0.85);
        }

        /* Pattern 8 – glass lens bounces forever (no scroll trigger) */
        if (lens) {
          gsap.to(lens, {
            y: -14, duration: 1.8, repeat: -1, yoyo: true, ease: "sine.inOut",
          });
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
    <section ref={sectionRef} className={styles.about} id="about">
      <div className={styles.inner}>

        {/* ── LEFT: portrait ────────────────────────────────────────────── */}
        <div ref={photoColRef} className={styles.photoCol}>
          <svg
            className={styles.spinRing}
            viewBox="0 0 500 500"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <circle cx="250" cy="250" r="200" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4 8" />
            <circle cx="250" cy="250" r="160" fill="none" stroke="currentColor" strokeWidth="0.5" />
            <path d="M 250 10 L 250 40 M 250 460 L 250 490 M 10 250 L 40 250 M 460 250 L 490 250" stroke="currentColor" strokeWidth="2" />
            <circle cx="250" cy="50" r="4" fill="currentColor" />
            <circle cx="250" cy="450" r="4" fill="currentColor" />
          </svg>

          <div className={styles.portraitMask}>
            <Image
              src="/assets/profile.png"
              alt="Joanna Pietryka – Digital Product Builder"
              fill
              className={styles.portraitImg}
              sizes="(max-width: 768px) 85vw, 400px"
              priority
            />
            <div className={styles.portraitOverlay} aria-hidden="true" />
            <div ref={lensRef} className={styles.glassLens} aria-hidden="true" />
          </div>

          <div className={styles.buildingCapsule} aria-hidden="true">
            <div className={styles.refOrb} />
            <span className={styles.buildingText}>Building...</span>
          </div>

          <div className={styles.statusBadge} aria-hidden="true">
            <div className={styles.statusDotWrap}>
              <div className={styles.statusDot} />
            </div>
            <div className={styles.statusInfo}>
              <span className={styles.statusLabel}>System Status</span>
              <span className={styles.statusValue}>Online &amp; Ready</span>
            </div>
          </div>
        </div>

        {/* ── RIGHT: text content ───────────────────────────────────────── */}
        <div className={styles.textCol}>
          <div className={styles.headingBlock}>
            <div ref={eyebrowRef} className={styles.eyebrow}>
              <span className={styles.eyebrowDot} />
              <span className={styles.eyebrowText}>Why work with me</span>
            </div>
            <h2 ref={titleRef} className={styles.title}>
              Digital Product<br />Builder
            </h2>
            <p ref={leadRef} className={styles.lead}>
              Building digital products since 2015. I turn complex ideas into
              fast, tactile, and interactive experiences that feel inevitable.
            </p>
          </div>

          <div ref={cardGridRef} className={styles.cardGrid}>
            <div className={styles.glassCard}>
              <div className={styles.cardHeader}>
                <span className={styles.cardLabel}>01 // Background</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.cardIcon} aria-hidden="true">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                  <line x1="12" y1="22.08" x2="12" y2="12" />
                </svg>
              </div>
              <p className={styles.cardBody}>
                Most of my career was spent in advertising agencies, delivering
                pixel-perfect quality under tight deadlines for global brands.
              </p>
              <div className={styles.pills}>
                <span className={styles.pill}>Ferrero Rocher</span>
                <span className={styles.pill}>BNP Paribas</span>
                <span className={styles.pill}>Mercedes-Benz</span>
              </div>
            </div>

            <div className={styles.glassCard}>
              <div className={styles.cardHeader}>
                <span className={styles.cardLabel}>02 // Stack</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.cardIcon} aria-hidden="true">
                  <polygon points="12 2 2 7 12 12 22 7 12 2" />
                  <polyline points="2 17 12 22 22 17" />
                  <polyline points="2 12 12 17 22 12" />
                </svg>
              </div>
              <p className={styles.cardBody}>
                Specialized in modern frontend development — React and Tailwind
                CSS — with a strong focus on clean architecture, scalability,
                and user experience.
              </p>
              <div className={styles.progressWrap}>
                <div className={styles.progressBar}>
                  <div className={styles.progressFill} />
                </div>
                <div className={styles.progressLabels}>
                  <span>Frontend Mastery</span>
                  <span>100%</span>
                </div>
              </div>
            </div>
          </div>

          <div ref={aiCardRef} className={styles.aiCard}>
            <div className={styles.aiCardGlow} aria-hidden="true" />
            <div className={styles.aiCardInner}>
              <div className={styles.aiIcon}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </div>
              <div>
                <h3 className={styles.aiCardTitle}>AI-Accelerated Workflow</h3>
                <p className={styles.aiCardBody}>
                  By combining my coding expertise with advanced AI tools, I
                  deliver complete digital products — including design, copy,
                  and visuals — faster and more efficiently than traditional
                  workflows.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
