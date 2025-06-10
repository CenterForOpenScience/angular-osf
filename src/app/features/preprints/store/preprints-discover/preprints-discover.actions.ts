export class GetResources {
  static readonly type = '[Preprints Discover] Get Resources';
}

export class GetResourcesByLink {
  static readonly type = '[Preprints Discover] Get Resources By Link';

  constructor(public link: string) {}
}

export class SetSearchText {
  static readonly type = '[Preprints Discover] Set Search Text';

  constructor(public searchText: string) {}
}

export class SetSortBy {
  static readonly type = '[Preprints Discover] Set SortBy';

  constructor(public sortBy: string) {}
}

export class ResetState {
  static readonly type = '[Preprints Discover] Reset State';
}
