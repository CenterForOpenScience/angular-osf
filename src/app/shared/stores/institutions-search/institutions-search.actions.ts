import { ResourceTab } from '@shared/enums';

export class FetchInstitutionById {
  static readonly type = '[InstitutionsSearch] Fetch Institution By Id';

  constructor(public institutionId: string) {}
}

export class FetchResources {
  static readonly type = '[Institutions] Fetch Resources';
}

export class FetchResourcesByLink {
  static readonly type = '[Institutions] Fetch Resources By Link';

  constructor(public link: string) {}
}

export class UpdateResourceType {
  static readonly type = '[Institutions] Update Resource Type';

  constructor(public type: ResourceTab) {}
}

export class UpdateSortBy {
  static readonly type = '[Institutions] Update Sort By';

  constructor(public sortBy: string) {}
}

export class LoadFilterOptions {
  static readonly type = '[InstitutionsSearch] Load Filter Options';
  constructor(public filterKey: string) {}
}

export class UpdateFilterValue {
  static readonly type = '[InstitutionsSearch] Update Filter Value';
  constructor(
    public filterKey: string,
    public value: string | null
  ) {}
}

export class SetFilterValues {
  static readonly type = '[InstitutionsSearch] Set Filter Values';
  constructor(public filterValues: Record<string, string | null>) {}
}

export class LoadFilterOptionsAndSetValues {
  static readonly type = '[InstitutionsSearch] Load Filter Options And Set Values';
  constructor(public filterValues: Record<string, string | null>) {}
}
