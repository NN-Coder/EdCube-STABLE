import type { Metadata } from "next";
import { Orbitron } from "next/font/google";
import "./globals.css";

import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SpaceCanvas } from "@/components/background/SpaceCanvas";
import { AnalyticsProvider } from "@/components/analytics-provider";

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EdCube | Amazing Free Games",
  description:
    "Your ultimate destination for gaming. Unlimited online free games!",
  openGraph: {
    title: "EdCube | Amazing Free Games",
    description:
      "Your ultimate destination for gaming. Unlimited online free games!",
    type: "website",
  },
  robots: "index, follow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${orbitron.variable} dark h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <link rel="icon" href="/logo.jpg" type="image/jpeg" />
        <script src="https://5gvci.com/act/files/tag.min.js?z=11048548" data-cfasync="false" async />
        <script dangerouslySetInnerHTML={{ __html: `(function(s){s.dataset.zone='11048566',s.src='https://n6wxm.com/vignette.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))` }} />
        <script dangerouslySetInnerHTML={{ __html: `(function(s){s.dataset.zone='11048579',s.src='https://nap5k.com/tag.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))` }} />
      </head>
      <body
        className="min-h-screen font-heading antialiased flex flex-col overflow-x-hidden"
        style={{ background: "linear-gradient(135deg, #1a0a2a, #0a0a1a, #05010a)" }}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          forcedTheme="dark"
          disableTransitionOnChange
        >
          <SpaceCanvas />
          <AnalyticsProvider />
          <Header />
          <main className="flex-1 relative z-10">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
