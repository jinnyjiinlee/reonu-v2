"use client";

import { useState, useRef, useLayoutEffect, useEffect } from "react";
import type { CSSProperties, FormEvent } from "react";
import { useLang } from "@/context/LanguageContext";
import { StartProjectBtn } from "@/components/Pricing";
import SplitTextReveal from "@/components/SplitTextReveal";

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
      {/* Backdrop — full dark pill by default, shrinks to circle on hover */}
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
      {/* Text — white on dark pill (default), dark on hover when pill shrinks */}
      <span
        className="font-headline text-[25px] leading-[32px] font-medium tracking-normal"
        style={{
          whiteSpace: "nowrap",
          position: "relative",
          zIndex: 2,
          color: hov ? "#000000e6" : "#ffffff",
          transition: `color ${BTN_DUR} ${BTN_EASE}`,
        }}
      >
        {label}
      </span>
      {/* Arrow — always white (sits on dark circle in both states), grows on hover */}
      <span style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        zIndex: 2,
        flexShrink: 0,
      }}>
        <ArrowSVG color="#ffffff" size={hov ? 26 : 20} />
      </span>
    </button>
  );
}

const INPUT_PILL =
  "relative bg-[#f5f5f5] rounded-none flex items-center font-headline text-[20px] leading-[28px] font-medium tracking-[-0.005em] border-b-[1.5px] border-transparent focus-within:border-[#1D1D1F] transition-colors";

// Consistent horizontal gap between label / input / label segments in each form row
const ROW_GAP = 6;

const PLAIN_LABEL =
  "flex items-center font-headline text-[20px] leading-[28px] font-medium tracking-[-0.005em]";
const PLAIN_LABEL_STYLE = { color: "#000000e6" } as const;

