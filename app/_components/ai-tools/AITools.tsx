"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import styles from "./AITools.module.css";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Gsap = any;

/* ── Step list data (left column) ─────────────────────────────────────────── */
const STEP_TOOLS = [
  {
    id: "development",
    index: "01",
    title: "Smarter development",
    body: "Faster, more precise coding with modern AI-assisted workflows.",
    logo: "/assets/logos/cursor-logo.png",
    logoAlt: "Cursor",
    toolName: "Cursor",
    secondaryLogo: undefined as string | undefined,
    secondaryLogoAlt: undefined as string | undefined,
  },
  {
    id: "design",
    index: "02",
    title: "Scalable design",
    body: "Rapid design exploration and iteration without slowing down the process.",
    logo: "/assets/logos/variant-logo.png",
    logoAlt: "Variant",
    toolName: "Variant",
    secondaryLogo: undefined as string | undefined,
    secondaryLogoAlt: undefined as string | undefined,
  },
  {
    id: "visuals",
    index: "03",
    title: "Visual content",
    body: "Custom graphics and visuals created quickly to match your product.",
    logo: "/assets/logos/canva-logo.png",
    logoAlt: "Canva",
    toolName: "Nano Banana / Canva",
    secondaryLogo: "/assets/logos/higgsfield_ai-logo.png",
    secondaryLogoAlt: "Higgsfield AI",
  },
  {
    id: "copy",
    index: "04",
    title: "Copy & strategy",
    body: "Clear messaging, structure, and content aligned with your goals.",
    logo: "/assets/logos/gpt-logo.png",
    logoAlt: "ChatGPT",
    toolName: "ChatGPT / Claude",
    secondaryLogo: "/assets/logos/claude-logo.png",
    secondaryLogoAlt: "Claude",
  },
];

/*
 *  All 6 logos on the orbit ring.
 *  angle: degrees clockwise from top (0° = 12 o'clock).
 *  Positions are deliberately irregular so they don't look mechanical.
 *
 *  Angle → CSS top/left formula:
 *    x = 50 + 44 · sin(θ)   (% of orbitFocal width)
 *    y = 50 − 44 · cos(θ)   (% of orbitFocal height)
 */
const ORBIT_LOGOS = [
  { id: "cursor",     logo: "/assets/logos/cursor-logo.png",        alt: "Cursor",       angle: 0   },
  { id: "variant",    logo: "/assets/logos/variant-logo.png",       alt: "Variant",      angle: 68  },
  { id: "canva",      logo: "/assets/logos/canva-logo.png",         alt: "Canva",        angle: 135 },
  { id: "higgsfield", logo: "/assets/logos/higgsfield_ai-logo.png", alt: "Higgsfield AI",angle: 195 },
  { id: "gpt",        logo: "/assets/logos/gpt-logo.png",           alt: "ChatGPT",      angle: 260 },
  { id: "claude",     logo: "/assets/logos/claude-logo.png",        alt: "Claude",       angle: 320 },
];

function orbitPosition(angle: number) {
  const r = (angle * Math.PI) / 180;
  return {
    left: `${50 + 44 * Math.sin(r)}%`,
    top:  `${50 - 44 * Math.cos(r)}%`,
  };
}

