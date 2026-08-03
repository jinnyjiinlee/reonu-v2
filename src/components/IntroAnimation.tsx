"use client";
import { useEffect, useRef } from "react";

const DESIGN_W  = 1920;
const HEADER_H  = 64;
const LOGO_TOP  = 25;
const GAP       = 136;   // 64 + 136 = 200px
const THRESHOLD = 400;
const HERO_H    = 300;

// ── Pure CSS responsive values ────────────────────────────────────────────────
// Static layout is handled entirely by CSS viewport units — no JS needed.
// min() caps each value at the design-pixel size on wide viewports (≥1920px).
const PAD   = "max(3.125vw, calc(50vw - 900px))";
const TOP_H = `${HEADER_H + GAP}px`;   // 200px fixed — matches Mobius header zone
const TOP_L = "25px";   // vertically centers 14px text in 64px header: (64-14)/2 = 25
const FS    = "14px";   // matches header nav/tagline
const LH    = "14px";   // 1em
const SVG_H = `min(calc(${HERO_H} / ${DESIGN_W} * 100vw), ${HERO_H}px)`;

export default function IntroAnimation({ href }: { href?: string } = {}) {
  const wrapRef    = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Mobile (<1024px): skip the REONU intro animation entirely.
    // Hide the fixed overlay elements so they don't cover mobile content.
    // Snap header logo/tagline to visible immediately so the header is usable.
    if (window.innerWidth < 1024) {
      if (wrapRef.current)    wrapRef.current.style.display    = "none";
      if (taglineRef.current) taglineRef.current.style.display = "none";
      // Do NOT touch #header-logo / #header-tagline opacity on mobile.
      // MobileIntroAnimation controls those elements via inline !important.
      return;
    }

    // Cache element refs — never look these up inside the scroll loop
    const logo    = document.getElementById("header-logo");
    const tagline = document.getElementById("header-tagline");
    // Start hidden: opacity (compositor) + pointerEvents (no paint, no reflow)
    // Avoid visibility:hidden — it triggers paint on change
    if (logo)    { logo.style.opacity = "0"; logo.style.pointerEvents = "none"; }
    if (tagline) { tagline.style.opacity = "0"; tagline.style.pointerEvents = "none"; }

    // Only computes values needed for the scroll animation — not for static layout.
    // CSS already handles left/top/fontSize/lineHeight via viewport units.

    function metrics() {
      const s  = Math.min(window.innerWidth / DESIGN_W, 1);
      const cw = DESIGN_W * s;
      const ox = (window.innerWidth - cw) / 2;
      const logoTop = 33 - 8 * s;
      return {
        s,
        leftPad: ox + 60 * s,
        startY:  HEADER_H + GAP,         // 200px fixed (matches TOP_H)
        logoTop,
      };
    }

    // Tagline width — measured once on mount/resize, not per scroll frame
    let cachedTaglineW = 0;
    function measureTagline() {
      if (taglineRef.current) cachedTaglineW = taglineRef.current.offsetWidth;
    }

    // Only updates compositor-only properties (transform, opacity) — zero layout writes.
    // FADE_START=0.6 → cross-fade begins at 480px scroll (60% of THRESHOLD=800).
    // Two-phase: wrapRef fades out first (by 640px), real header fades in after (640–800px).
    // Works images appear at ~692px → wrapRef is already gone, no doubled header.
    const FADE_START = 0.6;

    // Cache metrics — recomputed only on resize, not per scroll frame
    let cachedM = metrics();

    function apply(p: number) {
      const pc = Math.min(Math.max(p, 0), 1);
      const { leftPad, startY, logoTop } = cachedM;

      const scaleK = 16 / HERO_H;
      const k  = 1 - (1 - scaleK) * pc;
      const ty = (logoTop - startY) * pc;

      if (wrapRef.current) {
        wrapRef.current.style.transform = `translateY(${ty}px) scale(${k})`;
      }

      const boldEl = document.getElementById("reonu-bold");
      const regEl  = document.getElementById("reonu-regular");
      if (boldEl) boldEl.style.opacity = String(1 - pc);
      if (regEl)  regEl.style.opacity  = String(pc);

      if (taglineRef.current) {
        const tagW       = cachedTaglineW || taglineRef.current.offsetWidth;
        const targetLeft = window.innerWidth / 2 - tagW / 2;
        const tx         = (targetLeft - leftPad) * pc;
        taglineRef.current.style.transform = `translateX(${tx}px)`;
      }

      // Two-phase cross-fade — eliminates "doubled header" during scroll.
      // Phase 1 (t 0→0.5): wrapRef + tagline fade out (1→0). Real header stays hidden.
      // Phase 2 (t 0.5→1): real header fades in (0→1). wrapRef already gone.
      // They are NEVER simultaneously visible, so no overlap artefact.
      if (pc >= FADE_START) {
        const t           = (pc - FADE_START) / (1 - FADE_START);      // 0→1
        const wrapOpacity = t < 0.5 ? 1 - t * 2 : 0;                  // 1→0 in first half
        const logoOpacity = t > 0.5 ? (t - 0.5) * 2 : 0;              // 0→1 in second half
        if (wrapRef.current)    wrapRef.current.style.opacity    = String(wrapOpacity);
        if (taglineRef.current) taglineRef.current.style.opacity = String(wrapOpacity);
        if (logo)    { logo.style.opacity    = String(logoOpacity); logo.style.pointerEvents    = logoOpacity > 0 ? "" : "none"; }
        if (tagline) { tagline.style.opacity = String(logoOpacity); tagline.style.pointerEvents = logoOpacity > 0 ? "" : "none"; }
      } else {
        if (wrapRef.current)    wrapRef.current.style.opacity    = "1";
        if (taglineRef.current) taglineRef.current.style.opacity = "1";
        if (logo)    { logo.style.opacity = "0";    logo.style.pointerEvents    = "none"; }
        if (tagline) { tagline.style.opacity = "0"; tagline.style.pointerEvents = "none"; }
      }
    }

    // ── Scroll animation ─────────────────────────────────────────────────────
    // rawPc is applied directly on every Lenis virtual-scroll frame — no extra
    // lerp needed. Lenis already provides 1.2 s exponential ease-out, which is
    // the source of the "스르륵" feel: after finger lifts, Lenis keeps firing
    // events for ~1 s as it decelerates, carrying REONU smoothly to the header.
    //
    // THRESHOLD=400 means the animation completes by 400 px of scroll — Origo
    // uses a similarly short range so the logo reaches the header before the
    // works section becomes fully visible, eliminating any "sticking" feeling.
    let lerpPc = 0;

    function onVirtualScroll() {
      const y     = (window as any).__virtualY ?? 0;
      const rawPc = Math.min(y / THRESHOLD, 1);
      lerpPc = rawPc;
      apply(rawPc);
    }

    function onResize() {
      cachedM = metrics();
      measureTagline();
      apply(lerpPc);
    }

    // Initialize
    measureTagline();
    apply(0);

    window.addEventListener("virtual-scroll", onVirtualScroll as EventListener);
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("virtual-scroll", onVirtualScroll as EventListener);
      window.removeEventListener("resize", onResize);
      if (logo)    { logo.style.opacity = "1"; logo.style.pointerEvents = ""; }
      if (tagline) { tagline.style.opacity = "1"; tagline.style.pointerEvents = ""; }
    };
  }, []);

  return (
    <>
      {/* REONU — static position via CSS vw units, animation via transform only */}
      {/* intro-desktop-only: hidden on mobile via globals.css media query (CSS-level, no hydration flash) */}
      <div
        ref={wrapRef}
        className="intro-desktop-only"
        {...(href ? { onClick: () => { window.location.href = href; } } : {})}
        style={{
          position:           "fixed",
          left:               `calc(${PAD} - 12px)`,
          top:                TOP_H,
          transformOrigin:    "top left",
          lineHeight:         1,
          zIndex:             10002,
          pointerEvents:      href ? "auto" : "none",
          cursor:             href ? "pointer" : "default",
          willChange:         "transform",
          backfaceVisibility: "hidden",
        }}
      >
        <div
          id="reonu-bold"
          className="font-headline"
          aria-label="REONU®"
          style={{
            fontSize:             SVG_H,
            fontWeight:           800,
            letterSpacing:        "-0.05em",
            lineHeight:           1,
            color:                "#000000",
            whiteSpace:           "nowrap",
            fontOpticalSizing:    "none",
            fontVariationSettings: '"opsz" 144',
          }}
        >
          REONU
        </div>
        {/* reonu-regular: identical text, hidden; scroll JS fades it in as bold fades out */}
        <div
          id="reonu-regular"
          className="font-headline"
          style={{
            position:             "absolute",
            top:                  0,
            left:                 0,
            fontSize:             SVG_H,
            fontWeight:           800,
            letterSpacing:        "-0.05em",
            lineHeight:           1,
            color:                "#000000",
            whiteSpace:           "nowrap",
            opacity:              0,
            pointerEvents:        "none",
            fontOpticalSizing:    "none",
            fontVariationSettings: '"opsz" 144',
          }}
        >
          REONU
        </div>
      </div>

      {/* Tagline — static position via CSS vw units, animation via transform only */}
      <div
        ref={taglineRef}
        className="font-display-headline intro-desktop-only"
        style={{
          position:           "fixed",
          top:                TOP_L,
          left:               PAD,
          fontSize:           FS,
          lineHeight:         LH,
          fontWeight:         700,
          letterSpacing:      "0.02em",
          color:              "#1D1D1F",
          whiteSpace:         "nowrap",
          transformOrigin:    "left center",
          zIndex:             10002,
          pointerEvents:      "none",
          willChange:         "transform",
          backfaceVisibility: "hidden",
        }}
      >
        TURN U BRAND ON
      </div>
    </>
  );
}
