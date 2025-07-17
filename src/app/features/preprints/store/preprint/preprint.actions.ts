import { SearchFilters } from '@shared/models';

export class FetchMyPreprints {
  static readonly type = '[Preprint] Fetch My Preprints';

  constructor(
    public pageNumber: number,
    public pageSize: number,
    public filters: SearchFilters
  ) {}
}

export class FetchPreprintById {
  static readonly type = '[Preprint] Fetch Preprint By Id';

  constructor(public id: string) {}
}
