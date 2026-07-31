"use client";

import Link from "next/link";
import { useEffect, useRef, useLayoutEffect, useState } from "react";
import { processSteps } from "@/data/content";
import { useLang } from "@/context/LanguageContext";
import { StartProjectBtn } from "@/components/Pricing";

const DESIGN_W        = 1920;
const N               = processSteps.length; // 4
const SCROLL_PER_CARD = 600;
const TAIL            = 600; // extra scroll so card 04 has full dwell time before release
const IMAGE_H         = 507;
const TEXT_LEFT       = 60;
const TEXT_W          = 760;
const IMG_LEFT        = 880;
const IMG_W           = 980;  // 1920 - 880 - 60

// Dynamic — set by ourservice-end event; fallback ≈ OurService SECTION_END_Y
const OURPROCESS_INIT_TOP = 4164;
const STICKY_TOP          = 166;

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

  // Dynamic position — driven by ourservice-end event
  const [wrapperTop, setWrapperTop] = useState(OURPROCESS_INIT_TOP);
  // headingCanvasYRef = canvas Y of leftColRef/outerCardsRef (= wrapperTop + HEADING_ROW_H + 200)
  // HEADING_ROW_H(464) = 264px text + 200px bottom padding; headingRef scrolls away before sticking
  const headingCanvasYRef = useRef(OURPROCESS_INIT_TOP + 200);

  useEffect(() => {
    const handler = (e: Event) => {
      const y = (e as CustomEvent<{ y: number }>).detail?.y;
      if (y && y > 3000) {
        const top = Math.round(y);
        setWrapperTop(top);
        headingCanvasYRef.current = top + 200; // headingRef canvas Y
        // Broadcast where OurProcess ends so Partners can follow
        const processEnd = top + 608 + N * SCROLL_PER_CARD + TAIL;
        window.dispatchEvent(new CustomEvent("ourprocess-end", { detail: { y: processEnd } }));
      }
    };
    window.addEventListener("ourservice-end", handler);
    return () => window.removeEventListener("ourservice-end", handler);
  }, []);

  // Left column
  const leftColRef    = useRef<HTMLDivElement>(null);
  const headingRef    = useRef<HTMLDivElement>(null);
  const textCardsRef  = useRef<(HTMLDivElement | null)[]>([]);
  const [ourWorkHov, setOurWorkHov] = useState(false);

  // Right column (images)
  const outerCardsRef      = useRef<HTMLDivElement>(null);
  const cardsRef           = useRef<(HTMLDivElement | null)[]>([]);
  const btnAreaRef         = useRef<HTMLDivElement>(null);
  const imageContainerRef  = useRef<HTMLDivElement>(null);

  // Pricing-style sticky height: viewport height in canvas px
  const [stickyHeight, setStickyHeight] = useState(1000);
  // outerCardsRef starts at canvas top+608 (= headingRef bottom).
  // During sticky: viewportY = STICKY_TOP + 408*scale ≈ 487px
  // To reach viewport bottom: height = (window.innerHeight - 487) / scale = stickyHeight - 408
  const imageHeight = Math.max(400, stickyHeight - 408);

  useLayoutEffect(() => {
    const compute = () => {
      const scale = Math.min(window.innerWidth / DESIGN_W, 1);
      const sh = Math.round((window.innerHeight - STICKY_TOP) / scale);
      setStickyHeight(sh);
    };
    compute();
    requestAnimationFrame(compute);
    document.fonts.ready.then(compute);
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, []);


  useEffect(() => {
    const mainEl = document.querySelector("main") as HTMLElement | null;
    document.body.style.transition = "background-color 0.6s ease";
    if (mainEl) mainEl.style.transition = "background-color 0.6s ease";

    // Color transitions on heading elements
    const headingEl = headingRef.current;
    if (headingEl) {
      const h2 = headingEl.querySelector("h2") as HTMLElement | null;
      const p  = headingEl.querySelector("p")  as HTMLElement | null;
      if (h2) h2.style.transition = "color 0.6s ease";
      if (p)  p.style.transition  = "color 0.6s ease";
    }

    const update = () => {
      const scale   = Math.min(window.innerWidth / DESIGN_W, 1);
      const scrollY = (window as any).__virtualY ?? 0;

      document.documentElement.classList.remove("dark-process");

      // ── OurService-identical sticky pattern ──
      const stickyH         = Math.round((window.innerHeight - STICKY_TOP) / scale);
      const headingCanvasY  = headingCanvasYRef.current;
      const sectionEndCanvas = headingCanvasY + N * SCROLL_PER_CARD + TAIL;

      const stickStart = headingCanvasY * scale - STICKY_TOP;
      const stickEnd   = sectionEndCanvas * scale - stickyH * scale - STICKY_TOP;

      const applyCol = (el: HTMLDivElement | null) => {
        if (!el) return;
        if (scrollY < stickStart) {
          el.style.transform = "";
        } else if (scrollY <= stickEnd) {
          const naturalVY = headingCanvasY * scale - scrollY;
          el.style.transform = `translateY(${(STICKY_TOP - naturalVY) / scale}px)`;
        } else {
          // Release: fixed offset so element scrolls away with the page
          const ty = Math.max(0, N * SCROLL_PER_CARD + TAIL - stickyH);
          el.style.transform = `translateY(${ty}px)`;
        }
      };

      // Right column: uses its OWN stickStart — when outerCardsRef naturally scrolls
      // to STICKY_TOP. Eliminates the jump discontinuity at headingRef's stickStart.
      // Continuity proof: at rightStickStart ty=0 both before and after ✓
      //                   at stickEnd ty = 1992-stickyH both sticky and release ✓
      const applyRightCol = (el: HTMLDivElement | null) => {
        if (!el) return;
        const outerCanvasY  = headingCanvasY + 408; // wrapperTop + 608
        const rightStickStart = outerCanvasY * scale - STICKY_TOP;

        if (scrollY < rightStickStart) {
          el.style.transform = "";
        } else if (scrollY <= stickEnd) {
          const naturalVY = outerCanvasY * scale - scrollY;
          const ty = (STICKY_TOP - naturalVY) / scale;
          el.style.transform = `translateY(${ty}px)`;
        } else {
          // ty = 1992 - stickyH = 2400 - 408 - stickyH (continuous with stickEnd)
          const ty = N * SCROLL_PER_CARD + TAIL - 408 - stickyH;
          el.style.transform = `translateY(${ty}px)`;
        }
      };

      applyCol(headingRef.current);
      applyCol(leftColRef.current);
      applyRightCol(outerCardsRef.current);

      // ── Card progress ──
      const sectionScrollEnd = stickStart + (N * SCROLL_PER_CARD + TAIL) * scale;
      const cardProgress = scrollY < stickStart ? 0
        : scrollY >= sectionScrollEnd ? N - 1
        : (scrollY - stickStart) / (SCROLL_PER_CARD * scale);

      const FADE   = 0.25;
      const TRAVEL = 50;

      const applyFade = (el: HTMLDivElement | null, i: number) => {
        if (!el) return;
        const d = cardProgress - i;
        let opacity: number, ty: number;

        if (d < -FADE)                    { opacity = 0;           ty = TRAVEL; }
        else if (d < 0)                   { const t = (d + FADE) / FADE; opacity = t; ty = (1 - t) * TRAVEL; }
        else if (i === N - 1 || d < 1 - FADE) { opacity = 1;      ty = 0; }
        else if (d < 1)                   { const t = (d - (1 - FADE)) / FADE; opacity = 1 - t; ty = -t * TRAVEL; }
        else                              { opacity = 0;           ty = -TRAVEL; }

        const clampedOpacity = Math.max(0, Math.min(1, opacity));
        el.style.opacity    = String(clampedOpacity);
        el.style.transform  = `translate3d(0,${ty}px,0)`;
        el.style.visibility = clampedOpacity > 0 ? "visible" : "hidden";
      };

      // Apply fade to text cards, number cards (left) and image cards (right)
      textCardsRef.current.forEach((el, i) => applyFade(el, i));
      cardsRef.current.forEach((el, i) => applyFade(el, i));
    };

    window.addEventListener("virtual-scroll", update as EventListener);
    window.addEventListener("resize", update);
    update();
    return () => {
      document.documentElement.classList.remove("dark-process");
      window.removeEventListener("virtual-scroll", update as EventListener);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div
      className="absolute"
      style={{ left: 0, top: wrapperTop, width: 1920, paddingTop: 200, zIndex: 1 }}
    >
      {/*
       * ── HEADING ROW ────────────────────────────────────────────────────────────
       * Full 1920px canvas = 1512px viewport → matches Möbius div.framer-1l493v4
       * (1512 × 208 viewport). One block containing:
       *   LEFT  (left: 60)  — "Our Process" heading text
       *   RIGHT (left: 880) — description + CTA button
       * ─────────────────────────────────────────────────────────────────────────
       */}
      <div
        ref={headingRef}
        style={{
          position:   "absolute",
          left:       0,
          top:        200,
          width:      1920,
          height:     408, // 208px text (104×2) + 200px bottom padding
          zIndex:     10,
          willChange: "transform",
        }}
      >
        {/* LEFT — heading text */}
        <div
          style={{
            position:      "absolute",
            left:          TEXT_LEFT,
            top:           0,
            display:       "flex",
            flexDirection: "column",
            gap:           0,
          }}
        >
          <SplitTextReveal
            text="Our"
            className="m-0 font-headline font-bold tracking-[-0.05em] text-[#000000]"
            style={{ fontSize: 104, lineHeight: "100%", whiteSpace: "nowrap", fontWeight: 800, fontOpticalSizing: "none", fontVariationSettings: '"opsz" 144' }}
          />
          <SplitTextReveal
            text="Process"
            className="m-0 font-headline font-bold tracking-[-0.05em] text-[#000000]"
            style={{ fontSize: 104, lineHeight: "100%", whiteSpace: "nowrap", fontWeight: 800, fontOpticalSizing: "none", fontVariationSettings: '"opsz" 144' }}
          />
        </div>

        {/* RIGHT — description + CTA, vertically bottom-aligned within heading row */}
        <div
          ref={btnAreaRef}
          style={{
            position:       "absolute",
            left:           IMG_LEFT,
            top:            8,
            width:          IMG_W,
            height:         208,
            display:        "flex",
            flexDirection:  "column",
            justifyContent: "flex-start",
            alignItems:     "flex-end",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 32, alignItems: "flex-start" }}>
            <p
              className="font-headline font-normal tracking-[-0.005em]"
              style={{ fontSize: 18, lineHeight: "170%", maxWidth: 780, color: "#000000e6" }}
            >
              {lang === "ko"
                ? <>상담부터 최종 전달까지 명확한 단계에 따라 진행됩니다.<br />자료가 아직 정리되지 않았더라도 상담을 통해 방향을 정리할 수 있습니다.</>
                : <>Every project follows clear steps from brief to final delivery.<br />Even if your materials aren&apos;t ready yet, a consultation can help set the direction.</>
              }
            </p>
            <StartProjectBtn label="Let's work together" href="#contact" />
          </div>
        </div>
      </div>

      {/*
       * ── LEFT column: step cards + step numbers ─────────────────────────────
       * top:664 = headingRef scrolls away (top:200 + height:464) before sticking begins.
       * Step cards at top:0 — appear at STICKY_TOP immediately when stuck.
       * ─────────────────────────────────────────────────────────────────────────
       */}
      <div
        ref={leftColRef}
        style={{
          position:   "absolute",
          left:       TEXT_LEFT,
          top:        608,
          width:      TEXT_W,
          height:     imageHeight,
          zIndex:     10,
          willChange: "transform",
        }}
      >
        {processSteps.map((step, i) => (
          <div
            key={step.num}
            ref={el => { textCardsRef.current[i] = el; }}
            style={{
              position:       "absolute",
              top:            0,
              left:           0,
              width:          TEXT_W,
              height:         imageHeight,   // fill column → enables justifyContent:center
              opacity:        i === 0 ? 1 : 0,
              visibility:     i === 0 ? "visible" : "hidden",
              willChange:     "transform, opacity",
              display:        "flex",
              flexDirection:  "column",
              alignItems:     "flex-start",
              justifyContent: "flex-start",
              gap:            16,
            }}
          >
            {/* ── Möbius div.framer-1y6pksy: title + desc + tags all gap:16 ── */}
            <h3
              className="m-0 font-headline text-[71px] leading-[120%] font-bold tracking-[-0.03em]"
              style={{ color: "#000000e6" }}
            >
              {step.title}
            </h3>
            <p className="m-0 font-headline text-[20px] leading-[32px] font-normal tracking-[-0.005em]" style={{ color: "#000000b3" }}>
              {step.desc[lang][0]}<br />{step.desc[lang][1]}
            </p>
            <p
              className="m-0 font-headline text-[18px]"
              style={{ fontWeight: 500, color: "#b8b8b8", letterSpacing: "0.02em", lineHeight: "160%", marginTop: 40 }}
            >
              {step.tags.join(", ")}
            </p>
            {/* ── Our Work CTA — gap:16(flex)+marginTop:56 below tags ── */}
            <Link
              href="/works"
              data-cursor="hidden"
              onMouseEnter={() => setOurWorkHov(true)}
              onMouseLeave={() => setOurWorkHov(false)}
              style={{
                marginTop:     56,
                display:       "inline-flex",
                alignItems:    "center",
                gap:           20,
                height:        61,
                paddingLeft:   23,
                paddingRight:  20,
                overflow:      "hidden",
                position:      "relative",
                textDecoration:"none",
              }}
            >
              <span style={{
                position:   "absolute",
                top:        ourWorkHov ? 8 : 0,
                right:      ourWorkHov ? 10 : 0,
                height:     ourWorkHov ? 46 : 61,
                width:      ourWorkHov ? 46 : "100%",
                borderRadius: 999,
                background: "#1D1D1F",
                transition: "width 0.5s cubic-bezier(0.4,0,0.2,1), height 0.5s cubic-bezier(0.4,0,0.2,1), top 0.5s cubic-bezier(0.4,0,0.2,1), right 0.5s cubic-bezier(0.4,0,0.2,1)",
                zIndex:     0,
              }} />
              <span
                className="font-headline text-[25px] leading-[32px] font-medium tracking-normal"
                style={{ whiteSpace: "nowrap", position: "relative", zIndex: 2, color: ourWorkHov ? "#000000e6" : "#ffffff", transition: "color 0.5s cubic-bezier(0.4,0,0.2,1)" }}
              >
                Our Work
              </span>
              <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", position: "relative", zIndex: 2, flexShrink: 0 }}>
                <svg xmlns="http://www.w3.org/2000/svg" width={ourWorkHov ? 26 : 20} height={ourWorkHov ? 26 : 20} viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{ display: "block", flexShrink: 0, transition: "width 0.5s cubic-bezier(0.4,0,0.2,1), height 0.5s cubic-bezier(0.4,0,0.2,1)" }}>
                  <path d="M5 12h14M12 5l7 7-7 7" stroke="#ffffff" strokeWidth="2.34" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </Link>
          </div>
        ))}
      </div>

      {/*
       * ── RIGHT column: image (top:608, no spacer) ──────────────────────────
       * top:608 aligns with leftColRef. Image fills full sticky height (Möbius: 699px vp).
       * ─────────────────────────────────────────────────────────────────────────
       */}
      <div
        ref={outerCardsRef}
        style={{
          position:   "absolute",
          left:       IMG_LEFT,
          top:        608,
          width:      IMG_W,
          height:     stickyHeight,
          willChange: "transform",
        }}
      >
        <div ref={imageContainerRef} style={{ position: "relative", width: IMG_W, height: stickyHeight }}>
          {processSteps.map((step, i) => (
            <div
              key={step.num}
              ref={el => { cardsRef.current[i] = el; }}
              style={{
                position:   "absolute",
                top:        0,
                left:       0,
                width:      IMG_W,
                height:     stickyHeight,
                opacity:    i === 0 ? 1 : 0,
                visibility: "visible",
                willChange: "transform, opacity",
                display:    "flex",
                alignItems: "flex-end",   // bottom-align: number bottom = viewport bottom
                justifyContent: "flex-end",
              }}
            >
              {/* Number clipping effect: image visible only through number shapes */}
              <span
                className="font-headline"
                style={{
                  fontSize:              760,
                  lineHeight:            1,
                  letterSpacing:         "-0.05em",
                  fontWeight:            900,
                  color:                 "transparent",
                  backgroundImage:       `url(${step.image})`,
                  backgroundSize:        "cover",
                  backgroundPosition:    "center",
                  WebkitBackgroundClip:  "text",
                  backgroundClip:        "text",
                  display:               "block",
                  textAlign:             "right",
                  paddingRight:          20,  // extend bg past ink overflow on right curves
                  userSelect:            "none",
                  fontOpticalSizing:     "none",
                  fontVariationSettings: '"opsz" 144',
                } as React.CSSProperties}
              >
                {step.num}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
