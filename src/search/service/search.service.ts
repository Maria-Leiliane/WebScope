import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateSearchDto } from '../dto/create-search.dto';
import { SearchStatus } from '../enums/search-status.enum';
import { ISearchJobRepository } from '../store/search.store';
import { DomainSearchJob, DomainSearchResult } from '../domain/search-job.entity';
import { CrawlerService } from '../../crawler/crawler.service';
import { SEARCH_JOB_REPOSITORY } from '../store/search.tokens';

@Injectable()
export class SearchService {
  private readonly logger = new Logger(SearchService.name);

  constructor(
    @Inject(SEARCH_JOB_REPOSITORY)
    private readonly searchRepository: ISearchJobRepository,
    private readonly crawlerService: CrawlerService,
  ) {}

  private generateId(): string {
    return Math.random().toString(36).substring(2, 9);
  }

  async createSearch(createSearchDto: CreateSearchDto): Promise<DomainSearchJob> {
    const id = this.generateId();
    const job: DomainSearchJob = {
      id,
      keyword: createSearchDto.keyword,
      status: SearchStatus.ACTIVE,
      results: [],
      createdAt: new Date(),
    };

    await this.searchRepository.add(job);

    void this.startSearch(job, createSearchDto.url);

    return job;
  }

  async startSearch(job: DomainSearchJob, targetUrl: string): Promise<void> {
    this.logger.log(`Starting background search for Job ID: ${job.id} na URL: ${targetUrl}`);

    try {
      const result = await this.crawlerService.crawlUrl(targetUrl, job.keyword);
      const foundResults = result ? [result] : [];
      this.logger.log(`Search for Job ID: ${job.id} completed. ${foundResults.length} results found.`);

      await this.searchRepository.update(job.id, {
        results: foundResults,
        status: SearchStatus.DONE,
      });

    } catch (error) {
      this.logger.error(`Error in background search for Job ID: ${job.id}`, error);
      await this.searchRepository.update(job.id, {
        status: SearchStatus.DONE,
      });
    }
  }

  async findById(id: string): Promise<DomainSearchJob> {
    const job = await this.searchRepository.get(id);
    if (!job) {
      throw new NotFoundException(`Search job with id ${id} not found`);
    }
    return job;
  }

  async findAll(): Promise<DomainSearchJob[]> {
    this.logger.log('Searching all search jobs...');
    return this.searchRepository.getAll();
  }
  async remove(id: string): Promise<void> {
    this.logger.log(`Trying to delete search job with ID: ${id}`);

    await this.findById(id);

    await this.searchRepository.remove(id);

    this.logger.log(`Job de busca com ID: ${id} deletado com sucesso.`);
  }
}