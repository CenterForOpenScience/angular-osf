import { SearchFilters } from '@osf/shared/models/search-filters.model';

export class FetchMyPreprints {
  static readonly type = '[My Preprints] Fetch My Preprints';

  constructor(
    public pageNumber: number,
    public pageSize: number,
    public filters: SearchFilters
  ) {}
}
