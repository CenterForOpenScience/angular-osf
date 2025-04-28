import { ResourceTab } from '@osf/features/search/models/resource-tab.enum';

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
