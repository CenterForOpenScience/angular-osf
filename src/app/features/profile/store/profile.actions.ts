import { ResourceTab } from '@osf/shared/enums/resource-tab.enum';

export class GetResources {
  static readonly type = '[My Profile] Get Resources';
}

export class GetResourcesByLink {
  static readonly type = '[My Profile] Get Resources By Link';

  constructor(public link: string) {}
}

export class GetResourcesCount {
  static readonly type = '[My Profile] Get Resources Count';
}

export class SetSearchText {
  static readonly type = '[My Profile] Set Search Text';

  constructor(public searchText: string) {}
}

export class SetSortBy {
  static readonly type = '[My Profile] Set SortBy';

  constructor(public sortBy: string) {}
}

export class SetResourceTab {
  static readonly type = '[My Profile] Set Resource Tab';

  constructor(public resourceTab: ResourceTab) {}
}

export class SetIsMyProfile {
  static readonly type = '[My Profile] Set IsMyProfile';

  constructor(public isMyProfile: boolean) {}
}
