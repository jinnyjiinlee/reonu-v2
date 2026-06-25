// Plain data module — deliberately NOT "use client". WorksContent.tsx is a
// client component, and importing data from a "use client" file into a
// Server Component (like the works/[id] detail route's generateStaticParams)
// turns every export into an opaque client reference, breaking plain
// array/object usage at build/server time ("WORKS_DATA.map is not a
// function"). Keeping the data here lets both server and client code import
// it safely.

export type Category = "UX/UI" | "Branding" | "Editorial";
export const CATEGORIES = ["All", "UX/UI", "Branding", "Editorial"] as const;
export type Filter = (typeof CATEGORIES)[number];

// Wording based on OurService's BX/UXUI/EDIT naming, "Design" dropped for
// scannable filter tabs.
export const CATEGORY_LABELS: Record<Filter, string> = {
  All: "All",
  "UX/UI": "UXUI",
  Branding: "BX",
  Editorial: "EDIT",
};

export interface Localized {
  ko: string;
  en: string;
}

export interface WorkItem {
  id: string;
  category: Category;
  title: Localized;
  description: Localized;
  image: string;
}

// Real project data (from projects_master_en / projects_master_kr spreadsheets).
// No production images exist yet for these projects, so the 4 mockup images
// cycle across all 26 — swap in real thumbnails per project when available.
export const IMAGES = [
  "/images/works/work-01.png",
  "/images/works/work-02.png",
  "/images/works/work-03.png",
  "/images/works/work-04.png",
];

