import "./globals.css";
import NavBar from "@/app/components/layout/NavBar";
import Footer from "@/app/components/layout/Footer";
import { Poppins, Inter, JetBrains_Mono } from "next/font/google";
import GlobalModal from "@/app/components/modals/GlobalModal";
import { ModalProvider } from "@/app/hooks/useModal";
import { Toaster } from "sonner";
import Script from "next/script";
import { GA_TRACKING_ID } from "@/lib/utils/gtag";
import { siteUrl } from "@/lib/utils/constants";

// fonts
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

// Global site defaults
export const metadata = {
  metadataBase: new URL(siteUrl), // e.g., "https://mygovblog.com"
  title: {
    default: "MyGovBlog — Government help, explained simply",
    template: "%s • MyGovBlog",
  },
  description:
    "Step‑by‑step guides for SNAP, WIC, LIHEAP, Medicaid, and more — no jargon.",
  // Optional global social defaults; per‑post overrides will come from generateMetadata
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "MyGovBlog",
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: { index: true, follow: true }, // robots.txt still the source of truth; this is a helpful hint
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
        {/* Resource hints for GA (optional but nice) */}
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

        {/* Site verification you already had */}
        <meta name="fo-verify" content="159ed184-dd4f-414f-adca-e688d3ddc0cc" />

        {/* GA4 - keep ONLY ONE approach. If you keep this, remove your <GoogleAnalytics /> component */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_TRACKING_ID}', { anonymize_ip: true, page_path: window.location.pathname });
          `}
        </Script>

        {/* reCAPTCHA — keep only this include */}
        <Script
          src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`}
          strategy="afterInteractive"
        />
      </head>

      {/* REMOVE the duplicate raw <script> for reCAPTCHA */}

      <body>
        <ModalProvider>
          <NavBar />
          <GlobalModal />
          {children}
          <Toaster position="bottom-right" richColors />
          <Footer />
        </ModalProvider>

        {/* If you prefer to keep a <GoogleAnalytics /> component instead of the inline gtag above,
            then REMOVE the GA <Script> tags in <head> and just render the component here.
            Don't do both. */}
        {/* <Suspense fallback={null}>
          <GoogleAnalytics />
        </Suspense> */}
      </body>
    </html>
  );
}
