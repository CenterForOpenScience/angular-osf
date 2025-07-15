import { OsfFile } from '@shared/models';

export class GetRegistryFiles {
  static readonly type = '[Registry Files] Get Registry Files';

  constructor(public filesLink: string) {}
}

export class SetCurrentFolder {
  static readonly type = '[Registry Files] Set Current Folder';

  constructor(public folder: OsfFile | null) {}
}

export class SetSearch {
  static readonly type = '[Registry Files] Set Search';

  constructor(public search: string) {}
}

export class SetSort {
  static readonly type = '[Registry Files] Set Sort';

  constructor(public sort: string) {}
}
