// app/locations/page.tsx
import Link from "next/link";
import { getAllLocations } from "@/app/locations/_locationsData";
import { siteTitle, siteDescription, siteUrl } from "@/lib/utils/constants";

// Force the generic social image for this listing page
const ogImage = `${siteUrl}/og/default.jpg`;

export const metadata = {
  title: "Locations",
  description: siteDescription,
  alternates: { canonical: "/locations" },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: "/locations",
    siteName: siteTitle,
    title: "Locations",
    description: siteDescription,
    images: [
      { url: ogImage, width: 1200, height: 630, alt: "Browse locations" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Locations",
    description: siteDescription,
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
    locs.map((l) => [l.state, l.stateName])
  );

  return (
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
  );
}
