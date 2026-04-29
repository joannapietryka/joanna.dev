import Link from "next/link";

export default function WorkPage() {
  return (
    <div style={{ padding: "3rem", fontSize: "0.9rem" }}>
      <p style={{ opacity: 0.7, textTransform: "uppercase", letterSpacing: "0.1em" }}>
        Work
      </p>
      <h1 style={{ marginTop: "1rem", fontFamily: "var(--font-sora)", fontSize: "3rem" }}>
        Coming soon
      </h1>
      <p style={{ marginTop: "1rem", opacity: 0.6 }}>
        Back to{" "}
        <Link href="/" style={{ textDecoration: "underline" }}>
          Studio Glass
        </Link>
        .
      </p>
    </div>
  );
}

