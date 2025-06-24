export function formatDate(date: string): string {
  try {
    const parsed = new Date(date);

    // If the date is invalid, return the raw string for visibility
    if (isNaN(parsed.getTime())) return date;

    return parsed.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return date;
  }
}
