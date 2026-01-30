import "./globals.css";
import NavBar from "@/app/components/layout/NavBar";
import Footer from "@/app/components/layout/Footer";
import { Poppins, Inter, JetBrains_Mono } from "next/font/google";
import GlobalModal from "@/app/components/modals/GlobalModal";
import { ModalProvider } from "@/app/hooks/useModal";
import { Toaster } from "sonner";
import Script from "next/script";
import { GA_TRACKING_ID } from "@/lib/utils/gtag";
import { siteUrl, siteTitle } from "@/lib/utils/constants";
import JsonLd from "@/app/components/JsonLd";
import { Suspense } from "react";
import GoogleAnalytics from "@/app/components/GoogleAnalytics";

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
  title: {
    default: `${siteTitle} — Government help, explained simply`,
    template: `%s • ${siteTitle}`,
  },
  description:
    "Step-by-step guides for SNAP, WIC, LIHEAP, Medicaid, and more — no jargon.",
  keywords: [
    "SNAP benefits",
    "food stamps",
    "WIC program",
    "LIHEAP",
    "Medicaid",
    "government assistance",
    "housing assistance",
    "Section 8",
    "benefit eligibility",
    "low income help",
    "SSI",
    "SSDI",
    "disability benefits",
  ],
  authors: [{ name: siteTitle, url: siteUrl }],
  creator: siteTitle,
  publisher: siteTitle,
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: siteTitle,
    locale: "en_US",
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
  alternates: {
    types: {
      "application/rss+xml": `${siteUrl}/rss.xml`,
    },
  },
} satisfies import("next").Metadata;

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#ffffff",
} satisfies import("next").Viewport;

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
        {/* Resource hints for GA */}
        <link
          rel="preconnect"
          href="https://www.google-analytics.com"
          crossOrigin=""
        />
        <link
          rel="preconnect"
          href="https://www.googletagmanager.com"
          crossOrigin=""
        />
        <link rel="dns-prefetch" href="//www.googletagmanager.com" />

        {/* Site verification */}
        <meta name="fo-verify" content="159ed184-dd4f-414f-adca-e688d3ddc0cc" />

        {/* GA4: load library + define gtag/dataLayer; DO NOT call 'config' here */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
          `}
        </Script>

        {/* reCAPTCHA */}
        <Script
          src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`}
          strategy="afterInteractive"
        />
        {/* Google Adsense */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6322184553331913"
          crossOrigin="anonymous"
        ></script>
      </head>

      <body>
        <ModalProvider>
          <NavBar />
          <GlobalModal />

          {/* Fire GA page_path on first paint + route/query changes */}
          <Suspense fallback={null}>
            <GoogleAnalytics />
          </Suspense>

          {/* Site-wide schema */}
          <JsonLd
            data={{
              "@context": "https://schema.org",
              "@type": "Organization",
              "@id": `${siteUrl}/#organization`,
              name: siteTitle,
              url: siteUrl,
              logo: {
                "@type": "ImageObject",
                url: `${siteUrl}/logo/blog_logo_dark.svg`,
                width: 512,
                height: 512,
              },
            }}
          />
          <JsonLd
            data={{
              "@context": "https://schema.org",
              "@type": "WebSite",
              "@id": `${siteUrl}/#website`,
              url: siteUrl,
              name: siteTitle,
              potentialAction: {
                "@type": "SearchAction",
                target: `${siteUrl}/search?q={search_term_string}`,
                "query-input": "required name=search_term_string",
              },
            }}
          />

          {children}
          <Toaster position="bottom-right" richColors />
          <Footer />
        </ModalProvider>
      </body>
    </html>
  );
}
