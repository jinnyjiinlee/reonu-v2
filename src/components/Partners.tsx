"use client";

import Image from "next/image";
import { useState, useRef, useEffect, useLayoutEffect, useCallback } from "react";
import { partnersRowA, partnersRowB } from "@/data/content";
import SplitTextReveal from "@/components/SplitTextReveal";

const BTN_ARR_W = 26;
const BTN_ARR_H = 26;
const BTN_GAP   = 18;
const BTN_EASE  = "cubic-bezier(0.4, 0, 0.2, 1)";
const BTN_T     = `transform 0.42s ${BTN_EASE}`;

const BtnArrowSVG = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width={BTN_ARR_W} height={BTN_ARR_H}
       viewBox="0 0 24 24" fill="none" aria-hidden="true"
       style={{ display: "block", flexShrink: 0 }}>
    <path d="M5 12h14M12 5l7 7-7 7" stroke="#1D1D1F" strokeWidth="2.34"
          strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

function LetsWorkBtn() {
  const [hov, setHov] = useState(false);
  const textRef = useRef<HTMLSpanElement>(null);
  const [textW, setTextW] = useState(0);

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
  const containerW = ready ? BTN_ARR_W + BTN_GAP + textW + 12 : undefined;

  return (
    <div data-cursor="hidden" onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
         style={{ display: "inline-block" }}>
      <a href="#contact" style={{
        display: "block", position: "relative",
        width: containerW ?? "max-content",
        height: 58, overflow: "hidden", textDecoration: "none",
      }}>
        {/* Arrow1 — 평상시 오른쪽, 호버 시 exit right */}
        <span style={{
          position: "absolute", top: "50%", left: 0,
          display: "inline-flex", alignItems: "center",
          opacity: hov ? 0 : 1,
          transform: hov
            ? `translateY(-50%) translateX(${ready ? textW + BTN_GAP + 40 : 0}px)`
            : `translateY(-50%) translateX(${ready ? textW + BTN_GAP : 0}px)`,
          transition: ready
            ? hov ? `transform 0.42s ${BTN_EASE}, opacity 0s`
                  : `transform 0.42s ${BTN_EASE}, opacity 0.3s ${BTN_EASE}`
            : "none",
        }}><BtnArrowSVG /></span>

        {/* Arrow2 — 왼쪽에서 진입 */}
        <span style={{
          position: "absolute", top: "50%", left: 0,
          display: "inline-flex", alignItems: "center",
          opacity: hov ? 1 : 0,
          transform: hov
            ? `translateY(-50%) translateX(0px)`
            : `translateY(-50%) translateX(${-(BTN_ARR_W + 40)}px)`,
          transition: ready ? `transform 0.42s ${BTN_EASE}, opacity 0.2s ${BTN_EASE}` : "none",
        }}><BtnArrowSVG /></span>

        {/* 텍스트 */}
        <span ref={textRef}
          className="font-headline text-[32px] leading-[32px] font-medium tracking-[-0.01em] text-[#1D1D1F]"
          style={{
            position: "absolute", top: "50%", left: 0,
            display: "flex", alignItems: "center", whiteSpace: "nowrap",
            transform: `translateY(-50%) translateX(${ready && hov ? BTN_ARR_W + BTN_GAP : 0}px)`,
            transition: BTN_T,
          }}>
          Let's work together
        </span>

        {/* 언더라인 */}
        <span style={{
          position: "absolute", bottom: 0, left: 0,
          width: ready ? BTN_ARR_W + BTN_GAP + textW : "100%",
          height: 2.54, background: "#1D1D1F",
          transform: hov ? "scaleX(1)" : "scaleX(0)",
          transformOrigin: "0% 50%",
          transition: ready ? `transform 0.42s ${BTN_EASE}` : "none",
        }} />
      </a>
    </div>
  );
}

const TILE_W = 300;
const TILE_H = 110;
const LOGO_W = 234;
const LOGO_H = 94;
const TILE_GAP = 0;

