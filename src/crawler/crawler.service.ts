import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { DomainSearchResult } from 'src/search/domain/search-job.entity';

@Injectable()
export class CrawlerService {
  private readonly logger = new Logger(CrawlerService.name);

  /**
   * Scans a single URL for a keyword.
   * @param url The URL to check.
   * @param keyword The keyword to search for.
   * @returns A DomainSearchResult object if the keyword is found, otherwise null.
   */
  async crawlUrl(url: string, keyword: string): Promise<DomainSearchResult | null> {
    this.logger.log(`Starting scan on URL: ${url} for keyword: "${keyword}"`);

    try {
      const response = await axios.get(url, {
        headers: {
          // Some pages block requests without a browser User-Agent
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        },
        timeout: 10000, // Timeout  10 seconds
      });

      const htmlContent = response.data;

      // Simple verify (is not case-sensitive)
      if (htmlContent.toLowerCase().includes(keyword.toLowerCase())) {
        this.logger.log(`Find the "${keyword}" in ${url}`);
        return {
          url: url,
          snippet: `Find the keyword in page content.`,
          foundAt: new Date(),
        };
      }

      this.logger.log(`Didn't find "${keyword}" in ${url}`);
      return null;

    } catch (error) {
      this.logger.error(`Failed to scan URL ${url}: ${error.message}`);
      return null;
    }
  }
}