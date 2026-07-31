"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useLang } from "@/context/LanguageContext";

// ── Canvas layout ─────────────────────────────────────────────────────────────
const PAD        = 60;
const CONTENT_W  = 1800;
const DESIGN_W   = 1920;

// ── Single hero image between REONU and Our Values ────────────────────────────
// Matches ContactContent card exactly: left:60, right:60, height:888
const IMG_START_Y   = 754;   // canvas Y right below REONU (REONU bottom ~554 + gap 200)
const IMG_H         = 888;   // matches CARD_H in ContactContent
const IMG_SECTION_H = IMG_H; // 888

// Y_OFFSET: Our Values section starts right after the image
const Y_OFFSET   = IMG_START_Y + IMG_SECTION_H;  // 1528

// ── Our Values section (OurService-style) ─────────────────────────────────────
// Mirrors OurService home page structure exactly
const GAP_CANVAS     = 292;   // blank gap before heading (230px visible @ 1512px)
const VALUES_ROW_H   = 155;   // actual row height without chips (h3~77 + gap10 + p~64 + buffer)
const VALUES_INTER   = 160;   // gap between rows
const VALUES_LEFT_W  = 880;   // left column width (matches OurService)
const STICKY_TOP     = 166;   // px from viewport top where sticky heading pins

// Visual content end (where GROWTH row ends)
const VALUES_CONTENT_END = GAP_CANVAS + VALUES_ROW_H * 3 + VALUES_INTER * 2; // 1117
// Values section: 120px bottom padding (like Möbius), then 80px flex spacer above image
const VALUES_BOTTOM_PAD  = 120;
const IMG_ABOVE_H        = 80;
// Total height of the values section (content + bottom padding)
const VALUES_SECTION_H = VALUES_CONTENT_END + VALUES_BOTTOM_PAD; // 1237

// Absolute canvas Y of the heading (for sticky calc)
const HEADING_CANVAS_Y = Y_OFFSET + GAP_CANVAS; // 2556

// ── Image strip (Möbius-style, below Our Values) ──────────────────────────────
// Total gap from VALUES_CONTENT_END to image: 120 (section bottom) + 80 (flex spacer) = 200
const IMG_STRIP_START = VALUES_CONTENT_END + VALUES_BOTTOM_PAD + IMG_ABOVE_H; // 1317
const IMG_STRIP_H     = 512;
const IMG_STRIP_END   = IMG_STRIP_START + IMG_STRIP_H;            // 1749

// ── Careers section (Pricing-style layout) ────────────────────────────────────
const CAREERS_Y             = IMG_STRIP_END;           // section wrapper flush after strip
const CAREER_SPACER         = 200;                     // 200px top spacer inside both columns
const CAREER_LEFT_W         = VALUES_LEFT_W;           // 880
const CAREER_HEADING_CANVAS_Y = Y_OFFSET + CAREERS_Y + CAREER_SPACER; // global canvas Y for sticky anchor

