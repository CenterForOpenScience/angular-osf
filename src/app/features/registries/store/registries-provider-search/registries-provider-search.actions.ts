import { ResourceTab } from '@shared/enums';

const stateName = '[Registry Provider Search]';

export class GetRegistryProviderBrand {
  static readonly type = `${stateName}  Get Registry Provider Brand`;

  constructor(public providerName: string) {}
}

export class UpdateResourceType {
  static readonly type = `${stateName} Update Resource Type`;

  constructor(public type: ResourceTab) {}
}

export class FetchResources {
  static readonly type = `${stateName} Fetch Resources`;
}

export class FetchResourcesByLink {
  static readonly type = `${stateName} Fetch Resources By Link`;

  constructor(public link: string) {}
}

export class LoadFilterOptionsAndSetValues {
  static readonly type = `${stateName} Load Filter Options And Set Values`;
  constructor(public filterValues: Record<string, string | null>) {}
}

export class LoadFilterOptions {
  static readonly type = `${stateName} Load Filter Options`;
  constructor(public filterKey: string) {}
}

export class UpdateFilterValue {
  static readonly type = `${stateName} Update Filter Value`;
  constructor(
    public filterKey: string,
    public value: string | null
  ) {}
}

export class SetFilterValues {
  static readonly type = `${stateName} Set Filter Values`;
  constructor(public filterValues: Record<string, string | null>) {}
}

export class UpdateSortBy {
  static readonly type = `${stateName} Update Sort By`;

  constructor(public sortBy: string) {}
}
