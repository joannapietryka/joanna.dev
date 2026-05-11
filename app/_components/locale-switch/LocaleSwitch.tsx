"use client";

import {useLocale, useTranslations} from "next-intl";
import {usePathname, useRouter} from "next/navigation";
import styles from "./LocaleSwitch.module.css";

type Variant = "default" | "inverse" | "glass";

export function LocaleSwitch({
  className,
  variant = "default",
  onAfterSelect,
}: {
  className?: string;
  variant?: Variant;
  /** e.g. close mobile nav after switching */
  onAfterSelect?: () => void;
}) {
  const t = useTranslations("Nav");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = (nextLocale: "en" | "fr") => {
    if (nextLocale === locale) return;
    try {
      const url = new URL(window.location.href);
      let path = url.pathname;
      path = path.replace(/^\/(en|fr)(?=\/|$)/, `/${nextLocale}`);
      router.push(`${path}${url.search}${url.hash}`);
      onAfterSelect?.();
    } catch {
      router.push(`/${nextLocale}`);
      onAfterSelect?.();
    }
  };

  const rootClass = [
    styles.group,
    variant === "inverse" ? styles.inverse : "",
    variant === "glass" ? styles.glass : "",
    className ?? "",
  ]
    .join(" ")
    .trim();

  return (
    <div className={rootClass} role="group" aria-label={t("languageLabel")}>
      <button
        type="button"
        className={`${styles.btn} ${locale === "en" ? styles.btnActive : ""}`}
        aria-pressed={locale === "en"}
        onClick={() => switchLocale("en")}
      >
        {t("langEn")}
      </button>
      <span className={styles.sep} aria-hidden>
        /
      </span>
      <button
        type="button"
        className={`${styles.btn} ${locale === "fr" ? styles.btnActive : ""}`}
        aria-pressed={locale === "fr"}
        onClick={() => switchLocale("fr")}
      >
        {t("langFr")}
      </button>
    </div>
  );
}
