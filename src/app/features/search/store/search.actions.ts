import { ResourceTab } from '@osf/shared/enums';
import { StringOrNull } from '@shared/helpers';

export class GetResources {
  static readonly type = '[Search] Get Resources';
}

export class GetResourcesByLink {
  static readonly type = '[Search] Get Resources By Link';

  constructor(public link: string) {}
}

export class SetSearchText {
  static readonly type = '[Search] Set Search Text';

  constructor(public searchText: string) {}
}

export class SetSortBy {
  static readonly type = '[Search] Set SortBy';

  constructor(public sortBy: string) {}
}

export class SetResourceType {
  static readonly type = '[Search] Set Resource Tab';

  constructor(public resourceTab: ResourceTab) {}
}

export class LoadFilterOptions {
  static readonly type = '[Search] Load Filter Options';

  constructor(public filterKey: string) {}
}

export class UpdateFilterValue {
  static readonly type = '[Search] Update Filter Value';

  constructor(
    public filterKey: string,
    public value: StringOrNull
  ) {}
}

export class LoadFilterOptionsAndSetValues {
  static readonly type = '[Search] Load Filter Options And Set Values';

  constructor(public filterValues: Record<string, StringOrNull>) {}
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
