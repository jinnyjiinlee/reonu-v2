"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useRef, FormEvent } from "react";
import { useLang } from "@/context/LanguageContext";
import { services, processSteps, partnersRowA, partnersRowB } from "@/data/content";
import { WORKS_DATA, CATEGORY_LABELS } from "@/data/works";
import LocalTime from "@/components/LocalTime";

// First 4 works for the "Selected Work" preview
const SELECTED = WORKS_DATA.slice(0, 4);

// ── Color tokens (matches desktop palette) ──────────────────────────────────
const C = {
  ink:    "#1D1D1F",
  body:   "#6E6E73",
  muted:  "#86868B",
  paper:  "#ffffff",
  panel:  "#F5F5F7",
  border: "#E5E5E7",
};

// ── Shared section heading ───────────────────────────────────────────────────
function SectionLabel({ children }: { children: string }) {
  return (
    <p style={{
      fontSize: 12, fontWeight: 700, letterSpacing: "0.1em",
      color: C.muted, margin: 0, textTransform: "uppercase",
    }}>
      {children}
    </p>
  );
}

// ── Divider ─────────────────────────────────────────────────────────────────
function Divider() {
  return <div style={{ height: 1, background: C.border, margin: "0" }} />;
}

// ── Service accordion item ───────────────────────────────────────────────────
function MobileServiceItem({ svc, lang }: {
  svc: typeof services.bx;
  lang: "ko" | "en";
}) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <Divider />
      <button
        onClick={() => setOpen(p => !p)}
        style={{
          width: "100%", background: "none", border: "none",
          padding: "24px 24px",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          cursor: "pointer",
        }}
      >
        <span style={{ fontSize: "clamp(44px, 14vw, 60px)", fontWeight: 800, letterSpacing: "-0.03em", color: "#000000e6" }}>
          {svc.title}
        </span>
        <span style={{
          fontSize: 24, color: C.muted, lineHeight: 1,
          transform: open ? "rotate(45deg)" : "none",
          transition: "transform 0.2s ease",
          display: "inline-block",
        }}>
          +
        </span>
      </button>
      {open && (
        <div style={{ paddingLeft: 24, paddingRight: 24, paddingBottom: 32 }}>
          <p style={{ fontSize: 16, lineHeight: "170%", color: "#000000b3", marginBottom: 20 }}>
            {svc.desc[lang][0]}<br />{svc.desc[lang][1]}
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {svc.chips.map((chip) => (
              <span key={chip} style={{
                fontSize: 13, fontWeight: 600, color: "#000000e6",
                background: C.panel, borderRadius: 999,
                padding: "6px 14px",
              }}>
                {chip}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Process step ─────────────────────────────────────────────────────────────
function MobileProcessStep({ step, lang }: {
  step: typeof processSteps[number];
  lang: "ko" | "en";
}) {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 16 }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: C.muted, letterSpacing: "0.06em" }}>{step.num}</span>
        <h3 style={{ fontSize: "clamp(40px, 13vw, 56px)", fontWeight: 800, letterSpacing: "-0.03em", margin: 0, color: "#000000e6" }}>{step.title}</h3>
      </div>
      <div style={{ position: "relative", width: "100%", aspectRatio: "16/9", overflow: "hidden", borderRadius: 8, marginBottom: 16, background: C.panel }}>
        <Image src={step.image} alt={step.title} fill style={{ objectFit: "cover" }} sizes="(max-width: 1023px) 90vw, 400px" />
      </div>
      <p style={{ fontSize: 16, lineHeight: "170%", color: "#000000b3", marginBottom: 12 }}>
        {step.desc[lang][0]}<br />{step.desc[lang][1]}
      </p>
      <div style={{ display: "flex", gap: 8 }}>
        {step.tags.map((tag) => (
          <span key={tag} style={{
            fontSize: 12, fontWeight: 500, letterSpacing: "0.04em",
            color: "#b8b8b8", background: C.panel, borderRadius: 999,
            padding: "4px 12px",
          }}>
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

// ── Marquee row ──────────────────────────────────────────────────────────────
function MarqueeRow({ logos, direction = 1 }: {
  logos: typeof partnersRowA;
  direction?: 1 | -1;
}) {
  // Double the logos for seamless loop
  const doubled = [...logos, ...logos];
  return (
    <div style={{ overflow: "hidden", padding: "12px 0" }}>
      <div
        className="marquee-track"
        style={{
          animationDuration: "18s",
          animationDirection: direction === -1 ? "reverse" : "normal",
          gap: 40,
          alignItems: "center",
        }}
      >
        {doubled.map((logo, i) => (
          <div key={`${logo.name}-${i}`} style={{ position: "relative", width: 80, height: 28, flexShrink: 0 }}>
            <Image src={logo.src} alt={logo.name} fill style={{ objectFit: "contain", filter: "grayscale(1)", opacity: 0.6 }} sizes="80px" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Pricing card ─────────────────────────────────────────────────────────────
function MobilePricingCard({ svc, price, lang }: {
  svc: typeof services.bx;
  price: { ko: string; en: string };
  lang: "ko" | "en";
}) {
  const mid = Math.ceil(svc.chips.length / 2);
  return (
    <div style={{ border: `1px solid ${C.border}`, borderRadius: 12, padding: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
        <h3 style={{ fontSize: "clamp(36px, 12vw, 52px)", fontWeight: 800, letterSpacing: "-0.03em", margin: 0, color: "#000000e6" }}>
          {svc.title}
        </h3>
        <span style={{ fontSize: 18, fontWeight: 700, color: C.ink, whiteSpace: "nowrap" }}>
          {price[lang]}
        </span>
      </div>
      <p style={{ fontSize: 15, lineHeight: "170%", color: "#000000b3", marginBottom: 20 }}>
        {svc.desc[lang][0]} {svc.desc[lang][1]}
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {svc.chips.slice(0, mid).map((chip) => (
          <div key={chip} style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
              <circle cx="12" cy="12" r="10.5" stroke={C.ink} strokeWidth="1.7" />
              <path d="M7.5 12.5l3 3 6-6" stroke={C.ink} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span style={{ fontSize: 15, fontWeight: 600, color: "#000000e6" }}>{chip}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Mobile contact form ───────────────────────────────────────────────────────
function MobileContactForm({ lang }: { lang: "ko" | "en" }) {
  const ko = lang === "ko";
  const [name, setName]       = useState("");
  const [company, setCompany] = useState("");
  const [scope, setScope]     = useState("");
  const [content, setContent] = useState("");
  const [budget, setBudget]   = useState("");
  const [email, setEmail]     = useState("");
  const [agree, setAgree]     = useState(false);
  const [status, setStatus]   = useState<"idle"|"sending"|"success"|"error">("idle");
  const [errors, setErrors]   = useState<Record<string, string>>({});

  const inputStyle = {
    width: "100%", background: C.panel, border: `1px solid transparent`,
    borderRadius: 10, padding: "14px 16px",
    fontSize: 16, color: C.ink, outline: "none",
    fontFamily: "inherit", letterSpacing: "-0.01em",
    boxSizing: "border-box" as const,
    transition: "border-color 0.2s ease",
  };
  const labelStyle = {
    fontSize: 13, fontWeight: 600, color: C.muted,
    letterSpacing: "0.01em", display: "block", marginBottom: 6,
  };

  const scopeOptions = ko
    ? ["Brand Design", "Digital Design", "Editorial Design", "기타", "아직 잘 모르겠어요"]
    : ["Brand Design", "Digital Design", "Editorial Design", "Other", "Not sure yet"];
  const budgetOptions = ko
    ? ["- 50만원", "50만원 - 200만원", "200만원 - 500만원", "500만원 +"]
    : ["Under $500", "$500 – $1,500", "$1,500 – $4,000", "$4,000 +"];

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (!name.trim()) next.name = ko ? "이름을 입력해주세요." : "Please enter your name.";
    if (!content.trim()) next.content = ko ? "내용을 입력해주세요." : "Please describe your project.";
    if (!email.trim()) next.email = ko ? "이메일을 입력해주세요." : "Please enter your email.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = ko ? "올바른 이메일을 입력해주세요." : "Please enter a valid email.";
    if (!agree) next.agree = ko ? "개인정보 수집에 동의해주세요." : "Please agree to the terms.";
    if (Object.keys(next).length > 0) { setErrors(next); return; }
    setErrors({});
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, company, scope, content, budget, email, agree }),
      });
      setStatus(res.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div style={{ textAlign: "center", padding: "40px 0" }}>
        <div style={{ fontSize: 40, marginBottom: 16 }}>✓</div>
        <p style={{ fontSize: 18, fontWeight: 700, color: C.ink, marginBottom: 8 }}>
          {ko ? "메시지가 전달되었습니다!" : "Message sent!"}
        </p>
        <p style={{ fontSize: 15, color: C.body }}>
          {ko ? "빠른 시일 내에 답변드리겠습니다." : "We'll get back to you soon."}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Name */}
      <div>
        <label style={labelStyle}>{ko ? "이름 *" : "Name *"}</label>
        <input
          value={name}
          onChange={(e) => { setName(e.target.value); setErrors(p => ({ ...p, name: "" })); }}
          placeholder={ko ? "이름을 입력해주세요" : "Your name"}
          style={{ ...inputStyle, borderColor: errors.name ? "#FF3B30" : "transparent" }}
        />
        {errors.name && <p style={{ fontSize: 12, color: "#FF3B30", marginTop: 4 }}>{errors.name}</p>}
      </div>

      {/* Company */}
      <div>
        <label style={labelStyle}>{ko ? "브랜드 / 회사명" : "Brand / Company"}</label>
        <input
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          placeholder={ko ? "브랜드명 또는 회사명" : "Brand or company name"}
          style={inputStyle}
        />
      </div>

      {/* Service */}
      <div>
        <label style={labelStyle}>{ko ? "의뢰 분야" : "Service"}</label>
        <div style={{ position: "relative" }}>
          <select
            value={scope}
            onChange={(e) => setScope(e.target.value)}
            style={{ ...inputStyle, paddingRight: 40, cursor: "pointer", appearance: "none" as const }}
          >
            <option value="">{ko ? "선택해주세요" : "Select a service"}</option>
            {scopeOptions.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: C.muted }}>
            <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      {/* Message */}
      <div>
        <label style={labelStyle}>{ko ? "프로젝트 내용 *" : "Project Description *"}</label>
        <textarea
          value={content}
          onChange={(e) => { setContent(e.target.value); setErrors(p => ({ ...p, content: "" })); }}
          placeholder={ko ? "프로젝트 내용, 필요한 작업, 참고사항 등을 자유롭게 작성해주세요" : "Describe your project, goals, and any references"}
          rows={5}
          style={{ ...inputStyle, resize: "vertical", borderColor: errors.content ? "#FF3B30" : "transparent" }}
        />
        {errors.content && <p style={{ fontSize: 12, color: "#FF3B30", marginTop: 4 }}>{errors.content}</p>}
      </div>

      {/* Budget */}
      <div>
        <label style={labelStyle}>{ko ? "예산" : "Budget"}</label>
        <div style={{ position: "relative" }}>
          <select
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            style={{ ...inputStyle, paddingRight: 40, cursor: "pointer", appearance: "none" as const }}
          >
            <option value="">{ko ? "예산 범위 선택" : "Select budget range"}</option>
            {budgetOptions.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: C.muted }}>
            <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      {/* Email */}
      <div>
        <label style={labelStyle}>{ko ? "이메일 *" : "Email *"}</label>
        <input
          type="email"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setErrors(p => ({ ...p, email: "" })); }}
          placeholder="your@email.com"
          style={{ ...inputStyle, borderColor: errors.email ? "#FF3B30" : "transparent" }}
        />
        {errors.email && <p style={{ fontSize: 12, color: "#FF3B30", marginTop: 4 }}>{errors.email}</p>}
      </div>

      {/* Agree */}
      <div>
        <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer" }}>
          <input
            type="checkbox"
            checked={agree}
            onChange={(e) => { setAgree(e.target.checked); setErrors(p => ({ ...p, agree: "" })); }}
            style={{ marginTop: 2, width: 16, height: 16, flexShrink: 0, cursor: "pointer", accentColor: C.ink }}
          />
          <span style={{ fontSize: 13, color: C.body, lineHeight: "160%" }}>
            {ko
              ? "개인정보(이름, 이메일, 회사명)는 문의 답변을 위해서만 사용되며, 답변 완료 후 파기됩니다. 동의하십니까? *"
              : "I agree that my personal data (name, email, company) will be used solely to respond to this inquiry and deleted afterward. *"
            }
          </span>
        </label>
        {errors.agree && <p style={{ fontSize: 12, color: "#FF3B30", marginTop: 4 }}>{errors.agree}</p>}
      </div>

      <button
        type="submit"
        disabled={status === "sending"}
        style={{
          width: "100%",
          background: C.ink, color: "#fff",
          border: "none", borderRadius: 999,
          padding: "20px 24px 20px 28px",
          fontSize: 17, fontWeight: 600,
          letterSpacing: "-0.01em",
          cursor: status === "sending" ? "not-allowed" : "pointer",
          opacity: status === "sending" ? 0.7 : 1,
          transition: "opacity 0.2s ease",
          marginTop: 16,
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}
      >
        <span>{status === "sending" ? (ko ? "전송 중..." : "Sending...") : (ko ? "메시지 보내기" : "Send Message")}</span>
        {status !== "sending" && (
          <svg width="18" height="18" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M3 8h10M8 3l5 5-5 5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>

      {status === "error" && (
        <p style={{ fontSize: 14, color: "#FF3B30", textAlign: "center" }}>
          {ko ? "전송에 실패했습니다. 다시 시도해주세요." : "Something went wrong. Please try again."}
        </p>
      )}
    </form>
  );
}

// ── Mobile footer ─────────────────────────────────────────────────────────────
function MobileFooter({ lang }: { lang: "ko" | "en" }) {
  return (
    <footer style={{ background: C.ink, color: "#ffffff", padding: "56px 24px 40px" }}>
      {/* Large email */}
      <a
        href="mailto:reonustudio@gmail.com"
        style={{
          display: "block",
          fontSize: "clamp(18px, 5vw, 28px)",
          fontWeight: 700,
          letterSpacing: "-0.02em",
          color: "#ffffff",
          textDecoration: "none",
          marginBottom: 48,
          wordBreak: "break-all",
        }}
      >
        reonustudio@gmail.com
      </a>

      {/* Nav links */}
      <nav style={{ display: "flex", gap: 24, marginBottom: 48, flexWrap: "wrap" }}>
        {[
          { label: "WORKS",   href: "/works"   },
          { label: "STUDIO",  href: "/studio"  },
          { label: "CONTACT", href: "/contact" },
        ].map(({ label, href }) => (
          <a
            key={label}
            href={href}
            style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.5)", textDecoration: "none", letterSpacing: "0.06em" }}
          >
            {label}
          </a>
        ))}
      </nav>

      <Divider />

      <div style={{ marginTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 13, fontWeight: 800, letterSpacing: 0, color: "#ffffff" }}>REONU®</span>
        <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>
          © {new Date().getFullYear()} REONU Studio
        </span>
      </div>
    </footer>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────
export default function MobileHome() {
  const { lang } = useLang();
  const ko = lang === "ko";

  const svcList = [services.bx, services.uxui, services.edit];
  const prices  = [
    { ko: "₩490,000~", en: "$370~" },
    { ko: "₩790,000~", en: "$600~" },
    { ko: "₩250,000~", en: "$190~" },
  ];

  return (
    <div className="lg:hidden font-headline" style={{ background: C.paper, color: C.ink }}>

      {/* ── Hero Section ──────────────────────────────────────────────────── */}
      {/* paddingTop clears the fixed REONU overlay: header(64) + gap(48) + font + gap(32).
          paddingLeft matches the overlay left: max(3.125vw, calc(50vw - 900px)) so REONU,
          TURN U BRAND ON, and the description text share the same left edge.
          No minHeight — the large REONU overlay fills visual space; the text content
          sits naturally below it without an artificial 100dvh gap. */}
      <section style={{
        paddingTop: "calc(54px + 48px + clamp(64px, 20vw, 100px) + 32px)",
        paddingBottom: "64px",
        paddingLeft: "24px",
        paddingRight: "24px",
        display: "flex", flexDirection: "column", gap: "48px",
      }}>
        <div>
          {/* REONU® heading removed — MobileIntroAnimation renders it as a fixed
              overlay that scrolls/fades into the header, matching the desktop
              IntroAnimation behavior. */}
          <p style={{
            fontSize: "clamp(16px, 4.2vw, 20px)",
            lineHeight: "170%", color: "#000000e6", fontWeight: 500,
            maxWidth: "90%",
          }}>
            {ko ? (
              <>브랜드 안에 이미 담겨 있는 가치를 발견하고,<br />그것을 선명하고 확장 가능한 디자인으로 구현합니다.</>
            ) : (
              <>We uncover the value already embedded in a brand<br />and realize it as sharp, scalable design.</>
            )}
          </p>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 13, fontWeight: 600, letterSpacing: "0.05em", color: "#b0b0b0" }}>
            Global Design Studio
          </span>
          <LocalTime fontSize={13} color="#b0b0b0" fontWeight={600} letterSpacing="0.05em" />
        </div>
      </section>

      {/* ── Selected Work ─────────────────────────────────────────────────── */}
      <section style={{ padding: "80px 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
          <SectionLabel>Selected Work</SectionLabel>
          <Link href="/works" style={{
            fontSize: 13, fontWeight: 700, color: C.ink,
            textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 7,
            border: `1.5px solid ${C.ink}`,
            borderRadius: 999,
            padding: "8px 16px",
            letterSpacing: "-0.01em",
          }}>
            {ko ? "전체 보기" : "View All"}
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 8h10M8 3l5 5-5 5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {SELECTED.map((work) => (
            <Link key={work.id} href={`/works/${work.id}`} style={{ textDecoration: "none", display: "block" }}>
              <div style={{
                position: "relative", width: "100%", aspectRatio: "4/5",
                overflow: "hidden", borderRadius: 8, background: C.panel,
              }}>
                <Image
                  src={work.image} alt={work.title[lang]} fill
                  style={{ objectFit: "cover" }}
                  sizes="(max-width: 1023px) 45vw, 400px"
                />
              </div>
              <div style={{ marginTop: 10 }}>
                <p style={{
                  fontSize: 13, fontWeight: 700, color: C.ink,
                  margin: "0 0 4px", letterSpacing: "-0.02em", lineHeight: "130%",
                  overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                }}>
                  {work.title[lang]}
                </p>
                <p style={{
                  fontSize: 10, fontWeight: 700, letterSpacing: "0.07em",
                  color: C.muted, textTransform: "uppercase", margin: 0,
                }}>
                  {CATEGORY_LABELS[work.category]}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Our Services ──────────────────────────────────────────────────── */}
      <section style={{ paddingTop: 80, paddingBottom: 80 }}>
        <div style={{ paddingLeft: 24, paddingRight: 24, marginBottom: 32 }}>
          <SectionLabel>Our Services</SectionLabel>
        </div>
        {svcList.map((svc) => (
          <MobileServiceItem key={svc.title} svc={svc} lang={lang} />
        ))}
        <Divider />
      </section>

      {/* ── Our Process ───────────────────────────────────────────────────── */}
      <section style={{ padding: "80px 24px" }}>
        <SectionLabel>Our Process</SectionLabel>
        <div style={{ marginTop: 48, display: "flex", flexDirection: "column", gap: 64 }}>
          {processSteps.map((step) => (
            <MobileProcessStep key={step.num} step={step} lang={lang} />
          ))}
        </div>
      </section>

      {/* ── Partners ──────────────────────────────────────────────────────── */}
      <section style={{ paddingTop: 80, paddingBottom: 80 }}>
        <div style={{ paddingLeft: 24, marginBottom: 40 }}>
          <SectionLabel>Our Partners</SectionLabel>
        </div>
        <MarqueeRow logos={partnersRowA} direction={1} />
        <MarqueeRow logos={partnersRowB} direction={-1} />
      </section>

      {/* ── Pricing ───────────────────────────────────────────────────────── */}
      <section style={{ padding: "80px 24px", background: C.panel }}>
        <SectionLabel>Pricing</SectionLabel>
        <h2 style={{
          fontSize: "clamp(64px, 20vw, 88px)", fontWeight: 800,
          letterSpacing: "-0.05em", lineHeight: 1.05,
          margin: "20px 0 48px", color: "#000000",
          whiteSpace: "pre-line",
        }}>
          {ko ? "서비스를\n시작해보세요." : "Start your\nproject today."}
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {svcList.map((svc, i) => (
            <MobilePricingCard key={svc.title} svc={svc} price={prices[i]} lang={lang} />
          ))}
        </div>

        <Link href="/contact" style={{
          display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 48,
          width: "100%",
          background: C.ink, color: "#fff",
          padding: "20px 24px 20px 28px", borderRadius: 999,
          fontSize: 17, fontWeight: 600, letterSpacing: "-0.01em",
          textDecoration: "none", boxSizing: "border-box",
        }}>
          {ko ? "프로젝트 시작하기" : "Start a Project"}
          <svg width="18" height="18" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M3 8h10M8 3l5 5-5 5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </section>

      {/* ── Let's Talk Form ───────────────────────────────────────────────── */}
      <section style={{ padding: "80px 24px" }}>
        <h2 style={{
          fontSize: "clamp(64px, 20vw, 88px)", fontWeight: 800,
          letterSpacing: "-0.05em", lineHeight: 1.05, marginBottom: 16, color: "#000000",
        }}>
          Let&apos;s Talk
        </h2>
        <p style={{ fontSize: 16, color: "#000000b3", marginBottom: 40, lineHeight: "170%" }}>
          {ko
            ? "아이디어, 목표, 혹은 해결하고 싶은 과제가 있으신가요?"
            : "Have an idea, a goal, or a challenge to solve?"
          }
        </p>
        <MobileContactForm lang={lang} />
      </section>

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <MobileFooter lang={lang} />
    </div>
  );
}
