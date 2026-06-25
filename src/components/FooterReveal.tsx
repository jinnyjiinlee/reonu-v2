"use client";

import { useEffect, useState } from "react";
import Footer from "@/components/Footer";

const DESIGN_W = 1920;

/**
 * Sticky-reveal footer.
 *
 * The footer is rendered `position: fixed` to the bottom of the viewport, behind
 * the main canvas (z-index 0 vs the canvas's z-index 1 + opaque white background).
 * A spacer of the same height is inserted in normal flow right after the main
 * canvas so the page can scroll the extra distance needed to slide the canvas's
 * bottom edge up and reveal the fixed footer underneath.
 *
 * Both this stage and the main canvas are plain white at all times, so the side
 * margins (outside the centered 1920px canvas, on screens wider than 1920px)
 * always match the canvas's color exactly — no overlay/tint that could create a
 * mismatch between the margins and the canvas during the reveal animation.
 */
export default function FooterReveal({ height }: { height: number }) {
  const FOOTER_CANVAS_H = height;
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const update = () => {
      setScale(Math.min(window.innerWidth / DESIGN_W, 1));
    };

    update();
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("resize", update);
    };
  }, []);

  const stageHeight = FOOTER_CANVAS_H * scale;
  const stageWidth  = Math.min(DESIGN_W * scale, DESIGN_W);

  return (
    <>
      {/* Spacer — reserves scroll room for the footer to be revealed into */}
      <div style={{ height: stageHeight }} />

      {/* Fixed footer stage, sits behind the main canvas. White everywhere,
          including the side margins on screens wider than the 1920px canvas. */}
      <div
        className="fixed inset-x-0 bottom-0 bg-white"
        style={{ height: stageHeight, overflow: "hidden", zIndex: 0 }}
      >
        <div
          className="relative mx-auto bg-white"
          style={{ width: stageWidth, height: stageHeight, overflow: "hidden" }}
        >
          <div
            style={{
              width: DESIGN_W,
              height: FOOTER_CANVAS_H,
              transform: `scale(${scale})`,
              transformOrigin: "top left",
            }}
          >
            <Footer />
          </div>
        </div>
      </div>
    </>
  );
}
