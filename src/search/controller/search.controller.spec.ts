import { Test, TestingModule } from '@nestjs/testing';
import { SearchController } from './search.controller';
import { SearchPresenter } from '../presenter/search.presenter';
import { SearchService } from '../service/search.service';

describe('SearchController', () => {
  let controller: SearchController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SearchController],
      providers: [
        {
          provide: SearchService,
          useValue: { createSearch: jest.fn(), findById: jest.fn() },
        },
        {
          provide: SearchPresenter,
          useValue: { toResponse: jest.fn() },
        },
      ],
    }).compile();

    controller = module.get<SearchController>(SearchController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // Add more tests for the create and findOne methods...
});