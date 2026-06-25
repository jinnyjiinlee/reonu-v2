"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { services } from "@/data/content";
import { useLang } from "@/context/LanguageContext";
import SplitTextReveal from "@/components/SplitTextReveal";

const EASE     = "cubic-bezier(0.4, 0, 0.2, 1)";
const FADE_DUR = "0.7s";
const DUR      = "0.5s";
const GAP      = 20;
const ARR      = 36;
const SLOT     = ARR + GAP;

const DESIGN_W             = 1920;
const HEADING_CANVAS_Y      = 7724;
const ROW_H                 = 450;
const ROW_TOPS              = [7798, 8447, 9096] as const;
const SECTION_END_Y         = ROW_TOPS[2] + ROW_H;          // 9713
const STICKY_TOP            = 166;
// Unglue when UXUI Design row starts — heading then tracks with it (like OurService).
const HEADING_STICK_END_Y    = ROW_TOPS[1];                  // 8447
const BOTTOM_CANVAS_Y        = HEADING_CANVAS_Y + 650;        // 8541
const STICKY_BOTTOM          = 200;
const BOTTOM_ELEMENT_H       = 116;   // desc(68) + StartProjectBtn(48) in canvas px
// Sticky elements fade out (instead of sliding/jumping or suddenly starting to
// move) over the last bit of their pinned range, ending right at their unglue
// point — masks the velocity change when they go from "stuck" to "scrolling".
const FADE_RANGE             = 100;

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

const ArrowSVG = () => (
  <svg width="36" height="22" viewBox="0 0 36 22" fill="none" aria-hidden="true"
       style={{ display: "block", flexShrink: 0 }}>
    <line x1="8"  y1="11" x2="28" y2="11" stroke="#1D1D1F" strokeWidth="2.4" strokeLinecap="round" />
    <line x1="19" y1="3"  x2="28" y2="11" stroke="#1D1D1F" strokeWidth="2.4" strokeLinecap="round" />
    <line x1="19" y1="19" x2="28" y2="11" stroke="#1D1D1F" strokeWidth="2.4" strokeLinecap="round" />
  </svg>
);

export function StartProjectBtn({ label = "Let's Talk", href = "#contact" }: { label?: string; href?: string }) {
  const [hov, setHov] = useState(false);
  const textRef = useRef<HTMLSpanElement>(null);
  const [clipW, setClipW] = useState<number | null>(null);

  useLayoutEffect(() => {
    const measure = () => {
      if (textRef.current)
        setClipW(Math.ceil(textRef.current.getBoundingClientRect().width) + SLOT + 2);
    };
    measure();
    document.fonts.ready.then(measure);
  }, [label]);

  return (
    <div data-cursor="hidden" style={{ width: clipW ?? "max-content", overflow: "hidden" }}>
      <a
        href={href}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        className="font-headline text-[28px] leading-[34px] font-medium tracking-[-0.01em] text-[#1D1D1F] no-underline"
        style={{
          display: "inline-flex", alignItems: "center", gap: GAP, paddingBottom: 12,
          transform: hov ? "translateX(0)" : `translateX(-${SLOT}px)`,
          transition: `transform ${DUR} ${EASE}`,
        }}
      >
        <span style={{ display: "inline-flex", alignItems: "center", width: ARR }}><ArrowSVG /></span>
        <span ref={textRef} style={{ whiteSpace: "nowrap" }}>{label}</span>
        <span style={{ display: "inline-flex", alignItems: "center", width: ARR }}><ArrowSVG /></span>
      </a>
      <span style={{
        display: "block", height: 1.5, background: "#1D1D1F", marginLeft: 4,
        transform: hov ? "scaleX(1)" : "scaleX(0)",
        transformOrigin: "left center",
        transition: `transform ${DUR} ${EASE}`,
      }} />
    </div>
  );
}

const PILL_H   = 48;
const PILL_CIRCLE = 36;
const PILL_EASE = "cubic-bezier(0.4, 0, 0.2, 1)";
const PILL_DUR  = "0.5s";

