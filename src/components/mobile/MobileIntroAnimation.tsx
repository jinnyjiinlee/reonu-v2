"use client";
import { useEffect, useRef } from "react";

/**
 * Mobile scroll-driven intro animation.
 *
 * Smoothness strategy — lerp rAF loop:
 *  - Scroll events only update targetP (raw scroll ratio, no DOM writes)
 *  - A continuous rAF loop interpolates currentP → targetP each frame
 *  - This gives the same "ease-out deceleration" feel as Lenis on desktop:
 *    after the finger lifts, currentP glides to rest rather than snapping.
 *  - Loop auto-stops when settled (diff < 0.0003) to save battery
 *  - Float transforms (no Math.round) let GPU sub-pixel composite smoothly
 *  - translate3d + will-change → compositor-only layers, zero paint/layout
 *  - backfaceVisibility: hidden → prevents layer promotion churn
 */

const HEADER_H  = 64;
const LOGO_FS   = 20;          // matches FS_LOGO in Header.tsx
const OVERLAY_L = 24;          // px — matches content section padding
const THRESHOLD = 300;         // px of scroll to complete animation (longer = more room to ease)
const FADE_AT   = 0.6;         // fraction at which cross-fade begins
const LERP      = 0.10;        // interpolation factor per frame (0.08=dreamy, 0.12=snappy)

const REONU_TOP = HEADER_H + 48;                         // 112px — below header + gap
const LOGO_TOP  = Math.round((HEADER_H - 32) / 2);       // 16px — top of 32px line box in 64px header
const TAG_TOP   = Math.round((HEADER_H - 14) / 2);       // 25px — centers 14px text in header

