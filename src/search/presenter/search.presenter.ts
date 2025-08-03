import { Injectable } from '@nestjs/common';
import { SearchResponseDto } from '../dto/search-response.dto';
import { SearchJob } from '../ interfaces/search-job.interface';

@Injectable()
export class SearchPresenter {
  toResponse(job: SearchJob): SearchResponseDto {
    return {
      id: job.id,
      keyword: job.keyword,
      status: job.status,
      results: job.results,
      createdAt: job.createdAt,
    };
  }
}