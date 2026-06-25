"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useLang } from "@/context/LanguageContext";

type Category = "All" | "BX Design" | "UXUI Design" | "EDIT Design";
const CATEGORIES: Category[] = ["All", "BX Design", "UXUI Design", "EDIT Design"];

interface WorkItem {
  id: number;
  title: string;
  category: Exclude<Category, "All">;
  image: string;
}

const WORKS_DATA: WorkItem[] = [
  { id: 1,  title: "KT",           category: "UXUI Design", image: "/images/works/work-01.png" },
  { id: 2,  title: "경솔스베딩",    category: "BX Design",   image: "/images/works/work-03.png" },
  { id: 3,  title: "신한 SOL",      category: "UXUI Design", image: "/images/works/work-02.png" },
  { id: 4,  title: "KB 광고",       category: "UXUI Design", image: "/images/works/work-04.png" },
  { id: 5,  title: "Dayfocobb",     category: "BX Design",   image: "/images/works/work-01.png" },
  { id: 6,  title: "Tripick",       category: "BX Design",   image: "/images/works/work-03.png" },
  { id: 7,  title: "국제산아법회채", category: "EDIT Design", image: "/images/works/work-02.png" },
  { id: 8,  title: "콘텐츠공정성남", category: "EDIT Design", image: "/images/works/work-04.png" },
  { id: 9,  title: "교육부",        category: "EDIT Design", image: "/images/works/work-01.png" },
  { id: 10, title: "대면대학교",     category: "EDIT Design", image: "/images/works/work-03.png" },
];

