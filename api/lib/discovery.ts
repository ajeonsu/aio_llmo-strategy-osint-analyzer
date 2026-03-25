import axios from 'axios';

// Domains that are clearly not brand product/service pages
// (last updated: 2026-03-26)
const BLOCK_LIST_DOMAINS = [
  'wikipedia.org',
  'twitter.com',
  'x.com',
  'facebook.com',
  'instagram.com',
  'linkedin.com',
  'youtube.com',
  'tiktok.com',
  'pinterest.com',
  'reddit.com',
  'yelp.com',
  'crunchbase.com',
  'g2.com',
  'capterra.com',
  'trustpilot.com',
  'getapp.com',
  'softwareadvice.com',
  'producthunt.com',
  'angel.co',
  'glassdoor.com',
  'indeed.com',
  'zoominfo.com',
  'bloomberg.com',
  'reuters.com',
  'businesswire.com',
  'prnewswire.com',
  'techcrunch.com',
  'forbes.com',
  'wsj.com',
  'nikkei.com',
];

interface SerperResult {
  title: string;
  link: string;
  snippet: string;
  position: number;
}

interface SerperResponse {
  organic?: SerperResult[];
}

function generateSearchQueries(brandName: string, officialDomain?: string): string[] {
  const queries: string[] = [];

  // Site-specific search first — most accurate when the official domain is known,
  // avoids confusing generic-sounding brand names (e.g. "on the bakery") with
  // unrelated businesses in general web results
  if (officialDomain) {
    queries.push(`site:${officialDomain} サービス OR product OR features OR 機能`);
  }

  queries.push(`"${brandName}" service features`);
  queries.push(`"${brandName}" product SaaS`);
  queries.push(`"${brandName}" 機能 サービス`);

  return queries;
}

function isBlockedDomain(url: string): boolean {
  try {
    const hostname = new URL(url).hostname.toLowerCase();
    return BLOCK_LIST_DOMAINS.some(
      blocked => hostname === blocked || hostname.endsWith(`.${blocked}`)
    );
  } catch {
    return true;
  }
}

async function searchSerper(query: string): Promise<SerperResult[]> {
  const apiKey = process.env.SERPER_API_KEY;
  if (!apiKey) return [];

  try {
    const response = await axios.post<SerperResponse>(
      'https://google.serper.dev/search',
      { q: query, num: 5 },
      {
        headers: {
          'X-API-KEY': apiKey,
          'Content-Type': 'application/json',
        },
        timeout: 6000,
      }
    );
    return response.data?.organic ?? [];
  } catch (error: any) {
    console.error(`Serper search failed for "${query}":`, error.message);
    return [];
  }
}

/**
 * Discover the most relevant product/service pages for a brand using web
 * search. When `officialDomain` is provided a site-specific query is added
 * first so that sub-pages on the known domain are found before general
 * web results — this prevents generic-sounding brand names from matching
 * unrelated businesses.
 *
 * Returns up to `maxPages` candidate URLs, or an empty array if
 * SERPER_API_KEY is not configured.
 */
export async function discoverProductPages(
  brandName: string,
  officialDomain?: string,
  maxPages = 5
): Promise<string[]> {
  const apiKey = process.env.SERPER_API_KEY;
  if (!apiKey) {
    console.log('SERPER_API_KEY not configured — skipping discovery layer');
    return [];
  }

  const queries = generateSearchQueries(brandName, officialDomain);
  console.log(`[Discovery] Running ${queries.length} queries for "${brandName}"`);

  // Run all queries in parallel
  const allResults = await Promise.all(queries.map(q => searchSerper(q)));

  // Flatten, filter blocked domains, deduplicate by normalized path
  const seen = new Set<string>();
  const candidates: string[] = [];

  for (const results of allResults) {
    for (const result of results) {
      const url = result.link;
      if (!url) continue;
      if (isBlockedDomain(url)) continue;

      // Deduplicate by hostname + pathname (ignore query params)
      let normalizedKey: string;
      try {
        const u = new URL(url);
        normalizedKey = `${u.hostname}${u.pathname}`.replace(/\/$/, '').toLowerCase();
      } catch {
        continue;
      }

      if (seen.has(normalizedKey)) continue;
      seen.add(normalizedKey);
      candidates.push(url);

      if (candidates.length >= maxPages) break;
    }
    if (candidates.length >= maxPages) break;
  }

  console.log(`[Discovery] Found ${candidates.length} candidate URLs:`, candidates);
  return candidates;
}
