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

export class FetchPreprintFile {
  static readonly type = '[Preprint] Fetch Preprint File';
}

export class FetchPreprintFileVersions {
  static readonly type = '[Preprint] Fetch Preprint File Versions';
}

export class FetchPreprintVersionIds {
  static readonly type = '[Preprint] Fetch Preprint Version Ids';
}

export class ResetState {
  static readonly type = '[Preprint] Reset State';
}
