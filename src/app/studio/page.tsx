import Header from "@/components/Header";
import SmoothScroll from "@/components/SmoothScroll";
import IntroAnimation from "@/components/IntroAnimation";
import ScaleStage from "@/components/ScaleStage";
import FooterReveal from "@/components/FooterReveal";
import StudioContent, { STUDIO_CANVAS_H } from "@/components/StudioContent";
import StudioHeroIntro from "@/components/StudioHeroIntro";
import MobileStudio from "@/components/mobile/MobileStudio";

const FOOTER_CANVAS_H = 855;

export default function StudioPage() {
  return (
    <>
      {/* Shared — all screen sizes */}
      <Header />

      {/* Mobile layout (<1024px) */}
      <MobileStudio />

      {/* Desktop layout (≥1024px) — hidden on mobile via #scroll-wrapper CSS */}
      <SmoothScroll />
      <IntroAnimation href="/" />

      {/* Fixed footer stage — outside scroll-wrapper */}
      <FooterReveal height={FOOTER_CANVAS_H} showSpacer={false} />

      {/* Scroll wrapper — SmoothScroll looks for this id */}
      <div id="scroll-wrapper" style={{ position: "relative", pointerEvents: "none" }}>
        {/* White cover — hides LEFT (text) column only while IntroAnimation REONU is visible.
            RIGHT column (image) is intentionally exposed so the photo fills from the very top,
            matching the Möbius full-bleed layout. REONU animation lives on the left, so
            covering only the left column (0 → R_X=840 at 1920px = 43.75vw) is sufficient.
            min(43.75vw, 840px) keeps coverage exact at any viewport up to 1920px. */}
        <div
          aria-hidden
          style={{
            position:        "absolute",
            top:             0,
            left:            0,
            width:           "min(51.04vw, 980px)", /* covers text column up to R_X=980 */
            height:          "min(36.458vw, 700px)",
            backgroundColor: "#ffffff",
            zIndex:          2,
          }}
        />

        <StudioHeroIntro />

        <ScaleStage height={STUDIO_CANVAS_H}>
          <main
            className="relative bg-white overflow-hidden"
            style={{ width: 1920, height: STUDIO_CANVAS_H }}
          >
            <StudioContent />
          </main>
        </ScaleStage>

        {/* Footer spacer — adds to scrollHeight so footer reveal triggers */}
        <FooterReveal height={FOOTER_CANVAS_H} showFooter={false} />
      </div>
    </>
  );
}
