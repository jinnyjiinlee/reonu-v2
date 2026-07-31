export const services = {
  bx: {
    title: "Brand",
    desc: {
      ko: ["브랜드의 본질을 선명한 시각 시스템으로 정립하고", "모든 채널에서 일관된 브랜드 경험을 만듭니다."],
      en: ["We define the essence of a brand through a clear", "visual system that works consistently everywhere."],
    },
    chips: [
      "Branding Design",
      "Visual Identity System",
      "Logo & Mark Development",
      "Typography & Color System",
      "Guidelines & Asset Library",
      "Business Card Design",
    ],
  },
  uxui: {
    title: "Digital",
    desc: {
      ko: ["구조적인 설계와 반응형 시스템을 바탕으로", "직관적이고 완성도 있는 디지털 경험을 디자인합니다."],
      en: ["Grounded in structural thinking and responsive", "systems, we design intuitive and polished digital experiences."],
    },
    chips: [
      "UXUI Design",
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
      ko: ["무엇을 만들어야 하는지, 왜 필요한지부터 함께 이야기합니다.", "올바른 방향을 잡는 것이 좋은 결과물의 첫 번째 조건입니다."],
      en: ["We clarify the project goals and scope,", "then align on budget and timeline together."],
    },
    tags: ["Consultation", "Scope Review"],
  },
  {
    num: "02",
    title: "Define",
    image: "/images/process/process-02-define.jpg",
    desc: {
      ko: ["방향이 정해지면 필요한 것들을 구체적으로 준비합니다.", "자료를 함께 정리하고 일정과 범위를 확정해나갑니다."],
      en: ["We gather the necessary materials and resources,", "then shape the direction of the project together."],
    },
    tags: ["Preparation", "Planning"],
  },
  {
    num: "03",
    title: "Design",
    image: "/images/process/process-03-design.jpg",
    desc: {
      ko: ["아이디어가 처음으로 눈에 보이는 형태를 갖춥니다.", "시안을 함께 검토하고 피드백을 반영해 완성도를 높여갑니다."],
      en: ["We deliver an initial concept, then refine it", "based on your feedback to raise the quality."],
    },
    tags: ["Design", "Refinement"],
  },
  {
    num: "04",
    title: "Deliver",
    image: "/images/process/process-04-deliver.jpg",
    desc: {
      ko: ["최종 결과물을 확인하고 모든 파일을 전달드립니다.", "작업이 마무리된 이후에도 필요한 것이 있다면 언제든 함께합니다."],
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
