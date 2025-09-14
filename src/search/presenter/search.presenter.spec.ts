import { Test, TestingModule } from '@nestjs/testing';
import { SearchPresenter } from './search.presenter';
import { DomainSearchJob } from '../domain/search-job.entity';
import { SearchStatus } from '../enums/search-status.enum';
import { SearchResponseDto } from '../dto/search-response.dto';

describe('SearchPresenter', () => {
  let presenter: SearchPresenter;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SearchPresenter],
    }).compile();

    presenter = module.get<SearchPresenter>(SearchPresenter);
  });

  it('should be defined', () => {
    expect(presenter).toBeDefined();
  });

  describe('toResponse', () => {
    it('should correctly map a DomainSearchJob to a SearchResponseDto', () => {
      // Arrange
      const now = new Date();
      const job: DomainSearchJob = {
        id: 'test-id',
        keyword: 'nestjs',
        status: SearchStatus.DONE,
        createdAt: now,
        results: [
          {
            url: 'https://nestjs.com',
            snippet: 'A progressive Node.js framework.',
            foundAt: now,
          },
        ],
      };

      // Act
      const dto = presenter.toResponse(job);

      // Assert
      expect(dto).toBeInstanceOf(SearchResponseDto);
      expect(dto.id).toBe('test-id');
      expect(dto.keyword).toBe('nestjs');
      expect(dto.status).toBe(SearchStatus.DONE);
      expect(dto.createdAt).toBe(now);
      expect(dto.results).toHaveLength(1);
      expect(dto.results[0].url).toBe('https://nestjs.com');
    });
  });
});