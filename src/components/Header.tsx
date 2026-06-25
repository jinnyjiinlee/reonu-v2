"use client";
import { useLang } from "@/context/LanguageContext";
import { useRef } from "react";
import { usePathname } from "next/navigation";

const PAD  = "max(3.125vw, calc(50vw - 900px))";
const FS   = "min(calc(16 / 1920 * 100vw), 16px)";
const LH   = "min(calc(20 / 1920 * 100vw), 20px)";
const EASE = "cubic-bezier(0.76, 0, 0.24, 1)";

// Extra invisible padding around each nav item so hover/click registers
// without needing pixel-precise pointer placement on the small text.
const HIT_PAD_X = 8;
const HIT_PAD_Y = 6;

// Direct DOM manipulation — no useState re-render, so hover is instant
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
      className="font-headline"
      style={{
        fontSize: FS, lineHeight: LH, fontWeight: 600,
        letterSpacing: "-0.01em", color: active ? "#1D1D1F" : "#6E6E73",
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
  const { lang, toggle } = useLang(); // context 직접 사용
  const rootRef = useRef<HTMLButtonElement>(null);
  const lineRef = useRef<HTMLSpanElement>(null);
  const chars   = lang === "ko" ? ["E", "N"] : ["K", "R"];

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
      className="font-headline"
      style={{
        fontSize: FS, lineHeight: LH, fontWeight: 600,
        letterSpacing: "-0.01em", color: "#1D1D1F",
        background: "none", border: "none",
        cursor: "none", position: "relative",
        display: "inline-flex", alignItems: "center",
        padding: `${HIT_PAD_Y}px ${HIT_PAD_X}px`,
        margin: `-${HIT_PAD_Y}px -${HIT_PAD_X}px`,
      }}
    >
      {chars.map((char, i) => (
        <span key={char + i} className="nav-char-wrap">
          <span className="nav-char-stack" style={{ transition: `transform 0.4s ${EASE}` }}>
            <span>{char}</span>
            <span aria-hidden>{char}</span>
          </span>
        </span>
      ))}
      {/* Always-on underline — same as footer's CONTACT */}
      <span ref={lineRef} style={{
        position: "absolute", bottom: 0, left: HIT_PAD_X, right: HIT_PAD_X,
        height: 2, background: "#1D1D1F", display: "block",
        transform: "scaleX(1)", transformOrigin: "left center",
      }} />
    </button>
  );
}

const NAV_HREFS: Record<string, string> = {
  WORKS:   "/works",
  STUDIO:  "#studio",
  CONTACT: "#contact",
};

export default function Header({ initialVisible = false }: { initialVisible?: boolean }) {
  const pathname = usePathname();
  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-40 bg-white"
        style={{ height: "min(calc(66 / 1920 * 100vw), 66px)" }}
      >
        <a id="header-logo" href="/" className="font-headline" style={{
          position: "absolute",
          top: "min(calc(25 / 1920 * 100vw), 25px)", left: PAD,
          fontSize: FS, lineHeight: LH, fontWeight: 700,
          letterSpacing: "-0.02em", color: "#1D1D1F",
          opacity: initialVisible ? 1 : 0,
          textDecoration: "none",
        }}>
          REONU
        </a>
        <div id="header-tagline" className="font-headline" style={{
          position: "absolute",
          top: "min(calc(25 / 1920 * 100vw), 25px)", left: "50%",
          transform: "translateX(-50%)",
          fontSize: FS, lineHeight: LH, fontWeight: 600,
          letterSpacing: "-0.01em", color: "#6E6E73",
          whiteSpace: "nowrap",
          opacity: initialVisible ? 1 : 0,
        }}>
          TURN U BRAND ON
        </div>
      </header>

      <nav
        className="fixed z-[10001] flex items-center"
        style={{
          top: "min(calc(25 / 1920 * 100vw), 25px)",
          right: PAD,
          gap: "min(calc(60 / 1920 * 100vw), 60px)",
        }}
      >
        {(["WORKS", "STUDIO", "CONTACT"] as const).map((label) => (
          <NavLink key={label} href={NAV_HREFS[label]} label={label} active={pathname === NAV_HREFS[label]} />
        ))}
        <LangBtn />
      </nav>
    </>
  );
}
