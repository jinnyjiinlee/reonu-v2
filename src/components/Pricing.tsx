"use client";

import { useState } from "react";
import { services } from "@/data/content";

const TABS = [
  { key: "bx", label: "BX", data: services.bx },
  { key: "uxui", label: "UXUI", data: services.uxui },
  { key: "edit", label: "EDIT", data: services.edit },
] as const;

function CheckIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="#1F1F1F" strokeWidth="1.2" fill="none" />
      <path
        d="M8 12.3 11 15.2 16.5 8.8"
        stroke="#1F1F1F"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Pricing() {
  const [active, setActive] = useState<(typeof TABS)[number]["key"]>("bx");
  const data = TABS.find((t) => t.key === active)!.data;

  return (
    <>
      <h2
        className="absolute font-display text-[40px] leading-[48px] font-bold tracking-[-0.03em] text-[#1F1F1F]"
        style={{ left: 60, top: 4653 }}
      >
        Pricing
      </h2>

      {/* Left intro — Figma: Apple SD Gothic Neo Medium 16px #444444 */}
      <p
        className="absolute font-display text-[16px] leading-[20px] font-medium tracking-[-0.005em] text-[#444444]"
        style={{ left: 60, top: 4727, width: 400 }}
      >
        브랜드 구축부터 디지털 경험, 홍보물까지 프로젝트의 성격과
        <br />
        필요한 범위에 따라 대표 작업의 시작가를 안내드립니다.
      </p>

      <a
        href="#contact"
        className="absolute font-display text-[28px] leading-[34px] font-normal tracking-[-0.01em] text-[#1F1F1F] underline underline-offset-4 hover:opacity-60"
        style={{ left: 60, top: 5197 }}
      >
        →&nbsp;&nbsp;Start Project
      </a>

      {/* Tabs — BX/UXUI/EDIT all caps, active #1F1F1F, inactive #999999 */}
      <div
        className="absolute flex items-end gap-[40px]"
        style={{ left: 963, top: 4654, width: 900 }}
      >
        {TABS.map((t) => {
          const isActive = active === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setActive(t.key)}
              className={`relative font-display text-[24px] leading-[29px] font-normal tracking-[-0.01em] pb-[12px] transition-colors ${
                isActive ? "text-[#1F1F1F]" : "text-[#999999]"
              }`}
            >
              {t.label}
              <span
                className="absolute left-0 bottom-0 h-[2px] bg-[#1F1F1F] transition-all"
                style={{ width: isActive ? "100%" : 0 }}
              />
            </button>
          );
        })}
      </div>

      <div
        className="absolute bg-[#EEEEEE]"
        style={{ left: 960, top: 4704, width: 900, height: 1 }}
      />

      <h3
        className="absolute font-display text-[40px] leading-[48px] font-bold tracking-[-0.03em] text-[#1F1F1F]"
        style={{ left: 960, top: 4763 }}
      >
        {data.title}
      </h3>

      <p
        className="absolute font-display text-[18px] leading-[22px] font-medium tracking-[-0.005em] text-[#757575]"
        style={{ left: 960, top: 4828, width: 400 }}
      >
        {data.desc[0]}
        <br />
        {data.desc[1]}
      </p>

      {data.chips.map((chip, i) => {
        const col = i < 3 ? 0 : 1;
        const row = i % 3;
        const left = col === 0 ? 960 : 1316;
        const top = 4915 + row * 56;
        return (
          <div
            key={chip}
            className="absolute flex items-center gap-[8px]"
            style={{ left, top }}
          >
            <CheckIcon />
            <span className="font-display text-[20px] leading-[24px] font-normal tracking-[-0.005em] text-[#1F1F1F]">
              {chip}
            </span>
          </div>
        );
      })}

      {/* STARTS FROM — Figma: Inter Regular 16px #757575 */}
      <div
        className="absolute font-display text-[16px] leading-[19px] font-normal tracking-[0.08em] text-[#757575]"
        style={{ left: 963, top: 5151 }}
      >
        STARTS FROM
      </div>

      {/* ₩490,000 — Figma: Inter Bold 40px #1F1F1F */}
      <div
        className="absolute font-display text-[40px] leading-[48px] font-bold tracking-[-0.03em] text-[#1F1F1F]"
        style={{ left: 963, top: 5180 }}
      >
        ₩490,000
      </div>

      {/* / PROJECT — Figma: Inter Bold 24px #EEEEEE */}
      <div
        className="absolute font-display text-[24px] leading-[29px] font-bold tracking-[-0.01em] text-[#EEEEEE]"
        style={{ left: 1190, top: 5197 }}
      >
        / PROJECT
      </div>
    </>
  );
}
