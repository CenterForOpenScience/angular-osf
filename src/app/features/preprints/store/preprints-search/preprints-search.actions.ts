export class GetResources {
  static readonly type = '[Preprints search] Get Resources';
}

export class GetResourcesByLink {
  static readonly type = '[Preprints search] Get Resources By Link';

  constructor(public link: string) {}
}

export class GetResourcesCount {
  static readonly type = '[Preprints search] Get Resources Count';
}

export class SetSearchText {
  static readonly type = '[Preprints search] Set Search Text';

  constructor(public searchText: string) {}
}

export class SetSortBy {
  static readonly type = '[Preprints search] Set SortBy';

  constructor(public sortBy: string) {}
}

export class ResetState {
  static readonly type = '[Preprints search] Reset State';
}
