"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { processSteps } from "@/data/content";

export default function OurProcess() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const onScroll = () => {
      const idx = Math.round(el.scrollTop / 640);
      setActive(idx);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <h2
        className="absolute font-display text-[40px] leading-[48px] font-bold tracking-[-0.03em] text-[#1f1f1f]"
        style={{ left: 60, top: 3735 }}
      >
        Our Process
      </h2>

      {/* Left intro — Figma: Apple SD Gothic Neo Medium 16px #444444 */}
      <p
        className="absolute font-display text-[16px] leading-[20px] font-medium tracking-[-0.005em] text-[#444444]"
        style={{ left: 60, top: 3809, width: 460 }}
      >
        상담부터 최종 전달까지 명확한 단계에 따라 진행됩니다.
        <br />
        자료가 아직 정리되지 않았더라도 상담을 통해 방향을 정리할 수 있습니다.
      </p>

      <div
        ref={trackRef}
        className="absolute overflow-y-auto snap-y snap-mandatory no-scrollbar"
        style={{ left: 60, top: 3894, width: 1800, height: 600, scrollbarWidth: "none" }}
      >
        <style>{`.no-scrollbar::-webkit-scrollbar { display: none; }`}</style>
        {processSteps.map((step, idx) => (
          <div
            key={step.num}
            className="relative snap-start"
            style={{
              width: 1800,
              height: 600,
              marginBottom: idx === processSteps.length - 1 ? 0 : 40,
            }}
          >
            <div
              className="absolute bg-[#EEEEEE]"
              style={{ left: 0, top: 0, width: 1800, height: 600 }}
            />
            <div
              className="absolute overflow-hidden"
              style={{ left: 14, top: 14, width: 720, height: 572 }}
            >
              <Image
                src={step.image}
                alt={step.title}
                width={720}
                height={572}
                className="object-cover w-full h-full"
              />
            </div>

            {/* Number chip — Figma: pill with #999 text on dark background */}
            <div
              className="absolute flex items-center justify-center bg-[#1f1f1f] text-[#999999] font-display text-[16px] leading-[19px] font-normal tracking-[-0.01em] rounded-full"
              style={{ left: 794, top: 60, height: 28, paddingInline: 12 }}
            >
              {step.num}
            </div>

            <h3
              className="absolute font-display text-[40px] leading-[48px] font-bold tracking-[-0.03em] text-[#1f1f1f]"
              style={{ left: 794, top: 111 }}
            >
              {step.title}
            </h3>

            <p
              className="absolute font-display text-[18px] leading-[22px] font-medium tracking-[-0.005em] text-[#757575]"
              style={{ left: 794, top: 176, width: 700 }}
            >
              {step.desc[0]}
              <br />
              {step.desc[1]}
            </p>

            <div className="absolute flex gap-[8px]" style={{ left: 794, top: 255 }}>
              {step.tags.map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center h-[40px] px-[16px] rounded-full border border-[#1f1f1f] bg-white font-display text-[20px] leading-[24px] tracking-[-0.005em] text-[#1f1f1f]"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div
        className="absolute flex flex-col gap-[8px]"
        style={{ left: 1810, top: 4144 }}
      >
        {processSteps.map((_, i) => (
          <span
            key={i}
            className="block rounded-full transition-all"
            style={{
              width: 8,
              height: 8,
              background: i === active ? "#1F1F1F" : "#EEEEEE",
            }}
          />
        ))}
      </div>
    </>
  );
}
