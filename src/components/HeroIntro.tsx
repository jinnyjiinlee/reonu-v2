export default function HeroIntro() {
  return (
    <>
      {/* (01) label — secondary gray */}
      <div
        className="absolute font-display text-[16px] leading-[19px] font-normal tracking-[-0.01em] text-[#999999]"
        style={{ left: 60, top: 164 }}
      >
        (01)
      </div>

      {/* Intro copy (English body) — Figma: Inter Regular 18px #444444 */}
      <div
        className="absolute font-display text-[18px] leading-[22px] font-normal tracking-[-0.005em] text-[#444444]"
        style={{ left: 60, top: 223, width: 427 }}
      >
        REONU — design studio dedicated to uncovering
        <br />
        the value already within a brand and turning it into
        <br />
        clear, scalable design.
      </div>

      {/* "-> Start Project" — underline link, 28px Regular */}
      <a
        href="#contact"
        className="absolute font-display text-[28px] leading-[34px] font-normal tracking-[-0.01em] text-[#1F1F1F] underline underline-offset-4 hover:opacity-60 transition-opacity"
        style={{ right: 60, top: 258 }}
      >
        →&nbsp;&nbsp;Start Project
      </a>
    </>
  );
}
