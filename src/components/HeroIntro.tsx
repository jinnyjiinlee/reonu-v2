"use client";

// Always English, regardless of the KR/EN language toggle.
export default function HeroIntro() {
  return (
    <div
      className="absolute font-headline text-[20px] font-medium text-[#1D1D1F]"
      style={{ left: 60, top: 504, width: 520, fontWeight: 500, lineHeight: "160%", letterSpacing: 0 }}
    >
      <span style={{ color: "#1D1D1F", letterSpacing: "-0.02em", fontWeight: 800 }}>REONU®</span>
      {" — design studio dedicated to uncovering"}<br />{"the value already within a brand and turning it into"}<br />{"clear, scalable design."}
    </div>
  );
}
