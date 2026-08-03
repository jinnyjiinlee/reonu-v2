"use client";

import Image from "next/image";
import Link from "next/link";
import { useLang } from "@/context/LanguageContext";

const C = {
  ink:    "#1D1D1F",
  body:   "#6E6E73",
  muted:  "#86868B",
  paper:  "#ffffff",
  panel:  "#F5F5F7",
  border: "#E5E5E7",
};

function SectionLabel({ children }: { children: string }) {
  return (
    <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", color: C.muted, margin: 0, textTransform: "uppercase" }}>
      {children}
    </p>
  );
}

function Divider() {
  return <div style={{ height: 1, background: C.border }} />;
}

const VALUES = [
  {
    title: "Open",
    ko_label: "열린 가능성",
    desc: {
      ko: ["모든 브랜드는 가능성을 가지고 있습니다.", "규모나 단계에 상관없이 모두에게 열려있습니다."],
      en: ["Every brand holds potential.", "Great design is open to all — regardless of size or stage."],
    },
  },
  {
    title: "On",
    ko_label: "가치 점화",
    desc: {
      ko: ["브랜드 안에 이미 존재하는 가치를 발견하고", "그 가치를 켜는(ON) 디자인을 만듭니다."],
      en: ["We uncover the value already within your brand", "and design to turn it on."],
    },
  },
  {
    title: "Growth",
    ko_label: "지속적인 성장",
    desc: {
      ko: ["브랜드가 계속해서 확장하고 더 큰 가능성으로", "나아갈 수 있도록 설계합니다."],
      en: ["We design for continuous growth —", "so your brand can expand and reach its fullest potential."],
    },
  },
];

const JOBS = [
  {
    category: "Brand / Editorial",
    items: [
      { ko: "교육부 정신건강 가이드북", en: "Ministry of Education Mental Health Guidebook" },
      { ko: "송파구청 신사업 홍보물", en: "Songpa-gu Office New Business Promotional Materials" },
      { ko: "국어문화원, HK인문학센터 웹포스터", en: "National Institute of Korean Language & HK Humanities Center Web Poster" },
      { ko: "문화체육관광부 홍보 포스터 · 카드뉴스", en: "Ministry of Culture, Sports and Tourism Promotional Poster & Card News" },
      { ko: "국제산악영화제 게스트 가이드북", en: "International Mountain Film Festival Guest Guidebook" },
      { ko: "국민대학교 디자인대학원 홍보물", en: "Kookmin University Graduate School of Design Promotional Materials" },
      { ko: "Tripick 기업 브랜딩 · 서비스 캐릭터", en: "Tripick Corporate Branding & Service Character" },
      { ko: "등 다수 공공기관 · 기업 브랜딩", en: "And more public & corporate branding projects" },
    ],
  },
  {
    category: "Digital",
    items: [
      { ko: "KT (momo) 구축", en: "KT (momo) Platform Build" },
      { ko: "롯데손해보험 (wonder) 구축", en: "Lotte Insurance (wonder) Platform Build" },
      { ko: "신한자산운용 구축 및 운영", en: "Shinhan Asset Management Build & Operation" },
      { ko: "신한카드 구축 운영", en: "Shinhan Card Build & Operation" },
      { ko: "KB증권 구축 및 운영", en: "KB Securities Build & Operation" },
      { ko: "KB자산운용 구축 및 운영", en: "KB Asset Management Build & Operation" },
      { ko: "CJ 온스타일 운영", en: "CJ OnStyle Operation" },
    ],
  },
  {
    category: "Experience",
    items: [
      { ko: "ICT 스타트업 아이시온 운영 및 디자인 총괄", en: "ICT Startup ICION — Head of Design & Operations" },
      { ko: "SK C&C (Vitality Summit) 협업", en: "SK C&C (Vitality Summit) Collaboration" },
      { ko: "스마트미디어 X캠프 우수상 수상", en: "Smart Media X-Camp Excellence Award" },
      { ko: "미국 실리콘밸리 One Pitch Society 최종 피칭 선정", en: "Silicon Valley One Pitch Society — Final Pitch Selection" },
    ],
  },
  {
    category: "Education",
    items: [
      { ko: "국민대학교 디자인대학원 석사", en: "Kookmin University, Graduate School of Design — M.F.A." },
    ],
  },
];

