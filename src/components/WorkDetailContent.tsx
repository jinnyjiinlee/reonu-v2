"use client";

import { useState } from "react";
import { useLang } from "@/context/LanguageContext";
import { IMAGES, type WorkItem } from "@/data/works";
import { StartProjectBtn } from "@/components/Pricing";

// ── Canvas layout ─────────────────────────────────────────────────────────────
const PAD       = 60;
const CONTENT_W = 1800;

// ── Gallery dimensions ────────────────────────────────────────────────────────
const IMG_GAP  = 24;
const HERO_H   = 1013;   // 16:9  (1800 × 1013)
const PAIR_H   = 1110;   // 4:5   (888 × 1110)
export const PAIR_W = (CONTENT_W - IMG_GAP) / 2;  // 888
const CLOSE_H  = 1013;   // 16:9  (1800 × 1013)

const FOOTER_GAP = 120;
const FOOTER_H   = 56;
const BOTTOM_PAD = 160;

// GALLERY_TAIL: everything after HERO_TOP — used by WorkDetailPageClient for canvasH
export const GALLERY_TAIL =
  HERO_H + IMG_GAP + PAIR_H + IMG_GAP + CLOSE_H + FOOTER_GAP + FOOTER_H + BOTTOM_PAD;
// = 1013 + 24 + 1110 + 24 + 1013 + 120 + 56 + 200 = 3560

// ── Buttons ───────────────────────────────────────────────────────────────────
const BTN_DUR  = "0.5s";
const BTN_EASE = "cubic-bezier(0.4, 0, 0.2, 1)";
const PILL_H   = 61;
const CIRCLE   = 46;

const LeftArrowSVG = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true" style={{ display: "block", flexShrink: 0 }}>
    <line x1="14" y1="8" x2="3"  y2="8" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="8"  y1="3" x2="3"  y2="8" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
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
        display: "inline-flex", alignItems: "center", gap: 20,
        height: PILL_H, paddingLeft: 20, paddingRight: 23,
        overflow: "hidden", position: "relative", textDecoration: "none",
      }}
    >
      <span style={{
        position: "absolute",
        top: hov ? (PILL_H - CIRCLE) / 2 : 0,
        left: hov ? 10 : 0,
        height: hov ? CIRCLE : PILL_H,
        width: hov ? CIRCLE : "100%",
        borderRadius: 999, background: "#1D1D1F",
        transition: `width ${BTN_DUR} ${BTN_EASE}, height ${BTN_DUR} ${BTN_EASE}, top ${BTN_DUR} ${BTN_EASE}, left ${BTN_DUR} ${BTN_EASE}`,
        zIndex: 0,
      }} />
      <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", position: "relative", zIndex: 2, flexShrink: 0 }}>
        <LeftArrowSVG size={hov ? 26 : 20} />
      </span>
      <span
        className="font-headline text-[25px] leading-[32px] font-medium tracking-normal"
        style={{ whiteSpace: "nowrap", position: "relative", zIndex: 2, color: hov ? "#000000e6" : "#ffffff", transition: `color ${BTN_DUR} ${BTN_EASE}` }}
      >
        See all works
      </span>
    </a>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
// heroTop is measured by WorkDetailPageClient from the actual rendered overlay height
// so the gap between text and hero image is always exactly 64px real.
export default function WorkDetailContent({
  item,
  next,
  heroTop,
}: {
  item: WorkItem;
  next: WorkItem;
  heroTop: number;
}) {
  const { lang } = useLang();
  const title    = item.title[lang];

  const startIdx = IMAGES.indexOf(item.image);
  const gallery  = [0, 1, 2, 3].map((i) => IMAGES[(startIdx + i) % IMAGES.length]);

  // Derive all positions from heroTop
  const pairTop  = heroTop + HERO_H + IMG_GAP;
  const closeTop = pairTop + PAIR_H + IMG_GAP;
  const footerY  = closeTop + CLOSE_H + FOOTER_GAP;

  return (
    <>
      {/* ── Hero image — full width ───────────────────────────────────────────── */}
      <div
        className="absolute"
        style={{ left: PAD, top: heroTop, width: CONTENT_W, height: HERO_H, background: "#F5F5F7", overflow: "hidden" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={gallery[0]} alt={title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
      </div>

      {/* ── 2-up ─────────────────────────────────────────────────────────────── */}
      <div
        className="absolute"
        style={{ left: PAD, top: pairTop, width: PAIR_W, height: PAIR_H, background: "#F5F5F7", overflow: "hidden" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={gallery[1]} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
      </div>
      <div
        className="absolute"
        style={{ left: PAD + PAIR_W + IMG_GAP, top: pairTop, width: PAIR_W, height: PAIR_H, background: "#F5F5F7", overflow: "hidden" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={gallery[2]} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
      </div>

      {/* ── Closing full image ────────────────────────────────────────────────── */}
      <div
        className="absolute"
        style={{ left: PAD, top: closeTop, width: CONTENT_W, height: CLOSE_H, background: "#F5F5F7", overflow: "hidden" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={gallery[3]} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
      </div>

      {/* ── Footer nav ───────────────────────────────────────────────────────── */}
      <div
        className="absolute flex items-end justify-between"
        style={{ left: PAD, top: footerY, width: CONTENT_W, height: FOOTER_H }}
      >
        <SeeAllWorksBtn href="/works" />
        <StartProjectBtn label="Next Project" href={`/works/${next.id}`} />
      </div>
    </>
  );
}
