export async function getCityStateFromZip(zip: string) {
  try {
    const res = await fetch(`https://api.zippopotam.us/us/${zip}`);
    if (!res.ok) throw new Error("ZIP lookup failed");

    const data = await res.json();
    const place = data.places?.[0];
    return {
      city: place["place name"],
      state: place["state abbreviation"],
    };
  } catch (error) {
    console.warn("ZIP code lookup failed:", error);
    return {
      city: "",
      state: "",
    };
  }
}
