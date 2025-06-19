export function formatDate(dateInput: string | Date): string {
  const date = new Date(dateInput);
  const year = date.getFullYear();
  const month = date.toLocaleString("en-US", { month: "short" }); // e.g., Jan
  const day = date.getDate().toString().padStart(2, "0");

  return `${month} ${day}, ${year}`; // e.g., Jan 21, 2025
}
