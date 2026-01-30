// app/locations/page.tsx
import Link from "next/link";
import { getAllLocations } from "@/app/locations/_locationsData";
import { siteTitle, siteUrl } from "@/lib/utils/constants";
import JsonLd from "@/app/components/JsonLd";

// Force the generic social image for this listing page
const ogImage = `${siteUrl}/og/default.jpg`;

export const metadata = {
  title: "Locations",
  description:
    "Browse My Gov Blog by city and state for local government assistance articles, resources, and FAQs.",
  alternates: { canonical: `${siteUrl}/locations` },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: `${siteUrl}/locations`,
    siteName: siteTitle,
    title: "Locations — Browse Local Government Assistance Guides",
    description:
      "Browse My Gov Blog by city and state for local government assistance articles, resources, and FAQs.",
    locale: "en_US",
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: "Browse locations on My Gov Blog",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Locations — Browse Local Government Assistance Guides",
    description:
      "Browse My Gov Blog by city and state for local government assistance articles, resources, and FAQs.",
    images: [ogImage],
  },
};

export default function LocationsIndex() {
  const locs = getAllLocations();

  // Group cities by state slug, keep both city (slug) and cityName (display)
  const byState = locs.reduce<
    Record<string, { city: string; cityName: string; state: string }[]>
  >((acc, l) => {
    (acc[l.state] ||= []).push({
      city: l.city, // slug for linking
      cityName: l.cityName, // display name for HTML
      state: l.state,
    });
    return acc;
  }, {});

  // Map of state slug -> display name (e.g., "california" -> "California")
  const stateNames: Record<string, string> = Object.fromEntries(
    locs.map((l) => [l.state, l.stateName]),
  );

  const canonical = `${siteUrl}/locations`;

  return (
    <>
      {/* Breadcrumbs JSON-LD */}
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "@id": `${canonical}#breadcrumbs`,
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Home",
              item: { "@type": "WebPage", "@id": siteUrl },
            },
            {
              "@type": "ListItem",
              position: 2,
              name: "Locations",
              item: { "@type": "WebPage", "@id": canonical },
            },
          ],
        }}
      />

      {/* CollectionPage JSON-LD */}
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "@id": `${canonical}#collection`,
          name: "Locations — Browse Local Government Assistance Guides",
          url: canonical,
          description:
            "Browse My Gov Blog by city and state for local government assistance articles, resources, and FAQs.",
          primaryImageOfPage: {
            "@type": "ImageObject",
            url: ogImage,
            width: 1200,
            height: 630,
          },
        }}
      />

      <main className="max-w-3xl mx-auto px-4 py-8 sm:py-16 locations-page">
        <header className="mb-6">
          <h1
            className="text-3xl font-bold mb-6"
            style={{ color: "var(--color-primary)" }}
          >
            Locations
          </h1>
          <p className="text-[var(--color-muted-text)] mt-2">
            Explore My Gov Blog by city and state to view helpful articles with
            local links and FAQs tailored to your location.
          </p>
        </header>

        <div className="space-y-8">
          {Object.keys(byState)
            .sort() // sort by state slug; swap with stateNames if you prefer alpha by display name
            .map((state) => (
              <section key={state}>
                <h2 className="text-xl font-semibold mb-3">
                  {stateNames[state] ?? state}
                </h2>
                <ul className="grid sm:grid-cols-2 gap-2">
                  {byState[state]
                    .slice()
                    .sort((a, b) => a.cityName.localeCompare(b.cityName))
                    .map(({ city, cityName }) => (
                      <li key={city} className="underline">
                        <Link
                          href={`/locations/${state}/${city}`}
                          className="hover:text-[var(--color-primary)]"
                        >
                          {cityName}
                        </Link>
                      </li>
                    ))}
                </ul>
              </section>
            ))}
        </div>
      </main>
    </>
  );
}
