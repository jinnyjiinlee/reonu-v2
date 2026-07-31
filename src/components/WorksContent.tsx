"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react"; // useLayoutEffect used in WorkCard pill animation
import { useLang } from "@/context/LanguageContext";
import { useFilterCtx } from "@/context/FilterContext";
import {
  CATEGORY_LABELS, IMAGES, WORKS_DATA,
  type WorkItem,
} from "@/data/works";

const PAD      = 60;
const COL_GAP  = 24;                              // matches SelectedWork on main page
const COL_W    = (1920 - PAD * 2 - COL_GAP) / 2; // (1920-120-24)/2 = 888
const COL_H    = 800;                             // matches SelectedWork ROW1_H on main page
const LABEL_H  = 0;   // labels removed — image-only grid
const ROW_GAP  = 24;                              // matches SelectedWork on main page
const ROW_STRIDE = COL_H + LABEL_H + ROW_GAP;    // 800+132+24 = 956

// GRID_START_Y is computed dynamically in WorksContent based on viewport width.
// At 1920px it equals 720; at smaller viewports it's higher (in canvas px) so the
// first card aligns exactly with the bottom of the hero section in real px.


/* ── List view — compact scannable rows with a cursor-following hover
    preview thumbnail (image swapped per row, smoothed via RAF). ── */
const LIST_ROW_H   = 88;
const LIST_THUMB_W = 280;
const LIST_THUMB_H = 180;

