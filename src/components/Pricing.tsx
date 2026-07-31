"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { services } from "@/data/content";
import { useLang } from "@/context/LanguageContext";
import SplitTextReveal from "@/components/SplitTextReveal";

const EASE     = "cubic-bezier(0.4, 0, 0.2, 1)";
const FADE_DUR = "0.7s";
// StartProjectBtn constants (mirrors OurService)
const BTN_ARR_W = 26;
const BTN_ARR_H = 26;
const BTN_GAP   = 18;

const DESIGN_W          = 1920;
const LEFT_COL_W        = 880;
// 04/ bottom ≈ 7382+stickyH-40 → +200 screen gap → Pricing heading at 8440
const PRICING_WRAPPER_Y = 8240;
// Left column spacer (= gap between sections, same as OurProcess paddingTop pattern)
const LEFT_SPACER       = 200;
const HEADING_CANVAS_Y  = PRICING_WRAPPER_Y + LEFT_SPACER;   // 8440

// Inter-row gap in rowsWrapper (canvas px): mirrors OurService INTER_ROW(180) spacing
const ROW_GAP           = 180;
// ROW_TOPS[0]=8440 → right col spacer = LEFT_SPACER = 200 (aligns with Pricing heading)
const RIGHT_SPACER      = 194;   // 200 − 6px optical correction (64px cap sits 6px lower than 34px cap)
// Absolute canvas Y (used only as fallback in sticky JS):
const SECTION_END_Y     = 10262;
const STICKY_TOP        = 166;

/* ── Intersection Observer fade-in hook ── */
function useFadeIn(delay = 0) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.opacity = "0";
    el.style.transition = `opacity ${FADE_DUR} ${EASE} ${delay}ms, transform ${FADE_DUR} ${EASE} ${delay}ms`;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity = "1";
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);
  return ref;
}

const BtnArrowSVG = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={BTN_ARR_W} height={BTN_ARR_H}
    viewBox="0 0 24 24" fill="none" aria-hidden="true"
    style={{ display: "block", flexShrink: 0 }}
  >
    <path d="M5 12h14M12 5l7 7-7 7" stroke="#000000e6" strokeWidth="2.34" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export function StartProjectBtn({ label = "Let's Talk", href = "#contact" }: { label?: string; href?: string }) {
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
  const T = ready ? `transform 0.42s ${EASE}` : "none";
  const containerW = ready ? BTN_ARR_W + BTN_GAP + textW + 12 : undefined;

  return (
    <div
      data-cursor="hidden"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{ display: "inline-block" }}
    >
      <a
        href={href}
        style={{
          display: "block", position: "relative",
          width: containerW ?? "max-content",
          height: 58, overflow: "hidden", textDecoration: "none",
        }}
      >
        {/* Arrow1 — right side; exits right on hover */}
        <span style={{
          position: "absolute", top: "50%", left: 0,
          display: "inline-flex", alignItems: "center",
          opacity: hov ? 0 : 1,
          transform: hov
            ? `translateY(-50%) translateX(${ready ? textW + BTN_GAP + 40 : 0}px)`
            : `translateY(-50%) translateX(${ready ? textW + BTN_GAP : 0}px)`,
          transition: ready
            ? hov ? `transform 0.42s ${EASE}, opacity 0s` : `transform 0.42s ${EASE}, opacity 0.3s ${EASE}`
            : "none",
        }}><BtnArrowSVG /></span>

        {/* Arrow2 — enters from left on hover */}
        <span style={{
          position: "absolute", top: "50%", left: 0,
          display: "inline-flex", alignItems: "center",
          opacity: hov ? 1 : 0,
          transform: hov
            ? `translateY(-50%) translateX(0px)`
            : `translateY(-50%) translateX(${-(BTN_ARR_W + 40)}px)`,
          transition: ready ? `transform 0.42s ${EASE}, opacity 0.2s ${EASE}` : "none",
        }}><BtnArrowSVG /></span>

        {/* Text */}
        <span
          ref={textRef}
          className="font-headline text-[32px] leading-[32px] font-medium tracking-[-0.01em]"
          style={{
            color: "#000000e6",
            position: "absolute", top: "50%", left: 0,
            display: "flex", alignItems: "center", whiteSpace: "nowrap",
            transform: `translateY(-50%) translateX(${ready && hov ? BTN_ARR_W + BTN_GAP : 0}px)`,
            transition: T,
          }}
        >{label}</span>

        {/* Underline */}
        <span style={{
          position: "absolute", bottom: 0, left: 0,
          width: ready ? BTN_ARR_W + BTN_GAP + textW : "100%",
          height: 2.54, background: "#1D1D1F",
          transform: hov ? "scaleX(1)" : "scaleX(0)",
          transformOrigin: "0% 50%",
          transition: ready ? `transform 0.42s ${EASE}` : "none",
        }} />
      </a>
    </div>
  );
}

