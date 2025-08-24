// /src/data/locations/registry.ts
import phoenix from "./az/phoenix";
import miami from "./fl/miami";

export type QAString = readonly [string, string]; // readonly tuple
export type QARichHtml = { html: string } | { qHtml: string; aHtml: string };
export type QAItem = QAString | QARichHtml;

/**
 * LocalResource:
 * - Known common fields (link/contact/email/phone/stateUrl/locatorUrl/providerSearchUrl)
 * - `faqs` is a readonly array of QAItem (tuple or rich HTML)
 * - Index signature allows additional *string* fields (e.g., "countyUrl") or `faqs`
 *   without widening to `any`.
 */
export type LocalResource = {
  link?: string;
  contact?: string;
  email?: string;
  phone?: string;
  stateUrl?: string;
  locatorUrl?: string;
  providerSearchUrl?: string;
  faqs?: readonly QAItem[];
  // Allow arbitrary string-based fields (and faqs) without using `any`
  [k: string]: string | readonly QAItem[] | undefined;
};

export type LocationModule = {
  city: string;
  state: string; // 2-letter
  localResources: Record<string, LocalResource>;
};

// Register TS modules (keys are lowercase "state/city")
export const LOCATION_REGISTRY: Record<string, LocationModule> = {
  "az/phoenix": phoenix,
  "fl/miami": miami,
};

export function findLocationModule(
  state?: string,
  city?: string
): LocationModule | null {
  if (!state || !city) return null;
  const key = `${state.toLowerCase()}/${city.toLowerCase()}`;
  return LOCATION_REGISTRY[key] ?? null;
}
