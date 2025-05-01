import { MyProjectsSearchFilters } from '@osf/features/my-projects/entities/my-projects-search-filters.models';

export class GetMyProjects {
  static readonly type = '[My Projects] Get Projects';

  constructor(
    public pageNumber: number,
    public pageSize: number,
    public filters: MyProjectsSearchFilters,
  ) {}
}

export class GetMyRegistrations {
  static readonly type = '[My Projects] Get Registrations';

  constructor(
    public pageNumber: number,
    public pageSize: number,
    public filters: MyProjectsSearchFilters,
  ) {}
}

export class GetMyPreprints {
  static readonly type = '[My Projects] Get Preprints';

  constructor(
    public pageNumber: number,
    public pageSize: number,
    public filters: MyProjectsSearchFilters,
  ) {}
}

export class GetMyBookmarks {
  static readonly type = '[My Projects] Get Bookmarks';
  constructor(
    public bookmarksId: string,
    public pageNumber: number,
    public pageSize: number,
    public filters: MyProjectsSearchFilters,
  ) {}
}

export class GetBookmarksCollectionId {
  static readonly type = '[My Projects] Get Bookmarks Collection Id';
}

export class ClearMyProjects {
  static readonly type = '[My Projects] Clear Projects';
}
