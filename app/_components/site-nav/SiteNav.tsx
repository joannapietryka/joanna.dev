"use client";

import {useLocale, useTranslations} from 'next-intl';
import {usePathname} from 'next/navigation';
import {useEffect, useState} from 'react';
import {Link} from '@/i18n/navigation';
import {LocaleSwitch} from '../locale-switch/LocaleSwitch';
import styles from "./SiteNav.module.css";

interface Props {
  /** Only passed from the home page — scrolls the custom #scroll-root container */
  onScrollTo?: (id: string) => void;
}

export function SiteNav({ onScrollTo }: Props) {
  const t = useTranslations('Nav');
  const locale = useLocale();
  const pathname = usePathname();
  const prefix = `/${locale}`;
  const isHome = pathname === prefix || pathname === `${prefix}/`;
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [nearTop, setNearTop] = useState(false);
  /* hideEnabled gates the hide behaviour until the hero entrance is done */
  const [hideEnabled, setHideEnabled] = useState(false);

  useEffect(() => {
    /* reset on every route change so the nav is always visible on arrival */
    setHideEnabled(false);
    setScrolled(false);

    /* Same scroll sources as footer: home #scroll-root, /services + /work #page-scroll-root; body is overflow:hidden so window is wrong there. */
    const scroller =
      (document.getElementById("scroll-root") as HTMLElement | null) ??
      (document.getElementById("page-scroll-root") as HTMLElement | null);

    const onScroll = () => {
      const top = scroller ? scroller.scrollTop : window.scrollY;
      setScrolled(top > 50);
    };

    const onMouseMove = (e: MouseEvent) => {
      setNearTop(e.clientY < 110);
    };

    if (scroller) {
      scroller.addEventListener("scroll", onScroll, { passive: true });
    } else {
      window.addEventListener("scroll", onScroll, { passive: true });
    }
    window.addEventListener("mousemove", onMouseMove);

    /* On the home page: enable hiding only once the second section (#services)
     * enters the scroll container's viewport for the first time.
     * On every other page: enable immediately. */
    let observer: IntersectionObserver | null = null;

    if (isHome) {
      const servicesEl = document.getElementById("services");
      if (servicesEl) {
        observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              setHideEnabled(true);
              observer?.disconnect();
            }
          },
          { root: scroller ?? null, threshold: 0 }
        );
        observer.observe(servicesEl);
      }
    } else {
      setHideEnabled(true);
    }

    return () => {
      observer?.disconnect();
      if (scroller) {
        scroller.removeEventListener("scroll", onScroll);
      } else {
        window.removeEventListener("scroll", onScroll);
      }
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, [pathname]);

  const hidden  = hideEnabled &&  scrolled && !nearTop;
  const glassy  = hideEnabled &&  scrolled &&  nearTop;

  const handle = (section: string, e: React.MouseEvent) => {
    if (isHome && onScrollTo) {
      e.preventDefault();
      onScrollTo(section);
    }
    setOpen(false);
  };

  const close = () => setOpen(false);

  return (
    <>
      <header
        className={[
          styles.header,
          hidden ? styles.headerHidden : "",
          glassy ? styles.headerGlassy : "",
        ].join(" ").trim()}
      >
        <Link href="/" className={styles.logo} onClick={close}>
          joanna.dev
        </Link>

        <nav className={styles.navLinks} aria-label="Primary">
          <Link
            href="/services"
            className={pathname === `${prefix}/services` ? styles.navActive : ""}
            onClick={close}
            aria-current={pathname === `${prefix}/services` ? "page" : undefined}
          >
            {t('services')}
          </Link>
          <Link
            href="/work"
            className={pathname === `${prefix}/work` ? styles.navActive : ""}
            onClick={close}
            aria-current={pathname === `${prefix}/work` ? "page" : undefined}
          >
            {t('work')}
          </Link>
          <a href={`${prefix}/#about`} onClick={(e) => handle("about", e)}>{t('about')}</a>
          <a href={`${prefix}/#contact`} onClick={(e) => handle("contact", e)}>{t('contact')}</a>
        </nav>

        <button
          className={`${styles.menuToggle} ${open ? styles.isOpen : ""}`}
          type="button"
          aria-label={open ? t('closeMenu') : t('openMenu')}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
        </button>
      </header>

      {/* ── Mobile full-screen overlay ──────────────────────────────────── */}
      <div
        className={`${styles.overlay} ${open ? styles.overlayVisible : ""}`}
        aria-hidden={!open}
      >
        <nav className={styles.mobileNav} aria-label="Mobile primary">
          <Link
            href="/services"
            className={`${styles.mobileLink} ${pathname === `${prefix}/services` ? styles.mobileLinkActive : ""}`}
            onClick={close}
            aria-current={pathname === `${prefix}/services` ? "page" : undefined}
          >
            <span className={styles.mobileLinkIdx}>01</span>{t('services')}
          </Link>
          <Link
            href="/work"
            className={`${styles.mobileLink} ${pathname === `${prefix}/work` ? styles.mobileLinkActive : ""}`}
            onClick={close}
            aria-current={pathname === `${prefix}/work` ? "page" : undefined}
          >
            <span className={styles.mobileLinkIdx}>02</span>{t('work')}
          </Link>
          <a href={`${prefix}/#about`} className={styles.mobileLink} onClick={(e) => handle("about", e)}>
            <span className={styles.mobileLinkIdx}>03</span>{t('about')}
          </a>
          <a href={`${prefix}/#contact`} className={styles.mobileLink} onClick={(e) => handle("contact", e)}>
            <span className={styles.mobileLinkIdx}>04</span>{t('contact')}
          </a>
        </nav>

        <div className={styles.overlayFooter}>
          <span className={styles.overlayBrand}>joanna.dev</span>
          <LocaleSwitch variant="inverse" onAfterSelect={close} />
        </div>
      </div>
    </>
  );
}
