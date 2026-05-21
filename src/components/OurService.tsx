import { services } from "@/data/content";

function Chip({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center h-[40px] px-[16px] rounded-full border border-[#1F1F1F] font-display text-[20px] leading-[24px] font-normal tracking-[-0.005em] text-[#1F1F1F] bg-white">
      {label}
    </span>
  );
}

function ServiceRow({
  title,
  desc,
  chips,
  top,
}: {
  title: string;
  desc: string[];
  chips: string[];
  top: number;
}) {
  return (
    <>
      <h3
        className="absolute font-display text-[40px] leading-[48px] font-bold tracking-[-0.03em] text-[#1F1F1F]"
        style={{ left: 960, top }}
      >
        {title}
      </h3>
      <p
        className="absolute font-display text-[18px] leading-[22px] font-medium tracking-[-0.005em] text-[#757575]"
        style={{ left: 960, top: top + 65, width: 400 }}
      >
        {desc[0]}
        <br />
        {desc[1]}
      </p>
      <div
        className="absolute flex flex-wrap gap-x-[8px] gap-y-[16px]"
        style={{ left: 960, top: top + 144, width: 900 }}
      >
        {chips.map((c) => (
          <Chip key={c} label={c} />
        ))}
      </div>
    </>
  );
}

export default function OurService() {
  return (
    <>
      <h2
        className="absolute font-display text-[64px] leading-[77px] font-bold tracking-[-0.03em] text-[#1F1F1F]"
        style={{ left: 60, top: 2476 }}
      >
        Our Service
      </h2>

      {/* Left intro — Figma: Apple SD Gothic Neo Medium 18px #444444 */}
      <p
        className="absolute font-display text-[18px] leading-[22px] font-medium tracking-[-0.005em] text-[#444444]"
        style={{ left: 60, top: 3375, width: 280 }}
      >
        다양한 브랜드들과 함께
        <br />
        폭넓은 디자인 서비스를 제공합니다.
      </p>

      <a
        href="#contact"
        className="absolute font-display text-[28px] leading-[34px] font-normal tracking-[-0.01em] text-[#1F1F1F] underline underline-offset-4 hover:opacity-60"
        style={{ left: 60, top: 3461 }}
      >
        →&nbsp;&nbsp;Start Project
      </a>

      <ServiceRow
        title={services.bx.title}
        desc={services.bx.desc}
        chips={services.bx.chips}
        top={2578}
      />
      <ServiceRow
        title={services.uxui.title}
        desc={services.uxui.desc}
        chips={services.uxui.chips}
        top={2917}
      />
      <ServiceRow
        title={services.edit.title}
        desc={services.edit.desc}
        chips={services.edit.chips}
        top={3256}
      />
    </>
  );
}
