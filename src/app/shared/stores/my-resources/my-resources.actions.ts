import { ResourceSearchMode } from '@osf/shared/enums/resource-search-mode.enum';
import { MyResourcesSearchFilters } from '@osf/shared/models/my-resources/my-resources-search-filters.models';

export class GetMyProjects {
  static readonly type = '[My Resources] Get Projects';

  constructor(
    public pageNumber: number,
    public pageSize: number,
    public filters: MyResourcesSearchFilters,
    public searchMode?: ResourceSearchMode,
    public rootProjectId?: string
  ) {}
}

export class GetMyRegistrations {
  static readonly type = '[My Resources] Get Registrations';

  constructor(
    public pageNumber: number,
    public pageSize: number,
    public filters: MyResourcesSearchFilters,
    public searchMode?: ResourceSearchMode,
    public rootRegistrationId?: string
  ) {}
}

export class GetMyPreprints {
  static readonly type = '[My Resources] Get Preprints';

  constructor(
    public pageNumber: number,
    public pageSize: number,
    public filters: MyResourcesSearchFilters
  ) {}
}

export class ClearMyResources {
  static readonly type = '[My Resources] Clear My Resources';
}

export class CreateProject {
  static readonly type = '[My Resources] Create Project';

  constructor(
    public title: string,
    public description: string,
    public templateFrom: string,
    public region: string,
    public affiliations: string[]
  ) {}
}
