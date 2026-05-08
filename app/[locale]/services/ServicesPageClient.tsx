"use client";

import {useLocale} from "next-intl";
import Link from "next/link";
import {useSearchParams} from "next/navigation";
import {Suspense, useEffect, useState} from "react";
import {SiteNav} from "../../_components/site-nav/SiteNav";
import styles from "../../services/ServicesPage.module.css";

/* ── Service data ─────────────────────────────────────────────────────────── */
const SERVICES = [
  {
    id: "websites",
    index: "01",
    tabLabel: "Web Design",
    title: "Websites",
    lensGradient: "radial-gradient(circle at 30% 30%, #4D6CFF, #9D50FF)",
    description:
      "Fast, custom-built sites designed to turn visitors into clients. Clean design, strong messaging, and performance baked in — every pixel intentional, every interaction smooth.",
    stack: ["Next.js", "Tailwind", "Figma", "Framer", "GSAP", "Vercel"],
    phases: [
      {
        num: "01",
        label: "Phase 01",
        title: "Discovery & Strategy",
        body: "Defining your goals, audience, and competitive landscape. We map the sitemap, content hierarchy, and conversion paths before touching a pixel.",
      },
      {
        num: "02",
        label: "Phase 02",
        title: "Visual Design",
        body: "High-fidelity Figma mockups with a full component library. Every screen is designed before any code is written.",
      },
      {
        num: "03",
        label: "Phase 03",
        title: "Development",
        body: "Pixel-perfect Next.js build with smooth animations, SEO-ready markup, and Lighthouse scores above 95 across the board.",
      },
      {
        num: "04",
        label: "Phase 04",
        title: "Launch & Handover",
        body: "Deployed to a production CDN, CMS configured, and the full Figma file handed over. You own everything.",
      },
    ],
    deliverables: [
      {
        title: "Live Website",
        desc: "Deployed to your domain with CI/CD pipeline and automatic preview URLs.",
        icon: (
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="2" y1="12" x2="22" y2="12" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          </svg>
        ),
      },
      {
        title: "CMS Integration",
        desc: "Edit your content without touching code — blog, case studies, team pages, all manageable.",
        icon: (
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
          </svg>
        ),
      },
      {
        title: "Figma Source Files",
        desc: "The complete design system with components, styles, and interactive prototypes.",
        icon: (
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
        ),
      },
      {
        title: "Performance Report",
        desc: "Lighthouse audit, Core Web Vitals baseline, and a list of ongoing optimisation recommendations.",
        icon: (
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
          </svg>
        ),
      },
    ],
  },
  {
    id: "apps",
    index: "02",
    tabLabel: "App Dev",
    title: "Apps",
    lensGradient: "radial-gradient(circle at 30% 30%, #FF6B8B, #9D50FF)",
    description:
      "Complex problems require simple solutions. I design and build full-stack web applications that are as powerful as they are intuitive. From initial discovery to final deployment, I handle the entire product lifecycle.",
    stack: ["Next.js", "TypeScript", "Supabase", "Tailwind", "Node.js", "Figma"],
    phases: [
      {
        num: "01",
        label: "Phase 01",
        title: "Discovery & Logic",
        body: "Mapping out user flows, data architecture, and technical requirements. We define the 'why' before the 'how'.",
      },
      {
        num: "02",
        label: "Phase 02",
        title: "Interface Systems",
        body: "Designing a scalable UI kit and high-fidelity prototypes. Clean, accessible, and brand-aligned interfaces.",
      },
      {
        num: "03",
        label: "Phase 03",
        title: "Production Build",
        body: "Writing clean, performant code. Building the frontend, setting up the backend, and integrating APIs.",
      },
      {
        num: "04",
        label: "Phase 04",
        title: "QA & Handover",
        body: "Rigorous testing across devices, speed optimisation, and deployment to a production-ready environment.",
      },
    ],
    deliverables: [
      {
        title: "Full Codebase",
        desc: "A clean, maintainable repo with modular architecture and clear docs.",
        icon: (
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M16 18l6-6-6-6" />
            <path d="M8 6l-6 6 6 6" />
          </svg>
        ),
      },
      {
        title: "Admin Panels",
        desc: "Internal dashboards to manage content, users, and workflows without engineering support.",
        icon: (
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M3 3h18v18H3z" />
            <path d="M7 7h10v10H7z" />
          </svg>
        ),
      },
      {
        title: "Auth & Security",
        desc: "Secure authentication flows and role-based access control.",
        icon: (
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        ),
      },
      {
        title: "Handover Pack",
        desc: "Docs, walkthrough, and deployment checklist so your team can scale fast.",
        icon: (
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
        ),
      },
    ],
  },
  {
    id: "automations",
    index: "03",
    tabLabel: "Automation",
    title: "Automations",
    lensGradient: "radial-gradient(circle at 30% 30%, #E8F0FF, #FF6B8B)",
    description:
      "Automations that connect your tools and eliminate repetitive tasks. From onboarding sequences to internal operations — systems that save hours and reduce mistakes.",
    stack: ["Make", "Zapier", "n8n", "Notion", "Airtable", "Slack"],
    phases: [
      {
        num: "01",
        label: "Phase 01",
        title: "Process Audit",
        body: "Identify bottlenecks and repetitive tasks. Map the workflow end-to-end.",
      },
      {
        num: "02",
        label: "Phase 02",
        title: "Flow Architecture",
        body: "Design automation flows with logging, error handling, and scalability in mind.",
      },
      {
        num: "03",
        label: "Phase 03",
        title: "Build & Test",
        body: "Build the automation and test it in real conditions until it's reliable.",
      },
      {
        num: "04",
        label: "Phase 04",
        title: "Handover & Monitor",
        body: "Documentation + training, plus monitoring so failures never go unseen.",
      },
    ],
    deliverables: [
      {
        title: "Live Workflows",
        desc: "Automations deployed and active, saving time immediately.",
        icon: (
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M12 2v20" />
            <path d="M2 12h20" />
          </svg>
        ),
      },
      {
        title: "Documentation",
        desc: "Clear guides for maintaining and expanding your automations over time.",
        icon: (
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5V4.5A2.5 2.5 0 0 1 6.5 2z" />
          </svg>
        ),
      },
      {
        title: "Error Monitoring",
        desc: "Alerts + dashboards so you know instantly if something breaks.",
        icon: (
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M12 9v4" />
            <path d="M12 17h.01" />
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          </svg>
        ),
      },
      {
        title: "Training Session",
        desc: "A walkthrough so you can confidently manage everything yourself.",
        icon: (
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 6v6l4 2" />
          </svg>
        ),
      },
    ],
  },
] as const;