// ── Portfolio / career data ───────────────────────────────────────────────────
const JOBS: { category: string; items: { ko: string; en: string }[] }[] = [
  {
    category: "Brand / Editorial",
    items: [
      { ko: "교육부 정신건강 가이드북", en: "Ministry of Education Mental Health Guidebook" },
      { ko: "송파구청 일자리 정책담당과 신사업 홍보물", en: "Songpa-gu Office Employment Policy New Business Promotional Materials" },
      { ko: "국어문화원, HK인문학센터 웹포스터", en: "National Institute of Korean Language & HK Humanities Center Web Poster" },
      { ko: "문화체육관광부 홍보 포스터 · 카드뉴스", en: "Ministry of Culture, Sports and Tourism Promotional Poster & Card News" },
      { ko: "국제산악영화제 게스트 가이드북", en: "International Mountain Film Festival Guest Guidebook" },
      { ko: "국민대학교 디자인대학원 홍보물", en: "Kookmin University Graduate School of Design Promotional Materials" },
      { ko: "Tripick 기업 브랜딩 · 서비스 캐릭터", en: "Tripick Corporate Branding & Service Character" },
      { ko: "등 다수 공공기관 · 기업 브랜딩", en: "And more public & corporate branding projects" },
    ],
  },
  {
    category: "Digital",
    items: [
      { ko: "KT (momo) 구축", en: "KT (momo) Platform Build" },
      { ko: "롯데손해보험 (wonder) 구축", en: "Lotte Insurance (wonder) Platform Build" },
      { ko: "신한자산운용 구축 및 운영", en: "Shinhan Asset Management Build & Operation" },
      { ko: "신한카드 구축 운영", en: "Shinhan Card Build & Operation" },
      { ko: "KB증권 구축 및 운영", en: "KB Securities Build & Operation" },
      { ko: "KB자산운용 구축 및 운영", en: "KB Asset Management Build & Operation" },
      { ko: "CJ 온스타일 운영", en: "CJ OnStyle Operation" },
    ],
  },
  {
    category: "Experience",
    items: [
      { ko: "ICT 스타트업 아이시온 운영 및 디자인 총괄", en: "ICT Startup ICION — Head of Design & Operations" },
      { ko: "SK C&C (Vitality Summit) 협업", en: "SK C&C (Vitality Summit) Collaboration" },
      { ko: "ICT Tech Summit 온라인 전시, 체험관", en: "ICT Tech Summit Online Exhibition & Experience Zone" },
      { ko: "스마트미디어 X캠프 우수상 수상", en: "Smart Media X-Camp Excellence Award" },
      { ko: "안구운동 놀이 APP 서비스 특허 등록 완료", en: "Eye Exercise Play App — Service Patent Registered" },
      { ko: "시선추적 기반 안구운동 놀이APP 출시", en: "Eye-Tracking Eye Exercise Play App Launch" },
      { ko: "송파 청년창업도전프로젝트 최종 기업 선정", en: "Songpa Youth Startup Challenge — Final Cohort Selected" },
      { ko: "고려대학교 안암병원 재활의학 컨소시엄", en: "Korea University Anam Hospital Rehabilitation Medicine Consortium" },
      { ko: "미국 실리콘밸리 (One Pitch Society) 최종 피칭 선정", en: "Silicon Valley One Pitch Society — Final Pitch Selection" },
      { ko: "성장기 어린이 안구운동 놀이APP 디자인 논문", en: "Research Paper: Eye Exercise App Design for Children" },
    ],
  },
  {
    category: "Education",
    items: [
      { ko: "국민대학교 디자인대학원 석사", en: "Kookmin University, Graduate School of Design — M.F.A." },
    ],
  },
];

// Actual content ~2492 + 208 buffer + 160 bottom gap = 2700 (≈160px visible gap at scale 0.7875)
export const STUDIO_CANVAS_H = Y_OFFSET + CAREERS_Y + CAREER_SPACER + 2700;

// ── Atoms ─────────────────────────────────────────────────────────────────────
function DownloadLink() {
  const [hov, setHov] = useState(false);
  return (
    <a
      href="#"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      className="font-headline"
      style={{
        display: "inline-block",
        fontSize: 14, fontWeight: 400, letterSpacing: "-0.01em", lineHeight: "20px",
        color: "#000000e6", textDecoration: "underline",
        textUnderlineOffset: 3,
        textDecorationColor: hov ? "#000000e6" : "#00000060",
        transition: "text-decoration-color 0.3s ease",
      }}
    >
      Download Our Profile
    </a>
  );
}

// ── Arrow SVG (matches OurService exactly) ───────────────────────────────────
const ARR_W = 26;
const ARR_H = 26;
const GAP_BTN = 18;

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

// ── Dark pill "Let's Talk" button (mirrors SendMessageBtn in LetsTalkForm) ────
const BTN_PILL_H = 61;
const BTN_CIRCLE = 46;
const BTN_DUR    = "0.5s";
const BTN_EASE   = "cubic-bezier(0.4, 0, 0.2, 1)";

