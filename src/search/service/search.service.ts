import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateSearchDto } from '../dto/create-search.dto';
import { SearchStatus } from '../enums/search-status.enum';
import { ISearchJobRepository } from '../store/search.store';
import { DomainSearchJob } from '../domain/search-job.entity';
import { CrawlerService } from '../../crawler/crawler.service';
import { SEARCH_JOB_REPOSITORY } from '../store/search.tokens';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';

@Injectable()
export class SearchService {
  private readonly logger = new Logger(SearchService.name);

  constructor(
    @Inject(SEARCH_JOB_REPOSITORY)
    private readonly searchRepository: ISearchJobRepository,
    private readonly crawlerService: CrawlerService,
    @Inject(CACHE_MANAGER)
    private readonly cache: Cache,
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

    await this.cache.del('jobs:all');
    this.logger.log('Cache de "jobs:all" invalid because the new creation.');

    return job;
  }

  async startSearch(job: DomainSearchJob, targetUrl: string): Promise<void> {
    this.logger.log(`Init search in second plan for Job ID: ${job.id} na URL: ${targetUrl}`);
    try {
      const result = await this.crawlerService.crawlUrl(targetUrl, job.keyword);
      const foundResults = result ? [result] : [];
      await this.searchRepository.update(job.id, {
        results: foundResults,
        status: SearchStatus.DONE,
      });

      await this.cache.del(`job:${job.id}`);
      await this.cache.del('jobs:all');
      this.logger.log(`Cache para Job ID: ${job.id} e 'jobs:all' invalid next search.`);
    } catch (error) {
      this.logger.error(`Error in second plan search for Job ID: ${job.id}`, error);
      await this.searchRepository.update(job.id, {
        status: SearchStatus.DONE,
      });
    }
  }

  async findById(id: string): Promise<DomainSearchJob> {
    const cacheKey = `job:${id}`;

    const cachedJob = await this.cache.get<DomainSearchJob>(cacheKey);
    if (cachedJob) {
      this.logger.log(`Job ID: ${id} not foud in CACHE.`);
      return cachedJob;
    }

    this.logger.log(`Job ID: ${id} not foud in cache. Search in database...`);
    const job = await this.searchRepository.get(id);
    if (!job) {
      throw new NotFoundException(`Search Job with id ${id} not found`);
    }

    await this.cache.set(cacheKey, job);
    return job;
  }

  async findAll(): Promise<DomainSearchJob[]> {
    const cacheKey = 'jobs:all';

    const cachedJobs = await this.cache.get<DomainSearchJob[]>(cacheKey);
    if (cachedJobs) {
      this.logger.log('List all jobs in CACHE.');
      return cachedJobs;
    }

    this.logger.log('Job list not found in cache. Searching database...');
    const jobs = await this.searchRepository.getAll();
    await this.cache.set(cacheKey, jobs);
    return jobs;
  }

  async remove(id: string): Promise<void> {
    await this.findById(id);
    await this.searchRepository.remove(id);

    await this.cache.del(`job:${id}`);
    await this.cache.del('jobs:all');

    this.logger.log(`Job ID: ${id} and cache 'jobs:all' invalidated.`);
  }
}