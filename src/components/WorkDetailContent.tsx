"use client";

import { useState } from "react";
import { useLang } from "@/context/LanguageContext";
import { CATEGORY_LABELS, IMAGES, type WorkItem } from "@/data/works";
import { StartProjectBtn } from "@/components/Pricing";

// ── Canvas layout ─────────────────────────────────────────────────────────────
const PAD        = 60;
const CONTENT_W  = 1800;
const REONU_BOTTOM = 440;

// ── Info elements ────────────────────────────────────────────────────────────
// Gap: REONU_BOTTOM(440) → HERO_TOP(640) = 200px
// category(24) + 40 + title(34) + 24 + desc(54) = 176px → top margin = 12
// Category: 452, Title: 516, Desc: 574
const INFO_ROW_Y  = 617;
const TITLE_H     = 34;

// ── Gallery: hero → 2-up → closing full ──────────────────────────────────────
const IMG_GAP   = 24;
const HERO_TOP  = REONU_BOTTOM + 369;          // 809
const HERO_H    = 1265;                        // ~1.42:1 (ref: 1160×815)

const PAIR_TOP  = HERO_TOP + HERO_H + IMG_GAP; // 1564
const PAIR_H    = 1228;                         // ~1:1.38 (ref: 575×795)
const PAIR_W    = (CONTENT_W - IMG_GAP) / 2;   // 888

const CLOSE_TOP = PAIR_TOP + PAIR_H + IMG_GAP; // 2308
const CLOSE_H   = 1265;                         // ~1.42:1 (ref: 1160×815)

const FOOTER_GAP = 120;
const FOOTER_H   = 56;
const BOTTOM_PAD = 200;

const FOOTER_Y = CLOSE_TOP + CLOSE_H + FOOTER_GAP; // 3188
export const DETAIL_CANVAS_H = FOOTER_Y + FOOTER_H + BOTTOM_PAD; // 3444

// ── Buttons ───────────────────────────────────────────────────────────────────
const BTN_DUR  = "0.5s";
const BTN_EASE = "cubic-bezier(0.4, 0, 0.2, 1)";
const PILL_H   = 48;
const CIRCLE   = 36;

const LeftArrowSVG = () => (
  <svg width={18} height={18} viewBox="0 0 16 16" fill="none" aria-hidden="true" style={{ display: "block", flexShrink: 0 }}>
    <line x1="14" y1="8" x2="3" y2="8" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="8"  y1="3" x2="3" y2="8" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="8"  y1="13" x2="3" y2="8" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

function SeeAllWorksBtn({ href }: { href: string }) {
  const [hov, setHov] = useState(false);
  return (
    <a
      href={href}
      data-cursor="hidden"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      className="cursor-none"
      style={{
        display: "inline-flex", alignItems: "center", gap: 12,
        height: PILL_H, paddingLeft: 8, paddingRight: 28,
        overflow: "hidden", position: "relative", textDecoration: "none",
      }}
    >
      <span style={{
        position: "absolute",
        top: hov ? (PILL_H - CIRCLE) / 2 : 0,
        left: hov ? 8 : 0,
        height: hov ? CIRCLE : PILL_H,
        width: hov ? CIRCLE : "100%",
        borderRadius: 999, background: "#1D1D1F",
        transition: `width ${BTN_DUR} ${BTN_EASE}, height ${BTN_DUR} ${BTN_EASE}, top ${BTN_DUR} ${BTN_EASE}, left ${BTN_DUR} ${BTN_EASE}`,
        zIndex: 0,
      }} />
      <span style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        position: "relative", zIndex: 1, flexShrink: 0,
        width: CIRCLE, height: CIRCLE,
      }}>
        <LeftArrowSVG />
      </span>
      <span
        className="font-headline text-[20px] leading-[24px] font-medium tracking-[-0.01em]"
        style={{
          whiteSpace: "nowrap", position: "relative", zIndex: 1,
          color: hov ? "#1D1D1F" : "#ffffff",
          transform: hov ? "translateX(28px)" : "translateX(0)",
          transition: `color ${BTN_DUR} ${BTN_EASE}, transform ${BTN_DUR} ${BTN_EASE}`,
        }}
      >
        See all works
      </span>
    </a>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function WorkDetailContent({ item, next }: { item: WorkItem; next: WorkItem }) {
  const { lang }    = useLang();
  const title       = item.title[lang];
  const description = item.description[lang];

  const startIdx = IMAGES.indexOf(item.image);
  const gallery  = [0, 1, 2, 3].map((i) => IMAGES[(startIdx + i) % IMAGES.length]);

  return (
    <>
      {/* ── Name + category row — in gap between REONU & hero ──────────────────── */}
      {/* Project name — left */}
      <h1
        className="absolute font-headline"
        style={{
          left: PAD, top: INFO_ROW_Y,
          margin: 0, maxWidth: 1200,
          fontSize: 28, fontWeight: 700, letterSpacing: "-0.02em", lineHeight: "34px",
          color: "#1D1D1F",
        }}
      >
        {title}
      </h1>
      {/* Project description — 24px below title */}
      <p
        className="absolute font-headline"
        style={{
          left: PAD, top: INFO_ROW_Y + TITLE_H + 24,
          margin: 0, maxWidth: 760,
          fontSize: 16, fontWeight: 400, letterSpacing: "-0.01em", lineHeight: "170%",
          color: "#333336", whiteSpace: "pre-line",
        }}
      >
        {description}
      </p>
      {/* Category — left, 40px above title */}
      <span
        className="absolute font-headline"
        style={{
          left: PAD, top: INFO_ROW_Y - 57,
          fontSize: 14, fontWeight: 400, letterSpacing: "-0.01em", lineHeight: "17px",
          color: "#6E6E73",
        }}
      >
        {CATEGORY_LABELS[item.category]}
      </span>

      {/* ── Hero image — full width ───────────────────────────────────────────── */}
      <div
        className="absolute"
        style={{ left: PAD, top: HERO_TOP, width: CONTENT_W, height: HERO_H, background: "#F5F5F7", overflow: "hidden" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={gallery[0]} alt={title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
      </div>

      {/* ── 2-up ─────────────────────────────────────────────────────────────── */}
      <div
        className="absolute"
        style={{ left: PAD, top: PAIR_TOP, width: PAIR_W, height: PAIR_H, background: "#F5F5F7", overflow: "hidden" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={gallery[1]} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
      </div>
      <div
        className="absolute"
        style={{ left: PAD + PAIR_W + IMG_GAP, top: PAIR_TOP, width: PAIR_W, height: PAIR_H, background: "#F5F5F7", overflow: "hidden" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={gallery[2]} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
      </div>

      {/* ── Closing full image ────────────────────────────────────────────────── */}
      <div
        className="absolute"
        style={{ left: PAD, top: CLOSE_TOP, width: CONTENT_W, height: CLOSE_H, background: "#F5F5F7", overflow: "hidden" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={gallery[3]} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
      </div>

      {/* ── Footer nav ───────────────────────────────────────────────────────── */}
      <div
        className="absolute flex items-end justify-between"
        style={{ left: PAD, top: FOOTER_Y, width: CONTENT_W, height: FOOTER_H }}
      >
        <SeeAllWorksBtn href="/works" />
        <StartProjectBtn label="Next Project" href={`/works/${next.id}`} />
      </div>
    </>
  );
}
