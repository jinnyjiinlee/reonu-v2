export default function SectionLabel({
  num,
  top,
}: {
  num: string;
  top: number;
}) {
  return (
    <div
      className="absolute font-display text-[16px] leading-[19px] font-normal tracking-[-0.01em] text-[#999999]"
      style={{ right: 60, top }}
    >
      ({num})
    </div>
  );
}
