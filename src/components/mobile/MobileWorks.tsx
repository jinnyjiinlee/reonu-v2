"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useLang } from "@/context/LanguageContext";
import { WORKS_DATA, CATEGORIES, type Filter } from "@/data/works";

const C = {
  ink:    "#1D1D1F",
  body:   "#6E6E73",
  muted:  "#86868B",
  paper:  "#ffffff",
  panel:  "#F5F5F7",
  border: "#E5E5E7",
};

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

export default function MobileWorks() {
  const { lang } = useLang();
  const ko = lang === "ko";
  const [filter, setFilter] = useState<Filter>("All");

  const filtered = filter === "All" ? WORKS_DATA : WORKS_DATA.filter(w => w.category === filter);

  const FILTER_LABELS: Record<Filter, string> = {
    All: "ALL",
    Branding: "Brand",
    "UX/UI": "Digital",
    Editorial: "Editorial",
  };

  return (
    <div className="lg:hidden font-headline" style={{ background: C.paper, color: C.ink }}>

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section style={{
        paddingTop: "calc(64px + 48px)",
        paddingLeft: 24, paddingRight: 24, paddingBottom: 48,
      }}>
        <h1 style={{ fontSize: "clamp(48px, 14vw, 80px)", fontWeight: 800, lineHeight: 0.95, letterSpacing: "-0.05em", marginBottom: 20 }}>
          Works
        </h1>
        <p style={{ fontSize: 15, color: "#000000b3", lineHeight: "170%", marginBottom: 0 }}>
          {ko
            ? "지금까지 REONU®가 만들어온 결과물들을 확인해보세요."
            : "Explore the work REONU® has created."
          }
        </p>
      </section>

      {/* ── Filter chips ──────────────────────────────────────────────────── */}
      <div style={{ paddingLeft: 24, paddingRight: 24, paddingBottom: 32, display: "flex", gap: 8, flexWrap: "wrap" }}>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            style={{
              background: filter === cat ? C.ink : C.panel,
              color: filter === cat ? "#ffffff" : C.body,
              border: "none", borderRadius: 999,
              padding: "8px 18px",
              fontSize: 13, fontWeight: 700, letterSpacing: "0.02em",
              cursor: "pointer",
              transition: "background 0.2s ease, color 0.2s ease",
            }}
          >
            {FILTER_LABELS[cat]}
          </button>
        ))}
      </div>

      {/* ── Works grid ────────────────────────────────────────────────────── */}
      <div style={{ padding: "0 24px 80px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {filtered.map((work) => (
          <Link key={work.id} href={`/works/${work.id}`} style={{ textDecoration: "none", display: "block" }}>
            <div style={{
              position: "relative", width: "100%", aspectRatio: "4/5",
              overflow: "hidden", borderRadius: 8, background: C.panel,
            }}>
              <Image
                src={work.image}
                alt={work.title[lang]}
                fill
                style={{ objectFit: "cover" }}
                sizes="(max-width: 1023px) 47vw, 400px"
              />
            </div>
            <div style={{ padding: "10px 2px 6px" }}>
              <p style={{
                fontSize: 13, fontWeight: 700, color: C.ink,
                margin: "0 0 4px", lineHeight: "130%",
                letterSpacing: "-0.02em",
                overflow: "hidden", textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical" as const,
              }}>
                {work.title[lang]}
              </p>
              <p style={{
                fontSize: 10, fontWeight: 700, letterSpacing: "0.07em",
                color: C.muted, textTransform: "uppercase", margin: 0,
              }}>
                {FILTER_LABELS[work.category as Filter]}
              </p>
            </div>
          </Link>
        ))}
      </div>

      <MobileFooter />
    </div>
  );
}