export default function MobileIntroAnimation() {
  const reonuRef   = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.innerWidth >= 1024) return;

    const reonu    = reonuRef.current;
    const tagEl    = taglineRef.current;
    const logo     = document.getElementById("header-logo");
    const hTagline = document.getElementById("header-tagline");
    if (!reonu || !tagEl) return;

    // Promote header elements to their own compositor layer
    if (logo)     logo.style.willChange     = "opacity";
    if (hTagline) hTagline.style.willChange = "opacity";

    // REONU scale: hero font px → target logo size
    const fontPx      = Math.max(64, Math.min(window.innerWidth * 0.20, 100));
    const targetScale = LOGO_FS / fontPx;

    // REONU X delta: measured from real #header-logo left edge after layout.
    // Same approach as tagline — getBoundingClientRect gives exact pixel position
    // regardless of what CSS sets the header padding to.
    let reonuEndX = 0;
    // Tagline target X: read real #header-tagline position after CSS grid layout settles
    let taglineTargetX = 0;
    function computeTargets() {
      // Logo target
      if (logo) {
        const r = logo.getBoundingClientRect();
        if (r.width > 0) reonuEndX = r.left - OVERLAY_L;
      }
      // Tagline target
      if (hTagline) {
        const rect = hTagline.getBoundingClientRect();
        if (rect.width > 0) {
          taglineTargetX = rect.left - OVERLAY_L;
          return;
        }
      }
      const myW = tagEl?.offsetWidth || 100;
      taglineTargetX = window.innerWidth / 2 - myW / 2 - OVERLAY_L;
    }
    requestAnimationFrame(computeTargets);

    // ── Inline !important opacity helpers ────────────────────────────────────
    const hide = (el: HTMLElement | null) => {
      if (!el) return;
      el.style.setProperty("opacity", "0", "important");
      el.style.pointerEvents = "none";
    };
    const show = (el: HTMLElement | null, t: number) => {
      if (!el) return;
      el.style.setProperty("opacity", String(Math.min(t, 1)), "important");
      el.style.pointerEvents = t > 0 ? "" : "none";
    };

    hide(logo);
    hide(hTagline);

    // ── Apply animation at interpolated progress p (0–1) ─────────────────────
    function apply(p: number) {
      if (!reonu || !tagEl) return;

      // REONU: scale + translate — float values for GPU sub-pixel smoothness
      const scale  = 1 - (1 - targetScale) * p;
      const deltaY = (LOGO_TOP - REONU_TOP) * p;
      const deltaX = reonuEndX * p;
      reonu.style.transform = `translate3d(${deltaX}px,${deltaY}px,0) scale(${scale})`;

      // Tagline: slide to viewport-centered header position
      tagEl.style.transform = `translate3d(${taglineTargetX * p}px,0,0)`;

      // Cross-fade
      if (p < FADE_AT) {
        reonu.style.opacity = "1";
        tagEl.style.opacity = "1";
        hide(logo);
        hide(hTagline);
      } else {
        const t = (p - FADE_AT) / (1 - FADE_AT);
        reonu.style.opacity = String(Math.max(0, 1 - t));
        tagEl.style.opacity = String(Math.max(0, 1 - t));
        show(logo,     t);
        show(hTagline, t);
      }
    }

    // ── Lerp rAF loop ────────────────────────────────────────────────────────
    // currentP glides toward targetP each frame at LERP rate.
    // After finger lifts, iOS momentum keeps scrollY changing → targetP keeps
    // updating → currentP follows smoothly to rest. Same feel as Lenis.
    let currentP  = 0;
    let targetP   = 0;
    let loopId    = 0;
    let running   = false;

    function tick() {
      const diff = targetP - currentP;
      if (Math.abs(diff) < 0.0003) {
        // Settled — snap to exact target and stop loop (saves battery)
        currentP = targetP;
        apply(currentP);
        running = false;
        return;
      }
      currentP += diff * LERP;
      apply(currentP);
      loopId = requestAnimationFrame(tick);
    }

    function startLoop() {
      if (running) return;
      running = true;
      loopId  = requestAnimationFrame(tick);
    }

    function onScroll() {
      targetP = Math.min((window.scrollY || window.pageYOffset || 0) / THRESHOLD, 1);
      startLoop();
    }

    // Initialize
    apply(0);

    window.addEventListener("scroll",    onScroll, { passive: true });
    window.addEventListener("touchmove", onScroll, { passive: true });

    return () => {
      cancelAnimationFrame(loopId);
      window.removeEventListener("scroll",    onScroll);
      window.removeEventListener("touchmove", onScroll);
      if (logo)     { logo.style.removeProperty("opacity");     logo.style.pointerEvents = ""; logo.style.willChange = ""; }
      if (hTagline) { hTagline.style.removeProperty("opacity"); hTagline.style.pointerEvents = ""; hTagline.style.willChange = ""; }
    };
  }, []);

  return (
    <>
      {/* Large REONU — scales down + moves to header logo position on scroll */}
      <div
        ref={reonuRef}
        aria-hidden="true"
        className="lg:hidden font-headline"
        style={{
          position:           "fixed",
          left:               OVERLAY_L,
          top:                REONU_TOP,
          transformOrigin:    "top left",
          fontSize:           "clamp(64px, 20vw, 100px)",
          fontWeight:         800,
          letterSpacing:      "-0.05em",
          lineHeight:         0.95,
          color:              "#1D1D1F",
          whiteSpace:         "nowrap",
          zIndex:             10002,
          pointerEvents:      "none",
          willChange:         "transform, opacity",
          backfaceVisibility: "hidden",
          transform:          "translate3d(0,0,0)",
        }}
      >REONU</div>

      {/* TURN U BRAND ON — slides from left to header center on scroll */}
      <div
        ref={taglineRef}
        aria-hidden="true"
        className="lg:hidden font-display-headline"
        style={{
          position:           "fixed",
          left:               OVERLAY_L,
          top:                TAG_TOP,
          fontSize:           "14px",
          lineHeight:         "14px",
          fontWeight:         700,
          letterSpacing:      "0.02em",
          color:              "#1D1D1F",
          whiteSpace:         "nowrap",
          transformOrigin:    "left center",
          zIndex:             10002,
          pointerEvents:      "none",
          willChange:         "transform, opacity",
          backfaceVisibility: "hidden",
          transform:          "translate3d(0,0,0)",
        }}
      >TURN U BRAND ON</div>
    </>
  );
}
