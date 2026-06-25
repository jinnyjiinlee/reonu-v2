export default function SectionLabel({
  num,
  top,
}: {
  num: string;
  top: number;
}) {
  return (
    <div
      className="absolute font-headline text-[16px] leading-[19px] font-normal tracking-[-0.01em] text-[#86868B]"
      style={{ right: 60, top }}
    >
      ({num})
    </div>
  );
}
