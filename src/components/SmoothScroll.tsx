"use client";

import { useEffect } from "react";

/**
 * Lenis-style smooth scroll — pure vanilla JS, no dependencies.
 * Intercepts wheel events and applies lerp to window.scrollY.
 * All other components that read window.scrollY work unchanged.
 */
export default function SmoothScroll() {
  useEffect(() => {
    let current = window.scrollY;
    let target  = window.scrollY;
    let rafId   = 0;
    const LERP  = 0.09; // lower = smoother / more inertia

    const clamp = (v: number) =>
      Math.max(0, Math.min(v, document.documentElement.scrollHeight - window.innerHeight));

    /* rAF loop — lerp current → target, self-terminating when settled */
    const tick = () => {
      const diff = target - current;
      if (Math.abs(diff) < 0.5) {
        current = target;
        window.scrollTo(0, current);
        rafId = 0; // stop — restarts on next user input
        return;
      }
      current += diff * LERP;
      window.scrollTo(0, current);
      rafId = requestAnimationFrame(tick);
    };

    const startTick = () => { if (!rafId) rafId = requestAnimationFrame(tick); };

    /* wheel → update target + kick loop */
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      let delta = e.deltaY;
      if (e.deltaMode === 1) delta *= 16;           // line mode
      if (e.deltaMode === 2) delta *= window.innerHeight; // page mode
      target = clamp(target + delta);
      startTick();
    };

    /* external request — e.g. "Back to top" button */
    const onScrollTo = (e: Event) => {
      const detail = (e as CustomEvent<{ target?: number }>).detail;
      target = clamp(detail?.target ?? 0);
      startTick();
    };

    /* keyboard scroll (arrow keys, space, page up/down) */
    const onKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      const step = window.innerHeight * 0.8;
      if (e.key === "ArrowDown")  { e.preventDefault(); target = clamp(target + 80);   startTick(); }
      if (e.key === "ArrowUp")    { e.preventDefault(); target = clamp(target - 80);   startTick(); }
      if (e.key === "PageDown" || e.key === " ") { e.preventDefault(); target = clamp(target + step); startTick(); }
      if (e.key === "PageUp")     { e.preventDefault(); target = clamp(target - step); startTick(); }
      if (e.key === "Home")       { e.preventDefault(); target = 0; startTick(); }
      if (e.key === "End")        { e.preventDefault(); target = clamp(document.documentElement.scrollHeight); startTick(); }
    };

    window.addEventListener("wheel",            onWheel,    { passive: false });
    window.addEventListener("keydown",          onKeyDown);
    window.addEventListener("smoothscroll:to",  onScrollTo as EventListener);
    // no initial RAF — loop only starts on first user interaction

    return () => {
      window.removeEventListener("wheel",           onWheel);
      window.removeEventListener("keydown",         onKeyDown);
      window.removeEventListener("smoothscroll:to", onScrollTo as EventListener);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return null;
}
