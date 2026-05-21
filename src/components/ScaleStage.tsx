"use client";

import { useEffect, useState, type ReactNode } from "react";

const DESIGN_W = 1920;
const DESIGN_H = 7956;

export default function ScaleStage({ children }: { children: ReactNode }) {
  const [scale, setScale] = useState(1);

  useEffect(() => {
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
