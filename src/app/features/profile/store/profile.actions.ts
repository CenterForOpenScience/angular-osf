import { ResourceTab } from '@osf/shared/enums/resource-tab.enum';
import { User } from '@osf/shared/models';
import { StringOrNull } from '@shared/helpers';

export class FetchUserProfile {
  static readonly type = '[Profile] Fetch User Profile';

  constructor(public userId: string) {}
}

export class SetUserProfile {
  static readonly type = '[Profile] Set User Profile';

  constructor(public userProfile: User) {}
}

export class FetchResources {
  static readonly type = '[Profile] Fetch Resources';
}

export class FetchResourcesByLink {
  static readonly type = '[Profile] Fetch Resources By Link';

  constructor(public link: string) {}
}

export class SetSortBy {
  static readonly type = '[Profile] Set SortBy';

  constructor(public sortBy: string) {}
}

export class SetResourceType {
  static readonly type = '[Profile] Set Resource Type';

  constructor(public resourceType: ResourceTab) {}
}

export class LoadFilterOptions {
  static readonly type = '[Profile] Load Filter Options';

  constructor(public filterKey: string) {}
}

export class UpdateFilterValue {
  static readonly type = '[Profile] Update Filter Value';

  constructor(
    public filterKey: string,
    public value: StringOrNull
  ) {}
}

export class LoadFilterOptionsAndSetValues {
  static readonly type = '[Profile] Load Filter Options And Set Values';

  constructor(public filterValues: Record<string, StringOrNull>) {}
}

export class LoadFilterOptionsWithSearch {
  static readonly type = '[Profile] Load Filter Options With Search';

  constructor(
    public filterKey: string,
    public searchText: string
  ) {}
}

export class ClearFilterSearchResults {
  static readonly type = '[Profile] Clear Filter Search Results';

  constructor(public filterKey: string) {}
}

export class LoadMoreFilterOptions {
  static readonly type = '[Profile] Load More Filter Options';

  constructor(public filterKey: string) {}
}
