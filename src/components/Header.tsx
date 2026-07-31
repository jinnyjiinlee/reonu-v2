"use client";
import { useLang } from "@/context/LanguageContext";
import { useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";

const PAD      = "max(3.125vw, calc(50vw - 900px))";
const EASE     = "cubic-bezier(0.76, 0, 0.24, 1)";

// Logo — 20px Inter Display weight 800, matching reference
const FS_LOGO = "20px";
const LH_LOGO = "32px";   // 160%
const FW_LOGO = 800;

// Nav / tagline — 14px Inter Display weight 700, matching reference
const FS_NAV = "14px";
const LH_NAV = "14px";
const FW_NAV = 700;

// Letter-spacing: logo = 0 (matches reference), nav/tagline = +0.02em
const LS_LOGO = "0";
const LS_NAV  = "0.02em";

const HIT_PAD_X = 8;
const HIT_PAD_Y = 6;

function NavLink({ href, label, active }: { href: string; label: string; active?: boolean }) {
  const rootRef = useRef<HTMLAnchorElement>(null);

  const enter = () => {
    rootRef.current?.querySelectorAll<HTMLElement>(".nav-char-stack").forEach((el, i) => {
      el.style.transitionDelay = `${i * 35}ms`;
      el.style.transform = "translateY(-50%)";
    });
  };
  const leave = () => {
    rootRef.current?.querySelectorAll<HTMLElement>(".nav-char-stack").forEach((el) => {
      el.style.transitionDelay = "0ms";
      el.style.transform = "translateY(0)";
    });
  };

  return (
    <a
      ref={rootRef}
      href={href}
      onMouseEnter={enter}
      onMouseLeave={leave}
      className="font-display-headline"
      style={{
        fontSize: FS_NAV, lineHeight: LH_NAV, fontWeight: FW_NAV,
        letterSpacing: LS_NAV, color: "inherit",
        textDecoration: "none", position: "relative",
        display: "inline-flex", alignItems: "center",
        padding: `${HIT_PAD_Y}px ${HIT_PAD_X}px`,
        margin: `-${HIT_PAD_Y}px -${HIT_PAD_X}px`,
      }}
    >
      {label.split("").map((char, i) => (
        <span key={i} className="nav-char-wrap">
          <span className="nav-char-stack" style={{ transition: `transform 0.4s ${EASE}` }}>
            <span>{char}</span>
            <span aria-hidden>{char}</span>
          </span>
        </span>
      ))}
    </a>
  );
}

function LangBtn() {
  const { lang, toggle } = useLang();
  const rootRef = useRef<HTMLButtonElement>(null);
  const chars   = lang === "ko" ? ["EN"] : ["KR"];

  const enter = () => {
    rootRef.current?.querySelectorAll<HTMLElement>(".nav-char-stack").forEach((el, i) => {
      el.style.transitionDelay = `${i * 35}ms`;
      el.style.transform = "translateY(-50%)";
    });
  };
  const leave = () => {
    rootRef.current?.querySelectorAll<HTMLElement>(".nav-char-stack").forEach((el) => {
      el.style.transitionDelay = "0ms";
      el.style.transform = "translateY(0)";
    });
  };

  return (
    <button
      ref={rootRef}
      onClick={toggle}
      onMouseEnter={enter}
      onMouseLeave={leave}
      className="font-display-headline"
      style={{
        fontSize: FS_NAV, lineHeight: LH_NAV, fontWeight: FW_NAV,
        letterSpacing: LS_NAV, color: "inherit",
        background: "none", border: "none",
        cursor: "pointer", position: "relative",
        display: "inline-flex", alignItems: "center", gap: 5,
        padding: `${HIT_PAD_Y}px ${HIT_PAD_X}px`,
        margin: `-${HIT_PAD_Y}px -${HIT_PAD_X}px`,
      }}
    >
      {/* Globe icon */}
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style={{ flexShrink: 0 }}>
        <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.1"/>
        <ellipse cx="7" cy="7" rx="2.5" ry="6" stroke="currentColor" strokeWidth="1.1"/>
        <line x1="1" y1="7" x2="13" y2="7" stroke="currentColor" strokeWidth="1.1"/>
        <line x1="1.5" y1="4.5" x2="12.5" y2="4.5" stroke="currentColor" strokeWidth="1.1"/>
        <line x1="1.5" y1="9.5" x2="12.5" y2="9.5" stroke="currentColor" strokeWidth="1.1"/>
      </svg>
      {chars.map((char, i) => (
        <span key={char + i} className="nav-char-wrap">
          <span className="nav-char-stack" style={{ transition: `transform 0.4s ${EASE}` }}>
            <span>{char}</span>
            <span aria-hidden>{char}</span>
          </span>
        </span>
      ))}
    </button>
  );
}

const NAV_HREFS: Record<string, string> = {
  WORKS:   "/works",
  STUDIO:  "/studio",
  CONTACT: "/contact",
};

/* ── Mobile hamburger icon ──────────────────────────────────────────── */
function HamburgerIcon({ open }: { open: boolean }) {
  return (
    <svg width="22" height="16" viewBox="0 0 22 16" fill="none" aria-hidden="true">
      {/* Top line */}
      <line
        x1="0" y1="2" x2="22" y2="2"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round"
        style={{
          transformOrigin: "11px 2px",
          transform: open ? "translateY(6px) rotate(45deg)" : "none",
          transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1)",
        }}
      />
      {/* Middle line */}
      <line
        x1="0" y1="8" x2="22" y2="8"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round"
        style={{
          opacity: open ? 0 : 1,
          transition: "opacity 0.2s ease",
        }}
      />
      {/* Bottom line */}
      <line
        x1="0" y1="14" x2="22" y2="14"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round"
        style={{
          transformOrigin: "11px 14px",
          transform: open ? "translateY(-6px) rotate(-45deg)" : "none",
          transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1)",
        }}
      />
    </svg>
  );
}

