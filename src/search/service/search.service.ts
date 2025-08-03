import { CreateSearchDto } from '../dto/create-search.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { SearchStatus } from '../enums/search-status.enum';
import { SearchJob } from '../ interfaces/search-job.interface';
import { SearchResult } from '../ interfaces/search-result.interface';
import { SearchStoreService } from '../store/search.store';


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
  async findById(id: string): Promise<SearchJob> {
    const job = await this.searchStore.get(id);
    if (!job) {
      throw new NotFoundException(`Search job with id ${id} not found`);
    }
    return job;
  }
}