const ArrowSVGWhite = ({ color = "#ffffff", size = 16 }: { color?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true" style={{ display: "block", flexShrink: 0 }}>
    <line x1="2" y1="8" x2="13" y2="8" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    <line x1="8" y1="3" x2="13" y2="8" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    <line x1="8" y1="13" x2="13" y2="8" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

function LetsTalkPillBtn() {
  const [hov, setHov] = useState(false);
  return (
    <a
      href="/contact"
      data-cursor="hidden"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "inline-flex", alignItems: "center", gap: 20,
        height: BTN_PILL_H, minWidth: 200, paddingLeft: 23, paddingRight: 20,
        overflow: "hidden", position: "relative", textDecoration: "none",
      }}
    >
      <span style={{
        position: "absolute", top: hov ? (BTN_PILL_H - BTN_CIRCLE) / 2 : 0,
        right: hov ? 10 : 0, height: hov ? BTN_CIRCLE : BTN_PILL_H,
        width: hov ? BTN_CIRCLE : "100%", borderRadius: 999, background: "#1D1D1F",
        transition: `width ${BTN_DUR} ${BTN_EASE}, height ${BTN_DUR} ${BTN_EASE}, top ${BTN_DUR} ${BTN_EASE}, right ${BTN_DUR} ${BTN_EASE}`,
        zIndex: 0,
      }} />
      <span
        className="font-headline text-[25px] leading-[32px] font-medium tracking-normal"
        style={{
          whiteSpace: "nowrap", position: "relative", zIndex: 2,
          color: hov ? "#000000e6" : "#ffffff",
          transition: `color ${BTN_DUR} ${BTN_EASE}`,
        }}
      >
        Start a Project
      </span>
      <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", position: "relative", zIndex: 2, flexShrink: 0 }}>
        <ArrowSVGWhite color="#ffffff" size={hov ? 26 : 20} />
      </span>
    </a>
  );
}

function WorkWithUsBtn({ lang }: { lang: string }) {
  const [hov, setHov] = useState(false);
  const [textW, setTextW] = useState(0);
  const textRef = useRef<HTMLSpanElement>(null);
  const label = "Work With Us";

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
  }, [lang]);

  const ready = textW > 0;
  const EASE_STR = "cubic-bezier(0.4, 0, 0.2, 1)";
  const T = ready ? `transform 0.42s ${EASE_STR}` : "none";
  const containerW = ready ? ARR_W + GAP_BTN + textW + 12 : undefined;

  return (
    <div
      data-cursor="hidden"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{ display: "inline-block" }}
    >
      <a
        href="/contact"
        style={{
          display: "block",
          position: "relative",
          width: containerW ?? "max-content",
          height: 58,
          overflow: "hidden",
          textDecoration: "none",
        }}
      >
        {/* Arrow1 — exits right on hover */}
        <span style={{
          position: "absolute", top: "50%", left: 0,
          display: "inline-flex", alignItems: "center",
          opacity: hov ? 0 : 1,
          transform: hov
            ? `translateY(-50%) translateX(${ready ? textW + GAP_BTN + 40 : 0}px)`
            : `translateY(-50%) translateX(${ready ? textW + GAP_BTN : 0}px)`,
          transition: ready
            ? hov
              ? `transform 0.42s ${EASE_STR}, opacity 0s`
              : `transform 0.42s ${EASE_STR}, opacity 0.3s ${EASE_STR}`
            : "none",
        }}>
          <ArrowSVG />
        </span>

        {/* Arrow2 — enters from left on hover */}
        <span style={{
          position: "absolute", top: "50%", left: 0,
          display: "inline-flex", alignItems: "center",
          opacity: hov ? 1 : 0,
          transform: hov
            ? `translateY(-50%) translateX(0px)`
            : `translateY(-50%) translateX(${-(ARR_W + 40)}px)`,
          transition: ready ? `transform 0.42s ${EASE_STR}, opacity 0.2s ${EASE_STR}` : "none",
        }}>
          <ArrowSVG />
        </span>

        {/* Text */}
        <span
          ref={textRef}
          className="font-headline text-[32px] leading-[32px] font-medium tracking-[-0.01em] text-[#1D1D1F]"
          style={{
            position: "absolute", top: "50%", left: 0,
            display: "flex", alignItems: "center",
            whiteSpace: "nowrap",
            transform: `translateY(-50%) translateX(${ready && hov ? ARR_W + GAP_BTN : 0}px)`,
            transition: T,
          }}
        >
          {label}
        </span>

        {/* Underline */}
        <span style={{
          position: "absolute", bottom: 0, left: 0,
          width: ready ? ARR_W + GAP_BTN + textW : "100%",
          height: 2.54,
          background: "#1D1D1F",
          transform: hov ? "scaleX(1)" : "scaleX(0)",
          transformOrigin: "0% 50%",
          transition: ready ? `transform 0.42s ${EASE_STR}` : "none",
        }} />
      </a>
    </div>
  );
}