/* ── Mobile overlay menu — rendered via portal to escape mix-blend-mode ── */
function MobileMenuOverlay({
  isOpen,
  onClose,
  pathname,
}: {
  isOpen: boolean;
  onClose: () => void;
  pathname: string;
}) {
  const { lang, toggle } = useLang();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!mounted) return null;

  const navItems = [
    { label: "WORKS",   href: "/works"   },
    { label: "STUDIO",  href: "/studio"  },
    { label: "CONTACT", href: "/contact" },
  ];

  const overlay = (
    <div
      aria-modal="true"
      role="dialog"
      style={{
        position:   "fixed",
        inset:      0,
        zIndex:     10002,
        background: "#1D1D1F",
        display:    "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "0 28px 48px",
        transform:  isOpen ? "translateY(0)" : "translateY(-100%)",
        transition: "transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        pointerEvents: isOpen ? "auto" : "none",
      }}
    >
      {/* Top bar — REONU logo + close button */}
      <div style={{
        height: 64,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        <a
          href="/"
          onClick={onClose}
          style={{
            fontSize: 20, fontWeight: 800, letterSpacing: 0,
            color: "#ffffff", textDecoration: "none",
            fontFamily: "inherit",
          }}
        >
          REONU
        </a>
        <button
          onClick={onClose}
          aria-label="Close menu"
          style={{
            background: "none", border: "none",
            color: "#ffffff", cursor: "pointer",
            padding: 8, margin: -8,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
            <line x1="3" y1="3" x2="19" y2="19" stroke="white" strokeWidth="2" strokeLinecap="round" />
            <line x1="19" y1="3" x2="3" y2="19" stroke="white" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* Nav links — large, centered */}
      <nav style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        flex: 1,
        justifyContent: "center",
      }}>
        {navItems.map(({ label, href }) => (
          <a
            key={label}
            href={href}
            onClick={onClose}
            style={{
              fontSize: "clamp(36px, 10vw, 56px)",
              fontWeight: 800,
              letterSpacing: "-0.04em",
              lineHeight: "1.15",
              color: pathname === href ? "#ffffff" : "rgba(255,255,255,0.4)",
              textDecoration: "none",
              transition: "color 0.2s ease",
              display: "block",
            }}
          >
            {label}
          </a>
        ))}
      </nav>

      {/* Bottom — lang toggle + tagline */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <p style={{
          fontSize: 13, fontWeight: 600, letterSpacing: "0.02em",
          color: "rgba(255,255,255,0.4)",
          margin: 0,
        }}>
          TURN U BRAND ON
        </p>
        <button
          onClick={() => { toggle(); onClose(); }}
          style={{
            background: "rgba(255,255,255,0.12)",
            border: "none",
            color: "#ffffff",
            cursor: "pointer",
            borderRadius: 999,
            padding: "8px 18px",
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: "0.02em",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.1"/>
            <ellipse cx="7" cy="7" rx="2.5" ry="6" stroke="currentColor" strokeWidth="1.1"/>
            <line x1="1" y1="7" x2="13" y2="7" stroke="currentColor" strokeWidth="1.1"/>
            <line x1="1.5" y1="4.5" x2="12.5" y2="4.5" stroke="currentColor" strokeWidth="1.1"/>
            <line x1="1.5" y1="9.5" x2="12.5" y2="9.5" stroke="currentColor" strokeWidth="1.1"/>
          </svg>
          {lang === "ko" ? "EN" : "KR"}
        </button>
      </div>
    </div>
  );

  return createPortal(overlay, document.body);
}

export default function Header({ initialVisible = false }: { initialVisible?: boolean }) {
  const pathname   = usePathname();
  const headerRef  = useRef<HTMLElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      {/* Single header element — 3-column flex layout matching reference structure.
          zIndex: 10001 keeps it above the ScaleStage canvas. */}
      <header
        ref={headerRef}
        className="fixed top-0 left-0 right-0"
        style={{
          height:          64,
          zIndex:          10001,
          display:         "flex",
          flexDirection:   "row",
          alignItems:      "center",
          paddingLeft:     PAD,
          paddingRight:    PAD,
          backgroundColor: "transparent",
          color:           "white",         // white + mix-blend-mode:difference → black on white bg, white on dark
          mixBlendMode:    "difference",
        }}
      >
        {/* Section 1 — Logo (left, flex: 1) */}
        <div style={{ flex: "1 0 auto", display: "flex", alignItems: "center", minWidth: 0 }}>
          <a id="header-logo" href="/" className="font-display-headline" style={{
            fontSize: FS_LOGO, lineHeight: LH_LOGO, fontWeight: FW_LOGO,
            letterSpacing: LS_LOGO, color: "inherit",
            opacity: initialVisible ? 1 : 0,
            textDecoration: "none",
            whiteSpace: "nowrap",
          }}>
            REONU
          </a>
        </div>

        {/* Section 2 — Tagline (center, flex: 1 shrinkable, justify: center)
            Hidden below 1100px via .header-tagline CSS class in globals.css */}
        <div className="header-tagline" style={{ flex: "1 1 auto", display: "flex", justifyContent: "center", alignItems: "center", minWidth: 0, overflow: "hidden" }}>
          <div id="header-tagline" className="font-display-headline" style={{
            fontSize: FS_NAV, lineHeight: LH_NAV, fontWeight: FW_NAV,
            letterSpacing: LS_NAV, color: "inherit",
            whiteSpace: "nowrap",
            opacity: initialVisible ? 1 : 0,
          }}>
            TURN U BRAND ON
          </div>
        </div>

        {/* Section 3 — Nav (right, flex: 0 no-shrink, justify: flex-end)
            Desktop: nav links. Mobile: hamburger button only. */}
        <div style={{ flex: "0 0 auto", display: "flex", alignItems: "center", gap: "clamp(20px, 3.125vw, 60px)" }}>
          {/* Desktop nav — hidden on mobile */}
          <nav className="hidden lg:flex" style={{ flexDirection: "row", alignItems: "center", gap: "clamp(20px, 3.125vw, 60px)" }}>
            {(["WORKS", "STUDIO", "CONTACT"] as const).map((label) => (
              <NavLink key={label} href={NAV_HREFS[label]} label={label} active={pathname === NAV_HREFS[label]} />
            ))}
            <LangBtn />
          </nav>

          {/* Mobile hamburger — visible only on mobile */}
          <button
            className="flex lg:hidden"
            onClick={() => setMenuOpen(p => !p)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            style={{
              background: "none", border: "none",
              color: "inherit", cursor: "pointer",
              padding: "6px 0 6px 8px",
              margin: "-6px 0 -6px -8px",
              display: "flex", alignItems: "center",
            }}
          >
            <HamburgerIcon open={menuOpen} />
          </button>
        </div>
      </header>

      {/* Mobile overlay menu — portal to body to escape mix-blend-mode stacking context */}
      <MobileMenuOverlay
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        pathname={pathname}
      />
    </>
  );
}