function ListView({ data }: { data: WorkItem[] }) {
  const { lang } = useLang();
  const containerRef = useRef<HTMLDivElement>(null);
  const thumbRef      = useRef<HTMLDivElement>(null);
  const imgRef        = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const thumb = thumbRef.current;
    if (!container || !thumb) return;

    let tx = 0, ty = 0, rx = 0, ry = 0, raf = 0;

    const toLocal = (cx: number, cy: number) => {
      const r = container.getBoundingClientRect();
      const scale = r.width / 1800; // container's intrinsic design width
      return { lx: (cx - r.left) / scale, ly: (cy - r.top) / scale };
    };

    const tick = () => {
      rx += (tx - rx) * 0.2;
      ry += (ty - ry) * 0.2;
      thumb.style.transform = `translate(${rx}px, ${ry}px)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const onMove = (e: MouseEvent) => {
      const { lx, ly } = toLocal(e.clientX, e.clientY);
      tx = lx + 32;
      ty = ly - LIST_THUMB_H / 2;
    };
    container.addEventListener("mousemove", onMove);
    return () => {
      cancelAnimationFrame(raf);
      container.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <div ref={containerRef} style={{ position: "relative", width: 1800 }}>
      {data.map((item, i) => (
        <a
          key={item.id}
          href={`/works/${item.id}`}
          data-cursor="hidden"
          className="font-headline cursor-none"
          onMouseEnter={() => {
            if (imgRef.current) imgRef.current.src = item.image;
            if (thumbRef.current) thumbRef.current.style.opacity = "1";
          }}
          onMouseLeave={() => {
            if (thumbRef.current) thumbRef.current.style.opacity = "0";
          }}
          style={{
            display: "flex", alignItems: "center",
            height: LIST_ROW_H,
            borderBottom: "1px solid #F5F5F7",
            textDecoration: "none",
          }}
        >
          <span
            style={{
              flex: 1, fontSize: 24, lineHeight: "29px", fontWeight: 700,
              letterSpacing: "-0.025em", color: "#1D1D1F",
              whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
              paddingRight: 24,
            }}
          >
            {item.title[lang]}
          </span>
          <span style={{ width: 100, textAlign: "right", fontSize: 16, fontWeight: 700, letterSpacing: "0.06em", color: "#6E6E73" }}>
            {CATEGORY_LABELS[item.category]}
          </span>
        </a>
      ))}

      {/* Floating hover-preview thumbnail */}
      <div
        ref={thumbRef}
        className="pointer-events-none"
        style={{
          position: "absolute", top: 0, left: 0,
          width: LIST_THUMB_W, height: LIST_THUMB_H,
          opacity: 0, transition: "opacity 0.25s ease",
          overflow: "hidden", background: "#F5F5F7",
          zIndex: 2, willChange: "transform",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img ref={imgRef} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
      </div>
    </div>
  );
}

/* ── WorkCard ─────────────────────────────────────────────────────────────── */
function WorkCard({ item, index }: { item: WorkItem; index: number }) {
  const cardRef        = useRef<HTMLAnchorElement>(null);
  const pillRef        = useRef<HTMLSpanElement>(null);
  const imgWrapRef     = useRef<HTMLDivElement>(null);
  const overlayRef     = useRef<HTMLDivElement>(null);
  const revealRef      = useRef<HTMLDivElement>(null);
  const catRef         = useRef<HTMLSpanElement>(null);          // category — fade only
  const titleCharRefs  = useRef<(HTMLSpanElement | null)[]>([]); // title — per-char clip

  // Scroll reveal — bidirectional: plays on every entry (down scroll + up scroll re-entry)
  useEffect(() => {
    const el = revealRef.current;
    if (!el) return;

    const cardDelay  = (index % 2 === 1) ? 120 : 0;
    const catDelay   = cardDelay + 200;
    const titleDelay = cardDelay + 320;

    const CARD_TR = `opacity 0.85s cubic-bezier(0.4,0,0.2,1) ${cardDelay}ms, transform 0.85s cubic-bezier(0.4,0,0.2,1) ${cardDelay}ms`;
    const CAT_TR  = `opacity 0.7s cubic-bezier(0.4,0,0.2,1) ${catDelay}ms`;

    const applyTransitions = () => {
      el.style.transition = CARD_TR;
      const c = catRef.current;
      if (c) c.style.transition = CAT_TR;
      titleCharRefs.current.forEach((ch, i) => {
        if (!ch) return;
        ch.style.transition = `transform 0.55s cubic-bezier(0.4,0,0.2,1) ${titleDelay + i * 22}ms`;
      });
    };

    const resetHidden = () => {
      // Instant reset — no animation
      el.style.transition = "none";
      el.style.opacity    = "0";
      el.style.transform  = "translateY(40px)";
      const c = catRef.current;
      if (c) { c.style.transition = "none"; c.style.opacity = "0"; }
      titleCharRefs.current.forEach(ch => {
        if (!ch) return;
        ch.style.transition = "none";
        ch.style.transform  = "translateY(110%)";
      });
    };

    const reveal = () => {
      el.style.opacity   = "1";
      el.style.transform = "translateY(0)";
      const c = catRef.current;
      if (c) c.style.opacity = "1";
      titleCharRefs.current.forEach(ch => { if (ch) ch.style.transform = "translateY(0)"; });
    };

    // 1. Set hidden state before first paint
    resetHidden();

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          reveal();
        } else {
          // Card exited viewport — reset instantly, re-apply transitions for next entry
          resetHidden();
          requestAnimationFrame(() => applyTransitions());
        }
      },
      { threshold: 0.08 }
    );

    // 2. Apply transitions after first paint, then start observing
    requestAnimationFrame(() => {
      applyTransitions();
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, [index]);

  useLayoutEffect(() => {
    const card = cardRef.current;
    const pill = pillRef.current;
    if (!card || !pill) return;

    let ptx = COL_W / 2, pty = COL_H / 2;
    let prx = ptx,        pry = pty;
    let raf = 0;
    let hovering = false;

    const toLayout = (cx: number, cy: number) => {
      const r = card.getBoundingClientRect();
      return {
        lx: (cx - r.left) * (COL_W / r.width),
        ly: (cy - r.top)  * (COL_H / r.height),
      };
    };

    const tick = () => {
      prx += (ptx - prx) * 0.22; pry += (pty - pry) * 0.22;
      const settled = Math.abs(ptx - prx) < 0.1 && Math.abs(pty - pry) < 0.1;
      if (settled) { prx = ptx; pry = pty; }
      pill.style.transform = `translate(${prx}px, ${pry}px)`;
      if (settled && !hovering) { raf = 0; return; }
      raf = requestAnimationFrame(tick);
    };
    const startTick = () => { if (!raf) raf = requestAnimationFrame(tick); };

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
      if (imgWrapRef.current)    imgWrapRef.current.style.filter    = "brightness(0.82)";
      if (overlayRef.current)    overlayRef.current.style.opacity    = "1";
      startTick();
    };
    const onLeave = () => {
      hovering = false;
      pill.style.opacity = "0";
      if (imgWrapRef.current)    imgWrapRef.current.style.filter    = "";
      if (overlayRef.current)    overlayRef.current.style.opacity    = "0";
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

  const { lang } = useLang();
  const title = item.title[lang];


  return (
    <div ref={revealRef} style={{ width: COL_W }}>
    <a
      ref={cardRef}
      href={`/works/${item.id}`}
      data-cursor="hidden"
      className="block cursor-none"
      style={{ width: COL_W, height: COL_H, position: "relative", display: "block", textDecoration: "none" }}
    >
      <div style={{ position: "absolute", inset: 0, background: "#F5F5F7", overflow: "hidden" }}>
        <div ref={imgWrapRef} style={{ position: "absolute", inset: 0, transition: "filter 0.5s ease" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.image} alt={title}
            style={{
              display: "block", position: "absolute",
              inset: 0, width: "100%", height: "100%",
              objectFit: "cover",
            }}
          />
        </div>
        <div ref={overlayRef} className="pointer-events-none absolute inset-0 bg-black/20"
             style={{ opacity: 0, transition: "opacity 0.5s ease" }} />
        {/* Bottom label overlay — always visible, Mobius reference style */}
        <div
          className="pointer-events-none absolute left-0 right-0 bottom-0"
          style={{
            padding: "160px 40px 40px",
            background: "linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.35) 45%, transparent 100%)",
          }}
        >
          {/* Category — fade in */}
          <span
            ref={catRef}
            className="font-headline font-bold block"
            style={{ fontSize: 16, lineHeight: "160%", letterSpacing: "0.06em", color: "rgba(255,255,255,0.55)", marginBottom: 10 }}
          >
            {CATEGORY_LABELS[item.category]}
          </span>
          {/* Title — per-character clip reveal (each char slides up through overflow:hidden mask) */}
          <div style={{ maxHeight: 88, overflow: "hidden" }}>
            <span
              className="font-headline font-bold tracking-[-0.025em] text-white"
              style={{ fontSize: 34, lineHeight: "44px" }}
            >
              {Array.from(title).map((char, i) => (
                <span key={i} style={{ display: "inline-block", overflow: "hidden", verticalAlign: "bottom" }}>
                  <span
                    ref={el => { titleCharRefs.current[i] = el; }}
                    style={{ display: "inline-block" }}
                  >
                    {char === " " ? " " : char}
                  </span>
                </span>
              ))}
            </span>
          </div>
        </div>
      </div>
      <span
        ref={pillRef}
        className="pointer-events-none absolute top-0 left-0 flex items-center justify-center rounded-full font-headline text-[18px] leading-[22px] font-normal tracking-[-0.01em] text-white"
        style={{
          opacity: 0, transition: "opacity 0.6s ease",
          paddingInline: 20, paddingBlock: 10,
          background: "rgba(30,30,30,0.45)",
          backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)",
          whiteSpace: "nowrap", willChange: "transform", zIndex: 1,
        }}
      >
        See work
      </span>
    </a>
    </div>
  );
}

const LIST_BOTTOM_PAD = 160;
/* ── Main ─────────────────────────────────────────────────────────────────── */
export default function WorksContent() {
  const { filter, view } = useFilterCtx();
  const { lang } = useLang();

  const filteredData = filter === "All" ? WORKS_DATA : WORKS_DATA.filter((w) => w.category === filter);

  // Dynamic GRID_START_Y — converts HERO_H (real px) to canvas px so the first
  // image card starts exactly where the hero section ends at every viewport width.
  // Formula mirrors WorksHeroIntro.tsx: HERO_H = "min(calc(14.0625vw + 450px), 720px)"
  const [gridStartY, setGridStartY] = useState(720);
  useEffect(() => {
    const update = () => {
      const vw    = window.innerWidth;
      const scale = Math.min(vw / 1920, 1);
      const heroH = Math.min(0.140625 * vw + 450, 720); // real px
      setGridStartY(Math.ceil(heroH / scale));           // canvas px
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const rootRef = useRef<HTMLDivElement>(null);

  // Dynamically resize the ScaleStage canvas when switching between grid and list view,
  // or when gridStartY changes due to viewport resize.
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const scale = Math.min(window.innerWidth / 1920, 1);
    const listH = gridStartY + filteredData.length * LIST_ROW_H + LIST_BOTTOM_PAD;
    const rows  = Math.ceil(filteredData.length / 2);
    const gridH = gridStartY + rows * ROW_STRIDE + 160;
    const newH  = view === "list" ? listH : gridH;

    const main        = el.closest("main") as HTMLElement | null;
    const innerDiv    = main?.parentElement as HTMLElement | null;   // ScaleStage inner div
    const outerWrap   = innerDiv?.parentElement as HTMLElement | null; // ScaleStage outer wrapper

    if (main)      main.style.height      = `${newH}px`;
    if (innerDiv)  innerDiv.style.height  = `${newH}px`;
    if (outerWrap) outerWrap.style.height = `${newH * scale}px`;
  }, [view, filteredData.length, gridStartY]);

  return (
    <>
      <div ref={rootRef} style={{ position: "absolute", inset: 0, pointerEvents: "none" }} />
      {/* ── Category filter chips + view toggle are rendered by WorksChips (outside canvas) ── */}

      {/* ── Project grid / list ── */}
      {view === "grid" ? (
        <div
          className="absolute"
          style={{
            left: PAD,
            top: gridStartY,
            display: "flex",
            flexWrap: "wrap",
            columnGap: COL_GAP,
            rowGap: ROW_GAP,
            width: 1920 - PAD * 2,
            alignContent: "flex-start",
          }}
        >
          {filteredData.map((item, i) => (
            <WorkCard key={item.id} item={item} index={i} />
          ))}
        </div>
      ) : (
        <div className="absolute" style={{ left: PAD, top: gridStartY, width: 1800 }}>
          <ListView data={filteredData} />
        </div>
      )}
    </>
  );
}

