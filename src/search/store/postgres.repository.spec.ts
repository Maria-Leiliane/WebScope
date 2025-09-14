// src/search/store/postgres.repository.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../prisma/prisma.service';
import { PostgresSearchJobRepository } from './postgres.repository';
import { SearchStatus } from '../enums/search-status.enum';
import { DomainSearchJob } from '../domain/search-job.entity';

describe('PostgresSearchJobRepository', () => {
  let repository: PostgresSearchJobRepository;
  let prisma: PrismaService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PostgresSearchJobRepository, PrismaService],
    }).compile();

    repository = module.get<PostgresSearchJobRepository>(PostgresSearchJobRepository);
    prisma = module.get<PrismaService>(PrismaService);
  });

  beforeEach(async () => {
    await prisma.searchResult.deleteMany({});
    await prisma.searchJob.deleteMany({});
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('add and get', () => {
    it('should add a new search job and retrieve it by id', async () => {
      // Arrange
      const newJob: DomainSearchJob = {
        id: 'repo-test-1',
        keyword: 'prisma',
        status: SearchStatus.ACTIVE,
        createdAt: new Date(),
        results: [],
      };

      // Act
      await repository.add(newJob);
      const foundJob = await repository.get('repo-test-1');

      // Assert
      expect(foundJob).toBeDefined();
      expect(foundJob?.id).toBe(newJob.id);
      expect(foundJob?.keyword).toBe(newJob.keyword);
    });
  });

  describe('update', () => {
    it('should update an existing job with new results and status', async () => {
      // Arrange
      const initialJob: DomainSearchJob = {
        id: 'repo-test-2',
        keyword: 'update-test',
        status: SearchStatus.ACTIVE,
        createdAt: new Date(),
        results: [],
      };
      await repository.add(initialJob);

      const updatePayload = {
        status: SearchStatus.DONE,
        results: [{ url: 'https://prisma.io', snippet: 'Prisma Client', foundAt: new Date() }],
      };

      // Act
      await repository.update('repo-test-2', updatePayload);
      const updatedJob = await repository.get('repo-test-2');

      // Assert
      expect(updatedJob).toBeDefined();
      expect(updatedJob?.status).toBe(SearchStatus.DONE);
      expect(updatedJob?.results).toHaveLength(1);
      expect(updatedJob?.results[0].url).toBe('https://prisma.io');
    });
  });

});