function JoinUsLink() {
  const [hov, setHov] = useState(false);
  return (
    <a
      href="#contact"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      className="font-headline"
      style={{
        display: "inline-flex", alignItems: "center", gap: 4,
        fontSize: 14, fontWeight: 500, letterSpacing: "-0.01em",
        color: "#000000e6",
        textDecoration: "underline",
        textUnderlineOffset: 3,
        textDecorationColor: hov ? "#000000e6" : "#00000060",
        transition: "text-decoration-color 0.3s ease",
      }}
    >
      -&gt; Join Us
    </a>
  );
}

// ── SplitTextReveal (OurService-identical) ────────────────────────────────────
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

// ── useFadeIn ─────────────────────────────────────────────────────────────────
const EASE     = "cubic-bezier(0.4, 0, 0.2, 1)";
const FADE_DUR = "0.7s";

function useFadeIn(delay = 0, slideY = 0) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.opacity    = "0";
    el.style.transform  = slideY ? `translateY(${slideY}px)` : "";
    el.style.transition = `opacity ${FADE_DUR} ${EASE} ${delay}ms, transform ${FADE_DUR} ${EASE} ${delay}ms`;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        el.style.opacity   = "1";
        el.style.transform = "translateY(0)";
        observer.disconnect();
      }
    }, { threshold: 0.1 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [delay, slideY]);
  return ref;
}

