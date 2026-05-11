"use client";

import {useLocale, useTranslations} from "next-intl";
import {usePathname} from "next/navigation";
import {useEffect, useRef} from "react";
import {Link} from "@/i18n/navigation";
import {MALT_PROFILE_URL} from "../../_lib/site";
import {PaperPlaneIcon} from "../icons/PaperPlaneIcon";
import {LocaleSwitch} from "../locale-switch/LocaleSwitch";
import styles from "./SiteFooter.module.css";

export interface SiteFooterProps {
  /** Home only — same in-page scroll as `SiteNav` for #about / #contact */
  onScrollTo?: (id: string) => void;
}

export function SiteFooter({onScrollTo}: SiteFooterProps) {
  const t = useTranslations("Footer");
  const tNav = useTranslations("Nav");
  const year = new Date().getFullYear();
  const locale = useLocale();
  const pathname = usePathname();
  const prefix = `/${locale}`;
  const isHome = pathname === prefix || pathname === `${prefix}/`;

  const footerRef = useRef<HTMLElement>(null);
  const revealTopRef = useRef<HTMLDivElement>(null);
  const revealBottomRef = useRef<HTMLDivElement>(null);

  const handleSection = (section: "about" | "contact", e: React.MouseEvent<HTMLAnchorElement>) => {
    if (isHome && onScrollTo) {
      e.preventDefault();
      onScrollTo(section);
    }
  };

  useEffect(() => {
    const footerEl = footerRef.current;
    const revealTopEl = revealTopRef.current;
    const revealBottomEl = revealBottomRef.current;
    if (!footerEl || !revealTopEl || !revealBottomEl) return;

    let gsapCtx: {revert: () => void} | null = null;
    let cancelled = false;
    const homeScrollRoot = document.getElementById("scroll-root") as HTMLElement | null;
    const pageScrollRoot = document.getElementById("page-scroll-root") as HTMLElement | null;
    const stScrollRoot = homeScrollRoot ?? pageScrollRoot;

    const init = async () => {
      const gsapMod = await import("gsap");
      const stMod = await import("gsap/ScrollTrigger");
      if (cancelled) return;

      const gsap = gsapMod.gsap;
      const {ScrollTrigger} = stMod;
      gsap.registerPlugin(ScrollTrigger);
      window.ScrollTrigger = ScrollTrigger;

      if (homeScrollRoot) {
        ScrollTrigger.refresh();
      }

      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      gsapCtx = gsap.context(() => {
        if (reduceMotion) {
          gsap.set([revealTopEl, revealBottomEl], {
            maxHeight: "none",
            opacity: 1,
            clearProps: "overflow",
          });
          return;
        }

        const topInner = gsap.utils.toArray<HTMLElement>(revealTopEl.querySelectorAll(":scope > *"));
        const bottomBlocks = gsap.utils.toArray<HTMLElement>(revealBottomEl.querySelectorAll(":scope > *"));

        gsap.set([revealTopEl, revealBottomEl], {
          maxHeight: 0,
          opacity: 0,
          overflow: "hidden",
        });
        gsap.set(topInner, {y: 12, opacity: 0});
        gsap.set(bottomBlocks, {y: 18, opacity: 0});

        gsap.timeline({
          scrollTrigger: {
            trigger: footerEl,
            scroller: stScrollRoot ?? undefined,
            start: "top 96%",
            end: "top 38%",
            scrub: 0.45,
            invalidateOnRefresh: true,
          },
        })
          .fromTo(
            revealTopEl,
            {maxHeight: 0, opacity: 0},
            {maxHeight: 120, opacity: 1, duration: 0.42, ease: "none"},
            0
          )
          .fromTo(
            revealBottomEl,
            {maxHeight: 0, opacity: 0},
            {maxHeight: 2600, opacity: 1, duration: 0.58, ease: "none"},
            0
          )
          .to(
            topInner,
            {
              y: 0,
              opacity: 1,
              stagger: 0.06,
              duration: 0.28,
              ease: "power2.out",
            },
            0.12
          )
          .to(
            bottomBlocks,
            {
              y: 0,
              opacity: 1,
              stagger: 0.08,
              duration: 0.36,
              ease: "power2.out",
            },
            0.18
          );
      }, footerEl);

      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
        requestAnimationFrame(() => ScrollTrigger.refresh());
      });
    };

    init().catch(() => {
      revealTopEl.style.maxHeight = "none";
      revealTopEl.style.opacity = "1";
      revealTopEl.style.overflow = "visible";
      revealBottomEl.style.maxHeight = "none";
      revealBottomEl.style.opacity = "1";
      revealBottomEl.style.overflow = "visible";
    });

    return () => {
      cancelled = true;
      gsapCtx?.revert();
    };
  }, [pathname]);

  return (
    <footer ref={footerRef} className={styles.footer} role="contentinfo">
      <div className={styles.wrap}>
        <div className={styles.panel}>
          <div ref={revealTopRef} className={styles.revealTop}>
            <div className={styles.topRow}>
              <span className={styles.sysLabel}>{t("sysLabel")}</span>
              <div className={styles.onlineBadge}>
                <span className={styles.pingWrap}>
                  <span className={styles.ping} />
                  <span className={styles.dotSolid} />
                </span>
                <span className={styles.onlineText}>{t("online")}</span>
              </div>
            </div>
          </div>

          <div className={styles.compactBar}>
            <div className={styles.barLeft}>
              <span className={styles.brandMark}>{t("brandMark")}</span>
            </div>
            <div className={styles.barRight}>
              <a
                href={MALT_PROFILE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.ctaBtn}
              >
                <span className={styles.ctaLabel}>{t("startProject")}</span>
                <PaperPlaneIcon className={styles.ctaIcon} />
              </a>
            </div>
          </div>

          <div ref={revealBottomRef} className={styles.revealBottom}>
            <div className={styles.grid}>
              <div className={styles.colBrand}>
                <p className={styles.lead}>{t("lead")}</p>
              </div>

              <div className={styles.colIndex}>
                <span className={styles.indexLabel}>{t("index")}</span>
                <nav className={styles.nav} aria-label={t("indexNavAria")}>
                  <Link
                    href="/services"
                    className={`${styles.navLink} ${
                      pathname === `${prefix}/services` ? styles.navLinkActive : ""
                    }`}
                  >
                    {tNav("services")}
                  </Link>
                  <Link
                    href="/work"
                    className={`${styles.navLink} ${
                      pathname === `${prefix}/work` ? styles.navLinkActive : ""
                    }`}
                  >
                    {tNav("work")}
                  </Link>
                  <a
                    href={`${prefix}/#about`}
                    className={styles.navLink}
                    onClick={(e) => handleSection("about", e)}
                  >
                    {tNav("about")}
                  </a>
                  <a
                    href={`${prefix}/#contact`}
                    className={styles.navLink}
                    onClick={(e) => handleSection("contact", e)}
                  >
                    {tNav("contact")}
                  </a>
                </nav>
              </div>
            </div>

            <div className={styles.bottomBar}>
              <span className={styles.copyright}>{t("copyrightLegal", {year})}</span>
              <div className={styles.bottomRight}>
                <span className={styles.axis}>{t("axis")}</span>
                <LocaleSwitch variant="glass" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
