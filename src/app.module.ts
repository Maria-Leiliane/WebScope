import { Module } from '@nestjs/common';
import { SearchController } from './search/controller/search.controller';
import { SearchService } from './search/service/search.service';
import { SearchPresenter } from './search/presenter/search.presenter';
import { PrismaService } from './prisma/prisma.service';
import { SEARCH_JOB_REPOSITORY } from './search/store/search.tokens';
import { PostgresSearchJobRepository } from './search/store/postgres.repository';
import { CrawlerModule } from './crawler/crawler.module';
import { CrawlerService } from './crawler/crawler.service';
import { redisStore } from 'cache-manager-redis-store';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    CacheModule.register({
      isGlobal: true,
      store: () => redisStore({
        socket: {
          host: 'localhost',
          port: 6379,
        },
        ttl: 3600,
      }),
    }),
    CrawlerModule,
  ],
  controllers: [SearchController],
  providers: [
    SearchService,
    SearchPresenter,
    CrawlerService,
    PrismaService,
    {
      provide: SEARCH_JOB_REPOSITORY,
      useClass: PostgresSearchJobRepository,
    },
  ],
  exports: [SearchService, CrawlerService],
})
export class AppModule {}
