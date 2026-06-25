"use client";

import { useEffect, useRef } from "react";

export default function SplitTextReveal({ text, className, style }: {
  text: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const wrapRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const chars = wrap.querySelectorAll<HTMLElement>("[data-c]");
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        chars.forEach(el => { el.style.transform = "translateY(0)"; });
        observer.disconnect();
      }
    }, { threshold: 0.05 });
    observer.observe(wrap);
    return () => observer.disconnect();
  }, []);

  return (
    <h2 ref={wrapRef} className={className} style={{ ...style, overflow: "hidden" }}>
      {text.split("").map((ch, i) => (
        <span
          key={i}
          data-c=""
          style={{
            display: "inline-block",
            transform: "translateY(115%)",
            transition: `transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${i * 35}ms`,
          }}
        >
          {ch === " " ? " " : ch}
        </span>
      ))}
    </h2>
  );
}
