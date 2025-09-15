import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { DomainSearchResult } from 'src/search/domain/search-job.entity';
import * as cheerio from 'cheerio';

@Injectable()
export class CrawlerService {
  private readonly logger = new Logger(CrawlerService.name);

  /**
   * Fetches and parses a URL's HTML content to find a keyword within the visible text.
   * @param url The target URL to crawl.
   * @param keyword The case-insensitive keyword to search for.
   * @returns A DomainSearchResult object containing a contextual snippet if the keyword is found, otherwise null.
   */

  private userAgents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.6145.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:125.0) Gecko/20100101 Firefox/125.0',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/605.1.15',
  ];

  private pickUA(): string {
    return this.userAgents[Math.floor(Math.random() * this.userAgents.length)];
  }

  async crawlUrl(url: string, keyword: string): Promise<DomainSearchResult | null> {
    this.logger.log(`Starting scan on URL: ${url} for keyword: "${keyword}"`);
    try {
      const response = await axios.get(url, {
        headers: { 'User-Agent': this.pickUA() },
        timeout: 10000,
      });

      const htmlContent: string = response.data;
      const $ = cheerio.load(htmlContent);
      let snippet = '';

      $('body *:not(script):not(style)').filter(function() {
        const regex = new RegExp(keyword, 'i');
        return regex.test($(this).text());
      }).each(function() {
        const elementText = $(this).text();
        snippet = elementText.trim().replace(/\s+/g, ' ');
        return false;
      });

      if (snippet) {
        this.logger.log(`Found "${keyword}" in ${url}`);
        return {
          url,
          snippet,
          foundAt: new Date(),
        };
      }

      this.logger.log(`Did not find "${keyword}" in ${url}`);
      return null;

    } catch (error: any) {
      this.logger.error(`Failed to scan URL ${url}: ${error.code || error.message}`);
      return null;
    }
  }
}