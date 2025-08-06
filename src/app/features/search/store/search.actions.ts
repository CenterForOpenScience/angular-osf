import { ResourceTab } from '@osf/shared/enums';
import { SelectOption } from '@osf/shared/models';

export class GetResources {
  static readonly type = '[Search] Get Resources';
}

export class GetResourcesByLink {
  static readonly type = '[Search] Get Resources By Link';

  constructor(public link: string) {}
}

export class GetResourcesCount {
  static readonly type = '[Search] Get Resources Count';
}

export class SetSearchText {
  static readonly type = '[Search] Set Search Text';

  constructor(public searchText: string) {}
}

export class SetSortBy {
  static readonly type = '[Search] Set SortBy';

  constructor(public sortBy: string) {}
}

export class SetResourceTab {
  static readonly type = '[Search] Set Resource Tab';

  constructor(public resourceTab: ResourceTab) {}
}

export class SetIsMyProfile {
  static readonly type = '[Search] Set IsMyProfile';

  constructor(public isMyProfile: boolean) {}
}

export class ResetSearchState {
  static readonly type = '[Search] Reset State';
}

export class LoadFilterOptions {
  static readonly type = '[Search] Load Filter Options';
  constructor(public filterKey: string) {}
}

export class UpdateFilterValue {
  static readonly type = '[Search] Update Filter Value';
  constructor(
    public filterKey: string,
    public value: string | null
  ) {}
}

export class SetFilterValues {
  static readonly type = '[Search] Set Filter Values';
  constructor(public filterValues: Record<string, string | null>) {}
}

export class LoadFilterOptionsAndSetValues {
  static readonly type = '[Search] Load Filter Options And Set Values';
  constructor(public filterValues: Record<string, string | null>) {}
}

export class LoadFilterOptionsWithSearch {
  static readonly type = '[Search] Load Filter Options With Search';
  constructor(
    public filterKey: string,
    public searchText: string
  ) {}
}

export class ClearFilterSearchResults {
  static readonly type = '[Search] Clear Filter Search Results';
  constructor(public filterKey: string) {}
}

export class LoadMoreFilterOptions {
  static readonly type = '[Search] Load More Filter Options';
  constructor(public filterKey: string) {}
}

export class SetFilterOptionsFromUrl {
  static readonly type = '[Search] Set Filter Options From URL';
  constructor(public filterOptions: Record<string, SelectOption[]>) {}
}
