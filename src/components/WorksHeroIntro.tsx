"use client";

import { useLang } from "@/context/LanguageContext";
import { useFilterCtx } from "@/context/FilterContext";
import { CATEGORIES, CATEGORY_LABELS } from "@/data/works";

const PAD     = "max(3.125vw, calc(50vw - 900px))";
const REONU_H = "min(14.0625vw, 270px)";
const HERO_H  = "min(calc(14.0625vw + 450px), 720px)";

/* ── View toggle icons ── */
function GridIcon({ color }: { color: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true" style={{ display: "block" }}>
      <rect x="1"    y="1"    width="6.5" height="6.5" rx="1" stroke={color} strokeWidth="1.4" />
      <rect x="10.5" y="1"    width="6.5" height="6.5" rx="1" stroke={color} strokeWidth="1.4" />
      <rect x="1"    y="10.5" width="6.5" height="6.5" rx="1" stroke={color} strokeWidth="1.4" />
      <rect x="10.5" y="10.5" width="6.5" height="6.5" rx="1" stroke={color} strokeWidth="1.4" />
    </svg>
  );
}
function ListIcon({ color }: { color: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true" style={{ display: "block" }}>
      <line x1="1" y1="3.5"  x2="17" y2="3.5"  stroke={color} strokeWidth="1.4" strokeLinecap="round" />
      <line x1="1" y1="9"    x2="17" y2="9"    stroke={color} strokeWidth="1.4" strokeLinecap="round" />
      <line x1="1" y1="14.5" x2="17" y2="14.5" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

export default function WorksHeroIntro() {
  const { lang } = useLang();
  const { filter, setFilter, view, setView } = useFilterCtx();

  return (
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
        background:    "white",
      }}
    >
      {/* Content column — mirrors HeroIntro exactly:
          height:100% (=HERO_H), paddingTop:200px, paddingBottom:24px, pointerEvents:auto
          DevTools shows this as one element: div ?? × HERO_H, Padding 200px 0px 24px */}
      <div
        style={{
          position:      "absolute",
          top:           0,
          left:          PAD,
          right:         PAD,
          height:        "100%",
          boxSizing:     "border-box",
          paddingTop:    "200px",
          paddingBottom: "32px",
          display:       "flex",
          flexDirection: "column",
          overflow:      "visible",
          pointerEvents: "auto",
        }}
      >
        {/* Flex item 1 — REONU zone (description anchored to bottom:0) */}
        <div
          aria-hidden="true"
          style={{ position: "relative", height: REONU_H, flexShrink: 0 }}
        >
          <p
            className="font-headline"
            style={{
              position:      "absolute",
              right:         0,
              bottom:        0,
              margin:        0,
              textAlign:     "left",
              fontSize:      16,
              fontWeight:    500,
              lineHeight:    "160%",
              letterSpacing: 0,
              color:         "#1D1D1F",
              whiteSpace:    "nowrap",
              pointerEvents: "none",
            }}
          >
            {lang === "ko" ? (
              <>
                <span style={{ fontWeight: 800, letterSpacing: "-0.02em" }}>REONU®</span>
                {" "}— 보기 좋은 디자인을 넘어<br />
                브랜드에 실질적인 힘을 더하는 작업을 만듭니다.<br />
                지금까지 함께한 프로젝트들을 살펴보세요.
              </>
            ) : (
              <>
                <span style={{ fontWeight: 800, letterSpacing: "-0.02em" }}>REONU®</span>
                {" "}— beyond good-looking design, building<br />
                work that gives real strength to a brand. Take a look<br />
                at the projects we&apos;ve worked on together so far.
              </>
            )}
          </p>
        </div>

        {/* Flex item 2 — chips + view toggle, marginTop:auto pushes to bottom
            (mirrors info bar in HeroIntro — paddingBottom:24px below) */}
        <div
          style={{
            marginTop:      200,
            display:        "flex",
            alignItems:     "center",
            justifyContent: "space-between",
          }}
        >
          {/* Category filter chips */}
          <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
            {CATEGORIES.map((cat) => {
              const active = filter === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  data-cursor="hidden"
                  className="font-display-headline cursor-none outline-none"
                  style={{
                    fontSize:      18,
                    lineHeight:    "18px",
                    fontWeight:    active ? 700 : 500,
                    letterSpacing: "0.02em",
                    color:      active ? "#1D1D1F" : "#b8b8b8",
                    background: "none",
                    border:     "none",
                    padding:    0,
                    transition: "color 0.25s ease",
                  }}
                >
                  {CATEGORY_LABELS[cat]}
                </button>
              );
            })}
          </div>

          {/* View toggle */}
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <button
              onClick={() => setView("grid")}
              data-cursor="hidden"
              className="cursor-none outline-none"
              style={{ background: "none", border: "none", padding: 0, display: "flex" }}
            >
              <GridIcon color={view === "grid" ? "#1D1D1F" : "#b8b8b8"} />
            </button>
            <button
              onClick={() => setView("list")}
              data-cursor="hidden"
              className="cursor-none outline-none"
              style={{ background: "none", border: "none", padding: 0, display: "flex" }}
            >
              <ListIcon color={view === "list" ? "#1D1D1F" : "#b8b8b8"} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
