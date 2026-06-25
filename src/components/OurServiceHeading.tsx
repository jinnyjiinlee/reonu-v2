"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useLang } from "@/context/LanguageContext";

const DESIGN_W    = 1920;
const SECTION_TOP = 2792;           // BX Design 시작
const SECTION_END = 4024;           // EDIT Design 칩 하단 (3756 + 172 + 96)
const HEADER_H    = 80;

const EASE = "cubic-bezier(0.4, 0, 0.2, 1)";
const DUR  = "0.5s";
const GAP  = 20;
const ARR  = 36;
const SLOT = ARR + GAP;

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

export default function OurServiceHeading() {
  const { lang }   = useLang();
  const headingRef = useRef<HTMLDivElement>(null);
  const bottomRef  = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const heading = headingRef.current;
    const bottom  = bottomRef.current;
    if (!heading || !bottom) return;

    const update = () => {
      const scale     = Math.min(window.innerWidth / DESIGN_W, 1);
      const scrollY   = window.scrollY;
      const naturalY  = SECTION_TOP * scale - scrollY;
      const endInView = SECTION_END * scale - scrollY;

      const canvasLeft = Math.max(0, (window.innerWidth - DESIGN_W * scale) / 2);
      const leftPx = canvasLeft + 60 * scale;
      const fs     = 60 * scale;
      const lh     = 72 * scale;

      heading.style.left       = `${leftPx}px`;
      heading.style.fontSize   = `${fs}px`;
      heading.style.lineHeight = `${lh}px`;
      bottom.style.left        = `${leftPx}px`;

      // 섹션 활성 구간: BX Design이 HEADER_H에 닿은 후 ~ EDIT 칩 하단이 화면 위로 벗어나기 전
      const active = naturalY <= HEADER_H && endInView > 0;

      heading.style.opacity      = active ? "1" : "0";
      heading.style.top          = `${HEADER_H}px`;
      bottom.style.opacity       = active ? "1" : "0";
      bottom.style.pointerEvents = active ? "auto" : "none";
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
      <div
        ref={headingRef}
        className="font-headline"
        style={{
          position:      "fixed",
          top:           0,
          left:          0,
          opacity:       0,
          zIndex:        50,
          pointerEvents: "none",
          fontWeight:    700,
          letterSpacing: "-0.03em",
          color:         "#1D1D1F",
          whiteSpace:    "nowrap",
        }}
      >
        Our Service
      </div>

      <div
        ref={bottomRef}
        style={{
          position:      "fixed",
          bottom:        80,
          left:          0,
          opacity:       0,
          zIndex:        50,
          pointerEvents: "none",
        }}
      >
        <p className="font-headline" style={{
          fontSize:      14,
          lineHeight:    "22px",
          fontWeight:    400,
          letterSpacing: "-0.005em",
          color:         "#6E6E73",
          marginBottom:  24,
        }}>
          {lang === "ko"
            ? <>{`다양한 브랜드들과 함께`}<br />{`폭넓은 디자인 서비스를 제공합니다.`}</>
            : <>{`We work with diverse brands`}<br />{`to deliver wide-ranging design services.`}</>
          }
        </p>
        <StartProjectBtn />
      </div>
    </>
  );
}
