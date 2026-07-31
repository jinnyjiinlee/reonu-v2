import IntroAnimation from "@/components/IntroAnimation";
import Header from "@/components/Header";
import SmoothScroll from "@/components/SmoothScroll";
import HeroIntro from "@/components/HeroIntro";
import SelectedWork from "@/components/SelectedWork";
import OurService from "@/components/OurService";
import OurProcess from "@/components/OurProcess";
import Pricing from "@/components/Pricing";
import Partners from "@/components/Partners";
import LetsTalkForm from "@/components/LetsTalkForm";
import FooterReveal from "@/components/FooterReveal";
import ScaleStage from "@/components/ScaleStage";
import MobileHome from "@/components/mobile/MobileHome";

// Pricing at HEADING_CANVAS_Y=8440 (was 8290, Δ=+150). LetsTalkForm shifts accordingly.
const PRICING_SHIFT = 1362;

// Extra canvas px gap inserted above Our Partners section.
// OurService ends at Y=4200; Partners heading starts at 4400 (gap=200px, matches Mobius 200px padding-top).
const SECTION_SHIFT = 210;
// Footer's content (divider + "logo + terms" row) lives in its own canvas, starting
// where the old combined canvas's footer divider used to be (10648 + PRICING_SHIFT)
// and running 780px tall (10648 -> 11428).
const FOOTER_CANVAS_H = 855;
// Main canvas now ends right where the footer begins, so Footer can be pulled out
// into its own sticky-reveal stage below.
const CANVAS_H = 11263 + PRICING_SHIFT - FOOTER_CANVAS_H; // reduced from 11726 → form bottom + 160 buffer

export default function Page() {
  return (
    <>
      {/* Shared — visible on all screen sizes */}
      <Header />

      {/* ── Mobile layout (<1024px) ──────────────────────────────────────── */}
      <MobileHome />

      {/* ── Desktop layout (≥1024px) ─────────────────────────────────────── */}
      {/* Fixed elements — OUTSIDE #scroll-wrapper.
          SmoothScroll applies translate3d to #scroll-wrapper each frame, which
          would make any position:fixed child move with it instead of the viewport.
          #scroll-wrapper is hidden on mobile via globals.css media query. */}
      <SmoothScroll />
      <IntroAnimation />

      {/* Footer fixed stage — rendered outside scroll-wrapper so position:fixed
          stays truly viewport-anchored. showSpacer=false: the spacer lives inside
          the scroll-wrapper below so it correctly adds to maxScroll. */}
      <FooterReveal height={FOOTER_CANVAS_H} showSpacer={false} />

      {/* ── Scroll wrapper — all scrollable page content ────────────────────── */}
      <div id="scroll-wrapper" style={{ position: "relative", pointerEvents: "none" }}>
        {/* Full-width white cover — hides ScaleStage images that would otherwise
            show behind the transparent HeroIntro area.
            Height = ROW1_Y(879) × scale = min(879/1920×100vw, 879px) = min(45.78125vw, 879px)
            This matches HeroIntro's visual bottom at 1512px viewport:
            paddingTop(200) + REONU_PH_H(212.4) + gap(64) + text(96) + paddingBottom(120) = 692.4px
            → 120px gap between paragraph and images. zIndex:2 covers ScaleStage(z:1);
            HeroIntro text (z:3) renders on top. */}
        <div
          aria-hidden
          style={{
            position:        "absolute",
            top:             0,
            left:            0,
            right:           0,
            height:          "min(45.78125vw, 879px)",
            backgroundColor: "#ffffff",
            zIndex:          2,
          }}
        />
        {/* HeroIntro — outside the scaled canvas so font renders at actual viewport px,
            matching the reference site's 16px Inter Display. Positioned with the same
            vw-based formula as IntroAnimation so it stays aligned with the canvas content. */}
        <HeroIntro />

        <ScaleStage height={CANVAS_H}>
          <main className="relative bg-white overflow-hidden" style={{ width: 1920, height: CANVAS_H }}>

          <SelectedWork />

          <OurService />

          <OurProcess />

          <Partners />

          <Pricing />

          {/* Everything below Pricing shifted down by PRICING_SHIFT to make room
              for the new stacked-row sticky layout (see Pricing.tsx). */}
          <div className="absolute" style={{ left: 0, top: PRICING_SHIFT, width: 1920 }}>
            <LetsTalkForm />
          </div>

          </main>
        </ScaleStage>

        {/* Footer spacer — same height as FooterReveal fixed stage.
            Lives inside scroll-wrapper so it's counted in wrapper.scrollHeight,
            giving SmoothScroll the right maxScroll to reveal the footer. */}
        <FooterReveal height={FOOTER_CANVAS_H} showFooter={false} />
      </div>
    </>
  );
}
