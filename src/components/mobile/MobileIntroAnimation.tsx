"use client";
import { useEffect, useRef } from "react";

/**
 * Mobile scroll-driven intro animation.
 *
 * Initial  → REONU large (hero, 24px from left) | "TURN U BRAND ON" in header left
 * Scroll ↓ → REONU scales + moves up/left to header logo position
 *            "TURN U BRAND ON" slides to the real #header-tagline element position
 *            (which is viewport-centered by the CSS grid layout in globals.css)
 * Fade     → overlays cross-fade with real header elements
 *
 * Smoothness:
 *  - RAF-debounce: scheduleApply batches any number of scroll events into exactly
 *    ONE rAF callback per display frame → no jitter from multiple updates per frame
 *  - translate3d + will-change → GPU compositing layers (Framer/Origo approach)
 *  - Math.round on transforms → no subpixel antialiasing jitter
 *  - backfaceVisibility: hidden → prevents layer promotion churn
 */

const HEADER_H  = 64;
const LOGO_FS   = 20;          // matches FS_LOGO in Header.tsx
const OVERLAY_L = 24;          // px — matches content section padding for left alignment
const THRESHOLD = 250;         // px of scroll to complete animation
const FADE_AT   = 0.6;         // fraction at which cross-fade begins

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

    // Promote header elements to their own compositor layer for opacity changes
    if (logo)     logo.style.willChange     = "opacity";
    if (hTagline) hTagline.style.willChange = "opacity";

    // REONU scale: current font px → target logo size
    const fontPx      = Math.max(64, Math.min(window.innerWidth * 0.20, 100));
    const targetScale = LOGO_FS / fontPx;

    // Header logo left edge = max(3.125vw, 0) on mobile phones
    const headerPAD = Math.max(window.innerWidth * 0.03125, 0);
    // REONU X delta: starts at OVERLAY_L (24px), ends at headerPAD
    // Negative on small phones (e.g. 400px: 12.5 – 24 = –11.5px → moves left)
    const reonuEndX = Math.round(headerPAD - OVERLAY_L);

    // Tagline target X: read real #header-tagline position after layout settles.
    // opacity:0 does NOT affect layout, so getBoundingClientRect is accurate.
    // The CSS grid layout (globals.css @media <1024px) centers #header-tagline
    // in the viewport; we slide the overlay to match exactly.
    let taglineTargetX = 0;
    function computeTaglineTarget() {
      if (hTagline) {
        const rect = hTagline.getBoundingClientRect();
        if (rect.width > 0) {
          taglineTargetX = Math.round(rect.left - OVERLAY_L);
          return;
        }
      }
      // Fallback: viewport center (used if element not yet laid out)
      const myW = tagEl?.offsetWidth || 100;
      taglineTargetX = Math.round(window.innerWidth / 2 - myW / 2 - OVERLAY_L);
    }
    // One frame delay so CSS grid layout and font metrics are fully settled
    requestAnimationFrame(computeTaglineTarget);

    // ── Inline !important opacity helpers ────────────────────────────────────
    // page.tsx injects "@media (max-width:1023px){#header-logo,#header-tagline{opacity:0!important}}"
    // Inline !important (setProperty) beats that stylesheet !important.
    // Normal inline (element.style.opacity = "1") does NOT — it loses to stylesheet !important.
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

    // ── Core animation ────────────────────────────────────────────────────────
    function apply() {
      if (!reonu || !tagEl) return;
      const p = Math.min((window.scrollY || window.pageYOffset || 0) / THRESHOLD, 1);

      // REONU: scale down + translate toward header logo position
      const scale  = 1 - (1 - targetScale) * p;
      const deltaY = Math.round((LOGO_TOP - REONU_TOP) * p);
      const deltaX = Math.round(reonuEndX * p);
      reonu.style.transform = `translate3d(${deltaX}px,${deltaY}px,0) scale(${scale})`;

      // Tagline: slide from OVERLAY_L (24px) to real #header-tagline left edge
      const tx = Math.round(taglineTargetX * p);
      tagEl.style.transform = `translate3d(${tx}px,0,0)`;

      // Cross-fade — two phases:
      //  Phase 1 (p < FADE_AT): overlays opaque, header hidden
      //  Phase 2 (p ≥ FADE_AT): overlays fade out, header fades in
      if (p < FADE_AT) {
        reonu.style.opacity = "1";
        tagEl.style.opacity = "1";
        hide(logo);
        hide(hTagline);
      } else {
        const t = (p - FADE_AT) / (1 - FADE_AT);
        reonu.style.opacity = String(1 - t);
        tagEl.style.opacity = String(1 - t);
        show(logo,     t);
        show(hTagline, t);
      }
    }

    apply();

    // ── RAF-debounced scroll handler ─────────────────────────────────────────
    // Batches multiple scroll/touchmove events per frame into exactly ONE rAF
    // callback, keeping DOM writes synchronized with the display refresh cycle.
    let rafId = 0;
    function scheduleApply() {
      if (rafId) return;
      rafId = requestAnimationFrame(() => { apply(); rafId = 0; });
    }

    window.addEventListener("scroll",    scheduleApply, { passive: true });
    window.addEventListener("touchmove", scheduleApply, { passive: true });

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener("scroll",    scheduleApply);
      window.removeEventListener("touchmove", scheduleApply);
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
