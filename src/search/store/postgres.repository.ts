import { Injectable } from '@nestjs/common';
import { ISearchJobRepository } from './search.store';
import { PrismaService } from '../../prisma/prisma.service';
import { SearchStatus } from '../enums/search-status.enum';
import { SearchJob as PrismaSearchJob, SearchResult as PrismaSearchResult } from '@prisma/client';
import { DomainSearchJob } from '../domain/search-job.entity';

type FullPrismaSearchJob = PrismaSearchJob & { results: PrismaSearchResult[] };

@Injectable()
export class PostgresSearchJobRepository implements ISearchJobRepository {
  constructor(private readonly prisma: PrismaService) {}

  private toDomain(dbJob: FullPrismaSearchJob): DomainSearchJob {
    return {
      id: dbJob.id,
      keyword: dbJob.keyword,
      status: dbJob.status as SearchStatus,
      createdAt: dbJob.createdAt,
      results: dbJob.results.map(r => ({
        url: r.url,
        snippet: r.snippet ?? '',
        foundAt: r.foundAt ?? new Date(0),
      })),
    };
  }

  async add(job: DomainSearchJob): Promise<void> {
    await this.prisma.searchJob.create({
      data: {
        id: job.id,
        keyword: job.keyword,
        status: job.status,
        createdAt: job.createdAt,
      },
    });
  }

  async get(id: string): Promise<DomainSearchJob | undefined> {
    const dbJob = await this.prisma.searchJob.findUnique({
      where: { id },
      include: { results: true },
    });
    return dbJob ? this.toDomain(dbJob) : undefined;
  }

  async update(id: string, partial: Partial<DomainSearchJob>): Promise<void> {
    const dataToUpdate: any = {};

    if (partial.status) {
      dataToUpdate.status = partial.status;
    }

    if (partial.results && partial.results.length > 0) {
      dataToUpdate.results = {
        create: partial.results.map((r) => ({
          url: r.url,
          snippet: r.snippet,
          foundAt: r.foundAt,
        })),
      };
    }

    await this.prisma.searchJob.update({
      where: { id },
      data: dataToUpdate,
    });
  }

  async getAll(): Promise<DomainSearchJob[]> {
    const dbJobs = await this.prisma.searchJob.findMany({ include: { results: true } });
    return dbJobs.map((job) => this.toDomain(job));
  }

  async findByStatus(status: SearchStatus): Promise<DomainSearchJob[]> {
    const dbJobs = await this.prisma.searchJob.findMany({
      where: { status },
      include: { results: true },
    });
    return dbJobs.map((job) => this.toDomain(job));
  }

  async remove(id: string): Promise<void> {
    await this.prisma.searchResult.deleteMany({ where: { searchJobId: id } });
    await this.prisma.searchJob.delete({ where: { id } });
  }

  async exists(id: string): Promise<boolean> {
    const count = await this.prisma.searchJob.count({ where: { id } });
    return count > 0;
  }

  async clearAll(): Promise<void> {
    await this.prisma.searchResult.deleteMany({});
    await this.prisma.searchJob.deleteMany({});
  }
}