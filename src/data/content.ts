export const services = {
  bx: {
    title: "BX Design",
    desc: [
      "브랜드의 본질을 명확한 시각 시스템으로 정립하고",
      "브랜드가 어디서나 일관되게 작동하도록 설계합니다.",
    ],
    chips: [
      "Visual Identity System",
      "Logo & Mark Development",
      "Typography & Color System",
      "Guidelines & Asset Library",
      "Business Card Design",
    ],
  },
  uxui: {
    title: "UXUI Design",
    desc: [
      "구조적인 설계와 반응형 시스템을 바탕으로",
      "직관적이고 완성도 있는 디지털 경험을 디자인합니다.",
    ],
    chips: [
      "Website & Platform Design",
      "User Interface Design",
      "Responsive Layouts",
      "Landign Page Desgin",
      "Service Flow Desgin",
    ],
  },
  edit: {
    title: "EDIT Design",
    desc: [
      "명확한 구조와 일관된 비주얼을 바탕으로",
      "인쇄물과 홍보물을 효과적으로 디자인합니다.",
    ],
    chips: [
      "Editorial Design",
      "Brochure & Guidebook",
      "Poster & Promotional Design",
      "Campaign Visuals",
      "Promotional Collateral",
    ],
  },
};

export type ProcessStep = {
  num: string;
  title: string;
  image: string;
  desc: string[];
  tags: string[];
};

export const processSteps: ProcessStep[] = [
  {
    num: "01",
    title: "Discovery",
    image: "/images/process/process-01-discovery.png",
    desc: [
      "프로젝트 목적과 필요한 작업 범위를 확인하고",
      "견적과 일정을 함께 조율합니다.",
    ],
    tags: ["Consultation", "Scope Review"],
  },
  {
    num: "02",
    title: "Define",
    image: "/images/process/process-02-define.png",
    desc: [
      "작업에 필요한 자료와 리소스를 전달받고 프로젝트 방향을 구체화합니다.",
      "자료 준비가 어려운 경우 상담을 통해 도와드립니다.",
    ],
    tags: ["Preparation", "Planning"],
  },
  {
    num: "03",
    title: "Design",
    image: "/images/process/process-03-design.png",
    desc: [
      "1차 시안을 전달드린 후 피드백을 반영하여 수정 작업을 진행합니다.",
      "프로젝트 범위에 맞춰 완성도를 높여갑니다.",
    ],
    tags: ["Design", "Refinement"],
  },
  {
    num: "04",
    title: "Deliver",
    image: "/images/process/process-04-deliver.png",
    desc: [
      "최종 시안 확정 후 파일을 전달드립니다.",
      "작업 완료 이후에도 필요한 문의나 추가 지원이 있으면 이어서 도와드립니다.",
    ],
    tags: ["Final Delivery", "Support"],
  },
];

export const partnersRowA = [
  { name: "KT", src: "/images/partners/kt.png" },
  { name: "LOTTE", src: "/images/partners/lotte.png" },
  { name: "Shinhan", src: "/images/partners/shinhan.png" },
  { name: "KB", src: "/images/partners/kb.png" },
  { name: "CJ ONSTYLE", src: "/images/partners/cjon.png" },
  { name: "DayFocusLab", src: "/images/partners/dayfocuslab.png" },
  { name: "TRIP PICK", src: "/images/partners/trippick.png" },
];

export const partnersRowB = [
  { name: "MOE", src: "/images/partners/moe.png" },
  { name: "MCST", src: "/images/partners/mcst.png" },
  { name: "NIKL", src: "/images/partners/nikl.png" },
  { name: "Songpa-gu", src: "/images/partners/songpa.png" },
  { name: "Sejong Institute", src: "/images/partners/sejong.png" },
  { name: "Seongnam Arts", src: "/images/partners/seongnam.png" },
  { name: "Gwangju WMF", src: "/images/partners/gwangju-wmf.png" },
  { name: "KNU", src: "/images/partners/knu.png" },
];