// ── ValueRow (like OurService ServiceRow but for studio values) ───────────────
function ValueRow({
  title, ko, desc,
}: {
  title: string;
  ko: string;
  desc: string[];
}) {
  const fadeRef = useFadeIn(0, 28);
  return (
    <div style={{ width: 980, flexShrink: 0 }}>
      <div ref={fadeRef} style={{ display: "flex", flexDirection: "column", gap: 56 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {/* Title + KO label (mirrors Pricing ₩ / project style) */}
          <h3
            style={{ display: "inline-flex", alignItems: "baseline", gap: 12, margin: 0, marginBottom: -2 }}
          >
            <span className="font-headline text-[64px] leading-[120%] font-bold tracking-[-0.03em]"
                  style={{ color: "#000000e6" }}>
              {title}
            </span>
            <span className="font-headline text-[48px] leading-[120%] tracking-[-0.03em]"
                  style={{ fontWeight: 700, color: "#f5f5f5" }}>
              {ko}
            </span>
          </h3>
          {/* Description */}
          <p
            className="font-headline text-[20px] leading-[32px] font-normal tracking-[-0.005em]"
            style={{ color: "#000000b3" }}
          >
            {desc[0]}<br />{desc[1]}{desc[2] && <><br />{desc[2]}</>}
          </p>
        </div>
      </div>
    </div>
  );
}

// ── CheckSVG (matches Pricing.tsx exactly) ────────────────────────────────────
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

// ── CareerBorderContainer (matches Pricing BorderContainer) ──────────────────
function CareerBorderContainer() {
  return (
    <div style={{ width: "100%", height: 200, flexShrink: 0, display: "flex", flexDirection: "column", justifyContent: "center" }}>
      <div style={{ height: 1, width: "100%", backgroundColor: "#88888833" }} />
    </div>
  );
}

// ── CareerRow (PriceRow-style but for career categories) ─────────────────────
function CareerRow({ category, items, lang }: { category: string; items: { ko: string; en: string }[]; lang: "ko" | "en" }) {
  const fadeRef = useFadeIn(0, 28);
  return (
    <div style={{ width: "100%", flexShrink: 0 }}>
      <div ref={fadeRef} style={{ display: "flex", flexDirection: "column", gap: 40 }}>
        <h3
          className="font-headline text-[64px] leading-[120%] font-bold tracking-[-0.03em]"
          style={{ color: "#000000e6" }}
        >
          {category.includes(" / ")
            ? category.split(" / ").reduce<React.ReactNode[]>((acc, part, i, arr) => {
                acc.push(<span key={`t${i}`}>{part}</span>);
                if (i < arr.length - 1) acc.push(
                  <span key={`s${i}`} style={{ fontSize: 48, color: "#f5f5f5" }}> / </span>
                );
                return acc;
              }, [])
            : category}
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {items.map((item, i) => (
            <span
              key={i}
              className="font-headline font-medium tracking-[-0.005em]"
              style={{ fontSize: 20, lineHeight: "28px", color: "#000000e6" }}
            >
              {item[lang]}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function StudioContent() {
  const { lang } = useLang();

  // Sticky state (mirrors OurService)
  const stickyRef      = useRef<HTMLDivElement>(null);
  const rowsWrapperRef = useRef<HTMLDivElement>(null);
  const bottomFadeRef  = useFadeIn(100, 24);
  const [stickyHeight, setStickyHeight] = useState(1000);
  const [valuesBottomPad, setValuesBottomPad] = useState(VALUES_BOTTOM_PAD);
  const layoutCache = useRef({ dynamicSectionEnd: Y_OFFSET + VALUES_SECTION_H, stickyH: 1000 });

  // Careers sticky state (mirrors Our Values sticky)
  const careerStickyRef      = useRef<HTMLDivElement>(null);
  const careerRowsWrapperRef = useRef<HTMLDivElement>(null);
  const [careerStickyHeight, setCareerStickyHeight] = useState(1000);
  const careerLayoutCache = useRef({ dynamicSectionEnd: Y_OFFSET + CAREERS_Y + 3000, stickyH: 1000 });

  // Image ticker refs
  const tickerInnerRef     = useRef<HTMLDivElement>(null);
  const tickerContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const inner     = tickerInnerRef.current;
    const container = tickerContainerRef.current;
    if (!inner || !container) return;

    let pos      = 0;    // current translateX in canvas px (always ≤ 0)
    let halfW    = 0;    // half the inner ticker width = one set of images
    let rafId    = 0;
    let dragging = false;
    let lastX    = 0;
    const SPEED  = 1.2; // canvas px per frame (~72 canvas px/s at 60fps)

    const tick = () => {
      if (halfW === 0) halfW = inner.scrollWidth / 2;

      if (!dragging) pos -= SPEED;

      // Seamless loop: when we've scrolled one full set, snap back
      if (pos <= -halfW) pos += halfW;
      if (pos > 0)       pos  = pos % -halfW || 0;

      inner.style.transform = `translateX(${pos}px)`;
      rafId = requestAnimationFrame(tick);
    };

    const onMouseDown = (e: MouseEvent) => {
      dragging = true;
      lastX = e.clientX;
      container.style.cursor = "grabbing";
      e.preventDefault();
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!dragging) return;
      const scale = Math.min(window.innerWidth / DESIGN_W, 1);
      const dx    = (e.clientX - lastX) / scale; // viewport px → canvas px
      lastX       = e.clientX;
      pos        += dx;
      if (pos <= -halfW) pos += halfW;
      if (pos > 0)       pos -= halfW;
    };

    const onMouseUp = () => {
      dragging = false;
      container.style.cursor = "grab";
    };

    container.style.cursor     = "grab";
    container.style.userSelect = "none";
    container.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove",    onMouseMove);
    window.addEventListener("mouseup",      onMouseUp);

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      container.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove",    onMouseMove);
      window.removeEventListener("mouseup",      onMouseUp);
    };
  }, []);

  useEffect(() => {
    if (stickyRef.current) stickyRef.current.style.transition = "opacity 0.15s linear";

    const computeStickyHeight = () => {
      const scale = Math.min(window.innerWidth / DESIGN_W, 1);
      const sh = Math.round((window.innerHeight - STICKY_TOP) / scale);
      setStickyHeight(sh);
      // CTA bottom should align with Growth row bottom (= VALUES_CONTENT_END - GAP_CANVAS from sticky top = 785).
      // CTA bottom = stickyH - paddingBottom → paddingBottom = stickyH - 785.
      // For small viewports the sticky mechanism handles alignment; for large viewports (sh ≥ 905) we increase paddingBottom.
      const rowsBottom = VALUES_CONTENT_END - GAP_CANVAS; // 785
      setValuesBottomPad(Math.max(VALUES_BOTTOM_PAD, sh - rowsBottom));
    };

    const measureLayout = () => {
      const rowsEl   = rowsWrapperRef.current;
      const stickyEl = stickyRef.current;
      const scale    = Math.min(window.innerWidth / DESIGN_W, 1);
      const scrollY  = (window as any).__virtualY ?? 0;

      const dynamicSectionEnd = rowsEl
        ? (rowsEl.getBoundingClientRect().bottom + scrollY) / scale
        : Y_OFFSET + VALUES_SECTION_H;
      const stickyH = stickyEl ? stickyEl.offsetHeight : layoutCache.current.stickyH;

      layoutCache.current = { dynamicSectionEnd, stickyH };
    };

    computeStickyHeight();
    measureLayout();
    document.fonts.ready.then(measureLayout);
    window.addEventListener("resize", computeStickyHeight);
    window.addEventListener("resize", measureLayout);

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
      window.removeEventListener("resize", measureLayout);
    };
  }, []);

  // Careers sticky useEffect (mirrors Our Values sticky)
  useEffect(() => {
    const computeHeight = () => {
      const scale = Math.min(window.innerWidth / DESIGN_W, 1);
      setCareerStickyHeight(Math.round((window.innerHeight - STICKY_TOP) / scale));
    };

    const measureLayout = () => {
      const rowsEl   = careerRowsWrapperRef.current;
      const stickyEl = careerStickyRef.current;
      const scale    = Math.min(window.innerWidth / DESIGN_W, 1);
      const scrollY  = (window as any).__virtualY ?? 0;

      const dynamicSectionEnd = rowsEl
        ? (rowsEl.getBoundingClientRect().bottom + scrollY) / scale
        : Y_OFFSET + CAREERS_Y + 3000;
      const stickyH = stickyEl ? stickyEl.offsetHeight : careerLayoutCache.current.stickyH;
      careerLayoutCache.current = { dynamicSectionEnd, stickyH };
    };

    computeHeight();
    measureLayout();
    document.fonts.ready.then(measureLayout);
    window.addEventListener("resize", computeHeight);
    window.addEventListener("resize", measureLayout);

    const update = () => {
      const scale   = Math.min(window.innerWidth / DESIGN_W, 1);
      const scrollY = (window as any).__virtualY ?? 0;
      const stickyEl = careerStickyRef.current;
      if (!stickyEl) return;

      const { dynamicSectionEnd, stickyH } = careerLayoutCache.current;
      const stickStart = CAREER_HEADING_CANVAS_Y * scale - STICKY_TOP;
      const stickEnd   = dynamicSectionEnd * scale - stickyH * scale - STICKY_TOP;

      if (scrollY < stickStart) {
        stickyEl.style.transform = "";
      } else if (scrollY <= stickEnd) {
        const naturalVY = CAREER_HEADING_CANVAS_Y * scale - scrollY;
        stickyEl.style.transform = `translateY(${(STICKY_TOP - naturalVY) / scale}px)`;
      } else {
        const ty = Math.max(0, dynamicSectionEnd - CAREER_HEADING_CANVAS_Y - stickyH);
        stickyEl.style.transform = `translateY(${ty}px)`;
      }
    };

    window.addEventListener("virtual-scroll", update as EventListener);
    window.addEventListener("resize", update);
    update();
    return () => {
      window.removeEventListener("virtual-scroll", update as EventListener);
      window.removeEventListener("resize", update);
      window.removeEventListener("resize", computeHeight);
      window.removeEventListener("resize", measureLayout);
    };
  }, []);

  return (
    <>
    {/* ── Hero image — matches ContactContent card exactly ─────────────── */}
    <div
      className="absolute overflow-hidden"
      style={{ top: IMG_START_Y, left: PAD, right: PAD, height: IMG_H }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/studio/contact-bg.jpg"
        alt="REONU Studio"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center center", display: "block" }}
      />
    </div>

    <div className="absolute" style={{ top: Y_OFFSET, left: 0, right: 0 }}>

      {/* ── Our Values — OurService-style two-column layout ───────────────── */}
      <div
        className="absolute"
        style={{
          top: 0, left: 0,
          width: 1920,
          height: VALUES_SECTION_H,
          display: "flex",
          flexDirection: "row",
        }}
      >
        {/* Left column — sticky heading */}
        <div style={{ width: VALUES_LEFT_W, flexShrink: 0, display: "flex", flexDirection: "column" }}>
          <div style={{ height: GAP_CANVAS, flexShrink: 0 }} />
          <div
            ref={stickyRef}
            style={{
              paddingLeft:   PAD,
              paddingRight:  60,
              paddingBottom: valuesBottomPad,
              flexShrink:    0,
              height:        stickyHeight,
              display:       "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            {/* Heading */}
            <SplitTextReveal
              text="Our Values"
              className="font-headline font-bold tracking-[-0.05em] text-[#000000]"
              style={{
                fontSize: 36, lineHeight: "44px",
                fontWeight: 800, fontOpticalSizing: "none",
                fontVariationSettings: '"opsz" 144',
                whiteSpace: "nowrap",
              }}
            />

            {/* Description + CTA */}
            <div ref={bottomFadeRef} style={{ display: "flex", flexDirection: "column", gap: 64 }}>
              <p
                className="font-headline font-normal tracking-[-0.005em]"
                style={{ fontSize: 18, lineHeight: "170%", width: 280, color: "#000000e6" }}
              >
                {lang === "ko"
                  ? <>저희의 가치에 공감하신다면<br />함께 만들어가요.</>
                  : <>If you feel aligned<br />with our values,<br />let's build something together.</>
                }
              </p>
              <WorkWithUsBtn lang={lang} />
            </div>
          </div>
        </div>

        {/* Right column — value rows */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <div style={{ height: GAP_CANVAS, flexShrink: 0 }} />
          <div
            ref={rowsWrapperRef}
            style={{ display: "flex", flexDirection: "column", gap: VALUES_INTER, paddingBottom: VALUES_BOTTOM_PAD }}
          >
            <ValueRow
              title="Open"
              ko="열린 가능성"
              desc={lang === "ko"
                ? ["모든 브랜드는 가능성을 가지고 있습니다.", "규모나 단계에 상관없이 모두에게 열려있습니다."]
                : ["Every brand holds potential.", "Great design is open to all — regardless of size or stage."]
              }
            />
            <ValueRow
              title="On"
              ko="가치 점화"
              desc={lang === "ko"
                ? ["브랜드 안에 이미 존재하는 가치를 발견하고", "그 가치를 켜는(ON) 디자인을 만듭니다."]
                : ["We uncover the value already within your brand", "and design to turn it on."]
              }
            />
            <ValueRow
              title="Growth"
              ko="지속적인 성장"
              desc={lang === "ko"
                ? ["브랜드가 계속해서 확장하고 더 큰 가능성으로", "나아갈 수 있도록 설계합니다."]
                : ["We design for continuous growth —", "so your brand can expand and reach its fullest potential."]
              }
            />
          </div>
        </div>
      </div>

      {/* ── 80px flex spacer above image strip (Möbius sticky section) ─────── */}
      <div
        className="absolute"
        style={{ top: VALUES_SECTION_H, left: 0, right: 0, height: IMG_ABOVE_H, display: "flex", alignItems: "center" }}
      />

      {/* ── Image strip ticker (Möbius-style auto-scroll + drag) ───────────── */}
      <div
        ref={tickerContainerRef}
        className="absolute overflow-hidden"
        style={{ top: IMG_STRIP_START, left: 0, right: 0, height: IMG_STRIP_H }}
      >
        <div
          ref={tickerInnerRef}
          style={{
            display: "flex",
            flexDirection: "row",
            height: "100%",
            willChange: "transform",
          }}
        >
          {/* Images × 2 for seamless loop — each with marginRight as gap */}
          {[
            "/images/studio/studio-img1.jpg",
            "/images/studio/caroline-badran--Nw-XxktMVc-unsplash.jpg",
            "/images/studio/contact-bg.jpg",
            "/images/studio/caroline-badran-rHGfFRgu5zE-unsplash.jpg",
            "/images/studio/1.JPG",
            "/images/studio/studio-img1.jpg",
            "/images/studio/caroline-badran--Nw-XxktMVc-unsplash.jpg",
            "/images/studio/contact-bg.jpg",
            "/images/studio/caroline-badran-rHGfFRgu5zE-unsplash.jpg",
            "/images/studio/1.JPG",
          ].map((src, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={i}
              src={src}
              alt=""
              style={{
                width: "auto",
                height: "100%",
                flexShrink: 0,
                objectFit: "cover",
                objectPosition: "center",
                display: "block",
                marginRight: 40,
              }}
            />
          ))}
        </div>
      </div>


      {/* ── Careers section (Pricing-style flex layout) ──────────────────── */}
      <div
        className="absolute"
        style={{
          top: CAREERS_Y, left: 0,
          width: 1920,
          display: "flex", flexDirection: "row",
        }}
      >
        {/* Left column — sticky Careers heading + description */}
        <div style={{ width: CAREER_LEFT_W, flexShrink: 0, display: "flex", flexDirection: "column" }}>
          <div style={{ height: CAREER_SPACER, flexShrink: 0 }} />
          <div
            ref={careerStickyRef}
            style={{
              paddingLeft: PAD, paddingRight: 60,
              paddingBottom: 40,
              flexShrink: 0,
              height: careerStickyHeight,
              display: "flex", flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            {/* Top: Careers heading + description */}
            <div>
              <h2
                className="font-headline font-bold tracking-[-0.05em] text-[#000000]"
                style={{ margin: 0, padding: 0, fontSize: 104, lineHeight: "115%", fontWeight: 800, fontOpticalSizing: "none", fontVariationSettings: '"opsz" 144' }}
              >
                Careers
              </h2>
              <div className="font-headline font-normal tracking-[-0.005em]"
                style={{ marginTop: 40, fontSize: 20, lineHeight: "32px", color: "#000000b3" }}>
                <p style={{ margin: 0 }}>
                  {lang === "ko"
                    ? <>스타트업부터 공공기관, 대기업까지 다양한<br />파트너와 협업해 브랜드 경험을 만들어왔습니다.</>
                    : <>We've collaborated with enterprises, startups,<br />and public institutions to build meaningful brand<br />experiences.</>
                  }
                </p>
                <p style={{ margin: "32px 0 0" }}>
                  {lang === "ko"
                    ? <>기획과 디자인을 통합적으로 연결해 빠르고<br />유연하게 지속 가능한 브랜드 시스템을 만듭니다.</>
                    : <>By integrating strategy and design, we execute<br />with speed and flexibility to create lasting brand<br />systems.</>
                  }
                </p>
              </div>
            </div>

            {/* Bottom: CTA text only */}
            <p
              className="font-headline font-normal tracking-[-0.005em]"
              style={{ fontSize: 18, lineHeight: "170%", width: 280, color: "#000000b3" }}
            >
              {lang === "ko"
                ? <>최소한의 그러나<br />더 나은 디자인을 지향합니다.</>
                : <>Minimal, yet always<br />striving for better design.</>
              }
            </p>
          </div>
        </div>

        {/* Right column — career category rows */}
        {/* +8px optical correction: UXUI Design (64px/120%) cap-height starts ~8px higher than Careers (104px/115%) */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", paddingRight: PAD }}>
          <div style={{ height: CAREER_SPACER + 20, flexShrink: 0 }} />
          <div
            ref={careerRowsWrapperRef}
            style={{ display: "flex", flexDirection: "column", paddingBottom: 40 }}
          >
            {JOBS.flatMap((sec, i) => {
              const row = <CareerRow key={sec.category} category={sec.category} items={sec.items} lang={lang} />;
              return i < JOBS.length - 1
                ? [row, <CareerBorderContainer key={`border-${i}`} />]
                : [row];
            })}
            <div style={{ marginTop: 80 }}>
              <LetsTalkPillBtn />
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
