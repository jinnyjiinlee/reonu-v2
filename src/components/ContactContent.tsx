"use client";

import { useState, useRef, useEffect } from "react";
import type { FormEvent } from "react";
import { useLang } from "@/context/LanguageContext";
import SplitTextReveal from "@/components/SplitTextReveal";
import { StartProjectBtn } from "@/components/Pricing";

// ─── Layout constants (1920px canvas) ────────────────────────────────────────
const PAD       = 60;
const R_X       = 880;   // right column start
const R_RPAD    = 60;    // right column right padding

// Section 0 — Studio card (below REONU hero text)
// REONU fixed text: top=200px, height≈236px real px → ends at 436px real
// → 436/0.7875 ≈ 554 canvas px. Image starts at 640 (86px gap).
const CARD_Y    = 754;
const CARD_H    = 888;   // Möbius ref: 699px screen ÷ 0.7875 ≈ 888 canvas px

// Section 1 — Let's Talk form (after image + 200 gap)
const S1_Y      = CARD_Y + CARD_H + 200; // 1728

// Section 2 — FAQs (200 canvas px gap below form end)
const FAQ_Y     = S1_Y + 1187 + 200; // 3115

export const CONTACT_CANVAS_H = FAQ_Y + 490 + 160; // 3765

// ─── Shared button ────────────────────────────────────────────────────────────
const BTN_EASE = "cubic-bezier(0.4, 0, 0.2, 1)";
const BTN_DUR  = "0.5s";
const PILL_H   = 61;
const CIRCLE   = 46;

const ArrowSVG = ({ color = "#ffffff", size = 16 }: { color?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true" style={{ display: "block", flexShrink: 0 }}>
    <line x1="2" y1="8" x2="13" y2="8" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    <line x1="8" y1="3" x2="13" y2="8" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    <line x1="8" y1="13" x2="13" y2="8" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

function SendMessageBtn({ disabled, loading = false, label = "Send Message" }: { disabled: boolean; loading?: boolean; label?: string }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      type="submit"
      aria-disabled={disabled}
      data-cursor="hidden"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 20,
        height: PILL_H,
        minWidth: 200,
        paddingLeft: 23,
        paddingRight: 20,
        overflow: "hidden",
        position: "relative",
        background: "transparent",
        border: "none",
        cursor: disabled ? "not-allowed" : "pointer",
        pointerEvents: loading ? "none" : "auto",
        opacity: loading ? 0.7 : 1,
        transition: `opacity 0.2s ${BTN_EASE}`,
      }}
    >
      <span style={{
        position: "absolute",
        top: hov ? (PILL_H - CIRCLE) / 2 : 0,
        right: hov ? 10 : 0,
        height: hov ? CIRCLE : PILL_H,
        width: hov ? CIRCLE : "100%",
        borderRadius: 999,
        background: "#1D1D1F",
        transition: `width ${BTN_DUR} ${BTN_EASE}, height ${BTN_DUR} ${BTN_EASE}, top ${BTN_DUR} ${BTN_EASE}, right ${BTN_DUR} ${BTN_EASE}`,
        zIndex: 0,
      }} />
      <span className="font-headline text-[25px] leading-[32px] font-medium tracking-normal" style={{ whiteSpace: "nowrap", position: "relative", zIndex: 2, color: hov ? "#000000e6" : "#ffffff", transition: `color ${BTN_DUR} ${BTN_EASE}` }}>
        {label}
      </span>
      <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", position: "relative", zIndex: 2, flexShrink: 0 }}>
        <ArrowSVG color="#ffffff" size={hov ? 26 : 20} />
      </span>
    </button>
  );
}

// ─── Form input styles ────────────────────────────────────────────────────────
const INPUT_PILL  = "relative bg-[#f5f5f5] rounded-none flex items-center font-headline text-[20px] leading-[28px] font-medium tracking-[-0.005em] border-b-[1.5px] border-transparent focus-within:border-[#1D1D1F] transition-colors";
const ROW_GAP     = 6;
const PLAIN_LABEL = "flex items-center font-headline text-[20px] leading-[28px] font-medium tracking-[-0.005em]";
const PLAIN_LABEL_STYLE = { color: "#000000e6" } as const;

