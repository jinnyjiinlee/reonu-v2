"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useLayoutEffect } from "react";
import { processSteps } from "@/data/content";
import { useLang } from "@/context/LanguageContext";

const BTN_EASE = "cubic-bezier(0.4, 0, 0.2, 1)";
const BTN_DUR  = "0.5s";
const GAP      = 20;
const ARR      = 36;
const SLOT     = ARR + GAP;

const ArrowSVG = () => (
  <svg width="36" height="22" viewBox="0 0 36 22" fill="none" aria-hidden="true"
       style={{ display: "block", flexShrink: 0 }}>
    <line x1="8"  y1="11" x2="28" y2="11" stroke="#1D1D1F" strokeWidth="2.4" strokeLinecap="round" />
    <line x1="19" y1="3"  x2="28" y2="11" stroke="#1D1D1F" strokeWidth="2.4" strokeLinecap="round" />
    <line x1="19" y1="19" x2="28" y2="11" stroke="#1D1D1F" strokeWidth="2.4" strokeLinecap="round" />
  </svg>
);

function LetsWorkTogetherBtn() {
  const [hov, setHov] = useState(false);
  const textRef = useRef<HTMLSpanElement>(null);
  const [clipW, setClipW] = useState<number | null>(null);

  useLayoutEffect(() => {
    const measure = () => {
      if (textRef.current)
        setClipW(Math.ceil(textRef.current.getBoundingClientRect().width) + SLOT + 2);
    };
    measure();
    document.fonts.ready.then(measure);
  }, []);

  return (
    <div data-cursor="hidden" style={{ width: clipW ?? "max-content", overflow: "hidden" }}>
      <a
        href="#contact"
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        className="font-headline text-[28px] leading-[34px] font-medium tracking-[-0.01em] text-[#1D1D1F] no-underline"
        style={{
          display: "inline-flex", alignItems: "center", gap: GAP, paddingBottom: 12,
          transform: hov ? "translateX(0)" : `translateX(-${SLOT}px)`,
          transition: `transform ${BTN_DUR} ${BTN_EASE}`,
        }}
      >
        <span style={{ display: "inline-flex", alignItems: "center", width: ARR }}><ArrowSVG /></span>
        <span ref={textRef} style={{ whiteSpace: "nowrap" }}>Let&apos;s work together</span>
        <span style={{ display: "inline-flex", alignItems: "center", width: ARR }}><ArrowSVG /></span>
      </a>
      <span style={{
        display: "block", height: 1.5, background: "#1D1D1F", marginLeft: 4,
        transform: hov ? "scaleX(1)" : "scaleX(0)",
        transformOrigin: "left center",
        transition: `transform ${BTN_DUR} ${BTN_EASE}`,
      }} />
    </div>
  );
}

const DESIGN_W         = 1920;
const N                = processSteps.length; // 4
const SECTION_Y        = 4880; // canvas Y all cards are anchored to
const SCROLL_PER_CARD  = 600;  // extra scroll after last card stacks
const CARD_W           = 1800;
const CARD_H           = 448;
const CARD_GAP         = 20;   // gap between cards in natural spread

const HEADING_CANVAS_Y = 4690; // canvas Y of "Our Process" heading
const STICKY_TOP       = 166;  // viewport px where heading sticks

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

/* ── Character-by-character slide-up reveal ── */
function SplitTextReveal({ text, className, style }: {
  text: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const wrapRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const chars = wrap.querySelectorAll<HTMLElement>("[data-c]");
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        chars.forEach(el => { el.style.transform = "translateY(0)"; });
        observer.disconnect();
      }
    }, { threshold: 0.05 });
    observer.observe(wrap);
    return () => observer.disconnect();
  }, []);

  return (
    <h2 ref={wrapRef} className={className} style={{ ...style, overflow: "hidden" }}>
      {text.split("").map((ch, i) => (
        <span
          key={i}
          data-c=""
          style={{
            display: "inline-block",
            transform: "translateY(115%)",
            transition: `transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${i * 35}ms`,
          }}
        >
          {ch === " " ? " " : ch}
        </span>
      ))}
    </h2>
  );
}

