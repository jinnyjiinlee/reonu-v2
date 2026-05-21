"use client";

import { useState } from "react";

const INPUT_PILL =
  "bg-[#F7F7F7] rounded-[10px] flex items-center font-display text-[18px] leading-[24px] font-medium tracking-[-0.005em] text-[#444]";

const PLAIN_LABEL =
  "flex items-center font-display text-[18px] leading-[24px] font-medium tracking-[-0.005em] text-[#444444]";

function ChevronDown() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        d="M6 9.5 12 15.5 18 9.5"
        stroke="#1F1F1F"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CheckMark() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path
        d="M3 7.5 6 10.5 11 4.5"
        stroke="#1F1F1F"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function LetsTalkForm() {
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [scope, setScope] = useState("");
  const [content, setContent] = useState("");
  const [budget, setBudget] = useState("");
  const [timing, setTiming] = useState("");
  const [email, setEmail] = useState("");
  const [agree, setAgree] = useState(false);

  return (
    <>
      <h2
        className="absolute font-display text-[64px] leading-[77px] font-bold tracking-[-0.03em] text-[#1F1F1F]"
        style={{ left: 60, top: 6067 }}
      >
        Let’s Talk
      </h2>

      {/* Left intro — Figma: Apple SD Gothic Neo Medium 16px #444444 */}
      <p
        className="absolute font-display text-[16px] leading-[20px] font-medium tracking-[-0.005em] text-[#444444] whitespace-nowrap"
        style={{ left: 60, top: 6170 }}
      >
        아이디어, 목표, 혹은 해결하고 싶은 과제가 있으신가요?
        <br />
        함께 특별한 결과물을 만들어가겠습니다.
      </p>

      {/* Row 1 — 저는 [이름] 이고, */}
      <div className={`absolute ${PLAIN_LABEL}`} style={{ left: 960, top: 6181, height: 28 }}>
        저는
      </div>
      <div
        className={`absolute ${INPUT_PILL}`}
        style={{ left: 1027, top: 6170, width: 193, height: 49, paddingInline: 16 }}
      >
        <input
          className="bare-input"
          placeholder="이름을 입력해주세요"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ color: "#444444" }}
        />
      </div>
      <div className={`absolute ${PLAIN_LABEL}`} style={{ left: 1236, top: 6181, height: 28 }}>
        이고,
      </div>

      {/* Row 2 */}
      <div
        className={`absolute ${INPUT_PILL}`}
        style={{ left: 960, top: 6243, width: 324, height: 49, paddingInline: 16 }}
      >
        <input
          className="bare-input"
          placeholder="브랜드명 또는 회사명을 입력해주세요"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          style={{ color: "#444444" }}
        />
      </div>
      <div className={`absolute ${PLAIN_LABEL}`} style={{ left: 1300, top: 6254, height: 28 }}>
        에서 연락드립니다.
      </div>

      {/* Row 3 */}
      <div
        className={`absolute ${INPUT_PILL}`}
        style={{ left: 960, top: 6316, width: 265, height: 49, paddingInline: 16 }}
      >
        <select
          className="bare-select flex-1"
          value={scope}
          onChange={(e) => setScope(e.target.value)}
          style={{ color: scope ? "#444444" : "#999999" }}
        >
          <option value="" disabled>의뢰 분야를 선택해주세요</option>
          <option>BX Design</option>
          <option>UXUI Design</option>
          <option>EDIT Design</option>
        </select>
        <ChevronDown />
      </div>
      <div className={`absolute ${PLAIN_LABEL}`} style={{ left: 1241, top: 6327, height: 28 }}>
        작업을 의뢰하고 싶습니다.
      </div>

      {/* Textarea */}
      <div
        className="absolute bg-[#F7F7F7] rounded-[10px] p-[20px]"
        style={{ left: 960, top: 6389, width: 900, height: 220 }}
      >
        <textarea
          className="bare-textarea font-display text-[18px] leading-[24px] font-medium tracking-[-0.005em] text-[#444444]"
          placeholder="프로젝트 내용, 필요한 작업, 참고사항 등을 자유롭게 작성해주세요"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>

      {/* Row 5 — 예산은 [예산] 이고, */}
      <div className={`absolute ${PLAIN_LABEL}`} style={{ left: 960, top: 6644, height: 28 }}>
        예산은
      </div>
      <div
        className={`absolute ${INPUT_PILL}`}
        style={{ left: 1044, top: 6633, width: 225, height: 49, paddingInline: 16 }}
      >
        <select
          className="bare-select flex-1"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          style={{ color: budget ? "#444444" : "#999999" }}
        >
          <option value="" disabled>예산을 선택해주세요</option>
          <option>~500만원</option>
          <option>500만원~1,000만원</option>
          <option>1,000만원 이상</option>
        </select>
        <ChevronDown />
      </div>
      <div className={`absolute ${PLAIN_LABEL}`} style={{ left: 1285, top: 6644, height: 28 }}>
        이고,
      </div>

      {/* Row 6 — [시기] 시작하고 싶습니다. */}
      <div
        className={`absolute ${INPUT_PILL}`}
        style={{ left: 960, top: 6706, width: 304, height: 49, paddingInline: 16 }}
      >
        <select
          className="bare-select flex-1"
          value={timing}
          onChange={(e) => setTiming(e.target.value)}
          style={{ color: timing ? "#444444" : "#999999" }}
        >
          <option value="" disabled>진행 희망 시기를 선택해주세요</option>
          <option>1개월 이내</option>
          <option>3개월 이내</option>
          <option>일정 미정</option>
        </select>
        <ChevronDown />
      </div>
      <div className={`absolute ${PLAIN_LABEL}`} style={{ left: 1280, top: 6717, height: 28 }}>
        시작하고 싶습니다.
      </div>

      {/* Row 7 — 연락은 [이메일] 로 부탁드립니다. */}
      <div className={`absolute ${PLAIN_LABEL}`} style={{ left: 960, top: 6790, height: 28 }}>
        연락은
      </div>
      <div
        className={`absolute ${INPUT_PILL}`}
        style={{ left: 1044, top: 6779, width: 210, height: 49, paddingInline: 16 }}
      >
        <input
          type="email"
          className="bare-input"
          placeholder="이메일을 입력해주세요"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ color: "#444444" }}
        />
      </div>
      <div className={`absolute ${PLAIN_LABEL}`} style={{ left: 1270, top: 6790, height: 28 }}>
        로 부탁드립니다.
      </div>

      {/* Agree checkbox — outline + check mark when checked, gray text per Figma */}
      <label
        className="absolute flex items-center gap-[10px] cursor-pointer select-none"
        style={{ left: 960, top: 6868 }}
      >
        <input
          type="checkbox"
          checked={agree}
          onChange={(e) => setAgree(e.target.checked)}
          className="sr-only"
        />
        <span
          className="grid place-items-center bg-white rounded-[3px]"
          style={{
            width: 20,
            height: 20,
            border: "1.2px solid #999999",
          }}
        >
          {agree && <CheckMark />}
        </span>
        <span className="font-display text-[16px] leading-[19px] font-normal text-[#999999]">
          개인정보 처리 및 문의 내용 확인에 동의합니다.
        </span>
      </label>

      {/* Send Message — Figma spec: 268×66, 28px Inter Regular, black */}
      <button
        type="submit"
        disabled={!agree}
        className={`absolute flex items-center justify-center gap-[10px] font-display text-[28px] leading-[34px] font-normal tracking-[-0.01em] text-white rounded-full transition-colors ${
          agree
            ? "bg-[#1F1F1F] hover:opacity-80 cursor-pointer"
            : "bg-[#999999] cursor-not-allowed"
        }`}
        style={{ left: 960, top: 6949, width: 268, height: 66 }}
      >
        Send Message →
      </button>
    </>
  );
}
