"use client";

import type { CSSProperties, MouseEventHandler } from "react";

// Footer nav link — same letter-flip hover effect as the header nav
// underline: "none" = no underline ever, "always" = static underline (no hover needed)
function FooterNavLink({
  href,
  label,
  className,
  underline = "none",
  icon = false,
  onClick,
}: {
  href: string;
  label: string;
  className: string;
  underline?: "none" | "always";
  icon?: boolean;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
}) {
  const underlineClass =
    underline === "always" ? "footer-nav-underline-always" : "footer-nav-no-underline";
  return (
    <a
      href={href}
      data-cursor="hidden"
      className={`nav-item ${underlineClass} ${className}`}
      onClick={onClick}
    >
      {label.split("").map((char, i) => {
        const display = char === " " ? " " : char;
        return (
          <span key={i} className="nav-char-wrap">
            <span className="nav-char-stack" style={{ "--char-i": i } as CSSProperties}>
              <span>{display}</span>
              <span aria-hidden="true">{display}</span>
            </span>
          </span>
        );
      })}
      {icon && (
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="ml-[6px]"
          style={{ flexShrink: 0 }}
        >
          <path
            d="M2.5 9.5L9.5 2.5M9.5 2.5H4M9.5 2.5V8"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </a>
  );
}

export default function Footer() {
  return (
    <>
      {/* Divider line */}
      <div
        className="absolute bg-[#F5F5F7]"
        style={{ left: 60, top: 0, width: 1800, height: 1 }}
      />

      {/* Footer content container — flex column, matches reference site's footer "Container" structure */}
      <div
        data-name="Container"
        className="absolute flex flex-col"
        style={{ left: 60, top: 121, width: 1800 }}
      >
        {/* Row 1 — tagline + email, flex space-between (matches reference text_wrapper) */}
        <div data-name="text_wrapper" className="flex items-start justify-between">
          {/* Tagline (left) — Inter Bold 48px #1D1D1F */}
          <div className="font-headline font-bold text-[48px] leading-[58px] tracking-[-0.03em] text-[#1D1D1F]">
            Turns On The Value Within
            <br />
            Your Brand.
          </div>

          {/* Email (right) — Bold 48px */}
          <a
            href="mailto:reonustudio@gmail.com"
            className="font-headline font-bold text-[48px] leading-[58px] tracking-[-0.03em] text-[#1D1D1F] hover:opacity-60"
          >
            reonustudio@gmail.com
          </a>
        </div>

        {/* Row 2 — REONU / SOCIAL MEDIA columns (matches reference Pages/Social Media wrapper) */}
        {/* marginLeft:1233 (=1293-60) aligns REONU with the email's left edge above */}
        <div data-name="pages_wrapper" className="grid grid-cols-3" style={{ marginTop: 80, marginLeft: 1233, width: 1800 - 1233 }}>
          {/* REONU column — 1st of 3 equal columns */}
          <div data-name="Pages" className="flex flex-col gap-[24px]">
            <div className="font-headline text-[14px] leading-[20px] font-medium tracking-[-0.01em] text-[#86868B] mb-[9px]">
              REONU
            </div>
            <FooterNavLink
              href="#works"
              label="WORKS"
              className="font-headline text-[16px] leading-[1.4em] font-semibold tracking-[-0.01em] text-[#1D1D1F]"
            />
            <FooterNavLink
              href="#studio"
              label="STUDIO"
              className="font-headline text-[16px] leading-[1.4em] font-semibold tracking-[-0.01em] text-[#1D1D1F]"
            />
            <FooterNavLink
              href="#contact"
              label="CONTACT"
              className="font-headline text-[16px] leading-[1.4em] font-semibold tracking-[-0.01em] text-[#1D1D1F] pb-[4px] self-start"
              underline="always"
            />
          </div>

          {/* SOCIAL MEDIA column — content starts right at the column-2 line, no visible border */}
          <div data-name="Social Media" className="flex flex-col gap-[24px]">
            <div className="font-headline text-[14px] leading-[20px] font-medium tracking-[-0.01em] text-[#86868B] mb-[9px]">
              SOCIAL MEDIA
            </div>
            <FooterNavLink
              href="#"
              label="INSTAGRAM"
              className="font-headline text-[16px] leading-[1.4em] font-semibold tracking-[-0.01em] text-[#1D1D1F]"
            />
            <FooterNavLink
              href="#"
              label="LINKEDIN"
              className="font-headline text-[16px] leading-[1.4em] font-semibold tracking-[-0.01em] text-[#1D1D1F]"
            />
            <FooterNavLink
              href="#"
              label="BEHANCE"
              className="font-headline text-[16px] leading-[1.4em] font-semibold tracking-[-0.01em] text-[#1D1D1F]"
            />
          </div>

          {/* Empty 3rd column */}
          <div data-name="Empty" />
        </div>

        {/* Row 3 — giant REONU wordmark + copyright (matches reference "logo + terms" wrapper) */}
        <div data-name="logo + terms" className="relative" style={{ marginTop: 87 }}>
          {/* Giant REONU wordmark — Bold 248px. Inter's empty descender space (~0.2em) below the
              cap-height glyphs is pushed down via translateY so the letters sit flush with the
              bottom of the page. */}
          <div
            data-name="Logo Reonu"
            className="font-headline font-bold text-[#1D1D1F] select-none -translate-x-[16px] translate-y-[30px]"
            style={{ fontSize: 248, lineHeight: 1, letterSpacing: "-0.04em" }}
          >
            REONU
          </div>

          {/* Back to top — same style as SOCIAL MEDIA links, left edge aligns with REONU/email column above (left:1233) */}
          <div className="absolute" style={{ left: 1233, top: 30 }}>
            <FooterNavLink
              href="#top"
              label="BACK TO TOP"
              className="font-headline text-[16px] leading-[1.4em] font-semibold tracking-[-0.01em] text-[#1D1D1F]"
              onClick={(e) => {
                e.preventDefault();
                window.dispatchEvent(
                  new CustomEvent("smoothscroll:to", { detail: { target: 0 } })
                );
              }}
            />
          </div>

          {/* Copyright — left edge aligns with REONU/email column above (left:1233) */}
          <div className="absolute pb-[40px]" style={{ left: 1233, bottom: 0 }}>
            <div
              data-name="copyright"
              className="font-headline text-[14px] leading-[1.4em] font-semibold tracking-[-0.01em] text-[#86868B]"
            >
              © 2026 <span className="font-semibold">REONU</span>. ALL RIGHTS RESERVED.
            </div>
          </div>

          {/* Privacy Policy / Terms of Service — same line as copyright, right edge aligns with the
              container's right edge (right:0) */}
          <div
            className="absolute flex items-center whitespace-nowrap pb-[40px]"
            style={{ right: 0, bottom: 0, gap: 40 }}
          >
            <a
              href="#"
              className="font-headline text-[13px] leading-[20px] font-semibold tracking-[-0.01em] text-[#86868B] opacity-70 hover:opacity-60"
            >
              PRIVACY POLICY
            </a>
            <a
              href="#"
              className="font-headline text-[13px] leading-[20px] font-semibold tracking-[-0.01em] text-[#86868B] opacity-70 hover:opacity-60"
            >
              TERMS OF SERVICE
            </a>
          </div>
        </div>
      </div>

    </>
  );
}
