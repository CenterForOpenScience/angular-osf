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
