import { ResourceType } from '@shared/enums';
import { StringOrNull } from '@shared/helpers';

export class FetchResources {
  static readonly type = '[OsfSearch] Fetch Resources';
}

export class FetchResourcesByLink {
  static readonly type = '[OsfSearch] Fetch Resources By Link';

  constructor(public link: string) {}
}

export class SetResourceType {
  static readonly type = '[OsfSearch] Set Resource Type';

  constructor(public type: ResourceType) {}
}

export class SetSearchText {
  static readonly type = '[OsfSearch] Set Search Text';

  constructor(public searchText: StringOrNull) {}
}

export class SetSortBy {
  static readonly type = '[OsfSearch] Set Sort By';

  constructor(public sortBy: string) {}
}

export class LoadFilterOptions {
  static readonly type = '[OsfSearch] Load Filter Options';

  constructor(public filterKey: string) {}
}

export class SetDefaultFilterValue {
  static readonly type = '[OsfSearch] Set Default Filter Value';

  constructor(
    public filterKey: string,
    public value: string
  ) {}
}

export class UpdateFilterValue {
  static readonly type = '[OsfSearch] Update Filter Value';

  constructor(
    public filterKey: string,
    public value: StringOrNull
  ) {}
}

export class LoadFilterOptionsAndSetValues {
  static readonly type = '[OsfSearch] Load Filter Options And Set Values';

  constructor(public filterValues: Record<string, StringOrNull>) {}
}

export class LoadFilterOptionsWithSearch {
  static readonly type = '[OsfSearch] Load Filter Options With Search';

  constructor(
    public filterKey: string,
    public searchText: string
  ) {}
}

export class ClearFilterSearchResults {
  static readonly type = '[OsfSearch] Clear Filter Search Results';

  constructor(public filterKey: string) {}
}

export class LoadMoreFilterOptions {
  static readonly type = '[OsfSearch] Load More Filter Options';

  constructor(public filterKey: string) {}
}

export class ResetSearchState {
  static readonly type = '[OsfSearch] Reset Search State';
}
