"use client";
import { useEffect, useState } from "react";

// Loading screen — shown on every page load (Salient-style).
// Phases: enter (invisible) → visible (text fades + slides in) → exit (overlay fades out) → gone (unmounted)
type Phase = "enter" | "visible" | "exit" | "gone";

// Duration constants (ms)
const TEXT_IN_DELAY   = 80;   // delay before text starts appearing
const HOLD_UNTIL      = 1900; // start fading out at this time
const GONE_AT         = 2600; // remove from DOM

// When exit starts, notify the rest of the page so content can animate in
function dispatchLoadingDone() {
  window.dispatchEvent(new CustomEvent("loading-done"));
}

export default function LoadingScreen() {
  const [phase, setPhase] = useState<Phase>("enter");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("visible"), TEXT_IN_DELAY);
    const t2 = setTimeout(() => { setPhase("exit"); dispatchLoadingDone(); }, HOLD_UNTIL);
    const t3 = setTimeout(() => setPhase("gone"), GONE_AT);
    return () => [t1, t2, t3].forEach(clearTimeout);
  }, []);

  if (phase === "gone") return null;

  const isExiting  = phase === "exit";
  const isEntering = phase === "enter";

  return (
    <div
      style={{
        position:        "fixed",
        inset:           0,
        backgroundColor: "#1D1D1F",
        zIndex:          99999,
        display:         "flex",
        alignItems:      "center",
        justifyContent:  "center",
        opacity:         isExiting ? 0 : 1,
        transition:      isExiting
          ? "opacity 0.7s cubic-bezier(0.4, 0, 0.2, 1)"
          : "none",
        pointerEvents: isExiting ? "none" : "auto",
        willChange:    "opacity",
      }}
    >
      <span
        className="font-display-headline"
        style={{
          /* Match Salient: small, modest — not a headline, just the name */
          fontSize:      "16px",
          fontWeight:    500,
          letterSpacing: "-0.01em",
          color:         "#ffffff",
          /* Fade + slide-up: starts at translateY(12px) opacity:0, moves to 0,1 */
          opacity:       isEntering ? 0 : 1,
          transform:     isEntering ? "translateY(12px)" : "translateY(0)",
          transition:    isEntering
            ? "none"
            : "opacity 0.9s cubic-bezier(0.4, 0, 0.2, 1), transform 0.9s cubic-bezier(0.16, 1, 0.3, 1)",
          willChange:    "opacity, transform",
          userSelect:    "none",
        }}
      >
        REONU®
      </span>
    </div>
  );
}
