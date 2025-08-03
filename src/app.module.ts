import { Module } from '@nestjs/common';
import { SearchController } from './search/controller/search.controller';
import { SearchService } from './search/service/search.service';
import { InMemorySearchJobRepository, SearchStoreService } from './search/store/search.store';
import { SearchPresenter } from './search/presenter/search.presenter';


@Module({
  imports: [],
  controllers: [SearchController],
  providers: [SearchService, SearchStoreService,  SearchPresenter,
    {
      provide: 'SearchJobRepository',           // custom token used in @Inject()
      useClass: InMemorySearchJobRepository,        // interface concrete implementation
    },
  ],
  exports: [SearchService]
})
export class AppModule {}
