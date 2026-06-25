"use client";
import { useLayoutEffect, useRef, useState } from "react";

const EASE = "cubic-bezier(0.4, 0, 0.2, 1)";
const DUR  = "0.5s";

const PAD     = 60;
const COL_W   = 890;
const ROW1_H  = 800;
const ROW2_H  = 800;
const COL_GAP = 20;
const ROW1_Y  = 760;
const ROW_GAP = 20;
const ROW2_Y  = ROW1_Y + ROW1_H + ROW_GAP;


/* ── Works data ─────────────────────────────────────────────────────────── */
const ArrowSVG = ({ color = "#1D1D1F", size = 16 }: { color?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true" style={{ display: "block", flexShrink: 0 }}>
    <line x1="2" y1="8" x2="13" y2="8" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    <line x1="8" y1="3" x2="13" y2="8" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    <line x1="8" y1="13" x2="13" y2="8" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const works = [
  { src: "/images/works/work-01.png", x: PAD,                   y: ROW1_Y, h: ROW1_H, w: COL_W, marquee: "(MOMO) • UXUI" },
  { src: "/images/works/work-03.png", x: PAD + COL_W + COL_GAP, y: ROW1_Y, h: ROW1_H, w: COL_W, marquee: "(MOMO) • UXUI" },
  { src: "/images/works/work-02.png", x: PAD,                   y: ROW2_Y, h: ROW2_H, w: COL_W, marquee: "(MOMO) • UXUI" },
  { src: "/images/works/work-04.png", x: PAD + COL_W + COL_GAP, y: ROW2_Y, h: ROW2_H, w: COL_W, marquee: "(MOMO) • UXUI" },
];

/* ── WorkCard ────────────────────────────────────────────────────────────── */
function WorkCard({ src, marquee, index, height, width }: { src: string; marquee: string; index: number; height: number; width: number }) {
  const cardRef        = useRef<HTMLAnchorElement>(null);
  const pillRef        = useRef<HTMLSpanElement>(null);
  const imgWrapRef     = useRef<HTMLDivElement>(null);
  const overlayRef     = useRef<HTMLDivElement>(null);
  const marqueeWrapRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const card = cardRef.current;
    const pill = pillRef.current;
    if (!card || !pill) return;

    /* ── State ── */
    let ptx = width / 2, pty = height / 2;
    let prx = ptx,       pry = pty;
    let raf = 0;
    let hovering = false;

    const toLayout = (cx: number, cy: number) => {
      const r = card.getBoundingClientRect();
      return {
        lx: (cx - r.left) * (width / r.width),
        ly: (cy - r.top)  * (height / r.height),
      };
    };

    /* ── Render loop — self-terminating when settled and not hovering ── */
    const tick = () => {
      prx += (ptx - prx) * 0.22; pry += (pty - pry) * 0.22;
      const settled = Math.abs(ptx - prx) < 0.1 && Math.abs(pty - pry) < 0.1;
      if (settled) { prx = ptx; pry = pty; }
      pill.style.transform = `translate(${prx}px, ${pry}px)`;
      if (settled && !hovering) {
        raf = 0; // stop — restarts on next mouseenter/mousemove
        return;
      }
      raf = requestAnimationFrame(tick);
    };

    const startTick = () => { if (!raf) raf = requestAnimationFrame(tick); };

    /* ── Mouse handlers ── */
    const onMove = (e: MouseEvent) => {
      const { lx, ly } = toLayout(e.clientX, e.clientY);
      ptx = lx + 16; pty = ly + 16;
      startTick();
    };

    const onEnter = (e: MouseEvent) => {
      hovering = true;
      const { lx, ly } = toLayout(e.clientX, e.clientY);
      prx = lx + 16; pry = ly + 16; ptx = prx; pty = pry;

      pill.style.opacity = "1";
      if (imgWrapRef.current)     imgWrapRef.current.style.filter    = "brightness(0.82)";
      if (overlayRef.current)     overlayRef.current.style.opacity    = "1";
      if (marqueeWrapRef.current) marqueeWrapRef.current.style.opacity = "1";
      startTick();
    };

    const onLeave = () => {
      hovering = false;
      pill.style.opacity = "0";
      if (imgWrapRef.current)     imgWrapRef.current.style.filter    = "";
      if (overlayRef.current)     overlayRef.current.style.opacity    = "0";
      if (marqueeWrapRef.current) marqueeWrapRef.current.style.opacity = "0";
      // RAF continues briefly to let pill ease to final position, then self-terminates
    };

    card.addEventListener("mousemove",  onMove);
    card.addEventListener("mouseenter", onEnter);
    card.addEventListener("mouseleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      card.removeEventListener("mousemove",  onMove);
      card.removeEventListener("mouseenter", onEnter);
      card.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  /* ── Marquee strip ── */
  const strip = Array.from({ length: 10 }).map((_, i) => (
    <span key={i} className="inline-block pr-[40px]">
      {marquee}&nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp;
    </span>
  ));

  return (
    <a
      ref={cardRef}
      href="#"
      data-cursor="hidden"
      className="absolute block cursor-none"
      style={{ width: width, height: height, inset: 0 }}
    >
      <div
        style={{
          position:     "absolute",
          inset:        0,
          background:   "#F5F5F7",
          borderRadius: 12,
          overflow:     "hidden",
        }}
      >
        {/* Image */}
        <div
          ref={imgWrapRef}
          className="absolute inset-0"
          style={{ transition: "filter 0.5s ease" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={`Work ${index + 1}`}
            style={{
              display:   "block",
              position:  "absolute",
              inset:     0,
              width:     "100%",
              height:    "100%",
              objectFit: "cover",
            }}
          />
        </div>

        {/* Dark overlay */}
        <div
          ref={overlayRef}
          className="pointer-events-none absolute inset-0 bg-black/20"
          style={{ opacity: 0, transition: "opacity 0.5s ease" }}
        />

        {/* Marquee */}
        <div
          ref={marqueeWrapRef}
          className="absolute left-0 right-0 top-1/2 -translate-y-1/2 overflow-hidden pointer-events-none"
          style={{ opacity: 0, transition: "opacity 0.3s ease" }}
        >
          <div
            className="marquee-track font-headline text-[24px] leading-[29px] font-normal tracking-[-0.01em] text-white whitespace-nowrap"
            style={{ animationDuration: "40s" }}
          >
            {strip}{strip}
          </div>
        </div>
      </div>

      {/* Pill — outside content div, always visible over bite */}
      <span
        ref={pillRef}
        className="pointer-events-none absolute top-0 left-0 flex items-center justify-center rounded-full font-headline text-[18px] leading-[22px] font-normal tracking-[-0.01em] text-white"
        style={{
          opacity:              0,
          transition:           "opacity 0.6s ease",
          paddingInline:        20,
          paddingBlock:         10,
          background:           "rgba(30,30,30,0.45)",
          backdropFilter:       "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          whiteSpace:           "nowrap",
          willChange:           "transform",
          zIndex:               1,
        }}
      >
        Open Project
      </span>
    </a>
  );
}

/* ── SeeAllWorks ─────────────────────────────────────────────────────────── */
const PILL_H = 48;
const CIRCLE = 36;

function SeeAllWorks({ onMouseEnter }: { onMouseEnter?: () => void }) {
  const [hov, setHov] = useState(false);
  return (
    <a
      href="/works"
      data-cursor="hidden"
      onMouseEnter={() => { setHov(true); onMouseEnter?.(); }}
      onMouseLeave={() => setHov(false)}
      style={{
        position:   "absolute",
        left:       "50%",
        transform:  "translateX(-50%)",
        top:        ROW1_Y + ROW1_H + ROW_GAP / 2 - PILL_H / 2,
        display:    "inline-flex",
        alignItems: "center",
        gap:        12,
        height:     PILL_H,
        paddingLeft:  28,
        paddingRight: 8,
        overflow:   "hidden",
        zIndex:     10,
        textDecoration: "none",
      }}
    >
      <span style={{
        position:     "absolute",
        top:          hov ? (PILL_H - CIRCLE) / 2 : 0,
        right:        hov ? 8 : 0,
        height:       hov ? CIRCLE : PILL_H,
        width:        hov ? CIRCLE : "100%",
        borderRadius: 999,
        background:   "#ffffff",
        transition:   `width ${DUR} ${EASE}, height ${DUR} ${EASE}, top ${DUR} ${EASE}, right ${DUR} ${EASE}`,
        zIndex:       0,
      }} />
      <span
        className="font-headline text-[20px] leading-[24px] font-medium tracking-[-0.01em] text-[#1D1D1F]"
        style={{ whiteSpace: "nowrap", position: "relative", zIndex: 1 }}
      >
        See all works
      </span>
      <span style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        position: "relative", zIndex: 1, flexShrink: 0,
        width: CIRCLE, height: CIRCLE,
      }}>
        <ArrowSVG color="#1D1D1F" size={18} />
      </span>
    </a>
  );
}

/* ── Export ──────────────────────────────────────────────────────────────── */
export default function SelectedWork() {
  return (
    <>
      {works.map((w, i) => (
        <div
          key={i}
          className="absolute"
          style={{ left: w.x, top: w.y, width: w.w, height: w.h }}
        >
          <WorkCard src={w.src} marquee={w.marquee} index={i} height={w.h} width={w.w} />
        </div>
      ))}
      <SeeAllWorks onMouseEnter={() => {}} />
    </>
  );
}
