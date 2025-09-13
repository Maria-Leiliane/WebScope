import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
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

  @Get()
  async findAll(): Promise<SearchResponseDto[]> {
    const jobs = await this.searchService.findAll();
    return jobs.map(job => this.searchPresenter.toResponse(job));
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    return this.searchService.remove(id);
  }
}