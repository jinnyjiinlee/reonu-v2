"use client";

import { useLang } from "@/context/LanguageContext";
import LocalTime from "@/components/LocalTime";

const PAD = "max(3.125vw, calc(50vw - 900px))";
const REONU_PH_H = "min(14.0625vw, 270px)";

// Hero white cover height — must match page.tsx white cover div
const HERO_H = "min(45.78125vw, 879px)";

// Line-reveal animation timing (Möbius-style)
const EASE = "cubic-bezier(0.16, 1, 0.3, 1)";
const DUR  = "0.85s";

const lineWrap: React.CSSProperties = {
  overflow: "hidden",
  display:  "block",
};

const lineInner = (delay: number): React.CSSProperties => ({
  display:    "block",
  animation:  `line-reveal ${DUR} ${EASE} ${delay}s both`,
  willChange: "transform",
});

export default function HeroIntro() {
  const { lang } = useLang();

  const lines =
    lang === "en"
      ? [
          <><span style={{ fontWeight: 800 }}>REONU®</span> — a design studio that uncovers</>,
          <>the value already embedded in a brand and</>,
          <>realizes it as sharp, scalable design.</>,
        ]
      : [
          <><span style={{ fontWeight: 800 }}>REONU®</span> — 브랜드 안에 이미 담겨 있는 가치를 발견하고</>,
          <>그것을 선명하고 확장 가능한 디자인으로 구현하는</>,
          <>디자인 스튜디오입니다.</>,
        ];

  return (
    // ── Full-width hero zone ───────────────────────────────────────────────────
    <div
      style={{
        position:      "absolute",
        top:           0,
        left:          0,
        right:         0,
        height:        HERO_H,
        overflow:      "visible",
        pointerEvents: "none",
        zIndex:        3,
      }}
    >
      {/* ── Content column ─────────────────────────────────────────────────────
          height: 100% + box-sizing: border-box → fills exactly HERO_H.
          paddingBottom: 24px → info bar always sits exactly 24px above images.
          marginTop: auto on info bar → pushes it to the bottom of the flex column. */}
      <div
        style={{
          position:      "absolute",
          top:           0,
          left:          PAD,
          right:         PAD,
          height:        "100%",
          boxSizing:     "border-box",
          paddingTop:    "min(10.4167vw, 200px)",
          paddingBottom: "24px",
          display:       "flex",
          flexDirection: "column",
          gap:           64,
          overflow:      "visible",
          pointerEvents: "auto",
        }}
      >
        {/* Flex item 1 — REONU placeholder */}
        <div
          aria-hidden="true"
          style={{ height: REONU_PH_H, flexShrink: 0, pointerEvents: "none" }}
        />

        {/* Flex item 2 — Intro paragraph (64px below REONU) */}
        <div
          style={{
            maxWidth:      "min(81.6vw, 1234px)",
            color:         "#000000e6",
            fontSize:      20,
            fontWeight:    500,
            lineHeight:    "160%",
            letterSpacing: 0,
            pointerEvents: "none",
          }}
          className="font-display-headline"
        >
          {lines.map((line, i) => (
            <span key={i} style={lineWrap}>
              <span style={lineInner(0.15 + i * 0.13)}>{line}</span>
            </span>
          ))}
        </div>

        {/* Flex item 3 — Info bar
            marginTop: auto → pushed to bottom of column.
            paddingBottom: 24px on parent → sits exactly 24px above images. */}
        <div
          style={{
            marginTop:     "auto",
            display:       "flex",
            alignItems:    "center",
            gap:           24,
            pointerEvents: "none",
          }}
        >
          <span
            className="font-headline"
            style={{ fontSize: 14, fontWeight: 600, letterSpacing: "0.02em", lineHeight: "14px", color: "#b0b0b0" }}
          >
            Global Design Studio
          </span>

          <div style={{ marginLeft: "auto" }}>
            <LocalTime fontSize={14} color="#b0b0b0" fontWeight={600} letterSpacing="0.02em" />
          </div>
        </div>
      </div>
    </div>
  );
}
