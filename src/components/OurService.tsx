"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { services } from "@/data/content";
import { useLang } from "@/context/LanguageContext";

const EASE     = "cubic-bezier(0.4, 0, 0.2, 1)";
const FADE_DUR = "0.7s";
const DUR      = "0.5s";
const GAP      = 18;   // 14px visible — matches WorkWithUsBtn GAP_BTN
const ARR_W    = 26;   // 20.5px visible — Mobius: arrow ~24px visible, canvas: 24/0.7875≈30 → 26 fits
const ARR_H    = 26;
const SLOT     = ARR_W + GAP;

const DESIGN_W              = 1920;
// Canvas Y where SelectedWork ends (ROW1_Y 879 + ROW1_H 800 + ROW_GAP 24 + ROW2_H 800)
const WORKS_END_Y           = 2503;
// Mobius structure: outer wrapper starts exactly at WORKS_END_Y.
// Left spacer (section.framer-2l299d 230px) + right spacer (section.framer-epcvge 230px)
// are real structural HTML elements; content begins after them (= WORKS_END_Y + 292px canvas).
// 292px canvas × (1512/1920) = 230px visible @ 1512px viewport.
const GAP_CANVAS            = 292;    // 230px visible gap (matches Mobius section height: 230px)
const HEADING_CANVAS_Y      = WORKS_END_Y + GAP_CANVAS;  // 2795
// WORKS_END_Y(2503) + GAP_CANVAS(292) + 3×ROW_H(323) + 2×INTER_ROW(180) + rowsPaddingBottom(40) = 4164
const SECTION_END_Y         = 4164;   // actual rows end (fallback for dynamicSectionEnd)
const STICKY_TOP            = 166;

// ServiceRow height: h3(72) + marginTop(20) + p(64) + gap-to-chips(71) + chips-2rows(96) = 323
const ROW_H       = 323;
// Right column rows: 541px spacing (323 row + 218 gap) → 218×0.7875 ≈ 172px visible ≈ Mobius gap:180px
const ROW_TOPS    = [2795, 3336, 3877] as const;
/// Inter-row gap: 180px canvas (141.75px visible, matches Mobius gap:180px)
const INTER_ROW   = 180;

/* ── Character-by-character slide-up reveal ── */
function SplitTextReveal({ text, className, style }: {
  text: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const wrapRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const chars = wrap.querySelectorAll<HTMLElement>("[data-c]");
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        chars.forEach(el => { el.style.transform = "translateY(0)"; });
        observer.disconnect();
      }
    }, { threshold: 0.05 });
    observer.observe(wrap);
    return () => observer.disconnect();
  }, []);

  return (
    <h2 ref={wrapRef} className={className} style={{ ...style, overflow: "hidden" }}>
      {text.split("").map((ch, i) => (
        <span
          key={i}
          data-c=""
          style={{
            display: "inline-block",
            transform: "translateY(115%)",
            transition: `transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${i * 35}ms`,
          }}
        >
          {ch === " " ? " " : ch}
        </span>
      ))}
    </h2>
  );
}

/* ── Intersection Observer fade-in hook ── */
function useFadeIn(delay = 0, slideY = 0) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.opacity   = "0";
    el.style.transform = slideY ? `translateY(${slideY}px)` : "";
    el.style.transition = `opacity ${FADE_DUR} ${EASE} ${delay}ms, transform ${FADE_DUR} ${EASE} ${delay}ms`;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity   = "1";
          el.style.transform = "translateY(0)";
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [delay, slideY]);
  return ref;
}

/* ── Arrow + StartProjectBtn ──
 * Phosphor ArrowRight icon (viewBox 0 0 256 256, filled)
 * Mobius: 23.13 × 25.85px actual → REONU: 29 × 33px canvas
 */
// Stroke-based arrow — avoids the "clipped tip" antialiasing issue of filled SVG icons.
// viewBox 0 0 24 24, line (3,12)→(21,12), chevron (14,5)→(21,12)→(14,19).
// Rightmost stroke edge ≈ 21.875/24 × ARR_W canvas, well within SVG bounds.
const ArrowSVG = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={ARR_W} height={ARR_H}
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
    style={{ display: "block", flexShrink: 0 }}
  >
    <path
      d="M5 12h14M12 5l7 7-7 7"
      stroke="#1D1D1F"
      strokeWidth="2.34"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

