"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./SiteNav.module.css";

interface Props {
  /** Only passed from the home page — scrolls the custom #scroll-root container */
  onScrollTo?: (id: string) => void;
}

export function SiteNav({ onScrollTo }: Props) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [nearTop, setNearTop] = useState(false);
  /* hideEnabled gates the hide behaviour until the hero entrance is done */
  const [hideEnabled, setHideEnabled] = useState(false);

  useEffect(() => {
    /* reset on every route change so the nav is always visible on arrival */
    setHideEnabled(false);
    setScrolled(false);

    /* pick the right scroll container: custom #scroll-root on home, window elsewhere */
    const scroller = document.getElementById("scroll-root");

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

    if (pathname === "/") {
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
          <a
            href="/services"
            className={pathname === "/services" ? styles.navActive : ""}
            onClick={(e) => handle("services", e)}
          >
            Services
          </a>
          <Link
            href="/work"
            className={pathname === "/work" ? styles.navActive : ""}
            onClick={close}
          >
            Work
          </Link>
          <a href="/#about" onClick={(e) => handle("about", e)}>About me</a>
          <a href="/#contact" onClick={(e) => handle("contact", e)}>Contact</a>
        </nav>

        <button
          className={`${styles.menuToggle} ${open ? styles.isOpen : ""}`}
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
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
          <a href="/services" className={styles.mobileLink} onClick={(e) => handle("services", e)}>
            <span className={styles.mobileLinkIdx}>01</span>Services
          </a>
          <Link href="/work" className={styles.mobileLink} onClick={close}>
            <span className={styles.mobileLinkIdx}>02</span>Work
          </Link>
          <a href="/#about" className={styles.mobileLink} onClick={(e) => handle("about", e)}>
            <span className={styles.mobileLinkIdx}>03</span>About me
          </a>
          <a href="/#contact" className={styles.mobileLink} onClick={(e) => handle("contact", e)}>
            <span className={styles.mobileLinkIdx}>04</span>Contact
          </a>
        </nav>

        <div className={styles.overlayFooter}>joanna.dev</div>
      </div>
    </>
  );
}
