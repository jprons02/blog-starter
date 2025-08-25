// app/locations/page.tsx
import Link from "next/link";
import { getAllLocations } from "@/app/locations/_locationsData";
import { siteTitle, siteDescription } from "@/lib/utils/constants";

export const metadata = {
  title: `Locations • ${siteTitle}`,
  description: siteDescription,
};

export default function LocationsIndex() {
  const locs = getAllLocations();
  const byState = locs.reduce<
    Record<string, { city: string; state: string }[]>
  >((acc, l) => {
    (acc[l.state] ||= []).push({ city: l.city, state: l.state });
    return acc;
  }, {});
  const stateNames: Record<string, string> = Object.fromEntries(
    locs.map((l) => [l.state, l.stateName])
  );

  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Locations</h1>
      <div className="space-y-8">
        {Object.keys(byState)
          .sort()
          .map((state) => (
            <section key={state}>
              <h2 className="text-xl font-semibold mb-3">
                <Link href={`/locations/${state}`}>
                  {stateNames[state] ?? state}
                </Link>
              </h2>
              <ul className="grid sm:grid-cols-2 gap-2">
                {byState[state]
                  .sort((a, b) => a.city.localeCompare(b.city))
                  .map(({ city }) => (
                    <li key={city}>
                      <Link href={`/locations/${state}/${city}`}>
                        {city.replace(/-/g, " ")}
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
