"use client";

import { useLayoutEffect, useState, type ReactNode } from "react";

const DESIGN_W = 1920;
// Footer's "logo + terms" row used to end at y=11428 (10769 + 116 + 80 + 128 + 87 + 248).
// Now passed in from page.tsx as `height` (CANVAS_H) so this never goes stale when the
// canvas height changes — fall back to the old value if not provided.
const DEFAULT_DESIGN_H = 11428;

export default function ScaleStage({
  children,
  height = DEFAULT_DESIGN_H,
}: {
  children: ReactNode;
  height?: number;
}) {
  const DESIGN_H = height;
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    const update = () => {
      // Scale to fit viewport width — never upscale beyond 1.0 so 1920+ monitors
      // see the design at its true pixel size, centered.
      const next = Math.min(window.innerWidth / DESIGN_W, 1);
      setScale(next);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return (
    <div
      className="mx-auto bg-white"
      style={{
        width: Math.min(DESIGN_W * scale, DESIGN_W),
        height: DESIGN_H * scale,
        overflow: "hidden",
        position: "relative",
        zIndex: 1,
      }}
    >
      <div
        style={{
          width: DESIGN_W,
          height: DESIGN_H,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
        }}
      >
        {children}
      </div>
    </div>
  );
}
