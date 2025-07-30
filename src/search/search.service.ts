import { CreateSearchDto } from './dto/create-search.dto';
import { Injectable } from '@nestjs/common';
import { SearchStoreService } from './store/search.store';
import { SearchStatus } from './enums/search-status.enum';
import { SearchJob } from './ interfaces/search-job.interface';
import { SearchResult } from './ interfaces/search-result.interface';


@Injectable()
export class SearchService {
  constructor(
    private readonly searchStore: SearchStoreService,
    // When CrawlerService is created, it will be changed: private readonly crawlerService: CrawlerService,
  ) {}

  // Add this method
  private generateId(): string {
    // Simple random ID (for demo purposes)
    return Math.random().toString(36).substr(2, 9);
  }

  async createSearch(createSearchDto: CreateSearchDto): Promise<SearchJob> {
    const id = this.generateId();
    const job: SearchJob = {
      id,
      keyword: createSearchDto.keyword,
      status: SearchStatus.ACTIVE,
      results: [],
      createdAt: new Date(),
    };
    await this.searchStore.add(job);

    // Placeholder: provisionally simulate results until creating the actual service
    await this.startSearch(job);

    return job;
  }

  async startSearch(job: SearchJob): Promise<void> {
    try {
      // TODO: Switch to using crawlerService in the future
      const results: SearchResult[] = [
        // Simulation of results
        { url: 'https://exemplo.com', snippet: 'Context example', foundAt: new Date() },
      ];

      await this.searchStore.update(job.id, {
        results,
        status: SearchStatus.DONE,
      });
    } catch (error) {
      await this.searchStore.update(job.id, {
        status: SearchStatus.DONE,
      });
    }
  }

  // ...future methods
}