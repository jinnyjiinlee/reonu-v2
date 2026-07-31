import Header from "@/components/Header";
import SmoothScroll from "@/components/SmoothScroll";
import IntroAnimation from "@/components/IntroAnimation";
import ScaleStage from "@/components/ScaleStage";
import FooterReveal from "@/components/FooterReveal";
import WorksContent from "@/components/WorksContent";
import WorksHeroIntro from "@/components/WorksHeroIntro";
import { FilterProvider } from "@/context/FilterContext";
import MobileWorks from "@/components/mobile/MobileWorks";

// 2-column flex grid — 26 projects / 2 cols = 13 rows, image size matches main page SelectedWork
// COL_W = (1920 - 60*2 - 24) / 2 = 888, COL_H = 800 (same as SelectedWork ROW1_H)
const COL_W        = (1920 - 60 * 2 - 24) / 2;                  // 888
const COL_H        = 800;                                         // matches SelectedWork ROW1_H
// GRID_START_Y = 720 canvas px — aligns with new HERO_H (paddingTop:200 + REONU_H:270 + gap:200 + chipH:18 + paddingBottom:32 = 720)
const GRID_START_Y = 720;                                         // 720
const ROW_STRIDE   = COL_H + 24;                                  // 800+24 = 824 (labels removed)
const ROWS         = 13;                                          // ceil(26/2)
const CANVAS_H     = GRID_START_Y + ROWS * ROW_STRIDE + 160;     // 720 + 13*824 + 160 = 11592
const FOOTER_CANVAS_H = 855;

// White cover — same as HERO_H = min(calc(14.0625vw + 450px), 720px)
const WHITE_COVER_H = "min(calc(14.0625vw + 450px), 720px)";

export default function WorksPage() {
  return (
    <FilterProvider>
      {/* Shared */}
      <Header />

      {/* Mobile */}
      <MobileWorks />

      {/* Desktop */}
      <SmoothScroll />
      <IntroAnimation href="/" />

      {/* Fixed footer stage — outside scroll-wrapper so position:fixed stays viewport-anchored */}
      <FooterReveal height={FOOTER_CANVAS_H} showSpacer={false} />

      {/* Scroll wrapper — SmoothScroll looks for this id */}
      <div id="scroll-wrapper" style={{ position: "relative", pointerEvents: "none" }}>

        {/* White cover — covers canvas area above grid; chips sit on top via z-index:3 */}
        <div
          aria-hidden
          style={{
            position:        "absolute",
            top:             0,
            left:            0,
            right:           0,
            height:          WHITE_COVER_H,
            backgroundColor: "#ffffff",
            zIndex:          2,
          }}
        />

        {/* WorksHeroIntro — description text + chips, outside canvas in real viewport px.
            Content column: height:100% (=HERO_H), paddingBottom:24px — mirrors HeroIntro */}
        <WorksHeroIntro />

        <ScaleStage height={CANVAS_H}>
          <main
            className="relative bg-white overflow-hidden"
            style={{ width: 1920, height: CANVAS_H }}
          >
            <WorksContent />
          </main>
        </ScaleStage>

        {/* Footer spacer — adds to scrollHeight so footer reveal triggers correctly */}
        <FooterReveal height={FOOTER_CANVAS_H} showFooter={false} />
      </div>
    </FilterProvider>
  );
}