function StartProjectBtn() {
  const [hov, setHov] = useState(false);
  const [textW, setTextW] = useState(0);
  const textRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const measure = () => {
      if (!textRef.current) return;
      const rect = textRef.current.getBoundingClientRect();
      if (rect.width === 0) return;
      const scale = Math.min(window.innerWidth / 1920, 1);
      setTextW(Math.round(rect.width / scale));
    };
    measure();
    document.fonts.ready.then(measure);
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const ready = textW > 0;
  const EASE_STR = "cubic-bezier(0.4, 0, 0.2, 1)";
  const T = ready ? `transform 0.42s ${EASE_STR}` : "none";
  const containerW = ready ? ARR_W + GAP + textW + 12 : undefined;  // 26+18+textW+12 = textW+56; +12 buffer for arrow tip clearance

  return (
    <div
      data-cursor="hidden"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{ display: "inline-block" }}
    >
      <a
        href="#contact"
        style={{
          display: "block",
          position: "relative",
          width: containerW ?? "max-content",
          height: 58,          // 8px visible gap: text bottom=45, underline top=55.46 → gap 10.46px canvas × 0.7875 ≈ 8px visible
          overflow: "hidden",
          textDecoration: "none",
        }}
      >
        {/* Arrow1 — 평상시 오른쪽, 호버 시 오른쪽으로 exit.
            opacity 0s → 즉시 투명화 → SVG tail이 라인처럼 보이는 현상 원천 차단 */}
        <span style={{
          position: "absolute",
          top: "50%",
          left: 0,
          display: "inline-flex",
          alignItems: "center",
          opacity: hov ? 0 : 1,
          transform: hov
            ? `translateY(-50%) translateX(${ready ? textW + GAP + 40 : 0}px)`
            : `translateY(-50%) translateX(${ready ? textW + GAP : 0}px)`,
          transition: ready
            ? hov
              ? `transform 0.42s ${EASE_STR}, opacity 0s`           // 호버 시: opacity 즉시 스냅
              : `transform 0.42s ${EASE_STR}, opacity 0.3s ${EASE_STR}`  // 리턴 시: 부드럽게 복귀
            : "none",
        }}>
          <ArrowSVG />
        </span>

        {/* Arrow2 — 왼쪽에서 진입 */}
        <span style={{
          position: "absolute",
          top: "50%",
          left: 0,
          display: "inline-flex",
          alignItems: "center",
          opacity: hov ? 1 : 0,
          transform: hov
            ? `translateY(-50%) translateX(0px)`
            : `translateY(-50%) translateX(${-(ARR_W + 40)}px)`,
          transition: ready ? `transform 0.42s ${EASE_STR}, opacity 0.2s ${EASE_STR}` : "none",
        }}>
          <ArrowSVG />
        </span>

        {/* 텍스트 */}
        <span
          ref={textRef}
          className="font-headline text-[32px] leading-[32px] font-medium tracking-[-0.01em] text-[#1D1D1F]"
          style={{
            position: "absolute",
            top: "50%",
            left: 0,
            display: "flex",
            alignItems: "center",
            whiteSpace: "nowrap",
            transform: `translateY(-50%) translateX(${ready && hov ? ARR_W + GAP : 0}px)`,
            transition: T,
          }}
        >
          Start a Project
        </span>

        {/* 언더라인 — Mobius: position:absolute, bottom:0, left:-1px, width:textW only (not full container)
            호버 시 텍스트가 ARR_W+GAP 위치로 이동하므로 언더라인도 그 위치에 고정 */}
        {/* 언더라인 — 호버 시 화살표(0)~텍스트 끝(ARR_W+GAP+textW) 전체 커버
            bottom:6 → 텍스트 하단(42px) + 2px gap ≈ Mobius 스타일 */}
        <span style={{
          position: "absolute",
          bottom: 0,   // gap = 58-0-2.54-45 = 10.46px canvas × 0.7875 ≈ 8px visible
          left: 0,
          width: ready ? ARR_W + GAP + textW : "100%",
          height: 2.54,  // 2px visible: 2 ÷ 0.7875 = 2.54px canvas
          background: "#1D1D1F",
          transform: hov ? "scaleX(1)" : "scaleX(0)",
          transformOrigin: "0% 50%",
          transition: ready ? `transform 0.42s ${EASE_STR}` : "none",
        }} />
      </a>
    </div>
  );
}

