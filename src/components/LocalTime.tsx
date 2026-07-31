"use client";

import { useState, useEffect } from "react";

// Shared local time display — Texas (America/Chicago)
// Daytime (07:00–21:00): spinning sun icon
// Nighttime (21:00–07:00): zzz icon
export default function LocalTime({
  fontSize,
  color = "#000000e6",
  fontWeight = 700,
  letterSpacing = "0.02em",
}: {
  fontSize: number;
  color?: string;
  fontWeight?: number;
  letterSpacing?: string;
}) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!now) return null;

  const timeStr = now.toLocaleTimeString("en-US", {
    timeZone: "America/Chicago",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const txHour = parseInt(
    new Intl.DateTimeFormat("en-US", {
      timeZone: "America/Chicago", // Dallas (Central Time)
      hour: "numeric",
      hour12: false,
    }).format(now),
    10
  );
  const isNight = txHour < 7 || txHour >= 21;

  return (
    <div
      className="font-headline flex items-center"
      style={{
        gap: fontSize * 0.5,
        color,
        fontSize,
        fontWeight,
        lineHeight: `${fontSize}px`,
        letterSpacing,
      }}
    >
      {isNight ? (
        <svg
          width={fontSize}
          height={fontSize}
          viewBox="0 0 16 16"
          fill="none"
          style={{ flexShrink: 0 }}
        >
          <g className="zzz-z1">
            <path d="M5.5 11h6L5.5 15h6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </g>
          <g className="zzz-z2">
            <path d="M0.5 6h5L0.5 10h5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </g>
          <g className="zzz-z3">
            <path d="M10 1h5L10 5h5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        </svg>
      ) : (
        <svg
          width={fontSize}
          height={fontSize}
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          className="sun-spin"
          style={{ flexShrink: 0 }}
        >
          <circle cx="8" cy="8" r="2.5" fill="currentColor" stroke="none" />
          <line x1="8" y1="0.5" x2="8" y2="3" />
          <line x1="8" y1="13" x2="8" y2="15.5" />
          <line x1="0.5" y1="8" x2="3" y2="8" />
          <line x1="13" y1="8" x2="15.5" y2="8" />
          <line x1="2.4" y1="2.4" x2="4.2" y2="4.2" />
          <line x1="11.8" y1="11.8" x2="13.6" y2="13.6" />
          <line x1="2.4" y1="13.6" x2="4.2" y2="11.8" />
          <line x1="11.8" y1="4.2" x2="13.6" y2="2.4" />
        </svg>
      )}
      <span>{timeStr} Dallas, TX</span>
    </div>
  );
}
