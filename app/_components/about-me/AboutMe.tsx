"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import styles from "./AboutMe.module.css";

export function AboutMe() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const revealEls = Array.from(
      section.querySelectorAll(`.${styles.reveal}`)
    ) as HTMLElement[];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).classList.add(styles.visible);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        root: document.getElementById("scroll-root"),
        threshold: 0.1,
        rootMargin: "0px 0px -60px 0px",
      }
    );

    revealEls.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className={styles.about}>
      <div className={styles.blobs} aria-hidden="true">
        <div className={`${styles.blob} ${styles.blob1}`} />
        <div className={`${styles.blob} ${styles.blob2}`} />
        <div className={`${styles.blob} ${styles.blob3}`} />
      </div>

      <div className={styles.inner}>
        {/* ── LEFT: text content ────────────────────────────────────────── */}
        <div className={styles.left}>
          {/* eyebrow + heading */}
          <div className={`${styles.headingBlock} ${styles.reveal}`}>
            <div className={styles.eyebrow}>
              <span className={styles.eyebrowDot} />
              <span className={styles.eyebrowText}>Why work with me</span>
            </div>
            <h1 className={styles.title}>
              Digital Product<br />Builder.
            </h1>
            <p className={styles.lead}>
              Building digital products since 2015. I turn complex ideas into
              fast, tactile, and interactive experiences that feel inevitable.
            </p>
          </div>

          {/* two glass cards */}
          <div className={styles.cardGrid}>
            <div className={`${styles.glassCard} ${styles.cardDelay1} ${styles.reveal}`}>
              <div className={styles.cardHeader}>
                <span className={styles.cardLabel}>01 // Background</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.iconBlue} aria-hidden="true">
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

            <div className={`${styles.glassCard} ${styles.cardDelay2} ${styles.reveal}`}>
              <div className={styles.cardHeader}>
                <span className={styles.cardLabel}>02 // Stack</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.iconPink} aria-hidden="true">
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

          {/* AI workflow card */}
          <div className={`${styles.aiCard} ${styles.cardDelay3} ${styles.reveal}`}>
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

          {/* result callout */}
          <blockquote className={`${styles.callout} ${styles.cardDelay4} ${styles.reveal}`}>
            <p>
              &ldquo;You don&rsquo;t just get code — you get a fully realized
              product, ready to launch and perform.&rdquo;
            </p>
          </blockquote>
        </div>

        {/* ── RIGHT: portrait ───────────────────────────────────────────── */}
        <div className={`${styles.right} ${styles.reveal}`}>
          {/* spinning ring decoration */}
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

          {/* portrait */}
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
            <div className={styles.glassLens} aria-hidden="true" />
          </div>

          {/* floating "Building..." capsule */}
          <div className={styles.buildingCapsule} aria-hidden="true">
            <div className={styles.refOrb} />
            <span className={styles.buildingText}>Building...</span>
          </div>

          {/* status badge */}
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
      </div>
    </section>
  );
}