/* ── Inner component (uses useSearchParams — must be inside Suspense) ─────── */
function ServicesContent() {
  const locale = useLocale();
  const prefix = `/${locale}`;
  const searchParams = useSearchParams();
  const [activeIndex, setActiveIndex] = useState(0);
  const [animKey, setAnimKey] = useState(0);

  /* sync active tab with ?tab= URL param on mount */
  useEffect(() => {
    const tab = searchParams.get("tab");
    if (!tab) return;
    const idx = SERVICES.findIndex((s) => s.id === tab);
    if (idx >= 0) {
      setActiveIndex(idx);
      setAnimKey((k) => k + 1);
    }
  }, [searchParams]);

  const service = SERVICES[activeIndex];

  function selectTab(i: number) {
    if (i === activeIndex) return;
    setActiveIndex(i);
    setAnimKey((k) => k + 1);
  }

  return (
    <div className={styles.page}>
      <SiteNav />

      {/* ambient background */}
      <div className={styles.ambientBg}>
        <div className={`${styles.glowShape} ${styles.glow1}`} />
        <div className={`${styles.glowShape} ${styles.glow2}`} />
        <div className={`${styles.glowShape} ${styles.glow3}`} />
        <div className={`${styles.glowShape} ${styles.glow4}`} />
      </div>

      {/* Mobile: same ambient stack as /work (orbs + grid, no spin ring) */}
      <div className={styles.workAmbientMobile} aria-hidden>
        <div className={styles.workOrb1} />
        <div className={styles.workOrb2} />
        <div className={styles.workGrid} />
      </div>

      <div className={styles.noiseOverlay} />

      {/* main glass card */}
      <div className={styles.card}>
        {/* ── Left accordion tabs ─────────────────────────────────────── */}
        <div className={styles.tabsRail}>
          {SERVICES.map((s, i) => (
            <button
              key={s.id}
              type="button"
              className={`${styles.stepPanel} ${
                i === activeIndex ? styles.active : ""
              }`}
              onClick={() => selectTab(i)}
              aria-selected={i === activeIndex}
            >
              <span className={styles.stepNum}>{s.index}</span>
              <span className={styles.stepLabel}>{s.tabLabel}</span>
              <span className={styles.stepNum}>/</span>
            </button>
          ))}
        </div>

        {/* ── Middle info panel ───────────────────────────────────────── */}
        <div className={styles.infoPanel}>
          <div
            key={`tag-${animKey}`}
            className={`${styles.serviceTag} ${styles.contentEnter}`}
          >
            <div className={styles.tagLens}>
              <div
                className={styles.tagLensCore}
                style={{ background: service.lensGradient }}
              />
              <div className={styles.tagLensNoise} aria-hidden="true" />
            </div>
            <span className={styles.tagText}>Service: {service.index}</span>
          </div>

          <h1
            key={`title-${animKey}`}
            className={`${styles.serviceTitle} ${styles.contentEnter}`}
          >
            {service.title}
            <span className={styles.serviceTitleGhost} aria-hidden="true">
              {service.index}
            </span>
          </h1>

          <p
            key={`desc-${animKey}`}
            className={`${styles.serviceDesc} ${styles.contentEnter}`}
          >
            {service.description}
          </p>

          <div key={`stack-${animKey}`} className={styles.contentEnter}>
            <h3 className={styles.stackLabel}>
              Tech Stack
              <span className={styles.stackLabelLine} />
            </h3>
            <div className={styles.stackPills}>
              {service.stack.map((pill) => (
                <span key={pill} className={styles.stackPill}>
                  {pill}
                </span>
              ))}
            </div>
          </div>

          <a
            href={`${prefix}#contact`}
            className={`${styles.startBtn} ${styles.startBtnPanel}`}
          >
            Start Project
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
          </a>
        </div>

        {/* ── Right detail panel ─────────────────────────────────────── */}
        <div className={styles.detailPanel}>
          {/* process phases */}
          <section style={{ marginBottom: "3.5rem" }}>
            <div key={`phase-heading-${animKey}`} className={styles.contentEnter}>
              <p className={styles.sectionHeading}>The Build Process</p>
            </div>
            <div className={styles.phaseGrid}>
              {service.phases.map((phase) => (
                <div
                  key={`${service.id}-${phase.num}-${animKey}`}
                  className={`${styles.phaseCard} ${styles.contentEnter}`}
                >
                  <div className={styles.phaseNum} aria-hidden="true">
                    {phase.num}
                  </div>
                  <p className={styles.phaseLabel}>{phase.label}</p>
                  <h4 className={styles.phaseTitle}>{phase.title}</h4>
                  <p className={styles.phaseBody}>{phase.body}</p>
                </div>
              ))}
            </div>
          </section>

          {/* deliverables */}
          <section>
            <div key={`deliv-heading-${animKey}`} className={styles.contentEnter}>
              <p className={styles.sectionHeading}>Deliverables</p>
            </div>
            <div className={styles.deliverablesList}>
              {service.deliverables.map((d) => (
                <div
                  key={`${service.id}-${d.title}-${animKey}`}
                  className={`${styles.deliverableItem} ${styles.contentEnter}`}
                >
                  <div className={styles.deliverableIcon}>{d.icon}</div>
                  <div>
                    <p className={styles.deliverableTitle}>{d.title}</p>
                    <p className={styles.deliverableDesc}>{d.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* Mobile: outside .card so position:fixed isn’t trapped by backdrop-filter; desktop hidden */}
      <a
        href={`${prefix}#contact`}
        className={`${styles.startBtn} ${styles.startBtnDock}`}
      >
        Start Project
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
      </a>
    </div>
  );
}

export function ServicesPageClient() {
  return (
    <Suspense fallback={null}>
      <ServicesContent />
    </Suspense>
  );
}