const PillArrowSVG = () => (
  <svg width="18" height="18" viewBox="0 0 16 16" fill="none" aria-hidden="true" style={{ display: "block", flexShrink: 0 }}>
    <line x1="2" y1="8" x2="13" y2="8" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="8" y1="3" x2="13" y2="8" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="8" y1="13" x2="13" y2="8" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

function LetsTalkPillBtn({ label = "Let's Talk", href = "#contact" }: { label?: string; href?: string }) {
  const [hov, setHov] = useState(false);
  return (
    <a
      href={href}
      data-cursor="hidden"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "inline-flex", alignItems: "center", gap: 12,
        height: PILL_H, paddingLeft: 28, paddingRight: 8,
        overflow: "hidden", position: "relative", textDecoration: "none",
      }}
    >
      <span style={{
        position: "absolute",
        top: hov ? (PILL_H - PILL_CIRCLE) / 2 : 0,
        right: hov ? 8 : 0,
        height: hov ? PILL_CIRCLE : PILL_H,
        width: hov ? PILL_CIRCLE : "100%",
        borderRadius: 999, background: "#1D1D1F",
        transition: `width ${PILL_DUR} ${PILL_EASE}, height ${PILL_DUR} ${PILL_EASE}, top ${PILL_DUR} ${PILL_EASE}, right ${PILL_DUR} ${PILL_EASE}`,
        zIndex: 0,
      }} />
      <span
        className="font-headline text-[20px] leading-[24px] font-medium tracking-[-0.01em]"
        style={{
          whiteSpace: "nowrap", position: "relative", zIndex: 1,
          color: hov ? "#1D1D1F" : "#ffffff",
          transform: hov ? "translateX(-28px)" : "translateX(0)",
          transition: `color ${PILL_DUR} ${PILL_EASE}, transform ${PILL_DUR} ${PILL_EASE}`,
        }}
      >
        {label}
      </span>
      <span style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        position: "relative", zIndex: 1, flexShrink: 0,
        width: PILL_CIRCLE, height: PILL_CIRCLE,
      }}>
        <PillArrowSVG />
      </span>
    </a>
  );
}

const PRICED = [
  { ...services.bx,   price: "₩490,000" },
  { ...services.uxui, price: "₩790,000" },
  { ...services.edit, price: "₩250,000" },
] as const;

function CheckIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="#1D1D1F" strokeWidth="1.5" fill="none" />
      <path
        d="M8 12.3 11 15.2 16.5 8.8"
        stroke="#1D1D1F"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ── PriceRow — outer ref for sticky stacking, inner for fade-in ── */
function PriceRow({ title, desc, chips, price, top, zIndex, outerRef, showDivider }: {
  title: string; desc: string[]; chips: readonly string[]; price: string; top: number;
  zIndex: number; outerRef: (el: HTMLDivElement | null) => void; showDivider?: boolean;
}) {
  const fadeRef = useFadeIn(0);

  return (
    <div
      ref={outerRef}
      className="absolute"
      style={{ left: 880, top, width: 980, height: ROW_H, zIndex }}
    >
      <div ref={fadeRef} style={{ position: "relative", width: "100%", height: "100%" }}>
        <h3 className="absolute font-headline text-[40px] leading-[48px] font-bold tracking-[-0.03em] text-[#1D1D1F]"
            style={{ top: 0, left: 0 }}>
          {title}
        </h3>

        <p className="absolute font-headline text-[16px] leading-[26px] font-normal tracking-[-0.005em] text-[#333336]"
           style={{ top: 72, left: 0, width: 400 }}>
          {desc[0]}<br />{desc[1]}
        </p>

        {chips.map((chip, i) => {
          const col = i % 2;
          const row = Math.floor(i / 2);
          return (
            <div
              key={chip}
              className="absolute flex items-center gap-[8px]"
              style={{ left: col === 0 ? 0 : 356, top: 172 + row * 56 }}
            >
              <CheckIcon />
              <span className="font-headline text-[16px] leading-[20px] font-medium tracking-[-0.005em] text-[#1D1D1F]">
                {chip}
              </span>
            </div>
          );
        })}

        {/* STARTS FROM */}
        <div
          className="absolute font-headline text-[14px] leading-[17px] font-medium tracking-[0.08em] text-[#6E6E73]"
          style={{ left: 3, top: 374 }}
        >
          STARTS FROM
        </div>

        {/* price */}
        <div
          className="absolute font-headline text-[40px] leading-[48px] font-bold tracking-[-0.03em] text-[#1D1D1F]"
          style={{ left: 3, top: 401 }}
        >
          {price}
        </div>

        {/* / PROJECT */}
        <div
          className="absolute font-headline text-[38px] leading-[46px] font-bold tracking-[-0.03em] text-[#F5F5F7]"
          style={{ left: 220, top: 401 }}
        >
          / PROJECT
        </div>

        {/* divider — 100px below price block, next row starts 100px below this */}
        {showDivider && (
          <div className="absolute bg-[#F5F5F7]" style={{ left: 0, top: 549, width: 900, height: 1 }} />
        )}
      </div>
    </div>
  );
}

