"use client";

import { useState, FormEvent } from "react";
import { useLang } from "@/context/LanguageContext";

const C = {
  ink:    "#1D1D1F",
  body:   "#6E6E73",
  muted:  "#86868B",
  paper:  "#ffffff",
  panel:  "#F5F5F7",
  border: "#E5E5E7",
};

function Divider() {
  return <div style={{ height: 1, background: C.border }} />;
}

const FAQS = {
  ko: [
    { q: "작업 과정은 어떻게 되나요?", a: ["의뢰 접수 후 간단한 미팅을 통해 목표와 방향을 논의합니다.", "제안서 및 일정을 공유하고, 디자인 제작과 최종 결과물 전달 순으로 진행됩니다."] },
    { q: "작업 기간은 얼마나 걸리나요?", a: ["프로젝트 규모와 범위에 따라 2주에서 8주 사이입니다.", "정확한 일정은 첫 미팅 후 함께 조율하며, 중간 일정도 투명하게 공유됩니다."] },
    { q: "예산이 아직 정해지지 않았어도 문의할 수 있나요?", a: ["예산이 확정되지 않은 상태로도 편하게 문의해 주세요.", "상담을 통해 목표와 상황에 맞는 방향을 함께 찾아드립니다."] },
    { q: "범위 외 추가 요청이 생기면 어떻게 되나요?", a: ["초기 범위에 포함되지 않은 추가 작업은 사전에 안내 후 동의를 받고 진행합니다.", "처음부터 명확한 범위 합의를 우선으로 하여 불필요한 추가 비용을 최소화합니다."] },
  ],
  en: [
    { q: "What does the process look like?", a: ["After receiving your inquiry, we schedule a brief discovery meeting to align on goals and direction.", "From there, we share a proposal and timeline, proceed with design, and deliver the final work."] },
    { q: "How long does a project typically take?", a: ["Typically 2 to 8 weeks depending on scope and complexity.", "We'll align on a specific timeline after our initial meeting, and keep you updated at every key stage."] },
    { q: "Can I reach out if I don't have a set budget?", a: ["Absolutely — feel free to reach out even without a fixed budget.", "Through consultation, we'll work together to find the right direction for your goals and situation."] },
    { q: "What happens if additional requests come up mid-project?", a: ["Any work outside the initial scope is reviewed, communicated in advance, and only proceeds with your approval.", "We prioritize clear scope alignment from the start to minimize unexpected additional costs."] },
  ],
};