// phase: 'idle' → 'color' (logo in color) → 'text' (show name)
function LogoTile({ src, alt }: { src: string; alt: string }) {
  const [phase, setPhase] = useState<"idle" | "color" | "text">("idle");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleEnter = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setPhase("color");
    timerRef.current = setTimeout(() => setPhase("text"), 320);
  };

  const handleLeave = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setPhase("idle");
  };

  return (
    <div
      data-cursor="hidden"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      style={{
        width: TILE_W,
        height: TILE_H,
        flex: `0 0 ${TILE_W}px`,
        backgroundColor: "transparent",
        borderRadius: 0,
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        flexShrink: 0,
      }}
    >
      {/* Logo image — grayscale idle, color on hover, fades out on text phase */}
      <div
        style={{
          position: "relative",
          width: LOGO_W,
          height: LOGO_H,
          flexShrink: 0,
          filter: phase === "idle" ? "grayscale(1) opacity(0.9)" : "grayscale(0) opacity(1)",
          opacity: phase === "text" ? 0 : 1,
          transition: "filter 0.3s ease, opacity 0.25s ease",
        }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          unoptimized
          className="object-contain"
          sizes={`${LOGO_W}px`}
        />
      </div>

      {/* Text overlay — fades in on text phase */}
      <span
        style={{
          position: "absolute",
          fontFamily: "var(--font-inter), 'Inter', sans-serif",
          fontWeight: 500,
          letterSpacing: "-0.02em",
          color: "#1D1D1F",
          fontSize: 18,
          opacity: phase === "text" ? 1 : 0,
          transform: phase === "text" ? "translateY(0)" : "translateY(6px)",
          transition: "opacity 0.25s ease, transform 0.25s ease",
          pointerEvents: "none",
          whiteSpace: "nowrap",
          textAlign: "center",
          maxWidth: LOGO_W,
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {alt}
      </span>
    </div>
  );
}

// Partners must appear AFTER OurProcess's sticky phase ends.
// Formula: ourprocess-end Y + stickyHeight (= one viewport in canvas px)
// Fallback at 900px window: 6764 + 932 ≈ 7700
const WRAPPER_TOP_INIT = 7700;

// Gap between "Our Partners" heading block and marquee rows (canvas px)
const HEADING_GAP = 64;

export default function Partners() {
  const rowA = [...partnersRowA, ...partnersRowA, ...partnersRowA];
  const rowB = [...partnersRowB, ...partnersRowB, ...partnersRowB];

  // Dynamic: listen for OurProcess to broadcast its end Y
  // so Partners wrapper starts exactly where OurProcess ends.
  const [wrapperTop, setWrapperTop] = useState(WRAPPER_TOP_INIT);
  // Store processEnd so we can recompute on resize (viewport changes desync stickyH)
  const processEndRef = useRef<number | null>(null);

  const computeTop = useCallback((processEnd: number) => {
    // outerCardsRef visual bottom is always processEnd - 408 = wrapperTop + 2600
    // (independent of viewport/stickyH — verified algebraically)
    const newTop = Math.round(processEnd - 408);
    setWrapperTop(newTop);
    window.dispatchEvent(new CustomEvent("partners-end", { detail: { y: newTop } }));
  }, []);

  useEffect(() => {
    const handler = (e: Event) => {
      const y = (e as CustomEvent<{ y: number }>).detail?.y;
      if (y && y > 5000) {
        processEndRef.current = y;
        computeTop(y);
      }
    };
    const onResize = () => {
      if (processEndRef.current) computeTop(processEndRef.current);
    };
    window.addEventListener("ourprocess-end", handler);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("ourprocess-end", handler);
      window.removeEventListener("resize", onResize);
    };
  }, [computeTop]);

  return (
    /*
     * ── Mobius-identical flex structure ──────────────────────────────────────
     * div [Partners wrapper]  position:absolute  display:flex  flex-direction:column
     *   paddingTop:200  → gap from OurService (matches Mobius framer-p6rodo padding:200px 0 0)
     *   div [Heading block]   paddingLeft:60  paddingRight:60
     *     h2 "Our"
     *     h2 "Partners"
     *   div [Gap spacer]      height:64  (gap between heading and rows)
     *   div [Rows wrapper]    flex-column  gap:12  position:relative
     *     div [Row A]         overflow:hidden  width:1920  height:100
     *     div [Row B]         overflow:hidden  width:1920  height:100
     *     div [Fade left]     absolute  left:0
     *     div [Fade right]    absolute  right:0
     * ─────────────────────────────────────────────────────────────────────────
     */
    <div
      className="absolute"
      style={{
        left: 0,
        top: wrapperTop,
        width: 1920,
        paddingTop: 200,
        display: "flex",
        flexDirection: "column",
        gap: HEADING_GAP,
        zIndex: 2,
        background: "#ffffff", // block OurProcess number from showing through padding
      }}
    >
      {/* ── Heading block ── */}
      <div style={{ paddingLeft: 60, paddingRight: 60, display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
        <div>
          <SplitTextReveal
            text="Our Partners"
            className="font-headline font-bold tracking-[-0.05em] text-[#000000]"
            style={{ fontSize: 33, lineHeight: "44px", whiteSpace: "nowrap", fontWeight: 800, fontOpticalSizing: "none", fontVariationSettings: '"opsz" 144' }}
          />
        </div>
      </div>

      {/* ── Marquee rows — full canvas width, relative for fade overlays ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: TILE_GAP, position: "relative" }}>
        <div className="overflow-hidden" style={{ width: 1920, height: TILE_H }}>
          <div className="marquee-track" style={{ animationDuration: "90s", gap: TILE_GAP }}>
            {[...rowA, ...rowA].map((p, i) => (
              <LogoTile key={`a-${i}`} src={p.src} alt={p.name} />
            ))}
          </div>
        </div>

        <div className="overflow-hidden" style={{ width: 1920, height: TILE_H }}>
          <div
            className="marquee-track"
            style={{ animationDuration: "110s", animationDirection: "reverse", gap: TILE_GAP }}
          >
            {[...rowB, ...rowB].map((p, i) => (
              <LogoTile key={`b-${i}`} src={p.src} alt={p.name} />
            ))}
          </div>
        </div>

        {/* Side fade overlays — positioned relative to rows wrapper */}
        <div
          className="absolute pointer-events-none partners-fade-left"
          style={{
            left: 0,
            top: 0,
            width: 200,
            height: TILE_H * 2 + TILE_GAP,
            background: "linear-gradient(to right, #ffffff 0%, #ffffff 33.33%, rgba(255,255,255,0) 100%)",
          }}
        />
        <div
          className="absolute pointer-events-none partners-fade-right"
          style={{
            right: 0,
            top: 0,
            width: 200,
            height: TILE_H * 2 + TILE_GAP,
            background: "linear-gradient(to left, #ffffff 0%, #ffffff 33.33%, rgba(255,255,255,0) 100%)",
          }}
        />
      </div>
    </div>
  );
}
