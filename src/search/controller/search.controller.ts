import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateSearchDto } from '../dto/create-search.dto';
import { SearchPresenter } from '../presenter/search.presenter';
import { SearchResponseDto } from '../dto/search-response.dto';
import { SearchService } from '../service/search.service';

@Controller('search')
export class SearchController {
  constructor(
    private readonly searchService: SearchService,
    private readonly searchPresenter: SearchPresenter,
  ) {}

  @Post()
  async create(@Body() createSearchDto: CreateSearchDto): Promise<SearchResponseDto> {
    const job = await this.searchService.createSearch(createSearchDto);
    return this.searchPresenter.toResponse(job);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<SearchResponseDto> {
    const job = await this.searchService.findById(id);
    return this.searchPresenter.toResponse(job);
  }
}