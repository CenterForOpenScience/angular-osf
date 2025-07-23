import { CollectionsFilters } from '@shared/models';

export class GetCollectionProvider {
  static readonly type = '[Collections] Get Collection Provider';

  constructor(public collectionName: string) {}
}

export class GetCollectionDetails {
  static readonly type = '[Collections] Get Collection Details';

  constructor(public collectionId: string) {}
}

export class ClearCollections {
  static readonly type = '[Collections] Clear Collections';
}

export class ClearCollectionSubmissions {
  static readonly type = '[Collections] Clear Collection Submissions';
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

export class SetSortBy {
  static readonly type = '[Collections] Set Sort By';

  constructor(public sortValue: string) {}
}

export class SetTotalSubmissions {
  static readonly type = '[Collections] Set Total Submission';

  constructor(public totalCount: number) {}
}

export class SetPageNumber {
  static readonly type = '[Collections] Set Page Number';

  constructor(public page: string) {}
}

export class SetSearchValue {
  static readonly type = '[Collections] Set Search Value';

  constructor(public searchValue: string) {}
}

export class SetAllFilters {
  static readonly type = '[Collections] Set All Filters';

  constructor(public filters: Partial<CollectionsFilters>) {}
}

export class SearchCollectionSubmissions {
  static readonly type = '[Collections] Search Collection Submissions';

  constructor(
    public providerId: string,
    public searchText: string,
    public activeFilters: Record<string, string[]>,
    public page: string,
    public sort: string
  ) {}
}

export class GetUserCollectionSubmissions {
  static readonly type = '[Collections] Get User Collection Submissions';

  constructor(
    public providerId: string,
    public projectsIds: string[]
  ) {}
}
