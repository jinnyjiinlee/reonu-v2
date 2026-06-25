"use client";

import { useState, useRef, useLayoutEffect, useEffect } from "react";
import type { CSSProperties, FormEvent } from "react";
import { useLang } from "@/context/LanguageContext";
import { StartProjectBtn } from "@/components/Pricing";
import SplitTextReveal from "@/components/SplitTextReveal";

const BTN_EASE = "cubic-bezier(0.4, 0, 0.2, 1)";
const BTN_DUR  = "0.5s";
const PILL_H   = 48;
const CIRCLE   = 36;

const ArrowSVG = ({ color = "#ffffff" }: { color?: string }) => (
  <svg width="18" height="18" viewBox="0 0 16 16" fill="none" aria-hidden="true" style={{ display: "block", flexShrink: 0 }}>
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
        gap: 12,
        height: PILL_H,
        paddingLeft: 28,
        paddingRight: 8,
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
      {/* Pill → circle background */}
      <span style={{
        position: "absolute",
        top: hov ? (PILL_H - CIRCLE) / 2 : 0,
        right: hov ? 8 : 0,
        height: hov ? CIRCLE : PILL_H,
        width: hov ? CIRCLE : "100%",
        borderRadius: 999,
        background: "#1D1D1F",
        transition: `width ${BTN_DUR} ${BTN_EASE}, height ${BTN_DUR} ${BTN_EASE}, top ${BTN_DUR} ${BTN_EASE}, right ${BTN_DUR} ${BTN_EASE}`,
        zIndex: 0,
      }} />
      {/* Text — white inside pill, dark + shifted left to the form's edge when pill shrinks away */}
      <span
        className="font-headline text-[20px] leading-[24px] font-medium tracking-[-0.01em]"
        style={{
          whiteSpace: "nowrap",
          position: "relative",
          zIndex: 1,
          color: hov ? "#1D1D1F" : "#ffffff",
          transform: hov ? "translateX(-28px)" : "translateX(0)",
          transition: `color ${BTN_DUR} ${BTN_EASE}, transform ${BTN_DUR} ${BTN_EASE}`,
        }}
      >
        {label}
      </span>
      {/* Arrow — always visible */}
      <span style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        zIndex: 1,
        flexShrink: 0,
        width: CIRCLE,
        height: CIRCLE,
      }}>
        <ArrowSVG color="#ffffff" />
      </span>
    </button>
  );
}

const INPUT_PILL =
  "relative bg-[#FAFAFC] rounded-none flex items-center font-headline text-[18px] leading-[24px] font-medium tracking-[-0.005em] text-[#333336] border-b-[1.5px] border-transparent focus-within:border-[#1D1D1F] transition-colors";

// Consistent horizontal gap between label / input / label segments in each form row
const ROW_GAP = 6;

const PLAIN_LABEL =
  "flex items-center font-headline text-[18px] leading-[24px] font-medium tracking-[-0.005em] text-[#333336]";

