export default function Footer() {
  return (
    <>
      {/* Divider line */}
      <div
        className="absolute bg-[#1F1F1F]"
        style={{ left: 60, top: 7135, width: 1800, height: 1 }}
      />

      {/* Tagline (left) — Inter Bold 48px #1F1F1F */}
      <div
        className="absolute font-display font-bold text-[48px] leading-[58px] tracking-[-0.03em] text-[#1F1F1F]"
        style={{ left: 60, top: 7254, width: 700 }}
      >
        Turns On The Value Within
        <br />
        Your Brand.
      </div>

      {/* Email (right) — Bold 48px UNDERLINE */}
      <a
        href="mailto:reonustudio@gmail.com"
        className="absolute font-display font-bold text-[48px] leading-[58px] tracking-[-0.03em] text-[#1F1F1F] underline underline-offset-[6px] hover:opacity-60"
        style={{ left: 1326, top: 7254 }}
      >
        reonustudio@gmail.com
      </a>

      {/* Secondary labels — Regular 20px #999999 */}
      <div
        className="absolute font-display text-[20px] leading-[24px] font-normal tracking-[-0.01em] text-[#999999]"
        style={{ left: 1326, top: 7433 }}
      >
        (REONU)
      </div>
      <div
        className="absolute font-display text-[20px] leading-[24px] font-normal tracking-[-0.01em] text-[#999999]"
        style={{ left: 1593, top: 7433 }}
      >
        (SOCIAL MEDIA)
      </div>

      {/* Nav links — all caps, Regular 18px #1F1F1F */}
      <a
        href="#works"
        className="absolute font-display text-[18px] leading-[22px] font-normal text-[#1F1F1F] hover:opacity-60"
        style={{ left: 1326, top: 7497 }}
      >
        WORKS
      </a>
      <a
        href="#studio"
        className="absolute font-display text-[18px] leading-[22px] font-normal text-[#1F1F1F] hover:opacity-60"
        style={{ left: 1326, top: 7550 }}
      >
        STUDIO
      </a>
      {/* CONTACT — Bold + UNDERLINE (active) per Figma */}
      <a
        href="#contact"
        className="absolute font-display text-[18px] leading-[22px] font-bold text-[#1F1F1F] underline underline-offset-4 hover:opacity-60"
        style={{ left: 1326, top: 7603 }}
      >
        CONTACT
      </a>

      <a
        href="#"
        className="absolute font-display text-[18px] leading-[22px] font-normal text-[#1F1F1F] hover:opacity-60"
        style={{ left: 1593, top: 7497 }}
      >
        INSTAGRAM
      </a>
      <a
        href="#"
        className="absolute font-display text-[18px] leading-[22px] font-normal text-[#1F1F1F] hover:opacity-60"
        style={{ left: 1593, top: 7550 }}
      >
        LINKEDIN
      </a>
      <a
        href="#"
        className="absolute font-display text-[18px] leading-[22px] font-normal text-[#1F1F1F] hover:opacity-60"
        style={{ left: 1593, top: 7603 }}
      >
        BEHANCE
      </a>

      {/* Giant REONU wordmark — Bold 248px */}
      <div
        className="absolute font-display font-bold text-[#1F1F1F] select-none"
        style={{
          left: 60,
          top: 7648,
          fontSize: 248,
          lineHeight: 1,
          letterSpacing: "-0.04em",
        }}
      >
        REONU
      </div>

      {/* Copyright — ALL CAPS, Regular 20px #999999 */}
      <div
        className="absolute font-display text-[20px] leading-[24px] font-normal tracking-[-0.005em] text-[#999999]"
        style={{ left: 1318, top: 7871 }}
      >
        © 2026 REONU DESIGN STUDIO. ALL RIGHTS RESERVED.
      </div>
    </>
  );
}
