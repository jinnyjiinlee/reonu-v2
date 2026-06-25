"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useLang } from "@/context/LanguageContext";
import {
  CATEGORIES, CATEGORY_LABELS, IMAGES, WORKS_DATA,
  type Filter, type WorkItem,
} from "@/data/works";

const PAD      = 60;
const COL_GAP  = 40; // 3 cols, content width 1800 → COL_W = (1800 - 40*2)/3
const COL_W    = (1920 - PAD * 2 - COL_GAP * 2) / 3; // ≈ 573.33
const COL_H    = COL_W * (920 / 700); // 700:920 ratio, scaled to COL_W → ≈ 753.78
// paddingTop(32) + category(17) + gap(12) + title, clamped to
// 2 lines (68) = 129, rounded up for breathing room.
const LABEL_H  = 132;
const ROW_GAP  = 40; // matches COL_GAP for a uniform grid gap
const ROW_STRIDE = COL_H + LABEL_H + ROW_GAP; // ≈ 917.78

// Parallax — total px range the image drifts inside its (clipped) frame as the
// card crosses the viewport. The image is rendered taller than its frame —
// OVERSCAN_PCT extra on top and bottom each — so translating it by up to
// ±PARALLAX_RANGE/2 never reveals empty space at the edges.
const PARALLAX_RANGE  = 80;
const OVERSCAN_PCT    = 8; // image height = 100% + 2*8% = 116%

const REONU_BOTTOM = 440;  // REONU hero bottom edge (HEADER_H 66 + GAP 134 + HERO_H 240)
const CHIPS_Y      = REONU_BOTTOM + 200; // 640 — REONU_bottom -200-> chips
const CHIPS_H      = 24;                 // plain-text chip row line-height
const GRID_START_Y = CHIPS_Y + CHIPS_H + 40; // 664 — chips -40-> grid

