"use client";

import { forwardRef } from "react";
import { useLang } from "@/context/LanguageContext";
import { CATEGORY_LABELS, type WorkItem } from "@/data/works";

const PAD     = "max(3.125vw, calc(50vw - 900px))";
const REONU_H = "min(14.0625vw, 270px)"; // matches HeroIntro & WorksHeroIntro placeholder

// forwardRef on the inner content column so WorkDetailPageClient can measure its offsetHeight.
// offsetHeight = paddingTop(200) + REONU_H + gap(64) + info_block + paddingBottom(24)
const WorkDetailHeroIntro = forwardRef<HTMLDivElement, { item: WorkItem }>(
  function WorkDetailHeroIntroInner({ item }, ref) {
    const { lang } = useLang();

    return (
      <div
        style={{
          position:      "absolute",
          top:           0,
          left:          0,
          right:         0,
          pointerEvents: "none",
          zIndex:        3,
        }}
      >
        {/* Content column — mirrors HeroIntro:
            paddingTop:200px, space-between, paddingBottom:24px
            3 flex items: [REONU placeholder] [info block] [empty div]
            space-between distributes remaining space equally → upper & lower purple gaps are equal
            ref here so parent can measure offsetHeight (= bottom of this column from page top) */}
        <div
          ref={ref}
          style={{
            position:       "absolute",
            top:            0,
            left:           PAD,
            right:          PAD,
            minHeight:      "min(45.78125vw, 879px)", // = main page HERO_H → matches DevTools structure
            boxSizing:      "border-box",
            paddingTop:     "min(10.4167vw, 200px)",
            display:        "flex",
            flexDirection:  "column",
            justifyContent: "space-between", // equal gaps above and below info block
            pointerEvents:  "auto",
            overflow:       "visible",
          }}
        >
          {/* Flex item 1 — REONU placeholder */}
          <div aria-hidden="true" style={{ height: REONU_H, flexShrink: 0 }} />

          {/* Flex item 2 — Project info (vertical stack) */}
          <div>
            <span
              className="font-headline font-bold"
              style={{
                display:       "block",
                marginBottom:  "min(calc(10/1920 * 100vw), 10px)",
                fontSize:      "min(calc(16/1920 * 100vw), 16px)",
                fontWeight:    700,
                letterSpacing: "0.06em",
                lineHeight:    "160%",
                color:         "#b8b8b8",
              }}
            >
              {CATEGORY_LABELS[item.category]}
            </span>
            <h1
              className="font-headline"
              style={{
                margin:        "0 0 min(calc(24/1920 * 100vw), 24px) 0",
                maxWidth:      "min(62.5vw, 1200px)",
                fontSize:      "min(calc(34/1920 * 100vw), 34px)",
                fontWeight:    700,
                letterSpacing: "-0.025em",
                lineHeight:    "min(calc(44/1920 * 100vw), 44px)",
                color:         "#1D1D1F",
              }}
            >
              {item.title[lang]}
            </h1>
            <p
              className="font-headline"
              style={{
                margin:        0,
                maxWidth:      "min(45.83vw, 880px)",
                fontSize:      "min(calc(20/1920 * 100vw), 20px)",
                fontWeight:    400,
                letterSpacing: "-0.005em",
                lineHeight:    "min(calc(32/1920 * 100vw), 32px)",
                color:         "#000000b3",
                whiteSpace:    "pre-line",
              }}
            >
              {item.description[lang]}
            </p>
          </div>

          {/* Flex item 3 — empty spacer (0-height)
              space-between places equal free-space above item 2 and between item 2 & 3
              → upper purple gap == lower purple gap in DevTools */}
          <div aria-hidden="true" style={{ height: 0, flexShrink: 0 }} />
        </div>
      </div>
    );
  }
);

WorkDetailHeroIntro.displayName = "WorkDetailHeroIntro";
export default WorkDetailHeroIntro;
