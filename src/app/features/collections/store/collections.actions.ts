export class GetBookmarksCollectionId {
  static readonly type = '[Collections] Get Bookmarks Collection Id';
}

export class AddProjectToBookmarks {
  static readonly type = '[Collections] Add Project To Bookmarks';

  constructor(
    public bookmarksId: string,
    public projectId: string
  ) {}
}

export class RemoveProjectFromBookmarks {
  static readonly type = '[Collections] Remove Project From Bookmarks';

  constructor(
    public bookmarksId: string,
    public projectId: string
  ) {}
}

export class ClearCollections {
  static readonly type = '[Collections] Clear Collections';
}

export class SetProgramAreaFilters {
  static readonly type = '[Collections] Set Program Area Filters';
  constructor(public programAreaFilters: string[]) {}
}

export class SetCollectedTypeFilters {
  static readonly type = '[Collections] Set Collected Type Filters';
  constructor(public collectedTypeFilters: string[]) {}
}

export class SetStatusFilters {
  static readonly type = '[Collections] Set Status Filters';
  constructor(public statusFilters: string[]) {}
}

export class SetDataTypeFilters {
  static readonly type = '[Collections] Set Data Type Filters';
  constructor(public dataTypeFilters: string[]) {}
}

export class SetDiseaseFilters {
  static readonly type = '[Collections] Set Disease Filters';
  constructor(public diseaseFilters: string[]) {}
}

export class SetGradeLevelsFilters {
  static readonly type = '[Collections] Set Grade Levels Filters';
  constructor(public gradeLevelsFilters: string[]) {}
}

export class SetIssueFilters {
  static readonly type = '[Collections] Set Issue Filters';
  constructor(public issueFilters: string[]) {}
}

export class SetReviewsStateFilters {
  static readonly type = '[Collections] Set Reviews State Filters';
  constructor(public reviewsStateFilters: string[]) {}
}

export class SetSchoolTypeFilters {
  static readonly type = '[Collections] Set School Type Filters';
  constructor(public schoolTypeFilters: string[]) {}
}

export class SetStudyDesignFilters {
  static readonly type = '[Collections] Set Study Design Filters';
  constructor(public studyDesignFilters: string[]) {}
}

export class SetVolumeFilters {
  static readonly type = '[Collections] Set Volume Filters';
  constructor(public volumeFilters: string[]) {}
}
