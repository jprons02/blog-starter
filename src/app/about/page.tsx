// app/about/page.tsx — stays server component (no 'use client')
import { siteTitle, siteUrl } from "@/lib/utils/constants";
import AboutClient from "./AboutClient";

export const metadata = {
  title: `About Us | ${siteTitle}`,
  description: "Learn more about the mission behind My Gov Blog.",
  alternates: {
    canonical: `${siteUrl}/about`,
  },
  openGraph: {
    title: `About Us | ${siteTitle}`,
    description: "Learn more about the mission behind My Gov Blog.",
    type: "website",
    url: `${siteUrl}/about`,
  },
};

export default function AboutPage() {
  return <AboutClient />;
}
