import { MyProjectsSearchFilters } from '../models';

export class GetMyProjects {
  static readonly type = '[My Projects] Get Projects';

  constructor(
    public pageNumber: number,
    public pageSize: number,
    public filters: MyProjectsSearchFilters
  ) {}
}

export class GetMyRegistrations {
  static readonly type = '[My Projects] Get Registrations';

  constructor(
    public pageNumber: number,
    public pageSize: number,
    public filters: MyProjectsSearchFilters
  ) {}
}

export class GetMyPreprints {
  static readonly type = '[My Projects] Get Preprints';

  constructor(
    public pageNumber: number,
    public pageSize: number,
    public filters: MyProjectsSearchFilters
  ) {}
}

export class GetMyBookmarks {
  static readonly type = '[My Projects] Get Bookmarks';

  constructor(
    public bookmarksId: string,
    public pageNumber: number,
    public pageSize: number,
    public filters: MyProjectsSearchFilters
  ) {}
}

export class ClearMyProjects {
  static readonly type = '[My Projects] Clear Projects';
}

export class CreateProject {
  static readonly type = '[MyProjects] Create Project';

  constructor(
    public title: string,
    public description: string,
    public templateFrom: string,
    public region: string,
    public affiliations: string[]
  ) {}
}
