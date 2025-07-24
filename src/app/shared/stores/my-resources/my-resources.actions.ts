import { ResourceSearchMode, ResourceType } from '@shared/enums';

import { MyResourcesSearchFilters } from 'src/app/shared/models/my-resources';

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

export class GetMyBookmarks {
  static readonly type = '[My Resources] Get Bookmarks';

  constructor(
    public bookmarksId: string,
    public pageNumber: number,
    public pageSize: number,
    public filters: MyResourcesSearchFilters,
    public resourceType: ResourceType
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