function ChevronDown() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M6 9.5 12 15.5 18 9.5" stroke="#1D1D1F" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
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
}: {
  status: "idle" | "sending" | "success" | "error";
  ko: boolean;
  onClose: () => void;
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
        left: 960,
        top: 10642,
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

export default function LetsTalkForm() {
  const { lang } = useLang();
  const ko = lang === "ko";

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
      <SplitTextReveal
        text="Let's Talk"
        className="absolute font-headline text-[64px] leading-[77px] font-bold tracking-[-0.03em] text-[#1D1D1F]"
        style={{ left: 60, top: 9521 }}
      />

      <p
        className="absolute font-headline text-[16px] leading-[26px] font-normal tracking-[-0.005em] text-[#333336] whitespace-nowrap"
        style={{ left: 60, top: 9622 }}
      >
        {ko
          ? <>아이디어, 목표, 혹은 해결하고 싶은 과제가 있으신가요?<br />함께 특별한 결과물을 만들어가겠습니다.</>
          : <>Have an idea, a goal, or a challenge to solve?<br />Let's create something remarkable together.</>
        }
      </p>

      {/* FAQ link — same caption + arrow-link pattern as Pricing's "Let's Talk" CTA */}
      <p
        className="absolute font-headline font-medium tracking-[-0.005em] text-[#6E6E73] whitespace-nowrap"
        style={{ left: 60, top: 10494, fontSize: 14, lineHeight: "22px" }}
      >
        {ko
          ? <>프로젝트 진행 전<br />자주 묻는 질문도 확인해보세요.</>
          : <>Before you reach out, check our<br />frequently asked questions.</>
        }
      </p>
      <div className="absolute" style={{ left: 60, top: 10578 }}>
        <StartProjectBtn label="View FAQs" href="/connect" />
      </div>

      {/* Row 1 */}
      <div className="absolute flex items-center" style={{ left: 960, top: 9624, height: 49, gap: ROW_GAP }}>
        <div className={PLAIN_LABEL} style={{ height: 28 }}>
          {ko ? "저는" : "I'm"}
        </div>
        <div className={INPUT_PILL} style={{ width: 360, height: 49, paddingInline: 18, borderColor: errors.name ? "#FF3B30" : undefined }}>
          <input
            className="bare-input"
            placeholder={ko ? "이름을 입력해주세요 *" : "Your name *"}
            value={name}
            onChange={(e) => { setName(e.target.value); if (errors.name) setErrors((p) => ({ ...p, name: undefined })); }}
            required
            style={{ color: "#333336" }}
          />
          <FieldError message={errors.name} style={{ left: 0, top: 49 + 10 }} />
        </div>
        <div className={PLAIN_LABEL} style={{ height: 28 }}>
          {ko ? "이고," : "and I'm reaching out from"}
        </div>
      </div>

      {/* Row 2 */}
      <div className="absolute flex items-center" style={{ left: 960, top: 9693, height: 49, gap: ROW_GAP }}>
        <div className={INPUT_PILL} style={{ width: 580, height: 49, paddingInline: 18 }}>
          <input
            className="bare-input"
            placeholder={ko ? "브랜드명 또는 회사명을 입력해주세요" : "Brand or company name"}
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            style={{ color: "#333336" }}
          />
        </div>
        <div className={PLAIN_LABEL} style={{ height: 28 }}>
          {ko ? "에서 연락드립니다." : "."}
        </div>
      </div>

      {/* Row 3 */}
      <div className="absolute flex items-center" style={{ left: 960, top: 9762, height: 49, gap: ROW_GAP }}>
        <div className={INPUT_PILL} style={{ width: 380, height: 49, paddingInline: 18 }}>
          <select
            className="bare-select flex-1"
            value={scope}
            onChange={(e) => setScope(e.target.value)}
            style={{ color: scope ? "#333336" : "#86868B" }}
          >
            <option value="" disabled>{ko ? "의뢰 분야를 선택해주세요" : "Select a service"}</option>
            <option>BX Design</option>
            <option>UXUI Design</option>
            <option>EDIT Design</option>
            <option>{ko ? "기타" : "Other"}</option>
            <option>{ko ? "아직 잘 모르겠어요" : "Not sure yet"}</option>
          </select>
          <ChevronDown />
        </div>
        <div className={PLAIN_LABEL} style={{ height: 28 }}>
          {ko ? "작업을 의뢰하고 싶습니다." : "is the service I'd like to request."}
        </div>
      </div>

      {/* Textarea */}
      <div className="absolute bg-[#FAFAFC] rounded-none p-[18px] border-b-[1.5px] border-transparent focus-within:border-[#1D1D1F] transition-colors" style={{ left: 960, top: 9891, width: 900, height: 240, position: "relative", borderColor: errors.content ? "#FF3B30" : undefined }}>
        <textarea
          className="bare-textarea font-headline text-[18px] leading-[24px] font-medium tracking-[-0.005em] text-[#333336]"
          placeholder={ko
            ? "프로젝트 내용, 필요한 작업, 참고사항 등을 자유롭게 작성해주세요 *"
            : "Feel free to describe your project, the work needed, and any references. *"
          }
          value={content}
          onChange={(e) => { setContent(e.target.value); if (errors.content) setErrors((p) => ({ ...p, content: undefined })); }}
          required
        />
        {/* Custom resize handle */}
        <svg
          width="16" height="16" viewBox="0 0 16 16" fill="none"
          style={{ position: "absolute", bottom: 8, right: 8, pointerEvents: "none" }}
        >
          <line x1="14" y1="4" x2="4" y2="14" stroke="#86868B" strokeWidth="1.5" strokeLinecap="round"/>
          <line x1="14" y1="9" x2="9" y2="14" stroke="#86868B" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        <FieldError message={errors.content} style={{ left: 0, top: 240 + 10 }} />
      </div>

      {/* Row 5 */}
      <div className="absolute flex items-center" style={{ left: 960, top: 10151, height: 49, gap: ROW_GAP }}>
        <div className={PLAIN_LABEL} style={{ height: 28 }}>
          {ko ? "예산은" : "My budget is around"}
        </div>
        <div className={INPUT_PILL} style={{ width: 280, height: 49, paddingInline: 18 }}>
          <select
            className="bare-select flex-1"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            style={{ color: budget ? "#333336" : "#86868B" }}
          >
            <option value="" disabled>{ko ? "예산을 선택해주세요" : "Select budget"}</option>
            {ko ? (
              <>
                <option>- 50만원</option>
                <option>50만원 - 200만원</option>
                <option>200만원 - 500만원</option>
                <option>500만원 +</option>
              </>
            ) : (
              <>
                <option>- $500</option>
                <option>$500 – $1,500</option>
                <option>$1,500 – $4,000</option>
                <option>$4,000 +</option>
              </>
            )}
          </select>
          <ChevronDown />
        </div>
        <div className={PLAIN_LABEL} style={{ height: 28 }}>
          {ko ? "이고," : ","}
        </div>
      </div>

      {/* Row 6 */}
      <div className="absolute flex items-center" style={{ left: 960, top: 10220, height: 49, gap: ROW_GAP }}>
        <div className={INPUT_PILL} style={{ width: 360, height: 49, paddingInline: 18 }}>
          <select
            className="bare-select flex-1"
            value={timing}
            onChange={(e) => setTiming(e.target.value)}
            style={{ color: timing ? "#333336" : "#86868B" }}
          >
            <option value="" disabled>{ko ? "진행 희망 시기를 선택해주세요" : "Select preferred timing"}</option>
            {ko ? (
              <>
                <option>가능한 한 빠르게</option>
                <option>2주 이내</option>
                <option>3 - 4주 이내</option>
                <option>1 - 2개월 이내</option>
                <option>일정 협의 가능</option>
              </>
            ) : (
              <>
                <option>As soon as possible</option>
                <option>Within 2 weeks</option>
                <option>Within 3 - 4 weeks</option>
                <option>Within 1 - 2 months</option>
                <option>Flexible / Open to discuss</option>
              </>
            )}
          </select>
          <ChevronDown />
        </div>
        <div className={PLAIN_LABEL} style={{ height: 28 }}>
          {ko ? "시작하고 싶습니다." : "is when I'd like to start."}
        </div>
      </div>

      {/* Row 7 */}
      <div className="absolute flex items-center" style={{ left: 960, top: 10349, height: 49, gap: ROW_GAP }}>
        <div className={PLAIN_LABEL} style={{ height: 28 }}>
          {ko ? "연락은" : "Please reach me at"}
        </div>
        <div className={INPUT_PILL} style={{ width: 300, height: 49, paddingInline: 18, borderColor: errors.email ? "#FF3B30" : undefined }}>
          <input
            type="email"
            className="bare-input"
            placeholder={ko ? "이메일을 입력해주세요 *" : "your@email.com *"}
            value={email}
            onChange={(e) => { setEmail(e.target.value); if (errors.email) setErrors((p) => ({ ...p, email: undefined })); }}
            required
            style={{ color: "#333336" }}
          />
          <FieldError message={errors.email} style={{ left: 0, top: 49 + 10 }} maxWidth={420} />
        </div>
        <div className={PLAIN_LABEL} style={{ height: 28 }}>
          {ko ? "로 부탁드립니다." : "."}
        </div>
      </div>

      {/* Checkbox */}
      <label
        className="absolute flex items-center gap-[10px] cursor-pointer select-none p-[10px] -m-[10px]"
        style={{ left: 960, top: 10478 }}
      >
        <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="sr-only" />
        <span
          className="grid place-items-center rounded-[3px] transition-colors duration-200"
          style={{
            width: 20,
            height: 20,
            border: agree ? "1.2px solid #1D1D1F" : "1.2px solid #86868B",
            background: agree ? "#1D1D1F" : "#ffffff",
          }}
        >
          {agree && <CheckMark color="#ffffff" />}
        </span>
        <span className="font-headline text-[16px] leading-[19px] font-normal text-[#86868B]">
          {ko
            ? "개인정보 처리 및 문의 내용 확인에 동의합니다."
            : "I agree to the collection and use of my personal information."
          }
        </span>
      </label>

      {/* Submit */}
      <div className="absolute" style={{ left: 960, top: 10578 }}>
        <SendMessageBtn
          disabled={!agree || status === "sending"}
          loading={status === "sending"}
          label={status === "sending" ? (ko ? "전송 중..." : "Sending...") : "Send Message"}
        />
      </div>

      <SubmitNotice status={status} ko={ko} onClose={() => setStatus("idle")} />
    </form>
  );
}
