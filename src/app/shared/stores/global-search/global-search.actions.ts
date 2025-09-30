import { ResourceType } from '@shared/enums';
import { StringOrNull } from '@shared/helpers';
import { FilterOption } from '@shared/models';

export class FetchResources {
  static readonly type = '[GlobalSearch] Fetch Resources';
}

export class FetchResourcesByLink {
  static readonly type = '[GlobalSearch] Fetch Resources By Link';

  constructor(public link: string) {}
}

export class SetResourceType {
  static readonly type = '[GlobalSearch] Set Resource Type';

  constructor(public type: ResourceType) {}
}

export class SetSearchText {
  static readonly type = '[GlobalSearch] Set Search Text';

  constructor(public searchText: StringOrNull) {}
}

export class SetSortBy {
  static readonly type = '[GlobalSearch] Set Sort By';

  constructor(public sortBy: string) {}
}

export class LoadFilterOptions {
  static readonly type = '[GlobalSearch] Load Filter Options';

  constructor(public filterKey: string) {}
}

export class SetDefaultFilterValue {
  static readonly type = '[GlobalSearch] Set Default Filter Value';

  constructor(
    public filterKey: string,
    public value: string
  ) {}
}

export class UpdateSelectedFilterOption {
  static readonly type = '[GlobalSearch] Update Selected Filter Option';

  constructor(
    public filterKey: string,
    public filterOption: FilterOption | null
  ) {}
}

export class LoadFilterOptionsAndSetValues {
  static readonly type = '[GlobalSearch] Load Filter Options And Set Values';

  constructor(public filterValues: Record<string, FilterOption>) {}
}

export class LoadFilterOptionsWithSearch {
  static readonly type = '[GlobalSearch] Load Filter Options With Search';

  constructor(
    public filterKey: string,
    public searchText: string
  ) {}
}

export class ClearFilterSearchResults {
  static readonly type = '[GlobalSearch] Clear Filter Search Results';

  constructor(public filterKey: string) {}
}

export class LoadMoreFilterOptions {
  static readonly type = '[GlobalSearch] Load More Filter Options';

  constructor(public filterKey: string) {}
}

export class ResetSearchState {
  static readonly type = '[GlobalSearch] Reset Search State';
}
