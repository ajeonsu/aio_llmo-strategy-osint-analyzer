import axios from 'axios';
import * as cheerio from 'cheerio';

interface ScrapedContent {
  url: string;
  title: string;
  description: string;
  content: string;
  error?: string;
}

/**
 * Scrape content from a URL
 */
export async function scrapeUrl(url: string): Promise<ScrapedContent> {
  try {
    // Validate URL
    const urlObj = new URL(url);
    if (!urlObj.protocol.startsWith('http')) {
      throw new Error('Only HTTP/HTTPS URLs are supported');
    }

    // Fetch the page
    const response = await axios.get(url, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'ja,en-US;q=0.7,en;q=0.3',
      },
    });

    const html = response.data;
    const $ = cheerio.load(html);

    // Remove script, style, and other non-content elements
    $('script, style, nav, footer, header, iframe, noscript').remove();

    // Extract metadata
    const title = $('title').text().trim() || 
                  $('meta[property="og:title"]').attr('content') || 
                  $('h1').first().text().trim() || 
                  '';

    const description = $('meta[name="description"]').attr('content') || 
                       $('meta[property="og:description"]').attr('content') || 
                       '';

    // Extract main content
    let content = '';

    // Try to find main content area
    const mainSelectors = [
      'main',
      'article',
      '[role="main"]',
      '.main-content',
      '#main-content',
      '.content',
      '#content',
    ];

    for (const selector of mainSelectors) {
      const mainContent = $(selector);
      if (mainContent.length > 0) {
        content = mainContent.text();
        break;
      }
    }

    // Fallback to body if no main content found
    if (!content) {
      content = $('body').text();
    }

    // Clean up the content
    content = content
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .replace(/\n+/g, '\n') // Replace multiple newlines with single newline
      .trim();

    // Limit content length (max 10000 characters to avoid token limits)
    if (content.length > 10000) {
      content = content.substring(0, 10000) + '...';
    }

    return {
      url,
      title,
      description,
      content,
    };

  } catch (error: any) {
    console.error(`Failed to scrape ${url}:`, error.message);
    return {
      url,
      title: '',
      description: '',
      content: '',
      error: error.message,
    };
  }
}

/**
 * Scrape multiple URLs
 */
export async function scrapeUrls(urls: string[]): Promise<ScrapedContent[]> {
  const promises = urls.map(url => scrapeUrl(url));
  return Promise.all(promises);
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
