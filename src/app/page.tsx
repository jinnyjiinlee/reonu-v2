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

// Pricing redesign (stacked rows + scroll-sticky, like OurService) needs extra
// vertical space, so everything below Pricing is shifted down by PRICING_SHIFT.
const PRICING_SHIFT = 856;
// Footer's content (divider + "logo + terms" row) lives in its own canvas, starting
// where the old combined canvas's footer divider used to be (10648 + PRICING_SHIFT)
// and running 780px tall (10648 -> 11428).
const FOOTER_CANVAS_H = 780;
// Main canvas now ends right where the footer begins, so Footer can be pulled out
// into its own sticky-reveal stage below.
const CANVAS_H = 11526 + PRICING_SHIFT - FOOTER_CANVAS_H;

export default function Page() {
  return (
    <>
      <SmoothScroll />
      <IntroAnimation />
      <Header />
      <ScaleStage height={CANVAS_H}>
        <main className="relative bg-white overflow-hidden" style={{ width: 1920, height: CANVAS_H }}>

        <HeroIntro />
        <SelectedWork />

        <OurService />

        <Partners />

        <OurProcess />

        <Pricing />

        {/* Everything below Pricing shifted down by PRICING_SHIFT to make room
            for the new stacked-row sticky layout (see Pricing.tsx). */}
        <div className="absolute" style={{ left: 0, top: PRICING_SHIFT, width: 1920 }}>
          <LetsTalkForm />
        </div>

        </main>
      </ScaleStage>

      {/* Footer — fixed behind the main canvas, revealed as the canvas's bottom
          edge scrolls past (see FooterReveal.tsx). */}
      <FooterReveal height={FOOTER_CANVAS_H} />
    </>
  );
}
