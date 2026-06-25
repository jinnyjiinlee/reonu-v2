"use client";

import Image from "next/image";
import { useState, useRef } from "react";
import { partnersRowA, partnersRowB } from "@/data/content";
import SplitTextReveal from "@/components/SplitTextReveal";

const TILE_W = 220;
const TILE_H = 100;
const LOGO_W = 196;
const LOGO_H = 76;
const TILE_GAP = 12;

// phase: 'idle' → 'color' (logo in color) → 'text' (show name)
function LogoTile({ src, alt }: { src: string; alt: string }) {
  const [phase, setPhase] = useState<"idle" | "color" | "text">("idle");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleEnter = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setPhase("color");
    timerRef.current = setTimeout(() => setPhase("text"), 320);
  };

  const handleLeave = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setPhase("idle");
  };

  return (
    <div
      data-cursor="hidden"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      style={{
        width: TILE_W,
        height: TILE_H,
        flex: `0 0 ${TILE_W}px`,
        backgroundColor: "transparent",
        borderRadius: 0,
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        flexShrink: 0,
      }}
    >
      {/* Logo image — grayscale idle, color on hover, fades out on text phase */}
      <div
        style={{
          position: "relative",
          width: LOGO_W,
          height: LOGO_H,
          flexShrink: 0,
          filter: phase === "idle" ? "grayscale(1) opacity(0.8)" : "grayscale(0) opacity(1)",
          opacity: phase === "text" ? 0 : 1,
          transition: "filter 0.3s ease, opacity 0.25s ease",
        }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          unoptimized
          className="object-contain"
          sizes={`${LOGO_W}px`}
        />
      </div>

      {/* Text overlay — fades in on text phase */}
      <span
        style={{
          position: "absolute",
          fontFamily: "var(--font-inter), 'Inter', sans-serif",
          fontWeight: 500,
          letterSpacing: "-0.02em",
          color: "#1D1D1F",
          fontSize: 13,
          opacity: phase === "text" ? 1 : 0,
          transform: phase === "text" ? "translateY(0)" : "translateY(6px)",
          transition: "opacity 0.25s ease, transform 0.25s ease",
          pointerEvents: "none",
          whiteSpace: "nowrap",
          textAlign: "center",
          maxWidth: LOGO_W,
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {alt}
      </span>
    </div>
  );
}

export default function Partners() {
  const rowA = [...partnersRowA, ...partnersRowA, ...partnersRowA];
  const rowB = [...partnersRowB, ...partnersRowB, ...partnersRowB];

  return (
    <>
      <SplitTextReveal
        text="Our"
        className="absolute font-headline font-bold tracking-[-0.03em] text-[#1D1D1F]"
        style={{ left: 60, top: 4030, fontSize: 56, lineHeight: "72px", whiteSpace: "nowrap" }}
      />
      <SplitTextReveal
        text="Partners"
        className="absolute font-headline font-bold tracking-[-0.03em] text-[#1D1D1F]"
        style={{ left: 60, top: 4102, fontSize: 56, lineHeight: "72px", whiteSpace: "nowrap" }}
      />

      <div
        className="absolute overflow-hidden"
        style={{ left: 0, top: 4238, width: 1920, height: TILE_H }}
      >
        <div className="marquee-track" style={{ animationDuration: "90s", gap: TILE_GAP }}>
          {[...rowA, ...rowA].map((p, i) => (
            <LogoTile key={`a-${i}`} src={p.src} alt={p.name} />
          ))}
        </div>
      </div>

      <div
        className="absolute overflow-hidden"
        style={{ left: 0, top: 4238 + TILE_H + 12, width: 1920, height: TILE_H }}
      >
        <div
          className="marquee-track"
          style={{ animationDuration: "110s", animationDirection: "reverse", gap: TILE_GAP }}
        >
          {[...rowB, ...rowB].map((p, i) => (
            <LogoTile key={`b-${i}`} src={p.src} alt={p.name} />
          ))}
        </div>
      </div>

      {/* Side fade overlays — solid through the 60px content edge, then fade inward */}
      <div
        className="absolute pointer-events-none"
        style={{
          left: 0,
          top: 4241,
          width: 180,
          height: TILE_H * 2 + 12,
          background: "linear-gradient(to right, #ffffff 0%, #ffffff 33.33%, rgba(255,255,255,0) 100%)",
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          right: 0,
          top: 4241,
          width: 180,
          height: TILE_H * 2 + 12,
          background: "linear-gradient(to left, #ffffff 0%, #ffffff 33.33%, rgba(255,255,255,0) 100%)",
        }}
      />
    </>
  );
}