function FAQItem({ q, a, open, onToggle }: { q: string; a: string[]; open: boolean; onToggle: () => void }) {
  return (
    <div>
      <Divider />
      <button
        onClick={onToggle}
        style={{
          width: "100%", background: "none", border: "none",
          padding: "24px 0", cursor: "pointer",
          display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16,
          textAlign: "left",
        }}
      >
        <span style={{ fontSize: 16, fontWeight: 600, color: C.ink, letterSpacing: "-0.01em", lineHeight: "150%", fontFamily: "inherit" }}>
          {q}
        </span>
        <span style={{ fontSize: 20, color: C.muted, flexShrink: 0, transform: open ? "rotate(45deg)" : "none", transition: "transform 0.2s ease", display: "inline-block" }}>
          +
        </span>
      </button>
      {open && (
        <div style={{ paddingBottom: 24 }}>
          {a.map((line, i) => (
            <p key={i} style={{ fontSize: 15, color: "#000000b3", lineHeight: "170%", margin: 0 }}>
              {line}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

function ContactForm({ lang }: { lang: "ko" | "en" }) {
  const ko = lang === "ko";
  const [name, setName]       = useState("");
  const [company, setCompany] = useState("");
  const [scope, setScope]     = useState("");
  const [content, setContent] = useState("");
  const [budget, setBudget]   = useState("");
  const [timing, setTiming]   = useState("");
  const [email, setEmail]     = useState("");
  const [agree, setAgree]     = useState(false);
  const [status, setStatus]   = useState<"idle"|"sending"|"success"|"error">("idle");
  const [errors, setErrors]   = useState<Record<string, string>>({});

  const inputStyle = {
    width: "100%", background: C.panel, border: `1.5px solid transparent`,
    borderRadius: 10, padding: "14px 16px",
    fontSize: 16, color: C.ink, outline: "none",
    fontFamily: "inherit", letterSpacing: "-0.01em",
    boxSizing: "border-box" as const,
    transition: "border-color 0.2s ease",
  };
  const labelStyle = { fontSize: 13, fontWeight: 600, color: C.muted, letterSpacing: "0.01em", display: "block", marginBottom: 6 };

  const scopeOpts = ko ? ["Brand Design", "Digital Design", "Editorial Design", "기타", "아직 잘 모르겠어요"] : ["Brand Design", "Digital Design", "Editorial Design", "Other", "Not sure yet"];
  const budgetOpts = ko ? ["- 50만원", "50만원 - 200만원", "200만원 - 500만원", "500만원 +"] : ["Under $500", "$500 – $1,500", "$1,500 – $4,000", "$4,000 +"];
  const timingOpts = ko ? ["가능한 한 빠르게", "2주 이내", "3 - 4주 이내", "1 - 2개월 이내", "일정 협의 가능"] : ["As soon as possible", "Within 2 weeks", "Within 3 – 4 weeks", "Within 1 – 2 months", "Flexible / Open to discuss"];

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (!name.trim())    next.name    = ko ? "이름을 입력해주세요." : "Please enter your name.";
    if (!content.trim()) next.content = ko ? "내용을 입력해주세요." : "Please describe your project.";
    if (!email.trim())   next.email   = ko ? "이메일을 입력해주세요." : "Please enter your email.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = ko ? "올바른 이메일 형식이 아닙니다." : "Please enter a valid email.";
    if (!agree)          next.agree   = ko ? "동의가 필요합니다." : "Please agree to the terms.";
    if (Object.keys(next).length) { setErrors(next); return; }
    setErrors({});
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, company, scope, content, budget, timing, email, agree }) });
      setStatus(res.ok ? "success" : "error");
    } catch { setStatus("error"); }
  }

  if (status === "success") {
    return (
      <div style={{ textAlign: "center", padding: "40px 0" }}>
        <div style={{ fontSize: 40, marginBottom: 16 }}>✓</div>
        <p style={{ fontSize: 18, fontWeight: 700, color: C.ink, marginBottom: 8 }}>{ko ? "메시지가 전달되었습니다!" : "Message sent!"}</p>
        <p style={{ fontSize: 15, color: C.body }}>{ko ? "빠른 시일 내에 답변드리겠습니다." : "We'll get back to you soon."}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {/* Name */}
      <div>
        <label style={labelStyle}>{ko ? "이름 *" : "Name *"}</label>
        <input value={name} onChange={e => { setName(e.target.value); setErrors(p => ({...p, name: ""})); }} placeholder={ko ? "이름을 입력해주세요" : "Your name"} style={{ ...inputStyle, borderColor: errors.name ? "#FF3B30" : "transparent" }} />
        {errors.name && <p style={{ fontSize: 12, color: "#FF3B30", marginTop: 4 }}>{errors.name}</p>}
      </div>
      {/* Company */}
      <div>
        <label style={labelStyle}>{ko ? "브랜드 / 회사명" : "Brand / Company"}</label>
        <input value={company} onChange={e => setCompany(e.target.value)} placeholder={ko ? "브랜드명 또는 회사명" : "Brand or company name"} style={inputStyle} />
      </div>
      {/* Service */}
      <div>
        <label style={labelStyle}>{ko ? "의뢰 분야" : "Service"}</label>
        <div style={{ position: "relative" }}>
          <select value={scope} onChange={e => setScope(e.target.value)} style={{ ...inputStyle, paddingRight: 40, cursor: "pointer", appearance: "none" as const }}>
            <option value="">{ko ? "선택해주세요" : "Select a service"}</option>
            {scopeOpts.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "#86868B" }}>
            <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
      {/* Message */}
      <div>
        <label style={labelStyle}>{ko ? "프로젝트 내용 *" : "Project Description *"}</label>
        <textarea value={content} onChange={e => { setContent(e.target.value); setErrors(p => ({...p, content: ""})); }} placeholder={ko ? "프로젝트 내용, 필요한 작업, 참고사항 등을 자유롭게 작성해주세요" : "Describe your project, the work needed, and any references"} rows={5} style={{ ...inputStyle, resize: "vertical", borderColor: errors.content ? "#FF3B30" : "transparent" }} />
        {errors.content && <p style={{ fontSize: 12, color: "#FF3B30", marginTop: 4 }}>{errors.content}</p>}
      </div>
      {/* Budget */}
      <div>
        <label style={labelStyle}>{ko ? "예산" : "Budget"}</label>
        <div style={{ position: "relative" }}>
          <select value={budget} onChange={e => setBudget(e.target.value)} style={{ ...inputStyle, paddingRight: 40, cursor: "pointer", appearance: "none" as const }}>
            <option value="">{ko ? "예산 범위 선택" : "Select budget range"}</option>
            {budgetOpts.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "#86868B" }}>
            <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
      {/* Timing */}
      <div>
        <label style={labelStyle}>{ko ? "희망 시기" : "Preferred Timing"}</label>
        <div style={{ position: "relative" }}>
          <select value={timing} onChange={e => setTiming(e.target.value)} style={{ ...inputStyle, paddingRight: 40, cursor: "pointer", appearance: "none" as const }}>
            <option value="">{ko ? "시작 시기 선택" : "Select preferred timing"}</option>
            {timingOpts.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "#86868B" }}>
            <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
      {/* Email */}
      <div>
        <label style={labelStyle}>{ko ? "이메일 *" : "Email *"}</label>
        <input type="email" value={email} onChange={e => { setEmail(e.target.value); setErrors(p => ({...p, email: ""})); }} placeholder="your@email.com" style={{ ...inputStyle, borderColor: errors.email ? "#FF3B30" : "transparent" }} />
        {errors.email && <p style={{ fontSize: 12, color: "#FF3B30", marginTop: 4 }}>{errors.email}</p>}
      </div>
      {/* Agree */}
      <div>
        <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer" }}>
          <input type="checkbox" checked={agree} onChange={e => { setAgree(e.target.checked); setErrors(p => ({...p, agree: ""})); }} style={{ marginTop: 3, width: 16, height: 16, flexShrink: 0, cursor: "pointer", accentColor: C.ink }} />
          <span style={{ fontSize: 13, color: C.body, lineHeight: "160%" }}>
            {ko ? "개인정보(이름, 이메일, 회사명)는 문의 답변을 위해서만 사용되며, 답변 완료 후 파기됩니다. 동의하십니까? *" : "I agree that my personal data (name, email, company) will be used solely to respond to this inquiry and deleted afterward. *"}
          </span>
        </label>
        {errors.agree && <p style={{ fontSize: 12, color: "#FF3B30", marginTop: 4 }}>{errors.agree}</p>}
      </div>
      <button type="submit" disabled={status === "sending"} style={{ width: "100%", background: C.ink, color: "#fff", border: "none", borderRadius: 10, padding: "18px", fontSize: 16, fontWeight: 700, letterSpacing: "-0.01em", cursor: status === "sending" ? "not-allowed" : "pointer", opacity: status === "sending" ? 0.7 : 1, marginTop: 8 }}>
        {status === "sending" ? (ko ? "전송 중..." : "Sending...") : (ko ? "메시지 보내기" : "Send Message")}
      </button>
      {status === "error" && <p style={{ fontSize: 14, color: "#FF3B30", textAlign: "center" }}>{ko ? "전송에 실패했습니다. 다시 시도해주세요." : "Something went wrong. Please try again."}</p>}
    </form>
  );
}

