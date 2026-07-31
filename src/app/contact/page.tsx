import Header from "@/components/Header";
import SmoothScroll from "@/components/SmoothScroll";
import IntroAnimation from "@/components/IntroAnimation";
import ScaleStage from "@/components/ScaleStage";
import FooterReveal from "@/components/FooterReveal";
import ContactContent, { CONTACT_CANVAS_H } from "@/components/ContactContent";
import MobileContact from "@/components/mobile/MobileContact";

const FOOTER_CANVAS_H = 855;

export default function ContactPage() {
  return (
    <>
      {/* Shared */}
      <Header />

      {/* Mobile */}
      <MobileContact />

      {/* Desktop */}
      <SmoothScroll />
      <IntroAnimation href="/" />

      {/* Fixed footer stage — outside scroll-wrapper */}
      <FooterReveal height={FOOTER_CANVAS_H} showSpacer={false} />

      {/* Scroll wrapper */}
      <div id="scroll-wrapper" style={{ position: "relative", pointerEvents: "none" }}>
        <ScaleStage height={CONTACT_CANVAS_H}>
          <main
            className="relative bg-white overflow-hidden"
            style={{ width: 1920, height: CONTACT_CANVAS_H }}
          >
            <ContactContent />
          </main>
        </ScaleStage>

        {/* Footer spacer */}
        <FooterReveal height={FOOTER_CANVAS_H} showFooter={false} />
      </div>
    </>
  );
}
