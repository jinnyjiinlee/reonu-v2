"use client";
import { createContext, useContext, useState } from "react";

type Lang = "ko" | "en";

const LanguageContext = createContext<{
  lang: Lang;
  toggle: () => void;
}>({ lang: "ko", toggle: () => {} });

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>("ko");
  const toggle = () => setLang((l) => (l === "ko" ? "en" : "ko"));
  return (
    <LanguageContext.Provider value={{ lang, toggle }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  return useContext(LanguageContext);
}