/* ── Chip ── */
function Chip({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center h-[44px] px-[20px] rounded-full font-headline text-[16px] leading-[20px] font-semibold tracking-[-0.005em]" style={{ backgroundColor: "#f5f5f5", color: "#000000e6" }}>
      {label}
    </span>
  );
}

/* ── ServiceRow — flex child in right column (no absolute positioning) ── */
function ServiceRow({ title, desc, chips, zIndex, outerRef }: {
  title: string; desc: string[]; chips: string[];
  zIndex: number; outerRef: (el: HTMLDivElement | null) => void;
}) {
  const fadeRef = useFadeIn(0, 28);

  return (
    <div
      ref={outerRef}
      style={{ width: 980, zIndex, flexShrink: 0 }}
    >
      {/* flex-column: [title+desc block] → gap:56 → chips */}
      <div ref={fadeRef} style={{ display: "flex", flexDirection: "column", gap: 56, width: "100%" }}>
        {/* title + desc block — gap:8 */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <h3 className="font-headline text-[71px] leading-[120%] font-bold tracking-[-0.03em]" style={{ color: "#000000e6" }}>
            {title}
          </h3>
          <p className="font-headline text-[20px] leading-[32px] font-normal tracking-[-0.005em]" style={{ color: "#000000b3" }}>
            {desc[0]}<br />{desc[1]}{desc.length > 2 && <><br />{desc[2]}</>}
          </p>
        </div>
        <div className="flex flex-wrap gap-[10px]"
             style={{ width: 900 }}>
          {chips.map((c) => <Chip key={c} label={c} />)}
        </div>
      </div>
    </div>
  );
}

/* ── Main ── */
export default function OurService() {
  const { lang } = useLang();
  const bottomFadeRef = useFadeIn(100, 24);
  const stickyRef     = useRef<HTMLDivElement>(null);  // wraps heading + desc + button (Mobius: Sticky Container)
  const rowsWrapperRef = useRef<HTMLDivElement>(null); // right column rows container — used to measure actual section end
  const rowRefs       = useRef<(HTMLDivElement | null)[]>([]);
  // Sticky container height = viewport height in canvas px (mirrors Mobius 788px visible sticky unit)
  const [stickyHeight, setStickyHeight] = useState(1000);
  // sectionH: measured from actual DOM height of rowsWrapper so the outer div exactly
  // matches content (no empty space at the bottom of the right column).
  const [sectionH, setSectionH] = useState(SECTION_END_Y - WORKS_END_Y);

  // ── Layout cache: updated only on mount/resize/font-load, NOT per scroll frame ──
  // Avoids getBoundingClientRect() + offsetHeight reads inside the hot scroll path.
  const layoutCache = useRef({ dynamicSectionEnd: SECTION_END_Y, stickyH: 1000 });

  useEffect(() => {
    if (stickyRef.current) {
      stickyRef.current.style.transition = "opacity 0.15s linear";
    }

    // Compute viewport height in canvas px — mirrors Mobius sticky container height
    const computeStickyHeight = () => {
      const scale = Math.min(window.innerWidth / DESIGN_W, 1);
      setStickyHeight(Math.round((window.innerHeight - STICKY_TOP) / scale));
    };

    // Measure actual rowsWrapper DOM height → set sectionH to eliminate empty space
    // in the right column below the rows. Called on mount + fonts-ready + resize.
    const measureSectionH = () => {
      const rowsEl = rowsWrapperRef.current;
      if (!rowsEl) return;
      const rowsH = rowsEl.offsetHeight;  // canvas px (layout size, unaffected by CSS scale)
      setSectionH(GAP_CANVAS + rowsH);
    };

    // ── Cache layout values that are expensive to read per-frame ──
    // getBoundingClientRect() forces layout reflow — call only on mount/resize/font-load.
    // dynamicSectionEnd = canvas Y of rowsWrapper bottom (constant between resizes).
    const measureLayout = () => {
      const rowsEl   = rowsWrapperRef.current;
      const stickyEl = stickyRef.current;
      const scale    = Math.min(window.innerWidth / DESIGN_W, 1);
      const scrollY  = (window as any).__virtualY ?? 0;

      const dynamicSectionEnd = rowsEl
        ? (rowsEl.getBoundingClientRect().bottom + scrollY) / scale
        : SECTION_END_Y;
      const stickyH = stickyEl ? stickyEl.offsetHeight : layoutCache.current.stickyH;

      layoutCache.current = { dynamicSectionEnd, stickyH };

      // Dispatch ourservice-end only on layout changes (not per scroll frame).
      // Partners listens to this to position itself correctly.
      window.dispatchEvent(new CustomEvent("ourservice-end", { detail: { y: dynamicSectionEnd } }));
    };

    computeStickyHeight();
    measureSectionH();
    measureLayout();
    document.fonts.ready.then(() => { measureSectionH(); measureLayout(); });
    window.addEventListener("resize", computeStickyHeight);
    window.addEventListener("resize", measureSectionH);
    window.addEventListener("resize", measureLayout);

    // ── Hot scroll path: pure math + DOM writes, zero DOM reads ──
    const update = () => {
      const scale   = Math.min(window.innerWidth / DESIGN_W, 1);
      const scrollY = (window as any).__virtualY ?? 0;

      const stickyEl = stickyRef.current;
      if (!stickyEl) return;

      const { dynamicSectionEnd, stickyH } = layoutCache.current;

      const stickStart = HEADING_CANVAS_Y * scale - STICKY_TOP;
      const stickEnd   = dynamicSectionEnd * scale - stickyH * scale - STICKY_TOP;

      if (scrollY < stickStart) {
        stickyEl.style.transform = "";
      } else if (scrollY <= stickEnd) {
        const naturalVY = HEADING_CANVAS_Y * scale - scrollY;
        stickyEl.style.transform = `translateY(${(STICKY_TOP - naturalVY) / scale}px)`;
      } else {
        const ty = Math.max(0, dynamicSectionEnd - HEADING_CANVAS_Y - stickyH);
        stickyEl.style.transform = `translateY(${ty}px)`;
      }
    };

    window.addEventListener("virtual-scroll", update as EventListener);
    window.addEventListener("resize", update);
    update();
    return () => {
      window.removeEventListener("virtual-scroll", update as EventListener);
      window.removeEventListener("resize", update);
      window.removeEventListener("resize", computeStickyHeight);
      window.removeEventListener("resize", measureSectionH);
      window.removeEventListener("resize", measureLayout);
    };
  }, []);

  // Relative offsets within wrapper (subtract WORKS_END_Y)
  const headingTop = HEADING_CANVAS_Y - WORKS_END_Y;  // 292  (= 230px visible gap)

  return (
    /*
     * ── Mobius-identical flex structure ──────────────────────────────────────
     * div [Our Services]   display:flex flex-direction:row   ← wrapper
     *   div [Left column]  flex-column  width:880
     *     div [left spacer]  height:230px visible            ← section.framer-2l299d
     *     div [Sticky unit]  flex-column  (Mobius: div.framer-1yutiy5)
     *       h2  "Our Service"
     *       div [middle spacer]  578px canvas
     *       div [desc + button]  (Mobius: bottom of sticky unit)
     *   div [Right column] flex-column  flex:1
     *     div [right spacer] height:230px visible            ← section.framer-epcvge
     *     ServiceRow × 3 (flex children)
     * ─────────────────────────────────────────────────────────────────────────
     */
    <div
      className="absolute"
      style={{
        left: 0, top: WORKS_END_Y,
        width: 1920, height: sectionH,
        display: "flex", flexDirection: "row",
      }}
    >
      {/* ── Left column ── flex-column, 880px */}
      <div
        style={{
          width: 880, flexShrink: 0,
          display: "flex", flexDirection: "column",
        }}
      >
        {/* Left spacer — Mobius section.framer-2l299d (height: 230px visible) */}
        <div style={{ height: headingTop, flexShrink: 0 }} />

        {/*
         * Sticky unit — heading + desc + button as ONE flex container.
         * Mirrors Mobius div.framer-1yutiy5 [Sticky Container]:
         *   - JS translateY keeps this entire unit fixed at STICKY_TOP when scrolled
         *   - desc/button at bottom of unit (MIDDLE_SPACER pushes them down)
         */}
        {/*
         * Sticky unit — flex:1 fills remaining left column height after spacer.
         * stickyRef bottom = SECTION_END_Y (aligns with right column bottom).
         * Mirrors Mobius div.framer-1yutiy5 (padding: 0px 20px 40px, flex child filling column).
         */}
        {/*
         * Sticky unit — Mobius div.framer-1yutiy5 구조:
         *   height = viewport canvas px, justify-content: space-between
         *   ├── h2 Our Service  ← 상단
         *   └── desc + button   ← 하단 (Mobius: bottom of sticky unit)
         */}
        <div
          ref={stickyRef}
          style={{
            paddingLeft: 60,    // matches Partners left:60 and right outer margin (1920-880-980=60)
            paddingRight: 60,   // symmetric with paddingLeft
            paddingBottom: 40,  // Mobius: 40px
            flexShrink: 0,
            height: stickyHeight,
            display: "flex", flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          {/* Heading — 상단 */}
          <SplitTextReveal
            text="Our Services"
            className="font-headline font-bold tracking-[-0.05em] text-[#000000]"
            style={{ fontSize: 33, lineHeight: "44px", whiteSpace: "nowrap", fontWeight: 800, fontOpticalSizing: "none", fontVariationSettings: '"opsz" 144' }}
          />

          {/* Desc + Start Project — 하단 (Mobius: gap:40 column) */}
          <div ref={bottomFadeRef} style={{ display: "flex", flexDirection: "column", gap: 40 }}>
            <p
              className="font-headline font-normal tracking-[-0.005em]"
              style={{ fontSize: 18, lineHeight: "170%", width: 280, color: "#000000e6" }}
            >
              {lang === "ko"
                ? <>다양한 브랜드들과 함께<br />폭넓은 디자인 서비스를 제공합니다.</>
                : <>We work with diverse brands<br />to deliver wide-ranging design services.</>
              }
            </p>
            <StartProjectBtn />
          </div>
        </div>
      </div>

      {/* ── Right column ── flex-column, flex:1 */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Right spacer — −6px optical correction: 64px cap sits 6px lower than 34px cap */}
        <div style={{ height: headingTop - 6, flexShrink: 0 }} />

        {/* Rows — gap:180 applies only between ServiceRows. paddingBottom: 40 (Mobius: 0 0 40px). */}
        <div ref={rowsWrapperRef} style={{ display: "flex", flexDirection: "column", gap: INTER_ROW, paddingBottom: 40 }}>
          {/* Branding */}
          <ServiceRow
            title={services.bx.title}
            desc={services.bx.desc[lang]}
            chips={services.bx.chips}
            zIndex={1}
            outerRef={el => { rowRefs.current[0] = el; }}
          />

          {/* UXUI */}
          <ServiceRow
            title={services.uxui.title}
            desc={services.uxui.desc[lang]}
            chips={services.uxui.chips}
            zIndex={2}
            outerRef={el => { rowRefs.current[1] = el; }}
          />

          {/* Editorial */}
          <ServiceRow
            title={services.edit.title}
            desc={services.edit.desc[lang]}
            chips={services.edit.chips}
            zIndex={3}
            outerRef={el => { rowRefs.current[2] = el; }}
          />
        </div>
      </div>
    </div>
  );
}
