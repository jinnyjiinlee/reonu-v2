import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import CustomCursor from "@/components/CustomCursor";
import { LanguageProvider } from "@/context/LanguageContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "block",
  preload: true,
});

export const metadata: Metadata = {
  title: "REONU — Turns On The Value Within Your Brand",
  description:
    "REONU is a design studio dedicated to uncovering the value already within a brand and turning it into clear, scalable design.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <head>
        {/* Tell the browser this page is light-only so Chrome's auto-dark-mode
            (if enabled at the OS/browser level) doesn't repaint the white
            page background as gray. */}
        <meta name="color-scheme" content="light only" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter+Display:ital,opsz,wght@0,32..144,100..900;1,32..144,100..900&display=block"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css"
        />
      </head>
      <body className={`${inter.variable} antialiased`}>
        {/* Full-viewport white backdrop — guarantees the page background stays
            pure white edge-to-edge (including the side margins outside the
            centered 1920px canvas on screens wider than 1920px), regardless
            of scroll position. Sits below every other layer (z-index -1). */}
        <div aria-hidden className="fixed inset-0 -z-10 bg-white" />
        <LanguageProvider>
          <CustomCursor />
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
