"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import styles from "./SiteNav.module.css";

interface Props {
  /** Only passed from the home page — scrolls the custom #scroll-root container */
  onScrollTo?: (id: string) => void;
}

export function SiteNav({ onScrollTo }: Props) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [open, setOpen] = useState(false);

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
      <header className={styles.header}>
        <Link href="/" className={styles.logo} onClick={close}>
          joanna.dev
        </Link>

        <nav className={styles.navLinks} aria-label="Primary">
          <a href="/#services" onClick={(e) => handle("services", e)}>Services</a>
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
          <a href="/#services" className={styles.mobileLink} onClick={(e) => handle("services", e)}>
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
