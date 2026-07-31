"use client";
import { useEffect, useRef } from "react";

const EASE_DOT = 0.04;
const DOT_R    = 10;

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Touch/mobile devices: skip custom cursor entirely.
    if ("ontouchstart" in window || navigator.maxTouchPoints > 0) return;

    const dot = dotRef.current;
    if (!dot) return;

    let raf = 0;
    let mx = -500, my = -500;
    let dx = -500, dy = -500;
    let isHidden = false;

    // Self-terminating RAF — stops when settled, restarts on mousemove.
    // Avoids burning a full 60fps slot when cursor hasn't moved.
    const tick = () => {
      const ddx = mx - dx;
      const ddy = my - dy;
      if (Math.abs(ddx) < 0.3 && Math.abs(ddy) < 0.3) {
        // Settled — snap and stop
        dx = mx; dy = my;
        dot.style.transform = `translate3d(${dx}px,${dy}px,0) translate(-50%,-50%)`;
        raf = 0;
        return;
      }
      dx += ddx * EASE_DOT;
      dy += ddy * EASE_DOT;
      dot.style.transform = `translate3d(${dx}px,${dy}px,0) translate(-50%,-50%)`;
      raf = requestAnimationFrame(tick);
    };
    // Don't start RAF immediately — cursor starts off-screen and will be
    // triggered by the first mousemove event.

    const onMove = (e: MouseEvent) => {
      mx = e.clientX; my = e.clientY;
      const under = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null;
      const hidden = !!under?.closest("[data-cursor='hidden'], .nav-item");
      if (hidden !== isHidden) {
        isHidden = hidden;
        dot.style.opacity = hidden ? "0" : "1";
      }
      // Restart RAF only if not already running
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const onLeave = () => { dot.style.opacity = "0"; };
    const onEnter = () => { if (!isHidden) dot.style.opacity = "1"; };

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
    };
  }, []);

  return (
    <div
      ref={dotRef}
      aria-hidden="true"
      style={{
        position:      "fixed",
        top:           0,
        left:          0,
        width:         DOT_R * 2,
        height:        DOT_R * 2,
        borderRadius:  "50%",
        background:    "white",
        pointerEvents: "none",
        zIndex:        99999,
        mixBlendMode:  "difference",
        transform:     "translate3d(-500px,-500px,0) translate(-50%,-50%)",
        willChange:    "transform",
        transition:    "opacity 200ms ease",
      }}
    />
  );
}
