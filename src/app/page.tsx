import Header from "@/components/Header";
import HeroIntro from "@/components/HeroIntro";
import SelectedWork from "@/components/SelectedWork";
import OurService from "@/components/OurService";
import OurProcess from "@/components/OurProcess";
import Pricing from "@/components/Pricing";
import Partners from "@/components/Partners";
import LetsTalkForm from "@/components/LetsTalkForm";
import Footer from "@/components/Footer";
import SectionLabel from "@/components/SectionLabel";
import ScaleStage from "@/components/ScaleStage";

// Canvas height updated to match Figma frame 1:23 (1920×7956)
const CANVAS_H = 7956;

export default function Page() {
  return (
    <ScaleStage>
      <main className="relative bg-white" style={{ width: 1920, height: CANVAS_H }}>
        <Header />

        <HeroIntro />
        <SelectedWork />

        <SectionLabel num="02" top={493} />
        <SectionLabel num="03" top={2478} />
        <OurService />

        <SectionLabel num="04" top={3736} />
        <OurProcess />

        <SectionLabel num="05" top={4654} />
        <Pricing />

        <SectionLabel num="06" top={5472} />
        <Partners />

        <SectionLabel num="07" top={6069} />
        <LetsTalkForm />

        <Footer />
      </main>
    </ScaleStage>
  );
}
