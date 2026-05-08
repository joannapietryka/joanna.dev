"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { SiteNav } from "../../_components/site-nav/SiteNav";
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
            <path d="M4 4h16v16H4z" />
            <path d="M4 9h16" />
            <path d="M9 9v11" />
          </svg>
        ),
      },
      {
        title: "Figma Source Files",
        desc: "Every component, token, and layout delivered in a clean, reusable Figma system.",
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
        title: "Performance Report",
        desc: "Speed, accessibility, SEO — audited and delivered with actionable insights.",
        icon: (
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M3 3v18h18" />
            <path d="M7 14l3-3 4 4 6-6" />
          </svg>
        ),
      },
    ],
  },
  {
    id: "apps",
    index: "02",
    tabLabel: "Web Apps",
    title: "Apps",
    lensGradient: "radial-gradient(circle at 30% 30%, #FF4D88, #FFB84D)",
    description:
      "Full-stack web apps built for clarity and speed. From dashboards to internal tools — designed, engineered, and shipped with clean UX and reliable code.",
    stack: ["Next.js", "TypeScript", "Postgres", "Supabase", "Stripe", "Vercel"],
    phases: [
      {
        num: "01",
        label: "Phase 01",
        title: "Discovery & Logic",
        body: "We map the user journey, data model, and core flows — then define the cleanest path to an MVP.",
      },
      {
        num: "02",
        label: "Phase 02",
        title: "Interface Systems",
        body: "Component-based UI design in Figma with a scalable system for future iterations.",
      },
      {
        num: "03",
        label: "Phase 03",
        title: "Production Build",
        body: "A robust Next.js codebase built with performance, scalability, and developer experience in mind.",
      },
      {
        num: "04",
        label: "Phase 04",
        title: "QA & Handover",
        body: "Full testing, deployment setup, and documentation. You get the full repo and everything needed to scale.",
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
        desc: "CMS-like interfaces to manage content, users, and workflows without engineering support.",
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
        title: "Security Pack",
        desc: "Auth, permissions, and best-practice hardening baked into the build.",
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
        title: "Figma Files",
        desc: "Design source files with tokens, components, and responsive layouts for every screen.",
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
            <path d="M12 2v20" />
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
    lensGradient: "radial-gradient(circle at 30% 30%, #4DFFB5, #4DD2FF)",
    description:
      "Automate the repetitive stuff. From email flows to internal ops — systems that save hours, reduce mistakes, and keep your business running clean.",
    stack: ["Make", "Zapier", "n8n", "Notion", "Airtable", "Slack"],
    phases: [
      {
        num: "01",
        label: "Phase 01",
        title: "Process Audit",
        body: "We identify bottlenecks and repetitive tasks, then map your workflow end-to-end.",
      },
      {
        num: "02",
        label: "Phase 02",
        title: "Flow Architecture",
        body: "We design automations with error handling, logging, and scalable structure — not fragile hacks.",
      },
      {
        num: "03",
        label: "Phase 03",
        title: "Build & Test",
        body: "Automations are built, tested, and iterated in real conditions until they're rock solid.",
      },
      {
        num: "04",
        label: "Phase 04",
        title: "Handover & Monitor",
        body: "You get full documentation + training. We also set up monitoring so failures never go unseen.",
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
        desc: "Walkthrough training so you can confidently manage everything yourself.",
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
];

function ServicesContent() {
  const searchParams = useSearchParams();
  const initial = searchParams.get("service") || "websites";
  const [activeId, setActiveId] = useState(initial);
  const active = SERVICES.find((s) => s.id === activeId) || SERVICES[0];

  useEffect(() => {
    setActiveId(initial);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initial]);

  return (
    <div className={styles.page}>
      <SiteNav />
      <main className={styles.main}>
        <div className={styles.hero}>
          <div className={styles.eyebrow}>
            <div className={styles.eyebrowLine} />
            <span className={styles.eyebrowText}>Services</span>
          </div>

          <h1 className={styles.title}>What I build</h1>
          <p className={styles.lead}>
            One person. Full-stack. Designed and shipped fast — with strategy,
            clarity, and polish.
          </p>
        </div>

        <div className={styles.tabsRow}>
          <div className={styles.tabs}>
            {SERVICES.map((s) => (
              <button
                key={s.id}
                className={`${styles.tab} ${
                  activeId === s.id ? styles.tabActive : ""
                }`}
                onClick={() => setActiveId(s.id)}
              >
                <span className={styles.tabIdx}>{s.index}</span>
                <span className={styles.tabLabel}>{s.tabLabel}</span>
              </button>
            ))}
          </div>
        </div>

        <section className={styles.panel}>
          <div className={styles.panelTop}>
            <div
              className={styles.panelLens}
              style={{ background: active.lensGradient }}
            />
            <div className={styles.panelInfo}>
              <h2 className={styles.panelTitle}>{active.title}</h2>
              <p className={styles.panelDesc}>{active.description}</p>
              <div className={styles.stackRow}>
                {active.stack.map((t) => (
                  <span key={t} className={styles.stackPill}>
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className={styles.phaseGrid}>
            {active.phases.map((p) => (
              <article key={p.num} className={styles.phaseCard}>
                <div className={styles.phaseTop}>
                  <span className={styles.phaseNum}>{p.num}</span>
                  <span className={styles.phaseLabel}>{p.label}</span>
                </div>
                <h3 className={styles.phaseTitle}>{p.title}</h3>
                <p className={styles.phaseBody}>{p.body}</p>
              </article>
            ))}
          </div>

          <div className={styles.deliverables}>
            <div className={styles.deliverablesTop}>
              <h3 className={styles.deliverablesTitle}>Deliverables</h3>
              <Link href="/#contact" className={styles.cta}>
                Start a project
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </Link>
            </div>
            <div className={styles.deliverablesGrid}>
              {active.deliverables.map((d) => (
                <div key={d.title} className={styles.deliverableCard}>
                  <div className={styles.deliverableIcon}>{d.icon}</div>
                  <div className={styles.deliverableText}>
                    <div className={styles.deliverableName}>{d.title}</div>
                    <div className={styles.deliverableDesc}>{d.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.bottomCta}>
            <Link href="/#contact" className={styles.bottomBtn}>
              Contact me
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
            <p className={styles.bottomNote}>
              Prefer email?{" "}
              <a href="mailto:hello@joanna.dev" className={styles.inlineLink}>
                hello@joanna.dev
              </a>
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

export function ServicesPageClient() {
  return (
    <Suspense>
      <ServicesContent />
    </Suspense>
  );
}

