import { SearchStatus } from '../enums/search-status.enum';

export interface DomainSearchResult {
  url: string;
  snippet: string;
  foundAt: Date;
}

export interface DomainSearchJob {
  id: string;
  keyword: string;
  status: SearchStatus;
  createdAt: Date;
  results: DomainSearchResult[];
}
