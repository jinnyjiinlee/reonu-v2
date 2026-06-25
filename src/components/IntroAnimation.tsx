"use client";
import { useEffect, useRef } from "react";

const DESIGN_W  = 1920;
const HEADER_H  = 66;
const LOGO_TOP  = 25;
const GAP       = 134;
const THRESHOLD = 600;
const SPRING    = 0.10;
const SNAP      = 0.0005;
const HERO_H    = 240;

// ── Pure CSS responsive values ────────────────────────────────────────────────
// Static layout is handled entirely by CSS viewport units — no JS needed.
// min() caps each value at the design-pixel size on wide viewports (≥1920px).
const PAD   = "max(3.125vw, calc(50vw - 900px))";
const TOP_H = `min(calc(${HEADER_H + GAP} / ${DESIGN_W} * 100vw), ${HEADER_H + GAP}px)`;
const TOP_L = `min(calc(${LOGO_TOP} / ${DESIGN_W} * 100vw), ${LOGO_TOP}px)`;
const FS    = `min(calc(16 / ${DESIGN_W} * 100vw), 16px)`;
const LH    = `min(calc(20 / ${DESIGN_W} * 100vw), 20px)`;
const SVG_H = `min(calc(${HERO_H} / ${DESIGN_W} * 100vw), ${HERO_H}px)`;

export default function IntroAnimation({ href }: { href?: string } = {}) {
  const wrapRef    = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const logo    = document.getElementById("header-logo");
    const tagline = document.getElementById("header-tagline");
    if (logo)    { logo.style.opacity = "0"; logo.style.visibility = "hidden"; }
    if (tagline) { tagline.style.opacity = "0"; tagline.style.visibility = "hidden"; }

    // Only computes values needed for the scroll animation — not for static layout.
    // CSS already handles left/top/fontSize/lineHeight via viewport units.
    function metrics() {
      const s  = Math.min(window.innerWidth / DESIGN_W, 1);
      const cw = DESIGN_W * s;
      const ox = (window.innerWidth - cw) / 2;
      return {
        s,
        leftPad: ox + 60 * s,
        startY:  (HEADER_H + GAP) * s,
        logoTop: LOGO_TOP * s,
      };
    }

    // Tagline width — measured once on mount/resize, not per scroll frame
    let cachedTaglineW = 0;
    function measureTagline() {
      if (taglineRef.current) cachedTaglineW = taglineRef.current.offsetWidth;
    }

    // Only updates compositor-only properties (transform, opacity) — zero layout writes
    function apply(p: number) {
      const pc = Math.min(Math.max(p, 0), 1);
      const { leftPad, startY, logoTop } = metrics();

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
    }

    let currentP = 0, targetP = 0, rafId = 0, ticking = false;

    function tick() {
      const diff = targetP - currentP;
      if (Math.abs(diff) < SNAP) {
        currentP = targetP; ticking = false;
        apply(currentP); return;
      }
      currentP += diff * SPRING;
      apply(currentP);
      rafId = requestAnimationFrame(tick);
    }

    function onScroll() {
      targetP = Math.min(window.scrollY / THRESHOLD, 1);
      if (!ticking) { ticking = true; rafId = requestAnimationFrame(tick); }
    }

    function onResize() {
      measureTagline();   // re-measure width at new viewport size
      apply(currentP);    // reapply transforms with updated metrics
    }

    // Initialize
    measureTagline();
    currentP = Math.min(window.scrollY / THRESHOLD, 1);
    targetP  = currentP;
    apply(currentP);

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (logo)    { logo.style.opacity = "1"; logo.style.visibility = "visible"; }
      if (tagline) { tagline.style.opacity = "1"; tagline.style.visibility = "visible"; }
    };
  }, []);

  return (
    <>
      {/* REONU — static position via CSS vw units, animation via transform only */}
      <div
        ref={wrapRef}
        {...(href ? { onClick: () => { window.location.href = href; } } : {})}
        style={{
          position:           "fixed",
          left:               PAD,
          top:                TOP_H,
          transformOrigin:    "top left",
          lineHeight:         1,
          zIndex:             9999,
          pointerEvents:      href ? "auto" : "none",
          cursor:             href ? "pointer" : "default",
          willChange:         "transform",
          backfaceVisibility: "hidden",
        }}
      >
        <svg
          viewBox="0 0 880 180"
          style={{ display: "block", overflow: "visible", height: SVG_H }}
          aria-label="REONU"
        >
          {/* Bold hero text — fades out as scroll progresses */}
          <text
            id="reonu-bold"
            x="-6" y="162"
            className="font-headline"
            style={{ fontWeight: 750, fontSize: "180px", letterSpacing: "-0.05em", fill: "#1D1D1F" }}
          >
            REONU
          </text>
          {/* Regular header text — fades in as scroll progresses */}
          <text
            id="reonu-regular"
            x="-6" y="162"
            className="font-headline"
            style={{ fontWeight: 750, fontSize: "180px", letterSpacing: "-0.05em", fill: "#1D1D1F", opacity: 0 }}
          >
            REONU
          </text>
        </svg>
      </div>

      {/* Tagline — static position via CSS vw units, animation via transform only */}
      <div
        ref={taglineRef}
        className="font-headline"
        style={{
          position:           "fixed",
          top:                TOP_L,
          left:               PAD,
          fontSize:           FS,
          lineHeight:         LH,
          fontWeight:         500,
          letterSpacing:      "-0.01em",
          color:              "#6E6E73",
          whiteSpace:         "nowrap",
          transformOrigin:    "left center",
          zIndex:             9999,
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