function ChevronDown({ open = false, hasValue = false }: { open?: boolean; hasValue?: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
      style={{ flexShrink: 0, transition: "transform 0.2s ease", transform: open ? "rotate(180deg)" : "rotate(0deg)" }}>
      <path d="M6 9.5 12 15.5 18 9.5" stroke={hasValue ? "#000000e6" : "#00000099"} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CustomSelect({
  value, onChange, options, placeholder, width,
}: {
  value: string;
  onChange: (val: string) => void;
  options: string[];
  placeholder: string;
  width: number;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onMouse = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onMouse);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onMouse);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} style={{ position: "relative", width, height: 68, flexShrink: 0 }}>
      {/* Trigger */}
      <div
        className={INPUT_PILL}
        style={{ width, height: 68, paddingInline: 18, cursor: "pointer" }}
        onClick={() => setOpen(p => !p)}
      >
        <span style={{ flex: 1, color: value ? "#000000e6" : "#00000099", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {value || placeholder}
        </span>
        <ChevronDown open={open} hasValue={!!value} />
      </div>

      {/* Dropdown list */}
      {open && (
        <div style={{
          position: "absolute",
          top: 72,
          left: 0,
          width,
          background: "#ffffff",
          border: "1px solid #E5E5E7",
          borderRadius: 10,
          boxShadow: "0 8px 32px rgba(0,0,0,0.09)",
          zIndex: 200,
          overflow: "hidden",
        }}>
          {options.map(opt => (
            <div
              key={opt}
              onClick={() => { onChange(opt); setOpen(false); }}
              className="font-headline text-[20px] leading-[28px] font-medium tracking-[-0.005em]"
              style={{
                padding: "11px 18px",
                cursor: "pointer",
                color: opt === value ? "#1D1D1F" : "#333336",
                background: opt === value ? "#F5F5F7" : "transparent",
                transition: "background 0.12s ease",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#F5F5F7"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = opt === value ? "#F5F5F7" : "transparent"; }}
            >
              {opt.endsWith(" DESIGN") ? (
                <><span style={{ fontWeight: 700 }}>{opt.replace(" DESIGN", "")}</span>{" DESIGN"}</>
              ) : opt}
            </div>
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

// Custom validation message — dark glass speech-bubble pointing up at the field
function FieldError({ message, style, tailLeft = 18, maxWidth }: { message?: string; style: CSSProperties; tailLeft?: number; maxWidth?: number }) {
  if (!message) return null;
  const bubbleBg = "rgba(255, 255, 255, 0.55)";
  const bubbleBorder = "1px solid rgba(255, 255, 255, 0.6)";
  return (
    <div key={message} className="field-error absolute" style={{ zIndex: 30, ...style }}>
      <div className="relative">
        {/* Tail — points up at the field above */}
        <div
          className="absolute rotate-45"
          style={{
            top: -4,
            left: tailLeft,
            width: 10,
            height: 10,
            background: bubbleBg,
            border: bubbleBorder,
            borderBottom: "none",
            borderRight: "none",
            backdropFilter: "blur(16px) saturate(180%)",
            WebkitBackdropFilter: "blur(16px) saturate(180%)",
            borderRadius: 2,
          }}
        />
        {/* Bubble */}
        <div
          className="relative flex items-center gap-[8px] rounded-[12px] font-headline text-[13px] leading-[18px] font-medium tracking-[-0.005em] text-[#1D1D1F] shadow-[0_8px_32px_rgba(0,0,0,0.10)]"
          style={{
            background: bubbleBg,
            border: bubbleBorder,
            backdropFilter: "blur(16px) saturate(180%)",
            WebkitBackdropFilter: "blur(16px) saturate(180%)",
            padding: "10px 14px",
            whiteSpace: maxWidth ? "normal" : "nowrap",
            maxWidth,
          }}
        >
          <span
            className="flex items-center justify-center rounded-full text-[9px] font-bold leading-none text-white"
            style={{ width: 14, height: 14, background: "#FF3B30", flexShrink: 0 }}
          >
            !
          </span>
          {message}
        </div>
      </div>
    </div>
  );
}

// Submit result notice — dark glass toast shown below the Send Message button
function SubmitNotice({
  status,
  ko,
  onClose,
  top = 10642,
}: {
  status: "idle" | "sending" | "success" | "error";
  ko: boolean;
  onClose: () => void;
  top?: number;
}) {
  useEffect(() => {
    if (status === "success" || status === "error") {
      const t = setTimeout(onClose, 8000);
      return () => clearTimeout(t);
    }
  }, [status, onClose]);

  if (status !== "success" && status !== "error") return null;

  const isSuccess = status === "success";
  const bubbleBg = "rgba(255, 255, 255, 0.55)";
  const bubbleBorder = "1px solid rgba(255, 255, 255, 0.6)";

  return (
    <div
      key={status}
      className="field-error absolute flex items-center gap-[10px] rounded-[12px] font-headline text-[14px] leading-[20px] font-medium tracking-[-0.005em] text-[#1D1D1F] shadow-[0_8px_32px_rgba(0,0,0,0.10)]"
      style={{
        left: 880,
        top,
        padding: "14px 18px",
        background: bubbleBg,
        border: bubbleBorder,
        backdropFilter: "blur(16px) saturate(180%)",
        WebkitBackdropFilter: "blur(16px) saturate(180%)",
        zIndex: 30,
      }}
    >
      <span
        className="flex items-center justify-center rounded-full text-[10px] font-bold leading-none text-white"
        style={{
          width: 18,
          height: 18,
          background: isSuccess ? "#34C759" : "#FF3B30",
          flexShrink: 0,
        }}
      >
        {isSuccess ? <CheckMark color="#fff" /> : "!"}
      </span>
      {isSuccess
        ? ko
          ? "메시지가 성공적으로 전달되었습니다. 빠른 시일 내에 답변드리겠습니다."
          : "Your message has been sent. We'll get back to you soon."
        : ko
        ? "전송에 실패했습니다. 잠시 후 다시 시도해주세요."
        : "Something went wrong. Please try again."}
      <button
        type="button"
        onClick={onClose}
        data-cursor="hidden"
        className="ml-[4px] flex items-center justify-center text-[20px] leading-none text-[#1D1D1F]/40 transition-colors hover:text-[#1D1D1F]"
        style={{ width: 20, height: 20 }}
        aria-label={ko ? "닫기" : "Close"}
      >
        ×
      </button>
    </div>
  );
}

// LetsTalkForm is inside PRICING_SHIFT wrapper at canvas Y = 1362 (page.tsx top: PRICING_SHIFT)
const PRICING_SHIFT_WRAPPER_Y = 1362;
const FORM_TOP_DEFAULT        = 9180;
const SUBMIT_NOTICE_OFFSET    = 10642 - FORM_TOP_DEFAULT; // 1462 canvas px

export default function LetsTalkForm() {
  const { lang } = useLang();
  const ko = lang === "ko";

  // Dynamic — repositions when Pricing moves (pricing-end cascade)
  const [formTop, setFormTop] = useState(FORM_TOP_DEFAULT);

  useEffect(() => {
    const handler = (e: Event) => {
      const pricingEndY = (e as CustomEvent<{ y: number }>).detail?.y;
      if (!pricingEndY) return;
      setFormTop(Math.round(pricingEndY - PRICING_SHIFT_WRAPPER_Y));
    };
    window.addEventListener("pricing-end", handler);
    return () => window.removeEventListener("pricing-end", handler);
  }, []);

  const [name, setName]       = useState("");
  const [company, setCompany] = useState("");
  const [scope, setScope]     = useState("");
  const [content, setContent] = useState("");
  const [budget, setBudget]   = useState("");
  const [timing, setTiming]   = useState("");
  const [email, setEmail]     = useState("");
  const [agree, setAgree]     = useState(false);

  const [errors, setErrors] = useState<{ name?: string; content?: string; email?: string }>({});
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

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
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, company, scope, content, budget, timing, email, agree }),
      });

      if (!res.ok) throw new Error("send failed");

      setStatus("success");
      setName("");
      setCompany("");
      setScope("");
      setContent("");
      setBudget("");
      setTiming("");
      setEmail("");
      setAgree(false);
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      {/*
       * ── Two-column layout ──────────────────────────────────────────────────
       * Canvas y = 9521 within PRICING_SHIFT wrapper (top: PRICING_SHIFT = 1362).
       * Left col  (w:880, pl:60):  heading · intro desc · FAQ link
       * Right col (flex:1, pr:60): form rows stacked with consistent gaps
       *   Row gaps:  20px between adjacent rows
       *   Section gaps: 80px before textarea / row-7 / checkbox
       * ─────────────────────────────────────────────────────────────────────
       */}
      <div
        className="absolute"
        style={{ left: 0, top: formTop, width: 1920, display: "flex", alignItems: "flex-start", paddingTop: 240, paddingBottom: 240 }}
      >
        {/* ── Left column ── */}
        <div
          style={{
            width: 880,
            flexShrink: 0,
            paddingLeft: 60,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <SplitTextReveal
            text="Let’s Talk"
            className="font-headline text-[104px] leading-[100%] tracking-[-0.05em] text-[#000000]"
            style={{ fontWeight: 800, fontOpticalSizing: "none" }}
          />

          {/* Intro paragraph */}
          <p
            className="font-headline text-[20px] leading-[32px] font-normal tracking-[-0.005em] whitespace-nowrap"
            style={{ color: "#000000b3" }}
          >
            {ko
              ? <>아이디어, 목표, 혹은 해결하고 싶은 과제가 있으신가요?<br />함께 특별한 결과물을 만들어가겠습니다.</>
              : <>Have an idea, a goal, or a challenge to solve?<br />Let&apos;s create something remarkable together.</>
            }
          </p>
          </div>

          {/* FAQ section — 846px below intro para (aligns left col bottom with right col bottom at ~1186px) */}
          <div style={{ marginTop: 846, display: "flex", flexDirection: "column", gap: 64 }}>
            <p
              className="font-headline font-normal tracking-[-0.005em] text-[#6E6E73]"
              style={{ fontSize: 18, lineHeight: "170%", width: 280 }}
            >
              {ko
                ? <>프로젝트 진행 전<br />자주 묻는 질문도 확인해보세요.</>
                : <>Before you reach out, check our<br />frequently asked questions.</>
              }
            </p>
            <StartProjectBtn label="View FAQs" href="/connect" />
          </div>
        </div>

        {/* ── Right column: form rows ── */}
        <div
          style={{
            flex: 1,
            paddingRight: 60,
            display: "flex",
            flexDirection: "column",
            gap: 80,
          }}
        >
          {/* Group 1: name + company + scope (gap:20 internally) */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Row 1: name */}
            <div style={{ display: "flex", alignItems: "center", height: 68, gap: ROW_GAP }}>
              <div className={PLAIN_LABEL} style={{ ...PLAIN_LABEL_STYLE }}>
                {ko ? "저는" : "I'm"}
              </div>
              <div className={INPUT_PILL} style={{ width: 360, height: 68, paddingInline: 18, borderColor: errors.name ? "#FF3B30" : undefined }}>
                <input
                  className="bare-input"
                  placeholder={ko ? "이름을 입력해주세요 *" : "Your name *"}
                  value={name}
                  onChange={(e) => { setName(e.target.value); if (errors.name) setErrors((p) => ({ ...p, name: undefined })); }}
                  required
                  style={{ color: "#000000e6" }}
                />
                <FieldError message={errors.name} style={{ left: 0, top: 68 + 10 }} />
              </div>
              <div className={PLAIN_LABEL} style={{ ...PLAIN_LABEL_STYLE }}>
                {ko ? "이고," : "and I'm reaching out from"}
              </div>
            </div>

            {/* Row 2: company */}
            <div style={{ display: "flex", alignItems: "center", height: 68, gap: ROW_GAP }}>
              <div className={INPUT_PILL} style={{ width: 580, height: 68, paddingInline: 18 }}>
                <input
                  className="bare-input"
                  placeholder={ko ? "브랜드명 또는 회사명을 입력해주세요" : "Brand or company name"}
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  style={{ color: "#000000e6" }}
                />
              </div>
              <div className={PLAIN_LABEL} style={{ ...PLAIN_LABEL_STYLE }}>
                {ko ? "에서 연락드립니다." : "."}
              </div>
            </div>

            {/* Row 3: scope */}
            <div style={{ display: "flex", alignItems: "center", height: 68, gap: ROW_GAP }}>
              <CustomSelect
                value={scope}
                onChange={setScope}
                placeholder={ko ? "의뢰 분야를 선택해주세요" : "Select a service"}
                width={380}
                options={ko
                  ? ["Brand Design", "Digital Design", "Editorial Design", "기타", "아직 잘 모르겠어요"]
                  : ["Brand Design", "Digital Design", "Editorial Design", "Other", "Not sure yet"]
                }
              />
              <div className={PLAIN_LABEL} style={{ height: 28, ...PLAIN_LABEL_STYLE }}>
                {ko ? "작업을 의뢰하고 싶습니다." : "is the service I'd like to request."}
              </div>
            </div>
          </div>

          {/* Textarea */}
          <div
            className="bg-[#f5f5f5] rounded-none p-[18px] border-b-[1.5px] border-transparent focus-within:border-[#1D1D1F] transition-colors"
            style={{
              position: "relative",
              width: 900,
              height: 240,
              borderColor: errors.content ? "#FF3B30" : undefined,
            }}
          >
            <textarea
              className="bare-textarea font-headline text-[20px] leading-[28px] font-medium tracking-[-0.005em]"
              style={{ color: "#000000e6" }}
              placeholder={ko
                ? "프로젝트 내용, 필요한 작업, 참고사항 등을 자유롭게 작성해주세요 *"
                : "Feel free to describe your project, the work needed, and any references. *"
              }
              value={content}
              onChange={(e) => { setContent(e.target.value); if (errors.content) setErrors((p) => ({ ...p, content: undefined })); }}
              required
            />
            <svg
              width="16" height="16" viewBox="0 0 16 16" fill="none"
              style={{ position: "absolute", bottom: 8, right: 8, pointerEvents: "none" }}
            >
              <line x1="14" y1="4" x2="4" y2="14" stroke="#86868B" strokeWidth="1.5" strokeLinecap="round"/>
              <line x1="14" y1="9" x2="9" y2="14" stroke="#86868B" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <FieldError message={errors.content} style={{ left: 0, top: 240 + 10 }} />
          </div>

          {/* Group 2: budget + timing (gap:20 internally) */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Row 5: budget */}
            <div style={{ display: "flex", alignItems: "center", height: 68, gap: ROW_GAP }}>
              <div className={PLAIN_LABEL} style={{ ...PLAIN_LABEL_STYLE }}>
                {ko ? "예산은" : "My budget is around"}
              </div>
              <CustomSelect
                value={budget}
                onChange={setBudget}
                placeholder={ko ? "예산을 선택해주세요" : "Select budget"}
                width={280}
                options={ko
                  ? ["- 50만원", "50만원 - 200만원", "200만원 - 500만원", "500만원 +"]
                  : ["- $500", "$500 – $1,500", "$1,500 – $4,000", "$4,000 +"]
                }
              />
              <div className={PLAIN_LABEL} style={{ ...PLAIN_LABEL_STYLE }}>
                {ko ? "이고," : ","}
              </div>
            </div>

            {/* Row 6: timing */}
            <div style={{ display: "flex", alignItems: "center", height: 68, gap: ROW_GAP }}>
              <CustomSelect
                value={timing}
                onChange={setTiming}
                placeholder={ko ? "진행 희망 시기를 선택해주세요" : "Select preferred timing"}
                width={360}
                options={ko
                  ? ["가능한 한 빠르게", "2주 이내", "3 - 4주 이내", "1 - 2개월 이내", "일정 협의 가능"]
                  : ["As soon as possible", "Within 2 weeks", "Within 3 - 4 weeks", "Within 1 - 2 months", "Flexible / Open to discuss"]
                }
              />
              <div className={PLAIN_LABEL} style={{ ...PLAIN_LABEL_STYLE }}>
                {ko ? "시작하고 싶습니다." : "is when I'd like to start."}
              </div>
            </div>
          </div>

          {/* Row 7: email */}
          <div style={{ display: "flex", alignItems: "center", height: 68, gap: ROW_GAP }}>
            <div className={PLAIN_LABEL} style={{ ...PLAIN_LABEL_STYLE }}>
              {ko ? "연락은" : "Please reach me at"}
            </div>
            <div className={INPUT_PILL} style={{ width: 300, height: 68, paddingInline: 18, borderColor: errors.email ? "#FF3B30" : undefined }}>
              <input
                type="email"
                className="bare-input"
                placeholder={ko ? "이메일을 입력해주세요 *" : "your@email.com *"}
                value={email}
                onChange={(e) => { setEmail(e.target.value); if (errors.email) setErrors((p) => ({ ...p, email: undefined })); }}
                required
                style={{ color: "#000000e6" }}
              />
              <FieldError message={errors.email} style={{ left: 0, top: 68 + 10 }} maxWidth={420} />
            </div>
            <div className={PLAIN_LABEL} style={{ ...PLAIN_LABEL_STYLE }}>
              {ko ? "로 부탁드립니다." : "."}
            </div>
          </div>

          {/* Checkbox */}
          <label
            className="flex items-center gap-[10px] cursor-pointer select-none"
          >
            <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="sr-only" />
            <span
              className="grid place-items-center rounded-[3px] transition-colors duration-200"
              style={{
                width: 20,
                height: 20,
                border: agree ? "1.2px solid #1D1D1F" : "1.2px solid #000000cc",
                background: agree ? "#1D1D1F" : "#ffffff",
              }}
            >
              {agree && <CheckMark color="#ffffff" />}
            </span>
            <span className="font-headline text-[18px] font-normal tracking-[-0.005em]" style={{ lineHeight: "170%", color: "#000000cc" }}>
              {ko
                ? "개인정보 처리 및 문의 내용 확인에 동의합니다."
                : "I agree to the collection and use of my personal information."
              }
            </span>
          </label>

          {/* Submit */}
          <div style={{ alignSelf: "flex-start" }}>
            <SendMessageBtn
              disabled={!agree || status === "sending"}
              loading={status === "sending"}
              label={status === "sending" ? (ko ? "전송 중..." : "Sending...") : "Send Message"}
            />
          </div>
        </div>
      </div>

      {/* SubmitNotice — absolute within PRICING_SHIFT wrapper, offset from formTop */}
      <SubmitNotice status={status} ko={ko} onClose={() => setStatus("idle")} top={formTop + SUBMIT_NOTICE_OFFSET} />
    </form>
  );
}