export default function OurProcess() {
  const { lang } = useLang();
  const cardsRef   = useRef<(HTMLDivElement | null)[]>([]);
  const headingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const update = () => {
      const scale  = Math.min(window.innerWidth / DESIGN_W, 1);
      const scrollY = window.scrollY;
      const vh     = window.innerHeight;

      // Card sticks at this viewport Y (maintains natural gap from heading)
      const cardTopY = STICKY_TOP + (SECTION_Y - HEADING_CANVAS_Y) * scale;

      const stickStart       = HEADING_CANVAS_Y * scale - STICKY_TOP;
      // Section ends after last card stacks + SCROLL_PER_CARD linger
      const sectionScrollEnd = stickStart + (N - 1) * (CARD_H + CARD_GAP) * scale + SCROLL_PER_CARD * scale;

      // ── Sticky heading ──
      const headingEl = headingRef.current;
      if (headingEl) {
        if (scrollY < stickStart) {
          headingEl.style.transform = "";
        } else if (scrollY <= sectionScrollEnd) {
          const naturalVY = HEADING_CANVAS_Y * scale - scrollY;
          headingEl.style.transform = `translateY(${(STICKY_TOP - naturalVY) / scale}px)`;
        } else {
          const frozenNaturalVY = HEADING_CANVAS_Y * scale - sectionScrollEnd;
          headingEl.style.transform = `translateY(${(STICKY_TOP - frozenNaturalVY) / scale}px)`;
        }
      }

      // ── Stacking cards — spread list → each stacks on scroll ──
      for (let i = 0; i < N; i++) {
        const el = cardsRef.current[i];
        if (!el) continue;

        el.style.visibility = "visible";

        // After section ends: all frozen at same cardTopY (last card on top)
        if (scrollY >= sectionScrollEnd) {
          const natVY = SECTION_Y * scale - sectionScrollEnd;
          el.style.transform = `translateY(${(cardTopY - natVY) / scale}px)`;
          continue;
        }

        // scrollY at which card i reaches cardTopY and sticks
        const cardStickScroll = stickStart + i * (CARD_H + CARD_GAP) * scale;

        if (scrollY < cardStickScroll) {
          // Card i still scrolling naturally at its spread offset
          el.style.transform = `translateY(${i * (CARD_H + CARD_GAP)}px)`;
        } else {
          // Card i has reached cardTopY — stick it there
          const naturalVY = SECTION_Y * scale - scrollY;
          el.style.transform = `translateY(${(cardTopY - naturalVY) / scale}px)`;
        }
      }
    };

    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <>
      {/* Section heading + desc — sticky wrapper */}
      <div
        ref={headingRef}
        className="absolute"
        style={{ left: 60, top: HEADING_CANVAS_Y, zIndex: 10, width: 460, height: 124 }}
      >
        <SplitTextReveal
          text="Our Process"
          className="absolute m-0 font-headline text-[28px] leading-[34px] font-bold tracking-[-0.03em] text-[#1d1d1f]"
          style={{ top: 0, left: 0 }}
        />
        <p
          className="absolute font-headline text-[16px] leading-[26px] font-normal tracking-[-0.005em] text-[#333336]"
          style={{ top: 58, left: 0, width: 460 }}
        >
          {lang === "ko"
            ? <>상담부터 최종 전달까지 명확한 단계에 따라 진행됩니다.<br />자료가 아직 정리되지 않았더라도 상담을 통해 방향을 정리할 수 있습니다.</>
            : <>Every project follows clear steps from brief to final delivery.<br />Even if your materials aren't ready yet, a consultation can help set the direction.</>
          }
        </p>
      </div>

      {/* Stacking cards */}
      {processSteps.map((step, i) => (
        <div
          key={step.num}
          ref={el => { cardsRef.current[i] = el; }}
          className="absolute"
          style={{
            left:         60,
            top:          SECTION_Y,
            width:        CARD_W,
            height:       CARD_H,
            borderRadius: 0,
            overflow:     "hidden",
            zIndex:       i + 1,
            visibility:   "visible",
            background:   "#ffffff",
          }}
        >
          {/* Photo */}
          <div
            className="absolute overflow-hidden"
            style={{ left: 14, top: 9, width: 605, height: 430, borderRadius: 12 }}
          >
            <Image
              src={step.image}
              alt={step.title}
              width={605}
              height={430}
              className="object-cover w-full h-full"
              style={{ borderRadius: 6 }}
            />
          </div>

          {/* Step number */}
          <div
            className="absolute text-[#6E6E73] font-headline text-[14px] leading-[17px] font-medium tracking-[0.08em]"
            style={{ left: 820, top: 104 }}
          >
            {step.num}
          </div>

          {/* Title */}
          <h3
            className="absolute font-headline text-[36px] leading-[44px] font-bold tracking-[-0.03em] text-[#1d1d1f]"
            style={{ left: 820, top: 133 }}
          >
            {step.title}
          </h3>

          {/* Description */}
          <p
            className="absolute font-headline text-[16px] leading-[26px] font-normal tracking-[-0.005em] text-[#333336]"
            style={{ left: 820, top: 193, width: 680 }}
          >
            {step.desc[lang][0]}
            <br />
            {step.desc[lang][1]}
          </p>

          {/* Tags */}
          <div className="absolute flex gap-[8px]" style={{ left: 820, top: 309 }}>
            {step.tags.map(tag => (
              <span
                key={tag}
                className="inline-flex items-center h-[40px] px-[20px] rounded-full border border-[#6E6E73] bg-transparent font-headline text-[16px] leading-[20px] font-medium tracking-[-0.005em] text-[#1D1D1F]"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}
