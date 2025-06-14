/*
import fetch from "node-fetch";
import readline from "readline";

export function promptUser(query: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) =>
    rl.question(query, (ans) => {
      rl.close();
      resolve(ans);
    })
  );
}

interface PexelsPhoto {
  alt: string;
  src: { original: string };
  photographer: string;
}

export async function fetchImages(): Promise<{ url: string; alt: string }[]> {
  const PEXELS_API_KEY = process.env.PEXELS_API_KEY!;
  const keyword = await promptUser("\n🔍 Keyword(s) for Pexels image: ");
  const res = await fetch(
    `https://api.pexels.com/v1/search?query=${encodeURIComponent(
      keyword
    )}&orientation=landscape&per_page=3`,
    {
      headers: { Authorization: PEXELS_API_KEY },
    }
  );
  const data = (await res.json()) as { photos: PexelsPhoto[] };

  return data.photos.map((p) => ({
    url: p.src.original,
    alt: p.alt || `Image by ${p.photographer}`,
  }));
}
*/

import fetch from "node-fetch";
import readline from "readline";

export function promptUser(query: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) =>
    rl.question(query, (ans) => {
      rl.close();
      resolve(ans);
    })
  );
}

interface PexelsPhoto {
  alt: string;
  src: { original: string };
  photographer: string;
}

/**
 * Pure function to fetch Pexels image results by keyword - testable.
 */
export async function searchPexelsImages(
  keyword: string
): Promise<{ url: string; alt: string }[]> {
  const PEXELS_API_KEY = process.env.PEXELS_API_KEY!;
  const res = await fetch(
    `https://api.pexels.com/v1/search?query=${encodeURIComponent(
      keyword
    )}&orientation=landscape&per_page=3`,
    {
      headers: { Authorization: PEXELS_API_KEY },
    }
  );
  const data = (await res.json()) as { photos: PexelsPhoto[] };

  return data.photos.map((p) => ({
    url: p.src.original,
    alt: p.alt || `Image by ${p.photographer}`,
  }));
}

/**
 * Wrapper for CLI usage: prompts user for input, then fetches images
 */
export async function fetchImages(): Promise<{ url: string; alt: string }[]> {
  const keyword = await promptUser("\n🔍 Keyword(s) for Pexels image: ");
  return await searchPexelsImages(keyword);
}
