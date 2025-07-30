import { SearchStatus } from '../enums/search-status.enum';
import { SearchResult } from './search-result.interface';

export interface SearchJob {
  id: string;               // Unique search ID (8 characters)
  keyword: string;          // Searched keyword
  status: SearchStatus;     // active | done
  results: SearchResult[];  // Results found
  createdAt: Date;          // Date/time the search was created
}
