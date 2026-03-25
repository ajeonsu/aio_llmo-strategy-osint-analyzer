import axios from 'axios';
import * as cheerio from 'cheerio';

interface ScrapedContent {
  url: string;
  title: string;
  description: string;
  content: string;
  error?: string;
}

interface ProductLink {
  url: string;
  text: string;
  score: number;
}

// Keywords that strongly suggest a link leads to a product or service page
const PRODUCT_LINK_KEYWORDS = [
  // English
  'service', 'product', 'feature', 'pricing', 'saas', 'tool', 'platform', 'app', 'lp',
  // Japanese
  'サービス', '機能', 'ガチャ', '診断', 'ツール', 'プロダクト', 'アプリ', '料金', 'プラン',
];

// URL substrings that indicate clearly non-product pages — skip during link-following
const SKIP_LINK_PATTERNS = [
  '/contact', '/recruit', '/careers', '/jobs', '/about', '/news', '/blog',
  '/press', '/privacy', '/terms', '/legal', '/login', '/signin', '/signup',
  'twitter.com', 'x.com', 'facebook.com', 'instagram.com', 'linkedin.com',
  'youtube.com', 'tiktok.com', 'line.me',
];

/**
 * Internal: fetch a URL and return both cleaned ScrapedContent and the raw HTML.
 * Keeping raw HTML allows link extraction without a second HTTP round-trip.
 */
async function fetchAndScrape(url: string): Promise<{ content: ScrapedContent; rawHtml: string }> {
  try {
    const urlObj = new URL(url);
    if (!urlObj.protocol.startsWith('http')) {
      throw new Error('Only HTTP/HTTPS URLs are supported');
    }

    const response = await axios.get(url, {
      timeout: 5000,
      maxRedirects: 3,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'ja,en-US;q=0.7,en;q=0.3',
      },
    });

    const rawHtml = typeof response.data === 'string' ? response.data : String(response.data);
    const $ = cheerio.load(rawHtml);

    // Remove noise elements before text extraction (but rawHtml is preserved for link extraction)
    $('script, style, nav, footer, header, iframe, noscript').remove();

    const title =
      $('title').text().trim() ||
      $('meta[property="og:title"]').attr('content') ||
      $('h1').first().text().trim() ||
      '';

    const description =
      $('meta[name="description"]').attr('content') ||
      $('meta[property="og:description"]').attr('content') ||
      '';

    let content = '';
    const mainSelectors = [
      'main', 'article', '[role="main"]',
      '.main-content', '#main-content', '.content', '#content',
    ];
    for (const selector of mainSelectors) {
      const el = $(selector);
      if (el.length > 0) { content = el.text(); break; }
    }
    if (!content) content = $('body').text();

    content = content.replace(/\s+/g, ' ').replace(/\n+/g, '\n').trim();
    if (content.length > 5000) content = content.substring(0, 5000) + '...';

    return { content: { url, title, description, content }, rawHtml };
  } catch (error: any) {
    console.error(`Failed to scrape ${url}:`, error.message);
    return {
      content: { url, title: '', description: '', content: '', error: error.message },
      rawHtml: '',
    };
  }
}

/**
 * Extract product/service-relevant links from raw HTML.
 * Scores each link by keyword relevance (higher = more likely a product page).
 * Links with known noise patterns (contact, recruit, social media, etc.) are excluded.
 * Results are sorted highest score first.
 */
export function extractProductLinks(rawHtml: string, baseUrl: string): ProductLink[] {
  if (!rawHtml) return [];

  const $ = cheerio.load(rawHtml);
  const seen = new Set<string>();
  const links: ProductLink[] = [];

  $('a[href]').each((_, el) => {
    const href = $(el).attr('href') || '';
    const text = $(el).text().trim().toLowerCase();

    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return;

    let resolved: string;
    try {
      resolved = new URL(href, baseUrl).toString().split('#')[0];
      if (!resolved.startsWith('http')) return;
    } catch { return; }

    if (seen.has(resolved)) return;
    seen.add(resolved);

    const urlLower = resolved.toLowerCase();
    if (SKIP_LINK_PATTERNS.some(p => urlLower.includes(p))) return;

    let score = 0;
    for (const kw of PRODUCT_LINK_KEYWORDS) {
      if (urlLower.includes(kw)) score += 3;
      if (text.includes(kw)) score += 2;
    }

    // Bonus for external domains — product/SaaS pages often live on a separate LP domain
    try {
      if (new URL(resolved).hostname !== new URL(baseUrl).hostname) score += 1;
    } catch {}

    links.push({ url: resolved, text, score });
  });

  return links.sort((a, b) => b.score - a.score);
}