export function AITools() {
  const sectionRef  = useRef<HTMLElement>(null);
  const leftColRef  = useRef<HTMLDivElement>(null);
  const headingRef  = useRef<HTMLHeadingElement>(null);
  const orbitRef    = useRef<HTMLDivElement>(null);
  const stepRefs    = useRef<(HTMLDivElement | null)[]>([null, null, null, null]);
  const logoRefs    = useRef<(HTMLDivElement | null)[]>([null, null, null, null, null, null]);
  const centerRef   = useRef<HTMLDivElement>(null);

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

      const section = sectionRef.current;
      if (!section) return;

      const scroller = document.getElementById("scroll-root") ?? undefined;

      gsapCtx = gsap.context(() => {
        const heading = headingRef.current;
        const orbit   = orbitRef.current;
        const center  = centerRef.current;
        const steps   = stepRefs.current.filter(Boolean);
        const logos   = logoRefs.current.filter(Boolean);

        const headingLines = heading
          ? Array.from(heading.querySelectorAll<HTMLElement>(`.${styles.headingLine}`))
          : [];

        const tagsEl    = leftColRef.current?.querySelector(`.${styles.tags}`);
        const subheadEl = leftColRef.current?.querySelector(`.${styles.subheading}`);

        /* initial states — heading: word-split stagger (hero-style) */
        if (heading) {
          headingLines.forEach((line) => {
            const words = (line.textContent || "").trim().split(/\s+/);
            line.innerHTML = words
              .map((w) => `<span style="display:inline-block">${w}</span>`)
              .join(" ");
          });
        }
        const wordEls = heading
          ? Array.from(heading.querySelectorAll<HTMLElement>("span[style]"))
          : [];
        if (wordEls.length) gsap.set(wordEls, { y: 60, opacity: 0, rotation: -6 });
        if (tagsEl)    gsap.set(tagsEl,    { y: 20, opacity: 0 });
        if (subheadEl) gsap.set(subheadEl, { y: 20, opacity: 0 });
        if (orbit)     gsap.set(orbit,     { scale: 0.65, opacity: 0 });
        if (center)    gsap.set(center,    { opacity: 0, scale: 0.5 });
        logos.forEach((l) => gsap.set(l, { opacity: 0 }));
        steps.forEach((s) => gsap.set(s, { x: -22, opacity: 0 }));

        /* scroll-triggered timeline */
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            scroller,
            start: "top 72%",
            once: true,
          },
        });

        tl.to(tagsEl, { y: 0, opacity: 1, duration: 0.5, ease: "power3.out" }, 0);

        tl.to(wordEls, {
          y: 0, opacity: 1, rotation: 0,
          duration: 0.65, ease: "power3.out", stagger: 0.08,
        }, 0.1);

        tl.to(subheadEl, { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" }, 0.4);

        tl.to(orbit, { scale: 1, opacity: 1, duration: 1.3, ease: "back.out(1.4)" }, 0.15);

        tl.to(logos, {
          opacity: 1, duration: 0.55, ease: "power2.out", stagger: 0.12,
        }, 0.85);

        tl.to(center, { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.8)" }, 1.1);

        tl.to(steps, {
          x: 0, opacity: 1, duration: 0.5, ease: "power2.out", stagger: 0.1,
        }, 0.65);

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
    <section ref={sectionRef} className={styles.section}>
      <div className={styles.pinWrap}>

        {/* ── LEFT column ────────────────────────────────────────────────────── */}
        <div ref={leftColRef} className={styles.leftCol}>

          <div className={styles.tags}>
            <span className={styles.tag}>AI: Enhanced</span>
            <span className={styles.tag}>Stack: Powered</span>
          </div>

          {/* no <br /> between spans — display:block handles the line break */}
          <h2 ref={headingRef} className={styles.heading}>
            <span className={styles.headingLine}>Faster execution</span>
            <span className={styles.headingLine}>Better&nbsp;results</span>
          </h2>

          <p className={styles.subheading}>
            I combine development with advanced AI tools to deliver complete
            solutions — from code and design to copy and visuals. Faster
            execution, more iterations, and better results without the usual
            delays.
          </p>

          <div className={styles.stepList}>
            {STEP_TOOLS.map((tool, i) => (
              <div
                key={tool.id}
                ref={(el) => { stepRefs.current[i] = el; }}
                className={styles.step}
              >
                <div className={styles.stepRow}>
                  <span className={styles.stepIndex}>{tool.index}</span>
                  <h3 className={styles.stepTitle}>{tool.title}</h3>
                  <div className={styles.toolChip}>
                    <Image src={tool.logo} alt={tool.logoAlt} width={14} height={14} className={styles.chipLogo} />
                    {tool.secondaryLogo && (
                      <Image src={tool.secondaryLogo} alt={tool.secondaryLogoAlt ?? ""} width={14} height={14} className={styles.chipLogo} />
                    )}
                    <span className={styles.chipLabel}>{tool.toolName}</span>
                  </div>
                </div>
                <p className={styles.stepBody}>{tool.body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT column: orbital diagram ──────────────────────────────────── */}
        <div className={styles.rightCol}>
          <div ref={orbitRef} className={styles.orbitFocal}>

            {/* rotating rings + ellipses */}
            <svg className={styles.orbitSvg} viewBox="0 0 100 100">
              <defs>
                <linearGradient id="aiRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%"   stopColor="rgba(0,0,0,0.15)" />
                  <stop offset="50%"  stopColor="rgba(0,0,0,0.02)" />
                  <stop offset="100%" stopColor="rgba(0,0,0,0.10)" />
                </linearGradient>
              </defs>
              <circle cx="50" cy="50" r="44" fill="none" stroke="url(#aiRingGrad)"    strokeWidth="0.15" />
              <circle cx="50" cy="50" r="34" fill="none" stroke="rgba(0,0,0,0.06)"     strokeWidth="0.2"  strokeDasharray="0.5 1.4" />
              <circle cx="50" cy="50" r="22" fill="none" stroke="rgba(0,0,0,0.04)"     strokeWidth="0.15" />
              <circle cx="50" cy="50" r="10" fill="none" stroke="rgba(0,0,0,0.08)"     strokeWidth="0.15" strokeDasharray="0.2 0.6" />
              <ellipse cx="50" cy="50" rx="44" ry="14" fill="none" stroke="rgba(0,0,0,0.05)" strokeWidth="0.2" transform="rotate(45 50 50)" />
              <ellipse cx="50" cy="50" rx="44" ry="14" fill="none" stroke="rgba(0,0,0,0.05)" strokeWidth="0.2" transform="rotate(135 50 50)" />
              <line x1="2"  y1="50" x2="98" y2="50" stroke="rgba(0,0,0,0.03)" strokeWidth="0.2" />
              <line x1="50" y1="2"  x2="50" y2="98" stroke="rgba(0,0,0,0.03)" strokeWidth="0.2" />
            </svg>

            {/* counter-rotating text ring */}
            <svg className={styles.orbitTextSvg} viewBox="0 0 100 100">
              <path
                d="M 50,50 m -40,0 a 40,40 0 1,1 80,0 a 40,40 0 1,1 -80,0"
                id="aiToolsTextPath"
                fill="none"
              />
              <text fontSize="1.65" fontFamily="var(--font-jetbrains-mono)" letterSpacing="1.1" opacity="0.22">
                <textPath href="#aiToolsTextPath">
                  {"AI-POWERED • CODE • DESIGN • COPY • VISUALS • SMARTER WORKFLOWS • "}
                </textPath>
              </text>
            </svg>

            {/*
             *  Logo ring — co-rotates with orbitSvg (CW 120s).
             *  All 6 logos placed at irregular angles on the r=44 ring.
             *  Each logoImgWrap counter-rotates to keep icons upright.
             */}
            <div className={styles.orbitLogosRing}>
              {ORBIT_LOGOS.map((logo, i) => (
                <div
                  key={logo.id}
                  ref={(el) => { logoRefs.current[i] = el; }}
                  className={styles.logoNode}
                  style={orbitPosition(logo.angle)}
                >
                  <div className={styles.logoImgWrap}>
                    <Image
                      src={logo.logo}
                      alt={logo.alt}
                      width={42}
                      height={42}
                      className={styles.logoImg}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* center label */}
            <div ref={centerRef} className={styles.centerText}>
              <span className={styles.centerAi}>AI</span>
              <span className={styles.centerTools}>tools</span>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
