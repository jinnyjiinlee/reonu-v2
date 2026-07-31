"use client";

import { useState, useEffect, useRef, type CSSProperties, type MouseEventHandler } from "react";
import LocalTime from "@/components/LocalTime";

const BTN_EASE = "cubic-bezier(0.4, 0, 0.2, 1)";

function EmailLink({ email, fontSize }: { email: string; fontSize: number }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      data-cursor="hidden"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{ display: "inline-block", position: "relative" }}
    >
      <a
        href={`mailto:${email}`}
        className="font-headline font-bold tracking-[-0.03em] text-[#000000]"
        style={{ fontSize, lineHeight: `${fontSize * (58 / 48)}px`, display: "block", textDecoration: "none" }}
      >
        {email}
      </a>
      {/* Underline — slides in from left on hover, 2.54px to match StartProjectBtn */}
      <span style={{
        position: "absolute", bottom: -6, left: 0, right: 0,
        height: 2.54, background: "#000000",
        transform: hov ? "scaleX(1)" : "scaleX(0)",
        transformOrigin: "0% 50%",
        transition: `transform 0.42s ${BTN_EASE}`,
      }} />
    </div>
  );
}

// LocalTime is now a shared component — imported from LocalTime.tsx

// Footer nav link
// hoverEffect: "flip" = letter-by-letter slide-up (default), "opacity" = simple opacity fade
// underline: "none" = no underline ever, "always" = static underline (no hover needed)
function FooterNavLink({
  href,
  label,
  className,
  style,
  underline = "none",
  hoverEffect = "flip",
  icon = false,
  onClick,
}: {
  href: string;
  label: string;
  className: string;
  style?: CSSProperties;
  underline?: "none" | "always";
  hoverEffect?: "flip" | "opacity";
  icon?: boolean;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
}) {
  if (hoverEffect === "opacity") {
    return (
      <a
        href={href}
        data-cursor="hidden"
        className={`inline-flex items-center hover:opacity-60 transition-opacity duration-300 ${className}`}
        style={style}
        onClick={onClick}
      >
        {label}
      </a>
    );
  }

  const underlineClass =
    underline === "always" ? "footer-nav-underline-always" : "footer-nav-no-underline";
  return (
    <a
      href={href}
      data-cursor="hidden"
      className={`nav-item ${underlineClass} ${className}`}
      style={style}
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

export default function Footer({ navFontSize = 14 }: { navFontSize?: number }) {
  const bottomFontSize = navFontSize * (16 / 14);
  const copyrightFontSize = navFontSize * (12 / 14);

  const taglineRef = useRef<HTMLDivElement>(null);
  const emailRef   = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const STRIPE_H = 32;
    const DURATION = 1100;
    const ease = (t: number) => 1 - Math.pow(1 - t, 3);

    const applyMask = (el: HTMLElement, visiblePx: number) => {
      const m = `repeating-linear-gradient(to bottom,#000 0px,#000 ${visiblePx}px,transparent ${visiblePx}px,transparent ${STRIPE_H}px)`;
      el.style.webkitMaskImage = m;
      (el.style as any).maskImage = m;
    };
    const clearMask = (el: HTMLElement) => {
      el.style.webkitMaskImage = "none";
      (el.style as any).maskImage = "none";
    };

    const rafs: Record<string, number> = {};
    const runAnim = (key: string, el: HTMLElement, delay = 0) => {
      if (rafs[key]) cancelAnimationFrame(rafs[key]);
      let start: number | null = null;
      const tick = (now: number) => {
        if (start === null) start = now;
        const elapsed = now - start - delay;
        if (elapsed < 0) { rafs[key] = requestAnimationFrame(tick); return; }
        const p = ease(Math.min(elapsed / DURATION, 1));
        applyMask(el, p * STRIPE_H);
        if (p < 1) rafs[key] = requestAnimationFrame(tick);
        else clearMask(el);
      };
      rafs[key] = requestAnimationFrame(tick);
    };

    [taglineRef.current, emailRef.current].forEach(el => { if (el) applyMask(el, 0); });

    let footerInView = false;

    function check() {
      const wrapper = document.getElementById("scroll-wrapper");
      if (!wrapper) return;
      const maxScroll = Math.max(0, wrapper.scrollHeight - window.innerHeight);
      const vy    = (window as any).__virtualY ?? 0;
      const scale = Math.min(window.innerWidth / 1920, 1);
      const inView = maxScroll <= 0 || maxScroll - vy <= 855 * scale;

      if (inView && !footerInView) {
        footerInView = true;
        if (taglineRef.current) runAnim("tagline", taglineRef.current, 0);
        if (emailRef.current)   runAnim("email",   emailRef.current, 160);
      } else if (!inView && footerInView) {
        footerInView = false;
        Object.values(rafs).forEach(id => cancelAnimationFrame(id));
        [taglineRef.current, emailRef.current].forEach(el => { if (el) applyMask(el, 0); });
      }
    }

    window.addEventListener("virtual-scroll", check as EventListener);
    check();
    return () => {
      window.removeEventListener("virtual-scroll", check as EventListener);
      Object.values(rafs).forEach(id => cancelAnimationFrame(id));
    };
  }, []);

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
        style={{ left: 60, top: 200, width: 1800, gap: 120 }}
      >
        {/* Row 1 — tagline + email, flex space-between (matches reference text_wrapper) */}
        <div data-name="text_wrapper" className="flex items-start justify-between">
          {/* Tagline (left) — venetian-blind mask reveal */}
          <div
            ref={taglineRef}
            className="font-headline font-bold text-[48px] leading-[58px] tracking-[-0.03em] text-[#000000]"
          >
            Turns On The Value Within
            <br />
            Your Brand.
          </div>

          {/* Email (right) — venetian-blind mask reveal, 150ms stagger */}
          <div ref={emailRef}>
            <EmailLink email="reonustudio@gmail.com" fontSize={48} />
          </div>
        </div>

        {/* Local time — left side, aligned with nav links row top (canvas y=436) */}
      <div className="absolute" style={{ left: 0, top: 236 }}>
        <LocalTime fontSize={navFontSize} />
      </div>

      {/* Row 2 — REONU / SOCIAL MEDIA columns (matches reference Pages/Social Media wrapper) */}
        {/* marginLeft:1233 (=1293-60) aligns REONU with the email's left edge above */}
        <div data-name="pages_wrapper" className="grid grid-cols-3" style={{ marginLeft: 1233, width: 1800 - 1233 }}>
          {/* REONU column — 1st of 3 equal columns */}
          <div data-name="Pages" className="flex flex-col gap-[40px]">
            <FooterNavLink
              href="#works"
              label="WORKS"

              className="font-display-headline font-bold" style={{ color: "#000000e6", letterSpacing: "0.02em", fontSize: navFontSize, lineHeight: `${navFontSize}px` }}
            />
            <FooterNavLink
              href="#studio"
              label="STUDIO"

              className="font-display-headline font-bold" style={{ color: "#000000e6", letterSpacing: "0.02em", fontSize: navFontSize, lineHeight: `${navFontSize}px` }}
            />
            <FooterNavLink
              href="#contact"
              label="CONTACT"

              className="font-display-headline font-bold pb-[4px] self-start"
              style={{ color: "#000000e6", letterSpacing: "0.02em", fontSize: navFontSize, lineHeight: `${navFontSize}px` }}
              underline="none"
            />
          </div>

          {/* SOCIAL MEDIA column — content starts right at the column-2 line, no visible border */}
          <div data-name="Social Media" className="flex flex-col gap-[40px]">
            <FooterNavLink
              href="#"
              label="INSTAGRAM"

              className="font-display-headline font-bold" style={{ color: "#000000e6", letterSpacing: "0.02em", fontSize: navFontSize, lineHeight: `${navFontSize}px` }}
            />
            <FooterNavLink
              href="#"
              label="LINKEDIN"

              className="font-display-headline font-bold" style={{ color: "#000000e6", letterSpacing: "0.02em", fontSize: navFontSize, lineHeight: `${navFontSize}px` }}
            />
            <FooterNavLink
              href="#"
              label="BEHANCE"

              className="font-display-headline font-bold" style={{ color: "#000000e6", letterSpacing: "0.02em", fontSize: navFontSize, lineHeight: `${navFontSize}px` }}
            />
          </div>

          {/* Empty 3rd column */}
          <div data-name="Empty" />
        </div>

        {/* Row 3 — giant REONU wordmark + copyright (matches reference "logo + terms" wrapper) */}
        <div data-name="logo + terms" className="relative">
          {/* Giant REONU wordmark — Bold 248px. Inter's empty descender space (~0.2em) below the
              cap-height glyphs is pushed down via translateY so the letters sit flush with the
              bottom of the page. */}
          <div
            data-name="Logo Reonu"
            className="font-headline select-none -translate-x-[16px]"
            style={{
              fontSize: 248,
              fontWeight: 800,
              lineHeight: 1,
              letterSpacing: "-0.05em",
              color: "#000000",
              fontOpticalSizing: "none",
              fontVariationSettings: '"opsz" 144',
              marginTop: -30,
            }}
          >
            REONU
          </div>

          {/* Back to top — same style as SOCIAL MEDIA links, left edge aligns with REONU/email column above (left:1233) */}
          <div className="absolute" style={{ left: 1233, top: 0 }}>
            <FooterNavLink
              href="#top"
              label="BACK TO TOP"
              className="font-display-headline font-bold"
              style={{ color: "#000000e6", letterSpacing: "0.02em", fontSize: navFontSize, lineHeight: `${navFontSize}px` }}
              onClick={(e) => {
                e.preventDefault();
                window.dispatchEvent(
                  new CustomEvent("smoothscroll:to", { detail: { target: 0 } })
                );
              }}
            />
          </div>

        </div>
      </div>

      {/* Copyright bar — flex-col at left:1293, bottom:32 (32px padding below © text)
          Links row uses relative container (width=567, same as pages_wrapper) so
          TERMS OF SERVICE aligns with INSTAGRAM column left (col 2 start = left:189). */}
      <div
        className="absolute flex flex-row items-center justify-between"
        style={{ left: 1293, right: 60, bottom: 32 }}
      >
        <p
          className="font-display-headline whitespace-nowrap"
          style={{
            fontWeight: 700,
            color: "#737373",
            fontSize: copyrightFontSize,
            lineHeight: `${copyrightFontSize}px`,
            letterSpacing: "0.02em",
            margin: 0,
          }}
        >
          © 2026 REONU. ALL RIGHTS RESERVED.
        </p>
        <FooterNavLink
          href="#"
          label="TERMS"
          className="font-display-headline whitespace-nowrap"
          style={{ fontWeight: 600, color: "#737373", fontSize: copyrightFontSize, lineHeight: `${copyrightFontSize}px`, letterSpacing: "0.02em" }}
        />
        <FooterNavLink
          href="#"
          label="PRIVACY POLICY"
          className="font-display-headline whitespace-nowrap"
          style={{ fontWeight: 600, color: "#737373", fontSize: copyrightFontSize, lineHeight: `${copyrightFontSize}px`, letterSpacing: "0.02em" }}
        />
      </div>
    </>
  );
}
