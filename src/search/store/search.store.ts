import { SearchStatus } from '../enums/search-status.enum';
import { DomainSearchJob } from '../domain/search-job.entity'; // Importa a fonte da verdade


export interface ISearchJobRepository {
  add(job: DomainSearchJob): Promise<void>;
  get(id: string): Promise<DomainSearchJob | undefined>;
  update(id: string, partial: Partial<DomainSearchJob>): Promise<void>;
  getAll(): Promise<DomainSearchJob[]>;
  findByStatus(status: SearchStatus): Promise<DomainSearchJob[]>;
  remove(id: string): Promise<void>;
  exists(id: string): Promise<boolean>;
  clearAll(): Promise<void>;
}