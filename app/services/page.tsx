"use client";

import Link from "next/link";
import { useState } from "react";
import styles from "./ServicesPage.module.css";

/* ── Service data ─────────────────────────────────────────────────────────── */
const SERVICES = [
  {
    id: "websites",
    index: "01",
    tabLabel: "Web Design",
    title: "Websites",
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
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
          </svg>
        ),
      },
      {
        title: "Figma Source Files",
        desc: "The complete design system with components, styles, and interactive prototypes.",
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
          </svg>
        ),
      },
      {
        title: "Performance Report",
        desc: "Lighthouse audit, Core Web Vitals baseline, and a list of ongoing optimisation recommendations.",
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
        desc: "Complete Git repository with documented code and local dev environment setup.",
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
          </svg>
        ),
      },
      {
        title: "Admin Panels",
        desc: "Custom dashboards to manage your data, users, and content effortlessly.",
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <line x1="3" y1="9" x2="21" y2="9" /><line x1="9" y1="21" x2="9" y2="9" />
          </svg>
        ),
      },
      {
        title: "Security Pack",
        desc: "Authentication flows, row-level security, and data encryption by default.",
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        ),
      },
      {
        title: "Figma Files",
        desc: "The source design files including components and interactive prototypes.",
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
          </svg>
        ),
      },
    ],
  },
  {
    id: "automations",
    index: "03",
    tabLabel: "Automations",
    title: "Automations",
    description:
      "Custom workflows that connect your tools and eliminate repetitive tasks — saving hours and reducing errors so you can focus on what actually matters. AI-powered where it counts.",
    stack: ["n8n", "Make", "Zapier", "Python", "OpenAI", "APIs"],
    phases: [
      {
        num: "01",
        label: "Phase 01",
        title: "Process Audit",
        body: "Mapping every manual step in your current workflow. Identifying bottlenecks, repetition, and high-value automation targets.",
      },
      {
        num: "02",
        label: "Phase 02",
        title: "Flow Architecture",
        body: "Designing the logic graph: triggers, conditions, error handling, and fallbacks. Every edge case planned before building.",
      },
      {
        num: "03",
        label: "Phase 03",
        title: "Build & Test",
        body: "Wiring up the automation with real data. Stress-tested across edge cases and connected to your live tools.",
      },
      {
        num: "04",
        label: "Phase 04",
        title: "Handover & Monitor",
        body: "A full walkthrough of everything built. Monitoring alerts configured so you know immediately if anything breaks.",
      },
    ],
    deliverables: [
      {
        title: "Live Workflows",
        desc: "All automations active in your environment and connected to your existing tool stack.",
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
          </svg>
        ),
      },
      {
        title: "Documentation",
        desc: "Step-by-step documentation of every workflow so your team can maintain and extend them.",
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
          </svg>
        ),
      },
      {
        title: "Error Monitoring",
        desc: "Alerting configured so failures are caught instantly — never lose a lead to a broken zap again.",
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 17H2a3 3 0 0 0 3-3V9a7 7 0 0 1 14 0v5a3 3 0 0 0 3 3zm-8.27 4a2 2 0 0 1-3.46 0" />
          </svg>
        ),
      },
      {
        title: "Training Session",
        desc: "A recorded walkthrough so your team understands exactly how to manage and scale each flow.",
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
          </svg>
        ),
      },
    ],
  },
] as const;

/* ── Page component ───────────────────────────────────────────────────────── */
export default function ServicesPage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [animKey, setAnimKey] = useState(0);

  const service = SERVICES[activeIndex];

  function selectTab(i: number) {
    if (i === activeIndex) return;
    setActiveIndex(i);
    setAnimKey((k) => k + 1);
  }

  return (
    <div className={styles.page}>
      {/* ambient background */}
      <div className={styles.ambientBg}>
        <div className={`${styles.glowShape} ${styles.glow1}`} />
        <div className={`${styles.glowShape} ${styles.glow2}`} />
        <div className={`${styles.glowShape} ${styles.glow3}`} />
      </div>
      <div className={styles.noiseOverlay} />

      {/* main glass card */}
      <div className={styles.card}>
        {/* close → back to home */}
        <Link href="/" className={styles.closeBtn} aria-label="Back to home">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </Link>

        {/* ── Left accordion tabs ─────────────────────────────────────────── */}
        <div className={styles.tabsRail}>
          {SERVICES.map((s, i) => (
            <button
              key={s.id}
              type="button"
              className={`${styles.stepPanel} ${i === activeIndex ? styles.active : ""}`}
              onClick={() => selectTab(i)}
              aria-selected={i === activeIndex}
            >
              <span className={styles.stepNum}>{s.index}</span>
              <span className={styles.stepLabel}>{s.tabLabel}</span>
              <span className={styles.stepNum}>/</span>
            </button>
          ))}
        </div>

        {/* ── Middle info panel ────────────────────────────────────────────── */}
        <div className={styles.infoPanel}>
          <div key={`tag-${animKey}`} className={`${styles.serviceTag} ${styles.contentEnter}`}>
            <span className={styles.tagDot} />
            <span className={styles.tagText}>Service: {service.index}</span>
          </div>

          <h1 key={`title-${animKey}`} className={`${styles.serviceTitle} ${styles.contentEnter}`}>
            {service.title}
            <span className={styles.serviceTitleGhost} aria-hidden="true">
              {service.index}
            </span>
          </h1>

          <p key={`desc-${animKey}`} className={`${styles.serviceDesc} ${styles.contentEnter}`}>
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

          <Link href="/" className={styles.startBtn}>
            <span>Start Project</span>
            <span className={styles.startBtnArrow}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </span>
          </Link>
        </div>

        {/* ── Right detail panel ───────────────────────────────────────────── */}
        <div className={styles.detailPanel}>
          {/* process phases */}
          <section style={{ marginBottom: "3.5rem" }}>
            <div key={`phase-heading-${animKey}`} className={styles.contentEnter}>
              <p className={styles.sectionHeading}>The Build Process</p>
            </div>
            <div className={styles.phaseGrid}>
              {service.phases.map((phase) => (
                <div key={`${service.id}-${phase.num}-${animKey}`} className={`${styles.phaseCard} ${styles.contentEnter}`}>
                  <div className={styles.phaseNum} aria-hidden="true">{phase.num}</div>
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
                <div key={`${service.id}-${d.title}-${animKey}`} className={`${styles.deliverableItem} ${styles.contentEnter}`}>
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
    </div>
  );
}