/* ── View toggle icons ───────────────────────────────────────────────────── */
function GridIcon({ color }: { color: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true" style={{ display: "block" }}>
      <rect x="1" y="1" width="6.5" height="6.5" rx="1" stroke={color} strokeWidth="1.4" />
      <rect x="10.5" y="1" width="6.5" height="6.5" rx="1" stroke={color} strokeWidth="1.4" />
      <rect x="1" y="10.5" width="6.5" height="6.5" rx="1" stroke={color} strokeWidth="1.4" />
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

/* ── List view — compact scannable rows with a cursor-following hover
    preview thumbnail (image swapped per row, smoothed via RAF). ── */
const LIST_ROW_H   = 88;
const LIST_THUMB_W = 280;
const LIST_THUMB_H = 180;

function ListView({ data }: { data: WorkItem[] }) {
  const { lang } = useLang();
  const containerRef = useRef<HTMLDivElement>(null);
  const thumbRef      = useRef<HTMLDivElement>(null);
  const imgRef        = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const thumb = thumbRef.current;
    if (!container || !thumb) return;

    let tx = 0, ty = 0, rx = 0, ry = 0, raf = 0;

    const toLocal = (cx: number, cy: number) => {
      const r = container.getBoundingClientRect();
      const scale = r.width / 1800; // container's intrinsic design width
      return { lx: (cx - r.left) / scale, ly: (cy - r.top) / scale };
    };

    const tick = () => {
      rx += (tx - rx) * 0.2;
      ry += (ty - ry) * 0.2;
      thumb.style.transform = `translate(${rx}px, ${ry}px)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const onMove = (e: MouseEvent) => {
      const { lx, ly } = toLocal(e.clientX, e.clientY);
      tx = lx + 32;
      ty = ly - LIST_THUMB_H / 2;
    };
    container.addEventListener("mousemove", onMove);
    return () => {
      cancelAnimationFrame(raf);
      container.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <div ref={containerRef} style={{ position: "relative", width: 1800 }}>
      {data.map((item, i) => (
        <a
          key={item.id}
          href={`/works/${item.id}`}
          data-cursor="hidden"
          className="font-headline cursor-none"
          onMouseEnter={() => {
            if (imgRef.current) imgRef.current.src = item.image;
            if (thumbRef.current) thumbRef.current.style.opacity = "1";
          }}
          onMouseLeave={() => {
            if (thumbRef.current) thumbRef.current.style.opacity = "0";
          }}
          style={{
            display: "flex", alignItems: "center",
            height: LIST_ROW_H,
            borderBottom: "1px solid #F5F5F7",
            textDecoration: "none",
          }}
        >
          <span
            style={{
              flex: 1, fontSize: 24, lineHeight: "29px", fontWeight: 700,
              letterSpacing: "-0.02em", color: "#1D1D1F",
              whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
              paddingRight: 24,
            }}
          >
            {item.title[lang]}
          </span>
          <span style={{ width: 100, textAlign: "right", fontSize: 14, fontWeight: 500, letterSpacing: "-0.01em", color: "#6E6E73" }}>
            {CATEGORY_LABELS[item.category]}
          </span>
        </a>
      ))}

      {/* Floating hover-preview thumbnail */}
      <div
        ref={thumbRef}
        className="pointer-events-none"
        style={{
          position: "absolute", top: 0, left: 0,
          width: LIST_THUMB_W, height: LIST_THUMB_H,
          opacity: 0, transition: "opacity 0.25s ease",
          overflow: "hidden", background: "#F5F5F7",
          zIndex: 2, willChange: "transform",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img ref={imgRef} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
      </div>
    </div>
  );
}

/* ── WorkCard ─────────────────────────────────────────────────────────────── */
function WorkCard({
  item, x, y, onRegisterParallax,
}: {
  item: WorkItem; x: number; y: number;
  onRegisterParallax?: (card: HTMLElement, img: HTMLElement) => () => void;
}) {
  const cardRef        = useRef<HTMLAnchorElement>(null);
  const pillRef        = useRef<HTMLSpanElement>(null);
  const imgWrapRef     = useRef<HTMLDivElement>(null);
  const imgRef         = useRef<HTMLImageElement>(null);
  const overlayRef     = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const card = cardRef.current;
    const pill = pillRef.current;
    const unregister = card && imgRef.current ? onRegisterParallax?.(card, imgRef.current) : undefined;
    if (!card || !pill) return () => unregister?.();

    let ptx = COL_W / 2, pty = COL_H / 2;
    let prx = ptx,        pry = pty;
    let raf = 0;
    let hovering = false;

    const toLayout = (cx: number, cy: number) => {
      const r = card.getBoundingClientRect();
      return {
        lx: (cx - r.left) * (COL_W / r.width),
        ly: (cy - r.top)  * (COL_H / r.height),
      };
    };

    const tick = () => {
      prx += (ptx - prx) * 0.22; pry += (pty - pry) * 0.22;
      const settled = Math.abs(ptx - prx) < 0.1 && Math.abs(pty - pry) < 0.1;
      if (settled) { prx = ptx; pry = pty; }
      pill.style.transform = `translate(${prx}px, ${pry}px)`;
      if (settled && !hovering) { raf = 0; return; }
      raf = requestAnimationFrame(tick);
    };
    const startTick = () => { if (!raf) raf = requestAnimationFrame(tick); };

    const onMove = (e: MouseEvent) => {
      const { lx, ly } = toLayout(e.clientX, e.clientY);
      ptx = lx + 16; pty = ly + 16;
      startTick();
    };
    const onEnter = (e: MouseEvent) => {
      hovering = true;
      const { lx, ly } = toLayout(e.clientX, e.clientY);
      prx = lx + 16; pry = ly + 16; ptx = prx; pty = pry;
      pill.style.opacity = "1";
      if (imgWrapRef.current) imgWrapRef.current.style.filter = "brightness(0.82)";
      if (overlayRef.current) overlayRef.current.style.opacity = "1";
      startTick();
    };
    const onLeave = () => {
      hovering = false;
      pill.style.opacity = "0";
      if (imgWrapRef.current) imgWrapRef.current.style.filter = "";
      if (overlayRef.current) overlayRef.current.style.opacity = "0";
    };

    card.addEventListener("mousemove",  onMove);
    card.addEventListener("mouseenter", onEnter);
    card.addEventListener("mouseleave", onLeave);
    return () => {
      unregister?.();
      cancelAnimationFrame(raf);
      card.removeEventListener("mousemove",  onMove);
      card.removeEventListener("mouseenter", onEnter);
      card.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  const { lang } = useLang();
  const title = item.title[lang];

  return (
    <div className="absolute" style={{ left: x, top: y, width: COL_W }}>
      {/* Image */}
      <a
        ref={cardRef}
        href={`/works/${item.id}`}
        data-cursor="hidden"
        className="block cursor-none"
        style={{ width: COL_W, height: COL_H, position: "relative", display: "block" }}
      >
        <div style={{ position: "absolute", inset: 0, background: "#F5F5F7", overflow: "hidden" }}>
          <div ref={imgWrapRef} style={{ position: "absolute", inset: 0, transition: "filter 0.5s ease" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              ref={imgRef}
              src={item.image} alt={title}
              style={{
                display: "block", position: "absolute",
                left: 0, right: 0,
                top: `-${OVERSCAN_PCT}%`, height: `${100 + OVERSCAN_PCT * 2}%`,
                width: "100%", objectFit: "cover",
                willChange: "transform",
              }}
            />
          </div>
          <div ref={overlayRef} className="pointer-events-none absolute inset-0 bg-black/20"
               style={{ opacity: 0, transition: "opacity 0.5s ease" }} />
        </div>
        <span
          ref={pillRef}
          className="pointer-events-none absolute top-0 left-0 flex items-center justify-center rounded-full font-headline text-[18px] leading-[22px] font-normal tracking-[-0.01em] text-white"
          style={{
            opacity: 0, transition: "opacity 0.6s ease",
            paddingInline: 20, paddingBlock: 10,
            background: "rgba(30,30,30,0.45)",
            backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)",
            whiteSpace: "nowrap", willChange: "transform", zIndex: 1,
          }}
        >
          Open Project
        </span>
      </a>

      {/* Label — category (small) + bold title only. Description removed:
          a portfolio grid works best scannable (image + category + title),
          with full project detail left for the project page, not the grid. */}
      <div style={{ display: "flex", flexDirection: "column", width: COL_W, paddingTop: 32 }}>
        <span className="font-headline font-normal tracking-[-0.01em] text-[#6E6E73]" style={{ fontSize: 14, lineHeight: "17px", marginBottom: 12 }}>
          {CATEGORY_LABELS[item.category]}
        </span>
        <span
          className="font-headline font-bold tracking-[-0.02em] text-[#1D1D1F]"
          style={{
            fontSize: 28, lineHeight: "34px",
            display: "-webkit-box", WebkitBoxOrient: "vertical", WebkitLineClamp: 2, overflow: "hidden",
          }}
        >
          {title}
        </span>
      </div>
    </div>
  );
}

// Canvas heights (mirrors page.tsx)
const ROWS          = 9;
const GRID_CANVAS_H = GRID_START_Y + (ROWS - 1) * ROW_STRIDE + COL_H + LABEL_H + 320;
const LIST_BOTTOM_PAD = 320;

/* ── Main ─────────────────────────────────────────────────────────────────── */
export default function WorksContent() {
  const [filter, setFilter] = useState<Filter>("All");
  const [view, setView] = useState<"grid" | "list">("grid");
  const filteredData = filter === "All" ? WORKS_DATA : WORKS_DATA.filter((w) => w.category === filter);
  const rootRef = useRef<HTMLDivElement>(null);

  // Parallax — one shared scroll/RAF loop updates every registered card's
  // image, instead of each card running its own listener.
  const parallaxRefs = useRef<{ card: HTMLElement; img: HTMLElement }[]>([]);
  const registerParallax = (card: HTMLElement, img: HTMLElement) => {
    const entry = { card, img };
    parallaxRefs.current.push(entry);
    return () => {
      parallaxRefs.current = parallaxRefs.current.filter((e) => e !== entry);
    };
  };

  useEffect(() => {
    let raf = 0;

    const update = () => {
      const vh = window.innerHeight;
      for (const { card, img } of parallaxRefs.current) {
        const rect = card.getBoundingClientRect();
        const progress = (vh - rect.top) / (vh + rect.height); // 0 → 1 crossing viewport
        const clamped = Math.min(Math.max(progress, 0), 1);
        const offset = (clamped - 0.5) * PARALLAX_RANGE;
        img.style.transform = `translateY(${offset}px)`;
      }
      raf = 0;
    };

    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // Dynamically resize the ScaleStage canvas when switching between
  // grid (tall) and list (short) view so the footer is always reachable.
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const scale = Math.min(window.innerWidth / 1920, 1);
    const listH = GRID_START_Y + filteredData.length * LIST_ROW_H + LIST_BOTTOM_PAD;
    const newH  = view === "list" ? listH : GRID_CANVAS_H;

    const main        = el.closest("main") as HTMLElement | null;
    const innerDiv    = main?.parentElement as HTMLElement | null;   // ScaleStage inner div
    const outerWrap   = innerDiv?.parentElement as HTMLElement | null; // ScaleStage outer wrapper

    if (main)      main.style.height      = `${newH}px`;
    if (innerDiv)  innerDiv.style.height  = `${newH}px`;
    if (outerWrap) outerWrap.style.height = `${newH * scale}px`;
  }, [view, filteredData.length]);

  return (
    <>
      <div ref={rootRef} style={{ position: "absolute", inset: 0, pointerEvents: "none" }} />
      {/* ── Description — right edge flush with PAD, BOTTOM flush with REONU bottom ──
          width: max-content (instead of a fixed px width) so the box sizes to
          its own longest line — with `right: PAD` anchoring, that makes the
          longest line's right edge land exactly on the PAD boundary, the same
          one REONU/nav use, while text stays left-aligned (shorter lines just
          fall short of the right edge naturally, by design).
          3 lines × 32px line-box (160% of 20px font) = 96px block height. Anchor
          so the block's bottom edge sits on REONU_BOTTOM, with +6 to offset the
          bottom half-leading (lineHeight 32 - fontSize 20 = 12, /2 = 6px of empty
          space below the glyph's visible bottom) so the glyph itself — not just
          the line box — lands flush on the line. */}
      <p
        className="absolute font-headline font-medium text-[#1D1D1F]"
        style={{ right: PAD, top: REONU_BOTTOM - 96 + 6, width: "max-content", fontSize: 20, fontWeight: 500, lineHeight: "160%", letterSpacing: 0 }}
      >
        {/* Always English, regardless of the KR/EN language toggle. */}
        <span style={{ fontWeight: 800, letterSpacing: "-0.02em" }}>REONU®</span> — beyond good-looking design, building<br />work that gives real strength to a brand. Take a look<br />at the projects we&apos;ve worked on together so far.
      </p>

      {/* ── Category filter — plain text tabs, no pill/border (wording unified
          with OurService's BX/UXUI/EDIT Design titles, style as before). ── */}
      <div className="absolute flex items-center" style={{ left: PAD, top: CHIPS_Y, gap: 32 }}>
        {CATEGORIES.map((cat) => {
          const active = filter === cat;
          return (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              data-cursor="hidden"
              className="font-headline tracking-[-0.01em] cursor-none outline-none"
              style={{
                fontSize: 20, lineHeight: "24px",
                fontWeight: active ? 700 : 500,
                color: active ? "#1D1D1F" : "#86868B",
                background: "none", border: "none", padding: 0,
                transition: "color 0.25s ease",
              }}
            >
              {CATEGORY_LABELS[cat]}
            </button>
          );
        })}
      </div>

      {/* ── View toggle — grid (default) / list ── */}
      <div className="absolute flex items-center" style={{ right: PAD, top: CHIPS_Y + 3, gap: 14 }}>
        <span className="font-headline tracking-[-0.01em]" style={{ fontSize: 14, fontWeight: 500, color: "#86868B" }}>
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

      {/* ── Project grid / list ── */}
      {view === "grid" ? (
        filteredData.map((item, i) => {
          const row = Math.floor(i / 3);
          const col = i % 3;
          const x = PAD + col * (COL_W + COL_GAP);
          const y = GRID_START_Y + row * ROW_STRIDE;
          return <WorkCard key={item.id} item={item} x={x} y={y} onRegisterParallax={registerParallax} />;
        })
      ) : (
        <div className="absolute" style={{ left: PAD, top: GRID_START_Y, width: 1800 }}>
          <ListView data={filteredData} />
        </div>
      )}
    </>
  );
}