/* ── Main ── */
export default function Pricing() {
  const { lang } = useLang();
  const headingRef    = useFadeIn(0);
  const bottomFadeRef = useFadeIn(100);
  const stickyRef     = useRef<HTMLDivElement>(null);
  const bottomRef     = useRef<HTMLDivElement>(null);
  const rowRefs       = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (stickyRef.current) {
      stickyRef.current.style.transition = "opacity 0.15s linear";
    }

    const update = () => {
      const scale   = Math.min(window.innerWidth / DESIGN_W, 1);
      const scrollY = window.scrollY;

      const vh              = window.innerHeight;
      const stickStart      = HEADING_CANVAS_Y * scale - STICKY_TOP;
      const headingStickEnd = HEADING_STICK_END_Y * scale - STICKY_TOP;

      // ── Left heading sticky ──
      const headingEl = stickyRef.current;
      if (headingEl) {
        if (scrollY < stickStart) {
          headingEl.style.transform = "";
          headingEl.style.opacity = "1";
        } else if (scrollY <= headingStickEnd) {
          const naturalVY = HEADING_CANVAS_Y * scale - scrollY;
          headingEl.style.transform = `translateY(${(STICKY_TOP - naturalVY) / scale}px)`;
          headingEl.style.opacity = "1";
        } else {
          // Track UXUI Design row — scrolls up with it (same as OurService behavior).
          headingEl.style.transform = `translateY(${HEADING_STICK_END_Y - HEADING_CANVAS_Y}px)`;
          headingEl.style.opacity = "1";
        }
      }

      // ── Bottom desc + btn sticky (bottom: 200) ──
      const bottomEl = bottomRef.current;
      if (bottomEl) {
        const bottomStickY = vh - STICKY_BOTTOM - BOTTOM_ELEMENT_H * scale;
        const bStickStart  = BOTTOM_CANVAS_Y * scale - bottomStickY;
        // Same as OurService — unglue once SECTION_END_Y - BOTTOM_ELEMENT_H reaches bottomStickY.
        const bStickEnd    = (SECTION_END_Y - BOTTOM_ELEMENT_H) * scale - bottomStickY;

        if (scrollY < bStickStart) {
          bottomEl.style.transform = "";
        } else if (scrollY <= bStickEnd) {
          const naturalVY = BOTTOM_CANVAS_Y * scale - scrollY;
          bottomEl.style.transform = `translateY(${(bottomStickY - naturalVY) / scale}px)`;
        } else {
          const frozenNatVY = BOTTOM_CANVAS_Y * scale - bStickEnd;
          bottomEl.style.transform = `translateY(${(bottomStickY - frozenNatVY) / scale}px)`;
        }
      }
    };

    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <>
      {/* Left — Pricing heading + intro (sticky wrapper) */}
      <div
        ref={stickyRef}
        className="absolute"
        style={{ left: 60, top: HEADING_CANVAS_Y }}
      >
        <div ref={headingRef}>
          <SplitTextReveal
            text="Pricing"
            className="font-headline text-[40px] leading-[48px] font-bold tracking-[-0.03em] text-[#1D1D1F]"
            style={{ whiteSpace: "nowrap" }}
          />
          <p
            className="font-headline text-[16px] leading-[26px] font-normal tracking-[-0.005em] text-[#333336]"
            style={{ marginTop: 24, width: 400 }}
          >
            {lang === "ko"
              ? <>브랜드 구축부터 디지털 경험, 홍보물까지 프로젝트의 성격과<br />필요한 범위에 따라 대표 작업의 시작가를 안내드립니다.</>
              : <>From brand identity to digital experiences and print,<br />here are starting prices based on project type and scope.</>
            }
          </p>
        </div>
      </div>

      {/* Left — caption + Let's Talk (bottom sticky wrapper) */}
      <div ref={bottomRef} className="absolute" style={{ left: 60, top: BOTTOM_CANVAS_Y }}>
        <div ref={bottomFadeRef}>
          <p
            className="font-headline font-medium tracking-[-0.005em] text-[#6E6E73]"
            style={{ fontSize: 14, lineHeight: "22px", marginBottom: 40, width: 280 }}
          >
            {lang === "ko"
              ? <>실제 견적은 상담을 통해<br />함께 조율합니다.</>
              : <>Final pricing is discussed<br />and adjusted through consultation.</>
            }
          </p>
          <StartProjectBtn />
        </div>
      </div>

      {/* Right — service + price rows with sticky stacking */}
      {PRICED.map((s, i) => (
        <PriceRow
          key={s.title}
          title={s.title}
          desc={s.desc[lang]}
          chips={s.chips}
          price={s.price}
          top={ROW_TOPS[i]}
          zIndex={i + 1}
          outerRef={(el) => { rowRefs.current[i] = el; }}
          showDivider={i < PRICED.length - 1}
        />
      ))}
    </>
  );
}
