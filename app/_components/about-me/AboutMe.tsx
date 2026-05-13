"use client";

import {useTranslations} from 'next-intl';
import Image from "next/image";
import { useEffect, useRef } from "react";
import styles from "./AboutMe.module.css";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Gsap = any;

export function AboutMe() {
  const t = useTranslations('About');
  const sectionRef   = useRef<HTMLElement>(null);
  const photoColRef  = useRef<HTMLDivElement>(null);
  const eyebrowRef   = useRef<HTMLDivElement>(null);
  const titleRef     = useRef<HTMLHeadingElement>(null);
  const leadRef      = useRef<HTMLParagraphElement>(null);
  const cardGridRef    = useRef<HTMLDivElement>(null);
  const progressFillRef = useRef<HTMLDivElement>(null);
  const aiCardRef      = useRef<HTMLDivElement>(null);
  const lensRef        = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let retryTimer: ReturnType<typeof setTimeout>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let gsapCtx: any = null;
    let cancelled = false;

    let _tryInitCount = 0;
    const tryInit = () => {
      if (cancelled) return;
      _tryInitCount++;
      const gsap: Gsap = (window as Gsap).gsap;
      const ST: Gsap   = (window as Gsap).ScrollTrigger;
      if (!gsap || !ST) { retryTimer = setTimeout(tryInit, 80); return; }

      const section  = sectionRef.current;
      if (!section) {
        retryTimer = setTimeout(tryInit, 80);
        return;
      }

      const scroller = document.getElementById("scroll-root") ?? undefined;
      const isMobile = window.matchMedia?.("(max-width: 768px)")?.matches ?? false;

      // #region agent log
      ;(window as any).__debugLogs = (window as any).__debugLogs || [];
      const _dbA2 = {sessionId:'3ce458',hypothesisId:'H-A-H-B',location:'AboutMe.tsx:tryInit',message:'AboutMe tryInit resolved',data:{attempt:_tryInitCount,isMobile,scrollerFound:!!scroller,scrollerH:scroller?.clientHeight??-1,scrollerScrollTop:scroller?.scrollTop??-1,innerW:window.innerWidth,innerH:window.innerHeight},timestamp:Date.now()};
      (window as any).__debugLogs.push(_dbA2);
      fetch('http://127.0.0.1:7574/ingest/fe155714-7922-434a-ae5d-bc5b3f690196',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'3ce458'},body:JSON.stringify(_dbA2)}).catch(()=>{});
      // #endregion

      gsapCtx = gsap.context(() => {
        const photo    = photoColRef.current;
        const eyebrow  = eyebrowRef.current;
        const title    = titleRef.current;
        const lead     = leadRef.current;
        const cardGrid      = cardGridRef.current;
        const progressFill  = progressFillRef.current;
        const aiCard        = aiCardRef.current;
        const lens          = lensRef.current;
        const cards    = cardGrid ? Array.from(cardGrid.children) as HTMLElement[] : [];

        const revealInView = (el: HTMLElement | null, delay = 0) => {
          if (!el) return;
          const startPct = isMobile ? "top 90%" : "top 85%";
          gsap.set(el, { y: 22, opacity: 0 });
          // #region agent log
          const _dbA3={sessionId:'3ce458',hypothesisId:'H-A-H-E',location:'AboutMe.tsx:revealInView',message:'ST trigger created',data:{elClass:el.className.slice(0,60),startPct,scrollerFound:!!scroller,elTop:Math.round(el.getBoundingClientRect().top),scrollerScrollTop:scroller?.scrollTop??-1},timestamp:Date.now()};
          (window as any).__debugLogs=((window as any).__debugLogs||[]); (window as any).__debugLogs.push(_dbA3);
          fetch('http://127.0.0.1:7574/ingest/fe155714-7922-434a-ae5d-bc5b3f690196',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'3ce458'},body:JSON.stringify(_dbA3)}).catch(()=>{});
          // #endregion
          gsap.to(el, {
            y: 0,
            opacity: 1,
            duration: 0.6,
            ease: "power2.out",
            delay,
            scrollTrigger: {
              trigger: el,
              scroller,
              start: startPct,
              once: true,
              invalidateOnRefresh: true,
              onEnter: () => {
                console.log("[AboutMe] revealInView fired:", el.className || el.tagName);
                // #region agent log
                const _dbA4={sessionId:'3ce458',hypothesisId:'H-E',location:'AboutMe.tsx:onEnter',message:'ST onEnter fired',data:{elClass:el.className.slice(0,60),scrollTop:scroller?.scrollTop??-1},timestamp:Date.now()};
                (window as any).__debugLogs=((window as any).__debugLogs||[]); (window as any).__debugLogs.push(_dbA4);
                fetch('http://127.0.0.1:7574/ingest/fe155714-7922-434a-ae5d-bc5b3f690196',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'3ce458'},body:JSON.stringify(_dbA4)}).catch(()=>{});
                // #endregion
              },
            },
          });
        };

        /* ── set initial hidden states ─────────────────────────────────── */
        if (photo)   gsap.set(photo,   { x: -70, opacity: 0 });
        if (eyebrow) gsap.set(eyebrow, { y: 20,  opacity: 0 });

        /* word-split the title for hero-style stagger */
        let titleWords: HTMLElement[] = [];
        if (title) {
          const words = (title.textContent || "").trim().split(/\s+/);
          title.innerHTML = words
            .map((w) => `<span style="display:inline-block">${w}</span>`)
            .join(" ");
          titleWords = Array.from(title.querySelectorAll<HTMLElement>("span"));
          gsap.set(titleWords, { y: 60, opacity: 0, rotation: -6 });
        }
        if (lead)    gsap.set(lead,    { y: 24,  opacity: 0 });
        if (cards.length) gsap.set(cards, { y: 32, scale: 0.9, opacity: 0 });
        if (progressFill) {
          gsap.set(progressFill, {
            scaleX: 0,
            transformOrigin: "left center",
            force3D: true,
            // will-change causes compositing layer overhead on mobile; skip it
            ...(isMobile ? {} : { willChange: "transform" }),
          });
        }
        if (aiCard)  gsap.set(aiCard,  { y: 28,  opacity: 0 });

        // Mobile: scroll-into-view reveals (pattern from AITools subheading).
        if (isMobile) {
          console.log("[AboutMe] Mobile branch – setting up scroll-in-view reveals (start: top 90%)");

          // Portrait column (fix: it was left at opacity:0 from initial gsap.set)
          if (photo) {
            gsap.to(photo, {
              x: 0,
              opacity: 1,
              duration: 0.6,
              ease: "power2.out",
              scrollTrigger: {
                trigger: photo,
                scroller,
                start: "top 90%",
                once: true,
                invalidateOnRefresh: true,
                onEnter: () => console.log("[AboutMe] photo revealed"),
              },
            });
          }

          // Glass lens float (fix: was skipped by early return on mobile).
          if (lens) {
            gsap.to(lens, {
              y: -14,
              duration: 1.8,
              repeat: -1,
              yoyo: true,
              ease: "sine.inOut",
            });
          }

          // Title (fix: word-split spans were left hidden on mobile).
          if (titleWords.length && title) {
            gsap.to(titleWords, {
              y: 0,
              opacity: 1,
              rotation: 0,
              stagger: 0.1,
              duration: 0.65,
              ease: "power3.out",
              scrollTrigger: {
                trigger: title,
                scroller,
                start: "top 90%",
                once: true,
                invalidateOnRefresh: true,
                onEnter: () => console.log("[AboutMe] title words revealed"),
              },
            });
          }

          const eyebrowText = eyebrow?.querySelector<HTMLElement>(`.${styles.eyebrowText}`) ?? null;
          revealInView(eyebrowText, 0.02);
          revealInView(lead, 0.06);

          // Requested: AboutMe_glassCard_ (all cards).
          cards.forEach((c, i) => revealInView(c, 0.08 + i * 0.06));

          // Requested: AboutMe_aiCard_
          revealInView(aiCard, 0.06);
          return;
        }

        /* ── timeline fires once when section enters viewport ──────────── */
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            scroller,
            start: isMobile ? "top 90%" : "top 72%",
            once: true,
            invalidateOnRefresh: true,
            onEnter: () => console.log("[AboutMe] desktop timeline fired"),
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

        /* Pattern 2 – title word-split stagger (hero-style) */
        if (titleWords.length) {
          tl.to(titleWords, {
            y: 0, opacity: 1, rotation: 0,
            stagger: 0.1, duration: 0.65, ease: "power3.out",
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

        /* Progress fill — tied to grid reveal (stack card), no hover */
        if (progressFill) {
          tl.to(
            progressFill,
            {
              scaleX: 1,
              duration: 0.95,
              ease: "power2.out",
              onComplete: () => gsap.set(progressFill, { clearProps: "willChange" }),
            },
            0.72
          );
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

    // #region agent log — H-E: does #scroll-root fire scroll events on iOS?
    let _scrollEventCount = 0;
    const _scrollRoot = document.getElementById('scroll-root');
    const _onScroll = () => {
      _scrollEventCount++;
      if (_scrollEventCount === 1 || _scrollEventCount === 5 || _scrollEventCount === 20) {
        const _dbA5={sessionId:'3ce458',hypothesisId:'H-E',location:'AboutMe.tsx:scroll-event',message:'scroll-root scroll event',data:{count:_scrollEventCount,scrollTop:_scrollRoot?.scrollTop??-1,clientH:_scrollRoot?.clientHeight??-1},timestamp:Date.now()};
        (window as any).__debugLogs=((window as any).__debugLogs||[]); (window as any).__debugLogs.push(_dbA5);
        fetch('http://127.0.0.1:7574/ingest/fe155714-7922-434a-ae5d-bc5b3f690196',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'3ce458'},body:JSON.stringify(_dbA5)}).catch(()=>{});
      }
    };
    _scrollRoot?.addEventListener('scroll', _onScroll, { passive: true });
    // #endregion

    return () => {
      cancelled = true;
      clearTimeout(retryTimer);
      gsapCtx?.revert();
      // #region agent log
      _scrollRoot?.removeEventListener('scroll', _onScroll);
      // #endregion
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
            <circle cx="250" cy="250" r="200" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4 8" opacity="0.07" />
            <circle cx="250" cy="250" r="160" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.07" />
            <path d="M 250 10 L 250 40 M 250 460 L 250 490 M 10 250 L 40 250 M 460 250 L 490 250" stroke="currentColor" strokeWidth="2" opacity="0.07" />
            <circle cx="250" cy="50" r="5" fill="#b28dff" />
            <circle cx="250" cy="450" r="5" fill="#ffb5e8" />
          </svg>

          <div className={styles.portraitMask}>
            <Image
              src="/assets/profile.png"
              alt={t('portraitAlt')}
              fill
              className={styles.portraitImg}
              sizes="(max-width: 768px) 85vw, 400px"
              priority
            />
            <div className={styles.portraitOverlay} aria-hidden="true" />
          </div>
          <div ref={lensRef} className={styles.glassLens} aria-hidden="true" />

          <div className={styles.buildingCapsule} aria-hidden="true">
            <div className={styles.refOrb} />
            <span className={styles.buildingText}>{t('building')}</span>
          </div>

          <div className={styles.statusBadge} aria-hidden="true">
            <div className={styles.statusDotWrap}>
              <div className={styles.statusDot} />
            </div>
            <div className={styles.statusInfo}>
              <span className={styles.statusLabel}>{t('systemStatus.label')}</span>
              <span className={styles.statusValue}>{t('systemStatus.value')}</span>
            </div>
          </div>
        </div>

        {/* ── RIGHT: text content ───────────────────────────────────────── */}
        <div className={styles.textCol}>
          <div className={styles.headingBlock}>
            <div ref={eyebrowRef} className={styles.eyebrow}>
              <span className={styles.eyebrowDot} />
              <span className={styles.eyebrowText}>{t('eyebrow')}</span>
            </div>
            <h2 ref={titleRef} className={styles.title}>
              {t('title')}
            </h2>
            <p ref={leadRef} className={styles.lead}>
              {t('lead')}
            </p>
          </div>

          <div ref={cardGridRef} className={styles.cardGrid}>
            <div className={styles.glassCard}>
              <div className={styles.cardHeader}>
                <span className={styles.cardLabel}>{t('cards.background.label')}</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.cardIcon} style={{ color: "#b28dff" }} aria-hidden="true">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                  <line x1="12" y1="22.08" x2="12" y2="12" />
                </svg>
              </div>
              <p className={styles.cardBody}>
                {t('cards.background.body')}
              </p>
              <div className={styles.pills}>
                <span className={styles.pill}>Ferrero Rocher</span>
                <span className={styles.pill}>BNP Paribas</span>
                <span className={styles.pill}>Mercedes-Benz</span>
              </div>
            </div>

            <div className={styles.glassCard}>
              <div className={styles.cardHeader}>
                <span className={styles.cardLabel}>{t('cards.stack.label')}</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.cardIcon} style={{ color: "#4a6bff" }} aria-hidden="true">
                  <polygon points="12 2 2 7 12 12 22 7 12 2" />
                  <polyline points="2 17 12 22 22 17" />
                  <polyline points="2 12 12 17 22 12" />
                </svg>
              </div>
              <p className={styles.cardBody}>
                {t('cards.stack.body')}
              </p>
              <div className={styles.progressWrap}>
                <div className={styles.progressBar}>
                  <div ref={progressFillRef} className={styles.progressFill} />
                </div>
                <div className={styles.progressLabels}>
                  <span>{t('cards.stack.progressLabel')}</span>
                  <span>100%</span>
                </div>
              </div>
            </div>
          </div>

          <div ref={aiCardRef} className={styles.aiCard}>
            <div className={styles.aiCardGlow} aria-hidden="true" />
            <div className={styles.aiCardInner}>
              <div className={styles.aiIcon}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: "#ff55a3" }} aria-hidden="true">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </div>
              <div>
                <h3 className={styles.aiCardTitle}>{t('aiCard.title')}</h3>
                <p className={styles.aiCardBody}>
                  {t('aiCard.body')}
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
