"use client";

import Image from "next/image";
import Link from "next/link";
import { useLang } from "@/context/LanguageContext";
import { CATEGORY_LABELS, type WorkItem } from "@/data/works";

const C = {
  ink:    "#1D1D1F",
  body:   "#6E6E73",
  muted:  "#86868B",
  paper:  "#ffffff",
  panel:  "#F5F5F7",
  border: "#E5E5E7",
};

// The gallery images cycle from the 4 available mockups
const GALLERY_SRCS = [
  "/images/works/work-01.png",
  "/images/works/work-02.png",
  "/images/works/work-03.png",
  "/images/works/work-04.png",
];

function MobileFooter() {
  return (
    <footer style={{ background: C.ink, color: "#ffffff", padding: "56px 24px 40px" }}>
      <a href="mailto:reonustudio@gmail.com" style={{ display: "block", fontSize: "clamp(18px, 5vw, 28px)", fontWeight: 700, letterSpacing: "-0.02em", color: "#ffffff", textDecoration: "none", marginBottom: 48, wordBreak: "break-all" }}>reonustudio@gmail.com</a>
      <nav style={{ display: "flex", gap: 24, marginBottom: 48, flexWrap: "wrap" }}>
        {[{ label: "WORKS", href: "/works" }, { label: "STUDIO", href: "/studio" }, { label: "CONTACT", href: "/contact" }].map(({ label, href }) => (
          <a key={label} href={href} style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.5)", textDecoration: "none", letterSpacing: "0.06em" }}>{label}</a>
        ))}
      </nav>
      <div style={{ height: 1, background: "rgba(255,255,255,0.12)", marginBottom: 24 }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 13, fontWeight: 800, color: "#ffffff" }}>REONU®</span>
        <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>© {new Date().getFullYear()} REONU Studio</span>
      </div>
    </footer>
  );
}

export default function MobileWorkDetail({ item, next }: { item: WorkItem; next: WorkItem }) {
  const { lang } = useLang();

  return (
    <div className="lg:hidden font-headline" style={{ background: C.paper, color: C.ink }}>

      {/* ── Project info (hero text area) ─────────────────────────────────── */}
      <section style={{
        paddingTop: "calc(54px + 48px)",
        paddingLeft: 24, paddingRight: 24, paddingBottom: 48,
      }}>
        <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", color: C.muted, textTransform: "uppercase", marginBottom: 16 }}>
          {CATEGORY_LABELS[item.category]}
        </p>
        <h1 style={{
          fontSize: "clamp(28px, 8vw, 48px)", fontWeight: 700,
          letterSpacing: "-0.03em", lineHeight: "1.2",
          marginBottom: 20, color: C.ink,
        }}>
          {item.title[lang]}
        </h1>
        <p style={{ fontSize: 15, lineHeight: "170%", color: "#000000b3", maxWidth: "90%" }}>
          {item.description[lang]}
        </p>
      </section>

      {/* ── Hero image (full-width, 16:9) ─────────────────────────────────── */}
      <div style={{ position: "relative", width: "100%", aspectRatio: "16/9", overflow: "hidden", background: C.panel }}>
        <Image
          src={item.image}
          alt={item.title[lang]}
          fill
          style={{ objectFit: "cover" }}
          sizes="100vw"
          priority
        />
      </div>

      {/* ── 2-image pair row ──────────────────────────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, padding: "8px 0" }}>
        {[0, 1].map((offset) => {
          const src = GALLERY_SRCS[(GALLERY_SRCS.indexOf(item.image) + 1 + offset) % GALLERY_SRCS.length];
          return (
            <div key={offset} style={{ position: "relative", width: "100%", aspectRatio: "4/5", overflow: "hidden", background: C.panel }}>
              <Image src={src} alt="" fill style={{ objectFit: "cover" }} sizes="47vw" />
            </div>
          );
        })}
      </div>

      {/* ── Wide closing image ────────────────────────────────────────────── */}
      <div style={{ position: "relative", width: "100%", aspectRatio: "16/9", overflow: "hidden", background: C.panel, marginTop: 8 }}>
        <Image
          src={GALLERY_SRCS[(GALLERY_SRCS.indexOf(item.image) + 3) % GALLERY_SRCS.length]}
          alt=""
          fill
          style={{ objectFit: "cover" }}
          sizes="100vw"
        />
      </div>

      {/* ── Next project ──────────────────────────────────────────────────── */}
      <section style={{ padding: "64px 24px" }}>
        <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", color: C.muted, marginBottom: 24, textTransform: "uppercase" }}>
          {lang === "ko" ? "다음 프로젝트" : "Next Project"}
        </p>
        <Link href={`/works/${next.id}`} style={{ textDecoration: "none", display: "block" }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", color: C.muted, textTransform: "uppercase", marginBottom: 10 }}>
            {next.category}
          </p>
          <h2 style={{ fontSize: "clamp(22px, 6vw, 36px)", fontWeight: 700, letterSpacing: "-0.03em", color: C.ink, lineHeight: 1.2, marginBottom: 20 }}>
            {next.title[lang]}
          </h2>
          <div style={{ position: "relative", width: "100%", aspectRatio: "16/9", overflow: "hidden", borderRadius: 8, background: C.panel }}>
            <Image src={next.image} alt={next.title[lang]} fill style={{ objectFit: "cover" }} sizes="90vw" />
          </div>
        </Link>

        <div style={{ display: "flex", gap: 16, marginTop: 32 }}>
          <Link href="/works" style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: C.panel, color: C.ink,
            padding: "14px 22px", borderRadius: 999,
            fontSize: 14, fontWeight: 700, letterSpacing: "-0.01em",
            textDecoration: "none",
          }}>
            ← {lang === "ko" ? "전체 보기" : "All Works"}
          </Link>
          <Link href="/contact" style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: C.ink, color: "#fff",
            padding: "14px 22px", borderRadius: 999,
            fontSize: 14, fontWeight: 700, letterSpacing: "-0.01em",
            textDecoration: "none",
          }}>
            {lang === "ko" ? "문의하기" : "Start a Project"} →
          </Link>
        </div>
      </section>

      <MobileFooter />
    </div>
  );
}
