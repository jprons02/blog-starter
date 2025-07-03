/** API returns bad numbers with household above 8
 * For each additional person beyond 8, add:
 * $5,380/year (2024 guideline for contiguous U.S.)
 * That’s $448.33/month
 * So for example:
 * 9-person household: FPL = $15,060 + $5,380 × (9 - 1) = $58,100 → $4,841.67/mo
 * 20-person household: $15,060 + $5,380 × (20 - 1) = $117,280 → $9,773.33/mo
 */

export async function getMonthlyFPL(
  householdSize: number,
  state: string,
  year = 2025
): Promise<number> {
  const maxSize = 20;
  const size = Math.max(1, Math.min(householdSize, maxSize));

  const perPersonMonthly: Record<string, number> = {
    us: 448.33,
    hi: 515.83,
    ak: 560.0,
  };

  const baseSize = Math.min(size, 8);

  const res = await fetch(
    `https://aspe.hhs.gov/topics/poverty-economic-mobility/poverty-guidelines/api/${year}/${state}/${baseSize}`
  );

  if (!res.ok)
    throw new Error(`Failed to fetch FPL for household size ${baseSize}`);

  const json = await res.json();
  const baseMonthly = json.data.income / 12;

  // Add per-person amount if household > 8
  const extra = size > 8 ? perPersonMonthly[state] * (size - 8) : 0;

  return parseFloat((baseMonthly + extra).toFixed(0));
}
