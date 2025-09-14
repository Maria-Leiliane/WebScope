import { ApiProperty } from '@nestjs/swagger';

export class SearchResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  keyword: string;

  @ApiProperty()
  status: string;

  @ApiProperty({ type: [Object] })
  results: any[];

  @ApiProperty()
  createdAt: Date;
}