function ChevronDown({ open = false, hasValue = false }: { open?: boolean; hasValue?: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, transition: "transform 0.2s ease", transform: open ? "rotate(180deg)" : "rotate(0deg)" }}>
      <path d="M6 9.5 12 15.5 18 9.5" stroke={hasValue ? "#000000e6" : "#00000099"} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CustomSelect({ value, onChange, options, placeholder, width }: {
  value: string; onChange: (val: string) => void; options: string[]; placeholder: string; width: number;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onMouse = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onMouse);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onMouse); document.removeEventListener("keydown", onKey); };
  }, [open]);

  return (
    <div ref={ref} style={{ position: "relative", width, height: 68, flexShrink: 0 }}>
      <div className={INPUT_PILL} style={{ width, height: 68, paddingInline: 18, cursor: "pointer" }} onClick={() => setOpen(p => !p)}>
        <span style={{ flex: 1, color: value ? "#000000e6" : "#00000099", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{value || placeholder}</span>
        <ChevronDown open={open} hasValue={!!value} />
      </div>
      {open && (
        <div style={{ position: "absolute", top: 72, left: 0, width, background: "#ffffff", border: "1px solid #E5E5E7", borderRadius: 10, boxShadow: "0 8px 32px rgba(0,0,0,0.09)", zIndex: 200, overflow: "hidden" }}>
          {options.map(opt => (
            <div key={opt} onClick={() => { onChange(opt); setOpen(false); }}
              className="font-headline text-[20px] leading-[28px] font-medium tracking-[-0.005em]"
              style={{ padding: "11px 18px", cursor: "pointer", color: opt === value ? "#1D1D1F" : "#333336", background: opt === value ? "#F5F5F7" : "transparent", transition: "background 0.12s ease" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#F5F5F7"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = opt === value ? "#F5F5F7" : "transparent"; }}
            >{opt.endsWith(" DESIGN") ? (
                <><span style={{ fontWeight: 700 }}>{opt.replace(" DESIGN", "")}</span>{" DESIGN"}</>
              ) : opt}</div>
          ))}
        </div>
      )}
    </div>
  );
}

function CheckMark({ color = "#1D1D1F", size = 14 }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none">
      <path d="M3 7.5 6 10.5 11 4.5" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ─── Field error bubble ───────────────────────────────────────────────────────
function FieldError({ message, style, tailLeft = 18, maxWidth }: {
  message?: string; style: React.CSSProperties; tailLeft?: number; maxWidth?: number;
}) {
  if (!message) return null;
  const bubbleBg = "rgba(255,255,255,0.55)";
  const bubbleBorder = "1px solid rgba(255,255,255,0.6)";
  return (
    <div key={message} className="absolute" style={{ zIndex: 30, ...style }}>
      <div className="relative">
        <div className="absolute rotate-45" style={{ top: -4, left: tailLeft, width: 10, height: 10, background: bubbleBg, border: bubbleBorder, borderBottom: "none", borderRight: "none", backdropFilter: "blur(16px) saturate(180%)", WebkitBackdropFilter: "blur(16px) saturate(180%)", borderRadius: 2 }} />
        <div className="relative flex items-center gap-[8px] rounded-[12px] font-headline text-[16px] leading-[22px] font-medium tracking-[-0.005em] text-[#1D1D1F] shadow-[0_8px_32px_rgba(0,0,0,0.10)]" style={{ background: bubbleBg, border: bubbleBorder, backdropFilter: "blur(16px) saturate(180%)", WebkitBackdropFilter: "blur(16px) saturate(180%)", padding: "10px 14px", whiteSpace: maxWidth ? "normal" : "nowrap", maxWidth }}>
          <span className="flex items-center justify-center rounded-full text-[10px] font-bold leading-none text-white" style={{ width: 16, height: 16, background: "#FF3B30", flexShrink: 0 }}>!</span>
          {message}
        </div>
      </div>
    </div>
  );
}

// ─── Submit notice ────────────────────────────────────────────────────────────
function SubmitNotice({ status, ko, onClose }: { status: "idle" | "sending" | "success" | "error"; ko: boolean; onClose: () => void }) {
  useEffect(() => {
    if (status === "success" || status === "error") {
      const t = setTimeout(onClose, 8000);
      return () => clearTimeout(t);
    }
  }, [status, onClose]);

  if (status !== "success" && status !== "error") return null;

  const isSuccess = status === "success";
  const bubbleBg = "rgba(255,255,255,0.55)";
  const bubbleBorder = "1px solid rgba(255,255,255,0.6)";

  return (
    <div key={status} className="flex items-center gap-[10px] rounded-[12px] font-headline text-[18px] leading-[26px] font-medium tracking-[-0.005em] text-[#1D1D1F] shadow-[0_8px_32px_rgba(0,0,0,0.10)]"
      style={{ marginTop: 16, padding: "14px 18px", background: bubbleBg, border: bubbleBorder, backdropFilter: "blur(16px) saturate(180%)", WebkitBackdropFilter: "blur(16px) saturate(180%)", display: "inline-flex", width: "fit-content" }}>
      <span className="flex items-center justify-center rounded-full font-bold leading-none text-white" style={{ width: 20, height: 20, background: isSuccess ? "#34C759" : "#FF3B30", flexShrink: 0 }}>
        {isSuccess ? <CheckMark color="#fff" /> : "!"}
      </span>
      {isSuccess
        ? ko ? "메시지가 성공적으로 전달되었습니다. 빠른 시일 내에 답변드리겠습니다." : "Your message has been sent. We'll get back to you soon."
        : ko ? "전송에 실패했습니다. 잠시 후 다시 시도해주세요." : "Something went wrong. Please try again."}
      <button type="button" onClick={onClose} data-cursor="hidden" className="ml-[4px] flex items-center justify-center text-[20px] leading-none text-[#1D1D1F]/40 transition-colors hover:text-[#1D1D1F]" style={{ width: 20, height: 20 }} aria-label={ko ? "닫기" : "Close"}>×</button>
    </div>
  );
}

// ─── FAQ data ─────────────────────────────────────────────────────────────────
const FAQS = {
  ko: [
    { q: "작업 과정은 어떻게 되나요?", a: [
      "의뢰 접수 후 간단한 미팅을 통해 목표와 방향을 논의합니다.",
      "제안서 및 일정을 공유하고, 디자인 제작과 최종 결과물 전달 순으로 진행됩니다.",
    ]},
    { q: "작업 기간은 얼마나 걸리나요?", a: [
      "프로젝트 규모와 범위에 따라 2주에서 8주 사이입니다.",
      "정확한 일정은 첫 미팅 후 함께 조율하며, 중간 일정도 투명하게 공유됩니다.",
    ]},
    { q: "예산이 아직 정해지지 않았어도 문의할 수 있나요?", a: [
      "예산이 확정되지 않은 상태로도 편하게 문의해 주세요.",
      "상담을 통해 목표와 상황에 맞는 방향을 함께 찾아드립니다.",
    ]},
    { q: "범위 외 추가 요청이 생기면 어떻게 되나요?", a: [
      "초기 범위에 포함되지 않은 추가 작업은 사전에 안내 후 동의를 받고 진행합니다.",
      "처음부터 명확한 범위 합의를 우선으로 하여 불필요한 추가 비용을 최소화합니다.",
    ]},
  ],
  en: [
    { q: "What does the process look like?", a: [
      "After receiving your inquiry, we schedule a brief discovery meeting to align on goals and direction.",
      "From there, we share a proposal and timeline, proceed with design, and deliver the final work.",
    ]},
    { q: "How long does a project typically take?", a: [
      "Typically 2 to 8 weeks depending on scope and complexity.",
      "We'll align on a specific timeline after our initial meeting, and keep you updated at every key stage.",
    ]},
    { q: "Can I reach out if I don't have a set budget?", a: [
      "Absolutely — feel free to reach out even without a fixed budget.",
      "Through consultation, we'll work together to find the right direction for your goals and situation.",
    ]},
    { q: "What happens if additional requests come up mid-project?", a: [
      "Any work outside the initial scope is reviewed, communicated in advance,",
      "and only proceeds with your approval. We prioritize clear scope alignment from",
      "the start to minimize unexpected additional costs.",
    ]},
  ],
};

function FAQItem({ q, a, open, onToggle }: { q: string; a: string[]; open: boolean; onToggle: () => void }) {
  return (
    <div style={{ display: "flex" }}
      onClick={onToggle}
    >
      {/* Content column */}
      <div style={{ flex: 1, padding: "28px 0 28px 0", cursor: "pointer" }}>
        <span className="font-headline text-[22px] leading-[32px] font-medium tracking-[-0.02em]" style={{ color: "#000000e6", display: "block" }}>{q}</span>
        <div style={{ overflow: "hidden", maxHeight: open ? "400px" : 0, transition: "max-height 0.4s cubic-bezier(0.16,1,0.3,1), opacity 0.3s ease", opacity: open ? 1 : 0 }}>
          <ul style={{ marginTop: 40, marginBottom: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
            {a.map((item, i) => (
              <li key={i} className="font-headline text-[20px] leading-[32px] font-normal tracking-[-0.005em]" style={{ color: "#000000b3" }}>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Icon column — right side */}
      <div style={{ flexShrink: 0, width: 60, padding: "28px 0 28px 20px", display: "flex", alignItems: "flex-start", justifyContent: "flex-end", cursor: "pointer" }}>
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, transition: "transform 0.3s ease", transform: open ? "rotate(45deg)" : "rotate(0deg)" }}>
          <path d="M12 5v14M5 12h14" stroke="#000000e6" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </div>
    </div>
  );
}


// ─── Main component ───────────────────────────────────────────────────────────
export default function ContactContent() {
  const { lang } = useLang();
  const ko = lang === "ko";

  // Form state
  const [name, setName]       = useState("");
  const [company, setCompany] = useState("");
  const [scope, setScope]     = useState("");
  const [content, setContent] = useState("");
  const [budget, setBudget]   = useState("");
  const [timing, setTiming]   = useState("");
  const [email, setEmail]     = useState("");
  const [agree, setAgree]     = useState(false);
  const [errors, setErrors]   = useState<{ name?: string; content?: string; email?: string }>({});
  const [status, setStatus]   = useState<"idle" | "sending" | "success" | "error">("idle");

  // FAQ state
  const [openFaq, setOpenFaq] = useState<number | null>(null);


  const FILL_FIELD = ko ? "이 입력란을 작성해주세요." : "Please fill out this field.";

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const next: typeof errors = {};
    if (!name.trim()) next.name = FILL_FIELD;
    if (!content.trim()) next.content = FILL_FIELD;
    if (!email.trim()) {
      next.email = FILL_FIELD;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      next.email = ko
        ? `이메일 주소에 '@'를 포함해 주세요. '${email}'에는 '@'가 없습니다.`
        : `Please include an '@' in the email address. '${email}' is missing an '@'.`;
    }
    setErrors(next);
    if (Object.keys(next).length > 0 || !agree || status === "sending") return;
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, company, scope, content, budget, timing, email, agree }) });
      if (!res.ok) throw new Error("send failed");
      setStatus("success");
      setName(""); setCompany(""); setScope(""); setContent(""); setBudget(""); setTiming(""); setEmail(""); setAgree(false);
    } catch {
      setStatus("error");
    }
  }

  const faqs = ko ? FAQS.ko : FAQS.en;

  return (
    <form onSubmit={handleSubmit} noValidate style={{ position: "relative", width: 1920, height: CONTACT_CANVAS_H }}>

      {/* ══════════════════════════════════════════════════════
          Studio card — top hero image (above Let's Talk)
      ══════════════════════════════════════════════════════ */}
      <div className="absolute overflow-hidden" style={{ left: PAD, right: R_RPAD, top: CARD_Y, height: CARD_H }}>
        <img
          src="/images/studio/contact-bg.jpg"
          alt="REONU Studio"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center center", display: "block" }}
        />
      </div>

      {/* ══════════════════════════════════════════════════════
          SECTION 1 — Let's Talk
      ══════════════════════════════════════════════════════ */}

      {/* Left column — heading + bottom text pinned to form bottom */}
      <div className="absolute" style={{ left: PAD, top: S1_Y, width: 820, height: 1187, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <SplitTextReveal
          text="Let's Talk"
          className="font-headline text-[104px] leading-[100%] tracking-[-0.05em] text-[#000000]"
          style={{ fontWeight: 800, fontOpticalSizing: "none" } as React.CSSProperties}
        />
        {/* Bottom left — pinned to Send Message button bottom */}
        <p
          className="font-headline font-normal tracking-[-0.005em]"
          style={{ fontSize: 18, lineHeight: "170%", color: "#6E6E73" }}
        >
          {ko
            ? <>아이디어, 목표, 혹은 해결하고 싶은<br />과제가 있으신가요?<br />함께 특별한 결과물을 만들어가겠습니다.</>
            : <>Have an idea, a goal,<br />or a challenge to solve?<br />Let&apos;s create something remarkable together.</>
          }
        </p>
      </div>

      {/* Right column — form rows */}
      <div className="absolute" style={{ left: R_X, right: R_RPAD, top: S1_Y }}>
        <div style={{ display: "flex", alignItems: "center", height: 68, gap: ROW_GAP }}>
          <div className={PLAIN_LABEL} style={{ ...PLAIN_LABEL_STYLE }}>{ko ? "저는" : "I'm"}</div>
          <div className={INPUT_PILL} style={{ width: 360, height: 68, paddingInline: 18, position: "relative", borderColor: errors.name ? "#FF3B30" : undefined }}>
            <input className="bare-input" placeholder={ko ? "이름을 입력해주세요 *" : "Your name *"} value={name} onChange={e => { setName(e.target.value); if (errors.name) setErrors(p => ({ ...p, name: undefined })); }} required style={{ color: "#000000e6" }} />
            <FieldError message={errors.name} style={{ left: 0, top: 68 + 10 }} />
          </div>
          <div className={PLAIN_LABEL} style={{ ...PLAIN_LABEL_STYLE }}>{ko ? "이고," : "and I'm reaching out from"}</div>
        </div>

        {/* Row 2: company */}
        <div style={{ display: "flex", alignItems: "center", height: 68, gap: ROW_GAP, marginTop: 20 }}>
          <div className={INPUT_PILL} style={{ width: 580, height: 68, paddingInline: 18 }}>
            <input className="bare-input" placeholder={ko ? "브랜드명 또는 회사명을 입력해주세요" : "Brand or company name"} value={company} onChange={e => setCompany(e.target.value)} style={{ color: "#000000e6" }} />
          </div>
          <div className={PLAIN_LABEL} style={{ ...PLAIN_LABEL_STYLE }}>{ko ? "에서 연락드립니다." : "."}</div>
        </div>

        {/* Row 3: scope */}
        <div style={{ display: "flex", alignItems: "center", height: 68, gap: ROW_GAP, marginTop: 20 }}>
          <CustomSelect value={scope} onChange={setScope} placeholder={ko ? "의뢰 분야를 선택해주세요" : "Select a service"} width={380}
            options={ko ? ["Brand Design", "Digital Design", "Editorial Design", "기타", "아직 잘 모르겠어요"] : ["Brand Design", "Digital Design", "Editorial Design", "Other", "Not sure yet"]} />
          <div className={PLAIN_LABEL} style={{ height: 28, ...PLAIN_LABEL_STYLE }}>{ko ? "작업을 의뢰하고 싶습니다." : "is the service I'd like to request."}</div>
        </div>

        {/* Textarea */}
        <div className="bg-[#f5f5f5] rounded-none p-[18px] border-b-[1.5px] border-transparent focus-within:border-[#1D1D1F] transition-colors" style={{ position: "relative", marginTop: 80, width: 900, height: 240, borderColor: errors.content ? "#FF3B30" : undefined }}>
          <textarea className="bare-textarea font-headline text-[20px] leading-[28px] font-medium tracking-[-0.005em]" style={{ color: "#000000e6" }}
            placeholder={ko ? "프로젝트 내용, 필요한 작업, 참고사항 등을 자유롭게 작성해주세요 *" : "Feel free to describe your project, the work needed, and any references. *"}
            value={content} onChange={e => { setContent(e.target.value); if (errors.content) setErrors(p => ({ ...p, content: undefined })); }} required />
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ position: "absolute", bottom: 8, right: 8, pointerEvents: "none" }}>
            <line x1="14" y1="4" x2="4" y2="14" stroke="#86868B" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="14" y1="9" x2="9" y2="14" stroke="#86868B" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <FieldError message={errors.content} style={{ left: 0, top: 240 + 10 }} />
        </div>

        {/* Row 5: budget */}
        <div style={{ display: "flex", alignItems: "center", height: 68, gap: ROW_GAP, marginTop: 80 }}>
          <div className={PLAIN_LABEL} style={{ ...PLAIN_LABEL_STYLE }}>{ko ? "예산은" : "My budget is around"}</div>
          <CustomSelect value={budget} onChange={setBudget} placeholder={ko ? "예산을 선택해주세요" : "Select budget"} width={280}
            options={ko ? ["- 50만원", "50만원 - 200만원", "200만원 - 500만원", "500만원 +"] : ["- $500", "$500 – $1,500", "$1,500 – $4,000", "$4,000 +"]} />
          <div className={PLAIN_LABEL} style={{ ...PLAIN_LABEL_STYLE }}>{ko ? "이고," : ","}</div>
        </div>

        {/* Row 6: timing */}
        <div style={{ display: "flex", alignItems: "center", height: 68, gap: ROW_GAP, marginTop: 20 }}>
          <CustomSelect value={timing} onChange={setTiming} placeholder={ko ? "진행 희망 시기를 선택해주세요" : "Select preferred timing"} width={360}
            options={ko ? ["가능한 한 빠르게", "2주 이내", "3 - 4주 이내", "1 - 2개월 이내", "일정 협의 가능"] : ["As soon as possible", "Within 2 weeks", "Within 3 - 4 weeks", "Within 1 - 2 months", "Flexible / Open to discuss"]} />
          <div className={PLAIN_LABEL} style={{ ...PLAIN_LABEL_STYLE }}>{ko ? "시작하고 싶습니다." : "is when I'd like to start."}</div>
        </div>

        {/* Row 7: email */}
        <div style={{ display: "flex", alignItems: "center", height: 68, gap: ROW_GAP, marginTop: 80 }}>
          <div className={PLAIN_LABEL} style={{ ...PLAIN_LABEL_STYLE }}>{ko ? "연락은" : "Please reach me at"}</div>
          <div className={INPUT_PILL} style={{ width: 300, height: 68, paddingInline: 18, position: "relative", borderColor: errors.email ? "#FF3B30" : undefined }}>
            <input type="email" className="bare-input" placeholder={ko ? "이메일을 입력해주세요 *" : "your@email.com *"} value={email} onChange={e => { setEmail(e.target.value); if (errors.email) setErrors(p => ({ ...p, email: undefined })); }} required style={{ color: "#000000e6" }} />
            <FieldError message={errors.email} style={{ left: 0, top: 68 + 10 }} maxWidth={420} />
          </div>
          <div className={PLAIN_LABEL} style={{ ...PLAIN_LABEL_STYLE }}>{ko ? "로 부탁드립니다." : "."}</div>
        </div>

        {/* Checkbox */}
        <label className="flex items-center gap-[10px] cursor-pointer select-none" style={{ marginTop: 80 }}>
          <input type="checkbox" checked={agree} onChange={e => setAgree(e.target.checked)} className="sr-only" />
          <span className="grid place-items-center rounded-[3px] transition-colors duration-200" style={{ width: 20, height: 20, border: agree ? "1.2px solid #1D1D1F" : "1.2px solid #000000cc", background: agree ? "#1D1D1F" : "#ffffff" }}>
            {agree && <CheckMark color="#ffffff" />}
          </span>
          <span className="font-headline text-[18px] font-normal tracking-[-0.005em]" style={{ lineHeight: "170%", color: "#000000cc" }}>
            {ko ? "개인정보 처리 및 문의 내용 확인에 동의합니다." : "I agree to the collection and use of my personal information."}
          </span>
        </label>

        {/* Submit */}
        <div style={{ marginTop: 80, display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
          <SendMessageBtn disabled={!agree || status === "sending"} loading={status === "sending"} label={status === "sending" ? (ko ? "전송 중..." : "Sending...") : "Send Message"} />
          <SubmitNotice status={status} ko={ko} onClose={() => setStatus("idle")} />
        </div>
      </div>


      {/* ══════════════════════════════════════════════════════
          SECTION 2 — FAQs
      ══════════════════════════════════════════════════════ */}

      {/* Left: heading + bottom text pinned to Let's work together btn bottom */}
      <div className="absolute" style={{ left: PAD, top: FAQ_Y, height: 490, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <SplitTextReveal
          text="FAQs"
          className="font-headline font-bold tracking-[-0.05em] text-[#000000]"
          style={{ fontSize: 34, lineHeight: "44px", whiteSpace: "nowrap", fontWeight: 800, fontOpticalSizing: "none", fontVariationSettings: '"opsz" 144' } as React.CSSProperties}
        />
        <p
          className="font-headline font-normal tracking-[-0.005em]"
          style={{ fontSize: 18, lineHeight: "170%", color: "#6E6E73" }}
        >
          {ko
            ? <>프로젝트 진행 전<br />자주 묻는 질문도 확인해보세요.</>
            : <>Check our frequently asked questions<br />before reaching out.</>
          }
        </p>
      </div>

      {/* Right: accordion + Let's work together */}
      <div className="absolute" style={{ left: R_X, right: R_RPAD, top: FAQ_Y, display: "flex", flexDirection: "column" }}>
        {faqs.map((item, i) => (
          <FAQItem key={i} q={item.q} a={item.a} open={openFaq === i} onToggle={() => setOpenFaq(openFaq === i ? null : i)} />
        ))}
        <div style={{ marginTop: 80 }}>
          <StartProjectBtn label="Let's work together" href="#" />
        </div>
      </div>


    </form>
  );
}
