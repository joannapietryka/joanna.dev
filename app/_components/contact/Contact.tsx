"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import styles from "./Contact.module.css";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Gsap = any;

type Field = "name" | "email" | "message";

interface FormState {
  name: string;
  email: string;
  message: string;
}

interface Errors {
  name?: string;
  email?: string;
  message?: string;
}

function validate(form: FormState): Errors {
  const errors: Errors = {};
  if (!form.name.trim()) errors.name = "Name is required.";
  if (!form.email.trim()) {
    errors.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = "Enter a valid email address.";
  }
  if (!form.message.trim()) errors.message = "Message is required.";
  else if (form.message.trim().length < 10)
    errors.message = "Message must be at least 10 characters.";
  return errors;
}

export function Contact() {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [form, setForm] = useState<FormState>({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [serverError, setServerError] = useState("");

  useEffect(() => {
    let retryTimer: ReturnType<typeof setTimeout>;
    let cancelled = false;
    const tryInit = () => {
      if (cancelled) return;
      const gsap: Gsap = (window as Gsap).gsap;
      const ST: Gsap   = (window as Gsap).ScrollTrigger;
      if (!gsap || !ST) { retryTimer = setTimeout(tryInit, 80); return; }
      const h2 = headingRef.current;
      if (!h2) return;
      const scroller = document.getElementById("scroll-root") ?? undefined;
      const words = (h2.textContent || "").trim().split(/\s+/);
      h2.innerHTML = words
        .map((w) => `<span style="display:inline-block">${w}</span>`)
        .join(" ");
      const wordEls = Array.from(h2.querySelectorAll<HTMLElement>("span"));
      gsap.set(wordEls, { y: 60, opacity: 0, rotation: -6 });
      gsap.to(wordEls, {
        y: 0, opacity: 1, rotation: 0,
        stagger: 0.1, duration: 0.65, ease: "power3.out",
        scrollTrigger: { trigger: h2, scroller, start: "top 85%", once: true },
      });
    };
    tryInit();
    return () => { cancelled = true; clearTimeout(retryTimer); };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const next = { ...form, [name]: value };
    setForm(next);
    if (touched[name as Field]) setErrors(validate(next));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name } = e.target;
    setTouched((t) => ({ ...t, [name]: true }));
    setErrors(validate(form));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ name: true, email: true, message: true });
    const errs = validate(form);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setStatus("sending");
    setServerError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setServerError(data.error ?? "Something went wrong.");
        setStatus("error");
      } else {
        setStatus("success");
        setForm({ name: "", email: "", message: "" });
        setTouched({});
        setErrors({});
      }
    } catch {
      setServerError("Network error — please try again.");
      setStatus("error");
    }
  };

  return (
    <section className={styles.contact} id="contact">
      {/* ── ambient blobs ─────────────────────────────────────────── */}
      <div className={styles.blobs} aria-hidden="true">
        <div className={`${styles.blob} ${styles.blob1}`} />
        <div className={`${styles.blob} ${styles.blob2}`} />
        <div className={`${styles.blob} ${styles.blob3}`} />
      </div>

      <div className={styles.inner}>
        {/* ── left: copy + bubble ───────────────────────────────────── */}
        <div className={styles.left}>
          <div className={styles.meta}>
            <span className={styles.metaPill}>SYS.MSG // OPEN</span>
            <span className={styles.metaDot} />
            <span className={styles.metaStatus}>Accepting projects</span>
          </div>

          <h2 ref={headingRef} className={styles.heading}>
            Write me a message
          </h2>

          <p className={styles.body}>
            Have a project in mind, a question, or just want to
            say&nbsp;hello? I&rsquo;d love to hear from you.
          </p>

          <a href="mailto:pietrykajoanna@gmail.com" className={styles.emailLink}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <rect x="2" y="4" width="20" height="16" rx="2"/>
              <path d="m22 7-10 7L2 7"/>
            </svg>
            pietrykajoanna@gmail.com
          </a>

          {/* bubble: mix-blend-mode:screen knocks out the black bg */}
          <div className={styles.bubbleWrap} aria-hidden="true">
            <Image
              src="/assets/bubble.png"
              alt=""
              width={520}
              height={520}
              className={styles.bubble}
              priority
            />
          </div>
        </div>

        {/* ── right: form card ──────────────────────────────────────── */}
        <div className={styles.right}>
          <div className={styles.card}>
            {/* corner labels like heroCard */}
            <div className={styles.cardLabel}>INITIATE_SEQ // MSG</div>
            <div className={`${styles.cardLabel} ${styles.cardLabelBr}`}>
              AXIS_X:&nbsp;420.5&nbsp;//&nbsp;AXIS_Y:&nbsp;890.1
            </div>

            {status === "success" ? (
              <div className={styles.success}>
                <div className={styles.successRing}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <p className={styles.successTitle}>Message&nbsp;sent.</p>
                <p className={styles.successBody}>
                  Thanks for reaching out — I&rsquo;ll be in touch soon.
                </p>
                <button type="button" className={styles.resetBtn} onClick={() => setStatus("idle")}>
                  Send another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className={styles.form}>
                <div className={styles.field}>
                  <label htmlFor="c-name" className={styles.label}>Name</label>
                  <input
                    id="c-name" name="name" type="text" autoComplete="name"
                    placeholder="Your name"
                    value={form.name} onChange={handleChange} onBlur={handleBlur}
                    className={`${styles.input}${errors.name && touched.name ? ` ${styles.inputErr}` : ""}`}
                  />
                  {errors.name && touched.name && <span className={styles.errMsg}>{errors.name}</span>}
                </div>

                <div className={styles.field}>
                  <label htmlFor="c-email" className={styles.label}>Email</label>
                  <input
                    id="c-email" name="email" type="email" autoComplete="email"
                    placeholder="your@email.com"
                    value={form.email} onChange={handleChange} onBlur={handleBlur}
                    className={`${styles.input}${errors.email && touched.email ? ` ${styles.inputErr}` : ""}`}
                  />
                  {errors.email && touched.email && <span className={styles.errMsg}>{errors.email}</span>}
                </div>

                <div className={styles.field}>
                  <label htmlFor="c-msg" className={styles.label}>Message</label>
                  <textarea
                    id="c-msg" name="message" rows={5}
                    placeholder="Tell me about your project…"
                    value={form.message} onChange={handleChange} onBlur={handleBlur}
                    className={`${styles.textarea}${errors.message && touched.message ? ` ${styles.inputErr}` : ""}`}
                  />
                  {errors.message && touched.message && <span className={styles.errMsg}>{errors.message}</span>}
                </div>

                {status === "error" && <p className={styles.srvErr}>{serverError}</p>}

                <button type="submit" className={styles.submitBtn} disabled={status === "sending"}>
                  {status === "sending" ? (
                    <><span className={styles.spinner} />Sending…</>
                  ) : (
                    <>
                      Send message
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                        <line x1="5" y1="12" x2="19" y2="12"/>
                        <polyline points="12 5 19 12 12 19"/>
                      </svg>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
