import { SiteNav } from "../_components/site-nav/SiteNav";
import styles from "./Work.module.css";

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
      <SiteNav />

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

          {/* Featured — video showcase */}
          <article className={styles.featured}>
            <div className={styles.featuredImgWrap}>
              <video
                src="/assets/videos/project-1.mp4"
                autoPlay
                muted
                loop
                playsInline
                className={styles.featuredImg}
              />
            </div>
            <div className={styles.featuredCard}>
              <div className={styles.cardMeta}>
                <span className={styles.cardTag}>Web Design & Development</span>
                <span className={styles.cardDate}>2025</span>
              </div>
              <h2 className={styles.cardTitle}>Psychologist — Brand & Web</h2>
              <p className={styles.cardDesc}>
                Psychologist website designed and built in Webflow, featuring smooth on-scroll animations, a custom logo, and an integrated blog for content publishing.
              </p>
              <div className={styles.cardTechRow}>
                {["Webflow", "GSAP", "CSS Animations", "Logo Design"].map((t) => (
                  <span key={t} className={styles.techPill}>{t}</span>
                ))}
              </div>
              <a href="https://www.katarzynapietryka.com/fr-fr" target="_blank" rel="noopener noreferrer" className={styles.cardLink}>
                  Visit Site
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </a>
            </div>
          </article>

          {/* Grid */}
          <div className={styles.grid2}>

            {/* Card 1 — Avamex */}
            <article className={styles.gridCard}>
              <div className={styles.gridImgWrap}>
                <video
                  src="/assets/videos/project-2.mp4"
                  autoPlay
                  muted
                  loop
                  playsInline
                  className={styles.gridImg}
                />
              </div>
              <div className={styles.gridCardMeta}>
                <span className={styles.cardTag}>Web Design & Development</span>
                <span className={styles.cardDate}>2025</span>
              </div>
              <h2 className={styles.gridCardTitle}>Avamex — IT Outsourcing</h2>
              <p className={styles.gridCardDesc}>
                Webflow website for an outsourcing company, featuring custom branding, smooth animations, and AI-generated graphics tailored to the brand.
              </p>
              <a href="https://avamex.krakow.pl/" target="_blank" rel="noopener noreferrer" className={styles.gridCardLink}>
                Visit Site
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </a>
            </article>

            {/* Card 2 — Lido Agency */}
            <article className={styles.gridCard}>
              <div className={styles.gridImgWrap}>
                <video
                  src="/assets/videos/project-3.mp4"
                  autoPlay
                  muted
                  loop
                  playsInline
                  className={styles.gridImg}
                />
              </div>
              <div className={styles.gridCardMeta}>
                <span className={styles.cardTag}>Web Design & Development</span>
                <span className={styles.cardDate}>2025</span>
              </div>
              <h2 className={styles.gridCardTitle}>Lido Agency</h2>
              <p className={styles.gridCardDesc}>
                High-performance Next.js website for a flat rental company with a bespoke logo, custom visuals, and a seamless browsing experience.
              </p>
              <a href="https://lido-agency.vercel.app/" target="_blank" rel="noopener noreferrer" className={styles.gridCardLink}>
                Visit Site
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </a>
            </article>

          </div>

        </div>
      </main>

      {/* ── Footer labels ───────────────────────────────────────────────── */}
      <div className={styles.footerLeft}>Index // Chronological</div>
      <div className={styles.footerRight}>Records: 03 // Sync: Active</div>

    </div>
  );
}
