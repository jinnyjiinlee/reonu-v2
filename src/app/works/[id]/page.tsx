import { notFound } from "next/navigation";
import Header from "@/components/Header";
import SmoothScroll from "@/components/SmoothScroll";
import IntroAnimation from "@/components/IntroAnimation";
import ScaleStage from "@/components/ScaleStage";
import FooterReveal from "@/components/FooterReveal";
import WorkDetailContent, { DETAIL_CANVAS_H } from "@/components/WorkDetailContent";
import { WORKS_DATA } from "@/data/works";

const FOOTER_CANVAS_H = 780;

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
      <SmoothScroll />
      <IntroAnimation href="/" />
      <Header />
      <ScaleStage height={DETAIL_CANVAS_H}>
        <main
          className="relative bg-white overflow-hidden"
          style={{ width: 1920, height: DETAIL_CANVAS_H }}
        >
          <WorkDetailContent item={item} next={next} />
        </main>
      </ScaleStage>
      <FooterReveal height={FOOTER_CANVAS_H} />
    </>
  );
}
