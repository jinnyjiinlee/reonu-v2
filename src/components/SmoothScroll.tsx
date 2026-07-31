"use client";

/**
 * Lerp-based smooth scroll — matches Framer / Lenis default behavior.
 *
 * Lenis default mode = lerp(current, target, 0.1) per frame (NOT duration-based).
 * - New wheel input updates target only; animation flows continuously without restart.
 * - Frame-rate normalized: 1 - (1 - LERP)^(dt * 60) keeps feel consistent at 120fps.
 * - Result: fluid, physics-like deceleration identical to mobius.framer.website.
 */
import { useEffect } from "react";

const LERP = 0.1; // Lenis default lerp factor (at 60fps: ~500ms to settle)

export default function SmoothScroll() {
  useEffect(() => {
    // Mobile (<1024px): native scroll — SmoothScroll does nothing.
    // globals.css also overrides html/body overflow:hidden as a CSS guard.
    if (window.innerWidth < 1024) return;

    const wrapper = document.getElementById("scroll-wrapper");
    if (!wrapper) return;

    let current      = 0;
    let target       = 0;
    let lastTime     = 0;
    let pendingDelta = 0;
    let rafId        = 0;

    const maxScroll = () => Math.max(0, wrapper.scrollHeight - window.innerHeight);
    const clamp     = (v: number) => Math.max(0, Math.min(v, maxScroll()));

    // Pre-allocate a single Event object — avoids `new CustomEvent(...)` + `{y}` detail
    // allocation on every scroll frame (60fps × session duration = significant GC pressure).
    // Listeners read scroll position from `window.__virtualY` directly.
    const scrollEvent = new Event("virtual-scroll");

    const update = (y: number) => {
      wrapper.style.transform = `translate3d(0,${-y}px,0)`;
      (window as any).__virtualY = y;
      window.dispatchEvent(scrollEvent);
    };

    const tick = (now: number) => {
      // Apply accumulated wheel delta once per frame
      if (pendingDelta !== 0) {
        target       = clamp(target + pendingDelta);
        pendingDelta = 0;
      }

      // Frame-rate normalized lerp: same feel at 60fps and 120fps
      const dt    = lastTime ? Math.min((now - lastTime) / 1000, 0.1) : 1 / 60;
      lastTime    = now;
      const alpha = 1 - Math.pow(1 - LERP, dt * 60);
      current    += (target - current) * alpha;

      // Snap when close enough to avoid infinite micro-animation
      if (Math.abs(target - current) < 0.01) {
        current  = target;
        update(current);
        rafId    = 0;
        lastTime = 0;
        return;
      }

      update(current);
      rafId = requestAnimationFrame(tick);
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      let d = e.deltaY;
      if (e.deltaMode === 1) d *= 32;
      if (e.deltaMode === 2) d *= window.innerHeight;
      pendingDelta += d;
      if (!rafId) rafId = requestAnimationFrame(tick);
    };

    const onKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      const step = window.innerHeight * 0.85;
      if (e.key === "Home") { e.preventDefault(); pendingDelta = -target;               if (!rafId) rafId = requestAnimationFrame(tick); return; }
      if (e.key === "End")  { e.preventDefault(); pendingDelta = maxScroll() - target;  if (!rafId) rafId = requestAnimationFrame(tick); return; }
      const delta: Record<string, number> = {
        ArrowDown: 80, ArrowUp: -80, PageDown: step, " ": step, PageUp: -step,
      };
      if (!(e.key in delta)) return;
      e.preventDefault();
      pendingDelta += delta[e.key];
      if (!rafId) rafId = requestAnimationFrame(tick);
    };

    const onScrollTo = (e: Event) => {
      const dest = (e as CustomEvent<{ target: number }>).detail?.target ?? 0;
      target = clamp(dest);
      if (!rafId) rafId = requestAnimationFrame(tick);
    };

    document.documentElement.classList.add("lenis");
    update(0);

    window.addEventListener("wheel",           onWheel,    { passive: false });
    window.addEventListener("keydown",         onKeyDown);
    window.addEventListener("smoothscroll:to", onScrollTo);

    return () => {
      document.documentElement.classList.remove("lenis");
      window.removeEventListener("wheel",           onWheel);
      window.removeEventListener("keydown",         onKeyDown);
      window.removeEventListener("smoothscroll:to", onScrollTo);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return null;
}
