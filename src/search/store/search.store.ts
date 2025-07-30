import { Injectable, Inject, NotFoundException } from '@nestjs/common';

import { SearchStatus } from '../enums/search-status.enum';
import { SearchJob } from '../ interfaces/search-job.interface';

/**
 * Abstract interface for persistence, allowing mocking and adaptation for DB/Cache.
 */
export interface ISearchJobRepository {
  add(job: SearchJob): Promise<void>;
  get(id: string): Promise<SearchJob | undefined>;
  getAll(): Promise<SearchJob[]>;
  update(id: string, partial: Partial<SearchJob>): Promise<void>;
  remove(id: string): Promise<void>;
  exists(id: string): Promise<boolean>;
  findByStatus(status: SearchStatus): Promise<SearchJob[]>;
  clearAll(): Promise<void>;
}

/**
 * In-memory implementation for testing/development.
 * Replace with real implementation (Redis, Mongo, etc.) in production.
 */
@Injectable()
export class InMemorySearchJobRepository implements ISearchJobRepository {
  private jobs: Map<string, SearchJob> = new Map();

  async add(job: SearchJob): Promise<void> {
    this.jobs.set(job.id, job);
  }

  async get(id: string): Promise<SearchJob | undefined> {
    return this.jobs.get(id);
  }

  async getAll(): Promise<SearchJob[]> {
    return Array.from(this.jobs.values());
  }

  async update(id: string, partial: Partial<SearchJob>): Promise<void> {
    const job = this.jobs.get(id);
    if (job) {
      this.jobs.set(id, { ...job, ...partial });
    } else {
      throw new NotFoundException('SearchJob not found');
    }
  }

  async remove(id: string): Promise<void> {
    this.jobs.delete(id);
  }

  async exists(id: string): Promise<boolean> {
    return this.jobs.has(id);
  }

  async findByStatus(status: SearchStatus): Promise<SearchJob[]> {
    return Array.from(this.jobs.values()).filter(job => job.status === status);
  }

  async clearAll(): Promise<void> {
    this.jobs.clear();
  }
}

/**
 * Main service, injecting repository (can be cache/DB).
 */
@Injectable()
export class SearchStoreService {
  constructor(
    @Inject('SearchJobRepository') private readonly repo: ISearchJobRepository,
  ) {}

  add(job: SearchJob): Promise<void> {
    return this.repo.add(job);
  }

  get(id: string): Promise<SearchJob | undefined> {
    return this.repo.get(id);
  }

  getAll(): Promise<SearchJob[]> {
    return this.repo.getAll();
  }

  update(id: string, partial: Partial<SearchJob>): Promise<void> {
    return this.repo.update(id, partial);
  }

  remove(id: string): Promise<void> {
    return this.repo.remove(id);
  }

  exists(id: string): Promise<boolean> {
    return this.repo.exists(id);
  }

  findByStatus(status: SearchStatus): Promise<SearchJob[]> {
    return this.repo.findByStatus(status);
  }

  clearAll(): Promise<void> {
    return this.repo.clearAll();
  }
}