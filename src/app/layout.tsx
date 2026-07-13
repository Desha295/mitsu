import type { Metadata } from "next";
import { Inter, Cairo } from "next/font/google";
import { Providers } from "@/context/Providers";
import { BRAND_FULL_NAME, BRAND_NAME } from "@/constants/brand";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: `${BRAND_NAME} — ${BRAND_FULL_NAME}`,
  description:
    "One platform. One community. One trusted start for MUST IT freshmen.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // lang/dir start as en/ltr on the server; LanguageProvider corrects them
  // on the client from the stored preference to avoid SSR/client mismatch.
  return (
    <html
      lang="en"
      dir="ltr"
      className={`${inter.variable} ${cairo.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
