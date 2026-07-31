"use client";

import { useLang } from "@/context/LanguageContext";

const PAD     = "max(3.125vw, calc(50vw - 900px))";
const REONU_H = "min(14.0625vw, 270px)";
const HERO_H  = "min(calc(14.0625vw + 200px), 470px)";

export default function StudioHeroIntro() {
  const { lang } = useLang();

  return (
    <div
      style={{
        position:      "absolute",
        top:           0,
        left:          0,
        right:         0,
        height:        HERO_H,
        overflow:      "visible",
        pointerEvents: "none",
        zIndex:        3,
      }}
    >
      <div
        style={{
          position:      "absolute",
          top:           0,
          left:          PAD,
          right:         PAD,
          height:        "100%",
          boxSizing:     "border-box",
          paddingTop:    "min(10.4167vw, 200px)",
          pointerEvents: "auto",
        }}
      >
        {/* REONU zone — description anchored to bottom-right */}
        <div style={{ position: "relative", height: REONU_H, flexShrink: 0 }}>
          <p
            className="font-headline"
            style={{
              position:      "absolute",
              right:         0,
              bottom:        0,
              margin:        0,
              textAlign:     "left",
              fontSize:      16,
              fontWeight:    500,
              lineHeight:    "160%",
              letterSpacing: 0,
              color:         "#1D1D1F",
              whiteSpace:    "nowrap",
              pointerEvents: "none",
            }}
          >
            {lang === "ko" ? (
              <>
                <span style={{ fontWeight: 800, letterSpacing: "-0.02em" }}>WE ARE REONU®</span>
                {" "}— 브랜드 안에 이미 담겨 있는<br />
                가치를 발견하고 그것을 선명하고 확장 가능한<br />
                디자인으로 구현하는 디자인 스튜디오입니다.
              </>
            ) : (
              <>
                <span style={{ fontWeight: 800, letterSpacing: "-0.02em" }}>WE ARE REONU®</span>
                {" "}— a design studio that uncovers<br />
                the value already held within a brand, and brings it<br />
                to life as sharp, scalable design.
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
