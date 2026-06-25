import Header from "@/components/Header";
import SmoothScroll from "@/components/SmoothScroll";
import IntroAnimation from "@/components/IntroAnimation";
import ScaleStage from "@/components/ScaleStage";
import FooterReveal from "@/components/FooterReveal";
import WorksContent from "@/components/WorksContent";

// Vertical 3-column grid — 26 real projects / 3 cols = 9 rows (last row: 2 items)
// Mirrors WorksContent.tsx's derivation: COL_W from (1920 - PAD*2 - GAP*2)/3,
// COL_H from the 700:920 ratio scaled to COL_W.
const COL_W        = (1920 - 60 * 2 - 40 * 2) / 3;  // ≈ 573.33
const COL_H        = COL_W * (920 / 700);            // ≈ 753.78
const GRID_START_Y = 440 + 200 + 24 + 64;            // REONU_BOTTOM -200-> chips(24) -64-> grid = 728
const ROW_STRIDE    = COL_H + 132 + 40;               // LABEL_H(132, paddingTop 32 + category+2-line title) + ROW_GAP(40, matches COL_GAP)
const ROWS         = 9;
const CANVAS_H      = GRID_START_Y + (ROWS - 1) * ROW_STRIDE + COL_H + 132 + 320; // ≈ 9268.2
const FOOTER_CANVAS_H = 780;

export default function WorksPage() {
  return (
    <>
      <SmoothScroll />
      <IntroAnimation href="/" />
      <Header />
      <ScaleStage height={CANVAS_H}>
        <main
          className="relative bg-white overflow-hidden"
          style={{ width: 1920, height: CANVAS_H }}
        >
          <WorksContent />
        </main>
      </ScaleStage>
      <FooterReveal height={FOOTER_CANVAS_H} />
    </>
  );
}