function MobileFooter() {
  return (
    <footer style={{ background: C.ink, color: "#ffffff", padding: "56px 24px 40px" }}>
      <a
        href="mailto:reonustudio@gmail.com"
        style={{ display: "block", fontSize: "clamp(18px, 5vw, 28px)", fontWeight: 700, letterSpacing: "-0.02em", color: "#ffffff", textDecoration: "none", marginBottom: 48, wordBreak: "break-all" }}
      >
        reonustudio@gmail.com
      </a>
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

export default function MobileStudio() {
  const { lang } = useLang();
  const ko = lang === "ko";

  return (
    <div className="lg:hidden font-headline" style={{ background: C.paper, color: C.ink }}>

      {/* ── Hero text (from StudioHeroIntro) ──────────────────────────────── */}
      <section style={{ minHeight: "60dvh", padding: "calc(64px + 48px) 24px 48px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ fontSize: "clamp(56px, 17vw, 88px)", fontWeight: 800, lineHeight: 0.95, letterSpacing: "-0.05em", marginBottom: 32 }}>
            REONU®
          </h1>
          <p style={{ fontSize: "clamp(15px, 4vw, 18px)", lineHeight: "170%", color: "#1D1D1F", fontWeight: 500, maxWidth: "90%" }}>
            <strong style={{ fontWeight: 800, letterSpacing: "-0.02em" }}>WE ARE REONU®</strong>
            {ko ? " — 브랜드 안에 이미 담겨 있는 가치를 발견하고 그것을 선명하고 확장 가능한 디자인으로 구현하는 디자인 스튜디오입니다."
                : " — a design studio that uncovers the value already held within a brand, and brings it to life as sharp, scalable design."
            }
          </p>
        </div>

        <Link href="/contact" style={{
          display: "inline-flex", alignItems: "center", gap: 10,
          background: C.ink, color: "#fff",
          padding: "16px 28px", borderRadius: 999,
          fontSize: 16, fontWeight: 700, letterSpacing: "-0.01em",
          textDecoration: "none", alignSelf: "flex-start", marginTop: 40,
        }}>
          {ko ? "함께 일하기" : "Work With Us"}
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M3 8h10M8 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </section>

      {/* ── Studio image ──────────────────────────────────────────────────── */}
      <div style={{ position: "relative", width: "100%", aspectRatio: "4/3", overflow: "hidden", background: C.panel }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/studio/contact-bg.jpg"
          alt="REONU Studio"
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", display: "block" }}
        />
      </div>

      {/* ── Our Values ────────────────────────────────────────────────────── */}
      <section style={{ padding: "72px 24px" }}>
        <SectionLabel>Our Values</SectionLabel>
        <div style={{ marginTop: 40, display: "flex", flexDirection: "column", gap: 0 }}>
          {VALUES.map((v, i) => (
            <div key={v.title}>
              {i > 0 && <Divider />}
              <div style={{ padding: "40px 0" }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 16 }}>
                  <h3 style={{ fontSize: "clamp(28px, 8vw, 40px)", fontWeight: 800, letterSpacing: "-0.04em", margin: 0, color: C.ink }}>
                    {v.title}
                  </h3>
                  <span style={{ fontSize: "clamp(13px, 3.5vw, 16px)", fontWeight: 600, color: C.muted, letterSpacing: "-0.01em" }}>
                    {v.ko_label}
                  </span>
                </div>
                <p style={{ fontSize: 15, lineHeight: "170%", color: "#000000b3", margin: 0 }}>
                  {v.desc[lang][0]}<br />{v.desc[lang][1]}
                </p>
              </div>
            </div>
          ))}
        </div>
        <Divider />
      </section>

      {/* ── Image strip (horizontal scroll) ───────────────────────────────── */}
      <div style={{ overflowX: "auto", display: "flex", gap: 12, padding: "0 24px 48px", scrollbarWidth: "none" }}>
        {[
          "/images/studio/studio-img1.jpg",
          "/images/studio/caroline-badran--Nw-XxktMVc-unsplash.jpg",
          "/images/studio/contact-bg.jpg",
          "/images/studio/caroline-badran-rHGfFRgu5zE-unsplash.jpg",
          "/images/studio/1.JPG",
        ].map((src, i) => (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            key={i}
            src={src}
            alt=""
            style={{ height: 200, width: "auto", flexShrink: 0, objectFit: "cover", borderRadius: 8 }}
          />
        ))}
      </div>

      {/* ── Careers section ───────────────────────────────────────────────── */}
      <section style={{ padding: "72px 24px" }}>
        <SectionLabel>Careers</SectionLabel>
        <h2 style={{ fontSize: "clamp(36px, 10vw, 56px)", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.1, margin: "16px 0 40px", color: C.ink, whiteSpace: "pre-line" }}>
          {ko ? "포트폴리오 &\n경력 사항" : "Portfolio &\nExperience"}
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: 48 }}>
          {JOBS.map((job) => (
            <div key={job.category}>
              <h3 style={{ fontSize: 18, fontWeight: 800, letterSpacing: "-0.02em", color: C.ink, marginBottom: 16 }}>
                {job.category}
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {job.items.map((item, i) => (
                  <p key={i} style={{ fontSize: 15, fontWeight: 500, color: "#000000b3", lineHeight: "150%", margin: 0 }}>
                    {item[lang]}
                  </p>
                ))}
              </div>
              <Divider />
            </div>
          ))}
        </div>

        <div style={{ marginTop: 48 }}>
          <Link href="/contact" style={{
            display: "inline-flex", alignItems: "center", gap: 10,
            background: C.ink, color: "#fff",
            padding: "16px 28px", borderRadius: 999,
            fontSize: 16, fontWeight: 700, letterSpacing: "-0.01em", textDecoration: "none",
          }}>
            {ko ? "문의하기" : "Get in Touch"}
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 8h10M8 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </section>

      <MobileFooter />
    </div>
  );
}
