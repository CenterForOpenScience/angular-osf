export class GetCollectionProvider {
  static readonly type = '[Collections] Get Collection Provider';

  constructor(public collectionName: string) {}
}

export class GetProjectSubmissions {
  static readonly type = '[Collections] Get Project Submissions';

  constructor(public projectId: string) {}
}

export class ClearCollections {
  static readonly type = '[Collections] Clear Collections';
}

export class GetUserCollectionSubmissions {
  static readonly type = '[Collections] Get User Collection Submissions';

  constructor(
    public providerId: string,
    public projectsIds: string[]
  ) {}
}
