"use client";

import { useFilterCtx } from "@/context/FilterContext";
import { CATEGORIES, CATEGORY_LABELS } from "@/data/works";

// PAD must match WorksContent (60px in canvas → "60px" real at 1:1, but
// WorksContent uses canvas px; we need the REAL viewport-space equivalent).
// ScaleStage pads inside the 1920-wide canvas, so canvas-px 60 at scale s =
// 60*s real px — use the same vw-based PAD as WorksHeroIntro for consistency.
const PAD = "max(3.125vw, calc(50vw - 900px))";

// REONU_H — visual baseline height, same constant used in WorksHeroIntro
const REONU_H = "min(14.0625vw, 270px)";

// Position: paddingTop(200px) + REONU_H + purple-spacer(120px) = right after purple
const TOP = `calc(200px + ${REONU_H} + 120px)`;

/* ── Icons ── */
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

export default function WorksChips() {
  const { filter, setFilter, view, setView } = useFilterCtx();

  return (
    <div
      style={{
        position:      "absolute",
        top:           TOP,
        left:          0,
        right:         0,
        height:        24,
        pointerEvents: "auto",
        zIndex:        3,
      }}
    >
      {/* ── Category filter chips — left edge ── */}
      <div
        className="absolute flex items-center"
        style={{ left: PAD, top: 0, gap: 32, pointerEvents: "auto" }}
      >
        {CATEGORIES.map((cat) => {
          const active = filter === cat;
          return (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              data-cursor="hidden"
              className="font-headline tracking-[-0.01em] cursor-none outline-none"
              style={{
                fontSize:   20,
                lineHeight: "24px",
                fontWeight: active ? 700 : 500,
                color:      active ? "#1D1D1F" : "#86868B",
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

      {/* ── View toggle — right edge ── */}
      <div
        className="absolute flex items-center"
        style={{ right: PAD, top: 3, gap: 14, pointerEvents: "auto" }}
      >
        <span
          className="font-headline tracking-[-0.01em]"
          style={{ fontSize: 14, fontWeight: 500, color: "#86868B" }}
        >
          VIEW
        </span>
        <span style={{ width: 1, height: 16, background: "#86868B" }} />
        <button
          onClick={() => setView("grid")}
          data-cursor="hidden"
          className="cursor-none outline-none"
          style={{ background: "none", border: "none", padding: 0, display: "flex" }}
        >
          <GridIcon color={view === "grid" ? "#1D1D1F" : "#86868B"} />
        </button>
        <button
          onClick={() => setView("list")}
          data-cursor="hidden"
          className="cursor-none outline-none"
          style={{ background: "none", border: "none", padding: 0, display: "flex" }}
        >
          <ListIcon color={view === "list" ? "#1D1D1F" : "#86868B"} />
        </button>
      </div>
    </div>
  );
}
