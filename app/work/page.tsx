import Link from "next/link";
import styles from "./Work.module.css";

const PROJECTS = [
  {
    id: "featured",
    tag: "Frontend Development",
    date: "2024",
    title: "Mercedes-Benz — Interactive Campaign Experience",
    desc: "A high-performance, scroll-driven brand campaign featuring real-time 3D configurator integration, fluid micro-interactions, and sub-second load times across 12 markets.",
    tech: ["React", "GSAP", "WebGL", "Next.js"],
    img: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop",
    imgAlt: "Abstract gradient composition",
  },
] as const;

const GRID_PROJECTS = [
  {
    id: "bnp",
    tag: "Design & Build",
    date: "2023",
    title: "BNP Paribas — Digital Banking Onboarding",
    desc: "End-to-end redesign of the onboarding flow. Reduced drop-off by 34% through motion-guided UX and accessible form architecture.",
    img: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2070&auto=format&fit=crop",
    imgAlt: "Typography and layout design",
  },
  {
    id: "ferrero",
    tag: "Creative Tech",
    date: "2023",
    title: "Ferrero Rocher — Holiday Gifting Platform",
    desc: "Seasonal e-commerce experience with personalised gift builder, 3D packaging preview, and AR product showcase.",
    img: "https://images.unsplash.com/photo-1604871000636-074fa5117945?q=80&w=2574&auto=format&fit=crop",
    imgAlt: "Abstract minimal architecture",
  },
] as const;

export default function WorkPage() {
  return (
    <div className={styles.page}>

      {/* ── Ambient background ─────────────────────────────────────────── */}
      <div className={styles.bg} aria-hidden>
        <div className={styles.orb1} />
        <div className={styles.orb2} />
        <div className={styles.grid} />
        <div className={styles.spinRing}>
          <svg viewBox="0 0 100 100" width="100%" height="100%">
            <circle cx="50" cy="50" r="48" fill="none" stroke="rgba(0,0,0,0.04)" strokeWidth="0.2" />
            <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth="0.1" strokeDasharray="1,1" />
            <circle cx="50" cy="50" r="32" fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth="0.3" />
            <path d="M 50,50 m -37,0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" id="textPath" fill="none" />
            <text fontSize="1.4" fontFamily="'JetBrains Mono', monospace" letterSpacing="2" opacity="0.4" fontWeight="bold">
              <textPath href="#textPath" startOffset="0%">
                BUILT FOR RESULTS • SHIPPED & LIVE • DIGITAL PRODUCTS •{" "}
              </textPath>
            </text>
          </svg>
        </div>
      </div>

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <header className={styles.header}>
        <Link href="/" className={styles.logo}>joanna.dev</Link>
        <nav className={styles.nav}>
          <Link href="/#services">Services</Link>
          <Link href="/#about">About me</Link>
          <Link href="/#contact">Contact</Link>
          <Link href="/work" className={styles.navActive}>Work</Link>
        </nav>
      </header>

      {/* ── Main ───────────────────────────────────────────────────────── */}
      <main className={styles.main}>

        <div className={styles.eyebrow}>
          <div className={styles.eyebrowLine} />
          <span className={styles.eyebrowText}>Selected Projects</span>
        </div>

        <div className={styles.titleRow}>
          <h1 className={styles.title}>Portfolio</h1>
        </div>

        {/* ── Projects list ──────────────────────────────────────────── */}
        <div className={styles.projectsList}>

          {/* Featured */}
          {PROJECTS.map((p) => (
            <article key={p.id} className={styles.featured}>
              <div className={styles.featuredImgWrap}>
                <img src={p.img} alt={p.imgAlt} className={styles.featuredImg} />
              </div>
              <div className={styles.featuredCard}>
                <div className={styles.cardMeta}>
                  <span className={styles.cardTag}>{p.tag}</span>
                  <span className={styles.cardDate}>{p.date}</span>
                </div>
                <h2 className={styles.cardTitle}>{p.title}</h2>
                <p className={styles.cardDesc}>{p.desc}</p>
                <div className={styles.cardTechRow}>
                  {p.tech.map((t) => (
                    <span key={t} className={styles.techPill}>{t}</span>
                  ))}
                </div>
                <span className={styles.cardLink}>
                  View Case Study
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </span>
              </div>
            </article>
          ))}

          {/* Grid */}
          <div className={styles.grid2}>
            {GRID_PROJECTS.map((p) => (
              <article key={p.id} className={styles.gridCard}>
                <div className={styles.gridImgWrap}>
                  <img src={p.img} alt={p.imgAlt} className={styles.gridImg} />
                </div>
                <div className={styles.gridCardMeta}>
                  <span className={styles.cardTag}>{p.tag}</span>
                  <span className={styles.cardDate}>{p.date}</span>
                </div>
                <h2 className={styles.gridCardTitle}>{p.title}</h2>
                <p className={styles.gridCardDesc}>{p.desc}</p>
              </article>
            ))}
          </div>

        </div>
      </main>

      {/* ── Footer labels ───────────────────────────────────────────────── */}
      <div className={styles.footerLeft}>Index // Chronological</div>
      <div className={styles.footerRight}>Records: 03 // Sync: Active</div>

    </div>
  );
}
