"use client";

import { useState, useLayoutEffect, useRef } from "react";
import ScaleStage from "@/components/ScaleStage";
import FooterReveal from "@/components/FooterReveal";
import WorkDetailHeroIntro from "@/components/WorkDetailHeroIntro";
import WorkDetailContent, { GALLERY_TAIL } from "@/components/WorkDetailContent";
import type { WorkItem } from "@/data/works";

const FOOTER_CANVAS_H = 855;
const GAP_REAL        = 0;   // no gap — hero image starts immediately below overlay

// SSR defaults (1920px design width)
// overlayH = HERO_H at 1920px = 879px (minHeight matches main page)
const SSR_OVERLAY_H  = 879;
const SSR_HERO_TOP   = SSR_OVERLAY_H + GAP_REAL;   // 879 canvas px (scale=1 at 1920px)
const SSR_CANVAS_H   = SSR_HERO_TOP + GALLERY_TAIL; // 4439

export default function WorkDetailPageClient({ item, next }: { item: WorkItem; next: WorkItem }) {
  // overlayRef → inner content column div of WorkDetailHeroIntro
  // offsetHeight = distance from page top to bottom of info block (real px, includes padding)
  const overlayRef = useRef<HTMLDivElement>(null);
  const [heroTop, setHeroTop]   = useState(SSR_HERO_TOP);
  const [canvasH, setCanvasH]   = useState(SSR_CANVAS_H);

  useLayoutEffect(() => {
    const el = overlayRef.current;
    if (!el) return;

    function update() {
      const overlayH = el!.offsetHeight;               // real px height of the content column
      const s        = Math.min(window.innerWidth / 1920, 1);
      const ht       = Math.round((overlayH + GAP_REAL) / s);  // canvas px for hero top
      setHeroTop(ht);
      setCanvasH(ht + GALLERY_TAIL);
    }

    update();

    // Re-measure on font/content change (ResizeObserver) and on viewport resize
    const ro = new ResizeObserver(update);
    ro.observe(el);
    window.addEventListener("resize", update);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div id="scroll-wrapper" style={{ position: "relative", pointerEvents: "none" }}>
      {/* Real-px flex overlay (mirrors main page HeroIntro structure):
          paddingTop:200 | REONU placeholder | [equal gap] | info block | [equal gap] | paddingBottom:24 */}
      <WorkDetailHeroIntro item={item} ref={overlayRef} />

      <ScaleStage height={canvasH}>
        <main
          className="relative bg-white overflow-hidden"
          style={{ width: 1920, height: canvasH }}
        >
          {/* heroTop is measured — hero image always starts exactly GAP_REAL below overlay */}
          <WorkDetailContent item={item} next={next} heroTop={heroTop} />
        </main>
      </ScaleStage>

      {/* Footer spacer — adds to scrollHeight so footer reveal triggers correctly */}
      <FooterReveal height={FOOTER_CANVAS_H} showFooter={false} />
    </div>
  );
}