/* ── Circle-check SVG — mirrors Mobius pricing checklist icon ── */
const CheckSVG = () => (
  <svg
    width="24" height="24" viewBox="0 0 24 24"
    fill="none" xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    style={{ flexShrink: 0, display: "block" }}
  >
    <circle cx="12" cy="12" r="10.5" stroke="#1D1D1F" strokeWidth="1.7" />
    <path d="M7.5 12.5l3 3 6-6" stroke="#1D1D1F" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const PRICED = [
  { ...services.bx,   price: { ko: "₩490,000", en: "$370" } },
  { ...services.uxui, price: { ko: "₩790,000", en: "$600" } },
  { ...services.edit, price: { ko: "₩250,000", en: "$190" } },
];

/* ── PriceRow — flex child, mirrors OurService ServiceRow flex-column structure ── */
function PriceRow({ title, desc, chips, price, lang, outerRef }: {
  title: string; desc: string[]; chips: readonly string[]; price: { ko: string; en: string };
  lang: "ko" | "en"; outerRef: (el: HTMLDivElement | null) => void;
}) {
  const fadeRef = useFadeIn(0);

  return (
    /*
     * Flex child — width:100% fills full right column (mirrors OurService ServiceRow).
     * No explicit height — content drives the height (flex layout, not absolute).
     */
    <div ref={outerRef} style={{ width: "100%", flexShrink: 0 }}>
      {/*
       * Inner flex-column gap:56 — mirrors OurService ServiceRow inner structure:
       *   [1] title + desc  (gap:8 inner)
       *   [2] chips         (gap:56 from [1])
       *   [3] price section (gap:56 from [2])
       *   [4] divider       (gap:56 from [3], only between rows)
       */}
      <div ref={fadeRef} style={{ display: "flex", flexDirection: "column", gap: 56 }}>

        {/* [1] title + desc — gap:10 */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <h3 className="font-headline text-[64px] leading-[120%] font-bold tracking-[-0.03em]" style={{ color: "#000000e6" }}>
            {title}
          </h3>
          <p className="font-headline text-[20px] leading-[32px] font-normal tracking-[-0.005em]"
             style={{ color: "#000000b3" }}>
            {desc[0]}<br />{desc[1]}
          </p>
        </div>

        {/* [2] checklist — two flex-column lists side by side */}
        {(() => {
          const mid = Math.ceil(chips.length / 2);
          const leftChips  = chips.slice(0, mid);
          const rightChips = chips.slice(mid);
          const ChipItem = ({ chip }: { chip: string }) => (
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <CheckSVG />
              <span className="font-headline text-[20px] leading-[28px] font-semibold tracking-[-0.005em]" style={{ color: "#000000e6" }}>
                {chip}
              </span>
            </div>
          );
          return (
            <div style={{ display: "flex", flexDirection: "row", gap: 40 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 30 }}>
                {leftChips.map((chip) => <ChipItem key={chip} chip={chip} />)}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 30 }}>
                {rightChips.map((chip) => <ChipItem key={chip} chip={chip} />)}
              </div>
            </div>
          );
        })()}

        {/* [3] price section — gap:56 from [2] */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <span className="font-headline text-[16px] font-bold"
                style={{ color: "#b8b8b8", letterSpacing: "0.02em", lineHeight: "160%" }}>
            STARTING FROM
          </span>
          <div style={{ display: "inline-flex", alignItems: "baseline", gap: 4 }}>
            <span className="font-headline text-[48px] leading-[58px] font-bold tracking-[-0.03em] text-[#1D1D1F]">
              {price[lang]}
            </span>
            <span className="font-headline text-[48px] leading-[120%] tracking-[-0.03em]" style={{ fontWeight: 700, color: "#f5f5f5" }}>
              /project
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}

/* ── BorderContainer — 1px divider line between price rows ── */
function BorderContainer() {
  return (
    <div
      style={{
        width: "100%",
        height: 254,
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        paddingLeft: 20,
        paddingRight: 20,
      }}
    >
      <div style={{ height: 1, width: "100%", backgroundColor: "#88888833" }} />
    </div>
  );
}

/* ── Main ── */
// Offset from Partners.wrapperTop to Pricing.wrapperTop (canvas px).
// = Partners canvas height: paddingTop(200) + heading lineH(44) + gap(64) + 2×rows(110) = 528
const PARTNERS_TO_PRICING_OFFSET = 528;

export default function Pricing() {
  const { lang } = useLang();
  const headingRef     = useFadeIn(0);
  const bottomFadeRef  = useFadeIn(100);
  const stickyRef      = useRef<HTMLDivElement>(null);
  const rowsWrapperRef = useRef<HTMLDivElement>(null);
  const rowRefs        = useRef<(HTMLDivElement | null)[]>([]);

  // Dynamic top position — updated by partners-end event cascade
  const [pricingTop, setPricingTop] = useState(PRICING_WRAPPER_Y);
  // Ref so scroll handler always reads latest value without stale closure
  const headingCanvasYRef = useRef(HEADING_CANVAS_Y);

  // Listen for Partners to broadcast its wrapperTop and reposition accordingly
  useEffect(() => {
    const handler = (e: Event) => {
      const partnersTop = (e as CustomEvent<{ y: number }>).detail?.y;
      if (!partnersTop) return;
      const newTop = Math.round(partnersTop + PARTNERS_TO_PRICING_OFFSET);
      headingCanvasYRef.current = newTop + LEFT_SPACER;
      setPricingTop(newTop);
    };
    window.addEventListener("partners-end", handler);
    return () => window.removeEventListener("partners-end", handler);
  }, []);

  // Sticky unit height = viewport height in canvas px (mirrors OurService / Mobius Sticky Container)
  const [stickyHeight, setStickyHeight] = useState(1000);
  // Section height measured from actual DOM (eliminates empty space, mirrors OurService sectionH)
  const [sectionH, setSectionH] = useState(SECTION_END_Y - PRICING_WRAPPER_Y);

  // After pricingTop changes + DOM re-renders: re-measure dynamicSectionEnd so sticky stickEnd
  // uses the correct canvas Y, then cascade accurate end position to LetsTalkForm.
  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      const rowsEl   = rowsWrapperRef.current;
      const stickyEl = stickyRef.current;
      if (!rowsEl) return;
      const scale    = Math.min(window.innerWidth / DESIGN_W, 1);
      const scrollY  = (window as any).__virtualY ?? 0;
      const dynamicSectionEnd = (rowsEl.getBoundingClientRect().bottom + scrollY) / scale;
      const stickyH  = stickyEl ? stickyEl.offsetHeight : layoutCache.current.stickyH;
      layoutCache.current = { dynamicSectionEnd, stickyH };
      window.dispatchEvent(new CustomEvent("pricing-end", { detail: { y: dynamicSectionEnd } }));
    });
    return () => cancelAnimationFrame(raf);
  }, [pricingTop]);

  // ── Layout cache: updated only on mount/resize/font-load, NOT per scroll frame ──
  const layoutCache = useRef({ dynamicSectionEnd: SECTION_END_Y, stickyH: 1000 });

  useEffect(() => {
    if (stickyRef.current) {
      stickyRef.current.style.transition = "opacity 0.15s linear";
    }

    // Mirrors OurService: sticky unit height = (viewport - STICKY_TOP) in canvas px
    const computeStickyHeight = () => {
      const scale = Math.min(window.innerWidth / DESIGN_W, 1);
      setStickyHeight(Math.round((window.innerHeight - STICKY_TOP) / scale));
    };

    // Mirrors OurService: measure actual rowsWrapper DOM height for exact wrapper height
    const measureSectionH = () => {
      const rowsEl = rowsWrapperRef.current;
      if (!rowsEl) return;
      setSectionH(RIGHT_SPACER + rowsEl.offsetHeight);
    };

    // Cache layout values — getBoundingClientRect() only called on mount/resize, not per frame
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

      const headingY   = headingCanvasYRef.current;
      const stickStart = headingY * scale - STICKY_TOP;
      const stickEnd   = dynamicSectionEnd * scale - stickyH * scale - STICKY_TOP;

      if (scrollY < stickStart) {
        stickyEl.style.transform = "";
      } else if (scrollY <= stickEnd) {
        const naturalVY = headingY * scale - scrollY;
        stickyEl.style.transform = `translateY(${(STICKY_TOP - naturalVY) / scale}px)`;
      } else {
        const ty = Math.max(0, dynamicSectionEnd - headingY - stickyH);
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

  return (
    /*
     * ── Mobius-identical flex structure (mirrors OurService) ─────────────────
     * div [Pricing]      display:flex flex-direction:row   ← wrapper
     *   div [Left col]   flex-column  width:880
     *     div [spacer]   height:200 (= HEADING gap)
     *     div [Sticky]   height:stickyHeight  justify:space-between
     *       div [heading + desc]   ← top
     *       div [bottom text + btn] ← bottom
     *   div [Right col]  flex-column  flex:1
     *     div [spacer]   height:274 (= RIGHT_SPACER, so rows start at ROW_TOPS[0])
     *     div [rows]     flex-column  gap:ROW_GAP  paddingBottom:40
     *       PriceRow × 3 (flex children)
     * ─────────────────────────────────────────────────────────────────────────
     */
    <div
      className="absolute"
      style={{
        left: 0, top: pricingTop,
        width: 1920, height: sectionH,
        paddingTop: 200,
        display: "flex", flexDirection: "row",
      }}
    >
      {/* ── Left column ── flex-column, 880px */}
      <div
        style={{
          width: LEFT_COL_W, flexShrink: 0,
          display: "flex", flexDirection: "column",
        }}
      >

        {/*
         * Sticky unit — mirrors Mobius div.framer-1rsau16 (Sticky Container):
         *   height = viewport canvas px, justifyContent: space-between
         *   ├── heading + desc   ← top
         *   └── bottom text + btn ← bottom
         */}
        <div
          ref={stickyRef}
          style={{
            paddingLeft: 60,
            paddingRight: 60,
            paddingBottom: 40,
            flexShrink: 0,
            height: stickyHeight,
            display: "flex", flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          {/* Top — heading + desc */}
          <div
            ref={headingRef}
            style={{ display: "flex", flexDirection: "column", gap: 16 }}
          >
            <SplitTextReveal
              text="Pricing"
              className="font-headline font-bold tracking-[-0.05em] text-[#000000]"
              style={{ fontSize: 104, lineHeight: "100%", whiteSpace: "nowrap", fontWeight: 800, fontOpticalSizing: "none", fontVariationSettings: '"opsz" 144', paddingBottom: 20 }}
            />
            <p
              className="font-headline text-[20px] leading-[32px] font-normal tracking-[-0.005em]"
              style={{ width: 640, color: "#000000b3" }}
            >
              {lang === "ko"
                ? <>브랜드 구축부터 디지털 경험, 홍보물까지<br />프로젝트의 성격과 필요한 범위에 따라 대표 작업의<br />시작가를 안내드립니다.</>
                : <>From brand identity to digital experiences<br />and print, here are starting prices based on<br />project type and scope.</>
              }
            </p>
          </div>

          {/* Bottom — desc + Let's Talk (mirrors OurService desc + StartProjectBtn) */}
          <div ref={bottomFadeRef} style={{ display: "flex", flexDirection: "column", gap: 64 }}>
            <p
              className="font-headline font-normal tracking-[-0.005em]"
              style={{ fontSize: 18, lineHeight: "170%", width: 280, color: "#000000b3" }}
            >
              {lang === "ko"
                ? <>실제 견적은 상담을 통해<br />함께 조율합니다.</>
                : <>Actual pricing is determined<br />through consultation.</>
              }
            </p>
            <StartProjectBtn label="Let's Talk" href="#contact" />
          </div>
        </div>
      </div>

      {/* ── Right column ── flex-column, flex:1 */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", paddingRight: 60 }}>

        {/* Rows — gap:0, BorderContainer handles spacing between rows */}
        <div
          ref={rowsWrapperRef}
          style={{ display: "flex", flexDirection: "column", gap: 0, paddingBottom: 40 }}
        >
          {PRICED.flatMap((s, i) => {
            const row = (
              <PriceRow
                key={s.title}
                title={s.title}
                desc={s.desc[lang]}
                chips={s.chips}
                price={s.price}
                lang={lang}
                outerRef={(el) => { rowRefs.current[i] = el; }}
              />
            );
            return i < PRICED.length - 1
              ? [row, <BorderContainer key={`border-${i}`} />]
              : [row];
          })}
        </div>
      </div>
    </div>
  );
}
