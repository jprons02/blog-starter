// app/locations/_locationsData.ts
import type { LocationEntry } from "@/types/locations";

// 🔹 Seed your first ~30 entries here (slugs = lowercase, dashed)
const LOCATIONS = [
  { state: "florida", city: "miami", stateName: "Florida", cityName: "Miami" },
  {
    state: "arizona",
    city: "phoenix",
    stateName: "Arizona",
    cityName: "Phoenix",
  },
  {
    state: "new-york",
    city: "new-york",
    stateName: "New York",
    cityName: "New York",
  },
  {
    state: "california",
    city: "los-angeles",
    stateName: "California",
    cityName: "Los Angeles",
  },
  {
    state: "illinois",
    city: "chicago",
    stateName: "Illinois",
    cityName: "Chicago",
  },
  {
    state: "texas",
    city: "houston",
    stateName: "Texas",
    cityName: "Houston",
  },
  {
    state: "georgia",
    city: "atlanta",
    stateName: "Georgia",
    cityName: "Atlanta",
  },
] satisfies LocationEntry[];

// Export helpers for sitemap/static generation/metadata
export function getAllLocations(): ReadonlyArray<LocationEntry> {
  return LOCATIONS;
}

export function findLocation(
  state: string,
  city: string
): LocationEntry | null {
  const s = state.toLowerCase();
  const c = city.toLowerCase();
  return LOCATIONS.find((l) => l.state === s && l.city === c) ?? null;
}

// Optional: shared page titles/descriptions for city hubs
export function buildLocationMeta(entry: LocationEntry) {
  const title = `Government Assistance in ${entry.cityName}, ${entry.stateName} (SNAP, WIC, LIHEAP & more)`;
  const description = `Where to apply in ${entry.cityName}, ${entry.stateName}: eligibility basics for SNAP, WIC, LIHEAP, Medicaid, and local help — plus forms and tips.`;
  return { title, description };
}

export async function loadLocalResources(state: string, city: string) {
  // normalize slugs
  const s = state.toLowerCase();
  const c = city.toLowerCase();

  try {
    // expects a file at app/locations/data/<state>/<city>.ts exporting `localResources`
    const mod = await import(`@/app/locations/data/${s}/${c}`);
    return mod.localResources ?? {};
  } catch {
    // missing city file? just return empty bag
    return {};
  }
}
