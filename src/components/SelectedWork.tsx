import Image from "next/image";

type Work = {
  src: string;
  x: number;
  y: number;
  marquee: string;
};

const works: Work[] = [
  { src: "/images/works/work-01.png", x: 60, y: 618, marquee: "(MOMO) • UXUI" },
  { src: "/images/works/work-03.png", x: 972, y: 618, marquee: "(MOMO) • UXUI" },
  { src: "/images/works/work-02.png", x: 60, y: 1518, marquee: "(MOMO) • UXUI" },
  { src: "/images/works/work-04.png", x: 972, y: 1518, marquee: "(MOMO) • UXUI" },
];

function WorkCard({
  src,
  marquee,
  index,
}: {
  src: string;
  marquee: string;
  index: number;
}) {
  const strip = Array.from({ length: 8 }).map((_, i) => (
    <span key={i} className="inline-block pr-[40px]">
      {marquee}&nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp;
    </span>
  ));

  return (
    <a
      href="#"
      className="group absolute block overflow-hidden bg-[#EEEEEE] cursor-none"
      style={{ width: 888, height: 880 }}
    >
      <Image
        src={src}
        alt={`Work ${index + 1}`}
        width={888}
        height={880}
        priority={index < 2}
        className="object-cover w-full h-full"
      />

      {/* Dark hover overlay */}
      <div className="pointer-events-none absolute inset-0 bg-black/30 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      {/* Hover marquee — Figma: Inter Regular 40px white */}
      <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 overflow-hidden opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none">
        <div
          className="marquee-track font-display text-[40px] leading-[48px] font-normal tracking-[-0.01em] text-white whitespace-nowrap"
          style={{ animationDuration: "30s" }}
        >
          {strip}
          {strip}
        </div>
      </div>

      {/* Open Project pill — Figma: Inter Regular 28px white */}
      <span
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center rounded-full font-display text-[28px] leading-[34px] font-normal tracking-[-0.01em] text-white opacity-0 transition-all duration-300 group-hover:opacity-100"
        style={{
          paddingInline: 32,
          paddingBlock: 14,
          background: "rgba(31, 31, 31, 0.78)",
          backdropFilter: "blur(2px)",
        }}
      >
        Open Project
      </span>
    </a>
  );
}

export default function SelectedWork() {
  return (
    <>
      <h2
        className="absolute font-display text-[64px] leading-[77px] font-bold tracking-[-0.03em] text-[#1F1F1F]"
        style={{ left: 60, top: 491 }}
      >
        Selected Work
      </h2>

      <span
        className="absolute block rounded-full bg-[#1F1F1F]"
        style={{ left: 1220, top: 438, width: 18, height: 18 }}
      />

      {works.map((w, i) => (
        <div
          key={i}
          className="absolute"
          style={{ left: w.x, top: w.y, width: 888, height: 880 }}
        >
          <WorkCard src={w.src} marquee={w.marquee} index={i} />
        </div>
      ))}

      {/* See all works -> — 28px Inter Regular #1F1F1F (Figma spec) */}
      <a
        href="#works"
        className="absolute z-10 font-display text-[28px] leading-[34px] font-normal tracking-[-0.01em] text-[#1F1F1F] hover:opacity-60 transition-opacity"
        style={{ right: 60, top: 1465 }}
      >
        See all works →
      </a>
    </>
  );
}
