import { notFound } from "next/navigation";
import Header from "@/components/Header";
import SmoothScroll from "@/components/SmoothScroll";
import IntroAnimation from "@/components/IntroAnimation";
import FooterReveal from "@/components/FooterReveal";
import WorkDetailPageClient from "@/components/WorkDetailPageClient";
import { WORKS_DATA } from "@/data/works";
import MobileWorkDetail from "@/components/mobile/MobileWorkDetail";

const FOOTER_CANVAS_H = 855;

export function generateStaticParams() {
  return WORKS_DATA.map((item) => ({ id: item.id }));
}

export default async function WorkDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const index = WORKS_DATA.findIndex((w) => w.id === id);
  if (index === -1) notFound();

  const item = WORKS_DATA[index];
  const next = WORKS_DATA[(index + 1) % WORKS_DATA.length];

  return (
    <>
      {/* Shared */}
      <Header />

      {/* Mobile layout */}
      <MobileWorkDetail item={item} next={next} />

      {/* Desktop layout */}
      <SmoothScroll />
      <IntroAnimation href="/" />

      {/* Fixed footer stage — outside scroll-wrapper so position:fixed stays viewport-anchored */}
      <FooterReveal height={FOOTER_CANVAS_H} showSpacer={false} />

      {/* Client component owns scroll-wrapper, real-px overlay, ScaleStage, and footer spacer */}
      <WorkDetailPageClient item={item} next={next} />
    </>
  );
}
