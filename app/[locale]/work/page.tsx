import type {Metadata} from 'next';
import {getTranslations} from 'next-intl/server';
import {SiteFooter} from '../../_components/site-footer/SiteFooter';
import {SiteNav} from '../../_components/site-nav/SiteNav';
import styles from '../../work/Work.module.css';
import {absUrl} from '../../_lib/site';

export async function generateMetadata({
  params
}: {
  params: Promise<{locale: string}>;
}): Promise<Metadata> {
  const {locale} = await params;
  const isFr = locale === 'fr';
  const path = '/work';
  return {
    title: isFr ? 'Projets — joanna.dev' : 'Work — joanna.dev',
    description: isFr ? 'Projets sélectionnés.' : 'Selected projects.',
    alternates: {
      canonical: absUrl(`/${locale}${path}`),
      languages: {
        en: absUrl(`/en${path}`),
        fr: absUrl(`/fr${path}`),
        'x-default': absUrl(`/en${path}`)
      }
    }
  };
}

export default async function WorkPage({
  params
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  const t = await getTranslations({locale, namespace: 'Work'});

  return (
    <div id="page-scroll-root" className={styles.page}>
      {/* ── Ambient background ─────────────────────────────────────────── */}
      <div className={styles.bg} aria-hidden>
        <div className={styles.orb1} />
        <div className={styles.orb2} />
        <div className={styles.grid} />
        <div className={styles.spinRing}>
          <svg viewBox="0 0 100 100" width="100%" height="100%">
            <circle
              cx="50"
              cy="50"
              r="48"
              fill="none"
              stroke="rgba(0,0,0,0.04)"
              strokeWidth="0.2"
            />
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke="rgba(0,0,0,0.06)"
              strokeWidth="0.1"
              strokeDasharray="1,1"
            />
            <circle
              cx="50"
              cy="50"
              r="32"
              fill="none"
              stroke="rgba(0,0,0,0.08)"
              strokeWidth="0.3"
            />
            <path
              d="M 50,50 m -37,0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
              id="textPath"
              fill="none"
            />
            <text
              fontSize="1.4"
              fontFamily="'JetBrains Mono', monospace"
              letterSpacing="2"
              opacity="0.4"
              fontWeight="bold"
            >
              <textPath href="#textPath" startOffset="0%">
                {t('ringText')}{' '}
              </textPath>
            </text>
          </svg>
        </div>
      </div>

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <SiteNav />

      {/* ── Main ───────────────────────────────────────────────────────── */}
      <main className={styles.main}>
       

        <div className={styles.titleRow}>
          <h1 className={styles.title}>{t('title')}</h1>
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
                <span className={styles.cardTag}>{t('tags.web')}</span>

              </div>
              <h2 className={styles.cardTitle}>{t('cards.psychologistTitle')}</h2>
              <p className={styles.cardDesc}>
                {t('cards.psychologistDesc')}
              </p>
              <div className={styles.cardTechRow}>
                {['Webflow', 'GSAP', 'CSS Animations', 'Logo Design'].map((t) => (
                  <span key={t} className={styles.techPill}>
                    {t}
                  </span>
                ))}
              </div>
              <a
                href="https://www.katarzynapietryka.com/fr-fr"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.cardLink}
              >
                {t('visitSite')}
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
                <span className={styles.cardTag}>{t('tags.web')}</span>
         
              </div>
              <h2 className={styles.gridCardTitle}>{t('cards.avamexTitle')}</h2>
              <p className={styles.gridCardDesc}>
                {t('cards.avamexDesc')}
              </p>
              <a
                href="https://avamex.krakow.pl/"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.gridCardLink}
              >
                {t('visitSite')}
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
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
                <span className={styles.cardTag}>{t('tags.web')}</span>
              </div>
              <h2 className={styles.gridCardTitle}>{t('cards.lidoTitle')}</h2>
              <p className={styles.gridCardDesc}>
                {t('cards.lidoDesc')}
              </p>
              <a
                href="https://lido-agency.pl/"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.gridCardLink}
              >
                {t('visitSite')}
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </a>
            </article>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

