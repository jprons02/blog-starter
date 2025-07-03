import "./globals.css";
import NavBar from "@/app/components/layout/NavBar";
import Footer from "@/app/components/layout/Footer";
import { Poppins, Inter, JetBrains_Mono } from "next/font/google";
import GlobalModal from "@/app/components/modals/GlobalModal";
import { ModalProvider } from "@/app/hooks/useModal";
import { Toaster } from "sonner";
import Script from "next/script";
import { GA_TRACKING_ID } from "@/lib/utils/gtag";
import GoogleAnalytics from "@/app/components/GoogleAnalytics";
import { Suspense } from "react";
import { siteUrl } from "@/lib/utils/constants";

const poppins = Poppins({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
  weight: ["600"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  metadataBase: new URL(siteUrl),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${inter.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <meta name="robots" content="index, follow" />
        <meta name="fo-verify" content="159ed184-dd4f-414f-adca-e688d3ddc0cc" />
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${GA_TRACKING_ID}', {
        page_path: window.location.pathname,
      });
    `}
        </Script>
        <Script
          src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`}
          strategy="afterInteractive"
        />
      </head>
      <script
        src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`}
        async
        defer
      ></script>
      <body>
        <ModalProvider>
          <NavBar />
          <GlobalModal />
          {children}
          <Toaster position="bottom-right" richColors />
          <Footer />
        </ModalProvider>
        <Suspense fallback={null}>
          <GoogleAnalytics />
        </Suspense>
      </body>
    </html>
  );
}
