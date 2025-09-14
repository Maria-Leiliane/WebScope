import { Test, TestingModule } from '@nestjs/testing';
import { SearchController } from './search.controller';
import { SearchService } from '../service/search.service';
import { SearchPresenter } from '../presenter/search.presenter';
import { DomainSearchJob } from '../domain/search-job.entity';
import { SearchStatus } from '../enums/search-status.enum';
import { CreateSearchDto } from '../dto/create-search.dto';

const mockSearchService = {
  createSearch: jest.fn(),
  findById: jest.fn(),
  findAll: jest.fn(),
  remove: jest.fn(),
};

const mockSearchPresenter = {
  toResponse: jest.fn(job => ({
    id: job.id,
    keyword: job.keyword,
    status: job.status,
    createdAt: job.createdAt,
    results: job.results,
  })),
};

describe('SearchController', () => {
  let controller: SearchController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SearchController],
      providers: [
        {
          provide: SearchService,
          useValue: mockSearchService,
        },
        {
          provide: SearchPresenter,
          useValue: mockSearchPresenter,
        },
      ],
    }).compile();

    controller = module.get<SearchController>(SearchController);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call SearchService.createSearch and return a formatted response', async () => {
      // Arrange
      const createDto: CreateSearchDto = { keyword: 'test', url: 'https://test.com' };
      const createdJob: DomainSearchJob = {
        id: '1',
        keyword: 'test',
        status: SearchStatus.ACTIVE,
        createdAt: new Date(),
        results: []
      };

      mockSearchService.createSearch.mockResolvedValue(createdJob);

      // Act
      const result = await controller.create(createDto);

      // Assert
      expect(mockSearchService.createSearch).toHaveBeenCalledWith(createDto);
      expect(mockSearchPresenter.toResponse).toHaveBeenCalledWith(createdJob);
      expect(result.id).toBe('1');
    });
  });

  describe('findOne', () => {
    it('should call SearchService.findById and return a formatted response', async () => {
      // Arrange
      const jobId = 'test-id';
      const foundJob: DomainSearchJob = {
        id: jobId,
        keyword: 'find-test',
        status: SearchStatus.DONE,
        createdAt: new Date(),
        results: [{ url: 'a', snippet: 'b', foundAt: new Date() }]
      };
      mockSearchService.findById.mockResolvedValue(foundJob);

      // Act
      const result = await controller.findOne(jobId);

      // Assert
      expect(mockSearchService.findById).toHaveBeenCalledWith(jobId);
      expect(mockSearchPresenter.toResponse).toHaveBeenCalledWith(foundJob);
      expect(result.id).toBe(jobId);
    });
  });

  describe('findAll', () => {
    it('should call SearchService.findAll and return a formatted array of responses', async () => {
      // Arrange
      const jobs: DomainSearchJob[] = [
        { id: '1', keyword: 'a', status: SearchStatus.DONE, createdAt: new Date(), results: [] },
        { id: '2', keyword: 'b', status: SearchStatus.ACTIVE, createdAt: new Date(), results: [] },
      ];
      mockSearchService.findAll.mockResolvedValue(jobs);

      // Act
      const result = await controller.findAll();

      // Assert
      expect(mockSearchService.findAll).toHaveBeenCalled();
      expect(mockSearchPresenter.toResponse).toHaveBeenCalledTimes(2);
      expect(result).toHaveLength(2);
      expect(result[0].id).toBe('1');
    });
  });

  describe('remove', () => {
    it('should call SearchService.remove with the correct id', async () => {
      // Arrange
      const jobId = 'id-to-delete';
      mockSearchService.remove.mockResolvedValue(undefined);

      // Act
      await controller.remove(jobId);

      // Assert
      expect(mockSearchService.remove).toHaveBeenCalledWith(jobId);
    });
  });
});