/* ── Card ───────────────────────────────────────────────────────────────── */
function HCard({ item }: { item: WorkItem }) {
  const imgRef     = useRef<HTMLImageElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const pillRef    = useRef<HTMLSpanElement>(null);
  const cardRef    = useRef<HTMLAnchorElement>(null);

  useLayoutEffect(() => {
    const card = cardRef.current;
    const pill = pillRef.current;
    if (!card || !pill) return;

    let ptx = 0, pty = 0, prx = 0, pry = 0;
    let raf = 0, hovering = false;

    const tick = () => {
      prx += (ptx - prx) * 0.2; pry += (pty - pry) * 0.2;
      const settled = Math.abs(ptx - prx) < 0.1 && Math.abs(pty - pry) < 0.1;
      if (settled) { prx = ptx; pry = pty; }
      pill.style.transform = `translate(${prx}px, ${pry}px)`;
      if (settled && !hovering) { raf = 0; return; }
      raf = requestAnimationFrame(tick);
    };
    const startTick = () => { if (!raf) raf = requestAnimationFrame(tick); };

    const onMove = (e: MouseEvent) => {
      const r = card.getBoundingClientRect();
      ptx = e.clientX - r.left + 16;
      pty = e.clientY - r.top  + 16;
      startTick();
    };
    const onEnter = (e: MouseEvent) => {
      hovering = true;
      const r = card.getBoundingClientRect();
      prx = ptx = e.clientX - r.left + 16;
      pry = pty = e.clientY - r.top  + 16;
      pill.style.opacity = "1";
      if (imgRef.current)     imgRef.current.style.filter  = "brightness(0.82)";
      if (overlayRef.current) overlayRef.current.style.opacity = "1";
      startTick();
    };
    const onLeave = () => {
      hovering = false;
      pill.style.opacity = "0";
      if (imgRef.current)     imgRef.current.style.filter  = "";
      if (overlayRef.current) overlayRef.current.style.opacity = "0";
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

  return (
    <div style={{ flexShrink: 0, width: "calc(100vh - min(calc(66 / 1920 * 100vw), 66px) - 72px - 80px)", height: "100%", display: "flex", flexDirection: "column", gap: 14 }}>
      {/* Image area */}
      <a
        ref={cardRef}
        href="#"
        data-cursor="hidden"
        className="cursor-none"
        style={{ flex: 1, position: "relative", display: "block", overflow: "hidden", background: "#F5F5F7", borderRadius: 4 }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={imgRef}
          src={item.image}
          alt={item.title}
          style={{
            position: "absolute", inset: 0,
            width: "100%", height: "100%", objectFit: "cover",
            transition: "filter 0.5s ease, transform 0.6s ease",
          }}
        />
        <div
          ref={overlayRef}
          style={{
            position: "absolute", inset: 0,
            background: "rgba(0,0,0,0.18)",
            opacity: 0,
            transition: "opacity 0.4s ease",
            pointerEvents: "none",
          }}
        />
        {/* Cursor pill */}
        <span
          ref={pillRef}
          className="font-headline text-white"
          style={{
            position: "absolute", top: 0, left: 0,
            opacity: 0,
            transition: "opacity 0.5s ease",
            willChange: "transform",
            pointerEvents: "none",
            fontSize: 14, lineHeight: "17px", fontWeight: 400, letterSpacing: "-0.01em",
            whiteSpace: "nowrap",
            padding: "8px 16px",
            background: "rgba(30,30,30,0.45)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            borderRadius: 999,
            zIndex: 1,
          }}
        >
          Open Project
        </span>
      </a>

      {/* Label */}
      <div style={{ flexShrink: 0, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span
          className="font-headline font-medium tracking-[-0.02em] text-[#1D1D1F]"
          style={{ fontSize: 16, lineHeight: "20px" }}
        >
          {item.title}
        </span>
        <span
          className="font-headline font-normal tracking-[-0.01em] text-[#6E6E73]"
          style={{ fontSize: 13, lineHeight: "16px" }}
        >
          {item.category}
        </span>
      </div>
    </div>
  );
}

/* ── Main ───────────────────────────────────────────────────────────────── */
export default function WorksHorizontal() {
  const [activeFilter, setActiveFilter] = useState<Category>("All");
  const trackRef = useRef<HTMLDivElement>(null);

  // Convert vertical wheel scroll → horizontal scroll
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      track.scrollLeft += e.deltaY + e.deltaX;
    };
    track.addEventListener("wheel", onWheel, { passive: false });
    return () => track.removeEventListener("wheel", onWheel);
  }, []);

  // Lock vertical scroll
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  const filtered = WORKS_DATA.filter(
    item => activeFilter === "All" || item.category === activeFilter
  );

  const PAD = "max(3.125vw, calc(50vw - 900px))";

  return (
    <>
      {/* Hide scrollbar for webkit */}
      <style>{`.works-track::-webkit-scrollbar { display: none }`}</style>

      <div
        style={{
          position: "fixed",
          top: "min(calc(66 / 1920 * 100vw), 66px)",
          left: 0, right: 0, bottom: 0,
          display: "flex", flexDirection: "column",
          background: "#ffffff",
        }}
      >
        {/* ── Top bar: Works + filters ── */}
        <div
          style={{
            flexShrink: 0,
            height: 72,
            display: "flex", alignItems: "center",
            gap: "min(calc(56 / 1920 * 100vw), 56px)",
            padding: `0 ${PAD}`,
            borderBottom: "0.5px solid #E8E8ED",
          }}
        >
          <h1
            className="font-headline font-bold tracking-[-0.03em] text-[#1D1D1F]"
            style={{ fontSize: "min(calc(28 / 1920 * 100vw + 8px), 28px)", lineHeight: 1.2, whiteSpace: "nowrap" }}
          >
            Works
          </h1>

          <div style={{ display: "flex", gap: "min(calc(36 / 1920 * 100vw), 36px)", alignItems: "baseline" }}>
            {CATEGORIES.map((cat, i) => {
              const isActive = activeFilter === cat;
              const num = String(i + 1).padStart(2, "0");
              return (
                <button
                  key={cat}
                  data-cursor="hidden"
                  onClick={() => setActiveFilter(cat)}
                  className="inline-flex items-baseline gap-[5px] bg-transparent border-none font-headline"
                  style={{ cursor: "none", color: isActive ? "#1D1D1F" : "#6E6E73", transition: "color 0.25s ease" }}
                >
                  <span style={{
                    fontSize: 11, fontWeight: 500, letterSpacing: "0.02em",
                    color: isActive ? "#1D1D1F" : "#ADADB0",
                    transition: "color 0.25s ease",
                  }}>
                    {num}
                  </span>
                  <span style={{
                    fontSize: 15, lineHeight: "20px",
                    fontWeight: isActive ? 500 : 400,
                    letterSpacing: "-0.005em",
                  }}>
                    {cat}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Project count */}
          <span
            className="font-headline text-[#ADADB0]"
            style={{ marginLeft: "auto", fontSize: 13, letterSpacing: "-0.01em" }}
          >
            {filtered.length} projects
          </span>
        </div>

        {/* ── Horizontal card track ── */}
        <div
          ref={trackRef}
          className="works-track"
          style={{
            flex: 1,
            minHeight: 0,
            display: "flex",
            overflowX: "scroll",
            overflowY: "hidden",
            gap: 12,
            padding: `28px ${PAD} 52px`,
            scrollbarWidth: "none",
          }}
        >
          {filtered.map(item => (
            <HCard key={item.id} item={item} />
          ))}
          {/* Right padding spacer */}
          <div style={{ width: 1, flexShrink: 0 }} />
        </div>
      </div>
    </>
  );
}

export { WORKS_DATA };
