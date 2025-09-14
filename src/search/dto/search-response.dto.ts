import { ApiProperty } from '@nestjs/swagger';
import { DomainSearchResult } from '../domain/search-job.entity';
import { SearchStatus } from '../enums/search-status.enum';

export class SearchResponseDto {
  @ApiProperty({ description: 'The unique ID of the search job.' })
  id: string;

  @ApiProperty({ description: 'The keyword that was searched for.' })
  keyword: string;

  @ApiProperty({
    description: 'The current status of the job.',
    enum: SearchStatus,
  })
  status: SearchStatus;

  @ApiProperty({ description: 'The list of results found.' })
  results: DomainSearchResult[];

  @ApiProperty({ description: 'The date and time the job was created.' })
  createdAt: Date;
}