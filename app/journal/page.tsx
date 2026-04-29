import { SiteNav } from "../_components/site-nav/SiteNav";

export default function JournalPage() {
  return (
    <>
      <SiteNav />
      <div style={{ padding: "8rem 3rem 3rem", fontFamily: "var(--font-sora)", fontSize: "0.9rem" }}>
        <p style={{ opacity: 0.45, textTransform: "uppercase", letterSpacing: "0.12em", fontFamily: "var(--font-jetbrains-mono)", fontSize: "0.65rem" }}>
          Journal
        </p>
        <h1 style={{ marginTop: "1rem", fontSize: "3rem", fontWeight: 900, letterSpacing: "-0.04em" }}>
          Coming soon
        </h1>
      </div>
    </>
  );
}
