export default function Header() {
  const linkBase =
    "font-display text-[20px] leading-[24px] font-normal tracking-[-0.01em] text-[#1F1F1F] hover:opacity-60 transition-opacity";

  return (
    <header className="absolute top-0 left-0 right-0 z-50 h-[100px]">
      <div className="relative h-full w-full">
        {/* Brand — REONU Bold */}
        <div
          className="absolute top-[39px] left-[60px] font-display text-[20px] leading-[24px] font-bold tracking-[-0.01em] text-[#1F1F1F]"
        >
          REONU
        </div>

        {/* Tagline — #757575 Regular */}
        <div
          className="absolute top-[39px] left-[868px] font-display text-[20px] leading-[24px] font-normal tracking-[-0.01em] text-[#757575]"
        >
          TURN U BRAND ON
        </div>

        {/* Nav — WORKS active (underline), EN underline */}
        <nav className="absolute top-[39px] right-[60px] flex items-center gap-[60px]">
          <a href="#works" className={`${linkBase} underline underline-offset-4`}>
            WORKS
          </a>
          <a href="#studio" className={linkBase}>
            STUDIO
          </a>
          <a href="#contact" className={linkBase}>
            CONTACT
          </a>
          <button className={`${linkBase} underline underline-offset-4`}>
            EN
          </button>
        </nav>
      </div>
    </header>
  );
}
