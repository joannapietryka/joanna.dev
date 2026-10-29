"use client";

import {useLocale, useTranslations} from "next-intl";
import {useRouter} from "next/navigation";
import type {AppLocale} from "@/i18n/routing";
import styles from "./LocaleSwitch.module.css";

type Variant = "default" | "inverse" | "glass";

const LOCALES: {code: AppLocale; labelKey: "langEn" | "langFr" | "langPl"}[] = [
  {code: "en", labelKey: "langEn"},
  {code: "fr", labelKey: "langFr"},
  {code: "pl", labelKey: "langPl"},
];

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

  const switchLocale = (nextLocale: AppLocale) => {
    if (nextLocale === locale) return;
    try {
      const url = new URL(window.location.href);
      let path = url.pathname;
      path = path.replace(/^\/(en|fr|pl)(?=\/|$)/, `/${nextLocale}`);
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
      {LOCALES.map((item, i) => (
        <span key={item.code} style={{display: "contents"}}>
          {i > 0 ? (
            <span className={styles.sep} aria-hidden>
              /
            </span>
          ) : null}
          <button
            type="button"
            className={`${styles.btn} ${locale === item.code ? styles.btnActive : ""}`}
            aria-pressed={locale === item.code}
            onClick={() => switchLocale(item.code)}
          >
            {t(item.labelKey)}
          </button>
        </span>
      ))}
    </div>
  );
}
