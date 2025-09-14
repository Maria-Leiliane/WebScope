import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import { CreateSearchDto } from '../dto/create-search.dto';
import { SearchPresenter } from '../presenter/search.presenter';
import { SearchResponseDto } from '../dto/search-response.dto';
import { SearchService } from '../service/search.service';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

@Controller('search')
export class SearchController {
  constructor(
    private readonly searchService: SearchService,
    private readonly searchPresenter: SearchPresenter,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create and init a new Search Job' })
  @ApiResponse({ status: 201, description: 'Job created with success.', type: SearchResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid params.' })
  async create(@Body() createSearchDto: CreateSearchDto): Promise<SearchResponseDto> {
    const job = await this.searchService.createSearch(createSearchDto);
    return this.searchPresenter.toResponse(job);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Search a search by ID' })
  @ApiParam({ name: 'id', description: 'Unique ID of Search Job' })
  @ApiResponse({ status: 200, description: 'Job not foud.', type: SearchResponseDto })
  @ApiResponse({ status: 404, description: 'Job not foud.' })
  async findOne(@Param('id') id: string): Promise<SearchResponseDto> {
    const job = await this.searchService.findById(id);
    return this.searchPresenter.toResponse(job);
  }

  @Get()
  @ApiOperation({ summary: 'List all Search Jobs' })
  @ApiResponse({ status: 200, description: 'Search Jobs list.', type: [SearchResponseDto] })
  async findAll(): Promise<SearchResponseDto[]> {
    const jobs = await this.searchService.findAll();
    return jobs.map(job => this.searchPresenter.toResponse(job));
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a Search Job' })
  @ApiParam({ name: 'id', description: 'Unique ID of Search Job' })
  @ApiResponse({ status: 204, description: 'Success delete the Search Job.' })
  @ApiResponse({ status: 404, description: 'Search Job not foud.' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    return this.searchService.remove(id);
  }
}