/**
 * Scrape a single URL.
 */
export async function scrapeUrl(url: string): Promise<ScrapedContent> {
  const { content } = await fetchAndScrape(url);
  return content;
}

/**
 * Scrape multiple URLs in parallel (no link-following).
 */
export async function scrapeUrls(urls: string[]): Promise<ScrapedContent[]> {
  return Promise.all(urls.map(url => scrapeUrl(url)));
}

/**
 * Scrape seed URLs and follow promising product/service links up to maxHops deep.
 *
 * This solves the "front page problem" where a company's main website only contains
 * branding/profile info and the actual product page lives elsewhere — sometimes
 * multiple hops away or on a completely different domain. Example chain:
 *
 *   onthebakery.co.jp (company front, hop 0)
 *     → onthebakery.notion.site (linked via "Recruit" nav, hop 1)
 *       → lp.croissant.buzz (the actual SaaS product page, hop 2) ✓
 *
 * Total pages scraped is capped at maxPages regardless of depth.
 */
export async function scrapeWithLinkFollowing(
  seedUrls: string[],
  maxPages = 5,
  maxHops = 2
): Promise<ScrapedContent[]> {
  const results: ScrapedContent[] = [];
  const visited = new Set<string>();

  const normalize = (u: string): string => {
    try {
      const p = new URL(u);
      return `${p.hostname}${p.pathname}`.toLowerCase().replace(/\/$/, '');
    } catch { return u.toLowerCase(); }
  };

  /**
   * Fetch and process a batch of URLs at the given hop depth.
   * Returns promising links extracted from those pages for the next hop.
   */
  async function processHop(urls: string[], hop: number): Promise<ProductLink[]> {
    if (urls.length === 0 || results.length >= maxPages) return [];

    const batch = urls.slice(0, maxPages - results.length);
    const fetched = await Promise.all(batch.map(u => fetchAndScrape(u)));
    const nextLinks: ProductLink[] = [];

    for (const { content, rawHtml } of fetched) {
      visited.add(normalize(content.url));

      if (!content.error && content.content) {
        results.push(content);
        console.log(`[Crawler] hop=${hop} scraped: ${content.url}`);
      }

      if (hop < maxHops && rawHtml) {
        const links = extractProductLinks(rawHtml, content.url);
        nextLinks.push(...links);
      }
    }

    return nextLinks;
  }

  // Hop 0: scrape seed URLs
  const hop1Candidates = await processHop(seedUrls, 0);
  if (results.length >= maxPages) return results;

  // Hop 1: follow links with score > 0 (any product signal or external domain bonus)
  const hop1Urls = hop1Candidates
    .filter(l => l.score > 0 && !visited.has(normalize(l.url)))
    .slice(0, 5)
    .map(l => l.url);

  const hop2Candidates = await processHop(hop1Urls, 1);
  if (results.length >= maxPages) return results;

  // Hop 2: only follow high-confidence links (score >= 3 means at least one product keyword in URL)
  const hop2Urls = hop2Candidates
    .filter(l => l.score >= 3 && !visited.has(normalize(l.url)))
    .slice(0, 3)
    .map(l => l.url);

  await processHop(hop2Urls, 2);

  return results;
}

/**
 * Format scraped content for Gemini prompt
 */
export function formatScrapedContent(scrapedData: ScrapedContent[]): string {
  if (scrapedData.length === 0) {
    return '（URLからの情報取得なし）';
  }

  return scrapedData
    .filter(data => !data.error && data.content)
    .map(data => {
      return `
【URL: ${data.url}】
タイトル: ${data.title}
説明: ${data.description}

コンテンツ:
${data.content}
---
`;
    })
    .join('\n');
}
