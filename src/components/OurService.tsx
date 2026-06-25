"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { services } from "@/data/content";
import { useLang } from "@/context/LanguageContext";

const EASE     = "cubic-bezier(0.4, 0, 0.2, 1)";
const FADE_DUR = "0.7s";
const DUR      = "0.5s";
const GAP      = 20;
const ARR      = 36;
const SLOT     = ARR + GAP;

const DESIGN_W              = 1920;
const HEADING_CANVAS_Y      = 2610;
const SECTION_END_Y         = 3790;   // EDIT Design bottom (3522 + 268)
const STICKY_TOP            = 166;
const HEADING_STICK_END_Y   = 3074;   // UXUI Design top — heading unglues here
const BOTTOM_CANVAS_Y       = HEADING_CANVAS_Y + 650;  // 3260 — matches Pricing pattern; gives sticky window from heading-stick to section-end
const STICKY_BOTTOM         = 200;    // px from viewport bottom (element bottom target)
const BOTTOM_ELEMENT_H      = 116;    // desc(68) + StartProjectBtn(48) in canvas px
// Sticky elements fade out (instead of jumping or suddenly starting to move)
// over the last bit of their pinned range, ending right at their unglue point —
// masks the velocity change when they go from "stuck" to "scrolling".
const FADE_RANGE            = 150;

// Right column row canvas Y positions
const ROW_TOPS = [2626, 3074, 3522] as const;

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

/* ── Arrow + StartProjectBtn ── */
const ArrowSVG = () => (
  <svg width="36" height="22" viewBox="0 0 36 22" fill="none" aria-hidden="true"
       style={{ display: "block", flexShrink: 0 }}>
    <line x1="8"  y1="11" x2="28" y2="11" stroke="#1D1D1F" strokeWidth="2.4" strokeLinecap="round" />
    <line x1="19" y1="3"  x2="28" y2="11" stroke="#1D1D1F" strokeWidth="2.4" strokeLinecap="round" />
    <line x1="19" y1="19" x2="28" y2="11" stroke="#1D1D1F" strokeWidth="2.4" strokeLinecap="round" />
  </svg>
);

function StartProjectBtn() {
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
  }, []);

  return (
    <div data-cursor="hidden" style={{ width: clipW ?? "max-content", overflow: "hidden" }}>
      <a
        href="#contact"
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
        <span ref={textRef} style={{ whiteSpace: "nowrap" }}>Start Project</span>
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

/* ── Chip ── */
function Chip({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center h-[40px] px-[20px] rounded-full font-headline text-[16px] leading-[20px] font-medium tracking-[-0.005em] text-[#1D1D1F] bg-[#F5F5F7]">
      {label}
    </span>
  );
}

/* ── ServiceRow — outer ref for sticky, inner for fade-in ── */
function ServiceRow({ title, desc, chips, top, zIndex, outerRef }: {
  title: string; desc: string[]; chips: string[]; top: number;
  zIndex: number; outerRef: (el: HTMLDivElement | null) => void;
}) {
  const fadeRef = useFadeIn(0, 28);

  return (
    <div
      ref={outerRef}
      className="absolute"
      style={{ left: 880, top, width: 980, height: 268, zIndex }}
    >
      <div ref={fadeRef} style={{ position: "relative", width: "100%", height: "100%" }}>
        <h3 className="absolute font-headline text-[40px] leading-[48px] font-bold tracking-[-0.03em] text-[#1D1D1F]"
            style={{ top: 0, left: 0 }}>
          {title}
        </h3>
        <p className="absolute font-headline text-[16px] leading-[26px] font-normal tracking-[-0.005em] text-[#333336]"
           style={{ top: 72, left: 0, width: 480 }}>
          {desc[0]}<br />{desc[1]}
        </p>
        <div className="absolute flex flex-wrap gap-x-[8px] gap-y-[16px]"
             style={{ top: 172, left: 0, width: 900 }}>
          {chips.map((c) => <Chip key={c} label={c} />)}
        </div>
      </div>
    </div>
  );
}

/* ── Main ── */
export default function OurService() {
  const { lang } = useLang();
  // headingRef replaced by SplitTextReveal below
  const bottomFadeRef = useFadeIn(100, 24);
  const stickyRef     = useRef<HTMLDivElement>(null);
  const bottomRef     = useRef<HTMLDivElement>(null);
  const rowRefs       = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (stickyRef.current) {
      stickyRef.current.style.transition = "opacity 0.15s linear";
    }

    const update = () => {
      const scale  = Math.min(window.innerWidth / DESIGN_W, 1);
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
          // Track UXUI Design — fixed offset keeps heading scrolling up at the same speed.
          headingEl.style.transform = `translateY(${HEADING_STICK_END_Y - HEADING_CANVAS_Y}px)`;
          headingEl.style.opacity = "1";
        }
      }

      // ── Bottom desc + btn sticky (bottom: 200) ──
      const bottomEl = bottomRef.current;
      if (bottomEl) {
        const bottomStickY    = vh - STICKY_BOTTOM - BOTTOM_ELEMENT_H * scale;
        const bStickStart     = BOTTOM_CANVAS_Y * scale - bottomStickY;
        const bStickEnd       = (SECTION_END_Y - BOTTOM_ELEMENT_H) * scale - bottomStickY;

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
      {/* Left — Our Service heading (sticky wrapper) */}
      <div
        ref={stickyRef}
        className="absolute"
        style={{ left: 60, top: HEADING_CANVAS_Y }}
      >
        <SplitTextReveal
          text="Our Service"
          className="font-headline font-bold tracking-[-0.03em] text-[#1D1D1F]"
          style={{ fontSize: 56, lineHeight: "72px", whiteSpace: "nowrap" }}
        />

      </div>

      {/* Left — desc + Start Project (bottom sticky wrapper) */}
      <div ref={bottomRef} className="absolute" style={{ left: 60, top: BOTTOM_CANVAS_Y }}>
        <div ref={bottomFadeRef}>
          <p
            className="font-headline font-medium tracking-[-0.005em] text-[#6E6E73]"
            style={{ fontSize: 14, lineHeight: "22px", marginBottom: 40, width: 280 }}
          >
            {lang === "ko"
              ? <>다양한 브랜드들과 함께<br />폭넓은 디자인 서비스를 제공합니다.</>
              : <>We work with diverse brands<br />to deliver wide-ranging design services.</>
            }
          </p>
          <StartProjectBtn />
        </div>
      </div>

      {/* Right — service rows with sticky */}
      <ServiceRow
        title={services.bx.title}
        desc={services.bx.desc[lang]}
        chips={services.bx.chips}
        top={2626}
        zIndex={1}
        outerRef={el => { rowRefs.current[0] = el; }}
      />
      <ServiceRow
        title={services.uxui.title}
        desc={services.uxui.desc[lang]}
        chips={services.uxui.chips}
        top={3074}
        zIndex={2}
        outerRef={el => { rowRefs.current[1] = el; }}
      />
      <ServiceRow
        title={services.edit.title}
        desc={services.edit.desc[lang]}
        chips={services.edit.chips}
        top={3522}
        zIndex={3}
        outerRef={el => { rowRefs.current[2] = el; }}
      />
    </>
  );
}
