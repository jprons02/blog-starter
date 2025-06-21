import "./globals.css";
import NavBar from "@/app/components/NavBar";
import Footer from "@/app/components/Footer";
import { Poppins, Inter, JetBrains_Mono } from "next/font/google";
import ContactModal from "@/app/components/ContactModal";
import { ContactModalProvider } from "@/app/hooks/useContactModal";
import { Toaster } from "sonner";
import Script from "next/script";
import { GA_TRACKING_ID } from "@/lib/gtag";
import GoogleAnalytics from "@/app/components/GoogleAnalytics";
import { Suspense } from "react";

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
        {/* Google Analytics Script (loads gtag.js) */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
          strategy="afterInteractive"
        />
        {/* Google Analytics config */}
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
      </head>
      {/* ✅ Load reCAPTCHA v3 script */}
      <script
        src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`}
        async
        defer
      ></script>
      <body>
        <ContactModalProvider>
          <NavBar />
          <ContactModal />
          {children}
          <Toaster position="bottom-right" richColors />
          <Footer />
        </ContactModalProvider>
        <Suspense fallback={null}>
          <GoogleAnalytics />
        </Suspense>
      </body>
    </html>
  );
}
