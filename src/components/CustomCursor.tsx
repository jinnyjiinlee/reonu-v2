"use client";

import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = dotRef.current;
    if (!el) return;

    let raf = 0;
    let targetX = -100;
    let targetY = -100;
    let renderedX = -100;
    let renderedY = -100;

    const tick = () => {
      // Subtle smoothing so the dot eases toward the pointer
      renderedX += (targetX - renderedX) * 0.35;
      renderedY += (targetY - renderedY) * 0.35;
      el.style.transform = `translate3d(${renderedX}px, ${renderedY}px, 0) translate(-50%, -50%)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const onMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
    };

    const onEnterInteractive = () => {
      el.style.width = "36px";
      el.style.height = "36px";
    };
    const onLeaveInteractive = () => {
      el.style.width = "14px";
      el.style.height = "14px";
    };

    window.addEventListener("mousemove", onMove);

    // Grow the dot over interactive elements
    const interactive = document.querySelectorAll<HTMLElement>(
      "a, button, input, select, textarea, label, [data-cursor='hover']",
    );
    interactive.forEach((node) => {
      node.addEventListener("mouseenter", onEnterInteractive);
      node.addEventListener("mouseleave", onLeaveInteractive);
    });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      interactive.forEach((node) => {
        node.removeEventListener("mouseenter", onEnterInteractive);
        node.removeEventListener("mouseleave", onLeaveInteractive);
      });
    };
  }, []);

  return (
    <div
      ref={dotRef}
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-[9999] rounded-full bg-black"
      style={{
        width: 14,
        height: 14,
        transition: "width 180ms ease, height 180ms ease",
        willChange: "transform",
      }}
    />
  );
}
