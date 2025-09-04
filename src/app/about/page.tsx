// app/about/page.tsx — stays server component (no 'use client')
import { siteTitle, siteUrl, siteImage } from "@/lib/utils/constants";
import AboutClient from "./AboutClient";

const ogImage = `${siteUrl}${siteImage}`;

export const metadata = {
  title: `About Us`,
  description: "Learn more about the mission behind My Gov Blog.",
  alternates: {
    canonical: `${siteUrl}/about`,
  },
  robots: { index: true, follow: true },
  openGraph: {
    title: `About Us`,
    description: "Learn more about the mission behind My Gov Blog.",
    type: "website",
    url: `${siteUrl}/about`,
    siteName: siteTitle,
    images: [
      { url: ogImage, width: 1200, height: 630, alt: "About My Gov Blog" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `About Us`,
    description: "Learn more about the mission behind My Gov Blog.",
    images: [ogImage],
  },
};

export default function AboutPage() {
  return <AboutClient />;
}
