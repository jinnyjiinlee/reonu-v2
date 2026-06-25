export const services = {
  bx: {
    title: "Branding",
    desc: {
      ko: ["브랜드의 본질을 선명한 시각 시스템으로 정립하고", "모든 채널에서 일관된 브랜드 경험을 만듭니다."],
      en: ["We define the essence of a brand through a clear", "visual system that works consistently everywhere."],
    },
    chips: [
      "Visual Identity System",
      "Logo & Mark Development",
      "Typography & Color System",
      "Guidelines & Asset Library",
      "Business Card Design",
    ],
  },
  uxui: {
    title: "UXUI",
    desc: {
      ko: ["구조적인 설계와 반응형 시스템을 바탕으로", "직관적이고 완성도 있는 디지털 경험을 디자인합니다."],
      en: ["Grounded in structural thinking and responsive systems,", "we design intuitive and polished digital experiences."],
    },
    chips: [
      "Website & Platform Design",
      "App Design",
      "User Interface Design",
      "Responsive Layouts",
      "Landing Page Design",
      "Service Flow Design",
    ],
  },
  edit: {
    title: "Editorial",
    desc: {
      ko: ["명확한 구조와 감각적인 비주얼로", "브랜드의 메시지를 인쇄물에 담아냅니다."],
      en: ["Built on clear structure and consistent visuals,", "we design print and promotional materials effectively."],
    },
    chips: [
      "Editorial Design",
      "Brochure & Guidebook",
      "Poster & Promotional Design",
      "Campaign Visuals",
      "Subtitle Design",
      "Promotional Collateral",
    ],
  },
};

export type ProcessStep = {
  num: string;
  title: string;
  image: string;
  desc: { ko: string[]; en: string[] };
  tags: string[];
};

export const processSteps: ProcessStep[] = [
  {
    num: "01",
    title: "Discovery",
    image: "/images/process/process-01-discovery.jpg",
    desc: {
      ko: ["프로젝트 목적과 필요한 작업 범위를 확인하고", "견적과 일정을 함께 조율합니다."],
      en: ["We clarify the project goals and scope,", "then align on budget and timeline together."],
    },
    tags: ["Consultation", "Scope Review"],
  },
  {
    num: "02",
    title: "Define",
    image: "/images/process/process-02-define.jpg",
    desc: {
      ko: ["작업에 필요한 자료와 리소스를 전달받고 프로젝트 방향을 구체화합니다.", "자료 준비가 어려운 경우 상담을 통해 도와드립니다."],
      en: ["We gather the necessary materials and resources,", "then shape the direction of the project together."],
    },
    tags: ["Preparation", "Planning"],
  },
  {
    num: "03",
    title: "Design",
    image: "/images/process/process-03-design.jpg",
    desc: {
      ko: ["1차 시안을 전달드린 후 피드백을 반영하여 수정 작업을 진행합니다.", "프로젝트 범위에 맞춰 완성도를 높여갑니다."],
      en: ["We deliver an initial concept, then refine it", "based on your feedback to raise the quality."],
    },
    tags: ["Design", "Refinement"],
  },
  {
    num: "04",
    title: "Deliver",
    image: "/images/process/process-04-deliver.jpg",
    desc: {
      ko: ["최종 시안 확정 후 파일을 전달드립니다.", "작업 완료 이후에도 필요한 문의나 추가 지원이 있으면 이어서 도와드립니다."],
      en: ["Final files are delivered after approval.", "We remain available for any follow-up questions or support."],
    },
    tags: ["Final Delivery", "Support"],
  },
];

export const partnersRowA = [
  { name: "KT", src: "/images/partners/kt.png" },
  { name: "LOTTE", src: "/images/partners/lotte.png" },
  { name: "Shinhan Financial Group", src: "/images/partners/shinhan.png" },
  { name: "KB Financial Group", src: "/images/partners/kb.png" },
  { name: "CJ ONSTYLE", src: "/images/partners/cjon.png" },
  { name: "TRIPPICK", src: "/images/partners/trippick.png" },
];

export const partnersRowB = [
  { name: "Ministry of Education", src: "/images/partners/moe.png" },
  { name: "Ministry of Culture", src: "/images/partners/mcst.png" },
  { name: "National Institute of Korean Language", src: "/images/partners/nikl.png" },
  { name: "Songpa-gu", src: "/images/partners/songpa.png" },
  { name: "King Sejong Institute", src: "/images/partners/sejong.png" },
  { name: "Seongnam Arts", src: "/images/partners/seongnam.png" },
  { name: "Ulju Mountain Film Festival", src: "/images/partners/gwangju-wmf.png" },
  { name: "Kookmin University", src: "/images/partners/knu.png" },
];
