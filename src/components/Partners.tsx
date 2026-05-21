import Image from "next/image";
import { partnersRowA, partnersRowB } from "@/data/content";

const TILE_W = 220;
const TILE_H = 120;
const LOGO_W = 190;
const LOGO_H = 100;
const TILE_GAP = 8;

function LogoTile({ src, alt }: { src: string; alt: string }) {
  return (
    <div
      className="flex items-center justify-center bg-white"
      style={{ width: TILE_W, height: TILE_H, flex: `0 0 ${TILE_W}px`, marginRight: TILE_GAP }}
    >
      <div className="relative" style={{ width: LOGO_W, height: LOGO_H }}>
        <Image
          src={src}
          alt={alt}
          fill
          className="object-contain"
          sizes={`${LOGO_W}px`}
        />
      </div>
    </div>
  );
}

export default function Partners() {
  const rowA = [...partnersRowA, ...partnersRowA, ...partnersRowA];
  const rowB = [...partnersRowB, ...partnersRowB, ...partnersRowB];

  return (
    <>
      <h2
        className="absolute font-display text-[40px] leading-[48px] font-bold tracking-[-0.03em] text-[#1f1f1f]"
        style={{ left: 60, top: 5470 }}
      >
        Our Partners
      </h2>

      <div
        className="absolute overflow-hidden"
        style={{ left: 0, top: 5609, width: 1920, height: TILE_H }}
      >
        <div className="marquee-track" style={{ animationDuration: "45s" }}>
          {[...rowA, ...rowA].map((p, i) => (
            <LogoTile key={`a-${i}`} src={p.src} alt={p.name} />
          ))}
        </div>
      </div>

      <div
        className="absolute overflow-hidden"
        style={{ left: 0, top: 5609 + TILE_H + 12, width: 1920, height: TILE_H }}
      >
        <div
          className="marquee-track"
          style={{ animationDuration: "55s", animationDirection: "reverse" }}
        >
          {[...rowB, ...rowB].map((p, i) => (
            <LogoTile key={`b-${i}`} src={p.src} alt={p.name} />
          ))}
        </div>
      </div>

      {/* Side fade overlays */}
      <div
        className="absolute pointer-events-none"
        style={{
          left: 0,
          top: 5609,
          width: 120,
          height: TILE_H * 2 + 12,
          background:
            "linear-gradient(to right, #ffffff 0%, rgba(255,255,255,0) 100%)",
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          right: 0,
          top: 5609,
          width: 120,
          height: TILE_H * 2 + 12,
          background:
            "linear-gradient(to left, #ffffff 0%, rgba(255,255,255,0) 100%)",
        }}
      />
    </>
  );
}