const RAW_WORKS: Omit<WorkItem, "image">[] = [
  { id: "project01", category: "UX/UI", title: { en: "KT New Platform (momo)", ko: "KT New Platform (momo)" },
    description: { en: "This UX/UI project focused on organizing service experience through platform structure and user flow.",
                    ko: "플랫폼 구조와 사용자 흐름을 중심으로\n서비스 경험을 정리한 UX/UI 구축 프로젝트입니다." } },
  { id: "project02", category: "UX/UI", title: { en: "Lotte Insurance Wonder", ko: "롯데손해보험 Wonder" },
    description: { en: "This UX/UI project was designed to make insurance service\nstructure and screen flow more user-friendly.",
                    ko: "보험 서비스의 정보 구조와\n화면 흐름을 사용자 친화적으로 설계한 UXUI 구축 프로젝트입니다." } },
  { id: "project03", category: "UX/UI", title: { en: "Shinhan Card SOL", ko: "신한카드 SOL" },
    description: { en: "This financial platform project refined UI consistency and user experience across both build and operation phases.",
                    ko: "서비스 구축과 운영 흐름 안에서 UI 일관성과 사용자 경험을 함께 정리한 금융 플랫폼 프로젝트입니다." } },
  { id: "project04", category: "UX/UI", title: { en: "Shinhan Asset Management Platform Operation", ko: "신한자산운용 플랫폼 운영" },
    description: { en: "This project focused on maintaining and improving platform usability while supporting stable operation.",
                    ko: "기존 플랫폼의 사용성과 안정성을 함께 고려하며 안정적으로 화면을 관리·개선한 프로젝트입니다." } },
  { id: "project05", category: "UX/UI", title: { en: "KB Securities Platform Operation", ko: "KB증권 플랫폼 운영" },
    description: { en: "This project maintained clear information hierarchy and user experience to support a stable service experience during operation.",
                    ko: "운영 단계에서 필요한 정보 위계와 화면 체계를 유지하며 서비스 경험을 정돈한 프로젝트입니다." } },
  { id: "project06", category: "UX/UI", title: { en: "KB Asset Management Platform Operation", ko: "KB자산운용 플랫폼 운영" },
    description: { en: "This platform operation project balanced brand consistency and usability across service screens.",
                    ko: "플랫폼 운영 과정에서 브랜드 일관성과 사용성을 함께 고려하며 화면을 관리한 디지털 디자인 프로젝트입니다." } },
  { id: "project07", category: "UX/UI", title: { en: "CJ OnStyle Operation Design", ko: "CJ온스타일 운영 디자인" },
    description: { en: "This digital design project aligned operational screens with brand tone and user flow.",
                    ko: "운영 중심의 서비스 화면을 브랜드 톤과 사용자 흐름에 맞게 정돈한 디지털 디자인 프로젝트입니다." } },
  { id: "project08", category: "UX/UI", title: { en: "LASH Website Redesign", ko: "LASH 웹사이트 리디자인" },
    description: { en: "This responsive website redesign project improved both brand presence and user experience.",
                    ko: "기존 웹사이트를 재구성해 브랜드 인상과 사용성을 동시에 개선한 반응형 웹 리디자인 프로젝트입니다." } },
  { id: "project09", category: "UX/UI", title: { en: "Ttareungyi Mobile Redesign", ko: "따릉이 모바일 리디자인" },
    description: { en: "This redesign project restructured mobile usability, feature accessibility, and visual flow.",
                    ko: "모바일 사용성을 중심으로 기능 접근성과 시각적 흐름을 재정리한 리디자인 프로젝트입니다." } },
  { id: "project10", category: "UX/UI", title: { en: "Soram Korean Medicine Hospital Website Redesign", ko: "소람한방병원 웹사이트 리디자인" },
    description: { en: "This medical website redesign project focused on clear information delivery and a trustworthy brand experience.",
                    ko: "정보 전달의 명확성과 브랜드 신뢰감을 함께 고려해 의료 웹사이트 경험을 재구성한 프로젝트입니다." } },
  { id: "project11", category: "Branding", title: { en: "REONU Branding", ko: "REONU 브랜딩" },
    description: { en: "This identity project defined the brand's direction and impression, expanding across logo, app icon, typography & color, guidelines, and collateral.",
                    ko: "브랜드의 방향성과 인상을 정리하고, 로고·앱 아이콘·타이포그래피·컬러 시스템까지 확장한 아이덴티티 디자인 프로젝트입니다." } },
  { id: "project12", category: "Branding", title: { en: "DayFocusLab Branding", ko: "DayFocusLab 브랜딩" },
    description: { en: "This identity project established a clear brand foundation through logo, app icon, color system, guidelines, and collateral.",
                    ko: "로고, 앱 아이콘, 컬러 시스템, 가이드라인, 브랜드 응용물까지 연결한 브랜드의 기준을 정리한 프로젝트입니다." } },
  { id: "project13", category: "Branding", title: { en: "Onsaemiro Agency Branding", ko: "Onsaemiro Agency 브랜딩" },
    description: { en: "This branding project clarified the agency's core identity and built a system that could extend consistently across touchpoints.",
                    ko: "브랜드의 기본 인상을 선명하게 정리하고 다양한 접점에서 일관되게 확장될 수 있도록 아이덴티티를 디자인한 프로젝트입니다." } },
  { id: "project14", category: "Branding", title: { en: "ICION Service Design & Branding", ko: "아이시온 서비스 디자인 및 브랜딩" },
    description: { en: "This startup branding project combined service planning, MVP app design, visual identity, and content design.",
                    ko: "서비스 기획과 MVP 앱 디자인, 브랜드 아이덴티티와 콘텐츠 디자인까지 함께 진행한 스타트업 브랜딩 프로젝트입니다." } },
  { id: "project15", category: "Branding", title: { en: "Tripick Character & Business Card Design", ko: "Tripick 캐릭터·명함 디자인" },
    description: { en: "This project developed a small but memorable brand presence through character and business card design.",
                    ko: "브랜드 캐릭터와 명함 디자인을 함께 구성해 작고 명확한 브랜드 인상을 만드는 방향으로 전개한 프로젝트입니다." } },
  { id: "project16", category: "Editorial", title: { en: "Ministry of Education Mental Health Guidebook", ko: "교육부 정신건강 가이드북" },
    description: { en: "This guidebook project organized complex information into a clear and stable editorial structure.",
                    ko: "정보량이 많은 내용을 체계적으로 읽기 쉽고 안정감 있게 전달한 가이드북 디자인 프로젝트입니다." } },
  { id: "project17", category: "Editorial", title: { en: "International Mountain Film Festival Guest Guidebook", ko: "국제산악영화제 게스트 가이드북" },
    description: { en: "This guest guidebook project structured operational information so it could be understood at a glance.",
                    ko: "행사 운영에 필요한 정보를 한눈에 이해할 수 있게 정리한 게스트 가이드북 디자인 프로젝트입니다." } },
  { id: "project18", category: "Editorial", title: { en: "Kookmin University Graduate School of Design Promotional Materials", ko: "국민대학교 디자인대학원 홍보물" },
    description: { en: "This project organized brochures and leaflets to communicate the institution's image in a stable and refined way.",
                    ko: "교육기관의 이미지를 안정적으로 전달할 수 있도록 브로슈어와 리플렛 중심으로 정리한 프로젝트입니다." } },
  { id: "project19", category: "Editorial", title: { en: "Recital Leaflet & Poster Design", ko: "리사이틀 리플렛 및 포스터 디자인" },
    description: { en: "This project translated the mood of the performance and the performer's identity into leaflets and posters.",
                    ko: "공연의 분위기와 연주자의 인상을 시각적으로 정리해 리플렛과 포스터로 확장한 프로젝트입니다." } },
  { id: "project20", category: "Editorial", title: { en: "Songpa-gu New Business Promotional Materials", ko: "송파구청 신사업 홍보물" },
    description: { en: "This public promotion project expanded core messages into multiple communication materials.",
                    ko: "공공사업의 핵심 메시지를 명확하게 전달할 수 있도록 다양한 홍보물로 확장한 프로젝트입니다." } },
  { id: "project21", category: "Editorial", title: { en: "WEE Center Dubee Classroom Promotional Materials", ko: "Wee센터 두비교실 홍보물" },
    description: { en: "This project organized posters, leaflets, and information materials into one consistent promotional flow.",
                    ko: "포스터, 리플렛, 안내물 등을 하나의 흐름으로 정리해 프로그램 인지도를 높인 홍보물 디자인 프로젝트입니다." } },
  { id: "project22", category: "Editorial", title: { en: "Art Factory Seongnam Promotional Materials", ko: "예술공장성남 홍보물" },
    description: { en: "This project designed posters, banners, and promotional materials to reflect the character of the event and space.",
                    ko: "행사와 공간의 성격이 잘 드러나도록 포스터, 배너, 홍보물 전반을 정리한 프로젝트입니다." } },
  { id: "project23", category: "Editorial", title: { en: "Dankook University Graduate School of Culture and Arts Promotional Poster", ko: "단국대학교 문화예술대학원 홍보 포스터" },
    description: { en: "This promotional poster project highlighted the mood and program identity of the graduate school.",
                    ko: "문화예술대학원의 분위기와 프로그램 성격이 잘 드러나도록 구성한 홍보 포스터 프로젝트입니다." } },
  { id: "project24", category: "Editorial", title: { en: "Korean Language Institute Promotional Poster", ko: "국어문화원 홍보 포스터" },
    description: { en: "This poster project presented program information in a direct and accessible way.",
                    ko: "행사와 프로그램 정보를 직관적으로 전달할 수 있도록 구성한 홍보 포스터 디자인 프로젝트입니다." } },
  { id: "project25", category: "Editorial", title: { en: "Local Humanities Center Lecture Web Poster", ko: "지역인문학센터 강연 웹포스터" },
    description: { en: "This web poster project was designed for quick recognition of lecture information in digital environments.",
                    ko: "강연 정보를 온라인 환경에서 빠르게 인지할 수 있도록 정리한 웹포스터 디자인 프로젝트입니다." } },
  { id: "project26", category: "Editorial", title: { en: "Korean Language Institute Card News", ko: "국어문화원 카드뉴스" },
    description: { en: "This card news project organized content and visual flow to communicate short information clearly.",
                    ko: "짧은 정보 단위를 명확하게 전달할 수 있도록 시각적 흐름과 콘텐츠 구조를 정리한 카드뉴스 프로젝트입니다." } },
];

export const WORKS_DATA: WorkItem[] = RAW_WORKS.map((w, i) => ({ ...w, image: IMAGES[i % IMAGES.length] }));
