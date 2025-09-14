import { Injectable } from '@nestjs/common';
import { SearchResponseDto } from '../dto/search-response.dto';
import { DomainSearchJob } from '../domain/search-job.entity';

@Injectable()
export class SearchPresenter {
  toResponse(job: DomainSearchJob): SearchResponseDto {
    const responseDto = new SearchResponseDto();

    responseDto.id = job.id;
    responseDto.keyword = job.keyword;
    responseDto.status = job.status;
    responseDto.results = job.results;
    responseDto.createdAt = job.createdAt;

    return responseDto;
  }
}