function MobileFooter() {
  return (
    <footer style={{ background: C.ink, color: "#ffffff", padding: "56px 24px 40px" }}>
      <a href="mailto:reonustudio@gmail.com" style={{ display: "block", fontSize: "clamp(18px, 5vw, 28px)", fontWeight: 700, letterSpacing: "-0.02em", color: "#ffffff", textDecoration: "none", marginBottom: 48, wordBreak: "break-all" }}>reonustudio@gmail.com</a>
      <nav style={{ display: "flex", gap: 24, marginBottom: 48, flexWrap: "wrap" }}>
        {[{ label: "WORKS", href: "/works" }, { label: "STUDIO", href: "/studio" }, { label: "CONTACT", href: "/contact" }].map(({ label, href }) => (
          <a key={label} href={href} style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.5)", textDecoration: "none", letterSpacing: "0.06em" }}>{label}</a>
        ))}
      </nav>
      <div style={{ height: 1, background: "rgba(255,255,255,0.12)", marginBottom: 24 }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 13, fontWeight: 800, color: "#ffffff" }}>REONU®</span>
        <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>© {new Date().getFullYear()} REONU Studio</span>
      </div>
    </footer>
  );
}

export default function MobileContact() {
  const { lang } = useLang();
  const ko = lang === "ko";
  const faqs = ko ? FAQS.ko : FAQS.en;
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="lg:hidden font-headline" style={{ background: C.paper, color: C.ink }}>

      {/* ── Hero image ────────────────────────────────────────────────────── */}
      <div style={{ paddingTop: 64 }}>
        <div style={{ position: "relative", width: "100%", aspectRatio: "16/10", overflow: "hidden", background: C.panel }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/studio/contact-bg.jpg" alt="REONU Studio" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", display: "block" }} />
        </div>
      </div>

      {/* ── Let's Talk Form ───────────────────────────────────────────────── */}
      <section style={{ padding: "80px 24px" }}>
        <h1 style={{ fontSize: "clamp(40px, 12vw, 64px)", fontWeight: 800, letterSpacing: "-0.05em", lineHeight: 1, marginBottom: 16, color: C.ink }}>
          Let&apos;s Talk
        </h1>
        <p style={{ fontSize: 16, color: "#000000b3", marginBottom: 40, lineHeight: "170%", whiteSpace: "pre-line" }}>
          {ko ? "아이디어, 목표, 혹은 해결하고 싶은 과제가 있으신가요?\n함께 특별한 결과물을 만들어가겠습니다." : "Have an idea, a goal, or a challenge to solve?\nLet's create something remarkable together."}
        </p>
        <ContactForm lang={lang} />
      </section>

      {/* ── FAQs ──────────────────────────────────────────────────────────── */}
      <section style={{ padding: "0 24px 80px" }}>
        <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", color: C.muted, margin: "0 0 32px", textTransform: "uppercase" }}>FAQ</p>
        {faqs.map((faq, i) => (
          <FAQItem key={i} q={faq.q} a={faq.a} open={openFaq === i} onToggle={() => setOpenFaq(openFaq === i ? null : i)} />
        ))}
        <Divider />
      </section>

      <MobileFooter />
    </div>
  );
}
